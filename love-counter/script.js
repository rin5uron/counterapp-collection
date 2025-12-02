const mainButton = document.getElementById('mainButton');
const message = document.getElementById('message');
const countDisplay = document.getElementById('count');
const specialMessageElement = document.getElementById('specialMessage');
let count = 0;

let triggers1 = [
  "私のこと好き？<br>YES",
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
  "そういえばこないだの話の続き気になる！今すぐ話して？",
  "今日の「がんばったで賞」は何？",
  "いまどんな気分？",
  "今日の小さな幸せ教えて〜",
  "最近買ってよかったものある？",
];

// ランダムなインデックスを取得する関数
function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

// 初期表示：ランダムなボタンテキストを設定
mainButton.innerHTML = triggers1[getRandomIndex(triggers1)];

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
  } else {
    specialMessageElement.style.display = "none";
  }

  // 次のボタンテキストをランダムに設定
  mainButton.innerHTML = triggers1[getRandomIndex(triggers1)];
});
  
