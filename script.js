(() => {
  const pages = [...document.querySelectorAll('.sheet')];
  const pageSelect = document.getElementById('pageSelect');
  const currentPage = document.getElementById('currentPage');
  const pageCount = document.getElementById('pageCount');
  const progressBar = document.getElementById('progressBar');
  const prevButtons = [document.getElementById('prevBtn'), document.getElementById('prevBottomBtn')];
  const nextButtons = [document.getElementById('nextBtn'), document.getElementById('nextBottomBtn')];
  const firstBtn = document.getElementById('firstBtn');
  const lastBtn = document.getElementById('lastBtn');
  const printBtn = document.getElementById('printBtn');
  const contentsBtn = document.getElementById('contentsBtn');
  const contentsDialog = document.getElementById('contentsDialog');
  const closeContentsBtn = document.getElementById('closeContentsBtn');
  const homeLink = document.getElementById('homeLink');
  let current = 0;

  function goToPage(index) {
    const target = Math.max(0, Math.min(pages.length - 1, Number(index) || 0));
    current = target;

    pages.forEach((page, i) => {
      const isCurrent = i === current;
      page.hidden = !isCurrent;
      page.classList.toggle('current', isCurrent);
      page.setAttribute('aria-hidden', String(!isCurrent));
    });

    pageSelect.value = String(current);
    currentPage.textContent = current === 0 ? 'Portada' : `Perfil ${String(current).padStart(2, '0')}`;
    pageCount.textContent = `${current + 1} / ${pages.length}`;
    progressBar.style.width = `${((current + 1) / pages.length) * 100}%`;

    [...prevButtons, firstBtn].forEach(button => button.disabled = current === 0);
    [...nextButtons, lastBtn].forEach(button => button.disabled = current === pages.length - 1);
  }

  function previousPage() { goToPage(current - 1); }
  function nextPage() { goToPage(current + 1); }

  prevButtons.forEach(button => button.addEventListener('click', previousPage));
  nextButtons.forEach(button => button.addEventListener('click', nextPage));
  firstBtn.addEventListener('click', () => goToPage(0));
  lastBtn.addEventListener('click', () => goToPage(pages.length - 1));
  pageSelect.addEventListener('change', event => goToPage(event.target.value));
  printBtn.addEventListener('click', () => window.print());
  homeLink.addEventListener('click', event => { event.preventDefault(); goToPage(0); });

  contentsBtn.addEventListener('click', () => {
    if (typeof contentsDialog.showModal === 'function') contentsDialog.showModal();
    else contentsDialog.setAttribute('open', '');
  });
  closeContentsBtn.addEventListener('click', () => {
    if (typeof contentsDialog.close === 'function') contentsDialog.close();
    else contentsDialog.removeAttribute('open');
  });
  contentsDialog.addEventListener('click', event => {
    const item = event.target.closest('[data-go]');
    if (item) {
      goToPage(item.dataset.go);
      if (typeof contentsDialog.close === 'function') contentsDialog.close();
      else contentsDialog.removeAttribute('open');
    }
  });

  document.addEventListener('keydown', event => {
    if (contentsDialog.open && event.key === 'Escape') return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); nextPage(); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); previousPage(); }
    if (event.key === 'Home') goToPage(0);
    if (event.key === 'End') goToPage(pages.length - 1);
  });

  // Swipe gestures make page navigation convenient on touchscreens.
  let touchStartX = null;
  const album = document.getElementById('album');
  album.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  album.addEventListener('touchend', event => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) delta < 0 ? nextPage() : previousPage();
    touchStartX = null;
  }, { passive: true });

  goToPage(0);
})();
