# 📝 Love Counter - 仕様書

> **このドキュメントの役割**: プロジェクト全体の概要と各フェーズの仕様へのナビゲーション

> **関連ドキュメント**:
> - [プロジェクトフェーズ計画](./PROJECT_PHASES.md) - 全体のロードマップと各フェーズの概要
> - [デザインコンセプト](./DESIGN.md) - Apple風デザインの詳細
> - [学習メモ](./learning-notes.md) - 技術的な学習記録

---

## 📂 ディレクトリ構造

```
love-counter/
├── index.html              # メインHTML
├── script.js               # JavaScript処理
├── readme.md               # プロジェクト概要
├── package.json            # Node.js依存関係
├── vercel.json             # Vercel設定
├── api/                    # Serverless Functions
│   ├── send-message.js     # LINE送信API
│   └── webhook.js          # Webhook受信API
└── docs/                   # ドキュメント
    ├── spec.md             # 仕様書（このファイル）
    ├── DESIGN.md           # デザインコンセプト
    ├── learning-notes.md   # 学習メモ
    ├── PROJECT_PHASES.md   # フェーズ計画書
    ├── images/             # スクリーンショット
    └── phase/              # フェーズ別ドキュメント
        ├── phase1/         # フェーズ1関連
        │   └── spec.md     # 基本機能の詳細仕様
        ├── phase2/         # フェーズ2関連
        │   ├── spec.md     # デザイン仕様の詳細
        │   ├── SVG調整ガイド.md
        │   └── svg-button-sample.html
        ├── phase3/         # フェーズ3関連
        │   ├── spec.md     # LINE連携機能の詳細仕様
        │   ├── process.md  # 実装プロセス
        │   └── LIFF実装ガイド.md
        └── phase4/         # フェーズ4関連
            └── process.md  # 公式LINE運用計画
```

---

## 🎯 プロジェクト概要

**Love Counter**は、インタラクティブなメッセージボタンアプリです。
JavaScript学習を目的とし、段階的に機能を追加していく設計になっています。

### コンセプト
- りんごボタンを押すとランダムなメッセージが表示される
- 押した回数を「好き度%」として表示
- 22回ごとに特別メッセージを表示し、返信フォームが表示される
- LINE連携で、ユーザーからの返信を受け取る

---

## 📋 フェーズ別仕様

### ✅ フェーズ1: 基本機能

**実装機能：**
- ランダムメッセージ表示
- カウント機能（好き度%）
- 特別メッセージ（22回ごと）
- ボタン一時停止機能
- キラキラアニメーション

**詳細仕様：** [Phase 1 詳細仕様](./phase/phase1/spec.md)

---

### ✅ フェーズ2: デザイン改善

**実装機能：**
- SVGデザインのりんごボタン
- Apple風の洗練された配色
- カラーパレット（CSS変数化）
- レスポンシブデザイン（PC/スマホ/小画面）
- ホバー・アクティブアニメーション

**詳細仕様：** [Phase 2 詳細仕様](./phase/phase2/spec.md)

**関連ドキュメント：**
- [デザインコンセプト](./DESIGN.md)
- [SVG調整ガイド](./phase/phase2/SVG調整ガイド.md)

---

### ✅ フェーズ3: LINE連携機能

**実装機能：**
- LIFF（LINE Front-end Framework）実装
- ユーザーID自動取得
- 返信フォーム（22回目に表示）
- 画像送信機能（imgur API連携）
- Webhook自動応答
- キーワード応答（「ねえねえ」）
- pushMessage方式でのメッセージ送信

**詳細仕様：** [Phase 3 詳細仕様](./phase/phase3/spec.md)

**関連ドキュメント：**
- [フェーズ3実装プロセス](./phase/phase3/process.md)
- [LIFF実装ガイド](./phase/phase3/LIFF実装ガイド.md)

**重要な注意点：**
- 現在の実装（pushMessage方式）では、ユーザーが一度も直接メッセージ/スタンプを送っていない場合、公式LINE管理画面にチャットが表示されない
- → ユーザーに「最初に何か送ってね」と促す必要がある
- または、フェーズ4で`liff.sendMessages()`方式に変更する必要がある

---

### 🚧 フェーズ4: 技術的な改善（進行中）

**実装予定：**
- `liff.sendMessages()`方式への変更（管理画面でチャット表示）
- 2バージョンの作成（健全版・個人版）
- アプリUI最終調整

**詳細計画：** [Phase 4 実装計画](./phase/phase4/process.md)

**実装ガイド：** [liff.sendMessages実装ガイド](./phase/phase4/liff-sendmessages-implementation.md)

---

### 📅 フェーズ5: 公式LINE運用開始（予定）

**実装予定：**
- リッチメニューの設定
- ステップ配信
- コンテンツ作成
- ビジネス展開（1〜3月）

**詳細計画：** [Phase 5 運用計画](./phase/phase5/process.md)

---

## 🛠️ 技術スタック

**フロントエンド**
- HTML5 / CSS3（CSS変数、アニメーション、メディアクエリ）
- JavaScript（ES6）
- LIFF SDK（LINE Front-end Framework）

**バックエンド**
- Node.js / Vercel Serverless Functions
- LINE Messaging API
- imgur API（画像アップロード）

**デプロイ**
- Vercel（自動デプロイ）
- GitHub連携

---

## 🔗 関連ドキュメント

### 基本ドキュメント
- [プロジェクトフェーズ計画](./PROJECT_PHASES.md) - 全体的な開発計画
- [デザインコンセプト](./DESIGN.md) - Apple風デザインの詳細
- [学習メモ](./learning-notes.md) - 技術的な学習記録

### フェーズ別詳細仕様
- [Phase 1 詳細仕様](./phase/phase1/spec.md) - 基本機能の詳細
- [Phase 2 詳細仕様](./phase/phase2/spec.md) - デザイン仕様の詳細
- [Phase 3 詳細仕様](./phase/phase3/spec.md) - LINE連携機能の詳細

### 実装ガイド
- [SVG調整ガイド](./phase/phase2/SVG調整ガイド.md) - りんごボタンの調整方法
- [LIFF実装ガイド](./phase/phase3/LIFF実装ガイド.md) - LIFF詳細設定
- [フェーズ3実装プロセス](./phase/phase3/process.md) - LINE連携の実装手順
- [フェーズ4運用計画](./phase/phase4/process.md) - 公式LINE運用計画

---

**作成**: Claude Code
**最終更新**: 2025-12-13
