const apiUrl = "https://deckofcardsapi.com/api/deck/";
let deckId = "";//デッキのID
let sutehuda = ""; //捨て札のパイル
let banoCard = ""; //場に出たカードのパイル
let currentSuit = "";//選択したカードのスート
let currentSum = 0;//選択したカードの値
let selectedCards = [];//選択したカード
let remainingCard = 0;//山札の残りのカード
let emptyCard = 0; //空になった場の数

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
    await fetch(apiUrl + deckId + "/pile/banoCard/add/?cards=" + banoCard);
    banoCard = "";

    //山札を表示
    const yamahudaImage = document.getElementById("yamahuda");
    yamahudaImage.src = "https://deckofcardsapi.com/static/img/back.png";
});

// カードをクリックしたときの機能
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
        initializeCard();
        return;
    }


    // 現在のスートと合計と選択したカードを更新
    currentSuit = cardSuit;
    currentSum += cardValue;
    selectedCards.push(cardImage);

    //JACK・QUEEN・KING用の処理
    if (currentSum === 100 || currentSum === 200) {
        // 何もしない（条件に合わせて処理追加可能）
    } else if (currentSum === 300 || currentSum === 15) { // JACK・QUEEN・KINGを選択または15の場合カードを捨てて山札からカードを入れる
        replaceCards().then(() => {
            initializeCard();
        });
    } else if (currentSum > 15) { // 値が15を超えたら値をリセット
        initializeCard();
    }
}

// カードと選択したカードリストを初期化
function initializeCard() {
    // 枠線を消去
    document.querySelectorAll('.wrapper img').forEach(card => {
        card.classList.remove('selected-card');
    });

    currentSuit = "";
    currentSum = 0;
    selectedCards = [];
}

// カードの値がAの場合は1、JACK・QUEEN・KINGの場合は100として変換
function getCardValue(value) {
    if (value === "ACE") return 1;
    if (value === "JACK" || value === "QUEEN" || value === "KING") return 100;
    return parseInt(value);
}

// 山札のカードを引く処理
async function replaceCards() {
    // 捨て札パイルにカードを入れる
    if (sutehuda === "") {
        sutehuda = selectedCards[0].dataset.code;
    }
    for (let i = 0; i < selectedCards.length; i++) {
        sutehuda += "," + selectedCards[i].dataset.code;
    }
    

    // 山札が0枚の場合カードを消す
    if (remainingCard === 0 ) {//===0に直す
        selectedCards.forEach(card => {
            card.dataset.value = 0;
            card.dataset.suit = "";
            card.src = "";
        });
        emptyCard += selectedCards.length;

        // 捨て札パイルにカードを追加
        await fetch(apiUrl + deckId + "/pile/sutehuda/add/?cards=" + sutehuda);


        // 全てのカードの枠が空いたらゲームクリア画面に遷移する
        if (emptyCard >= 16) {//>=16に直す
            handleGameClear();
        }
    } else {
        // 捨て札パイルにカードを追加
        await fetch(apiUrl + deckId + "/pile/sutehuda/add/?cards=" + sutehuda);

        // 山札からカードを引く
        const response = await fetch(apiUrl + deckId + "/draw/?count=" + selectedCards.length);
        const cards = await response.json();
        remainingCard = cards.remaining;

        console.log(remainingCard);

        // 引いたカードを場に配置
        selectedCards.forEach((card, index) => {
            card.dataset.code = cards.cards[index].code;
            card.dataset.value = cards.cards[index].value;
            card.dataset.suit = cards.cards[index].suit;
            card.src = cards.cards[index].image;
            //banoCardパイル処理
            if (banoCard === "") {
                banoCard = cards.cards[index].code;
            } else {
                banoCard += "," + cards.cards[index].code;
            }
        });

        // banoCardパイルに追加
        await fetch(apiUrl + deckId + "/pile/banoCard/add/?cards=" + banoCard);
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
    await fetch(apiUrl + deckId + "/pile/banoCard/add/?cards=" + banoCard);
    banoCard = "";
    initializeCard();
});






let timerInterval;

window.addEventListener('DOMContentLoaded', () => {
    // タイマーの表示
    localStorage.setItem('startTime', Date.now());
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
});

// ゲームクリア時の処理
async function handleGameClear() {
    clearInterval(timerInterval);
    const timerDisplay = document.getElementById('timer');
    const finalTime = timerDisplay.textContent;

    console.log(finalTime);

    localStorage.setItem('gameTime', finalTime);
    window.location.href = "gameClear.html";
}
//モーダル用
function buttonClick() {
    $(".modal").fadeIn();
}

$(".js-modal-close").on("click", function () {
    $(".modal").fadeOut();
    return false;
});

