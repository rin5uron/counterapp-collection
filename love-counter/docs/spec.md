# 📝 Love Counter - 仕様書

> **関連ドキュメント**: [プロジェクトフェーズ計画](./PROJECT_PHASES.md)

---

## 📂 ディレクトリ構造

```
love-counter/
├── index.html              # メインHTML
├── script.js               # JavaScript処理
├── readme.md               # プロジェクト概要
├── package.json            # Node.js依存関係
├── vercel.json             # Vercel設定
├── vercel-config-guide.md  # Vercel設定ガイド
├── PROJECT_PHASES.md       # フェーズ計画書（ルート）
├── api/                    # Serverless Functions
│   ├── send-message.js     # LINE送信API
│   └── webhook.js          # Webhook受信API
└── docs/                   # ドキュメント
    ├── spec.md             # 仕様書（このファイル）
    ├── DESIGN.md           # デザインコンセプト
    ├── learning-notes.md   # 学習メモ
    ├── PROJECT_PHASES.md   # フェーズ計画書
    ├── phase2/             # フェーズ2関連
    │   ├── SVG調整ガイド.md
    │   └── svg-button-sample.html
    └── phase3/             # フェーズ3関連
        └── process.md      # LINE連携実装手順
```

---

## 🎯 プロジェクト概要

**Love Counter**は、インタラクティブなメッセージボタンアプリです。
JavaScript学習を目的とし、段階的に機能を追加していく設計になっています。

### コンセプト
- りんごボタンを押すとランダムなメッセージが表示される
- 押した回数を「好き度%」として表示
- 22回ごとに特別メッセージを表示
- 将来的にLINEと連携して、メッセージの返信を受け取る

---

## 🎨 画面構成

### 1. カード全体
- 中央配置の白いカード（背景はベージュ）
- Apple風の落ち着いたデザイン
- スマホ対応（レスポンシブ）

### 2. トリガーテキスト
- 現在: `「私のこと好き？？」`（固定）
- 位置: カード最上部
- スタイル: 22px、font-weight: 500

### 3. メインボタン（りんごボタン）
- SVGデザインの左右対称なりんご
- 中央に「YES」テキスト
- ホバー時: 浮き上がり + 影強調
- クリック時: スケールダウン（0.95）
- サイズ: 150x150px（PC） / 140x140px（スマホ）

### 4. メッセージ表示エリア
- ランダムメッセージを表示
- フォントサイズ: 18px
- 最小高さ: 3.5em
- 改行対応（`<br>`タグ）

### 5. カウント表示
- 「私のこと好き度：X %」
- フォントサイズ: 13px
- 位置: カード下部

### 6. 特別メッセージ
- 22回ごとに表示
- 「✨このメッセージの答えを教えてね！✨」
- キラキラアニメーション
- 表示時はボタンを2.5秒間無効化

---

## 🔧 機能仕様

### 1. ランダムメッセージ表示

**トリガー**: メインボタンクリック

**処理フロー**:
1. カウント +1
2. `messages1`配列からランダムに1つ選択
3. メッセージエリアに表示（`innerHTML`で改行対応）
4. ボタンテキストを次のランダムなトリガーに更新

**データ構造**:
```javascript
// script.js:8-58
let messages1 = [
  "もう眠いから一緒に寝よ〜",
  "私に会いたい？？え〜〜",
  // ... 全50個
];
```

**実装場所**: `script.js:69-98`

---

### 2. カウント機能（好き度%）

**表示形式**: `私のこと好き度：X %`

**処理**:
- ボタンクリックごとに +1
- 上限なし（無限カウント）
- リセット機能なし（将来追加予定）

**実装場所**:
- カウント変数: `script.js:6`
- 表示更新: `script.js:70-71`
- HTML: `index.html:291-293`

---

### 3. 特別メッセージ機能

**トリガー条件**: `count % 22 === 0 && count !== 0`

**処理内容**:
1. 特別メッセージを表示
2. ボタンを無効化（opacity: 0.5）
3. 2.5秒後にボタンを再有効化
4. 特別メッセージを非表示

