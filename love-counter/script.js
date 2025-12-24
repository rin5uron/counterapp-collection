const mainButton = document.getElementById('mainButton');
const buttonText = mainButton.querySelector('.apple-text');
const message = document.getElementById('message');
const countDisplay = document.getElementById('count');
const specialMessageElement = document.getElementById('specialMessage');
let count = 0;

let triggers1 = [
  "YES",
];

// 健全版メッセージ（全員用）
let messages1 = [
  "今日も元気？",
  "最近どう？",
  "またね！",
  "お疲れさま〜",
  "今日はいい天気だね！",
  "最近何してる？",
  "元気にしてた？",
  "また連絡してね",
  "楽しい1日を！",
  "ありがとう！",
  "今日の調子はどう？",
  "最近おもしろいことあった？",
  "今日も頑張ってね",
  "素敵な1日を過ごしてね",
  "また話そうね",
  "今日のランチは何？",
  "最近ハマってることある？",
  "週末は何する予定？",
  "今日も応援してるよ！",
  "いつもありがとう",
  "また会おうね",
  "今日もよろしくね",
  "楽しんでる？",
  "最近の楽しみは何？",
  "今日はリラックスしてね",
  "また遊ぼうね",
  "今日も笑顔でね！",
  "最近おすすめの映画ある？",
  "今日の予定は？",
  "休日は何してる？",
  "今日もファイト！",
  "最近美味しいもの食べた？",
  "今日も素敵な日になりますように",
  "元気出してね",
  "また今度ね",
  "今日のおやつは何？",
  "最近の趣味は？",
  "今日も充実した日を！",
  "また連絡待ってるね",
  "今日も無理しないでね",
  "最近読んだ本ある？",
  "今日もマイペースでね",
  "また会える日を楽しみに",
  "今日も良い日になりますように",
  "最近行きたい場所ある？",
  "今日も応援してます",
  "また話聞かせてね",
  "今日も頑張りすぎないでね",
  "最近嬉しかったことは？",
  "今日も素敵な時間を",
];

// ランダムなインデックスを取得する関数
function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

// 初期表示：ランダムなボタンテキストを設定
buttonText.textContent = triggers1[getRandomIndex(triggers1)];

// ボタンクリック時の処理
mainButton.addEventListener("click", function() {
  count++;
  countDisplay.textContent = count;

  // ランダムなメッセージを表示
  const currentMessage = messages1[getRandomIndex(messages1)];
  message.innerHTML = currentMessage;

  // 22で割り切れるときに特別メッセージとLINE送信フォームを表示
  if (count % 22 === 0 && count !== 0) {
    specialMessageElement.innerHTML = "✨答えを送信してね！✨";
    specialMessageElement.style.display = "block";

    // LINE送信フォームを表示
    document.getElementById('replySection').style.display = "block";

    // 現在のメッセージを送信フォームのdata属性に保存（質問内容を記録）
    document.getElementById('replySection').setAttribute('data-question', currentMessage);

    // ボタンを一時的に無効化
    mainButton.disabled = true;
    mainButton.style.opacity = "0.5";
    mainButton.style.cursor = "not-allowed";

    // 2.5秒後にボタンを再び有効化
    setTimeout(function() {
      mainButton.disabled = false;
      mainButton.style.opacity = "1";
      mainButton.style.cursor = "pointer";
    }, 2500);
  } else {
    specialMessageElement.style.display = "none";
  }

  // 次のボタンテキストをランダムに設定
  buttonText.textContent = triggers1[getRandomIndex(triggers1)];
});

