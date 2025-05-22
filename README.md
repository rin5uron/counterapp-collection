2025・５・２２
## ✅ 青くなる現象の原因と対策まとめ（CSSボタン）

### ❓現象
- ボタンをクリック・タップすると、**テキストや背景が青く光る**
- 特に Safari や Chrome（Mac/iOS）で起こりやすい

---

### 🔍 原因
- ブラウザの**デフォルトスタイル（ユーザーエージェントスタイル）**
  - `button` や `input` などの要素に、フォーカス時の `outline`, `box-shadow`, `color` が自動で適用される
- **`-webkit-focus-ring-color`** や **`appearance` の影響**
  - フォーカスされた時の青い枠や青いテキストなど
- `:active` 状態でブラウザが**角丸（border-radius）を一時的に無視**することがある

---

### ✅ 対策（CSSコピペ用）

```css
.action-btn {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 12px;
}

.action-btn:focus,
.action-btn:active {
  outline: none;
  box-shadow: none;
  color: inherit;
  border-radius: 12px; /* ← ここにも書くのが重要！ */
}
