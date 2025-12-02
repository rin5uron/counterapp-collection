const mainButton = document.getElementById('mainButton');
const message = document.getElementById('message');
const countDisplay = document.getElementById('count');
let count = 0;

const triggers1 = [
  "私のこと思い出したらこのボタン押してね？",
];

const messages1 = [
  "もう眠いから一緒に寝よ〜",
  "私に会いたい？？え〜〜",
  "今日食べたものの写真送って📷✨",
  "最近おすすめの映画かアニメ教えて〜",
  "声聞きたい！電話して？",
  "いま何してるの？",
  "いまお風呂入ってる、いそがしい",
  "おなかすいた！飯テロしてきて？",
];

// ランダムなインデックスを取得する関数
function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

// 初期表示：ランダムなボタンテキストを設定
mainButton.textContent = triggers1[getRandomIndex(triggers1)];

// ボタンクリック時の処理
mainButton.addEventListener("click", function() {
  count++;
  countDisplay.textContent = count;

  // ランダムなメッセージを表示
  message.textContent = messages1[getRandomIndex(messages1)];

  // 次のボタンテキストをランダムに設定
  mainButton.textContent = triggers1[getRandomIndex(triggers1)];
});
  
