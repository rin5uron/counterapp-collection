# Phase 3: LINE連携機能 - 詳細仕様

> **フェーズ3の目標**: LIFFとWebhookを使ったLINE連携の実装

**[← 仕様書トップに戻る](../../spec.md)**

---

## 🔗 実装機能一覧

### 1. LIFF（LINE Front-end Framework）
- ユーザーID自動取得
- ログイン状態の管理
- LINEアプリ内でWebアプリを起動

### 2. 返信フォーム
- 22回目のメッセージ表示時に自動で表示
- テキスト入力 + 画像添付が可能
- 質問内容を含めて送信（何の質問への返信か明確化）

### 3. 画像送信機能
- ギャラリーから画像を選択
- imgur APIで画像をアップロード（Base64 → URL変換）
- テキストと画像を同時に送信可能

### 4. メッセージ送信（pushMessage方式）
- バックエンドAPIにリクエスト送信
- ユーザーIDを指定してLINEメッセージを送信

### 5. Webhook自動応答
- ユーザーからのメッセージに自動で返信
- ランダムメッセージで応答

### 6. キーワード自動応答
- 「**ねえねえ**」と送信するとアプリURLを返信

---

## 🔧 詳細仕様

### 1. LIFF実装

**初期化処理**:
```javascript
async function initializeLiff() {
  try {
    await liff.init({ liffId: '2008641870-nLbJegy4' });

    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: 'https://love-counter-theta.vercel.app/' });
      return;
    }

    const profile = await liff.getProfile();
    userLineId = profile.userId;
    console.log('User ID:', userLineId);
  } catch (error) {
    console.error('LIFF initialization failed', error);
  }
}
```

**実装場所**: `script.js` - `initializeLiff()`

**処理フロー**:
1. LIFF SDKを初期化
2. ログイン状態をチェック
3. 未ログインの場合は自動ログイン
4. ユーザーIDを取得

**詳細**: [LIFF実装ガイド](./LIFF実装ガイド.md) を参照

---

### 2. 返信フォーム機能

**表示条件**: `count % 22 === 0 && count !== 0`

**フォーム構成**:
- テキスト入力欄（`<textarea>`）
- 画像添付ボタン
- 画像プレビュー
- 送信ボタン / キャンセルボタン

**送信データ**:
```javascript
const fullMessage = `【my question】
${questionText}

【your answer】
${replyText || '(画像のみ)'}`;
```

**実装場所**:
- HTML: `index.html` - 返信フォーム
- JavaScript: `script.js` - フォーム表示制御、送信処理

---

### 3. 画像送信機能

**imgur API連携**:
```javascript
async function uploadToImgur(base64Image) {
  const clientIds = [
    '546c25a59c58ad7',
    'another_client_id',
    // フォールバック用の複数ID
  ];

  for (const clientId of clientIds) {
    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${clientId}`,
        },
        body: JSON.stringify({
          image: base64Image.split(',')[1],
          type: 'base64'
        })
      });

      const data = await response.json();
      if (data.success && data.data && data.data.link) {
        return data.data.link;
      }
    } catch (err) {
      continue; // 次のClient IDを試す
    }
  }

  throw new Error('すべてのClient IDで失敗しました');
}
```

**処理フロー**:
1. ユーザーがギャラリーから画像を選択
2. 画像をBase64形式に変換
3. imgur APIで画像をアップロード
4. 画像URLを取得
5. LINEメッセージとして送信

**実装場所**: `script.js` - `uploadToImgur()`, `sendToLine()`

---

### 4. メッセージ送信（pushMessage方式）

**バックエンドAPI**: `api/send-message.js`

**リクエスト**:
```javascript
const response = await fetch('/api/send-message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: userLineId,
    message: fullMessage,
    imageData: base64Image // オプション
  })
});
```

**バックエンド処理**:
```javascript
const messages = [];

// テキストメッセージ
if (message) {
  messages.push({
    type: 'text',
    text: message
  });
}

// 画像（imgurからURL取得済み）
if (imageUrl) {
  messages.push({
    type: 'image',
    originalContentUrl: imageUrl,
    previewImageUrl: imageUrl
  });
}

// pushMessageで送信
await client.pushMessage(userId, messages);
```

**実装場所**: `api/send-message.js`

---

### 5. Webhook自動応答

**エンドポイント**: `api/webhook.js`

**処理フロー**:
```javascript
// Webhookイベント受信
const events = req.body.events;

