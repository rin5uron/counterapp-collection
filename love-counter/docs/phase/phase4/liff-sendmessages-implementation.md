# フェーズ4実装ガイド - liff.sendMessages() 対応

> **目的**: pushMessage方式からliff.sendMessages()方式に変更して、公式LINE管理画面でチャットを表示できるようにする

**[← フェーズ4計画に戻る](./process.md)** | **[← 仕様書トップに戻る](../../spec.md)**

---

## 🎯 実装の目的

### フェーズ3の問題点

**現状（pushMessage方式）：**
- ユーザーがアプリから返信を送信しても、公式LINE管理画面にチャットが表示されない
- 理由：ユーザーが一度も直接メッセージ/スタンプを送っていない場合、トークルームが作成されない

**解決策（liff.sendMessages()方式）：**
- ユーザー本人から公式LINEにメッセージを送る形式
- 公式LINE管理画面でチャットが確実に表示される✅

---

## 📊 2つの方式の比較

| 項目 | pushMessage（現在） | liff.sendMessages()（変更後） |
|------|---------------------|---------------------------|
| **送信元** | Bot | ユーザー本人 |
| **送信先** | userId（ユーザー本人） | 公式LINEアカウント |
| **Webhook発火** | しない | **する** ⚠️ |
| **管理画面表示** | されない ❌ | される ✅ |
| **バックエンドAPI** | 必要 | 不要 |
| **LIFFウィンドウ** | そのまま | 自動で閉じる |
| **画像処理** | API側で処理 | フロント側でimgurアップロード |

---

## 🔧 実装手順

### 1. LIFF設定でScopeを追加

#### LINE Developers Consoleで設定（詳細手順）

