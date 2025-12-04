# Learning Notes

This file contains what I learned through the project, organized by date.

---

## 📚 目次

- [2025/12/5 - SVG, ベクター画像, path, circle, text, viewBox, xmlns, 名前空間, グラデーション, 描画順序, Q (Quadratic curve), 制御点](#20251205---svgとcssの違い)
- [2025/12/4 - innerHTML, disabled, Math.random(), Math.floor(), setTimeout(), 配列, 関数の引数, path順序, Z (Close path), SVG重なり順](#20251204---javascript基礎)

---

## 2025/12/5 - SVGとCSSの違い

### SVGとは？

**SVG（Scalable Vector Graphics）** = 拡大縮小できるベクター画像

画像を「数式や座標」で描く技術。どんなサイズでもきれいに表示できる。

### 普通の画像との違い

```
PNG/JPG（ラスター画像）
├─ ピクセル（点）の集まり
└─ 拡大すると → ぼやける、ギザギザ

SVG（ベクター画像）
├─ 数式で描かれた図形
└─ 拡大しても → どんなサイズでもきれい✨
```

---

### CSSで図形を描く vs SVG

#### 1. CSSで図形を描く

```css
/* 丸を作る */
.circle {
  width: 100px;
  height: 100px;
  background: red;
  border-radius: 50%; /* これで丸くなる */
}

/* ハート（複雑...無理やり感がある） */
.heart {
  width: 100px;
  height: 90px;
  background: red;
  transform: rotate(-45deg);
}
.heart::before,
.heart::after {
  content: "";
  width: 100px;
  height: 90px;
  background: red;
  border-radius: 50%;
  position: absolute;
}
```

**CSSの特徴：**
- ✅ 簡単な図形（丸、四角）は楽
- ❌ 複雑な図形は難しい・無理やり感
- ❌ 細かいコントロールが難しい

---

#### 2. SVGで図形を描く

```html
<!-- 丸を作る -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="red" />
</svg>

<!-- リンゴを作る（複雑な形も自由に描ける） -->
<svg width="100" height="100" viewBox="0 0 100 100">
  <!-- リンゴの本体 -->
  <path d="M50,20 C30,20 20,35 20,50 C20,70 35,85 50,90 C65,85 80,70 80,50 C80,35 70,20 50,20 Z" fill="red"/>
  <!-- 茎 -->
  <path d="M50,10 L50,20" stroke="brown" stroke-width="2"/>
  <!-- 葉っぱ -->
  <path d="M52,12 Q58,8 60,12 Q58,15 52,12" fill="green"/>
</svg>
```

**SVGの特徴：**
- ✅ 複雑な図形も自由に描ける
- ✅ 細かいコントロールができる
- ✅ アニメーションしやすい
- ✅ 拡大縮小してもきれい
- ❌ コードが長くなることがある

---

### 比較表

| | **CSS** | **SVG** |
|---|---|---|
| **簡単な図形** | ◎ とても簡単 | ○ 普通 |
| **複雑な図形** | △ 難しい | ◎ 得意 |
| **アニメーション** | ○ できる | ◎ 細かく制御できる |
| **拡大縮小** | ○ できる | ◎ どんなサイズでもきれい |
| **コードの量** | 少ない | 多くなることも |
| **使いどころ** | 単純な装飾 | イラスト、ロゴ、アイコン |

---

### SVGの基本要素

```html
<svg width="200" height="200" viewBox="0 0 200 200">
  <!-- 円 -->
  <circle cx="100" cy="100" r="50" fill="blue" />

  <!-- 四角 -->
  <rect x="50" y="50" width="100" height="80" fill="green" />

  <!-- 線 -->
  <line x1="0" y1="0" x2="200" y2="200" stroke="black" stroke-width="2" />

  <!-- 自由な形（パス） -->
  <path d="M 10,30 L 50,90 L 90,30" stroke="red" fill="none" stroke-width="3" />
</svg>
```

**よく使う要素：**
- `<circle>` = 円
- `<rect>` = 四角
- `<line>` = 線
- `<path>` = 自由な形（一番よく使う）
- `<ellipse>` = 楕円
- `<polygon>` = 多角形

---

### 結論

- **簡単な図形（丸、四角）** → **CSSが楽** 🟢
- **複雑な図形（リンゴ、ハート、イラスト）** → **SVGが得意** 🍎

**このプロジェクトでは：**
リンゴマークのボタンを作るので、**SVGを使う** のが最適！

---

### SVGの構造（重要）

#### viewBoxと座標系
```html
<svg viewBox="0 0 100 100">
  ↑ 左上(0,0)から右下(100,100)の空間
```

- x軸：右に行くほど大きい
- y軸：下に行くほど大きい

#### path要素のコマンド

| コマンド | 意味 | 例 |
|---|---|---|
| M x,y | Move（移動） | `M 50,25` |
| L x,y | Line（直線） | `L 50,80` |
| C x1,y1 x2,y2 x,y | Cubic curve（3次曲線） | `C 30,25 20,35 20,50` |
| Q x1,y1 x,y | Quadratic curve（2次曲線） | `Q 45,8 40,10` |
| Z | Close path（閉じる） | `Z` |

**Qコマンドの詳しい使い方は → [SVG調整ガイド.md](SVG調整ガイド.md) 参照**

---

#### リンゴボタンの構成

```html
<svg viewBox="0 0 100 100">
  <!-- 1. 葉っぱ（path） -->
  <path d="M 48,15 Q 45,8 40,10..." fill="#8bc34a" />

  <!-- 2. 茎（path） -->
  <path d="M 48,15 L 50,25" stroke="#8d6e63" stroke-width="2" />

  <!-- 3. リンゴ本体（path） -->
  <path d="M 50,25 C 30,25..." fill="#f48fb1" />

  <!-- 4. ハイライト（ellipse） -->
  <ellipse cx="38" cy="40" rx="8" ry="12" fill="#ffc1e3" opacity="0.6" />

  <!-- 5. テキスト（text） -->
  <text x="50" y="58">YES</text>
</svg>
```

#### よく使う属性

- `fill` = 塗りつぶしの色
- `stroke` = 線の色
- `stroke-width` = 線の太さ
- `opacity` = 透明度（0〜1）
- `cx, cy` = 円の中心座標
- `rx, ry` = 楕円の半径

**詳しい調整方法は `SVG調整ガイド.md` を参照！**

---

### xmlns（名前空間）とは？

#### 基本
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
     ↑ これが名前空間の宣言
```

**xmlns** = XML Namespace（エックスエムエル・ネームスペース）の略

#### 何のため？

「このタグはSVG用だよ」とブラウザに教えるため。

**例：同じ名前のタグ問題**
```html
<!-- HTMLの<a>タグ = リンク -->
<a href="...">クリック</a>

<!-- SVGの<a>タグ = 別の意味 -->
<svg>
  <a>...</a>
</svg>
```

同じ`<a>`でもHTMLとSVGで意味が違う！
→ 名前空間で区別する

#### URLだけど、アクセスしない

```
http://www.w3.org/2000/svg
↑ これはただの「識別子（名札）」
  実際にこのURLにアクセスするわけではない
```

**なぜURLっぽい？**
- 世界中で重複しないようにするため
- W3C（Web標準を作る組織）が管理している

#### 省略できる？

**HTML5に埋め込む場合：**
```html
<!DOCTYPE html>
<html>
<body>
  <!-- 省略してもOK -->
  <svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" />
  </svg>
</body>
</html>
```

**でも書いておく方が安全** → 古いブラウザ対応

#### まとめ

- `xmlns="http://www.w3.org/2000/svg"` = SVGの名札
- タグの名前がHTMLと被っても区別できる
- HTML5では省略可能だけど、書いておく方が無難

#### 自分で書くときはどうする？

**答え：常に `xmlns="http://www.w3.org/2000/svg"` をそのまま使う**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- いつもこの値 ↑ -->
</svg>
```

**理由：**
- これはSVG仕様で**決められた固定値**
- 自分で考える必要はない
- SVGを書くときは**常にこのURLを使う**

**他の名前空間の例：**
- SVG → `http://www.w3.org/2000/svg`（固定）
- MathML → `http://www.w3.org/1998/Math/MathML`（固定）
- XHTML → `http://www.w3.org/1999/xhtml`（固定）

→ **すべて決められた値なので、コピペでOK！**

---

### SVGの描画順序（重要！）

#### 発見
SVGは**上から順番に描画される** → 後に書いた要素が上に表示される（重なる）

#### 例：リンゴの軸は本体の後に書く

```html
<svg viewBox="0 0 100 100">
  <!-- ❌ 軸を先に書くと、リンゴ本体に隠れる -->
  <path d="M 45,28 Q 50,23 55,28" stroke="#8d6e63" />
  <path class="apple-body" d="M 50,25 C 30,25..." fill="#E89B9B" />

  <!-- ✅ リンゴ本体の後に軸を書く → 上に表示される -->
  <path class="apple-body" d="M 50,25 C 30,25..." fill="#E89B9B" />
  <path d="M 45,28 Q 50,23 55,28" stroke="#8d6e63" />
</svg>
```

#### 描画の順番（レイヤー構造）

```
下層（最初に描画）
├─ 1. リンゴ本体
├─ 2. ハイライト
├─ 3. 茎
├─ 4. 葉っぱ
└─ 5. テキスト
上層（最後に描画）← 一番上に表示される
```

**コードの順序 = 表示の重なり順**
- 最初に書いた要素 → 一番下
- 最後に書いた要素 → 一番上

#### CSSのz-indexとの違い

| | **CSS** | **SVG** |
|---|---|---|
| **重なり順の制御** | `z-index`プロパティ | コードの記述順 |
| **変更方法** | CSSで後から変更可能 | HTMLの順序を変える必要がある |

**まとめ：**
- SVGには`z-index`はない
- **書いた順番が重なり順**を決める
- 上に表示したい要素は**後に書く**

---

## 2025/12/4 - JavaScript基礎

### 1. innerHTMLで改行を有効にする

#### 問題
`textContent`を使うと、HTMLタグ（`<br>`など）が文字列としてそのまま表示されてしまう。

#### 解決方法
`innerHTML`を使うことで、HTMLタグを解釈して改行が有効になる。

```javascript
// ❌ 改行されない
mainButton.textContent = "私のこと思い出したら<br>このボタン押してね？";
// 表示: 私のこと思い出したら<br>このボタン押してね？

// ✅ 改行される
mainButton.innerHTML = "私のこと思い出したら<br>このボタン押してね？";
// 表示: 私のこと思い出したら
//      このボタン押してね？
```

#### 注意点
- ボタン要素で改行を有効にするには、CSSに`white-space: normal;`を追加する必要がある
- `innerHTML`はHTMLタグを解釈するので、ユーザー入力を直接入れる場合はセキュリティに注意

---

### 2. disabledプロパティでボタンを無効化

#### 概要
`disabled`プロパティを使うと、ボタンをクリックできなくする（無効化する）ことができる。

#### 使い方
```javascript
// ボタンを無効化
mainButton.disabled = true;

// ボタンを有効化
mainButton.disabled = false;
```

#### 実際の使用例
22回目のメッセージ表示時に、ボタンを2.5秒間無効化する：

```javascript
if (count % 22 === 0 && count !== 0) {
  // ボタンを一時的に無効化
  mainButton.disabled = true;
  mainButton.style.opacity = "0.5";        // 見た目を薄くする
  mainButton.style.cursor = "not-allowed"; // カーソルを変更

  // 2.5秒後にボタンを再び有効化
  setTimeout(function() {
    mainButton.disabled = false;
    mainButton.style.opacity = "1";
    mainButton.style.cursor = "pointer";
  }, 2500);
}
```

---

### 3. Math.random()でランダム表示 - なぜarrayを引数にするのか？

#### 関数の定義
```javascript
function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}
```

#### なぜarrayを引数にするのか？

**理由1: 関数の再利用性**

`array`を引数にすることで、**どんな配列でも**この関数を使えるようになる。

```javascript
// triggers1配列で使う
mainButton.innerHTML = triggers1[getRandomIndex(triggers1)];

// messages1配列で使う
message.innerHTML = messages1[getRandomIndex(messages1)];
```

もし引数を使わずに書くと...

```javascript
// ❌ triggers1専用の関数
function getRandomIndexForTriggers() {
  return Math.floor(Math.random() * triggers1.length);
}

// ❌ messages1専用の関数
function getRandomIndexForMessages() {
  return Math.floor(Math.random() * messages1.length);
}
```

同じようなコードを何度も書く必要がある！

**理由2: 配列の長さが変わっても対応できる**

`array.length`を使うことで、配列の要素数が変わっても自動的に対応できる。

```javascript
// messages1が26個でも50個でも100個でも動く
message.innerHTML = messages1[getRandomIndex(messages1)];
```

**理由3: テストしやすい**

引数を渡すことで、どんなデータでもテストできる。

```javascript
// テスト用の小さい配列で試せる
const testArray = ["A", "B", "C"];
console.log(getRandomIndex(testArray)); // 0, 1, 2 のどれか
```

#### Math.random()の仕組み

```javascript
Math.random()  // 0以上1未満のランダムな小数 (例: 0.7234)
Math.random() * array.length  // 配列の長さを掛ける (例: 0.7234 * 50 = 36.17)
Math.floor(...)  // 小数点以下を切り捨て (例: 36)
```

**例:** 配列が50個の場合
- `Math.random()`が0.7234だとすると
- `0.7234 * 50 = 36.17`
- `Math.floor(36.17) = 36`
- → `array[36]`が選ばれる

---

### まとめ（2025/12/4）

1. **innerHTML** = HTMLタグを解釈して改行できる
2. **disabled** = ボタンを無効化/有効化できる
3. **引数を使う理由** = 同じ関数を色々な配列で再利用できるから便利！
