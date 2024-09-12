const apiUrl = "https://deckofcardsapi.com/api/deck/";
let deckId = "";//デッキのID
let currentSuit = "";//選択したカードのスート
let currentSum = 0;//選択したカードの値
let selectedCards = [];//選択したカード
let remainingCard = 0;//山札の残りのカード

window.addEventListener('DOMContentLoaded', async () =>{
    let response = await fetch(apiUrl + "new/shuffle/?deck_count=1");
    const kards = await response.json(); 
    const yotubaDiv = document.getElementById("yotuba");
    yotubaDiv.innerHTML = "";

    //IDを入れる
    deckId = kards.deck_id;

    //カードの表示
    response = await fetch(apiUrl + deckId + "/draw/?count=16");
    const cards = await response.json();
    remainingCard = cards.remaining;

    console.log(remainingCard);

    for (let i = 0; i < 16; i++) {
        const cardImage = document.getElementById("card" + (i + 1));
        
        //値とスートと画像を入れる
        cardImage.dataset.value = cards.cards[i].value;
        cardImage.dataset.suit = cards.cards[i].suit;
        cardImage.src = cards.cards[i].image;

        //カードをクリックしたときの機能を追加
        cardImage.addEventListener('click', () => cardClick(cardImage));
    }
     //山札を表示
     const yamahudaImage = document.getElementById("yamahuda");
     yamahudaImage.src = "https://deckofcardsapi.com/static/img/back.png";
});

//カードをクリックしたときの機能
function cardClick(cardImage) {
    // クリックされたカードに `selected-card` クラスを追加
    cardImage.classList.add('selected-card');

    const cardValue = getCardValue(cardImage.dataset.value);
    const cardSuit = cardImage.dataset.suit;

    // 異なるスートが選択された場合、値をリセット
    if (currentSuit && currentSuit !== cardSuit) {
        // 枠線を消去
        document.querySelectorAll('.wrapper img').forEach(card => {
            card.classList.remove('selected-card');
        });
        
        currentSum = 0;
        selectedCards = [];
    }

    // 現在のスートと合計と選択したカードを更新
    currentSuit = cardSuit;
    currentSum += cardValue;
    selectedCards.push(cardImage);

    //JACK・QUEEN・KING用の処理
    if(currentSum === 100 || currentSum === 200){
        
    }else if(currentSum === 300){ // JACK・QUEEN・KINGの場合カードを捨てて山札からカードを入れる
        // 枠線を消去
        document.querySelectorAll('.wrapper img').forEach(card => {
            card.classList.remove('selected-card');
        });

        selectedCards.forEach(card => replaceCards(card));
        currentSum = 0;
        selectedCards = [];
    }else if (currentSum > 15) { // 値が15を超えたら値をリセット
        // 枠線を消去
        document.querySelectorAll('.wrapper img').forEach(card => {
            card.classList.remove('selected-card');
        });

        selectedCards.forEach(card => replaceCards(card));
        currentSum = 0;
        selectedCards = [];
    } else if (currentSum == 15) { // 15の場合カードを捨てて山札からカードを入れる
        // 枠線を消去
        document.querySelectorAll('.wrapper img').forEach(card => {
            card.classList.remove('selected-card');
        });

        selectedCards.forEach(card => replaceCards(card));
        currentSum = 0;
        selectedCards = [];
    }

    // カードの値と合計を表示
    displayCardInfo(currentSuit, currentSum);
}

//カードのがAの場合は1、JACK・QUEEN・KINGの場合は100として変換
function getCardValue(value) {
    if (value === "ACE") return 1;
    if (value === "JACK" || value === "QUEEN" || value === "KING") return 100;
    return parseInt(value);
}

// カードの値と合計を表示
function displayCardInfo(suit, sum) {
    const selectedCardInfo = document.getElementById("selectedCardInfo");
    selectedCardInfo.textContent = `選択したスート: ${suit}, 合計: ${sum}`;
}

