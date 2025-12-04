const mainButton = document.getElementById('mainButton');
const buttonText = mainButton.querySelector('.button-text');
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
  "おなかすいたから<br>私のおうちまでUberしに来て！",
  "今のお空の写真送って🌞☁️☔️🌝",
  "明日の予定全部おしえて！",
  "今日なにしてたの〜？",
  "もしかして私のこと好き？",
  "今日の出来事ひとつだけシェアして！",
  "最近聴いてる歌教えて",
  "そういえばこないだの話の続き気になる！<br>今すぐ話して？",
  "今日の「がんばったで賞」は何？",
  "いまどんな気分？",
  "今日の小さな幸せ教えて〜",
  "最近買ってよかったものある？",
  "好きなアイス教えて",
  "好きな果物は何？",
  "好きな色教えて〜",
  "今、目の前に何がある？",
  "いま好きな人いる？",
  "今日のコーデ見せて👗",
  "いま何食べたい？",
  "週末の予定は？",
  "最近ハマってること教えて",
  "私のこと何パーセント好き？",
  "好きな季節教えて〜",
  "朝型？夜型？",
  "今日の天気どう？",
  "最近笑ったこと教えて😊",
  "今、着てる服の色は？",
  "好きな飲み物なに？",
  "今日早く寝る？",
  "明日楽しみなことある？",
  "最近の口癖教えて",
  "今日の調子は100点満点で何点？",
  "今何時？",
  "好きな数字教えて",
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

  // 22で割り切れるときに特別メッセージを表示
  if (count % 22 === 0 && count !== 0) {
    specialMessageElement.innerHTML = "✨このメッセージの答えを教えてね！✨";
    specialMessageElement.style.display = "block";

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
  
