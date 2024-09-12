window.addEventListener('DOMContentLoaded', () => {
    const gameTime = localStorage.getItem('gameTime');
    const gameTimeDisplay = document.getElementById('gameTime');

    console.log("ゲームタイム: ", gameTime);  // デバッグ用
    
    if (gameTime) {
        gameTimeDisplay.textContent = `ゲームクリアタイム: ${gameTime}`;
        localStorage.removeItem('startTime');
        localStorage.removeItem('gameTime');
    }
});