// Hauquímia — front-end vanilla JS (no build step, no framework).
// Ports the behavior originally defined only inside the Claude-Design
// prototype's <script type="text/x-dc"> block into plain JS + DOM.
(function () {
  'use strict';

  var CFG = window.HAUQUIMIA_CONFIG || { apiBaseUrl: '', whatsappNumber: '5531990621354' };

  // ============ DATA ============
  var CATEGORIES = ['Todos', 'Colares', 'Pulseiras', 'Anéis', 'Brincos', 'Pingentes'];

  var PRODUCTS = [
    { id: 'col1', category: 'Colares', name: 'Colar Nome Palitinho', priceLabel: 'R$ 399,00', value: 399, specs: ['Ajustável até 45cm', 'Até 6 letras'], customNote: 'Escreva o nome ou palavra que quer ver na peça (até 6 letras).', imgSrc: 'assets/products/col1-nome-palitinho.png' },
    { id: 'col2', category: 'Colares', name: 'Colar Inicial Personalizado', priceLabel: 'R$ 290,00', value: 290, specs: ['Ajustável até 45cm', '1 letra personalizada'], customNote: 'Diga qual inicial você quer gravada.', imgSrc: 'assets/products/col2-inicial-personalizado.png' },
    { id: 'col3', category: 'Colares', name: 'Colar Monograma', priceLabel: 'R$ 550,00', value: 550, specs: ['Ajustável até 45cm + grossinho', '2 letras de 18mm'], customNote: 'Informe as duas iniciais do monograma.', imgSrc: 'assets/products/col3-monograma.png' },
    { id: 'col4', category: 'Colares', name: 'Colar Nome Cursivo', priceLabel: 'R$ 650,00', value: 650, specs: ['Ajustável até 45cm + grossinho', 'Nome até 7 letras'], customNote: 'Escreva o nome (até 7 letras) que será escrito em cursivo.', imgSrc: 'assets/products/col4-nome-cursivo.png' },
    { id: 'col5', category: 'Colares', name: 'Colar Três Corações 10mm', priceLabel: 'R$ 880,00', value: 880, specs: ['+ grossinho'], customNote: 'Peça pronta, sem gravação.', imgSrc: 'assets/products/col5-tres-coracoes.png' },
    { id: 'col6', category: 'Colares', name: 'Colar Dois Corações Gravados', priceLabel: 'R$ 380,00', value: 380, specs: ['Dois corações com inicial gravada'], customNote: 'Informe as duas iniciais, uma para cada coração.', imgSrc: 'assets/products/col6-dois-coracoes.png' },
    { id: 'col7', category: 'Colares', name: 'Colar Coração 10mm Gravado', priceLabel: 'R$ 380,00', value: 380, specs: ['+ grossinho', 'Gravação personalizada no coração'], customNote: 'Diga o que quer gravado no coração — iniciais, data ou palavra curta.', imgSrc: 'assets/products/col7-coracao-10mm.png' },
    { id: 'col8', category: 'Colares', name: 'Colar Gravatinha', priceLabel: 'R$ 490,00', value: 490, specs: ['Coração + coração menor gravado, em Y'], customNote: 'Informe as iniciais do coração menor.', imgSrc: 'assets/products/col8-gravatinha.png' },
    { id: 'col9', category: 'Colares', name: 'Colar Gravatinha Gem Personalizado', priceLabel: 'R$ 525,00', value: 525, specs: ['Rilon, oval, navete ou redonda — 4x6mm ou 5mm'], customNote: 'Escolha o formato e a cor da pedra.', imgSrc: 'assets/products/col9-gravatinha-gem.png' },
    { id: 'col10', category: 'Colares', name: 'Escapulário 60cm', priceLabel: 'R$ 590,00', value: 590, specs: ['+ grossinho', 'Par de correntes com pombinha'], customNote: 'Peça pronta, sem personalização.', imgSrc: 'assets/products/col10-escapulario.png' },
    { id: 'col11', category: 'Colares', name: 'Colar Ponto Luz Gem Redonda', priceLabel: 'A partir de R$ 360,00', value: 360, hasVariants: true, variants: [{ label: '5mm', price: 'R$ 360,00', value: 360 }, { label: '7mm', price: 'R$ 430,00', value: 430 }, { label: '9mm', price: 'R$ 550,00', value: 550 }], customNote: 'Escolha a pedra e o tamanho da gema.', imgSrc: 'assets/products/col11-ponto-luz.png' },

    { id: 'pul1', category: 'Pulseiras', name: 'Pulseira Inicial 1 Caracter', priceLabel: 'R$ 180,00', value: 180, specs: ['Adicional caracter: R$ 40,00', 'Adicional pedra: + metade do valor do brinco'], customNote: 'Informe o caracter desejado e se quer adicionar pedra.', imgSrc: 'assets/products/pul1-inicial-1-caracter.png' },
    { id: 'pul2', category: 'Pulseiras', name: 'Pulseira Plaquinha Redonda 8mm', priceLabel: 'R$ 199,00', value: 199, specs: ['Adicional placa: R$ 50,00', 'Adicional pedra: + metade do valor do brinco'], customNote: 'Diga se quer placa adicional e/ou pedra.', imgSrc: 'assets/products/pul2-plaquinha-redonda.png' },
    { id: 'pul3', category: 'Pulseiras', name: 'Pulseira Gravada Plaquinhas 30mm', priceLabel: 'R$ 225,00', value: 225, specs: ['Gravação personalizada'], customNote: 'Escreva o texto que deseja gravado (ex: nome e data).', imgSrc: 'assets/products/pul3-gravada-plaquinhas.png' },
    { id: 'pul4', category: 'Pulseiras', name: 'Pulseira Medalha Vazada c/ Penduricalho', priceLabel: 'R$ 290,00', value: 290, specs: ['Medalha vazada + penduricalho'], customNote: 'Escolha o símbolo da medalha vazada.', imgSrc: 'assets/products/pul4-medalha-vazada.png' },
    { id: 'pul5', category: 'Pulseiras', name: 'Pulseira Infantil Gravada', priceLabel: 'R$ 240,00', value: 240, specs: ['Placa gravada em fonte cursiva'], customNote: 'Informe o nome a ser gravado.', imgSrc: 'assets/products/pul5-infantil.png' },

    { id: 'ane1', category: 'Anéis', name: 'Anel Inicial / Gravado', priceLabel: 'R$ 180,00', value: 180, specs: ['Aro liso com inicial ou gravação'], customNote: 'Informe a inicial ou texto e o aro.', imgSrc: 'assets/products/ane1-inicial-gravado.png' },
    { id: 'ane2', category: 'Anéis', name: 'Anel Inicial + Gema', priceLabel: 'R$ 260,00', value: 260, specs: ['Aro aberto com inicial e pedra'], customNote: 'Escolha a inicial, a pedra e o aro.', imgSrc: 'assets/products/ane2-inicial-gema.png' },
    { id: 'ane3', category: 'Anéis', name: 'Anel Gema 4x6mm', priceLabel: 'A partir de R$ 320,00', value: 320, hasVariants: true, variants: [{ label: 'Oval / Navete / Gota / Redonda 5mm', price: 'R$ 320,00', value: 320 }, { label: 'Retangular', price: 'R$ 360,00', value: 360 }], customNote: 'Escolha o formato e a cor da pedra.', imgSrc: 'assets/products/ane3-gema-4x6.png' },
    { id: 'ane4', category: 'Anéis', name: 'Anel Gema Central', priceLabel: 'R$ 810,00', value: 810, specs: ['Pedra central com laterais em zircônia'], customNote: 'Escolha a pedra central e o aro.', imgSrc: 'assets/products/ane4-gema-central.png' },

    { id: 'bri1', category: 'Brincos', name: 'Par Brinco Gema Redonda', priceLabel: 'A partir de R$ 399,00', value: 399, hasVariants: true, variants: [{ label: '5mm', price: 'R$ 399,00', value: 399 }, { label: '7mm', price: 'R$ 599,00', value: 599 }, { label: '9mm', price: 'R$ 799,00', value: 799 }], customNote: 'Escolha a pedra e o tamanho.', imgSrc: 'assets/products/bri1-gema-redonda.png' },
    { id: 'bri2', category: 'Brincos', name: 'Par Brinco Ponto Luz 3mm', priceLabel: 'R$ 250,00', value: 250, specs: ['Pedra redonda 3mm'], customNote: 'Escolha a cor da pedra.', imgSrc: 'assets/products/bri2-ponto-luz-3mm.png' },
    { id: 'bri3', category: 'Brincos', name: 'Par Brinco Gota 3x5mm', priceLabel: 'R$ 350,00', value: 350, specs: ['Pedra em formato gota'], customNote: 'Escolha a cor da pedra.', imgSrc: 'assets/products/bri3-gota-3x5mm.png' },
    { id: 'bri4', category: 'Brincos', name: 'Par Brinco Coração 4mm', priceLabel: 'R$ 155,00', value: 155, specs: ['+ grossinho'], customNote: 'Peça pronta, sem personalização.', imgSrc: 'assets/products/bri4-coracao-4mm.png' },
    { id: 'bri5', category: 'Brincos', name: 'Brinco Inicial', priceLabel: 'R$ 210,00', value: 210, specs: ['Par com iniciais à escolha'], customNote: 'Informe as iniciais para cada brinco.', imgSrc: 'assets/products/bri5-inicial.png' },
    { id: 'bri6', category: 'Brincos', name: 'Brinco Palito', priceLabel: 'A partir de R$ 139,00', value: 139, hasVariants: true, variants: [{ label: 'P', price: 'R$ 139,00', value: 139 }, { label: 'M', price: 'R$ 179,00', value: 179 }, { label: 'G', price: 'R$ 218,00', value: 218 }], customNote: 'Escolha o tamanho do palito.', imgSrc: 'assets/products/bri6-palito.png' },
    { id: 'bri7', category: 'Brincos', name: 'Brinco Corrente com Pedra 3mm', priceLabel: 'R$ 250,00', value: 250, specs: ['Pedra colorida à escolha'], customNote: 'Escolha a cor da pedra.', imgSrc: 'assets/products/bri7-corrente-pedra.png' },
    { id: 'bri8', category: 'Brincos', name: 'Brinco Anzol Inicial', priceLabel: 'R$ 238,00', value: 238, specs: ['Corrente com inicial pendente'], customNote: 'Informe as iniciais para cada brinco.', imgSrc: 'assets/products/bri8-anzol-inicial.png' },
    { id: 'bri9', category: 'Brincos', name: 'Par Alongador', priceLabel: 'R$ 129,00', value: 129, specs: ['Corrente lisa, sem pingente'], customNote: 'Peça pronta, sem personalização.', imgSrc: 'assets/products/bri9-alongador.png' },
    { id: 'bri10', category: 'Brincos', name: 'Par Brinco Gems Correntinha', priceLabel: 'A partir de R$ 798,00', value: 798, specs: ['Valor = soma de dois pares de brinco gem', 'Gema 4x6mm: R$ 399,00', 'Gema retangular 4x6mm: R$ 460,00', 'Gema 5x7mm: R$ 620,00 (consultar formato)'], customNote: 'Escolha as duas cores de pedra.', imgSrc: 'assets/products/bri10-gems-correntinha.png' },

    { id: 'pin1', category: 'Pingentes', name: 'Pingente Iniciais 10mm', priceLabel: 'R$ 155,00', value: 155, specs: ['Vendido avulso, sem corrente'], customNote: 'Informe a inicial desejada.', imgSrc: 'assets/products/pin1-iniciais-10mm.png' },
    { id: 'pin2', category: 'Pingentes', name: 'Pingente Calendário', priceLabel: 'R$ 399,00', value: 399, specs: ['Data gravada com marcação especial'], customNote: 'Informe o mês, ano e dia a marcar.', imgSrc: 'assets/products/pin2-calendario.png' },
    { id: 'pin3', category: 'Pingentes', name: 'Pingente Plaquinha p/ Gravação', priceLabel: 'R$ 235,00', value: 235, specs: ['Opção fotogravação: + R$ 60,00'], customNote: 'Envie o texto ou foto que deseja gravado.', imgSrc: 'assets/products/pin3-plaquinha-gravacao.png' },
    { id: 'pin4', category: 'Pingentes', name: 'Corrente 45cm + Pingente Gem Gravada', priceLabel: 'R$ 960,00', value: 960, specs: ['+ grossinho', 'Pingente 18mm ou 30x8mm'], customNote: 'Informe a inicial gravada e a cor da pedra.', imgSrc: 'assets/products/pin4-corrente-pingente-gem.png' },
  ];

  var PERSONALIZATION_FIELD_DEFS = {
    tamanho: { label: 'Tamanho', maxLength: 6 },
    caractere: { label: 'Caracteres', note: 'Até 9 caracteres inclusos — cada caractere a mais tem valor adicional de R$ 40,00', maxLength: 9, includedChars: 9, extraCharPrice: 40 },
    corBanho: { label: 'Cor de banho', options: ['Ouro branco', 'Ouro amarelo'] },
    pedra: { label: 'Pedra natural' },
  };
  var TAMANHO_RANGES = {
    Colares: { min: 30, max: 45, unit: 'cm' },
    Pulseiras: { min: 10, max: 25, unit: 'cm' },
    'Anéis': { min: 3, max: 30, unit: '' },
  };
  var SIZE_GUIDE_PMG = {
    Colares: { unit: 'cm', options: [
      { label: 'P', min: 35, max: 38 },
      { label: 'M', min: 38, max: 42 },
      { label: 'G', min: 40, max: 45 },
    ] },
    Pulseiras: { unit: 'cm', options: [
      { label: 'P', min: 14, max: 15 },
      { label: 'M', min: 15, max: 17 },
      { label: 'G', min: 17, max: 18 },
    ] },
  };
  var ARO_SIZES = [10, 12, 14, 16, 18, 20, 22, 24, 26];
  var PEDRA_OPTIONS = [
    { color: 'Azul claro', stone: 'Topázio Sky', swatch: '#8fc4e8' },
    { color: 'Verde claro', stone: 'Peridoto', swatch: '#a8d36a' },
    { color: 'Verde escuro', stone: 'Crisóprazio', swatch: '#4c8f5e' },
    { color: 'Branco', stone: 'Topázio branco', swatch: '#f2f0ea' },
    { color: 'Vermelho', stone: 'Granada', swatch: '#a52439' },
    { color: 'Amarelo', stone: 'Citrino', swatch: '#e8b93a' },
    { color: 'Roxo', stone: 'Ametista', swatch: '#8a5fb0' },
  ];
  var GEM_PRODUCT_IDS = ['col9', 'col11', 'ane2', 'ane3', 'ane4', 'bri1', 'bri2', 'bri3', 'bri7', 'bri10', 'pin4'];
  var CHARACTER_SETS = {
    Colares: 'Letras de A a Z (números limitados) e símbolos: coração vazado, coração cheio, trevo, arvorezinha, meia-lua, estrela-de-davi, estrela, passarinho, folha, borboleta, mão de hamsa, infinito, flor e olho grego.',
    Pulseiras: 'Letras de A a Z e símbolos: coração vazado, coração cheio, meia-lua, estrela, estrela-de-davi, infinito, trevo, pomba, gato, coruja, concha e os 12 signos do zodíaco.',
    'Anéis': 'Letras de A a Z e símbolos: mão de hamsa, coração, meia-lua, estrela, estrela-de-davi, infinito, pomba, gato, cruz, borboleta e os 12 signos do zodíaco.',
    Brincos: 'Letras de A a Z e símbolos: estrela, coração vazado, coração cheio, infinito, pomba, cruz, trevo, sapinho, ursinho, elefante, borboleta, flor e os 12 signos do zodíaco.',
    Pingentes: 'Letras de A a Z e símbolos disponíveis sob consulta — semelhantes aos usados em colares e pingentes.',
  };
  PRODUCTS.forEach(function (p) {
    if (p.category === 'Colares') p.personalizationFields = ['tamanho', 'caractere', 'corBanho'];
    if (p.category === 'Pulseiras') p.personalizationFields = ['tamanho', 'caractere'];
    if (p.category === 'Anéis') p.personalizationFields = ['tamanho', 'caractere'];
    if (GEM_PRODUCT_IDS.indexOf(p.id) !== -1) {
      p.personalizationFields = (p.personalizationFields || []).concat(['pedra']);
    }
  });

  function formatBRL(n) {
    return 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+,)/g, '$&.');
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function byId(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0] || null; }

  // ============ API ============
  var api = {
    token: null,
    _read: function (path, opts) {
      opts = opts || {};
      var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
      if (api.token) headers.Authorization = 'Bearer ' + api.token;
      return fetch(CFG.apiBaseUrl + path, {
        method: opts.method || 'GET',
        headers: headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      }).then(function (res) {
        if (!res.ok) return res.json().catch(function () { return {}; }).then(function (j) {
          throw new Error(j.error || ('HTTP ' + res.status));
        });
        return res.status === 204 ? null : res.json();
      });
    },
    register: function (name, email, password) { return api._read('/api/auth/register', { method: 'POST', body: { name: name, email: email, password: password } }); },
    login: function (email, password) { return api._read('/api/auth/login', { method: 'POST', body: { email: email, password: password } }); },
    me: function () { return api._read('/api/auth/me'); },
    getCart: function () { return api._read('/api/cart'); },
    addCartItem: function (item) { return api._read('/api/cart', { method: 'POST', body: item }); },
    updateCartItem: function (key, qty) { return api._read('/api/cart/' + encodeURIComponent(key), { method: 'PATCH', body: { qty: qty } }); },
    removeCartItem: function (key) { return api._read('/api/cart/' + encodeURIComponent(key), { method: 'DELETE' }); },
    getFavorites: function () { return api._read('/api/favorites'); },
    addFavorite: function (productId) { return api._read('/api/favorites', { method: 'POST', body: { productId: productId } }); },
    removeFavorite: function (productId) { return api._read('/api/favorites/' + encodeURIComponent(productId), { method: 'DELETE' }); },
    createOrder: function (order) { return api._read('/api/orders', { method: 'POST', body: order }); },
    sendLead: function (lead) { return api._read('/api/leads', { method: 'POST', body: lead }); },
  };

  // ============ STATE ============
  var state = {
    activeCategory: 'Todos',
    searchOpen: false,
    searchQuery: '',
    menuOpen: false,

    selectedId: null,
    selectedVariantIndex: 0,
    qty: 1,
    customText: '',
    personalizeOpen: false,
    personalizeDraft: '',
    pTamanho1: '',
    pTamanho2: '',
    pTamanhoPMG: '',
    pAro: '',
    sizeGuideOpen: false,
    pCaractere: '',
    pCorBanho: '',
    pPedraEnabled: false,
    pPedraColor: '',
    pDetalhesExtras: '',

    cart: [],
    cartOpen: false,

    checkoutOpen: false,
    orderPlaced: false,
    orderNumber: null,
    orderError: '',
    paymentMethod: 'pix',
    shipName: '',
    shipAddress: '',
    shipCity: '',
    shipCep: '',
    checkoutStep: 'auth',
    freteCalculated: false,
    couponCode: '',
    couponApplied: false,

    favorites: [],
    favoritesOpen: false,

    authOpen: false,
    authTab: 'login',
    authName: '',
    authEmail: '',
    authPassword: '',
    authedUser: null,
    authError: '',
    authBusy: false,

    processInfoOpen: false,
    leadStep: 'contato',
    leadName: '',
    leadPhone: '',
    leadEmail: '',
    leadDescription: '',
  };

  function loadLocal(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  function saveLocal(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function persistGuestState() {
    if (!state.authedUser) {
      saveLocal('hauquimia_cart', state.cart);
      saveLocal('hauquimia_favorites', state.favorites);
    }
  }

  // ============ RENDER (with focus preservation) ============
  var renderQueued = false;
  function render() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(function () {
      renderQueued = false;
      doRender();
    });
  }
  function doRender() {
    var active = document.activeElement;
    var focusId = active && active.id ? active.id : null;
    var selStart = active && 'selectionStart' in active ? active.selectionStart : null;
    var selEnd = active && 'selectionEnd' in active ? active.selectionEnd : null;

    renderNavAuth();
    renderBadges();
    renderCategoryPills();
    renderProductsGrid();
    renderProductModal();
    renderPersonalizeModal();
    renderSizeGuideModal();
    renderProcessInfoModal();
    renderCartDrawer();
    renderFavoritesDrawer();
    renderAuthModal();
    renderCheckoutModal();
    persistGuestState();

    if (focusId) {
      var el = document.getElementById(focusId);
      if (el) {
        el.focus();
        if (selStart != null && el.setSelectionRange) {
          try { el.setSelectionRange(selStart, selEnd); } catch (e) {}
        }
      }
    }
  }

  // ---------- Nav ----------
  function renderNavAuth() {
    var slot = document.getElementById('nav-auth-slot');
    if (!slot) return;
    if (state.authedUser) {
      slot.innerHTML = '<span data-action="logout" style="font-size:13px;color:#14223d;cursor:pointer;white-space:nowrap">Olá, ' + esc(state.authedUser.name) + '</span>';
    } else {
      slot.innerHTML = '<span class="navlink" data-action="open-login">Entrar</span>';
    }
  }
  function renderBadges() {
    var favBadge = document.getElementById('favorites-badge');
    var cartBadge = document.getElementById('cart-badge');
    var favCount = state.favorites.length;
    var cartCount = state.cart.reduce(function (s, c) { return s + c.qty; }, 0);
    favBadge.hidden = favCount === 0;
    favBadge.textContent = favCount;
    cartBadge.hidden = cartCount === 0;
    cartBadge.textContent = cartCount;

    document.getElementById('icon-menu-close').hidden = !state.menuOpen;
    document.getElementById('icon-menu-open').hidden = state.menuOpen;
    document.getElementById('mobile-menu-panel').hidden = !state.menuOpen;
    var searchBar = document.getElementById('search-bar');
    searchBar.hidden = !state.searchOpen;
    if (state.searchOpen) {
      var input = document.getElementById('search-input');
      if (document.activeElement !== input) input.focus();
    }
  }

  // ---------- Catalog ----------
  function renderCategoryPills() {
    var row = document.getElementById('cat-pills-row');
    row.innerHTML = CATEGORIES.map(function (cat) {
      var active = cat === state.activeCategory;
      return '<span class="cat-pill' + (active ? ' is-active' : '') + '" data-action="select-category" data-cat="' + esc(cat) + '">' + esc(cat) + '</span>';
    }).join('');
  }
  function filteredProducts() {
    var q = state.searchQuery.trim().toLowerCase();
    return PRODUCTS.filter(function (p) {
      var inCat = state.activeCategory === 'Todos' || p.category === state.activeCategory;
      var inSearch = !q || p.name.toLowerCase().indexOf(q) !== -1;
      return inCat && inSearch;
    });
  }
  function renderProductsGrid() {
    var grid = document.getElementById('products-grid');
    var empty = document.getElementById('products-empty');
    var list = filteredProducts();
    empty.hidden = list.length !== 0;
    grid.innerHTML = list.map(function (p, idx) {
      var isFav = state.favorites.indexOf(p.id) !== -1;
      var delay = Math.min(idx, 11) * 35;
      return (
        '<div class="prod-card" data-action="open-product" data-id="' + p.id + '" style="animation-delay:' + delay + 'ms">' +
          '<div class="prod-img-wrap">' +
            '<img src="' + esc(p.imgSrc) + '" alt="' + esc(p.name) + '" loading="lazy">' +
            '<button type="button" class="prod-fav-btn" data-action="toggle-favorite" data-id="' + p.id + '">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="' + (isFav ? '#14223d' : 'none') + '" stroke="#14223d" stroke-width="1.6"><path d="M12 20s-7-4.5-9.5-9A5.5 5.5 0 0112 5a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="prod-meta">' +
            '<span class="prod-cat">' + esc(p.category) + '</span>' +
            '<div class="prod-name">' + esc(p.name) + '</div>' +
            '<div class="prod-price">' + esc(p.priceLabel) + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  // ---------- Product modal computed view-model ----------
  function computeSelected() {
    if (!state.selectedId) return null;
    var p = byId(state.selectedId);
    if (!p) return null;
    var variants = p.hasVariants ? p.variants.map(function (v, i) {
      return Object.assign({}, v, { index: i, active: i === state.selectedVariantIndex });
    }) : [];
    var unitValue = p.hasVariants ? p.variants[state.selectedVariantIndex].value : p.value;
    var fields = p.personalizationFields || [];
    var hasFieldPedra = fields.indexOf('pedra') !== -1;
    var range = TAMANHO_RANGES[p.category];
    var pmgGuide = SIZE_GUIDE_PMG[p.category];
    var tamanhoIsPMG = !!pmgGuide;
    var tamanhoIsAro = p.category === 'Anéis';
    var aroValue = tamanhoIsAro ? (state.pAro || ARO_SIZES[0]) : null;
    var pmgSelected = pmgGuide ? (state.pTamanhoPMG || 'M') : null;
    var pmgSelectedOpt = pmgGuide ? pmgGuide.options.filter(function (o) { return o.label === pmgSelected; })[0] : null;
    var rMin = range ? range.min : 0;
    var rMax = range ? range.max : 1;
    var tamanho1Value = state.pTamanho1 !== '' ? Number(state.pTamanho1) : rMin;
    var tamanho2Value = state.pTamanho2 !== '' ? Number(state.pTamanho2) : rMax;
    function pct(v) { return rMax > rMin ? ((v - rMin) / (rMax - rMin)) * 100 : 0; }
    var extraCharCount = Math.max(0, state.pCaractere.length - PERSONALIZATION_FIELD_DEFS.caractere.includedChars);
    var extraCharCost = extraCharCount * PERSONALIZATION_FIELD_DEFS.caractere.extraCharPrice;
    var pedraCost = hasFieldPedra && state.pPedraEnabled ? unitValue / 2 : 0;
    var totalValue = unitValue + extraCharCost + pedraCost;
    var priceExtras = [];
    if (extraCharCost > 0) priceExtras.push('+' + extraCharCount + ' caractere' + (extraCharCount > 1 ? 's' : '') + ' (' + formatBRL(extraCharCost) + ')');
    if (pedraCost > 0) priceExtras.push('pedra natural (' + formatBRL(pedraCost) + ')');

    return {
      p: p,
      unitValue: unitValue,
      variants: variants,
      hasVariants: !!p.hasVariants,
      currentPriceLabel: formatBRL(totalValue),
      priceExtrasLabel: priceExtras.join(' · '),
      hasPriceExtras: priceExtras.length > 0,
      hasSpecs: !!(p.specs && p.specs.length),
      hasStructuredPersonalization: !!(fields && fields.length),
      hasFreeformPersonalization: !(fields && fields.length),
      tamanhoIsPMG: tamanhoIsPMG,
      tamanhoIsSlider: fields.indexOf('tamanho') !== -1 && !tamanhoIsPMG && !tamanhoIsAro,
      tamanhoIsAro: tamanhoIsAro,
      aroValue: aroValue,
      pmgSelected: pmgSelected,
      pmgRangeLabel: pmgSelectedOpt ? (pmgSelectedOpt.min + '–' + pmgSelectedOpt.max + pmgGuide.unit) : '',
      pmgGuide: pmgGuide,
      range: range,
      tamanho1Value: tamanho1Value,
      tamanho2Value: tamanho2Value,
      tamanho1Pct: pct(tamanho1Value),
      tamanho2Pct: pct(tamanho2Value),
      hasFieldCaractere: fields.indexOf('caractere') !== -1,
      hasFieldCorBanho: fields.indexOf('corBanho') !== -1,
      hasFieldPedra: hasFieldPedra,
      characterSetText: CHARACTER_SETS[p.category] || '',
    };
  }

  function renderProductModal() {
    var mount = document.getElementById('product-modal-mount');
    var sel = computeSelected();
    if (!sel) { mount.innerHTML = ''; return; }
    var p = sel.p;

    var variantsHtml = '';
    if (sel.hasVariants) {
      variantsHtml = '<div class="modal-section"><span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#14223d">Opções</span><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">' +
        sel.variants.map(function (v) {
          return '<span class="pill-option' + (v.active ? ' active' : '') + '" data-action="select-variant" data-index="' + v.index + '">' + esc(v.label) + '</span>';
        }).join('') + '</div></div>';
    }

    var specsHtml = '';
    if (sel.hasSpecs) {
      specsHtml = '<div class="modal-section"><span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#14223d">Especificações</span><div style="margin-top:10px;display:flex;flex-direction:column;gap:6px">' +
        p.specs.map(function (s) { return '<span style="font-size:16px;color:#5a6170;font-family:\'Cormorant Garamond\',serif;font-style:italic">' + esc(s) + '</span>'; }).join('') +
        '</div></div>';
    }

    var personalizationHtml = '<div class="modal-section">' +
      '<span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#14223d">Personalização</span>' +
      '<div style="font-size:13px;color:#5a6170;font-family:\'Cormorant Garamond\',serif;font-style:italic;margin-top:6px;line-height:1.5">Você pode acrescentar ou reduzir detalhes da personalização — o valor da peça é ajustado de acordo com o que for escolhido.</div>';

    if (sel.hasStructuredPersonalization) {
      if (sel.tamanhoIsSlider) {
        personalizationHtml += '<div style="margin-top:12px">' +
          '<span style="font-size:13px;color:#5a6170">Tamanho <span style="color:#9a7b34">· regulador 1: ' + sel.tamanho1Value + sel.range.unit + ' · regulador 2: ' + sel.tamanho2Value + sel.range.unit + '</span></span>' +
          '<div id="tamanho-track" data-action="track-down" style="position:relative;margin-top:14px;cursor:pointer;padding:10px 0">' +
            '<div style="position:relative;height:4px;background:#e4dfd2;border-radius:2px">' +
              '<div data-action="handle1-down" style="position:absolute;top:50%;left:' + sel.tamanho1Pct + '%;width:18px;height:18px;border-radius:50%;background:#14223d;transform:translate(-50%,-50%);border:2px solid #faf8f4;box-shadow:0 0 0 1px rgba(20,34,61,.3);cursor:grab"></div>' +
              '<div data-action="handle2-down" style="position:absolute;top:50%;left:' + sel.tamanho2Pct + '%;width:18px;height:18px;border-radius:50%;background:#9a7b34;transform:translate(-50%,-50%);border:2px solid #faf8f4;box-shadow:0 0 0 1px rgba(154,123,52,.4);cursor:grab"></div>' +
            '</div></div>' +
          '<div style="display:flex;justify-content:space-between;font-size:11px;color:#9aa4b8;margin-top:6px"><span>' + sel.range.min + sel.range.unit + '</span><span>' + sel.range.max + sel.range.unit + '</span></div>' +
        '</div>';
      }
      if (sel.tamanhoIsPMG) {
        personalizationHtml += '<div style="margin-top:12px">' +
          '<div style="display:flex;align-items:center;justify-content:space-between">' +
            '<span style="font-size:13px;color:#5a6170">Tamanho <span style="color:#9a7b34">· ' + esc(sel.pmgRangeLabel) + '</span></span>' +
            '<span data-action="open-size-guide" style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#9a7b34;cursor:pointer;text-decoration:underline">Guia de tamanhos</span>' +
          '</div>' +
          '<div style="margin-top:10px;display:flex;gap:8px">' +
          sel.pmgGuide.options.map(function (o) {
            return '<span class="pill-option' + (sel.pmgSelected === o.label ? ' active' : '') + '" style="font-family:\'Marcellus\',serif;width:44px;height:44px;display:flex;align-items:center;justify-content:center" data-action="select-pmg" data-label="' + o.label + '">' + o.label + '</span>';
          }).join('') + '</div></div>';
      }
      if (sel.tamanhoIsAro) {
        personalizationHtml += '<div style="margin-top:12px">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;border-bottom:1px solid rgba(20,34,61,.12)">' +
            '<span style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#14223d">Aro</span>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
              '<span style="font-family:\'Marcellus\',serif;font-size:20px;color:#9a7b34">' + sel.aroValue + '</span>' +
              '<div style="display:flex;flex-direction:column;line-height:0">' +
                '<span data-action="aro-up" style="cursor:pointer;font-size:11px;color:#9a7b34">▲</span>' +
                '<span data-action="aro-down" style="cursor:pointer;font-size:11px;color:#9a7b34;margin-top:3px">▼</span>' +
              '</div></div></div>' +
          '<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px">' +
          ARO_SIZES.map(function (n) {
            return '<span class="pill-option' + (sel.aroValue === n ? ' active' : '') + '" style="width:52px;height:44px;display:flex;align-items:center;justify-content:center" data-action="select-aro" data-value="' + n + '">' + n + '</span>';
          }).join('') + '</div></div>';
      }
      if (sel.hasFieldCaractere) {
        personalizationHtml += '<div style="margin-top:12px">' +
          '<span style="font-size:13px;color:#5a6170">Caracteres <span style="color:#9a7b34">· ' + esc(PERSONALIZATION_FIELD_DEFS.caractere.note) + '</span></span>' +
          '<input id="input-caractere" data-bind="pCaractere" value="' + esc(state.pCaractere) + '" type="text" placeholder="Letras, bolinhas, estrelinhas..." class="field-input" style="margin-top:8px" />' +
          (sel.characterSetText ? '<div style="margin-top:6px;font-size:12px;color:#9aa4b8;line-height:1.5">' + esc(sel.characterSetText) + '</div>' : '') +
          '</div>';
      }
      personalizationHtml += '<div style="margin-top:12px">' +
        '<span style="font-size:13px;color:#5a6170">Descrever ajuste na personalização</span>' +
        '<textarea id="input-detalhes-extras" data-bind="pDetalhesExtras" placeholder="Descreva o que quer acrescentar ou reduzir (ex: mais uma letra, tirar a pedra, etc.)" rows="2" class="field-textarea" style="margin-top:8px">' + esc(state.pDetalhesExtras) + '</textarea></div>';
      if (sel.hasFieldCorBanho) {
        personalizationHtml += '<div style="margin-top:12px"><span style="font-size:13px;color:#5a6170">Cor de banho</span><div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">' +
          PERSONALIZATION_FIELD_DEFS.corBanho.options.map(function (opt) {
            return '<span class="pill-option' + (state.pCorBanho === opt ? ' active' : '') + '" data-action="select-cor-banho" data-value="' + esc(opt) + '">' + esc(opt) + '</span>';
          }).join('') + '</div></div>';
      }
      if (sel.hasFieldPedra) {
        personalizationHtml += '<div style="margin-top:12px">' +
          '<div data-action="toggle-pedra" style="display:flex;align-items:center;gap:10px;cursor:pointer">' +
            '<span style="width:22px;height:22px;flex-shrink:0;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1;border:1px solid ' + (state.pPedraEnabled ? '#14223d' : 'rgba(20,34,61,.3)') + ';background:' + (state.pPedraEnabled ? '#14223d' : 'transparent') + ';color:' + (state.pPedraEnabled ? '#f5efe3' : 'transparent') + '">✓</span>' +
            '<span style="font-size:13px;color:#5a6170">Adicionar pedra natural <span style="color:#9a7b34">· + ' + formatBRL(sel.unitValue / 2) + '</span></span>' +
          '</div>';
        if (state.pPedraEnabled) {
          personalizationHtml += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">' +
            PEDRA_OPTIONS.map(function (opt) {
              return '<span class="pill-option' + (state.pPedraColor === opt.color ? ' active' : '') + '" style="display:flex;align-items:center;gap:8px" data-action="select-pedra" data-value="' + esc(opt.color) + '"><span style="width:14px;height:14px;border-radius:50%;background:' + opt.swatch + ';display:inline-block;border:1px solid rgba(20,34,61,.2)"></span>' + esc(opt.color) + ' · ' + esc(opt.stone) + '</span>';
            }).join('') + '</div>';
        }
        personalizationHtml += '</div>';
      }
    } else {
      if (state.customText) {
        personalizationHtml += '<div style="margin-top:10px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;background:#f2eee6;padding:12px 14px">' +
          '<span style="font-size:15px;color:#14223d;font-family:\'Cormorant Garamond\',serif;font-style:italic;line-height:1.4">“' + esc(state.customText) + '”</span>' +
          '<span data-action="open-personalize" style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#9a7b34;cursor:pointer;white-space:nowrap">Editar</span></div>';
      } else {
        personalizationHtml += '<div style="margin-top:12px"><span data-action="open-personalize" style="display:inline-block;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#14223d;border:1px solid rgba(20,34,61,.3);padding:11px 20px;cursor:pointer">+ Adicionar personalização</span></div>';
      }
    }

    personalizationHtml += '<div style="margin-top:14px;font-size:12px;color:#9aa4b8;font-family:\'Cormorant Garamond\',serif;font-style:italic;line-height:1.5">Peças personalizadas não são alteradas após a confirmação do pedido. Em caso de erro na personalização, é necessário produzir uma nova peça; ajustes pontuais podem ser avaliados sob consulta, com custo à parte.</div>' +
      '<div style="margin-top:8px;font-size:12px;color:#9aa4b8;font-family:\'Cormorant Garamond\',serif;font-style:italic;line-height:1.5">Em decorrência de cada monitor, a cor da pedra pode variar sutilmente da foto do site. Todas as medidas são aproximadas e podem variar de acordo com a produção.</div>' +
      '</div>';

    mount.innerHTML =
      '<div class="modal-overlay modal-outer-pad" data-close="close-product" style="z-index:100">' +
        '<div class="modal-stack">' +
          '<button type="button" class="modal-close" data-action="close-product">×</button>' +
          '<div class="modal-media"><img src="' + esc(p.imgSrc) + '" alt="' + esc(p.name) + '"></div>' +
          '<div class="modal-body">' +
            '<span style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9a7b34">' + esc(p.category) + '</span>' +
            '<div style="font-family:\'Marcellus\',serif;font-size:28px;color:#14223d;margin-top:8px">' + esc(p.name) + '</div>' +
            '<div style="font-size:22px;font-weight:600;color:#14223d;margin-top:14px">' + sel.currentPriceLabel + '</div>' +
            (sel.hasPriceExtras ? '<div style="font-size:13px;color:#9a7b34;margin-top:4px">Inclui ' + sel.priceExtrasLabel + '</div>' : '') +
            variantsHtml + specsHtml + personalizationHtml +
            '<div style="margin-top:18px;display:flex;align-items:center;gap:18px">' +
              '<div class="qty-stepper"><button type="button" data-action="dec-qty">−</button><span>' + state.qty + '</span><button type="button" data-action="inc-qty">+</button></div>' +
              '<span style="font-size:13px;color:#5a6170;font-family:\'Cormorant Garamond\',serif;font-style:italic">Pagamento e envio direto pelo site</span>' +
            '</div>' +
            '<div style="margin-top:18px;display:flex;gap:12px">' +
              '<span class="outline-btn" style="flex:1;text-align:center;padding:15px 20px;font-size:13px" data-action="add-to-cart-now">Adicionar à sacola</span>' +
              '<span class="buy-btn" style="flex:1;text-align:center;padding:15px 20px;font-size:13px" data-action="buy-now">Comprar agora</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderPersonalizeModal() {
    var mount = document.getElementById('personalize-modal-mount');
    if (!state.personalizeOpen || !state.selectedId) { mount.innerHTML = ''; return; }
    var p = byId(state.selectedId);
    if (!p) { mount.innerHTML = ''; return; }
    mount.innerHTML =
      '<div class="modal-overlay" data-close="close-personalize" style="z-index:200">' +
        '<div class="modal-pad-40">' +
          '<button type="button" class="modal-close" data-action="close-personalize">×</button>' +
          '<span style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#9a7b34">Personalizar peça</span>' +
          '<div style="font-family:\'Marcellus\',serif;font-size:24px;color:#14223d;margin-top:8px">' + esc(p.name) + '</div>' +
          '<div style="font-size:16px;color:#5a6170;font-family:\'Cormorant Garamond\',serif;font-style:italic;margin-top:14px;line-height:1.5">' + esc(p.customNote) + '</div>' +
          '<textarea id="input-personalize-draft" data-bind="personalizeDraft" placeholder="Escreva aqui o nome, iniciais ou detalhe desejado" rows="3" class="field-textarea" style="margin-top:16px">' + esc(state.personalizeDraft) + '</textarea>' +
          '<div style="margin-top:22px;display:flex;gap:12px">' +
            '<span class="outline-btn" style="flex:1;text-align:center;padding:14px 16px;font-size:13px" data-action="close-personalize">Cancelar</span>' +
            '<span class="buy-btn" style="flex:1;text-align:center;padding:14px 16px;font-size:13px" data-action="save-personalize">Salvar</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderSizeGuideModal() {
    var mount = document.getElementById('size-guide-modal-mount');
    if (!state.sizeGuideOpen || !state.selectedId) { mount.innerHTML = ''; return; }
    var p = byId(state.selectedId);
    var guide = p && SIZE_GUIDE_PMG[p.category];
    if (!p || !guide) { mount.innerHTML = ''; return; }
    mount.innerHTML =
      '<div class="modal-overlay" data-close="close-size-guide" style="z-index:200">' +
        '<div class="modal-pad-40">' +
          '<button type="button" class="modal-close" data-action="close-size-guide">×</button>' +
          '<span style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#9a7b34">Guia de tamanhos</span>' +
          '<div style="font-family:\'Marcellus\',serif;font-size:24px;color:#14223d;margin-top:8px">' + esc(p.category) + '</div>' +
          '<div class="size-guide-row">' +
          guide.options.map(function (o) {
            return '<div><div class="size-guide-thumb">' + o.label + '</div>' +
              '<div style="font-family:\'Marcellus\',serif;font-size:20px;color:#14223d;margin-top:10px">' + o.label + '</div>' +
              '<div style="font-size:13px;color:#9a7b34;margin-top:2px">' + o.min + '–' + o.max + guide.unit + '</div></div>';
          }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderProcessInfoModal() {
    var mount = document.getElementById('process-info-modal-mount');
    if (!state.processInfoOpen) { mount.innerHTML = ''; return; }
    var colors = { contato: '#14223d', descricao: '#14223d', enviar: '#14223d' };
    ['contato', 'descricao', 'enviar'].forEach(function (k) { colors[k] = state.leadStep === k ? '#14223d' : '#9aa4b8'; });

    var stepHtml = '';
    if (state.leadStep === 'contato') {
      stepHtml =
        '<div style="margin-top:26px;font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:16px;color:#5a6170">Pra começar, como podemos te chamar de volta?</div>' +
        '<div style="margin-top:16px;display:flex;flex-direction:column;gap:10px">' +
          '<input id="input-lead-name" data-bind="leadName" value="' + esc(state.leadName) + '" type="text" placeholder="Nome" class="field-input" />' +
          '<input id="input-lead-phone" data-bind="leadPhone" value="' + esc(state.leadPhone) + '" type="text" placeholder="WhatsApp (com DDD)" class="field-input" />' +
          '<input id="input-lead-email" data-bind="leadEmail" value="' + esc(state.leadEmail) + '" type="email" placeholder="E-mail (opcional)" class="field-input" />' +
        '</div>' +
        '<span class="buy-btn" style="display:block;text-align:center;margin-top:22px;padding:15px;font-size:13px" data-action="lead-go-descricao">Continuar</span>';
    } else if (state.leadStep === 'descricao') {
      stepHtml =
        '<div style="margin-top:26px;font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:16px;color:#5a6170">Descreva a joia que você imagina — metal, tamanho, onde gravar, o que não pode faltar.</div>' +
        '<textarea id="input-lead-description" data-bind="leadDescription" placeholder="Ex: um anel em prata com o nome da minha filha gravado por dentro..." rows="4" class="field-textarea" style="margin-top:14px">' + esc(state.leadDescription) + '</textarea>' +
        '<div style="margin-top:22px;display:flex;gap:12px">' +
          '<span class="outline-btn" style="padding:15px 20px;font-size:13px" data-action="lead-back-contato">Voltar</span>' +
          '<span class="buy-btn" style="flex:1;text-align:center;padding:15px;font-size:13px" data-action="lead-go-enviar">Continuar</span>' +
        '</div>';
    } else if (state.leadStep === 'enviar') {
      stepHtml =
        '<div style="margin-top:26px;background:#f2eee6;padding:18px 20px;display:flex;flex-direction:column;gap:8px">' +
          '<div style="font-size:14px;color:#14223d"><strong>' + esc(state.leadName) + '</strong> · ' + esc(state.leadPhone) + '</div>' +
          (state.leadEmail ? '<div style="font-size:13px;color:#5a6170">' + esc(state.leadEmail) + '</div>' : '') +
          '<div style="font-size:14px;color:#5a6170;font-family:\'Cormorant Garamond\',serif;font-style:italic;margin-top:6px;line-height:1.5">“' + esc(state.leadDescription) + '”</div>' +
        '</div>' +
        '<div style="margin-top:16px;font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:15px;color:#5a6170;line-height:1.6">Ao enviar, essas informações ficam registradas com a gente — quando você chamar no WhatsApp, já vamos ter tudo em mãos pra te responder.</div>' +
        '<div style="margin-top:22px;display:flex;gap:12px">' +
          '<span class="outline-btn" style="padding:15px 20px;font-size:13px" data-action="lead-back-descricao">Voltar</span>' +
          '<span class="buy-btn" style="flex:1;text-align:center;padding:15px;font-size:13px" data-action="submit-lead">Enviar e chamar no WhatsApp</span>' +
        '</div>';
    }

    mount.innerHTML =
      '<div class="modal-overlay" data-close="close-process-info" style="z-index:200">' +
        '<div class="modal-pad-44">' +
          '<button type="button" class="modal-close" data-action="close-process-info">×</button>' +
          '<span style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#9a7b34">Criar uma joia</span>' +
          '<div style="font-family:\'Marcellus\',serif;font-size:26px;color:#14223d;margin-top:8px">Conte sua ideia pra gente</div>' +
          '<div class="step-indicator">' +
            '<span class="label" style="color:' + colors.contato + '">1. Contato</span><span class="line"></span>' +
            '<span class="label" style="color:' + colors.descricao + '">2. Descrição</span><span class="line"></span>' +
            '<span class="label" style="color:' + colors.enviar + '">3. Enviar</span>' +
          '</div>' +
          stepHtml +
        '</div>' +
      '</div>';
  }

  function renderCartDrawer() {
    var mount = document.getElementById('cart-drawer-mount');
    if (!state.cartOpen) { mount.innerHTML = ''; return; }
    var total = state.cart.reduce(function (s, c) { return s + c.unitValue * c.qty; }, 0);
    mount.innerHTML =
      '<div class="drawer-overlay" data-close="close-cart" style="z-index:150">' +
        '<div class="drawer-panel">' +
          '<div class="drawer-header"><span class="drawer-header-title">Sua sacola</span><button type="button" class="modal-close" style="position:static" data-action="close-cart">×</button></div>' +
          '<div class="drawer-body">' +
          (state.cart.length === 0 ? '<div class="drawer-empty">Sua sacola está vazia.</div>' :
            state.cart.map(function (c) {
              return '<div class="drawer-line">' +
                '<div class="drawer-thumb"><img src="' + esc(c.imgSrc) + '" loading="lazy" alt="' + esc(c.name) + '"></div>' +
                '<div style="flex:1;min-width:0">' +
                  '<div style="font-family:\'Marcellus\',serif;font-size:15px;color:#14223d">' + esc(c.name) + '</div>' +
                  (c.variantLabel ? '<div style="font-size:13px;color:#5a6170;margin-top:2px">' + esc(c.variantLabel) + '</div>' : '') +
                  (c.sizeLabel ? '<div style="font-size:13px;color:#5a6170;margin-top:2px">' + esc(c.sizeLabel) + '</div>' : '') +
                  (c.customText ? '<div style="font-size:13px;color:#9a7b34;font-family:\'Cormorant Garamond\',serif;font-style:italic;margin-top:2px">“' + esc(c.customText) + '”</div>' : '') +
                  '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">' +
                    '<div class="qty-stepper" style="border:1px solid rgba(20,34,61,.25)"><button type="button" style="width:26px;height:28px;font-size:13px" data-action="cart-dec" data-key="' + esc(c.key) + '">−</button><span style="width:22px;font-size:13px">' + c.qty + '</span><button type="button" style="width:26px;height:28px;font-size:13px" data-action="cart-inc" data-key="' + esc(c.key) + '">+</button></div>' +
                    '<span style="font-size:14px;font-weight:600;color:#14223d">' + formatBRL(c.unitValue * c.qty) + '</span>' +
                  '</div>' +
                '</div>' +
                '<span style="font-size:18px;color:#9aa4b8;cursor:pointer;line-height:1;flex-shrink:0" data-action="cart-remove" data-key="' + esc(c.key) + '">×</span>' +
              '</div>';
            }).join('')) +
          '</div>' +
          '<div class="drawer-footer">' +
            '<div style="display:flex;justify-content:space-between;font-size:15px;color:#14223d;margin-bottom:16px"><span>Subtotal</span><span style="font-weight:600">' + formatBRL(total) + '</span></div>' +
            '<span class="buy-btn" style="display:block;text-align:center;padding:16px;font-size:13px" data-action="go-to-checkout">Finalizar compra</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderFavoritesDrawer() {
    var mount = document.getElementById('favorites-drawer-mount');
    if (!state.favoritesOpen) { mount.innerHTML = ''; return; }
    var favProducts = PRODUCTS.filter(function (p) { return state.favorites.indexOf(p.id) !== -1; });
    mount.innerHTML =
      '<div class="drawer-overlay" data-close="close-favorites" style="z-index:150">' +
        '<div class="drawer-panel">' +
          '<div class="drawer-header"><span class="drawer-header-title">Favoritos</span><button type="button" class="modal-close" style="position:static" data-action="close-favorites">×</button></div>' +
          '<div class="drawer-body">' +
          (favProducts.length === 0 ? '<div class="drawer-empty">Você ainda não favoritou nenhuma peça.</div>' :
            favProducts.map(function (p) {
              return '<div class="drawer-line" style="cursor:pointer" data-action="open-favorite-product" data-id="' + p.id + '">' +
                '<div class="drawer-thumb"><img src="' + esc(p.imgSrc) + '" loading="lazy" alt="' + esc(p.name) + '"></div>' +
                '<div style="flex:1;min-width:0"><div style="font-family:\'Marcellus\',serif;font-size:15px;color:#14223d">' + esc(p.name) + '</div><div style="font-size:14px;font-weight:600;color:#14223d;margin-top:6px">' + esc(p.priceLabel) + '</div></div>' +
                '<span style="font-size:18px;color:#9aa4b8;cursor:pointer;line-height:1;flex-shrink:0" data-action="remove-favorite" data-id="' + p.id + '">×</span>' +
              '</div>';
            }).join('')) +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderAuthModal() {
    var mount = document.getElementById('auth-modal-mount');
    if (!state.authOpen) { mount.innerHTML = ''; return; }
    var tabs = [{ id: 'login', label: 'Entrar' }, { id: 'cadastro', label: 'Criar conta' }];
    mount.innerHTML =
      '<div class="modal-overlay modal-outer-pad" data-close="close-auth" style="z-index:260">' +
        '<div class="modal-pad-40">' +
          '<button type="button" class="modal-close" data-action="close-auth">×</button>' +
          '<div class="auth-tabs">' +
          tabs.map(function (t) {
            return '<span class="auth-tab' + (state.authTab === t.id ? ' active' : '') + '" data-action="set-auth-tab" data-tab="' + t.id + '">' + t.label + '</span>';
          }).join('') + '</div>' +
          (state.authTab === 'cadastro' ? '<input id="input-auth-name" data-bind="authName" value="' + esc(state.authName) + '" type="text" placeholder="Nome completo" class="field-input" style="margin-bottom:10px" />' : '') +
          '<input id="input-auth-email" data-bind="authEmail" value="' + esc(state.authEmail) + '" type="email" placeholder="E-mail" class="field-input" style="margin-bottom:10px" />' +
          '<input id="input-auth-password" data-bind="authPassword" value="' + esc(state.authPassword) + '" type="password" placeholder="Senha" class="field-input" />' +
          (state.authError ? '<div class="field-error">' + esc(state.authError) + '</div>' : '') +
          '<span class="buy-btn" style="display:block;text-align:center;margin-top:22px;padding:15px;font-size:13px;' + (state.authBusy ? 'opacity:.6;pointer-events:none' : '') + '" data-action="submit-auth">' + (state.authBusy ? 'Enviando…' : (state.authTab === 'login' ? 'Entrar' : 'Criar conta')) + '</span>' +
        '</div>' +
      '</div>';
  }

  function renderCheckoutModal() {
    var mount = document.getElementById('checkout-modal-mount');
    if (!state.checkoutOpen) { mount.innerHTML = ''; return; }

    if (state.orderPlaced) {
      mount.innerHTML =
        '<div class="modal-overlay" style="z-index:250">' +
          '<div class="checkout-modal-inner">' +
            '<div class="modal-pad-44" style="padding:60px 44px;text-align:center;width:100%">' +
              '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#14223d" stroke-width="1.3" style="margin:0 auto"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>' +
              '<div style="font-family:\'Marcellus\',serif;font-size:26px;color:#14223d;margin-top:18px">Pedido confirmado</div>' +
              (state.orderNumber ? '<div style="font-size:14px;color:#9a7b34;margin-top:6px">Pedido #' + esc(state.orderNumber) + '</div>' : '') +
              '<div style="font-size:16px;color:#5a6170;font-family:\'Cormorant Garamond\',serif;font-style:italic;margin-top:12px;line-height:1.5;max-width:420px;margin-left:auto;margin-right:auto">Você vai acompanhar a produção em tempo real na sua conta — vamos enviar fotos do processo por lá.</div>' +
              '<div style="margin-top:26px;display:flex;gap:12px;justify-content:center">' +
                '<span class="outline-btn" style="padding:15px 30px;font-size:13px" data-action="continue-shopping">Continuar comprando</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      return;
    }

    var cartTotal = state.cart.reduce(function (s, c) { return s + c.unitValue * c.qty; }, 0);
    var freteValue = state.freteCalculated ? 24.9 : 0;
    var discountValue = state.couponApplied ? cartTotal * 0.1 : 0;
    var finalTotal = Math.max(0, cartTotal - discountValue + freteValue);

    var stepColors = {
      auth: state.checkoutStep === 'auth' ? '#14223d' : '#9aa4b8',
      entrega: state.checkoutStep === 'entrega' ? '#14223d' : '#9aa4b8',
      pagamento: state.checkoutStep === 'pagamento' ? '#14223d' : '#9aa4b8',
    };

    var stepHtml = '';
    if (state.checkoutStep === 'auth') {
      stepHtml = '<div style="margin-top:32px">' +
        '<div style="font-size:16px;color:#5a6170;font-family:\'Cormorant Garamond\',serif;font-style:italic;margin-bottom:18px">Entre na sua conta para acompanhar o pedido depois, ou continue sem cadastro.</div>' +
        '<span class="buy-btn" style="display:block;text-align:center;padding:15px;font-size:13px;margin-bottom:12px" data-action="checkout-open-auth">Entrar ou criar conta</span>' +
        '<span class="outline-btn" style="display:block;text-align:center;padding:15px;font-size:13px" data-action="checkout-guest">Continuar como visitante</span>' +
      '</div>';
    } else if (state.checkoutStep === 'entrega') {
      stepHtml = '<div style="margin-top:28px;display:flex;flex-direction:column;gap:10px">' +
        '<input id="input-ship-name" data-bind="shipName" value="' + esc(state.shipName) + '" type="text" placeholder="Nome completo" class="field-input" />' +
        '<input id="input-ship-address" data-bind="shipAddress" value="' + esc(state.shipAddress) + '" type="text" placeholder="Endereço e número" class="field-input" />' +
        '<div style="display:flex;gap:10px">' +
          '<input id="input-ship-city" data-bind="shipCity" value="' + esc(state.shipCity) + '" type="text" placeholder="Cidade" class="field-input" style="flex:1" />' +
          '<input id="input-ship-cep" data-bind="shipCep" value="' + esc(state.shipCep) + '" type="text" placeholder="CEP" class="field-input" style="width:140px" />' +
          '<span style="white-space:nowrap;border:1px solid #14223d;color:#14223d;font-size:12px;letter-spacing:1px;text-transform:uppercase;padding:0 16px;display:flex;align-items:center;cursor:pointer" data-action="calc-frete">Calcular frete</span>' +
        '</div>' +
        (state.freteCalculated ? '<div style="font-size:14px;color:#5a6170;font-family:\'Cormorant Garamond\',serif;font-style:italic">Frete: ' + formatBRL(freteValue) + ' · 5 a 8 dias úteis</div>' : '') +
        '</div>' +
        '<span class="buy-btn" style="display:block;text-align:center;margin-top:24px;padding:15px;font-size:13px" data-action="go-to-payment">Continuar para pagamento</span>';
    } else if (state.checkoutStep === 'pagamento') {
      var paymentOptions = [{ id: 'pix', label: 'Pix' }, { id: 'cartao', label: 'Cartão de crédito' }];
      stepHtml = '<div style="margin-top:28px">' +
          '<span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#14223d">Cupom de desconto</span>' +
          '<div style="display:flex;gap:10px;margin-top:8px">' +
            '<input id="input-coupon" data-bind="couponCode" value="' + esc(state.couponCode) + '" type="text" placeholder="Código do cupom" class="field-input" style="flex:1" />' +
            '<span style="white-space:nowrap;border:1px solid #14223d;color:#14223d;font-size:12px;letter-spacing:1px;text-transform:uppercase;padding:0 16px;display:flex;align-items:center;cursor:pointer" data-action="apply-coupon">Aplicar</span>' +
          '</div></div>' +
        '<div style="margin-top:26px"><span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#14223d">Forma de pagamento</span><div style="margin-top:10px;display:flex;gap:10px">' +
          paymentOptions.map(function (opt) {
            return '<span class="pill-option' + (state.paymentMethod === opt.id ? ' active' : '') + '" style="flex:1;text-align:center;padding:14px 10px" data-action="select-payment" data-value="' + opt.id + '">' + opt.label + '</span>';
          }).join('') + '</div></div>' +
        (state.orderError ? '<div class="field-error">' + esc(state.orderError) + '</div>' : '') +
        '<div style="margin-top:14px;font-size:12px;color:#9aa4b8;font-family:\'Cormorant Garamond\',serif;font-style:italic;line-height:1.5">Ao confirmar, a produção começa com as personalizações definidas — não fazemos alterações depois. Erros de personalização exigem uma nova peça; ajustes pontuais podem ter custo à parte.</div>' +
        '<div style="margin-top:16px;display:flex;gap:12px">' +
          '<span class="outline-btn" style="padding:15px 20px;font-size:13px" data-action="back-to-entrega">Voltar</span>' +
          '<span class="buy-btn" style="flex:1;text-align:center;padding:15px;font-size:13px" data-action="confirm-order">Confirmar pedido</span>' +
        '</div>';
    }

    mount.innerHTML =
      '<div class="modal-overlay" style="z-index:250">' +
        '<div class="checkout-modal-inner">' +
          '<button type="button" class="modal-close" style="z-index:2" data-action="close-checkout">×</button>' +
          '<div class="modal-pad-44" style="flex:1;min-width:0">' +
            '<span style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#9a7b34">Finalizar compra</span>' +
            '<div style="font-family:\'Marcellus\',serif;font-size:26px;color:#14223d;margin-top:8px">Entrega e pagamento</div>' +
            '<div class="step-indicator">' +
              '<span class="label" style="color:' + stepColors.auth + '">1. Acesso</span><span class="line"></span>' +
              '<span class="label" style="color:' + stepColors.entrega + '">2. Entrega</span><span class="line"></span>' +
              '<span class="label" style="color:' + stepColors.pagamento + '">3. Pagamento</span>' +
            '</div>' +
            stepHtml +
          '</div>' +
          '<div class="order-sidebar">' +
            '<span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#14223d">Resumo do pedido</span>' +
            '<div style="margin-top:16px;display:flex;flex-direction:column;gap:14px;max-height:280px;overflow-y:auto">' +
            state.cart.map(function (c) {
              return '<div class="order-sidebar-line"><div class="order-sidebar-thumb"><img src="' + esc(c.imgSrc) + '" loading="lazy" alt=""></div>' +
                '<div style="flex:1;min-width:0"><div style="font-size:13px;color:#14223d;line-height:1.3">' + esc(c.name) + ' ' + esc(c.variantLabel || '') + ' × ' + c.qty + '</div></div>' +
                '<span style="font-size:13px;color:#14223d;white-space:nowrap">' + formatBRL(c.unitValue * c.qty) + '</span></div>';
            }).join('') +
            '</div>' +
            '<div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(20,34,61,.15);display:flex;flex-direction:column;gap:6px">' +
              '<div style="display:flex;justify-content:space-between;font-size:14px;color:#5a6170"><span>Subtotal</span><span>' + formatBRL(cartTotal) + '</span></div>' +
              (state.freteCalculated ? '<div style="display:flex;justify-content:space-between;font-size:14px;color:#5a6170"><span>Frete</span><span>' + formatBRL(freteValue) + '</span></div>' : '') +
              (state.couponApplied ? '<div style="display:flex;justify-content:space-between;font-size:14px;color:#5a6170"><span>Cupom</span><span>- ' + formatBRL(discountValue) + '</span></div>' : '') +
              '<div style="display:flex;justify-content:space-between;font-size:17px;color:#14223d;font-weight:600;margin-top:8px"><span>Total</span><span>' + formatBRL(finalTotal) + '</span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // ============ ACTIONS ============
  function resetProductSelectionFields() {
    state.selectedVariantIndex = 0;
    state.qty = 1;
    state.customText = '';
    state.personalizeOpen = false;
    state.pTamanho1 = '';
    state.pTamanho2 = '';
    state.pTamanhoPMG = '';
    state.pAro = '';
    state.pCaractere = '';
    state.pCorBanho = '';
    state.pPedraEnabled = false;
    state.pPedraColor = '';
    state.pDetalhesExtras = '';
  }

  function openProduct(id) {
    state.selectedId = id;
    resetProductSelectionFields();
    render();
  }

  function toggleFavorite(id) {
    var idx = state.favorites.indexOf(id);
    if (idx === -1) {
      state.favorites.push(id);
      if (state.authedUser) api.addFavorite(id).catch(function () {});
    } else {
      state.favorites.splice(idx, 1);
      if (state.authedUser) api.removeFavorite(id).catch(function () {});
    }
    render();
  }

  function addToCart(buyNow) {
    var p = byId(state.selectedId);
    if (!p) return;
    var variant = p.hasVariants ? p.variants[state.selectedVariantIndex] : null;
    var unitValue = variant ? variant.value : p.value;
    var pmgGuide = SIZE_GUIDE_PMG[p.category];
    var pmgLabel = pmgGuide ? (state.pTamanhoPMG || 'M') : null;
    var pmgOpt = pmgGuide ? pmgGuide.options.filter(function (o) { return o.label === pmgLabel; })[0] : null;
    var isAro = p.category === 'Anéis';
    var aroValue = isAro ? (state.pAro || ARO_SIZES[0]) : null;
    var sizeLabel = pmgOpt ? ('Tamanho ' + pmgOpt.label + ' (' + pmgOpt.min + '–' + pmgOpt.max + pmgGuide.unit + ')') : (isAro ? ('Aro ' + aroValue) : null);
    var item = {
      key: p.id + '|' + (variant ? variant.label : '') + '|' + (sizeLabel || '') + '|' + state.customText,
      id: p.id,
      name: p.name,
      category: p.category,
      imgSrc: p.imgSrc,
      variantLabel: variant ? variant.label : null,
      sizeLabel: sizeLabel,
      customText: state.customText,
      unitValue: unitValue,
      qty: state.qty,
    };
    var existing = state.cart.filter(function (c) { return c.key === item.key; })[0];
    if (existing) {
      existing.qty += item.qty;
    } else {
      state.cart.push(item);
    }
    if (state.authedUser) api.addCartItem(item).catch(function () {});

    state.selectedId = null;
    state.personalizeOpen = false;
    state.qty = 1;
    state.customText = '';
    state.cartOpen = !buyNow;
    state.checkoutOpen = !!buyNow;
    if (buyNow) state.checkoutStep = state.authedUser ? 'entrega' : 'auth';
    render();
  }

  function changeCartQty(key, delta) {
    var c = state.cart.filter(function (x) { return x.key === key; })[0];
    if (!c) return;
    c.qty = Math.max(1, Math.min(9, c.qty + delta));
    if (state.authedUser) api.updateCartItem(key, c.qty).catch(function () {});
    render();
  }
  function removeFromCart(key) {
    state.cart = state.cart.filter(function (c) { return c.key !== key; });
    if (state.authedUser) api.removeCartItem(key).catch(function () {});
    render();
  }

  function stepAro(dir) {
    var cur = state.pAro || ARO_SIZES[0];
    var idx = ARO_SIZES.indexOf(cur);
    state.pAro = ARO_SIZES[Math.max(0, Math.min(ARO_SIZES.length - 1, idx + dir))];
    render();
  }

  function valueFromClientX(clientX) {
    var track = document.getElementById('tamanho-track');
    var p = byId(state.selectedId);
    if (!track || !p) return 0;
    var range = TAMANHO_RANGES[p.category];
    if (!range) return 0;
    var rect = track.getBoundingClientRect();
    var pct = rect.width ? (clientX - rect.left) / rect.width : 0;
    pct = Math.max(0, Math.min(1, pct));
    return Math.round(range.min + pct * (range.max - range.min));
  }
  function dragTamanhoHandle(which, startEvent) {
    startEvent.preventDefault();
    var move = function (ev) {
      var clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      var val = valueFromClientX(clientX);
      if (which === 1) state.pTamanho1 = val; else state.pTamanho2 = val;
      render();
    };
    var up = function () {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', up);
    move(startEvent);
  }

  function submitLeadAndOpenWhatsapp() {
    var lead = {
      name: state.leadName || 'Sem nome',
      phone: state.leadPhone || '',
      email: state.leadEmail || '',
      description: state.leadDescription || '',
    };
    api.sendLead(lead).catch(function () {
      // Fallback: keep a local record so nothing is lost if the backend is unreachable.
      var existing = loadLocal('hauquimia_leads', []);
      existing.unshift(Object.assign({ id: 'lead-' + Date.now(), createdAt: new Date().toISOString() }, lead));
      saveLocal('hauquimia_leads', existing);
    });

    var msgParts = ['Olá, vim através do site, eu quero criar uma joia.', 'Nome: ' + lead.name];
    if (lead.description) msgParts.push('Ideia: ' + lead.description);
    var url = 'https://wa.me/' + CFG.whatsappNumber + '?text=' + encodeURIComponent(msgParts.join('\n'));
    window.open(url, '_blank', 'noopener');

    state.processInfoOpen = false;
    state.leadStep = 'contato';
    state.leadName = '';
    state.leadPhone = '';
    state.leadEmail = '';
    state.leadDescription = '';
    render();
  }

  function submitAuth() {
    var email = state.authEmail.trim();
    var password = state.authPassword;
    if (!email || !password) { state.authError = 'Preencha e-mail e senha.'; render(); return; }
    state.authBusy = true;
    state.authError = '';
    render();

    var req = state.authTab === 'cadastro'
      ? api.register(state.authName.trim() || 'Cliente', email, password)
      : api.login(email, password);

    req.then(function (res) {
      api.token = res.token;
      saveLocal('hauquimia_token', res.token);
      state.authedUser = res.user;
      state.authOpen = false;
      state.authBusy = false;
      state.authName = '';
      state.authEmail = '';
      state.authPassword = '';
      return syncGuestStateToServer();
    }).then(function () {
      if (state.checkoutOpen && state.checkoutStep === 'auth') state.checkoutStep = 'entrega';
      render();
    }).catch(function (err) {
      state.authBusy = false;
      state.authError = err.message || 'Não foi possível concluir. Tente novamente.';
      render();
    });
  }

  function syncGuestStateToServer() {
    var localCart = state.cart.slice();
    var localFavs = state.favorites.slice();
    var pushes = localCart.map(function (item) { return api.addCartItem(item).catch(function () {}); })
      .concat(localFavs.map(function (id) { return api.addFavorite(id).catch(function () {}); }));
    return Promise.all(pushes).then(function () {
      return Promise.all([api.getCart().catch(function () { return null; }), api.getFavorites().catch(function () { return null; })]);
    }).then(function (res) {
      if (res[0]) state.cart = res[0];
      if (res[1]) state.favorites = res[1];
    });
  }

  function logout() {
    state.authedUser = null;
    api.token = null;
    try { localStorage.removeItem('hauquimia_token'); } catch (e) {}
    state.cart = loadLocal('hauquimia_cart', []);
    state.favorites = loadLocal('hauquimia_favorites', []);
    render();
  }

  function confirmOrder() {
    var order = {
      items: state.cart.map(function (c) { return { productId: c.id, name: c.name, variantLabel: c.variantLabel, sizeLabel: c.sizeLabel, customText: c.customText, unitValue: c.unitValue, qty: c.qty }; }),
      paymentMethod: state.paymentMethod,
      shipName: state.shipName,
      shipAddress: state.shipAddress,
      shipCity: state.shipCity,
      shipCep: state.shipCep,
      couponCode: state.couponApplied ? state.couponCode : null,
    };
    state.orderError = '';
    render();
    api.createOrder(order).then(function (res) {
      state.orderPlaced = true;
      state.orderNumber = res && res.id;
      state.cart = [];
      if (state.authedUser) { /* server is now source of truth */ } else { saveLocal('hauquimia_cart', []); }
      render();
    }).catch(function (err) {
      state.orderError = err.message || 'Não foi possível confirmar o pedido agora. Tente novamente em instantes.';
      render();
    });
  }

  // ============ EVENT DELEGATION ============
  var actionHandlers = {
    'scroll-vitrine': function () {
      var el = document.getElementById('vitrine-section');
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    },
    'scroll-vitrine-close-menu': function () { state.menuOpen = false; render(); actionHandlers['scroll-vitrine'](); },
    'toggle-search': function () { state.searchOpen = !state.searchOpen; state.searchQuery = ''; render(); },
    'open-favorites': function () { state.favoritesOpen = true; render(); },
    'close-favorites': function () { state.favoritesOpen = false; render(); },
    'open-cart': function () { state.cartOpen = true; render(); },
    'close-cart': function () { state.cartOpen = false; render(); },
    'toggle-menu': function () { state.menuOpen = !state.menuOpen; render(); },
    'close-menu': function () { state.menuOpen = false; render(); },
    'open-login': function () { state.authOpen = true; state.authTab = 'login'; state.authError = ''; render(); },
    'checkout-open-auth': function () { state.authOpen = true; state.authTab = 'login'; state.authError = ''; render(); },
    'close-auth': function () { state.authOpen = false; render(); },
    'set-auth-tab': function (el) { state.authTab = el.dataset.tab; state.authError = ''; render(); },
    'submit-auth': submitAuth,
    'logout': logout,

    'select-category': function (el) { state.activeCategory = el.dataset.cat; render(); },
    'open-product': function (el) { openProduct(el.dataset.id); },
    'open-favorite-product': function (el) { state.favoritesOpen = false; openProduct(el.dataset.id); },
    'toggle-favorite': function (el, e) { e.stopPropagation(); toggleFavorite(el.dataset.id); },
    'remove-favorite': function (el, e) { e.stopPropagation(); toggleFavorite(el.dataset.id); },
    'close-product': function () { state.selectedId = null; state.personalizeOpen = false; render(); },
    'select-variant': function (el) { state.selectedVariantIndex = Number(el.dataset.index); render(); },
    'inc-qty': function () { state.qty = Math.min(9, state.qty + 1); render(); },
    'dec-qty': function () { state.qty = Math.max(1, state.qty - 1); render(); },
    'open-personalize': function () { state.personalizeOpen = true; state.personalizeDraft = state.customText; render(); },
    'close-personalize': function () { state.personalizeOpen = false; render(); },
    'save-personalize': function () { state.customText = state.personalizeDraft; state.personalizeOpen = false; render(); },
    'select-pmg': function (el) { state.pTamanhoPMG = el.dataset.label; render(); },
    'open-size-guide': function () { state.sizeGuideOpen = true; render(); },
    'close-size-guide': function () { state.sizeGuideOpen = false; render(); },
    'aro-up': function () { stepAro(1); },
    'aro-down': function () { stepAro(-1); },
    'select-aro': function (el) { state.pAro = Number(el.dataset.value); render(); },
    'select-cor-banho': function (el) { state.pCorBanho = el.dataset.value; render(); },
    'toggle-pedra': function () {
      state.pPedraEnabled = !state.pPedraEnabled;
      if (state.pPedraEnabled && !state.pPedraColor) state.pPedraColor = PEDRA_OPTIONS[0].color;
      render();
    },
    'select-pedra': function (el) { state.pPedraColor = el.dataset.value; render(); },
    'add-to-cart-now': function () { addToCart(false); },
    'buy-now': function () { addToCart(true); },
    'handle1-down': function (el, e) { dragTamanhoHandle(1, e); },
    'handle2-down': function (el, e) { dragTamanhoHandle(2, e); },
    'track-down': function (el, e) {
      if (e.target.dataset.action === 'handle1-down' || e.target.dataset.action === 'handle2-down') return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var val = valueFromClientX(clientX);
      var v1 = state.pTamanho1 !== '' ? Number(state.pTamanho1) : val;
      var v2 = state.pTamanho2 !== '' ? Number(state.pTamanho2) : val;
      var which = Math.abs(val - v1) <= Math.abs(val - v2) ? 1 : 2;
      dragTamanhoHandle(which, e);
    },

    'cart-inc': function (el) { changeCartQty(el.dataset.key, 1); },
    'cart-dec': function (el) { changeCartQty(el.dataset.key, -1); },
    'cart-remove': function (el) { removeFromCart(el.dataset.key); },
    'go-to-checkout': function () {
      state.cartOpen = false;
      state.checkoutOpen = true;
      state.checkoutStep = state.authedUser ? 'entrega' : 'auth';
      render();
    },
    'close-checkout': function () { state.checkoutOpen = false; render(); },
    'checkout-guest': function () { state.checkoutStep = 'entrega'; render(); },
    'go-to-payment': function () { state.checkoutStep = 'pagamento'; render(); },
    'back-to-entrega': function () { state.checkoutStep = 'entrega'; render(); },
    'calc-frete': function () { state.freteCalculated = true; render(); },
    'apply-coupon': function () { state.couponApplied = !!state.couponCode.trim(); render(); },
    'select-payment': function (el) { state.paymentMethod = el.dataset.value; render(); },
    'confirm-order': confirmOrder,
    'continue-shopping': function () {
      state.orderPlaced = false;
      state.orderNumber = null;
      state.checkoutOpen = false;
      state.cartOpen = false;
      state.checkoutStep = 'auth';
      state.freteCalculated = false;
      state.couponApplied = false;
      state.couponCode = '';
      render();
    },

    'open-process-info': function () { state.processInfoOpen = true; state.leadStep = 'contato'; render(); },
    'close-process-info': function () { state.processInfoOpen = false; render(); },
    'lead-go-descricao': function () { state.leadStep = 'descricao'; render(); },
    'lead-back-contato': function () { state.leadStep = 'contato'; render(); },
    'lead-go-enviar': function () { state.leadStep = 'enviar'; render(); },
    'lead-back-descricao': function () { state.leadStep = 'descricao'; render(); },
    'submit-lead': submitLeadAndOpenWhatsapp,
  };

  var closeHandlers = {
    'close-product': actionHandlers['close-product'],
    'close-personalize': actionHandlers['close-personalize'],
    'close-size-guide': actionHandlers['close-size-guide'],
    'close-process-info': actionHandlers['close-process-info'],
    'close-cart': actionHandlers['close-cart'],
    'close-favorites': actionHandlers['close-favorites'],
    'close-auth': actionHandlers['close-auth'],
  };

  document.addEventListener('click', function (e) {
    var overlay = e.target.closest('.modal-overlay, .drawer-overlay');
    if (overlay && e.target === overlay && overlay.dataset.close) {
      closeHandlers[overlay.dataset.close] && closeHandlers[overlay.dataset.close]();
      return;
    }
    var actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    var handler = actionHandlers[actionEl.dataset.action];
    if (handler) handler(actionEl, e);
  });

  document.addEventListener('mousedown', function (e) {
    var actionEl = e.target.closest('[data-action="handle1-down"], [data-action="handle2-down"], [data-action="track-down"]');
    if (!actionEl) return;
    var handler = actionHandlers[actionEl.dataset.action];
    if (handler) handler(actionEl, e);
  });
  document.addEventListener('touchstart', function (e) {
    var actionEl = e.target.closest('[data-action="handle1-down"], [data-action="handle2-down"], [data-action="track-down"]');
    if (!actionEl) return;
    var handler = actionHandlers[actionEl.dataset.action];
    if (handler) handler(actionEl, e);
  }, { passive: true });

  document.addEventListener('input', function (e) {
    var key = e.target.dataset.bind;
    if (!key) return;
    state[key] = e.target.value;
    render();
  });

  document.getElementById('search-input').addEventListener('input', function (e) {
    state.searchQuery = e.target.value;
    render();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (state.selectedId) { state.selectedId = null; state.personalizeOpen = false; }
    else if (state.personalizeOpen) state.personalizeOpen = false;
    else if (state.sizeGuideOpen) state.sizeGuideOpen = false;
    else if (state.processInfoOpen) state.processInfoOpen = false;
    else if (state.authOpen) state.authOpen = false;
    else if (state.cartOpen) state.cartOpen = false;
    else if (state.favoritesOpen) state.favoritesOpen = false;
    else if (state.checkoutOpen && !state.orderPlaced) state.checkoutOpen = false;
    else return;
    render();
  });

  // ============ SCROLL REVEAL + HERO PARALLAX ============
  function initScrollEffects() {
    var revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
    }

    var heroVideo = document.getElementById('hero-parallax-img');
    if (heroVideo) {
      heroVideo.muted = true;
      heroVideo.defaultMuted = true;
      var raf = null;
      var onScroll = function () {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var hero = heroVideo.parentElement;
          var rect = hero.getBoundingClientRect();
          var p = Math.max(-1, Math.min(1, -rect.top / (rect.height || 1)));
          heroVideo.style.transform = 'translateY(' + (p * 60) + 'px)';
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    }
  }

  // ============ INIT ============
  function init() {
    state.cart = loadLocal('hauquimia_cart', []);
    state.favorites = loadLocal('hauquimia_favorites', []);
    api.token = loadLocal('hauquimia_token', null);

    render();
    initScrollEffects();

    if (api.token) {
      api.me().then(function (user) {
        state.authedUser = user;
        return Promise.all([api.getCart().catch(function () { return null; }), api.getFavorites().catch(function () { return null; })]);
      }).then(function (res) {
        if (res && res[0]) state.cart = res[0];
        if (res && res[1]) state.favorites = res[1];
        render();
      }).catch(function () {
        // Token invalid/expired or API unreachable: fall back to guest mode silently.
        api.token = null;
        try { localStorage.removeItem('hauquimia_token'); } catch (e) {}
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
