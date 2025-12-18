const mainButton = document.getElementById('mainButton');
const buttonText = mainButton.querySelector('.apple-text');
const message = document.getElementById('message');
const countDisplay = document.getElementById('count');
const specialMessageElement = document.getElementById('specialMessage');
let count = 0;

let triggers1 = [
  "YES",
];

let messages1 = [
  "もう眠いから一緒に寝よ〜",
  "私に会いたい？？え〜〜",
  "今日食べたものの写真送って📷✨",
  "最近おすすめの映画かアニメ教えて〜",
  "声聞きたい！電話して？",
  "いま何してるの？",
  "いまお風呂入ってる、いそがしい",
  "すき♡",
  "りんご食べよ〜",
  "お散歩しに行こ〜",
  "おなかすいた！<br>私のおうちまでUberしに来て！",
  "今のお空の写真送って🌞☁️☔️🌝",
  "明日の予定全部おしえて！",
  "今日なにしてたの〜？",
  "もしかして私のこと好き？",
  "今日の出来事ひとつだけシェアして！",
  "最近聴いてる歌教えて",
  "そういえば！！<br>こないだの話の続き気になる！<br>今すぐ話して？？？",
  "今日の「がんばったで賞」は何？",
  "いまどんな気分？",
  "今日の小さな幸せ教えて〜",
  "最近買ってよかったものある？",
  "好きなアイス教えて",
  "好きな果物は何？",
  "好きな色教えて〜",
  "今、目の前に何がある？",
  "いま好きな人いる？",
  "今日のお肌の調子は？",
  "いま何食べたい？",
  "週末の予定は？",
  "最近ハマってること教えて",
  "私のこと何パーセント好き？",
  "好きな季節教えて〜",
  "朝型？夜型？",
  "今日の天気どう？",
  "最近爆笑したこと教えて！",
  "今、着てる服の色は？",
  "好きな飲み物なに？",
  "今日早く寝る？",
  "明日楽しみなことある？",
  "最近の口癖教えて",
  "今日の調子は100点満点で何点？",
  "今何時？",
  "好きな数字教えて",
  "最近フルーツ食べた？",
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
    specialMessageElement.innerHTML = "✨このメッセージの答えを教えてね！✨";
    specialMessageElement.style.display = "block";

    // LINE送信フォームを表示
    const replySection = document.getElementById('replySection');
    replySection.style.display = "block";

    // 現在のメッセージを送信フォームのdata属性に保存（質問内容を記録）
    replySection.setAttribute('data-question', currentMessage);

    // 画面が動かないように、現在のスクロール位置を保持
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setTimeout(() => {
      window.scrollTo(0, currentScrollTop);
    }, 0);

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
    console.log('=== 送信開始 ===');
    console.log('現在のURL:', window.location.href);
    console.log('isInClient:', liff.isInClient());
    console.log('isLoggedIn:', liff.isLoggedIn());
    console.log('userLineId:', userLineId);

    // LINEアプリ内かチェック
    if (!liff.isInClient()) {
      alert('LINEアプリ内で開いてください。\n外部ブラウザでは送信できません。');
      return;
    }
    
    const messages = [];

    // テキストメッセージ
    if (message && message.trim() !== '') {
      messages.push({
        type: 'text',
        text: message
      });
    }

    // 画像（imgurにアップロード）
    if (imageData) {
      try {
        const imageUrl = await uploadToImgur(imageData);
        messages.push({
          type: 'image',
          originalContentUrl: imageUrl,
          previewImageUrl: imageUrl
        });
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('画像のアップロードに失敗しました: ' + uploadError.message);
        return;
      }
    }

    // liff.sendMessages()で送信
    if (messages.length > 0) {
      console.log('送信するメッセージ:', messages);
      await liff.sendMessages(messages);
      console.log('送信成功！');
      alert('公式LINEアカウントに送信しました！');
    }

  } catch (error) {
    console.error('=== 送信エラー ===');
    console.error('エラー詳細:', error);
    console.error('エラーメッセージ:', error.message);
    console.error('エラースタック:', error.stack);
    
    // エラーメッセージに応じて適切なメッセージを表示
    if (error.message && error.message.includes('not in LINE')) {
      alert('LINEアプリ内で開いてください。\n外部ブラウザでは送信できません。');
    } else if (error.message && error.message.includes('invalid')) {
      alert('送信に失敗しました。\nページを再読み込みして再度お試しください。');
    } else {
      alert('送信エラー: ' + (error.message || '不明なエラーが発生しました'));
    }
  }
}

// 画像選択機能
let selectedImageData = null; // 選択された画像のBase64データ

// 画像選択ボタンのクリックイベント
document.querySelector('.image-label').addEventListener('click', function() {
  document.getElementById('imageInput').click();
});

// 画像選択時の処理
document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      selectedImageData = event.target.result; // Base64データを保存
      // プレビューを表示
      const preview = document.getElementById('imagePreview');
      const previewImage = document.getElementById('previewImage');
      previewImage.src = selectedImageData;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// 画像削除ボタン
document.getElementById('removeImage').addEventListener('click', function() {
  selectedImageData = null;
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('imageInput').value = '';
});

// 送信ボタンのイベントリスナー（連続タップ防止付き）
let isSending = false; // 送信中フラグ

document.getElementById('sendButton').addEventListener('click', async function() {
  // 送信中は何もしない
  if (isSending) return;

  const sendButton = document.getElementById('sendButton');
  const replyInput = document.getElementById('replyInput');
  const replyText = replyInput.value;
  const replySection = document.getElementById('replySection');

  // 質問内容を取得（data属性から）
  const questionText = replySection.getAttribute('data-question') || message.textContent;

  // テキストまたは画像のどちらかがあれば送信可能
  if (replyText.trim() || selectedImageData) {
    try {
      // 送信中フラグを立てる
      isSending = true;
      sendButton.disabled = true;
      sendButton.textContent = '送信中...';

      // 質問と返信を両方含めたメッセージを作成
      const fullMessage = replyText.trim() 
        ? `【my question】\n${questionText.replace(/<br>/g, '\n')}\n\n【your answer】\n${replyText}`
        : `【my question】\n${questionText.replace(/<br>/g, '\n')}\n\n【your answer】\n(画像のみ)`;

      await sendToLine(fullMessage, selectedImageData);

      // 送信後、フォームをクリアして非表示
      replyInput.value = '';
      selectedImageData = null;
      document.getElementById('imagePreview').style.display = 'none';
      document.getElementById('imageInput').value = '';
      replySection.style.display = 'none';
      replySection.removeAttribute('data-question'); // data属性をクリア
    } finally {
      // 確実に再有効化
      isSending = false;
      sendButton.disabled = false;
      sendButton.textContent = '送信';
    }
  } else {
    alert('メッセージまたは画像を入力してください');
  }
});

// キャンセルボタンのイベントリスナー
document.getElementById('cancelButton').addEventListener('click', function() {
  // フォームをクリアして非表示
  const replySection = document.getElementById('replySection');
  document.getElementById('replyInput').value = '';
  selectedImageData = null;
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('imageInput').value = '';
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
      // redirectUriを明示的に指定（現在のURLを使用）
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