**実装場所**: `script.js:77-94`

**アニメーション**:
- `@keyframes sparkle` でキラキラ効果
- 1.5秒ループ
- スケール変化 + 影の強調
- 実装場所: `index.html:171-180`

---

### 4. ボタン一時停止機能

**実装方法**:
```javascript
mainButton.disabled = true;
mainButton.style.opacity = "0.5";
mainButton.style.cursor = "not-allowed";

setTimeout(function() {
  mainButton.disabled = false;
  mainButton.style.opacity = "1";
  mainButton.style.cursor = "pointer";
}, 2500);
```

**実装場所**: `script.js:82-91`

---

## 🎨 デザイン仕様

### カラーパレット

**CSS変数** (`index.html:8-30`):

| 変数名 | 色コード | 用途 |
|--------|---------|------|
| `--bg-beige` | `#F5EFE7` | 背景色 |
| `--white` | `#FFFFFF` | カード背景 |
| `--white-soft` | `#FFF5F0` | りんご内テキスト |
| `--apple-red` | `#D46A6A` | りんご本体 |
| `--apple-red-hover` | `#C15D5D` | ホバー時 |
| `--soft-red` | `#E8B4B8` | ボーダー・アクセント |
| `--text-primary` | `#6B5B4F` | メインテキスト |
| `--text-secondary` | `#7A6650` | サブテキスト・茎 |

**詳細**: [DESIGN.md](./DESIGN.md) を参照

---

### SVGボタン仕様

**りんごの形状** (`index.html:270-277`):
```svg
<path class="apple-body" d="
  M 50,25
  C 30,25 20,35 20,50
  C 20,65 26,81 45,81
  C 50,81 50,81 55,81
  C 72,81 80,65 80,50
  C 80,35 70,25 50,25 Z
" />
```

**構成要素**:
- りんご本体（左右対称、x=50が中心軸）
- 茎（上部）
- 根本の軸（曲線）
- テキスト「YES」（中央配置）

**詳細**: [SVG調整ガイド](./phase2/SVG調整ガイド.md) を参照

---

### レスポンシブデザイン

#### PC（デフォルト）
- カード幅: max-width 340px
- ボタンサイズ: 150x150px
- フォントサイズ: 22px（トリガー）、18px（メッセージ）

#### スマホ（max-width: 480px）
- カード幅: 100%
- ボタンサイズ: 140x140px
- フォントサイズ: 20px（トリガー）、19px（メッセージ）
- タップハイライト無効化

#### 小画面（max-width: 360px）
- ボタンサイズ: 120x120px
- フォントサイズ: 16px（メッセージ）

**実装場所**: `index.html:183-253`

---

## 🔗 LINE連携機能（フェーズ3予定）

### 実装予定の機能

1. **メッセージ送信**
   - 特別メッセージ表示時に回答フォーム表示
   - LINEグループに回答を送信
   - 実装場所: `api/send-message.js`

2. **Webhook受信**
   - LINEからのメッセージを受信
   - イベント処理（フォロー/メッセージ）
   - 実装場所: `api/webhook.js`

### 技術構成
- **API**: LINE Messaging API
- **バックエンド**: Vercel Serverless Functions
- **認証**: 環境変数（`.env.local`）

---

### 複数アプリ管理のアーキテクチャ

#### コンセプト
**1つのLINE公式アカウント「テスト用メンヘラアカウント」で全メンヘラアプリを管理**

counterapp-collectionには3つのアプリがありますが、すべて1つのLINE公式アカウントで管理します。

```
LINE公式アカウント「テスト用メンヘラアカウント」
  ↓
  Webhook URL: https://counterapp-collection.vercel.app/api/webhook
  ↓（内部で振り分け）
  ├─ love-counter への処理
  ├─ negaposi-counter への処理
  └─ self-control-counter への処理
```

#### システム構成

