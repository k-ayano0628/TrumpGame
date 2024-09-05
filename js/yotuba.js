const apiUrl = "https://deckofcardsapi.com/api/deck/";
let deckId = "";
let currentSuit = "";
let currentSum = 0;

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

    for (let i = 0; i < 16; i++) {
        const cardImage = document.getElementById("card" + (i + 1));
        cardImage.src = cards.cards[i].image;

        //値とスートを入れる
        cardImage.dataset.value = cards.cards[i].value;
        cardImage.dataset.suit = cards.cards[i].suit;

        //カードをクリックしたときの機能を追加
        cardImage.addEventListener('click', () => handleCardClick(cardImage));
    }
});

//カードをクリックしたときの機能
function handleCardClick(cardImage) {
    const cardValue = getCardValue(cardImage.dataset.value);
    const cardSuit = cardImage.dataset.suit;

    // 異なるスートが選択された場合、値をリセット
    if (currentSuit && currentSuit !== cardSuit) {
        currentSum = 0;
    }

    // 現在のスートと合計を更新
    currentSuit = cardSuit;
    currentSum += cardValue;

    //値が15を超えたら値をリセット
    if(currentSum > 15){
        currentSum = 0;
    }

    // カードの値と合計を表示
    displayCardInfo(currentSuit, currentSum);
}

//カードのがAの場合は1
function getCardValue(value) {
    if (value === "ACE") return 1;
    //if (value === "JACK" || value === "QUEEN" || value === "KING") return 10;
    return parseInt(value);
}

// カードの値と合計を表示
function displayCardInfo(suit, sum) {
    const selectedCardInfo = document.getElementById("selectedCardInfo");
    selectedCardInfo.textContent = `選択したスート: ${suit}, 合計: ${sum}`;
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