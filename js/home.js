//モーダル用
function buttonClick() {
    $(".modal").fadeIn();
  }

  $(".js-modal-close").on("click", function () {
    $(".modal").fadeOut();
    return false;
  });

  function startTimer() {
    // タイマーの開始
    window.location.href = 'main.html';
}