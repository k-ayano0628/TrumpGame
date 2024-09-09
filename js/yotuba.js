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
    const cardValue = getCardValue(cardImage.dataset.value);
    const cardSuit = cardImage.dataset.suit;

    // 異なるスートが選択された場合、値をリセット
    if (currentSuit && currentSuit !== cardSuit) {
        currentSum = 0;
        selectedCards = [];
    }

    // 現在のスートと合計と選択したカードを更新
    currentSuit = cardSuit;
    currentSum += cardValue;
    selectedCards.push(cardImage);

    // 値が15を超えたら値をリセット
    if (currentSum > 15) {
        currentSum = 0;
        selectedCards = [];
    } else if (currentSum == 15) {
        // 15の場合カードを捨てて山札からカードを入れる
        selectedCards.forEach(card => replaceCards(card));
        currentSum = 0;
        selectedCards = [];
    }

    // カードの値と合計を表示
    displayCardInfo(currentSuit, currentSum);
}

//カードのがAの場合は1
function getCardValue(value) {
    if (value === "ACE") return 1;
    if (value === "JACK" || value === "QUEEN" || value === "KING") return 0;
    return parseInt(value);
}

// カードの値と合計を表示
function displayCardInfo(suit, sum) {
    const selectedCardInfo = document.getElementById("selectedCardInfo");
    selectedCardInfo.textContent = `選択したスート: ${suit}, 合計: ${sum}`;
}

//値が15の場合の処理
async function replaceCards(cardImage) {
    let response = await fetch(apiUrl + deckId + "/draw/?count=1");
    const cards = await response.json();
    remainingCard = cards.remaining;

    console.log("Card replaced. Remaining cards:", remainingCard);

    // 値とスートと画像を入れる
    cardImage.dataset.value = cards.cards[0].value;
    cardImage.dataset.suit = cards.cards[0].suit;
    cardImage.src = cards.cards[0].image;
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