for (const event of events) {
  if (event.type === 'message' && event.message.type === 'text') {
    const messageText = event.message.text;

    // キーワードチェック
    if (messageText === 'ねえねえ') {
      // アプリURLを返信
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'なになに？\n\n↓↓とりあえずこれやって？\nhttps://love-counter-theta.vercel.app/\n※URLはLINEブラウザ内で開いてね！'
      });
    } else {
      // ランダムメッセージで返信
      const randomMessage = getRandomMessage();
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: randomMessage
      });
    }
  }
}
```

**実装場所**: `api/webhook.js`

---

## 🔄 動作フロー全体図

```
1. ユーザーがLINE公式アカウントに「ねえねえ」と送信
   ↓
2. Webhook（api/webhook.js）がキーワードを検知
   ↓
3. アプリURL（https://love-counter-theta.vercel.app/）を返信
   ↓
4. ユーザーがURLをタップ → アプリがLINEアプリ内で起動（LIFF）
   ↓
5. LIFF SDKでユーザーIDを自動取得（initializeLiff）
   ↓
6. ユーザーがりんごボタンを22回タップ
   ↓
7. 返信フォームが表示される
   ↓
8. ユーザーがテキスト（または画像）を入力して「送信」
   ↓
9. 画像がある場合はimgur APIでアップロード（Base64 → URL変換）
   ↓
10. api/send-message.js がそのユーザーにメッセージを送信（pushMessage）
   ↓
11. api/webhook.js は反応しない（pushMessageはWebhookを発火しない）
   ↓
12. 管理者（開発者）がLINE公式アカウント管理画面でメッセージを確認
   ↓
13. 手動で個別に返信
```

---

## ⚠️ 重要な制約と問題点

### pushMessage方式の制約

**問題点：**
- **ユーザーが一度も直接メッセージ/スタンプを送っていない場合、公式LINE管理画面にチャットが表示されない**
- → 誰がアプリを使っているか分からない

**理由：**
- `pushMessage` はBotからユーザーへの一方的な送信
- ユーザー本人から公式LINEにメッセージを送っていないため、トークルームが作成されない

**対策（フェーズ3での暫定対応）：**
1. ユーザーに「最初に何か送ってね」とウェルカムメッセージで促す
2. スタンプ1個でも送ってもらえば、その後はアプリからの送信も管理画面で見られる

**根本的な解決策（フェーズ4で実装予定）：**
- `liff.sendMessages()` 方式に変更
- ユーザー本人から公式LINEにメッセージを送る形式
- 公式LINE管理画面でチャットが確実に表示される
- ただし、Webhookが発火するため、自動応答の制御が必要

**詳細**: [フェーズ4実装ガイド - liff.sendMessages対応](../phase4/liff-sendmessages-implementation.md)

---

## 🛠️ 技術スタック

**フロントエンド**
- LIFF SDK（`@line/liff`）
- JavaScript（ES6）

**バックエンド**
- Node.js / Vercel Serverless Functions
- LINE Messaging API（`@line/bot-sdk`）
- imgur API

**環境変数**
- `CHANNEL_ACCESS_TOKEN` - LINE Messaging APIのアクセストークン
- `CHANNEL_SECRET` - LINE Messaging APIのチャネルシークレット

---

## 📊 データ構造

### メッセージ送信リクエスト

```javascript
{
  userId: "U1234567890abcdef...",
  message: "【my question】\n質問内容\n\n【your answer】\nユーザーの返信",
  imageData: "data:image/png;base64,iVBORw0KG..." // オプション
}
```

### LINE APIメッセージオブジェクト

```javascript
// テキストメッセージ
{
  type: 'text',
  text: 'メッセージ内容'
}

// 画像メッセージ
{
  type: 'image',
  originalContentUrl: 'https://i.imgur.com/xxxxx.png',
  previewImageUrl: 'https://i.imgur.com/xxxxx.png'
}
```

---

## 🔗 関連ドキュメント

- [LIFF実装ガイド](./LIFF実装ガイド.md) - LIFF詳細設定とトラブルシューティング
- [フェーズ3実装プロセス](./process.md) - 実装手順とエラー解決
- [フェーズ4実装ガイド](../phase4/liff-sendmessages-implementation.md) - liff.sendMessages対応
- [Phase 1 詳細仕様](../phase1/spec.md) - 基本機能の詳細
- [Phase 2 詳細仕様](../phase2/spec.md) - デザイン仕様の詳細

---

**[← 仕様書トップに戻る](../../spec.md)**
