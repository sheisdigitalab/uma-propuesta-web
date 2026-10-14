/* Scroll cinematográfico · GSAP + ScrollTrigger. Si no cargan o hay "reducir movimiento", la web se ve completa sin animar. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (/[?&]shot/.test(location.search)) return; /* capturas estáticas */
  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  var q = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ease = 'power3.out';

  /* Cabecera: sombra al hacer scroll */
  var header = document.querySelector('header.site');
  if (header) ST.create({ start: 40, end: 99999, onToggle: function (s) { header.classList.toggle('scrolled', s.isActive); } });

  /* Hero: entrada + paralaje de la foto */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    gsap.fromTo(heroBg, { scale: 1.18 }, { scale: 1.02, duration: 2.2, ease: 'power2.out' });
    var tl = gsap.timeline({ defaults: { ease: ease } });
    tl.from('.hero--photo .kicker', { x: -30, opacity: 0, duration: .9 })
      .from('.hero--photo h1', { y: 56, opacity: 0, duration: 1.3 }, '-=.5')
      .from('.hero--photo .lead', { y: 28, opacity: 0, duration: .9 }, '-=.7')
      .from('.hero--photo .cta .btn', { y: 20, opacity: 0, duration: .7, stagger: .1 }, '-=.6')
      .from('.acts3 a', { y: 24, opacity: 0, duration: .8, stagger: .12 }, '-=.5');
    /* Scroll sutil: la foto se acerca un poco y el texto se aleja despacio */
    var drift = gsap.timeline({ defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.hero--photo', start: 'top top', end: 'bottom top', scrub: true } });
    drift.to(heroBg, { yPercent: 7 }, 0)
         .to('.veil', { opacity: .35 }, 0)
         .to('.hero-in', { y: -36, opacity: .15 }, .15)
         .to('.cue', { opacity: 0 }, 0);
  }

  /* Etiquetas y titulares: aparecen al entrar */
  q('.label, section h2, .sub, .note, .tagline').forEach(function (el) {
    if (el.closest('.hero--photo')) return;
    gsap.from(el, { y: 36, opacity: 0, duration: 1, ease: ease,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  /* Cita + cifras */
  var quote = document.querySelector('.quote .q');
  if (quote) gsap.from(quote, { opacity: 0, y: 40, duration: 1.2, ease: ease,
    scrollTrigger: { trigger: quote, start: 'top 85%', once: true } });
  gsap.from('.kpis > div', { opacity: 0, y: 30, duration: .9, stagger: .15, ease: ease,
    scrollTrigger: { trigger: '.kpis', start: 'top 88%', once: true } });

  /* Servicios: la foto se "abre" con clip-path */
  q('.svc article').forEach(function (a, i) {
    var img = a.querySelector('img');
    gsap.fromTo(img, { clipPath: 'inset(0 0 100% 0)', scale: 1.15 },
      { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.4, ease: 'power3.inOut', delay: i * .08,
        scrollTrigger: { trigger: a, start: 'top 85%', once: true } });
    gsap.from(q(':scope > *:not(img)', a), { y: 24, opacity: 0, duration: .9, stagger: .08, ease: ease, delay: .25 + i * .08,
      scrollTrigger: { trigger: a, start: 'top 80%', once: true } });
  });

  /* Banda panorámica: paralaje */
  q('.band img').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -10, scale: 1.12 }, { yPercent: 10, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  var bandText = document.querySelector('.band p');
  if (bandText) gsap.from(bandText, { x: -40, opacity: 0, duration: 1.2, ease: ease,
    scrollTrigger: { trigger: '.band', start: 'top 70%', once: true } });

  /* UMA 360: texto fijo mientras los pasos se iluminan uno a uno */
  var items = q('.u360-list li');
  if (items.length) {
    items.forEach(function (li) {
      gsap.fromTo(li, { opacity: .7 }, { opacity: 1, ease: 'none',
        scrollTrigger: { trigger: li, start: 'top 82%', end: 'top 52%', scrub: true } });
      gsap.from(li.querySelector('.n'), { x: -24, duration: .8, ease: ease,
        scrollTrigger: { trigger: li, start: 'top 85%', once: true } });
    });
  }

  /* Proyectos: antes / después se destapan */
  q('.proj, figure').forEach(function (p) {
    var after = q('.ba .ph', p)[1];
    if (!after) return;
    gsap.from(after, { clipPath: 'inset(0 0 0 100%)', duration: 1.4, ease: 'power3.inOut',
      scrollTrigger: { trigger: p, start: 'top 75%', once: true } });
  });

  /* Tarjetas de propiedades y galería de la ficha */
  q('.grid .card').forEach(function (c, i) {
    gsap.from(c, { y: 60, opacity: 0, duration: 1, ease: ease, delay: (i % 3) * .1,
      scrollTrigger: { trigger: c, start: 'top 90%', once: true } });
  });
  q('.gallery .ph').forEach(function (g, i) {
    gsap.from(g, { opacity: 0, scale: 1.06, duration: 1.2, ease: ease, delay: i * .12 });
  });

  /* Bloques de formulario y contacto */
  q('#propietarios form, #contacto form, .channels, .portrait, .buyers').forEach(function (el) {
    gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: ease,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  /* Recalcula al cambiar de idioma (cambia la altura del texto) */
  q('.lang button').forEach(function (b) { b.addEventListener('click', function () { setTimeout(function () { ST.refresh(); }, 60); }); });
  window.addEventListener('load', function () { ST.refresh(); });
})();
