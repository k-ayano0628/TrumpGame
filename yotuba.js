const apiUrl = "https://deckofcardsapi.com/api/deck/";
let id = "";
window.addEventListener('DOMContentLoaded', async () =>{
    let response = await fetch(apiUrl + "new/shuffle/?deck_count=1");
    const kards = await response.json(); 
    const pokemonDiv = document.getElementById("yotuba");
    yotubaDiv.innerHTML = "";

    const name = document.createElement("p");

    //IDを入れる
    id = kards.deck_id;
    name.textContent = kards.deck_id;

    yotubaDivDiv.appendChild(name);

    //カードの表示
    response = await fetch(apiUrl + id + "/draw/?count=16");
    const cards = await response.json();

    for (let i = 0; i < 16; i++) {
        const cardImage = document.getElementById("card" + (i + 1));
        cardImage.src = cards.cards[i].image;
    }
});

