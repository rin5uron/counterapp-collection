# 私のこと好き？ボタン

> りんごボタンを押すとランダムなメッセージが表示されるインタラクティブWebアプリ
> JavaScript学習を目的とした段階的開発プロジェクト

---

## 🌐 デモURL

- **Phase1**: [基本機能](https://love-counter-git-phase1-rs-projects-9c94598c.vercel.app/)
- **Phase2**: [Apple風デザイン](https://love-counter-git-phase2-rs-projects-9c94598c.vercel.app/) ← 最新版

---

## 主な機能

- りんごボタンをクリックするとランダムメッセージを表示
- 押した回数を「好き度%」として表示
- 22回ごとに特別メッセージ＆キラキラアニメーション
- スマホ対応のレスポンシブデザイン
- 将来的にLINE連携予定

---

## 🧱 技術スタック

**フロントエンド**
- HTML5 / CSS3（CSS変数、アニメーション、メディアクエリ）
- JavaScript（ES6）

**バックエンド（フェーズ3予定）**
- Node.js / Vercel Serverless Functions
- LINE Messaging API

---

## 📚 ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| **[📝 仕様書](./docs/spec.md)** | 画面構成、機能仕様、データ構造、実装詳細 |
| **[🎨 デザインコンセプト](./docs/DESIGN.md)** | Apple風デザイン、カラーパレット、SVGボタン |
| **[📈 フェーズ計画](./docs/PROJECT_PHASES.md)** | 開発ロードマップ、学習目標、実装状況 |
| **[📖 学習メモ](./docs/learning-notes.md)** | 技術的な学習記録 |
| **[🔧 SVG調整ガイド](./docs/phase2/SVG調整ガイド.md)** | りんごボタンのカスタマイズ方法 |
| **[🔗 LINE連携手順](./docs/phase3/process.md)** | フェーズ3実装手順書 |

**詳細な仕様・データ構造は [📝 仕様書](./docs/spec.md) を参照してください**

---

## 🚀 クイックスタート

```bash
# リポジトリをクローン
git clone <repository-url>

# love-counterディレクトリに移動
cd love-counter

# index.htmlをブラウザで開く
open index.html
```

---

## 📂 ディレクトリ構造

```
love-counter/
├── index.html              # メインHTML
├── script.js               # JavaScript処理
├── api/                    # Serverless Functions
│   ├── send-message.js     # LINE送信API
│   └── webhook.js          # Webhook受信API
└── docs/                   # ドキュメント
    ├── spec.md             # 仕様書
    ├── DESIGN.md           # デザインコンセプト
    ├── PROJECT_PHASES.md   # フェーズ計画
    └── ...
```

---

## 📈 開発ステータス

- ✅ **フェーズ1**: 基本機能（ランダムメッセージ、カウント、特別メッセージ）
- ✅ **フェーズ2**: Apple風デザイン（SVGりんごボタン、洗練されたUI）
- 🚧 **フェーズ3**: LINE連携機能（進行中）

詳細は [フェーズ計画](./docs/PROJECT_PHASES.md) を参照

---

**作成**: Claude Code
**最終更新**: 2025-12-06
