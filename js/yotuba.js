const apiUrl = "https://deckofcardsapi.com/api/deck/";
let id = "";
let currentSuit = "";
let currentSum = 0;

window.addEventListener('DOMContentLoaded', async () =>{
    let response = await fetch(apiUrl + "new/shuffle/?deck_count=1");
    const kards = await response.json(); 
    const yotubaDiv = document.getElementById("yotuba");
    yotubaDiv.innerHTML = "";

    const name = document.createElement("p");

    //IDを入れる
    id = kards.deck_id;
    // name.textContent = kards.deck_id;

    // yotubaDiv.appendChild(name);

    //カードの表示
    response = await fetch(apiUrl + id + "/draw/?count=16");
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
        }
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}


