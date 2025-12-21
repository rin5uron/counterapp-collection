/**
 * ============================================
 * LINE送信API (Vercel Serverless Function)
 * ============================================
 *
 * 【役割】
 * フロントエンドから受け取ったメッセージをLINEに送信する
 *
 * 【処理の流れ】
 * 1. CORSヘッダーを設定（フロントエンドからのアクセスを許可）
 * 2. リクエストメソッドを検証（POSTのみ許可）
 * 3. メッセージの内容を検証（空文字チェック）
 * 4. 環境変数の存在を確認（LINEの認証情報）
 * 5. LINE Messaging APIでメッセージを送信
 * 6. 成功/失敗のレスポンスを返す
 *
 * 【必要な環境変数】
 * - LINE_CHANNEL_ACCESS_TOKEN: LINEボットの認証トークン
 * - LINE_USER_ID: メッセージの送信先ユーザーID
 */

// LINE Bot SDKからClientクラスをインポート
// Clientクラス = LINE APIと通信するための機能を提供
const { Client } = require('@line/bot-sdk');

// ========================================
// LINE APIの設定
// ========================================
const config = {
  // チャネルアクセストークン（LINE Developersで取得）
  // これがないとLINE APIにアクセスできない
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

// LINE APIクライアントを作成
// このclientを使ってメッセージを送信する
const client = new Client(config);

// ========================================
// メイン処理（Vercel Serverless Function）
// ========================================
// Vercelがこの関数を自動的に/api/send-messageとして公開する
module.exports = async (req, res) => {

  // ----------------------------------------
  // ステップ1: CORSヘッダーの設定
  // ----------------------------------------
  // CORS = Cross-Origin Resource Sharing（オリジン間リソース共有）
  // フロントエンド（love-counter）から異なるドメインのAPIを呼び出すために必要

  // すべてのオリジン（ドメイン）からのアクセスを許可
  // '*' = どのウェブサイトからでもこのAPIを呼び出せる
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 許可するHTTPメソッドを指定
  // POST = データ送信、OPTIONS = プリフライトリクエスト（事前確認）
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // 許可するリクエストヘッダーを指定
  // Content-Type = JSONデータを送る際に必要
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ----------------------------------------
  // ステップ2: プリフライトリクエストへの対応
  // ----------------------------------------
  // プリフライトリクエスト = ブラウザが本番リクエストの前に送る「確認リクエスト」
  // OPTIONSメソッドで送られてくる
  // これに200 OKを返さないと、本番のPOSTリクエストが送られない
  if (req.method === 'OPTIONS') {
    // 200 OKを返してプリフライトを完了
    return res.status(200).end();
  }

  // ----------------------------------------
  // ステップ3: HTTPメソッドの検証
  // ----------------------------------------
  // POSTメソッド以外は受け付けない
  // GET, PUT, DELETEなどが来たら405エラーを返す
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ----------------------------------------
  // ステップ4: メイン処理（メッセージ送信）
  // ----------------------------------------
  try {
    // リクエストボディからメッセージ、ユーザーID、画像URLを取得
    // フロントエンド（LIFF）から { userId: "Uxxxxx", message: "こんにちは", imageUrl: "https://..." } という形式で送られてくる
    const { userId, message, imageUrl } = req.body;

    // userIdが存在しない → NG
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' });
    }

    // メッセージまたは画像のどちらかが必要
    if ((!message || typeof message !== 'string' || message.trim() === '') && !imageUrl) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    // ---------------------------------
    // 環境変数の検証
    // ---------------------------------
    // LINE_CHANNEL_ACCESS_TOKEN が設定されているか確認
    // これがないとLINE APIにアクセスできない
    if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
      console.error('LINE_CHANNEL_ACCESS_TOKEN is not set');
      // 500 Internal Server Error = サーバー側の設定ミス
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // ---------------------------------
    // LINEにメッセージを送信
    // ---------------------------------
    // pushMessage = ユーザーに対してメッセージを「プッシュ配信」
    // （ユーザーからのメッセージに返信するreplyMessageとは違う）
    const messages = [];

    // テキストメッセージ
    if (message && message.trim() !== '') {
      messages.push({
        type: 'text',
        text: message
      });
    }

    // 画像
    if (imageUrl) {
      messages.push({
        type: 'image',
        originalContentUrl: imageUrl,
        previewImageUrl: imageUrl
      });
    }

    // メッセージを送信
    await client.pushMessage(userId, messages);

    // 成功ログを出力（Vercelのログで確認できる）
    console.log('Message sent successfully to userId:', userId);

    // フロントエンドに成功レスポンスを返す
    // 200 OK = 正常に処理完了
    res.status(200).json({
      success: true,
      message: 'Message sent to LINE'
    });

  } catch (error) {
    // ----------------------------------------
    // エラーハンドリング
    // ----------------------------------------
    // LINE APIの呼び出しが失敗した場合などに実行される

    // エラーの内容をログに出力
    console.error('Error sending message:', error);

    // LINE APIからのエラーレスポンスがある場合は詳細を出力
    // 例: トークンが無効、ユーザーIDが間違っている、など
    if (error.response) {
      console.error('LINE API Error Response:', error.response.data);
    }

    // フロントエンドにエラーレスポンスを返す
    // 500 Internal Server Error = サーバー側で問題が発生
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message  // エラーの詳細（デバッグ用）
    });
  }
};
