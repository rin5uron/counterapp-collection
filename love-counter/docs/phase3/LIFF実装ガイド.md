# LIFF実装ガイド

> Love CounterにLIFF（LINE Front-end Framework）を実装する手順

---

## 📋 目次

1. [LIFFとは](#liffとは)
2. [実装の全体像](#実装の全体像)
3. [ステップ1: LINE Developers でLIFFアプリ作成](#ステップ1-line-developers-でliffアプリ作成)
4. [ステップ2: フロントエンドにLIFF SDK追加](#ステップ2-フロントエンドにliff-sdk追加)
5. [ステップ3: script.jsにLIFF初期化コード追加](#ステップ3-scriptjsにliff初期化コード追加)
6. [ステップ4: api/send-message.js修正](#ステップ4-apisend-messagejs修正)
7. [ステップ5: テスト](#ステップ5-テスト)
8. [トラブルシューティング](#トラブルシューティング)

---

## LIFFとは

**LIFF（LINE Front-end Framework）** は、LINEアプリ内でWebアプリを動かすための仕組みです。

### 従来の実装（pushMessage）との違い

| 項目 | pushMessage（現在） | LIFF（改善後） |
|------|---------------------|----------------|
| ユーザー識別 | 固定のUSER_ID（環境変数） | 自動取得（開いた人のID） |
| 送信先 | 常に同じ人 | 開いた人それぞれ |
| ブラウザ | どこでもOK | LINEブラウザのみ |
| 管理 | 管理者にしか送れない | 誰でも自分に送れる |

### LIFFのメリット

✅ **ユーザーごとに個別対応できる**
- 誰が送ったかわかる
- それぞれのトークルームに返信が届く

✅ **1対1のコミュニケーション**
- 公式アカウントとユーザーのトークに表示
- あなたがLINE Official Account Managerで確認して手動返信

✅ **LINEのエコシステム活用**
- ユーザーは使い慣れたLINEアプリで操作
- 友達追加だけで利用可能

---

## 実装の全体像

### 動作フロー

```
1. ユーザーが公式LINEを友達追加
   ↓
2. 公式アカウントからLIFF URLを送信（またはリッチメニューに設置）
   例: https://liff.line.me/2008641870-nLbJegy4
   ↓
3. ユーザーがURLをタップ → LINEアプリ内でWebアプリ起動
   ↓
4. LIFF SDK が自動的にユーザーのLINE IDを取得
   ↓
5. ユーザーがりんごボタンを22回押す
   ↓
6. 返信フォームに入力して「送信」
   ↓
7. api/send-message.js がそのユーザーのトークルームに送信
   ↓
8. あなたがLINE Official Account Manager で確認
   ↓
9. そのユーザーに手動で返信
```

### 必要なファイルの変更

- ✅ `index.html` - LIFF SDKを読み込む
- ✅ `script.js` - LIFF初期化とユーザーID取得
- ✅ `api/send-message.js` - ユーザーIDを受け取って送信

---

## ステップ1: LINE Developers でLIFFアプリ作成

### 前提条件

**2つのチャネルが必要です：**

1. ✅ **Messaging APIチャネル**（既に作成済み）
   - 公式アカウント「J」
   - メッセージの送受信に使用

2. ✅ **LINEログインチャネル**（新規作成）
   - LIFF機能に使用
   - ユーザー認証とプロフィール取得

### 1-1. LINEログインチャネルを作成（まだの場合）

1. [LINE Developers Console](https://developers.line.biz/console/) を開く
2. プロバイダー **「love-counter」** を選択
3. **「新規チャネル作成」** をクリック
4. **「LINEログイン」** を選択
5. 以下を入力：

   | 項目 | 入力内容 |
   |------|---------|
   | **チャネル名** | `Love Counter Login` |
   | **チャネル説明** | `Love CounterのLIFF用チャネル` |
   | **アプリタイプ** | ☑️ ウェブアプリ |
   | **メールアドレス** | あなたのメールアドレス |

6. **「作成」** をクリック

### 1-2. LIFFアプリを作成

1. 作成した **「Love Counter Login」チャネル** を開く
2. 上部の **「LIFF」** タブをクリック
3. **「追加」** ボタンをクリック
4. 以下の項目を入力：

   | 項目 | 入力内容 |
   |------|---------|
   | **LIFFアプリ名** | `Love Counter` |
   | **サイズ** | `Full` （全画面表示） |
   | **エンドポイントURL** | **あなたのVercel URLを入力** |
   | **Scope** | ☑️ `profile` ☑️ `openid` |

   **エンドポイントURLの確認方法：**

   1. [Vercel Dashboard](https://vercel.com/dashboard) を開く
   2. プロジェクト（love-counter）を選択
   3. **Domains** の欄に表示されているURLをコピー
   4. そのURLをエンドポイントURLに入力

   **エンドポイントURLの例：**
   ```
   https://love-counter-theta.vercel.app/
   ```
   または
   ```
   https://your-project-name.vercel.app/
   ```

   ⚠️ **重要**:
   - **実際のVercel デプロイ先URLを使う**（例のURLをそのまま使わない）
   - URLの最後に `/` をつける
   - `love-counter/` などのサブディレクトリは**不要**（ルートURLでOK）

5. **オプション項目**（チェック不要）：
   - Scan QR: チェックしない
   - モジュールモード: チェックしない

6. **「作成」** をクリック

### 1-3. LIFF ID をコピー

作成が完了すると、LIFF IDが表示されます。

```
LIFF ID: 2008641870-nLbJegy4
```

**このIDをメモしておいてください**（後でscript.jsで使用します）

### 1-4. LIFF URLを確認

LIFF URLは以下の形式になります：

```
https://liff.line.me/2008641870-nLbJegy4
```

このURLをLINEで送ると、LINEアプリ内でWebアプリが開きます。

### 1-5. ボットリンク機能の設定（重要）

**LIFFとMessaging APIチャネルを連携させます。**

#### 方法1: LIFF編集画面で設定

1. 作成したLIFFアプリの **「編集」** をクリック
2. **「ボットリンク機能」** の項目があるか確認
3. ある場合：
   - `On (Aggressive)` を選択
   - **「リンクするボット」** で **「J」（Messaging APIチャネル）** を選択
   - 保存

#### 方法2: LINEログインチャネルの設定で連携

1. **「Love Counter Login」チャネル** のトップページに戻る
2. **「チャネル基本設定」** タブを開く
3. 下の方にスクロールして **「リンクされたボット」** の項目を探す
4. **「編集」** をクリック
5. Messaging APIチャネル **「J」** を選択
6. 保存

#### 方法3: Messaging APIチャネル側で設定

1. **Messaging APIチャネル「J」** を開く
2. **「Messaging API設定」** タブを開く
3. **「リンクされたLINEログインチャネル」** の項目を探す
4. **「Love Counter Login」** を選択
5. 保存

⚠️ **重要**: 上記いずれかの方法で連携させてください。連携しないと、LIFFからのメッセージが公式アカウントに届きません。

#### 連携の確認方法

- LINEログインチャネル「Love Counter Login」の**チャネル基本設定**に「リンクされたボット」が表示される
- Messaging APIチャネル「J」の**Messaging API設定**に「リンクされたLINEログインチャネル」が表示される

**両方に表示されていればOK！**

---

## ステップ2: フロントエンドにLIFF SDK追加

### 🎯 この作業の目的

**なぜLIFF SDKを読み込むのか？**
- LIFF SDK = LINEが提供しているJavaScriptライブラリ
- これを読み込まないと、`liff.init()` や `liff.getProfile()` などのLIFF関数が使えない
- ユーザーのLINE IDを取得するために必須

**この作業で実現できること：**
- JavaScriptからLIFF機能（ユーザー認証、プロフィール取得）が使えるようになる
- LINEアプリ内でWebアプリが動作するようになる

---

### 2-1. index.html を編集

`</body>` の直前に以下を追加：

```html
<!-- LIFF SDK読み込み -->
<script src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
<script src="script.js"></script>
</body>
</html>
```

**ポイント:**
- LIFF SDKを先に読み込む
- その後に `script.js` を読み込む（LIFF SDKが必要なため）

---

## ステップ3: script.jsにLIFF初期化コード追加

### 🎯 この作業の目的

**なぜLIFF初期化が必要なのか？**
- 現在の実装：固定のUSER_IDにしかメッセージを送れない
- LIFF実装後：**Webアプリを開いた人それぞれのLINE IDを自動取得**できる
- これにより、誰がアプリを開いたか分かり、その人にメッセージを送れる

**この作業で実現できること：**
- ユーザーごとに異なるLINE IDを取得
- そのユーザーの公式アカウントとのトークにメッセージが届く
- **「緩く繋がれる公式LINE」の仕組みが完成**

**技術的な流れ：**
```
1. liff.init() → LIFFを初期化（LIFF IDを指定）
2. liff.isLoggedIn() → LINEにログインしているか確認
3. liff.getProfile() → ユーザー情報（ID、名前）を取得
4. userLineId に保存 → 後で送信時に使用
```

---

### 3-1. LIFF初期化コードを追加

`script.js` の **最初** に以下のコードを追加：

```javascript
// ========================================
// LIFF初期化
// ========================================

let userLineId = null; // ユーザーのLINE ID（グローバル変数）

// LIFF初期化
async function initializeLiff() {
  try {
    // LIFFを初期化
    await liff.init({ liffId: '2008641870-nLbJegy4' }); // ← あなたのLIFF IDに変更

    // LINEにログインしているか確認
    if (!liff.isLoggedIn()) {
      // ログインしていない場合はログイン画面へ
      liff.login();
    } else {
      // ログイン済みの場合、ユーザー情報を取得
      const profile = await liff.getProfile();
      userLineId = profile.userId; // ユーザーIDを保存
      console.log('User ID:', userLineId);
      console.log('Display Name:', profile.displayName);
    }
  } catch (error) {
    console.error('LIFF initialization failed', error);
    alert('LINEアプリで開いてください');
  }
}

// ページ読み込み時にLIFFを初期化
window.addEventListener('DOMContentLoaded', function() {
  initializeLiff();
});
```

**⚠️ 重要**: `liffId: '2008641870-nLbJegy4'` の部分は、ステップ1-3でコピーした**あなたのLIFF ID**です。
別のLIFFアプリを作成した場合は、このIDを変更してください。

### 3-2. sendToLine関数を修正

既存の `sendToLine` 関数を以下に置き換え：

```javascript
// LINEに送信する関数（LIFF対応版）
async function sendToLine(message) {
  try {
    // ユーザーIDが取得できているか確認
    if (!userLineId) {
      alert('LINEアプリで開いてください');
      return;
    }

    // バックエンドにユーザーIDとメッセージを送信
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userLineId,  // 送信者のLINE ID
        message: message
      })
    });

    if (response.ok) {
      alert('LINEに送信しました！');
    } else {
      const error = await response.json();
      alert('送信に失敗しました: ' + error.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('エラーが発生しました');
  }
}
```

**変更点:**
- `userLineId` をリクエストボディに含める
- ユーザーIDが取得できていない場合のエラーハンドリング

---

## ステップ4: api/send-message.js修正

### 🎯 この作業の目的

**なぜバックエンドを変更するのか？**
- 現在の実装：環境変数の固定USER_IDに送信
- LIFF実装後：**フロントエンドから受け取ったuserIdに送信**
- これにより、Webアプリを開いた人それぞれに個別にメッセージを送れる

**この作業で実現できること：**
- フロントエンド（script.js）から送られてきた`userId`を受け取る
- その`userId`の人にpushMessageで送信
- **誰が送ったか識別でき、その人のトークに届く**

**変更のポイント：**
```javascript
// 変更前
const userId = process.env.LINE_USER_ID; // 固定

// 変更後
const { userId, message } = req.body; // リクエストから取得
```

---

### 4-1. api/send-message.js を編集

既存の `api/send-message.js` を以下に置き換え：

```javascript
import { Client } from '@line/bot-sdk';

export default async function handler(req, res) {
  // ========================================
  // CORS設定（プリフライトリクエスト対応）
  // ========================================
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）の場合は200で返す
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTメソッドのみ受け付ける
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ========================================
  // リクエストボディからデータ取得
  // ========================================
  const { userId, message } = req.body;

  // バリデーション
  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }

  // ========================================
  // LINE Messaging API クライアント作成
  // ========================================
  const client = new Client({
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  });

  try {
    // ========================================
    // 特定のユーザーに送信（pushMessage）
    // ========================================
    await client.pushMessage(userId, {
      type: 'text',
      text: message,
    });

    console.log(`Message sent to user: ${userId}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
```

**変更点:**
- `userId` をリクエストボディから受け取る
- バリデーション追加
- そのユーザーに対してpushMessageで送信

---

## ステップ5: テスト

### 🎯 この作業の目的

**なぜテストが重要なのか？**
- LIFF実装は複数の要素（フロントエンド、バックエンド、LINE設定）が連携して動く
- 1つでも設定ミスがあると動作しない
- **実際に動かして確認することで、問題を早期発見できる**

**テストで確認すること：**
1. ✅ LIFF URLをLINEアプリで開ける
2. ✅ ユーザーID取得が成功している
3. ✅ 22回押すと送信フォームが表示される
4. ✅ メッセージを送信できる
5. ✅ 公式アカウントとのトークに届く

**テストの流れ：**
```
Vercelデプロイ → LIFF URLをLINEで送る → LINEアプリで開く
→ ブラウザコンソールでUser ID確認 → 送信テスト → トークに届くか確認
```

---

### 5-1. Vercelにデプロイ

```bash
cd /Users/rin5uron/Desktop/counterapp-collection
git add .
git commit -m "feat: LIFF実装完了"
git push origin dev
```

Vercelが自動的にデプロイします。

### 5-2. LINEアプリでテスト

1. **スマホのLINEアプリを開く**

2. **LIFF URLを送る**
   - 自分のトークルームに以下のURLを送信：
   ```
   https://liff.line.me/1234567890-abcdefgh
   ```
   （あなたのLIFF IDに置き換え）

3. **URLをタップ**
   - LINEアプリ内でWebアプリが開く

4. **動作確認**
   - ✅ りんごボタンが表示される
   - ✅ 22回押すと返信フォームが表示される
   - ✅ メッセージを入力して「送信」
   - ✅ 公式アカウントとのトークに届く

5. **ブラウザの開発者ツールで確認（PC）**
   - デスクトップ版LINEでも動作確認可能
   - ブラウザのコンソールで `User ID` が表示されればOK

---

## トラブルシューティング

### ❌ 「LINEアプリで開いてください」と表示される

**原因**: ChromeやSafariなど、外部ブラウザで開いている

**解決方法**:
1. LIFF URLをLINEのトークに送る
2. LINEアプリ内でURLをタップして開く

---

### ❌ 「LIFF initialization failed」エラー

**原因1**: LIFF IDが間違っている

**解決方法**:
- `script.js` の `liffId: 'xxxxx'` を確認
- LINE Developers ConsoleのLIFF IDと一致しているか確認

**原因2**: エンドポイントURLが間違っている

**解決方法**:
- LINE Developers ConsoleのLIFFエンドポイントURLを確認
- Vercelのデプロイ先と一致しているか確認
- URLの最後に `/` があるか確認

---

### ❌ 送信ボタンを押しても何も起きない

**原因**: `userLineId` が取得できていない

**解決方法**:
1. ブラウザのコンソールを開く（F12）
2. `User ID:` が表示されているか確認
3. 表示されていない場合はLIFF初期化に失敗している

---

### ❌ 「401 Unauthorized」エラー

**原因**: `CHANNEL_ACCESS_TOKEN` が設定されていない、または間違っている

**解決方法**:
1. Vercelの環境変数を確認
   - Settings → Environment Variables
   - `CHANNEL_ACCESS_TOKEN` が正しく設定されているか
2. LINE Developers Consoleでトークンを再発行
3. Vercelで環境変数を更新
4. 再デプロイ

---

### ❌ 「403 Forbidden」エラー

**原因**: ユーザーが公式アカウントをブロックしている

**解決方法**:
- 公式アカウントをブロック解除してもらう
- 友達追加されているか確認

---

## 🎉 完成！

これでLIFF実装が完了しました。

**実現できたこと:**
✅ ユーザーごとにLINE IDを自動取得
✅ それぞれのユーザーのトークルームに送信
✅ LINEアプリ内でWebアプリが動作
✅ 1対1のコミュニケーション基盤

**次のステップ:**
- リッチメニューにLIFF URLを設置
- 自動応答メッセージの設定
- 複数アプリバージョンの展開（親しい人用バージョン）

---

**最終更新**: 2025-12-06
**作成**: Claude Code
