// Hauquímia — shared page shell (header, menus, footer, modal mounts).
// Loaded synchronously at the top of <body> on every page, so the header is
// in the DOM before first paint and before app.js wires its listeners.
(function () {
  'use strict';

  var NAV = [
    { page: 'nossa-historia', href: '/nossa-historia/', label: 'Nossa História' },
    { page: 'atelie', href: '/atelie/', label: 'Ateliê' },
    { page: 'oficina', href: '/oficina/', label: 'Oficina' },
    { page: 'personalizacao', href: '/personalizacao/', label: 'Personalização' },
    { page: 'second-hand-upcycle', href: '/second-hand-upcycle/', label: 'Second Hand & Upcycle' },
    { page: 'catalogo', href: '/catalogo/', label: 'Catálogo' },
    { page: 'contato', href: '#contato', label: 'Contato' },
  ];
  var WHATSAPP = '5531990621354';
  var current = document.body.getAttribute('data-page') || '';

  function links(extraAttrs) {
    return NAV.map(function (l) {
      var active = l.page === current;
      return '<a class="navlink' + (active ? ' is-current' : '') + '" href="' + l.href + '"' +
        (active ? ' aria-current="page"' : '') + (extraAttrs || '') + '>' + l.label + '</a>';
    }).join('');
  }

  var header =
    '<header class="site-header">' +
      '<div class="pad-h nav-bar">' +
        '<a class="nav-brand" href="/" aria-label="Hauquímia — início">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14223d" stroke-width="1.1"><circle cx="12" cy="12" r="6.4"/><line x1="12" y1="5.6" x2="12" y2="12"/><circle cx="12" cy="4.4" r="1.15" fill="#14223d" stroke="none"/></svg>' +
          '<span class="nav-brand-text">HAUQUÍMIA</span>' +
        '</a>' +
        '<div class="nav-right">' +
          '<span class="nav-auth js-auth-slot"></span>' +
          '<span data-action="toggle-search" class="icon-btn" role="button" aria-label="Buscar">' +
            '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#14223d" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>' +
          '</span>' +
          '<span data-action="open-favorites" class="icon-btn icon-btn-badge" role="button" aria-label="Favoritos">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14223d" stroke-width="1.4"><path d="M12 20s-7-4.5-9.5-9A5.5 5.5 0 0112 5a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>' +
            '<span id="favorites-badge" class="badge" hidden></span>' +
          '</span>' +
          '<span data-action="open-cart" class="icon-btn icon-btn-badge" role="button" aria-label="Sacola">' +
            '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#14223d" stroke-width="1.4"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>' +
            '<span id="cart-badge" class="badge" hidden></span>' +
          '</span>' +
          '<span class="nav-hamburger" data-action="toggle-menu" role="button" aria-label="Menu">' +
            '<svg id="icon-menu-close" class="is-hidden" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14223d" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
            '<svg id="icon-menu-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14223d" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
          '</span>' +
        '</div>' +
      '</div>' +
      '<nav class="pad-h nav-links-row" aria-label="Principal">' + links() + '</nav>' +
      '<nav id="mobile-menu-panel" class="mobile-menu-panel pad-h" aria-label="Menu" hidden>' +
        '<a class="navlink' + (current === 'home' ? ' is-current' : '') + '" href="/" data-action="close-menu">Início</a>' +
        links(' data-action="close-menu"') +
        '<span class="nav-auth-mobile js-auth-slot"></span>' +
      '</nav>' +
      '<div id="search-bar" class="pad-h search-bar" hidden>' +
        '<input id="search-input" type="search" enterkeyhint="search" placeholder="Buscar peças (ex: colar, anel, coração...)" class="search-input" />' +
        '<span class="search-hint">Enter para ver no catálogo</span>' +
      '</div>' +
    '</header>';

  document.currentScript.insertAdjacentHTML('afterend', header);

  // Expose the resting header height (without open menu/search panels) as
  // --header-h, so sticky elements further down can sit right below it.
  var navBar = document.querySelector('.site-header .nav-bar');
  var linksRow = document.querySelector('.site-header .nav-links-row');
  function setHeaderHeight() {
    document.documentElement.style.setProperty('--header-h', (navBar.offsetHeight + linksRow.offsetHeight + 1) + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setHeaderHeight);

  // Instant page changes: Chromium prerenders same-site pages when a link is
  // hovered/pressed (eagerness "moderate"); other browsers get a hover prefetch.
  if (window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
    var rules = document.createElement('script');
    rules.type = 'speculationrules';
    rules.textContent = JSON.stringify({
      prerender: [{ where: { and: [{ href_matches: '/*' }, { not: { selector_matches: '[target=_blank]' } }] }, eagerness: 'moderate' }],
    });
    document.head.appendChild(rules);
  } else {
    var prefetched = {};
    var prefetch = function (e) {
      var a = e.target.closest && e.target.closest('a[href^="/"]');
      if (!a || prefetched[a.pathname] || a.pathname === location.pathname) return;
      prefetched[a.pathname] = true;
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = a.pathname;
      document.head.appendChild(link);
    };
    document.addEventListener('pointerover', prefetch, { passive: true });
    document.addEventListener('touchstart', prefetch, { passive: true });
  }

  var footer =
    '<div id="product-modal-mount"></div>' +
    '<div id="personalize-modal-mount"></div>' +
    '<div id="size-guide-modal-mount"></div>' +
    '<div id="process-info-modal-mount"></div>' +
    '<div id="cart-drawer-mount"></div>' +
    '<div id="favorites-drawer-mount"></div>' +
    '<div id="auth-modal-mount"></div>' +
    '<div id="checkout-modal-mount"></div>' +
    '<footer id="contato" class="site-footer pad-h">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<span class="footer-brand">HAUQUÍMIA</span>' +
          '<p class="footer-tagline">Ateliê e oficina de ourivesaria artesanal. Transformando histórias em joias.</p>' +
        '</div>' +
        '<div>' +
          '<div class="footer-title">Navegue</div>' +
          '<div class="footer-links">' +
            NAV.filter(function (l) { return l.page !== 'contato'; }).map(function (l) {
              return '<a href="' + l.href + '">' + l.label + '</a>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-title">Contato</div>' +
          '<div class="footer-links">' +
            '<a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp · (31) 99062-1354</a>' +
            '<a href="https://instagram.com/hauquimia" target="_blank" rel="noopener">Instagram · @hauquimia</a>' +
            '<span>Belo Horizonte, MG</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">© ' + new Date().getFullYear() + ' Hauquímia · Ourivesaria artesanal</div>' +
    '</footer>';

  document.addEventListener('DOMContentLoaded', function () {
    var slot = document.getElementById('site-footer');
    if (slot) slot.outerHTML = footer;
  });
})();
