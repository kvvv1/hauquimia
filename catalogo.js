// Hauquímia — catalog page (/catalogo/): search, faceted filters, sorting.
// Product data, product cards, favorites and the product modal all come from
// app.js through window.Hauquimia; this file only owns the filter state.
(function () {
  'use strict';

  var H = window.Hauquimia;
  var root = document.getElementById('catalog-root');
  if (!H || !root) return;

  var TRAITS = [
    { key: 'pedra', label: 'Com pedra natural' },
    { key: 'personalizavel', label: 'Personalizável' },
    { key: 'gravacao', label: 'Com gravação' },
    { key: 'tamanhos', label: 'Escolha de tamanho' },
    { key: 'corBanho', label: 'Escolha de cor de banho' },
    { key: 'pronta', label: 'Peça pronta' },
  ];
  var PRICE_PRESETS = [
    { label: 'Até R$ 200', min: null, max: 200 },
    { label: 'R$ 200 – 400', min: 200, max: 400 },
    { label: 'R$ 400 – 600', min: 400, max: 600 },
    { label: 'Acima de R$ 600', min: 600, max: null },
  ];
  // Extra words each trait answers to in the search box.
  var TRAIT_SEARCH_WORDS = {
    pedra: 'pedra pedras gema natural topazio peridoto crisoprazio granada citrino ametista',
    gravacao: 'gravacao gravado gravada personalizado nome inicial',
    pronta: 'pronta pronto',
    corBanho: 'banho ouro branco amarelo',
  };

  var esc = H.esc;
  var norm = H.normalizeText;

  // Precomputed search fields per product.
  var index = H.products.map(function (p, order) {
    var extra = TRAITS.filter(function (t) { return p.traits[t.key]; })
      .map(function (t) { return t.label + ' ' + (TRAIT_SEARCH_WORDS[t.key] || ''); }).join(' ');
    return {
      p: p,
      order: order,
      name: norm(p.name),
      category: norm(p.category),
      rest: norm((p.specs || []).join(' ') + ' ' + (p.customNote || '') + ' ' + extra),
    };
  });

  var state = readUrl();

  // ============ URL STATE ============
  function readUrl() {
    var u = new URLSearchParams(location.search);
    var list = function (k) { return (u.get(k) || '').split(',').filter(Boolean); };
    var num = function (k) { var v = parseFloat(u.get(k)); return isFinite(v) && v >= 0 ? v : null; };
    return {
      q: u.get('q') || '',
      cats: list('cat').filter(function (c) { return H.categories.indexOf(c) !== -1; }),
      traits: list('f').filter(function (k) { return TRAITS.some(function (t) { return t.key === k; }); }),
      min: num('min'),
      max: num('max'),
      fav: u.get('fav') === '1',
      sort: u.get('ordem') || 'relevancia',
    };
  }
  function writeUrl() {
    var u = new URLSearchParams();
    if (state.q.trim()) u.set('q', state.q.trim());
    if (state.cats.length) u.set('cat', state.cats.join(','));
    if (state.traits.length) u.set('f', state.traits.join(','));
    if (state.min != null) u.set('min', state.min);
    if (state.max != null) u.set('max', state.max);
    if (state.fav) u.set('fav', '1');
    if (state.sort !== 'relevancia') u.set('ordem', state.sort);
    var qs = u.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  // ============ FILTERING ============
  function searchScore(entry, terms) {
    var score = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (entry.name.indexOf(t) !== -1) score += 3;
      else if (entry.category.indexOf(t) !== -1) score += 2;
      else if (entry.rest.indexOf(t) !== -1) score += 1;
      else return 0; // every term must match somewhere
    }
    return score;
  }
  // `skip` leaves one facet out, so counts show what selecting it would add.
  function matches(entry, terms, skip) {
    var p = entry.p;
    if (skip !== 'cats' && state.cats.length && state.cats.indexOf(p.category) === -1) return false;
    if (skip !== 'traits' && state.traits.some(function (k) { return !p.traits[k]; })) return false;
    if (state.min != null && p.value < state.min) return false;
    if (state.max != null && p.value > state.max) return false;
    if (state.fav && H.favorites().indexOf(p.id) === -1) return false;
    if (terms.length && !searchScore(entry, terms)) return false;
    return true;
  }
  // Light Portuguese stemming so singular and plural match each other
  // (coração/corações, anel/anéis, pedra/pedras).
  function stem(t) {
    if (t.length < 5) return t;
    if (/(oes|aes)$/.test(t)) return t.slice(0, -3);
    if (/ao$/.test(t)) return t.slice(0, -2);
    if (/eis$/.test(t)) return t.slice(0, -2);
    if (/s$/.test(t)) return t.slice(0, -1);
    return t;
  }
  function searchTerms() {
    return norm(state.q).split(/\s+/).filter(function (t) { return t.length > 0; }).map(stem);
  }
  function results() {
    var terms = searchTerms();
    var list = index.filter(function (e) { return matches(e, terms); });
    var by = {
      'preco-asc': function (a, b) { return a.p.value - b.p.value || a.order - b.order; },
      'preco-desc': function (a, b) { return b.p.value - a.p.value || a.order - b.order; },
      nome: function (a, b) { return a.p.name.localeCompare(b.p.name, 'pt-BR'); },
      relevancia: function (a, b) {
        return terms.length ? (searchScore(b, terms) - searchScore(a, terms)) || a.order - b.order : a.order - b.order;
      },
    };
    return list.sort(by[state.sort] || by.relevancia).map(function (e) { return e.p; });
  }
  function facetCount(skip, test) {
    var terms = searchTerms();
    return index.filter(function (e) { return matches(e, terms, skip) && test(e.p); }).length;
  }
  function activeFilterCount() {
    return state.cats.length + state.traits.length + (state.min != null || state.max != null ? 1 : 0) + (state.fav ? 1 : 0);
  }

  // ============ RENDER ============
  var el = {
    search: document.getElementById('catalog-search'),
    clearSearch: root.querySelector('[data-cat-action="clear-search"]'),
    pills: document.getElementById('catalog-cat-pills'),
    cats: document.getElementById('filter-categories'),
    traits: document.getElementById('filter-traits'),
    presets: document.getElementById('filter-price-presets'),
    min: document.getElementById('filter-price-min'),
    max: document.getElementById('filter-price-max'),
    fav: document.getElementById('filter-favorites'),
    sort: document.getElementById('catalog-sort'),
    count: document.getElementById('catalog-result-count'),
    filterCount: document.getElementById('catalog-filter-count'),
    chips: document.getElementById('catalog-active-chips'),
    grid: document.getElementById('catalog-grid'),
    empty: document.getElementById('catalog-empty'),
    apply: document.getElementById('catalog-apply-btn'),
    panel: document.getElementById('catalog-filters'),
    overlay: document.getElementById('catalog-filters-overlay'),
  };

  function setHtml(node, html) { if (node.innerHTML !== html) node.innerHTML = html; }

  function checkbox(group, value, label, checked, count) {
    return '<label class="filter-check' + (count === 0 && !checked ? ' is-empty' : '') + '">' +
      '<input type="checkbox" data-filter="' + group + '" value="' + esc(value) + '"' + (checked ? ' checked' : '') + '>' +
      '<span class="filter-box"></span><span class="filter-label">' + esc(label) + '</span>' +
      '<span class="filter-count">' + count + '</span></label>';
  }

  function renderControls() {
    if (document.activeElement !== el.search && el.search.value !== state.q) el.search.value = state.q;
    el.clearSearch.hidden = !state.q;

    setHtml(el.pills,
      '<button type="button" class="cat-pill' + (state.cats.length ? '' : ' is-active') + '" data-cat-action="pill" data-value="">Todas</button>' +
      H.categories.map(function (c) {
        return '<button type="button" class="cat-pill' + (state.cats.indexOf(c) !== -1 ? ' is-active' : '') + '" data-cat-action="pill" data-value="' + esc(c) + '">' + esc(c) + '</button>';
      }).join(''));

    setHtml(el.cats, H.categories.map(function (c) {
      return checkbox('cat', c, c, state.cats.indexOf(c) !== -1, facetCount('cats', function (p) { return p.category === c; }));
    }).join(''));

    setHtml(el.traits, TRAITS.map(function (t) {
      return checkbox('trait', t.key, t.label, state.traits.indexOf(t.key) !== -1, facetCount('traits', function (p) { return p.traits[t.key]; }));
    }).join(''));

    setHtml(el.presets, PRICE_PRESETS.map(function (pr, i) {
      var on = state.min === pr.min && state.max === pr.max;
      return '<button type="button" class="filter-chip' + (on ? ' is-active' : '') + '" data-cat-action="price-preset" data-index="' + i + '">' + esc(pr.label) + '</button>';
    }).join(''));

    if (document.activeElement !== el.min) el.min.value = state.min == null ? '' : state.min;
    if (document.activeElement !== el.max) el.max.value = state.max == null ? '' : state.max;
    el.fav.checked = state.fav;
    el.sort.value = state.sort;

    var n = activeFilterCount();
    el.filterCount.hidden = n === 0;
    el.filterCount.textContent = n;
  }

  function renderChips() {
    var chips = [];
    if (state.q.trim()) chips.push({ type: 'q', label: '“' + state.q.trim() + '”' });
    state.cats.forEach(function (c) { chips.push({ type: 'cat', value: c, label: c }); });
    state.traits.forEach(function (k) {
      var t = TRAITS.filter(function (x) { return x.key === k; })[0];
      chips.push({ type: 'trait', value: k, label: t.label });
    });
    if (state.min != null || state.max != null) {
      var label = state.min != null && state.max != null ? H.formatBRL(state.min) + ' – ' + H.formatBRL(state.max)
        : state.min != null ? 'A partir de ' + H.formatBRL(state.min) : 'Até ' + H.formatBRL(state.max);
      chips.push({ type: 'price', label: label });
    }
    if (state.fav) chips.push({ type: 'fav', label: 'Favoritos' });

    setHtml(el.chips, chips.map(function (c) {
      return '<button type="button" class="active-chip" data-cat-action="remove-chip" data-type="' + c.type + '" data-value="' + esc(c.value || '') + '">' +
        esc(c.label) + '<span aria-hidden="true">×</span><span class="sr-only">Remover filtro</span></button>';
    }).join('') + (chips.length > 1 ? '<button type="button" class="active-chip-clear" data-cat-action="clear-all">Limpar tudo</button>' : ''));
  }

  function renderCatalog() {
    var list = results();
    renderControls();
    renderChips();
    var label = list.length === 1 ? '1 peça' : list.length + ' peças';
    el.count.textContent = label;
    el.apply.textContent = list.length ? 'Ver ' + label : 'Nenhuma peça';
    el.empty.hidden = list.length !== 0;
    H.setGridHtml(el.grid, list);
  }

  function update() {
    writeUrl();
    renderCatalog();
  }

  // ============ FILTER DRAWER (mobile) ============
  function setFiltersOpen(open) {
    el.panel.classList.toggle('is-open', open);
    el.overlay.hidden = !open;
    document.body.classList.toggle('catalog-lock', open);
  }

  // ============ EVENTS ============
  function toggleIn(arr, value) {
    var i = arr.indexOf(value);
    if (i === -1) arr.push(value); else arr.splice(i, 1);
  }

  var actions = {
    'clear-search': function () { state.q = ''; el.search.value = ''; el.search.focus(); update(); },
    pill: function (btn) {
      var v = btn.dataset.value;
      if (!v) state.cats = []; else toggleIn(state.cats, v);
      update();
    },
    'price-preset': function (btn) {
      var pr = PRICE_PRESETS[Number(btn.dataset.index)];
      var on = state.min === pr.min && state.max === pr.max;
      state.min = on ? null : pr.min;
      state.max = on ? null : pr.max;
      update();
    },
    'remove-chip': function (btn) {
      var t = btn.dataset.type, v = btn.dataset.value;
      if (t === 'q') state.q = '';
      if (t === 'cat') toggleIn(state.cats, v);
      if (t === 'trait') toggleIn(state.traits, v);
      if (t === 'price') { state.min = null; state.max = null; }
      if (t === 'fav') state.fav = false;
      update();
    },
    'clear-all': function () {
      state.q = ''; state.cats = []; state.traits = []; state.min = null; state.max = null; state.fav = false;
      update();
    },
    'open-filters': function () { setFiltersOpen(true); },
    'close-filters': function () { setFiltersOpen(false); },
  };

  root.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cat-action]');
    if (btn && actions[btn.dataset.catAction]) actions[btn.dataset.catAction](btn);
  });

  root.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.filter === 'cat') { toggleIn(state.cats, t.value); update(); }
    else if (t.dataset.filter === 'trait') { toggleIn(state.traits, t.value); update(); }
    else if (t === el.fav) { state.fav = t.checked; update(); }
    else if (t === el.sort) { state.sort = t.value; update(); }
  });

  var searchTimer = null;
  el.search.addEventListener('input', function () {
    state.q = el.search.value;
    el.clearSearch.hidden = !state.q;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(update, 120);
  });
  el.search.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.q) { e.stopPropagation(); actions['clear-search'](); }
    if (e.key === 'Enter') el.search.blur();
  });

  var priceTimer = null;
  function onPriceInput() {
    clearTimeout(priceTimer);
    priceTimer = setTimeout(function () {
      var mn = parseFloat(el.min.value), mx = parseFloat(el.max.value);
      state.min = isFinite(mn) && mn >= 0 ? mn : null;
      state.max = isFinite(mx) && mx >= 0 ? mx : null;
      update();
    }, 350);
  }
  el.min.addEventListener('input', onPriceInput);
  el.max.addEventListener('input', onPriceInput);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && el.panel.classList.contains('is-open')) { setFiltersOpen(false); return; }
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); el.search.focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && el.panel.classList.contains('is-open')) setFiltersOpen(false);
  });

  // Re-render on app state changes too (favorites toggled, login sync…);
  // setGridHtml skips the DOM work when nothing visible changed.
  H.onRender(renderCatalog);
  renderCatalog();
})();
