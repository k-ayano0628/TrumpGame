const apiUrl = "https://deckofcardsapi.com/api/deck/";
let deckId = "";//デッキのID
let sutehuda = ""; //捨て札のパイル
let banoCard = ""; //場に出たカードのパイル
let currentSuit = "";//選択したカードのスート
let currentSum = 0;//選択したカードの値
let selectedCards = [];//選択したカード
let remainingCard = 0;//山札の残りのカード

window.addEventListener('DOMContentLoaded', async () => {
    let response = await fetch(apiUrl + "new/shuffle/?cards=AS,2S,3S,4S,5S,6S,7S,8S,9S,JS,QS,KS,AH,2H,3H,4H,5H,6H,7H,8H,9H,JH,QH,KH,AD,2D,3D,4D,5D,6D,7D,8D,9D,JD,QD,KD,AC,2C,3C,4C,5C,6C,7C,8C,9C,JC,QC,KC");
    let cards = await response.json();
    const yotubaDiv = document.getElementById("yotuba");
    yotubaDiv.innerHTML = "";

    //IDを入れる
    deckId = cards.deck_id;
    console.log(deckId);

    //カードの表示
    response = await fetch(apiUrl + deckId + "/draw/?count=16");
    cards = await response.json();
    remainingCard = cards.remaining;

    console.log(remainingCard);

    for (let i = 0; i < 16; i++) {
        const cardImage = document.getElementById("card" + (i + 1));

        //値とスートと画像を入れる
        cardImage.dataset.code = cards.cards[i].code;
        cardImage.dataset.value = cards.cards[i].value;
        cardImage.dataset.suit = cards.cards[i].suit;
        cardImage.src = cards.cards[i].image;

        //banoCardパイル処理
        if (banoCard === "") {
            banoCard = cards.cards[i].code;
        } else {
            banoCard += "," + cards.cards[i].code;
        }

        //カードをクリックしたときの機能を追加
        cardImage.addEventListener('click', () => cardClick(cardImage));
    }

    //banoCardパイルにカードを入れる
    response = await fetch(apiUrl + deckId + "/pile/banoCard/add/?cards=" + banoCard);
    cards = await response.json();
    banoCard = "";

    //山札を表示
    const yamahudaImage = document.getElementById("yamahuda");
    yamahudaImage.src = "https://deckofcardsapi.com/static/img/back.png";
});

//カードをクリックしたときの機能
function cardClick(cardImage) {
    if (cardImage.classList.contains('selected-card')) {
        return;
    }

    // クリックされたカードに `selected-card` クラスを追加
    cardImage.classList.add('selected-card');

    const cardValue = getCardValue(cardImage.dataset.value);
    const cardSuit = cardImage.dataset.suit;

    // 異なるスートが選択された場合、値をリセット
    if (currentSuit && currentSuit !== cardSuit) {
        initializCard()
        console.log("test");
        return; 
    }

    // 現在のスートと合計と選択したカードを更新
    currentSuit = cardSuit;
    currentSum += cardValue;
    selectedCards.push(cardImage);

    console.log(selectedCards[0]);

    //JACK・QUEEN・KING用の処理
    if (currentSum === 100 || currentSum === 200) {

    } else if (currentSum === 300) { // JACK・QUEEN・KINGの場合カードを捨てて山札からカードを入れる
        selectedCards.forEach(card => replaceCards(card));
        initializCard()
    } else if (currentSum > 15) { // 値が15を超えたら値をリセット
        initializCard();
    } else if (currentSum == 15) { // 15の場合カードを捨てて山札からカードを入れる
        selectedCards.forEach(card => replaceCards(card));
        initializCard();
    }
}

//カードのがAの場合は1、JACK・QUEEN・KINGの場合は100として変換
function getCardValue(value) {
    if (value === "ACE") return 1;
    if (value === "JACK" || value === "QUEEN" || value === "KING") return 100;
    return parseInt(value);
}

//カードと選択したカードリストを初期化
function initializCard() {
    // 枠線を消去
    document.querySelectorAll('.wrapper img').forEach(card => {
        card.classList.remove('selected-card');
    });

    currentSuit ="";
    currentSum = 0;
    selectedCards = [];
}

