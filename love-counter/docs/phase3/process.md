# フェーズ3 - LINE連携機能 実装ガイド

## 🔗 目標
メッセージの回答をLINEで受け取れるようにする

## 📋 実装予定機能
- メッセージ入力フォームの追加
- LINE Messaging APIとの連携
- LINEボットの作成
- グループチャットへのメッセージ送信機能
- サーバーサイドの実装（Vercel Serverless Functions）

## 🛠 技術構成
- **フロントエンド**: HTML, CSS, JavaScript
- **バックエンド**: Vercel Serverless Functions (Node.js)
- **API**: LINE Messaging API
- **ホスティング**: Vercel

## 📚 学べること
- API連携の実装
- 非同期通信（fetch, async/await）
- Serverless Functionsの基礎
- 環境変数の管理とセキュリティ
- Webhookの仕組み
- CORS（オリジン間リソース共有）
- クラウドサービスへのデプロイ

---

## ステップ1: LINE Developersアカウント・チャネル作成

### 1-1. LINE Developersにログイン

**目的**: LINE Messaging APIを使うためのアカウントを作成する

1. [LINE Developers](https://developers.line.biz/ja/) にアクセス
2. 普段使っているLINEアカウントでログイン
3. 「コンソール」にアクセス

**補足**: LINE Developersコンソールは、LINEボットを作成・管理する場所です。

---

### 1-2. プロバイダーの作成

**目的**: 開発者（あなた）を識別するためのプロバイダーを作成

1. 「作成」ボタンをクリック
2. プロバイダー名を入力
   - 例: `Love Counter App`
   - 例: `自分の名前`
3. 作成完了

**プロバイダーとは？**
- 開発者や企業を識別するためのグループ
- 1つのプロバイダーの下に複数のボット（チャネル）を作成できる

---

### 1-3. Messaging APIチャネルの作成

**目的**: 実際にメッセージを送受信するLINEボットを作成

1. 作成したプロバイダーを選択
2. 「Messaging API」を選択
3. 必須項目を入力：
   - **チャネル名**: `私のこと好き？ボット`
   - **チャネル説明**: `メッセージを送信できるボット`
   - **大業種**: 個人（または適切なもの）
   - **小業種**: 個人（その他）
   - **メールアドレス**: あなたのメールアドレス
4. 利用規約に同意して「作成」

**チャネルとは？**
- 1つのLINEボット = 1つのチャネル
- ユーザーはこのボットを「友達追加」してメッセージをやり取りできる

---

### 1-4. 必要な情報を取得

**目的**: バックエンドからLINE APIにアクセスするための認証情報を取得

作成したチャネルの設定画面から、以下の情報をメモしておく：

#### 1. チャネルID
- 場所: 「チャネル基本設定」タブ
- 例: `2008631537`
- 用途: チャネルを識別するための番号

#### 2. チャネルシークレット
- 場所: 「チャネル基本設定」タブ
- 例: `db309d4c9b83a1b0dc274401ab982146`
- 用途: Webhookの署名検証（LINEからの通知が本物か確認）

#### 3. チャネルアクセストークン（長期）
- 場所: 「Messaging API設定」タブ
- **発行方法**: 「チャネルアクセストークン」の「発行」ボタンをクリック
- 例: `7ULCr0ROp87Z7urHIvw/kCH...（長い文字列）`
- 用途: LINE APIにアクセスするための認証トークン
- **注意**: このトークンは誰にも見せないこと！

#### 4. ユーザーID（送信先）
- **取得方法**:
  1. 作成したボットを友達追加
  2. ボットにメッセージを送る
  3. Webhook（後で実装）のログからユーザーIDを確認
- または: [LINE Official Account Manager](https://manager.line.biz/) から確認

**⚠️ セキュリティ重要ポイント**
- これらの情報は**絶対にGitにコミットしない**
- `.env.local`ファイルに保存する（`.gitignore`に含まれている）
- 他人に共有しない

---

## ステップ2: バックエンド環境の準備 ✅

### 2-1. プロジェクト構成（完成形）

```
love-counter/
├── index.html              # フロントエンド
├── script.js               # JavaScript
├── api/                    # バックエンド（Serverless Functions）
│   ├── send-message.js     # LINE送信API
│   └── webhook.js          # Webhook受信API
├── .env.local              # 環境変数（Gitignore）
├── package.json            # 依存パッケージ定義
└── vercel.json             # Vercel設定
```

**Serverless Functionsとは？**
- サーバーを管理しなくてもバックエンドコードを実行できる仕組み
- Vercelが自動的に`api/`ディレクトリ内のファイルをAPIエンドポイントとして公開
- 例: `api/send-message.js` → `https://あなたのドメイン/api/send-message`

---

### 2-2. 必要なパッケージ（package.json）✅

```json
{
  "name": "love-counter-app",
  "version": "1.0.0",
  "description": "Love Counter with LINE Messaging API integration",
  "dependencies": {
    "@line/bot-sdk": "^7.6.0",
    "axios": "^1.6.0"
  }
}
```

**パッケージの役割**
- `@line/bot-sdk`: LINE Messaging APIを簡単に使うためのライブラリ
- `axios`: HTTP通信を行うライブラリ（今回は使用しないが将来の拡張用）

**インストール方法**
```bash
cd love-counter
npm install
```

---

### 2-3. バックエンドAPI実装 ✅

#### api/send-message.js（LINE送信API）

**役割**: フロントエンドから受け取ったメッセージをLINEに送信する

**主な機能**
1. CORSヘッダーの設定（異なるドメインからのアクセスを許可）
2. プリフライトリクエスト（OPTIONS）への対応
3. POSTメソッドのみ受け付ける
4. メッセージの検証（空文字チェック）
5. 環境変数の確認
6. LINE APIでメッセージを送信
7. エラーハンドリング

**詳細は `api/send-message.js` のコメントを参照**

**学習ポイント**
- **CORS**: 異なるドメイン間でデータをやり取りするための仕組み
- **プリフライト**: ブラウザが本番リクエストの前に送る確認リクエスト
- **pushMessage**: ユーザーに対してメッセージを「プッシュ配信」する
- **HTTPステータスコード**: 200 (成功), 400 (不正なリクエスト), 405 (許可されていないメソッド), 500 (サーバーエラー)

---

#### api/webhook.js（Webhook受信API）

**役割**: LINEからのイベント通知を受信して処理する

**Webhookとは？**
- LINEサーバーから「何かイベントが発生したよ！」と通知されるURL
- 例: ユーザーがメッセージを送った、ボットを友達追加した、など

**主な機能**
1. POSTメソッドのみ受け付ける
2. LINEからのイベントを取得
3. イベントの種類ごとに処理を振り分け
   - **メッセージイベント**: エコー返信（オウム返し）
   - **フォローイベント**: ウェルカムメッセージ送信
   - **アンフォローイベント**: ログ記録
4. 成功レスポンスを返す（200 OK）

**詳細は `api/webhook.js` のコメントを参照**

**学習ポイント**
- **Webhook**: サーバー間の通知の仕組み
- **replyMessage**: ユーザーのメッセージに「返信」する（pushMessageとの違い）
- **replyToken**: 1回しか使えない一時的なトークン
- **イベントの種類**: message, follow, unfollow, postback, beacon など

---

### 2-4. Vercel設定（vercel.json）✅

**役割**: Vercelでのデプロイ時の動作を制御

```json
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
        }
      ]
    }
  ]
}
```

**各設定の詳細は `vercel-config-guide.md` を参照**

**主な設定**
1. **functions**: メモリとタイムアウトの設定
2. **rewrites**: URLリライト（`/api/send-message`で`.js`を省略）
3. **headers**: CORS対応

---

## ステップ3: フロントエンド実装

### 3-1. UIの追加

**目的**: ユーザーがメッセージを入力してLINEに送信できるUIを作る

`index.html` に以下を追加：

```html
<!-- ========================================
     メッセージ入力セクション
     ======================================== -->
<!--
  このセクションは、ユーザーがメッセージを入力して
  LINEに送信するための入力フォームです。

  初期状態では非表示（display: none）にしておき、
  ボタンをクリックした時などに表示させます。
-->
<div class="reply-section" id="replySection" style="display: none;">

  <!-- テキストエリア（複数行のテキスト入力） -->
  <textarea
    id="replyInput"
    placeholder="返信を入力..."
    rows="4"
    maxlength="500"
  ></textarea>

  <!-- 送信ボタン -->
  <button id="sendButton" class="send-button">
    LINEに送信
  </button>

  <!-- キャンセルボタン（オプション） -->
  <button id="cancelButton" class="cancel-button">
    キャンセル
  </button>

</div>
```

**CSS（スタイル）の追加例**

```css
/* メッセージ入力セクション */
.reply-section {
  margin-top: 32px;
  padding: 24px;
  background: #FFF5F0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* テキストエリア */
.reply-section textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #E8D5C4;
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.reply-section textarea:focus {
  outline: none;
  border-color: #D46A6A;
}

/* 送信ボタン */
.send-button {
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  background: #D46A6A;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover {
  background: #C15D5D;
  transform: translateY(-2px);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* キャンセルボタン */
.cancel-button {
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  background: transparent;
  color: #666;
  border: 2px solid #E8D5C4;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
}
```

---

### 3-2. JavaScript実装（詳細版）

`script.js` に以下を追加：

```javascript
// ========================================
// LINE送信機能
// ========================================

/**
 * LINEにメッセージを送信する関数
 *
 * @param {string} message - 送信するメッセージ
 * @returns {Promise<boolean>} - 送信成功/失敗
 *
 * 【処理の流れ】
 * 1. メッセージの検証（空文字チェック）
 * 2. バックエンドAPI（/api/send-message）にPOSTリクエスト
 * 3. レスポンスの確認
 * 4. 成功/失敗のメッセージ表示
 */
async function sendToLine(message) {
  // ---------------------------------
  // ステップ1: メッセージの検証
  // ---------------------------------
  // 空文字やスペースのみの場合は送信しない
  if (!message || message.trim() === '') {
    alert('メッセージを入力してください');
    return false;
  }

  // ---------------------------------
  // ステップ2: 送信ボタンを無効化（二重送信防止）
  // ---------------------------------
  const sendButton = document.getElementById('sendButton');
  const originalText = sendButton.textContent;
  sendButton.disabled = true;
  sendButton.textContent = '送信中...';

  try {
    // ---------------------------------
    // ステップ3: バックエンドAPIを呼び出し
    // ---------------------------------
    // fetch = JavaScriptでHTTPリクエストを送る関数
    const response = await fetch('/api/send-message', {
      method: 'POST',              // POSTメソッド（データを送信）
      headers: {
        'Content-Type': 'application/json',  // JSON形式で送る
      },
      body: JSON.stringify({       // JavaScriptオブジェクトをJSON文字列に変換
        message: message
      })
    });

    // ---------------------------------
    // ステップ4: レスポンスの確認
    // ---------------------------------
    // response.ok = ステータスコードが200〜299の場合true
    if (response.ok) {
      // 成功した場合
      const data = await response.json();  // レスポンスをJSONとして取得
      console.log('送信成功:', data);

      alert('✅ LINEに送信しました！');

      // 入力フォームをクリア
      document.getElementById('replyInput').value = '';

      // 入力セクションを非表示
      document.getElementById('replySection').style.display = 'none';

      return true;
    } else {
      // 失敗した場合
      const errorData = await response.json();
      console.error('送信失敗:', errorData);

      alert('❌ 送信に失敗しました。もう一度お試しください。');

      return false;
    }
  } catch (error) {
    // ---------------------------------
    // ステップ5: エラーハンドリング
    // ---------------------------------
    // ネットワークエラーなど、fetchが失敗した場合
    console.error('通信エラー:', error);

    alert('❌ 通信エラーが発生しました。\nインターネット接続を確認してください。');

    return false;
  } finally {
    // ---------------------------------
    // ステップ6: 送信ボタンを元に戻す
    // ---------------------------------
    // finally = 成功/失敗に関わらず必ず実行される
    sendButton.disabled = false;
    sendButton.textContent = originalText;
  }
}

// ========================================
// イベントリスナーの設定
// ========================================

/**
 * 送信ボタンのクリックイベント
 */
document.getElementById('sendButton').addEventListener('click', function() {
  const replyText = document.getElementById('replyInput').value;
  sendToLine(replyText);
});

/**
 * キャンセルボタンのクリックイベント
 */
document.getElementById('cancelButton').addEventListener('click', function() {
  // 入力フォームをクリア
  document.getElementById('replyInput').value = '';

  // 入力セクションを非表示
  document.getElementById('replySection').style.display = 'none';
});

/**
 * テキストエリアでEnter + Ctrlキーを押した時に送信
 */
document.getElementById('replyInput').addEventListener('keydown', function(event) {
  // Ctrl + Enter または Cmd + Enter で送信
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    const replyText = this.value;
    sendToLine(replyText);
  }
});

// ========================================
// 入力セクションの表示/非表示制御
// ========================================

/**
 * 特定のボタンをクリックした時に入力セクションを表示
 * 例: りんごボタンをクリックした後に表示する場合
 */
function showReplySection() {
  const replySection = document.getElementById('replySection');
  replySection.style.display = 'block';

  // テキストエリアにフォーカス
  document.getElementById('replyInput').focus();
}

// 既存のボタンのクリックイベントに追加
// document.getElementById('your-button').addEventListener('click', showReplySection);
```

**学習ポイント**

1. **async/await**
   - 非同期処理を同期的に書ける構文
   - `await`を使うと、Promiseの結果が返ってくるまで待つ

2. **fetch API**
   - JavaScriptでHTTPリクエストを送る標準的な方法
   - `method`: GET, POST, PUT, DELETEなど
   - `headers`: リクエストヘッダー（Content-Typeなど）
   - `body`: 送信するデータ

3. **JSON.stringify()**
   - JavaScriptオブジェクトをJSON文字列に変換
   - 例: `{message: "こんにちは"}` → `'{"message":"こんにちは"}'`

4. **try-catch-finally**
   - `try`: 処理を試みる
   - `catch`: エラーが発生した時の処理
   - `finally`: 成功/失敗に関わらず必ず実行

5. **disabled属性**
   - ボタンを無効化して二重送信を防ぐ

---

## ステップ4: 環境変数の設定

### 4-1. ローカル環境（.env.local）

**目的**: 開発環境で使う機密情報を安全に管理する

`love-counter/.env.local` ファイルを作成：

```bash
# ========================================
# LINE Messaging API設定
# ========================================

# チャネルアクセストークン
# 用途: LINE APIにアクセスするための認証トークン
# 取得場所: LINE Developers > Messaging API設定
LINE_CHANNEL_ACCESS_TOKEN=ここにあなたのアクセストークンを貼り付け

# チャネルシークレット
# 用途: Webhookの署名検証（LINEからの通知が本物か確認）
# 取得場所: LINE Developers > チャネル基本設定
LINE_CHANNEL_SECRET=ここにあなたのチャネルシークレットを貼り付け

# 送信先ユーザーID
# 用途: メッセージを送る相手のLINE User ID
# 取得方法: ボットにメッセージを送ってWebhookログから確認
LINE_USER_ID=ここにあなたのユーザーIDを貼り付け

# ========================================
# 重要な注意事項
# ========================================
# ⚠️ このファイルは絶対にGitにコミットしないこと！
# ⚠️ .gitignoreに.env.localが含まれていることを確認
# ⚠️ 他人に共有しない
# ⚠️ GitHubなどに公開しない
```

**環境変数とは？**
- プログラムの外部から与える設定値
- 機密情報（トークン、パスワードなど）をコードに直接書かない
- 環境（ローカル、本番など）ごとに異なる値を設定できる

**なぜ.env.localを使う？**
- セキュリティ: トークンをコードに書くと、GitHubに公開された時に漏洩する
- 柔軟性: 開発環境と本番環境で異なる設定を使える

---

### 4-2. Vercelの環境変数設定

**目的**: 本番環境（Vercel）で使う環境変数を設定する

#### 設定手順

1. **Vercelダッシュボードにアクセス**
   - [Vercel Dashboard](https://vercel.com/dashboard)

2. **プロジェクトを選択**
   - デプロイ済みのlove-counterプロジェクトをクリック

3. **Settings → Environment Variables**
   - 左サイドバーから「Settings」
   - 「Environment Variables」をクリック

4. **環境変数を追加**

   | 変数名 | 値 | 環境 |
   |--------|-----|------|
   | `LINE_CHANNEL_ACCESS_TOKEN` | あなたのアクセストークン | Production, Preview, Development |
   | `LINE_CHANNEL_SECRET` | あなたのチャネルシークレット | Production, Preview, Development |
   | `LINE_USER_ID` | あなたのユーザーID | Production, Preview, Development |

5. **Save**をクリック

6. **再デプロイ**
   - 環境変数を変更したら、プロジェクトを再デプロイする必要がある
   - Deployments → 最新のデプロイ → ⋯ → Redeploy

**環境の種類**
- **Production**: 本番環境（mainブランチ）
- **Preview**: プレビュー環境（プルリクエスト）
- **Development**: 開発環境（vercel devコマンド）

---

## ステップ5: Webhook URLの設定

### 5-1. Webhook URLを取得

**目的**: LINEからのイベント通知を受け取るURLを設定する

1. **Vercelにデプロイ**
   ```bash
   git add .
   git commit -m "feat: LINE連携機能を追加"
   git push origin main
   ```

2. **デプロイURLを確認**
   - Vercelダッシュボードで確認
   - 例: `https://love-counter.vercel.app`

3. **Webhook URLを確認（メモする）**
   - Webhook URL = `https://https://love-counter-theta.vercel.app//api/webhook`
   - **重要**: Vercelには何も設定不要
   - `api/webhook.js`ファイルがあれば、Vercelが自動で`/api/webhook`エンドポイントを作成
   - このURLを次のステップ（5-2）でLINE Developersに設定する

**補足: 複数アプリで1つのWebhook URLを共有する場合**
- counterapp-collection全体で1つのLINE公式アカウントを使う場合
- Webhook URL: `https://counterapp-collection.vercel.app/api/webhook`
- 詳細は [仕様書 - 複数アプリ管理のアーキテクチャ](./spec.md#複数アプリ管理のアーキテクチャ) を参照

---

### 5-2. LINE DevelopersでWebhook URLを設定

1. **LINE Developers Console**にアクセス
2. 作成したチャネルを選択
3. **Messaging API設定**タブ
4. **Webhook URL**の欄に入力
   - 例: `https://love-counter.vercel.app/api/webhook`
5. **Webhookの利用**を「オン」にする
6. **検証**ボタンをクリック
   - 「成功」と表示されればOK

**応答メッセージの設定**
- 「応答メッセージ」を「オフ」にする
- 理由: 自動応答メッセージと重複するのを防ぐ

---

## ステップ6: デプロイとテスト

### 6-1. デプロイ

**準備確認**
- [ ] 環境変数を設定した（Vercel）
- [ ] Webhook URLを設定した（LINE Developers）
- [ ] コードに機密情報が含まれていない

**デプロイコマンド**
```bash
# 変更をステージング
git add .

# コミット
git commit -m "feat: フェーズ3 LINE連携機能を実装"

# プッシュ（Vercelが自動デプロイ）
git push origin main
```

**デプロイ確認**
1. Vercelダッシュボードで「Deployments」を確認
2. 最新のデプロイが「Ready」になっていることを確認
3. デプロイURLにアクセスして動作確認

---

### 6-2. テスト手順

#### テスト1: LINEボットの友達追加
1. LINE Developersの「Messaging API設定」タブ
2. QRコードをスキャンして友達追加
3. ウェルカムメッセージが届くことを確認

#### テスト2: エコー返信
1. ボットに「こんにちは」と送信
2. 「受け取りました: こんにちは」と返信されることを確認

#### テスト3: フロントエンドからメッセージ送信
1. デプロイされたURLにアクセス
   - 例: `https://love-counter.vercel.app`
2. りんごボタンをクリック
3. メッセージ入力フォームが表示される（実装次第）
4. メッセージを入力
5. 「LINEに送信」ボタンをクリック
6. LINEアプリを確認
7. メッセージが届いていることを確認

**期待される結果**
- ✅ 「LINEに送信しました！」というアラートが表示される
- ✅ LINEアプリにメッセージが届く
- ✅ コンソールにエラーが表示されない

---

### 6-3. デバッグ方法

#### Vercelのログを確認

1. Vercelダッシュボード → プロジェクト
2. **Deployments** → 最新のデプロイをクリック
3. **Functions** タブ
4. `api/send-message` または `api/webhook` をクリック
5. **Logs** でエラーを確認

**よく見るログ**
- `Message sent successfully:` → 送信成功
- `Error sending message:` → 送信失敗
- `LINE API Error Response:` → LINE APIのエラー

#### ブラウザの開発者ツール

1. ブラウザで F12 キーを押す
2. **Console** タブでJavaScriptのエラーを確認
3. **Network** タブでHTTPリクエストを確認
   - `/api/send-message` のリクエスト/レスポンスを確認
   - ステータスコード: 200 (成功), 400/500 (エラー)

---

## ステップ7: トラブルシューティング

### エラー1: 401 Unauthorized

**症状**
```
Error: 401 Unauthorized
```

**原因**
- チャネルアクセストークンが間違っている
- トークンの有効期限が切れている

**対処法**
1. LINE Developersでトークンを再確認
2. Vercelの環境変数を確認
3. トークンを再発行
4. Vercelで環境変数を更新
5. 再デプロイ

---

### エラー2: 400 Bad Request

**症状**
```
Error: 400 Bad Request
The property, 'to', in the request body is invalid
```

**原因**
- `LINE_USER_ID` が間違っている
- ユーザーIDの形式が不正

**対処法**
1. ボットにメッセージを送る
2. WebhookのログでユーザーIDを確認
   ```javascript
   console.log('User ID:', event.source.userId);
   ```
3. 正しいユーザーIDを環境変数に設定

---

### エラー3: CORS Error

**症状**
```
Access to fetch at '...' has been blocked by CORS policy
```

**原因**
- CORSヘッダーが正しく設定されていない

**対処法**
1. `vercel.json` のCORS設定を確認
2. `api/send-message.js` のCORSヘッダーを確認
   ```javascript
   res.setHeader('Access-Control-Allow-Origin', '*');
   ```
3. 再デプロイ

---

### エラー4: メッセージが届かない

**症状**
- 送信成功のメッセージは出るが、LINEにメッセージが届かない

**原因**
- ボットと友達になっていない
- ボットをブロックしている

**対処法**
1. LINEアプリでボットを友達追加
2. ブロックを解除
3. 再度テスト

---

### エラー5: Webhook検証失敗

**症状**
```
LINE Developers: Webhook検証に失敗しました
```

**原因**
- Webhook URLが間違っている
- APIがデプロイされていない
- チャネルシークレットが間違っている

**対処法**
1. Webhook URLを確認
   - 正: `https://love-counter.vercel.app/api/webhook`
   - 誤: `https://love-counter.vercel.app/webhook`
2. デプロイが完了していることを確認
3. 環境変数を確認

---

### エラー6: 環境変数が読み込まれない

**症状**
```
Error: LINE_CHANNEL_ACCESS_TOKEN is not set
```

**原因**
- Vercelで環境変数が設定されていない
- デプロイ前に設定した

**対処法**
1. Vercel → Settings → Environment Variables で確認
2. 環境変数を追加/更新
3. **再デプロイ**（重要！）
   - 環境変数を変更しただけでは反映されない
   - Deployments → Redeploy

---

## ステップ8: 完成チェックリスト

### 実装前
- [x] LINE Developersアカウント作成
- [x] Messaging APIチャネル作成
- [x] チャネルアクセストークン取得
- [ ] ユーザーIDの取得

### 実装中
- [x] フロントエンドのUI追加
- [x] JavaScriptでAPI呼び出し実装
- [x] バックエンドAPI実装（send-message.js, webhook.js）
- [x] 環境変数の設定（.env.local）
- [x] vercel.json作成

### デプロイ
- [ ] Vercelに環境変数を設定
- [ ] GitHubにプッシュ
- [ ] Vercelで自動デプロイ
- [ ] Webhook URLを設定（LINE Developers）

### テスト
- [ ] ボットの友達追加
- [ ] ウェルカムメッセージの確認
- [ ] エコー返信の確認
- [ ] フロントエンドからメッセージ送信
- [ ] LINEでメッセージ受信確認
- [ ] エラーハンドリング確認

### 完了後
- [ ] ドキュメント更新
- [ ] 学習ノートに記録
- [ ] phase3ブランチ作成（オプション）

---

## 参考リソース

### 公式ドキュメント
- [LINE Messaging API ドキュメント](https://developers.line.biz/ja/docs/messaging-api/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [@line/bot-sdk GitHub](https://github.com/line/line-bot-sdk-nodejs)

### 学習リソース
- [MDN Web Docs - fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API)
- [MDN Web Docs - async/await](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN Web Docs - CORS](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)

### プロジェクト内のドキュメント
- `api/send-message.js` - 詳細なコメント付き実装
- `api/webhook.js` - 詳細なコメント付き実装
- `vercel-config-guide.md` - Vercel設定の詳細解説

---

## 学習のポイント

### 技術的に理解すべきこと

1. **API連携**
   - RESTful APIの基本
   - HTTPメソッド（GET, POST）
   - リクエスト/レスポンスの構造

2. **非同期処理**
   - Promise
   - async/await
   - エラーハンドリング（try-catch）

3. **Serverless Functions**
   - サーバーレスアーキテクチャ
   - Vercelでの実装方法
   - メモリとタイムアウトの設定

4. **セキュリティ**
   - 環境変数の管理
   - CORSの理解
   - トークン認証

5. **Webhook**
   - プッシュ型通知の仕組み
   - イベント駆動型アーキテクチャ

### 次のステップ

1. **機能拡張**
   - 画像送信機能
   - スタンプ送信機能
   - リッチメッセージ（ボタン付き）
   - グループチャット対応

2. **UI/UX改善**
   - 送信履歴の表示
   - ローディングアニメーション
   - エラーメッセージの改善

3. **データ管理**
   - データベースの導入（Vercel KV, Supabase）
   - メッセージ履歴の保存
   - ユーザー管理

---

**頑張りましょう！🚀**
