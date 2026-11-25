// PETRBLAZEK.CZ – skripty webu
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $('#yr').textContent = new Date().getFullYear();

  // mobilní menu
  const nav = $('#nav'), burger = $('#burger');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.querySelector('use').setAttribute('href', 'icons.svg?v=2#' + (open ? 'i-x' : 'i-menu'));
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // odkazy v rámci stránky – plynule sjedou, ale do adresy nic nepřidají (jinak se web příště otevře dole)
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const t = id === '#top' ? null : $(id);
    if (id !== '#top' && !t) return;
    e.preventDefault();
    const off = $('.hdr').offsetHeight;
    window.scrollTo({ top: t ? t.getBoundingClientRect().top + scrollY - off : 0, behavior: 'smooth' });
  }));

  // aktivní položka menu podle scrollu
  const links = $$('.nav a[href^="#"]');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => io.observe(s));

  // spodní lišta na mobilu – ukáže se po odscrollování hera, skryje se u formuláře
  const mbar = $('.mbar'), kontakt = $('#kontakt');
  const onScroll = () => {
    const past = window.scrollY > 420;
    const r = kontakt.getBoundingClientRect();
    const atForm = r.top < innerHeight && r.bottom > 0;
    mbar.classList.toggle('is-on', past && !atForm);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // výběr balíčku -> předvyplní formulář
  $$('[data-plan]').forEach(b => b.addEventListener('click', () => {
    const f = $('#cform');
    f.plan.value = b.dataset.plan;
    if (!f.message.value) f.message.value = `Mám zájem o balíček ${b.dataset.plan}.`;
  }));

  // kontaktní formulář
  const form = $('#cform'), msg = $('#cmsg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = 'cform__msg'; msg.textContent = '';
    const data = Object.fromEntries(new FormData(form));
    if (!data.name.trim() || !/^\S+@\S+\.\S+$/.test(data.email)) {
      msg.className = 'cform__msg err'; msg.textContent = 'Vyplň prosím jméno a platný e-mail.'; return;
    }
    // ukázková verze na GitHub Pages – formulář zatím není napojený na e-mail
    msg.className = 'cform__msg ok';
    msg.textContent = 'Díky! (Ukázková verze – odesílání formuláře se zapojí po spuštění webu.)';
  });


  // ---------- animace: odhalování při scrollu ----------
  const hdr = $('.hdr');
  const onHdr = () => hdr.classList.toggle('is-scrolled', scrollY > 30);
  addEventListener('scroll', onHdr, { passive: true }); onHdr();
  const groups = [
    ['.h2:not(.cform .h2), main .eyebrow:not(.hero .eyebrow), .who__sub, .results__head, .cta__txt', ''],
    ['.blist li, .steps__row > li:not(.steps__arr), .tl > li, .tcard, .plan, .who__col, .checks li', 'stagger'],
    ['.benefits__img, .about__img', 'rv--l'],
    ['.benefits__quote, .about__gear, .cform', 'rv--r'],
    ['.guar, .about__body p', 'rv--z'],
  ];
  const ro = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  groups.forEach(([sel, mode]) => $$(sel).forEach(el => {
    el.classList.add('rv'); if (mode && mode !== 'stagger') el.classList.add(mode);
    if (mode === 'stagger') { const i = [...el.parentElement.children].filter(c => !c.classList.contains('steps__arr')).indexOf(el); el.style.setProperty('--d', (i * 0.09) + 's'); }
    ro.observe(el);
  }));
  $$('.tl').forEach(el => ro.observe(el));

})();