**ステップ1: LINE Developers Consoleにアクセス**
1. [LINE Developers Console](https://developers.line.biz/console/) にアクセス
2. LINEアカウントでログイン

**ステップ2: チャネルを選択**
1. プロバイダーを選択（例：`rin5uron`）
2. チャネルを選択（例：`love-counter公式LINE`）

**ステップ3: LIFF設定画面を開く**
1. 左側のメニューから **「LIFF」** をクリック
2. LIFF アプリのリストが表示される
3. 該当のLIFFアプリ（`love-counter`）の **「Edit」** または **アプリ名** をクリック

**ステップ4: Scopesセクションを見つける**
- LIFF設定画面が表示されます
- 上から順に以下の項目が並んでいます：
  - **LIFF app name**（アプリ名）
  - **Scopes** ← **ここです！**
  - **Endpoint URL**
  - **Scope bot prompt**
  - など

**ステップ5: chat_message.writeを追加**
- **Scopes**セクションで、以下にチェックを入れる：
  - ☑️ `profile`（既にチェック済み）
  - ☑️ `openid`（既にチェック済み）
  - ☑️ **`chat_message.write`** ← **これを追加**

**ステップ6: 保存**
- 画面下部の **「Update」** ボタンをクリック
- 保存完了

**ステップ7: 反映を確認**
- LINEアプリを一度終了して再起動
- アプリを開くと新しいスコープが反映される

---

### 2. フロントエンド（script.js）の変更

#### 変更前（pushMessage方式）:

```javascript
async function sendToLine(message, imageData = null) {
  try {
    if (!userLineId) {
      alert('LINEIDが取得できません');
      return;
    }

    // バックエンドAPIにリクエスト
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userLineId,
        message: message,
        imageData: imageData
      })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    alert('送信しました！');
  } catch (error) {
    console.error('Error:', error);
    alert('送信エラー: ' + error.message);
  }
}
```

#### 変更後（liff.sendMessages()方式）:

```javascript
async function sendToLine(message, imageData = null) {
  try {
    // LINEアプリ内でしか送信できないためチェック
    if (!liff.isInClient()) {
      alert('LINEアプリ内で開いてください。\n外部ブラウザでは送信できません。');
      return;
    }

    const messages = [];

    // テキストメッセージ
    if (message && message.trim() !== '') {
      messages.push({
        type: 'text',
        text: message
      });
    }

    // 画像（imgurにアップロード）
    if (imageData) {
      try {
        const imageUrl = await uploadToImgur(imageData);
        messages.push({
          type: 'image',
          originalContentUrl: imageUrl,
          previewImageUrl: imageUrl
        });
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('画像のアップロードに失敗しました: ' + uploadError.message);
        return;
      }
    }

    // liff.sendMessages()で送信
    if (messages.length > 0) {
      await liff.sendMessages(messages);
      alert('公式LINEアカウントに送信しました！');
    }

  } catch (error) {
    console.error('Error:', error);
    alert('送信エラー: ' + error.message);
  }
}
```

**変更点のまとめ：**
1. `/api/send-message` の呼び出しを削除
2. `liff.isInClient()` でLINEアプリ内かチェック
3. 画像はフロント側で imgur にアップロード
4. `liff.sendMessages()` で送信

---

### 3. Webhookの変更（api/webhook.js）

#### 変更内容

**実装済み！** 🎉

Webhook実装のポイント：
- `liff.sendMessages()` を使うと、Webhookが発火する
- Webアプリからの送信も通常のランダム応答でOK
- **キーワード対応（「ねえねえ」など）はLINE公式アカウントの自動応答機能で対応**

現在の実装:

```javascript
// api/webhook.js
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

module.exports = async (req, res) => {
  try {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        // 通常のメッセージ → ランダム応答（Webアプリからの送信も含む）
        const randomMessage = getRandomMessage();
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: randomMessage
        });
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
};

function getRandomMessage() {
  const messages = [
    'メッセージありがとう！',
    'また話そうね〜',
    'うれしい！',
    '今日も元気？',
    'ありがとう〜',
    'またね！',
    '楽しかった！',
    'またメッセージしてね',
    'いつもありがとう！',
    'また遊ぼうね',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
```

**つまり：**
- Webアプリからの返信も、普通のメッセージとして扱われる
- 自動でランダム応答が返る
- キーワード対応はLINE公式アカウントの設定で管理（Webhookではなくプラットフォーム機能を活用）
- これで問題なし！✅

---

### 4. バックエンドAPI（api/send-message.js）の扱い

**オプション1: 削除**
- `liff.sendMessages()` を使う場合、バックエンドAPIは不要
- ファイルを削除してOK

**オプション2: 残す（将来の拡張用）**
- 別の用途で使う可能性がある場合は残す
- 例：管理者から一斉送信する機能など

---

## 🔍 動作フロー（変更後）

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
10. liff.sendMessages()でユーザー本人から公式LINEに送信 ✅
   ↓
11. Webhook（api/webhook.js）が発火
   ↓
12. メッセージに「【my question】」が含まれているかチェック
    ├─ YES → Webアプリ専用メッセージ（「アプリの使用ありがとう！」）
    └─ NO  → 通常の自動応答
   ↓
13. 管理者（開発者）がLINE公式アカウント管理画面でメッセージを確認 ✅
   ↓
14. 手動で個別に返信
```

**重要な変化：**
- ✅ ユーザー本人から公式LINEにメッセージが送られる
- ✅ 公式LINE管理画面でチャットが確実に表示される
- ⚠️ Webhookが発火するため、「【my question】」で判別が必要

---

## ⚠️ 注意事項

### 1. LINEアプリ内でのみ動作

```javascript
if (!liff.isInClient()) {
  alert('LINEアプリ内で開いてください。');
  return;
}
```

- `liff.sendMessages()` は**LINEアプリ内**でのみ動作
- 外部ブラウザでは使えない

### 2. LIFFウィンドウが自動で閉じる

- `liff.sendMessages()` を実行すると、LIFFウィンドウが自動的に閉じる
- ユーザー体験として自然だが、送信後にメッセージを表示したい場合は `alert()` を使う

### 3. 画像はフロント側でアップロード

- 現在のimgur APIの実装を引き続き使用
- `uploadToImgur()` 関数はそのまま

---

## ✅ チェックリスト

実装が完了したら、以下を確認してください：

- [x] LIFF設定で `chat_message.write` スコープを追加
- [x] `script.js` の `sendToLine()` を変更
- [x] `liff.isInClient()` チェックを追加
- [x] `api/webhook.js` にランダム応答機能を実装
- [x] 2バージョン作成（index.html + general.html）
- [ ] テスト：LINEアプリ内でアプリを開いてメッセージを送信
- [ ] テスト：公式LINE管理画面でチャットが表示されるか確認
- [ ] テスト：Webhook自動応答が適切に動作するか確認
- [ ] キーワード対応（「ねえねえ」など）はLINE公式アカウントの自動応答機能で設定

---

## 📚 関連ドキュメント

- [フェーズ3詳細仕様](../phase3/spec.md) - 現在の実装（pushMessage方式）
- [フェーズ4計画](./process.md) - 公式LINE運用計画
- [LIFF実装ガイド](../phase3/LIFF実装ガイド.md) - LIFF詳細設定
- [プロジェクトフェーズ計画](../../PROJECT_PHASES.md) - 問題点と解決策の記録

---

**[← フェーズ4計画に戻る](./process.md)** | **[← 仕様書トップに戻る](../../spec.md)**
