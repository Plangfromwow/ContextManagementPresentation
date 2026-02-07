(function () {
  const prev = document.body.dataset.prev;
  const next = document.body.dataset.next;
  const TOTAL_SLIDES = 14;

  // ── Determine current slide number from filename ──
  const path = window.location.pathname;
  const match = path.match(/(\d+)-/);
  const currentSlide = match ? parseInt(match[1], 10) : 0;

  // ── Progress Bar ──
  if (currentSlide > 0) {
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.style.width = ((currentSlide / TOTAL_SLIDES) * 100) + "%";
    document.body.appendChild(bar);

    // ── Slide Counter ──
    const counter = document.createElement("div");
    counter.className = "slide-counter";
    counter.textContent = String(currentSlide).padStart(2, "0") + " / " + TOTAL_SLIDES;
    document.body.appendChild(counter);
  }

  // ── Keyboard Navigation ──
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && prev) {
      navigateTo(prev);
    }
    if (event.key === "ArrowRight" && next) {
      navigateTo(next);
    }
  });

  // ── Touch/Swipe Navigation ──
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 60) {
      if (diff > 0 && next) navigateTo(next);
      if (diff < 0 && prev) navigateTo(prev);
    }
  }, { passive: true });

  // ── Smooth Page Transition ──
  function navigateTo(url) {
    document.body.style.transition = "opacity 0.2s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = url;
    }, 180);
  }
})();
