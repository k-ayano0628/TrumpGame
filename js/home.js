//モーダル用
function buttonClick() {
    $(".modal").fadeIn();
  }

  $(".js-modal-close").on("click", function () {
    $(".modal").fadeOut();
    return false;
  });