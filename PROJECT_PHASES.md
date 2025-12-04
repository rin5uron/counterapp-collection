# プロジェクトフェーズ計画

## 📱 プロジェクト概要
JavaScriptの学習を目的とした、インタラクティブなメッセージボタンアプリ

---

## 🎯 フェーズ1
- 基本機能の確立 ✅
- [📄 完成URL（Phase1）](https://love-counter-git-phase1-rs-projects-9c94598c.vercel.app/)

### 完成した機能
- ✅ ボタンクリックでランダムメッセージ表示
- ✅ カウント機能（好き度%表示）
- ✅ 22回ごとの特別メッセージ表示
- ✅ 特別メッセージ表示時のボタン一時停止（2.5秒）
- ✅ キラキラアニメーション効果
- ✅ スマホ対応（レスポンシブデザイン）
- ✅ ベージュ系のパステルカラーデザイン
- ✅ 50個のメッセージバリエーション

### 技術的に学んだこと
- `innerHTML`でHTMLタグを解釈して改行を実現
- `disabled`プロパティでボタンの無効化/有効化
- `Math.random()`と配列を使ったランダム表示
- CSSアニメーション（`@keyframes`）
- メディアクエリでのスマホ対応
- `setTimeout`での非同期処理

### 使用技術
- HTML5
- CSS3（グラデーション、アニメーション、メディアクエリ）
- JavaScript（ES6）
- Git/GitHub（ブランチ管理）

### 完了ブランチ
- `phase1` - フェーズ1完了時のブランチ

---

## 🎨 フェーズ2 - デザイン改善とApple風UI ✅

**[📄 完成URL（Phase2）](https://love-counter-git-phase2-rs-projects-9c94598c.vercel.app/)**

### 目標
Apple-likeな洗練されたデザインと、大人可愛い印象の実現

### 完成した機能
- ✅ SVGデザインでボタンをリンゴマークに変更
- ✅ 左右対称なりんごSVGの実装
- ✅ デザインコンセプトファイル作成（DESIGN.md）
- ✅ カラーチャートの整理とCSS変数化
- ✅ Apple風の落ち着いた配色（彩度を抑えた赤、温かみのある白）
- ✅ メッセージに視線を向けるレイアウト調整
- ✅ フォントウェイト調整（視覚的階層の最適化）
- ✅ 控えめなシャドウとアニメーション（Apple風の洗練）
- ✅ モバイル・PC両対応の余白調整
- ✅ アクセシビリティ向上（テキストコントラスト強化）

### 技術的に学んだこと

**詳しい学習内容は → [学習ノート](./love-counter/learning-notes.md) を参照**

- **SVGパスの左右対称ロジック**
  - 中心軸（x=50）を基準にした対称性の計算
  - `右側x = 100 - 左側x` の公式
  - 制御点のy座標も揃える必要がある

- **SVG曲線の滑らかさ調整**
  - 制御点の位置でカーブの形が変わる
  - 制御点を外側に移動→カーブが緩やかに
  - 制御点を下に移動→下に膨らむ

- **CSS変数によるカラー管理**
  - 一元管理で保守性向上
  - デザインの一貫性確保
  - 変更が容易

- **Apple風デザインの原則**
  - 控えめなシャドウ（`0 2px 8px`程度）
  - 繊細なアニメーション（`translateY(-2px)`程度）
  - 余白を活かしたレイアウト
  - 彩度を抑えた配色

### デザイン改善の詳細

#### カラーパレット
```css
/* りんごの色 */
--apple-red: #D46A6A;       /* 落ち着いた赤 */
--apple-red-hover: #C15D5D; /* ホバー時 */
--white-soft: #FFF5F0;      /* 温かみのある白 */
```

#### レイアウト改善
- 上部の余白を削減してメッセージに視線を集中
- カードの上部padding: 32px → 24px
- メッセージのフォントサイズ: 17px → 18px
- メッセージのフォントウェイト: 500 → 600

#### アニメーション改善
- ホバー時の移動: -5px → -2px（より繊細に）
- キラキラ効果: scale(1.02) → scale(1.01)（控えめに）
- シャドウ: 0 4px 12px → 0 2px 8px（Apple風に）

### 使用技術
- SVG（ベクター画像、path要素）
- CSS変数（カスタムプロパティ）
- CSS3（三次ベジェ曲線の理解）
- レスポンシブデザイン（flexbox、メディアクエリ）
- デザインシステム（DESIGN.md）

### 完了ブランチ
- `phase2` - フェーズ2完了時のブランチ

### 次の課題・改善点
- [ ] **りんごボタンのインパクト強化**
  - りんごのサイズを大きくして存在感を出す
  - YESテキストをもっと主張させる（サイズ・ウェイト・配置の最適化）
  - フォントウェイトの研究と実験（Apple製品の事例研究）
  - ボタン全体のバランス調整
  - スマホでボタン押すとき上より、もう少し真ん中にする
  - りんごに影つけてボタン感出す
  - 全体的にインパクト足りない

---

## 🔗 フェーズ3 - LINE連携機能（予定）

### 目標
メッセージの回答をLINEで受け取れるようにする

### 実装予定機能
- [ ] メッセージ入力フォームの追加
- [ ] LINE Messaging APIとの連携
- [ ] LINEボットの作成
- [ ] グループチャットへのメッセージ送信機能
- [ ] サーバーサイドの実装（Node.js + Express）

### 技術構成（予定）
- **フロントエンド**: HTML, CSS, JavaScript
- **バックエンド**: Node.js + Express
- **API**: LINE Messaging API
- **ホスティング**: Vercel / Heroku / Render（検討中）

### 学べること
- API連携の実装
- 非同期通信（fetch, async/await）
- サーバーサイド開発の基礎
- 環境変数の管理
- Webhookの仕組み
- クラウドサービスへのデプロイ

### 実現可能性
✅ **可能です！** LINE Messaging APIを使えば実装できます。

---

## 📋 フェーズ3 実装手順書

### ステップ1: LINE Developersアカウント・チャネル作成

#### 1-1. LINE Developersにログイン
1. [LINE Developers](https://developers.line.biz/ja/) にアクセス
2. LINEアカウントでログイン
3. コンソールにアクセス

#### 1-2. プロバイダーの作成
1. 「作成」ボタンをクリック
2. プロバイダー名を入力（例: "Love Counter App"）
3. 作成完了

#### 1-3. Messaging APIチャネルの作成
1. 「Messaging API」を選択
2. 必須項目を入力：
   - チャネル名: `私のこと好き？ボット`
   - チャネル説明: `メッセージを送信できるボット`
   - 大業種/小業種: 適切なものを選択
3. 利用規約に同意して作成

#### 1-4. 必要な情報を取得
以下の情報をメモしておく：
- **チャネルID**
- **チャネルシークレット**
- **チャネルアクセストークン**（長期）

---

### ステップ2: バックエンド環境の準備

#### 2-1. プロジェクト構成
```
counterapp-collection/
├── love-counter/          # フロントエンド
│   ├── index.html
│   ├── script.js
│   └── ...
├── api/                   # バックエンド（新規作成）
│   ├── send-message.js    # LINE送信API
│   └── webhook.js         # Webhook受信
├── .env.local             # 環境変数（Gitignore）
└── vercel.json            # Vercel設定
```

#### 2-2. 必要なパッケージ
```json
{
  "dependencies": {
    "@line/bot-sdk": "^7.6.0",
    "axios": "^1.6.0"
  }
}
```

---

### ステップ3: フロントエンド実装

#### 3-1. UIの追加
`index.html` に以下を追加：
```html
<!-- メッセージ入力フォーム -->
<div class="reply-section" id="replySection" style="display: none;">
  <textarea id="replyInput" placeholder="返信を入力..."></textarea>
  <button id="sendButton">LINEに送信</button>
</div>
```

#### 3-2. JavaScript実装
`script.js` に以下を追加：
```javascript
// LINEに送信する関数
async function sendToLine(message) {
  try {
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message
      })
    });

    if (response.ok) {
      alert('LINEに送信しました！');
    } else {
      alert('送信に失敗しました');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('エラーが発生しました');
  }
}

// 送信ボタンのイベントリスナー
document.getElementById('sendButton').addEventListener('click', function() {
  const replyText = document.getElementById('replyInput').value;
  if (replyText.trim()) {
    sendToLine(replyText);
  }
});
```

---

### ステップ4: バックエンド実装（Vercel Serverless Functions）

#### 4-1. LINE送信API (`api/send-message.js`)
```javascript
const { Client } = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

const client = new Client(config);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    const userId = process.env.LINE_USER_ID; // 送信先のユーザーID

    await client.pushMessage(userId, {
      type: 'text',
      text: message
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
```

#### 4-2. Webhook受信 (`api/webhook.js`)（オプション）
```javascript
const { Client, middleware } = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const events = req.body.events;

  await Promise.all(events.map(handleEvent));

  res.status(200).end();
};

async function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    const echo = { type: 'text', text: event.message.text };
    return client.replyMessage(event.replyToken, echo);
  }
}
```

---

### ステップ5: 環境変数の設定

#### 5-1. ローカル環境 (`.env.local`)
```
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token_here
LINE_CHANNEL_SECRET=your_channel_secret_here
LINE_USER_ID=your_line_user_id_here
```

#### 5-2. Vercelの環境変数設定
1. Vercelダッシュボードにアクセス
2. プロジェクトの Settings → Environment Variables
3. 以下を追加：
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `LINE_CHANNEL_SECRET`
   - `LINE_USER_ID`

---

### ステップ6: Vercel設定ファイル

#### `vercel.json`
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
  ]
}
```

---

### ステップ7: デプロイとテスト

#### 7-1. デプロイ
```bash
# 変更をコミット
git add .
git commit -m "フェーズ3: LINE連携機能を追加"

# プッシュ（Vercelが自動デプロイ）
git push origin main
```

#### 7-2. テスト手順
1. デプロイされたURLにアクセス
2. メッセージをクリックして表示
3. 返信を入力して「LINEに送信」をクリック
4. LINEアプリを確認
5. メッセージが届いていることを確認

---

### ステップ8: トラブルシューティング

#### よくあるエラーと対処法

**エラー1: 401 Unauthorized**
- 原因: チャネルアクセストークンが間違っている
- 対処: LINE Developersで正しいトークンを確認

**エラー2: 400 Bad Request**
- 原因: ユーザーIDが間違っている
- 対処: 自分のLINE User IDを確認（ボットと友達になる必要あり）

**エラー3: CORS Error**
- 原因: フロントエンドからAPIを直接呼んでいる
- 対処: Vercel Serverless Functionsを使用

**エラー4: メッセージが届かない**
- 原因: ボットと友達になっていない
- 対処: LINE公式アカウントを友達追加

---

### チェックリスト

#### 実装前
- [ ] LINE Developersアカウント作成
- [ ] Messaging APIチャネル作成
- [ ] チャネルアクセストークン取得
- [ ] ユーザーIDの取得方法を確認

#### 実装中
- [ ] フロントエンドのUI追加
- [ ] JavaScriptでAPI呼び出し実装
- [ ] バックエンドAPI実装
- [ ] 環境変数の設定
- [ ] vercel.json作成

#### テスト
- [ ] ローカル環境でテスト（ngrokなど）
- [ ] Vercelにデプロイ
- [ ] 本番環境でテスト
- [ ] エラーハンドリング確認

#### 完了後
- [ ] ドキュメント更新
- [ ] 学習ノートに記録
- [ ] phase3ブランチ作成

---

### 参考リソース

- [LINE Messaging API ドキュメント](https://developers.line.biz/ja/docs/messaging-api/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [@line/bot-sdk GitHub](https://github.com/line/line-bot-sdk-nodejs)

---

## 📚 このプロジェクトで得られる学習効果

### 技術スキル
1. **JavaScript実践力**
   - 基礎文法から実践的な使い方まで
   - DOM操作、イベント処理
   - 配列、関数、オブジェクトの活用

2. **API連携**
   - RESTful APIの理解
   - 外部サービスとの連携
   - 認証とセキュリティ

3. **フロントエンド開発**
   - レスポンシブデザイン
   - ユーザーインタラクション
   - アニメーション実装

4. **バックエンド開発**（フェーズ3）
   - Node.js/Expressの基礎
   - サーバーサイドロジック
   - データのやり取り

5. **開発プロセス**
   - Git/GitHubでのバージョン管理
   - ブランチ戦略
   - 段階的な機能追加

### デザイン・UI/UX
- ユーザー体験の設計
- 視覚的な魅力の向上
- インタラクションデザイン

### プロジェクト管理
- フェーズ分けした開発計画
- タスク管理
- 優先順位の設定

---

## 🎓 エンジニア見習いとして学ぶ意義

### ✨ このプロジェクトが素晴らしい理由

1. **適切な規模感**
   - 小さすぎず、大きすぎず
   - 達成可能で、かつ学びが多い

2. **実用的な成果物**
   - 実際に使えるアプリケーション
   - ポートフォリオに掲載可能
   - 友達や恋人に見せられる

3. **段階的な成長**
   - フェーズごとに新しいスキルを習得
   - 着実にレベルアップ

4. **モチベーション維持**
   - 楽しみながら学べる
   - 目に見える成果が出る

5. **実務に近い経験**
   - ブランチ管理
   - API連携
   - デプロイ

---

## 📝 次のステップ

### フェーズ1完了後
1. コードレビュー・リファクタリング
2. ドキュメント整備
3. フェーズ2の詳細計画作成

### 長期的な目標
- ポートフォリオサイトに掲載
- 技術ブログで学習記録を公開
- 他の学習者と共有

---

**頑張りましょう！🚀**