**Vercelプロジェクト構成**
```
counterapp-collection/
├── api/
│   └── webhook.js          # 共通Webhook（振り分けロジック）
│
├── love-counter/
│   ├── index.html          # フロントエンド
│   └── script.js
│
├── negaposi-counter/
│   ├── index.html          # フロントエンド
│   └── script.js
│
└── self-control-counter/
    ├── index.html          # フロントエンド
    └── script.js
```

#### Webhook振り分け方式

##### 方式1: コマンドベース（推奨）

ユーザーがメッセージの先頭にコマンドをつけることで、どのアプリに送るか指定：

**実装例**:
```javascript
// api/webhook.js
export default async function handler(req, res) {
  const events = req.body.events;

  for (const event of events) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      continue;
    }

    const userMessage = event.message.text;

    // コマンドで振り分け
    if (userMessage.startsWith('/love')) {
      await handleLoveCounter(event, userMessage);
    } else if (userMessage.startsWith('/negaposi')) {
      await handleNegaPosiCounter(event, userMessage);
    } else if (userMessage.startsWith('/self')) {
      await handleSelfControlCounter(event, userMessage);
    } else {
      // ヘルプメッセージ
      await replyHelp(event);
    }
  }

  res.status(200).json({ success: true });
}
```

**ユーザーの使い方**:
```
/love こんにちは        → love-counterに送信
/negaposi 今日は最悪    → negaposi-counterに送信
/self 頑張った！        → self-control-counterに送信
help                   → ヘルプメッセージを表示
```

##### 方式2: Postbackデータベース

LINEのリッチメニューやボタンテンプレートを使用：

```javascript
// ボタンで「どのアプリか」を自動判別
{
  type: 'postback',
  data: 'app=love-counter&action=send&message=こんにちは'
}
```

**メリット**:
- ユーザーがコマンドを覚える必要がない
- タップだけで操作可能
- UI/UXが洗練される

**デメリット**:
- リッチメニューの設定が必要
- 初期実装が複雑

#### なぜ1つのアカウントで管理するのか？

**メリット**:
1. **ユーザー体験**: 1回の友達追加で全アプリ利用可能
2. **管理の簡単さ**: 1つのトークン、1つの設定
3. **コスト削減**: 複数のLINE公式アカウント不要
4. **コード共通化**: 認証・エラーハンドリングを共有
5. **学習効果**: より実践的なアーキテクチャ設計を学べる

**デメリット**:
- Webhookのコードが複雑になる
- 各アプリの結合度が上がる

**参考**: [学習メモ - 12/6 LINEチャネルとボットの関係](./learning-notes.md)

#### LINE Developers設定

**重要な制約**:
- **1つのLINEチャネルには1つのWebhook URLしか設定できない**
- したがって、`api/webhook.js`内で振り分けロジックを実装する必要がある

**設定するWebhook URL**:
```
https://counterapp-collection.vercel.app/api/webhook
```

#### 環境変数

全アプリ共通で使用：

```bash
# .env.local（Vercelにも設定）
CHANNEL_ACCESS_TOKEN=your_channel_access_token
CHANNEL_SECRET=your_channel_secret
```

**詳細**: [フェーズ3実装手順](./phase3/process.md) を参照

---

## 📊 データ構造

### JavaScript変数

```javascript
// script.js

// グローバル変数
let count = 0;                  // カウント数
let triggers1 = ["YES"];        // ボタンテキスト配列
let messages1 = [ /* ... */ ];  // メッセージ配列（50個）

// DOM要素
const mainButton = document.getElementById('mainButton');
const buttonText = mainButton.querySelector('.apple-text');
const message = document.getElementById('message');
const countDisplay = document.getElementById('count');
const specialMessageElement = document.getElementById('specialMessage');
```

### HTML要素ID

| ID | 用途 | タグ |
|----|------|------|
| `triggerText` | トリガーテキスト | `<p>` |
| `mainButton` | メインボタン | `<button>` |
| `message` | メッセージ表示 | `<p>` |
| `count` | カウント数表示 | `<span>` |
| `specialMessage` | 特別メッセージ | `<p>` |

---