//値が15の場合の処理
async function replaceCards(cardImage) {
    //山札が0枚の場合カードを消す
    if (remainingCard === 0) {
        // 値とスートと画像を入れる
        cardImage.dataset.value = 0;
        cardImage.dataset.suit = "";
        cardImage.src = "";
        emptyCard++;

        //sutehudaパイルにカードを入れる
        sutehuda += "," + cardImage.dataset.code;
        const response = await fetch(apiUrl + deckId + "/pile/sutehuda/add/?cards=" + sutehuda);
        const cards = await response.json();

        //すべてのカードの枠が空いたらゲームクリア画面に遷移する
        if (emptyCard >= 16) {
            window.location.href = "gameClear.html"
        }
    } else {
        //sutehudaパイルにカードを入れる
        if (sutehuda == "") {
            sutehuda = cardImage.dataset.code;
        } else {
            sutehuda += "," + cardImage.dataset.code;
        }
        let response = await fetch(apiUrl + deckId + "/pile/sutehuda/add/?cards=" + sutehuda);
        let cards = await response.json();

        //山札からカードを配置する
        response = await fetch(apiUrl + deckId + "/draw/?count=1");
        cards = await response.json();
        remainingCard = cards.remaining;

        console.log(remainingCard);

        // 値とスートと画像を入れる
        cardImage.dataset.code = cards.cards[0].code;
        cardImage.dataset.value = cards.cards[0].value;
        cardImage.dataset.suit = cards.cards[0].suit;
        cardImage.src = cards.cards[0].image;

        //banoCardパイルにカードを入れる
        banoCard = cards.cards[0].code;
        response = await fetch(apiUrl + deckId + "/pile/banoCard/add/?cards=" + banoCard);
        cards = await response.json();
        banoCard = "";
    }
}

//シャッフル機能
document.getElementById('resetButton').addEventListener('click', async () => {
    let response = await fetch(apiUrl + deckId + "/pile/banoCard/return/");
    let cards = await response.json();
    const yotubaDiv = document.getElementById("yotuba");
    yotubaDiv.innerHTML = "";

    //IDを入れる
    deckId = cards.deck_id;
    console.log(deckId);

    //カードの表示
    response = await fetch(apiUrl + deckId + "/draw/?count=16");
    cards = await response.json();
    remainingCard = cards.remaining;

    console.log(remainingCard);

    for (let i = 0; i < 16; i++) {
        const cardImage = document.getElementById("card" + (i + 1));

        //値とスートと画像を入れる
        cardImage.dataset.code = cards.cards[i].code;
        cardImage.dataset.value = cards.cards[i].value;
        cardImage.dataset.suit = cards.cards[i].suit;
        cardImage.src = cards.cards[i].image;

        //banoCardパイル処理
        if (banoCard === "") {
            banoCard = cards.cards[i].code;
        } else {
            banoCard += "," + cards.cards[i].code;
        }
    }

    //banoCardパイルにカードを入れる
    response = await fetch(apiUrl + deckId + "/pile/banoCard/add/?cards=" + banoCard);
    cards = await response.json();
    banoCard = "";

    initializCard()
});







let timerInterval;

window.addEventListener('DOMContentLoaded', () => {
    // タイマーの表示
    const timerDisplay = document.getElementById('timer');
    const startTime = localStorage.getItem('startTime');

    if (startTime) {
        const start = parseInt(startTime);
        const now = Date.now();
        const elapsed = now - start;

                timerInterval = setInterval(() => {
                    const elapsedTime = Date.now() - start;
                    const seconds = Math.floor((elapsedTime / 1000) % 60);
                    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
                    timerDisplay.textContent = `経過時間: ${minutes}分 ${seconds}秒`;
                }, 1000);
            }

    // デッキの初期化とカードの描画
    //initializeDeck();
});

// デッキの初期化
// async function initializeDeck() {
//     const apiUrl = "https://deckofcardsapi.com/api/deck/";
//     const response = await fetch(apiUrl + "new/shuffle/?deck_count=1");
//     const kards = await response.json();
//     const deckId = kards.deck_id;

//     const yotubaDiv = document.getElementById("yotuba");
//     yotubaDiv.innerHTML = "";

//     response = await fetch(apiUrl + deckId + "/draw/?count=16");
//     const cards = await response.json();
//     remainingCard = cards.remaining;

//     for (let i = 0; i < 16; i++) {
//         const cardImage = document.getElementById("card" + (i + 1));

//         cardImage.dataset.value = cards.cards[i].value;
//         cardImage.dataset.suit = cards.cards[i].suit;
//         cardImage.src = cards.cards[i].image;

//         cardImage.addEventListener('click', () => cardClick(cardImage));
//     }

//     const yamahudaImage = document.getElementById("yamahuda");
//     yamahudaImage.src = "https://deckofcardsapi.com/static/img/back.png";
// }

// ゲームクリア時の処理
async function handleGameClear() {
    clearInterval(timerInterval);
    const timerDisplay = document.getElementById('timer');
    const finalTime = timerDisplay.textContent;

    localStorage.setItem('gameTime', finalTime);
    window.location.href = "gameClear.html";
}

