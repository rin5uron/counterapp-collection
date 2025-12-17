/**
 * ============================================
 * LINE Webhook受信API (Vercel Serverless Function)
 * ============================================
 *
 * 【役割】
 * LINEからのWebhook（イベント通知）を受信して処理する
 *
 * 【Webhookとは？】
 * LINEサーバーから「何かイベントが発生したよ！」と通知されるURL
 * 例: ユーザーがメッセージを送った、ボットを友達追加した、など
 *
 * 【処理の流れ】
 * 1. POSTメソッドのみ受け付ける（LINEからの通知はPOST）
 * 2. 環境変数（認証情報）を確認
 * 3. リクエストボディからイベントを取得
 * 4. イベントの種類ごとに処理を振り分け
 *    - メッセージイベント → 自動応答なし（手動返信用）
 *    - フォローイベント → ウェルカムメッセージ
 *    - アンフォローイベント → ログ出力
 * 
 * 【注意】
 * - メッセージイベントでは自動返信を送らない（手動返信用）
 * - LINE公式アカウントの管理画面で「応答メッセージ」も無効化すること
 *   設定 → 応答設定 → 応答メッセージ → OFF
 *
 * 【必要な環境変数】
 * - LINE_CHANNEL_ACCESS_TOKEN: LINEボットの認証トークン
 * - LINE_CHANNEL_SECRET: Webhook検証用シークレット
 *
 * 【LINE Developersでの設定】
 * Webhook URL: https://あなたのドメイン/api/webhook
 */

// LINE Bot SDKから必要な機能をインポート
const { Client, middleware } = require('@line/bot-sdk');

// ========================================
// LINE APIの設定
// ========================================
const config = {
  // チャネルアクセストークン（メッセージを送信するために必要）
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,

  // チャネルシークレット（Webhookの署名検証に使用）
  // LINE側: 「このWebhookは本物のLINEから送られたものですよ」という証明
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// LINE APIクライアントを作成
// このclientを使ってLINEにメッセージを返信する
const client = new Client(config);

// ========================================
// メイン処理（Vercel Serverless Function）
// ========================================
// Vercelがこの関数を自動的に/api/webhookとして公開する
// LINE側はこのURLにイベントを送ってくる
module.exports = async (req, res) => {

  // ----------------------------------------
  // ステップ1: HTTPメソッドの検証
  // ----------------------------------------
  // POSTメソッドのみ受け付ける
  // LINEからのWebhookは必ずPOSTで送られてくる
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ----------------------------------------
    // ステップ2: 環境変数の検証
    // ----------------------------------------
    // LINE APIの認証情報が設定されているか確認
    if (!process.env.LINE_CHANNEL_ACCESS_TOKEN || !process.env.LINE_CHANNEL_SECRET) {
      console.error('LINE credentials are not set');
      // 500 Internal Server Error = サーバー側の設定ミス
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // ----------------------------------------
    // ステップ3: リクエストボディからイベントを取得
    // ----------------------------------------
    // LINEから送られてくるリクエストの構造:
    // {
    //   "destination": "xxxxxxxxxx",
    //   "events": [
    //     {
    //       "type": "message",
    //       "message": { "type": "text", "text": "こんにちは" },
    //       "replyToken": "xxxxx",
    //       ...
    //     }
    //   ]
    // }
    const events = req.body.events;

    // eventsが存在しない、または配列じゃない場合はエラー
    if (!events || !Array.isArray(events)) {
      console.error('Invalid request body:', req.body);
      // 400 Bad Request = リクエストの形式が不正
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // ----------------------------------------
    // ステップ4: 各イベントを処理
    // ----------------------------------------
    // 複数のイベントが同時に送られてくることがあるので、全て処理
    // Promise.all = 全てのイベント処理を並列実行して、全部完了するまで待つ
    await Promise.all(events.map(handleEvent));

    // LINEに成功レスポンスを返す
    // 200 OKを返さないとLINEが「Webhookが失敗した」と判断してリトライする
    res.status(200).json({ success: true });

  } catch (error) {
    // エラーが発生した場合
    console.error('Error in webhook:', error);
    // 500 Internal Server Error
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ========================================
// イベント処理関数
// ========================================
/**
 * 個々のイベントを処理する関数
 *
 * @param {Object} event - LINEから送られてきたイベントオブジェクト
 *
 * 【イベントの種類】
 * - message: ユーザーがメッセージを送った
 * - follow: ユーザーがボットを友達追加した
 * - unfollow: ユーザーがボットをブロックした
 * - postback: ユーザーがボタンをタップした（今回は未実装）
 * - beacon: ビーコンを検知した（今回は未実装）
 */
async function handleEvent(event) {
  // 受信したイベントをログに出力（デバッグ用）
  console.log('Received event:', event);

  // ========================================
  // パターン1: メッセージイベントの処理
  // ========================================
  // 条件1: イベントタイプが "message"
  // 条件2: メッセージタイプが "text"（画像・スタンプなどは除外）
  if (event.type === 'message' && event.message.type === 'text') {

    // ユーザーが送ったメッセージのテキストを取得
    const userMessage = event.message.text;
    console.log('User message:', userMessage);

    // 自動応答を削除：手動で返信するため
    // Webhookはイベントを受け取るだけで、自動応答しない
    // 
    // 【重要】LINE公式アカウントの管理画面でも「応答メッセージ」を無効化すること
    // 設定 → 応答設定 → 応答メッセージ → OFF
    // これをしないと「受け取りました：ねえねえ」のような自動返信が送られる
  }

  // ========================================
  // パターン2: フォローイベントの処理
  // ========================================
  // ユーザーがLINEボットを友達追加したときに発生
  if (event.type === 'follow') {

    // 友達追加したユーザーのIDをログに出力
    console.log('New follower:', event.source.userId);

    // ---------------------------------
    // ウェルカムメッセージを送信
    // ---------------------------------
    const welcomeMessage = {
      type: 'text',
      text: 'ようこそ！「私のこと好き？ボット」です。\nメッセージが届いたらお知らせします。'
    };

    try {
      // フォローイベントにも replyToken がある
      // 友達追加と同時にメッセージを返せる
      await client.replyMessage(event.replyToken, welcomeMessage);
      console.log('Welcome message sent');
    } catch (error) {
      console.error('Error sending welcome message:', error);
      throw error;
    }
  }

  // ========================================
  // パターン3: アンフォローイベントの処理
  // ========================================
  // ユーザーがLINEボットをブロック（友達削除）したときに発生
  if (event.type === 'unfollow') {

    // アンフォローしたユーザーのIDをログに出力
    console.log('User unfollowed:', event.source.userId);

    // 注意: アンフォローイベントには replyToken がない
    // ブロックしたユーザーにはメッセージを送れないため
    // ログを記録するだけ
  }

  // ========================================
  // その他のイベント
  // ========================================
  // postback, beacon, join, leave など
  // 今回は未実装だが、必要に応じて追加できる

  // 例: ボタンをタップした時のイベント
  // if (event.type === 'postback') {
  //   const data = event.postback.data;
  //   console.log('Postback data:', data);
  //   // ... 処理を追加
  // }
}