## 🛠️ 技術スタック

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**:
  - CSS変数（カラーパレット）
  - フレックスボックス
  - アニメーション（`@keyframes`）
  - メディアクエリ（レスポンシブ）
- **JavaScript（ES6）**:
  - DOM操作
  - イベントリスナー
  - 配列操作（`Math.random()`）
  - 非同期処理（`setTimeout`）

### バックエンド（フェーズ3）
- **Node.js**: Serverless Functions
- **LINE Messaging API**: メッセージ送受信
- **Vercel**: ホスティング・デプロイ

---

## 📈 フェーズ別実装状況

### ✅ フェーズ1（完了）
- ランダムメッセージ表示
- カウント機能
- 22回ごとの特別メッセージ
- ボタン一時停止
- キラキラアニメーション
- レスポンシブデザイン
- 50個のメッセージ

### ✅ フェーズ2（完了）
- SVGデザインでりんごボタン実装
- Apple風の落ち着いた配色
- カラーチャート整理（CSS変数化）
- アクセシビリティ向上
- デザインドキュメント作成

### 🚧 フェーズ3（進行中）
- バックエンド環境の準備 ✅
- LINE Messaging API設定（予定）
- Vercelデプロイ（予定）
- メッセージ送受信機能（予定）

**詳細**: [プロジェクトフェーズ計画](./PROJECT_PHASES.md)

---

## 🔍 主要な処理フロー

### ボタンクリック時の処理

```
1. ボタンクリック
   ↓
2. count++ （カウント増加）
   ↓
3. countDisplay.textContent = count （表示更新）
   ↓
4. ランダムメッセージ取得
   ↓
5. message.innerHTML = ランダムメッセージ （メッセージ表示）
   ↓
6. count % 22 === 0 ? （22の倍数か？）
   ├─ YES → 特別メッセージ表示 + ボタン無効化（2.5秒）
   └─ NO → 特別メッセージ非表示
   ↓
7. 次のボタンテキストをランダムに設定
```

**実装場所**: `script.js:69-98`

---

## 📚 学習ポイント

このプロジェクトで学べる技術:

1. **JavaScript基礎**
   - DOM操作（`getElementById`, `querySelector`）
   - イベント処理（`addEventListener`）
   - 配列操作（`Math.random()`）
   - 非同期処理（`setTimeout`）

2. **CSS実践**
   - CSS変数（カスタムプロパティ）
   - アニメーション（`@keyframes`）
   - レスポンシブデザイン（メディアクエリ）
   - フレックスボックス

3. **SVG**
   - パス操作（`<path>`）
   - 左右対称なデザイン
   - SVG内テキスト配置

4. **API連携**（フェーズ3）
   - RESTful API
   - 非同期通信（`fetch`, `async/await`）
   - Webhook処理

5. **開発プロセス**
   - Git/GitHub（ブランチ管理）
   - フェーズ分け開発
   - ドキュメント作成

---

## 🔗 関連ドキュメント

- [プロジェクトフェーズ計画](./PROJECT_PHASES.md) - 全体的な開発計画
- [デザインコンセプト](./DESIGN.md) - Apple風デザインの詳細
- [学習メモ](./learning-notes.md) - 技術的な学習記録
- [SVG調整ガイド](./phase2/SVG調整ガイド.md) - りんごボタンの調整方法
- [フェーズ3実装手順](./phase3/process.md) - LINE連携の実装手順
- [Vercel設定ガイド](../vercel-config-guide.md) - Serverless Functions設定

---

## 📝 メモ

### 今後の改善点
- トリガーテキストのバリエーション追加
- メッセージ配列の拡充（100個まで）
- カウントリセット機能
- 履歴表示機能
- ダークモード対応

### 技術的な課題
- LINE連携時のエラーハンドリング
- 環境変数の管理
- セキュリティ対策（rate limiting等）

---

**最終更新**: 2025-12-06
**作成者**: Claude Code
**プロジェクトURL**: [counterapp-collection](https://github.com/yourusername/counterapp-collection)
