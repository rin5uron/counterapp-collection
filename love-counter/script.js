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
  message.innerHTML = messages1[getRandomIndex(messages1)];

  // 22で割り切れるときに特別メッセージとLINE送信フォームを表示
  if (count % 22 === 0 && count !== 0) {
    specialMessageElement.innerHTML = "✨このメッセージの答えを教えてね！✨";
    specialMessageElement.style.display = "block";

    // LINE送信フォームを表示
    document.getElementById('replySection').style.display = "block";

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
  
// LINEに送信する関数（LIFF対応版）
async function sendToLine(message) {
  try {
    // ユーザーIDが取得できているか確認
    if (!userLineId) {
      alert('LINEアプリで開いてください');
      return;
    }

    // バックエンドにユーザーIDとメッセージを送信
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userLineId,  // 送信者のLINE ID
        message: message
      })
    });

    if (response.ok) {
      alert('LINEに送信しました！');
    } else {
      const error = await response.json();
      alert('送信に失敗しました: ' + (error.error || ''));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('エラーが発生しました');
  }
}

// 送信ボタンのイベントリスナー
document.getElementById('sendButton').addEventListener('click', async function() {
  const replyInput = document.getElementById('replyInput');
  const replyText = replyInput.value;

  if (replyText.trim()) {
    await sendToLine(replyText);
    // 送信後、フォームをクリアして非表示
    replyInput.value = '';
    document.getElementById('replySection').style.display = 'none';
  } else {
    alert('メッセージを入力してください');
  }
});

// キャンセルボタンのイベントリスナー
document.getElementById('cancelButton').addEventListener('click', function() {
  // フォームをクリアして非表示
  document.getElementById('replyInput').value = '';
  document.getElementById('replySection').style.display = 'none';
});


// ========================================
// LIFF初期化
// ========================================

let userLineId = null; // ユーザーのLINE ID（グローバル変数）

async function initializeLiff() {
  try {
    await liff.init({ liffId: '2008641870-nLbJegy4' });

    if (!liff.isLoggedIn()) {
      // ログイン画面を表示せずに、自動的にログイン
      liff.login({ redirectUri: window.location.href });
    } else {
      const profile = await liff.getProfile();
      userLineId = profile.userId;
      console.log('User ID:', userLineId);
      console.log('Display Name:', profile.displayName);
    }
  } catch (error) {
    console.error('LIFF initialization failed', error);
    alert('LINEアプリで開いてください');
  }
}

// ページ読み込み時にLIFFを初期化
window.addEventListener('DOMContentLoaded', function() {
  initializeLiff();
});