//値が15の場合の処理
async function replaceCards(cardImage) {
    //山札が0枚の場合カードを消す
    if(remainingCard === 0){//動作確認のため30を入れてます
        // 値とスートと画像を入れる
        cardImage.dataset.value = 0;
        cardImage.dataset.suit = "";
        cardImage.src = "";
        emptyCard++;
        //すべてのカードの枠が空いたらgゲームクリア画面に遷移する
        if(emptyCard >= 16){
            window.location.href = "gameClear.html"
        }
    }else{
        let response = await fetch(apiUrl + deckId + "/draw/?count=1");
        const cards = await response.json();
        remainingCard = cards.remaining;

        console.log(remainingCard);

        // 値とスートと画像を入れる
        cardImage.dataset.value = cards.cards[0].value;
        cardImage.dataset.suit = cards.cards[0].suit;
        cardImage.src = cards.cards[0].image;
    }
}




    
// リセットボタンにイベントリスナーを追加
document.getElementById('resetButton').addEventListener('click', async () => {
    await loadCards();
    currentSuit = "";
    currentSum = 0;
    displayCardInfo("", 0);
});

// カードをロードする関数
async function loadCards() {
    try {
        // 新しいデッキをシャッフル
        let response = await fetch(apiUrl + "new/shuffle/?deck_count=1");
        const data = await response.json();
        deckId = data.deck_id;

        // 16枚のカードを引く
        response = await fetch(apiUrl + deckId + "/draw/?count=16");
        const cards = await response.json();

        // カード画像を表示
        for (let i = 0; i < 16; i++) {
            const cardImage = document.getElementById("card" + (i + 1));
            cardImage.src = cards.cards[i].image;
            // カードの値とスートを設定
            cardImage.dataset.value = cards.cards[i].value;
            cardImage.dataset.suit = cards.cards[i].suit;
        }
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}
document.getElementById('resetButton').addEventListener('click', async () => {
    await loadCards();
    currentSuit = "";
    currentSum = 0;
    displayCardInfo("", 0);

    // 全てのカードから `selected-card` クラスを削除
    document.querySelectorAll('.wrapper img').forEach(card => {
        card.classList.remove('selected-card');
    });
});







function handleCardClick(cardImage) {
    const cardValue = getCardValue(cardImage.dataset.value);
    const cardSuit = cardImage.dataset.suit;

    // 現在選択されているカードのスートと合計を更新
    if (currentSuit && currentSuit !== cardSuit) {
        currentSum = 0;
        // 現在のスートが異なる場合、枠線を消去
        document.querySelectorAll('.wrapper img').forEach(card => {
            card.classList.remove('selected-card');
        });
    }

    // 現在のスートと合計を更新
    currentSuit = cardSuit;
    currentSum += cardValue;

    // カードの値が15を超えた場合、枠線を消去
    if (currentSum >= 15) {
        currentSum = 0;
        document.querySelectorAll('.wrapper img').forEach(card => {
            card.classList.remove('selected-card');
        });
    } else {
        // クリックされたカードに `selected-card` クラスを追加
        cardImage.classList.add('selected-card');
    }

    // 値が15を超えた場合、赤い枠線を消去
    displayCardInfo(currentSuit, currentSum);
}
//説明用モーダルの処理
function buttonClick() {
    $(".modal").fadeIn();
  }

  $(".js-modal-close").on("click", function () {
    $(".modal").fadeOut();
    return false;
  });//モーダルここまで





  





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
            initializeDeck();
        });

        // デッキの初期化
        async function initializeDeck() {
            const apiUrl = "https://deckofcardsapi.com/api/deck/";
            const response = await fetch(apiUrl + "new/shuffle/?deck_count=1");
            const kards = await response.json();
            const deckId = kards.deck_id;
            
            const yotubaDiv = document.getElementById("yotuba");
            yotubaDiv.innerHTML = "";

            response = await fetch(apiUrl + deckId + "/draw/?count=16");
            const cards = await response.json();
            remainingCard = cards.remaining;

            for (let i = 0; i < 16; i++) {
                const cardImage = document.getElementById("card" + (i + 1));
                
                cardImage.dataset.value = cards.cards[i].value;
                cardImage.dataset.suit = cards.cards[i].suit;
                cardImage.src = cards.cards[i].image;

                cardImage.addEventListener('click', () => cardClick(cardImage));
            }
            
            const yamahudaImage = document.getElementById("yamahuda");
            yamahudaImage.src = "https://deckofcardsapi.com/static/img/back.png";
        }

        // ゲームクリア時の処理
        async function handleGameClear() {
            clearInterval(timerInterval);
            const timerDisplay = document.getElementById('timer');
            const finalTime = timerDisplay.textContent;
            
            localStorage.setItem('gameTime', finalTime);
            window.location.href = "gameClear.html";
        }

