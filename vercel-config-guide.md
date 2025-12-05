# Vercel設定ファイル (vercel.json) 詳細ガイド

## このファイルの役割

`vercel.json` は、Vercelでのデプロイ時の動作を制御する設定ファイルです。
このプロジェクトでは、以下の3つの設定を行っています：

1. **Serverless Functionsの設定** (`functions`)
2. **URLリライト設定** (`rewrites`)
3. **HTTPヘッダー設定** (`headers`)

---

## 設定の詳細

### 1. Serverless Functionsの設定

```json
"functions": {
  "api/**/*.js": {
    "memory": 1024,
    "maxDuration": 10
  }
}
```

#### 何をしているか？
`api/` ディレクトリ内のすべての `.js` ファイルを Serverless Function として設定します。

#### 各設定項目の意味

- **`"api/**/*.js"`**
  - `api/` ディレクトリ配下のすべての `.js` ファイルに適用
  - `**` = すべてのサブディレクトリ
  - `*.js` = すべての JavaScript ファイル
  - 例: `api/send-message.js`、`api/webhook.js`

- **`"memory": 1024`**
  - 各 Serverless Function に割り当てるメモリ容量（MB単位）
  - 1024MB = 1GB
  - メモリが多いほど処理速度が速くなる
  - LINE Bot SDKを使うので、余裕を持って1GBに設定

- **`"maxDuration": 10`**
  - 関数の最大実行時間（秒単位）
  - 10秒以内に処理が完了しない場合はタイムアウト
  - LINE APIの応答を待つ時間を考慮して10秒に設定
  - Vercelの無料プランでは最大10秒まで

#### なぜこの設定が必要？
- デフォルトのメモリ（256MB）では不足する可能性がある
- LINE APIとの通信に時間がかかる場合があるため、タイムアウトを設定

---

### 2. URLリライト設定

```json
"rewrites": [
  {
    "source": "/api/(.*)",
    "destination": "/api/$1"
  }
]
```

#### 何をしているか？
`/api/` で始まるリクエストを、対応する Serverless Function にルーティングします。

#### 各設定項目の意味

- **`"source": "/api/(.*)"`**
  - リクエストされたURL（正規表現）
  - `/api/` で始まるすべてのパス
  - `(.*)` = `/api/` の後ろの任意の文字列をキャプチャ
  - 例: `/api/send-message` → `(.*)` の部分は `send-message`

- **`"destination": "/api/$1"`**
  - 実際にアクセスされるパス
  - `$1` = `source` でキャプチャした文字列（`(.*)` の部分）
  - 例: `/api/send-message` → `/api/send-message.js` を実行

#### 実際の動作例

| リクエストURL | 実行されるファイル |
|---------------|-------------------|
| `/api/send-message` | `/api/send-message.js` |
| `/api/webhook` | `/api/webhook.js` |

#### なぜこの設定が必要？
- URLからファイル拡張子（`.js`）を隠すため
- フロントエンドから `/api/send-message` でアクセスできるようにする
- RESTful APIの一般的な命名規則に従う

---

### 3. HTTPヘッダー設定（CORS対応）

```json
"headers": [
  {
    "source": "/api/(.*)",
    "headers": [
      {
        "key": "Access-Control-Allow-Credentials",
        "value": "true"
      },
      {
        "key": "Access-Control-Allow-Origin",
        "value": "*"
      },
      {
        "key": "Access-Control-Allow-Methods",
        "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
      },
      {
        "key": "Access-Control-Allow-Headers",
        "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
      }
    ]
  }
]
```

#### 何をしているか？
CORS（Cross-Origin Resource Sharing）を設定して、フロントエンドからAPIを呼び出せるようにします。

#### CORSとは？
- **C**ross-**O**rigin **R**esource **S**haring（オリジン間リソース共有）
- 異なるドメイン間でのデータのやり取りを許可する仕組み
- セキュリティのため、デフォルトではブラウザが別ドメインへのアクセスをブロックする

#### なぜCORSが必要？
例:
- フロントエンド: `https://love-counter.vercel.app`
- API: `https://love-counter.vercel.app/api/send-message`

同じドメインなので本来は不要ですが、開発環境（`localhost`）からアクセスする場合に必要になります。

#### 各ヘッダーの意味

1. **`Access-Control-Allow-Credentials: true`**
   - 認証情報（Cookie、認証ヘッダー）の送信を許可
   - 今回は使わないが、将来的なユーザー認証に備えて設定

2. **`Access-Control-Allow-Origin: *`**
   - どのドメインからのアクセスを許可するか
   - `*` = すべてのドメインから許可
   - セキュリティを高めたい場合は、特定のドメインを指定
     - 例: `"https://love-counter.vercel.app"`

3. **`Access-Control-Allow-Methods: GET,OPTIONS,PATCH,DELETE,POST,PUT`**
   - 許可するHTTPメソッド
   - `GET` = データ取得
   - `POST` = データ送信（今回使用）
   - `OPTIONS` = プリフライトリクエスト（必須）
   - `PUT`, `PATCH`, `DELETE` = 将来の拡張用

4. **`Access-Control-Allow-Headers: ...`**
   - 許可するリクエストヘッダー
   - `Content-Type` = JSONデータを送る際に必要（重要）
   - `Accept` = レスポンス形式の指定
   - `X-CSRF-Token`, `X-Requested-With` = セキュリティ関連
   - その他 = 一般的なヘッダーをまとめて許可

---

## 完全な設定ファイル

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
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Credentials",
          "value": "true"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
        }
      ]
    }
  ]
}
```

---

## よくある質問

### Q1. `vercel.json` がないとどうなる？
A. Vercelがデフォルト設定でデプロイしますが、以下の問題が発生する可能性があります：
- メモリ不足でエラーが発生
- タイムアウトエラーが発生
- CORSエラーでフロントエンドからAPIを呼び出せない

### Q2. メモリを256MBに減らしても大丈夫？
A. LINE Bot SDKは軽量なので動作する可能性はありますが、余裕を持って1024MBを推奨します。

### Q3. `Access-Control-Allow-Origin: *` はセキュリティ的に大丈夫？
A. 開発・学習用なら問題ありませんが、本番環境では特定のドメインを指定することを推奨します。

### Q4. maxDurationを10秒より長くできる？
A. Vercelの無料プランでは最大10秒です。有料プランでは最大60秒まで延長可能です。

---

## 関連ドキュメント

- [Vercel Functions Documentation](https://vercel.com/docs/functions/serverless-functions)
- [Vercel Configuration Reference](https://vercel.com/docs/projects/project-configuration)
- [CORS Documentation (MDN)](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)

---

**作成日**: 2025-12-05
**更新日**: 2025-12-05
