const mainButton = document.getElementById('mainButton');
const message = document.getElementById('message');
let count = 0;
mainButton.addEventListener("click", function() {
    count++;
    message.textContent = `押された回数：${count} 回`;
});

const triggers1 = [
    "暇だったらこのボタン押してね？",
    "さみしくなったらこのボタン押してね？",
    "私のこと思い出したらこのボタン押してね？",
    // ...
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
    // ...
  ];
  