// Imgur APIにアップロードする関数
async function uploadToImgur(imageData) {
  const IMGUR_CLIENT_ID = 'b3625a37cc4b6f4'; // Imgur Anonymous API Client ID（公開OK）

  try {
    // Base64データから "data:image/png;base64," の部分を削除
    const base64Image = imageData.split(',')[1];

    // Imgur APIにPOSTリクエスト
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image,
        type: 'base64'
      })
    });

    if (!response.ok) {
      throw new Error(`Imgur upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data.link; // アップロードされた画像のURL
  } catch (error) {
    console.error('Imgur upload error:', error);
    throw error;
  }
}

// LINEに送信する関数（liff.sendMessages()方式）
async function sendToLine(message, imageData = null) {
  try {
    // デバッグ: 環境情報をログに出力
    console.log('isInClient:', liff.isInClient());
    console.log('isLoggedIn:', liff.isLoggedIn());
    
    let imageUrl = null;
    
    // 画像を先にアップロード（あれば）
    if (imageData) {
      try {
        imageUrl = await uploadToImgur(imageData);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('画像のアップロードに失敗しました: ' + uploadError.message);
        return;
      }
    }

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

    // liff.sendMessages()で送信
    // これは「ユーザーと公式LINEアカウントのチャット」に送信される
    // ユーザーは自分のLINEアカウントでメッセージを確認でき、運営者は公式LINEアカウントの管理画面で確認できる
    if (messages.length > 0) {
      await liff.sendMessages(messages);
      alert('送信しました！\nあなたと公式LINEアカウントのチャットに送信されました。');
    }

  } catch (error) {
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // エラーメッセージに応じて適切なメッセージを表示
    const errorMsg = error.message || '';
    if (errorMsg.includes('not in LINE') || errorMsg.includes('not in client')) {
      alert('LINEアプリ内で開いてください。\n外部ブラウザでは送信できません。');
    } else if (errorMsg.includes('permission') || errorMsg.includes('grant')) {
      alert('メッセージ送信の権限が許可されていません。\n\nこのアプリを再度開いて「許可」をタップしてください。');
    } else {
      alert('送信エラー: ' + (errorMsg || '不明なエラーが発生しました'));
    }
  }
}

// 送信ボタンのイベントリスナー（連続タップ防止付き）
let isSending = false; // 送信中フラグ

document.getElementById('sendButton').addEventListener('click', async function() {
  const sendButton = document.getElementById('sendButton');
  
  // 送信中は何もしない（フラグとdisabledの両方をチェック）
  if (isSending || sendButton.disabled) {
    return;
  }

  const replyInput = document.getElementById('replyInput');
  const replyText = replyInput.value;
  const replySection = document.getElementById('replySection');

  // 質問内容を取得（data属性から）
  const questionText = replySection.getAttribute('data-question') || message.textContent;

  if (replyText.trim()) {
    try {
      // 送信中フラグを立てる（最初に設定）
      isSending = true;
      sendButton.disabled = true;
      sendButton.textContent = '送信中...';
      sendButton.style.pointerEvents = 'none'; // クリックを完全に無効化

      // 質問と返信を両方含めたメッセージを作成
      const fullMessage = `【my question】\n${questionText.replace(/<br>/g, '\n')}\n\n【your answer】\n${replyText}`;

      await sendToLine(fullMessage);

      // 送信後、フォームをクリアして非表示
      replyInput.value = '';
      replySection.style.display = 'none';
      replySection.removeAttribute('data-question'); // data属性をクリア
    } finally {
      // 確実に再有効化
      isSending = false;
      sendButton.disabled = false;
      sendButton.textContent = '送信';
      sendButton.style.pointerEvents = ''; // クリックを再有効化
    }
  } else {
    alert('メッセージを入力してください');
  }
});

// キャンセルボタンのイベントリスナー
document.getElementById('cancelButton').addEventListener('click', function() {
  // フォームをクリアして非表示
  const replySection = document.getElementById('replySection');
  document.getElementById('replyInput').value = '';
  replySection.style.display = 'none';
  replySection.removeAttribute('data-question'); // data属性をクリア
});


// ========================================
// LIFF初期化
// ========================================

let userLineId = null; // ユーザーのLINE ID（グローバル変数）

async function initializeLiff() {
  try {
    // LINEアプリとの連携を開始（開発者用ログ）
    console.log('アプリ読み込み開始...');

    await liff.init({ liffId: '2008641870-nLbJegy4' });

    console.log('アプリ読み込み完了。ログイン状態:', liff.isLoggedIn());

    if (!liff.isLoggedIn()) {
      console.log('ログイン処理中...');
      console.log('現在のURL:', window.location.href);
      // ログイン画面を表示せずに、自動的にログイン
      // redirectUriを明示的に指定
      liff.login({ redirectUri: window.location.href });
      return; // ログインページに遷移するのでここで終了
    }

    // ログイン済みの場合、プロフィール取得
    console.log('ユーザー情報取得中...');
    const profile = await liff.getProfile();
    userLineId = profile.userId;
    console.log('User ID:', userLineId);
    console.log('Display Name:', profile.displayName);

    // 成功時はアラートを表示しない（自然な動作）

  } catch (error) {
    console.error('アプリ読み込みエラー:', error);
    alert('アプリの読み込みに失敗しました。\nしばらく時間をおいてから再度お試しください。');
  }
}

// ページ読み込み時にアプリを初期化（必ず実行）
if (typeof liff !== 'undefined') {
  initializeLiff();
} else {
  console.error('アプリの読み込みに失敗しました');
  alert('アプリの読み込みに失敗しました。\nページを再読み込みしてください。');
}
