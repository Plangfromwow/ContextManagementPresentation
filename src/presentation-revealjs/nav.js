(function () {
  const prev = document.body.dataset.prev;
  const next = document.body.dataset.next;

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && prev) {
      window.location.href = prev;
    }
    if (event.key === "ArrowRight" && next) {
      window.location.href = next;
    }
  });
})();
