# フェーズ4 - 技術的な改善と2バージョン作成

> **目標**: liff.sendMessages()対応と2バージョン作成で、より使いやすいアプリに

**[← プロジェクトフェーズ計画に戻る](../../PROJECT_PHASES.md)**

---

## 🎯 目標

1. **liff.sendMessages()方式への変更**
   → 公式LINE管理画面でチャットを確実に表示

2. **2バージョンの作成**
   → 健全版（全員用）と個人版（親しい人用）

3. **アプリUI最終調整**
   → 細かいUX改善

---

## 📋 実装予定機能

### 1. liff.sendMessages()対応 ⭐最優先

**目的：**
- フェーズ3の問題点を解決
- 公式LINE管理画面でチャットを確実に表示

**実装内容：**
- [ ] LIFF設定で `chat_message.write` スコープを追加
- [ ] `script.js` の `sendToLine()` を変更
- [ ] `liff.isInClient()` チェックを追加
- [ ] `api/webhook.js` で「【my question】」チェックを追加
- [ ] テスト：公式LINE管理画面でチャット表示を確認

**詳細実装ガイド：** [liff.sendMessages()実装ガイド](./liff-sendmessages-implementation.md)

---

### 2. 2バージョンの作成

#### バージョンA: 健全版（全員用）
- **対象**: 友達追加してくれた全員
- **メッセージ内容**: 健全で楽しいメッセージ
- **配布方法**: 公式アカウントから配布
- **URL例**: `https://love-counter-theta.vercel.app/`

#### バージョンB: 個人版（親しい人用）
- **対象**: 親しい友達のみ
- **メッセージ内容**: より親密な内容（現在のメッセージ）
- **配布方法**: 手動でURLを送る
- **URL例**: `https://love-counter-theta.vercel.app/special`

**技術的な実装：**
```javascript
// URL判定でメッセージ配列を切り替え
const isSpecialVersion = window.location.pathname.includes('/special');

const messages = isSpecialVersion ? messagesSpecial : messagesGeneral;

// 健全版メッセージ
const messagesGeneral = [
  "今日も元気？",
  "最近どう？",
  "またね！",
  // ... 健全なメッセージ
];

// 個人版メッセージ（現在のもの）
const messagesSpecial = [
  "もう眠いから一緒に寝よ〜",
  "私に会いたい？？え〜〜",
  // ... 現在のメッセージ
];
```

**実装場所：** `script.js`

---

### 3. アプリUI最終調整

#### ✅ 実装済み（フェーズ3で完了）
- [x] フォーム入力時にフォームが動かないように固定
- [x] ボタンデザインの改善（影、サイズ、押しやすさ）
- [x] スマホデザインの洗練
- [x] 画像送信機能
- [x] テキスト+画像の同時送信

#### 🔲 今後の改善案（オプション）
- [ ] アニメーション効果の追加
- [ ] ローディング表示
- [ ] 送信成功時のフィードバック改善
- [ ] エラーハンドリングの強化

---

## 🔄 実装の流れ

### Step 1: liff.sendMessages()対応（最優先） ⭐
1. LIFF設定でScopeを追加
2. `script.js` を変更
3. `api/webhook.js` を変更
4. テスト

**所要時間**: 1〜2時間

### Step 2: 2バージョンの作成
1. 健全版メッセージを作成（50個）
2. URL判定ロジックを実装
3. テスト（両バージョン）

**所要時間**: 2〜3時間

### Step 3: UI最終調整（オプション）
1. 細かいUX改善
2. テスト

**所要時間**: 1〜2時間

---

## ⚠️ 重要な注意点

### liff.sendMessages()の制約
- **LINEアプリ内でのみ動作**
  外部ブラウザでは使えない

- **LIFFウィンドウが自動で閉じる**
  送信後、ウィンドウが閉じる（ユーザー体験として自然）

- **Webhookが発火する**
  「【my question】」で判別が必要

### 2バージョンの管理
- 同じLIFF ID、同じ公式アカウントを使用
- メッセージ配列だけを切り替える
- URLで判定（`/special` パスの有無）

---

## 📚 関連ドキュメント

- **[liff.sendMessages()実装ガイド](./liff-sendmessages-implementation.md)** - 詳細な実装手順
- **[フェーズ3詳細仕様](../phase3/spec.md)** - 現在の実装（pushMessage方式）
- **[フェーズ5計画](../phase5/process.md)** - 公式LINE運用開始
- **[プロジェクトフェーズ計画](../../PROJECT_PHASES.md)** - 全体の開発計画

---

## 🎉 フェーズ4完了後

フェーズ4が完了すると：
- ✅ 公式LINE管理画面でチャットが確実に表示される
- ✅ 健全版と個人版の2バージョンが使える
- ✅ より安定したアプリになる

次は **フェーズ5: 公式LINE運用開始** に進みます！

---

**[← プロジェクトフェーズ計画に戻る](../../PROJECT_PHASES.md)** | **[→ フェーズ5計画へ](../phase5/process.md)**
