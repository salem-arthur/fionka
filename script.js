// ========== FIONKA SCRIPT v3 - 2026 ==========
'use strict';

// ============================================================
// CONFIG
// ============================================================
const CFG = {
    WA:          '201229507232',
    PLACEHOLDER: 'https://placehold.co/600x600/ff99cc/ffffff?text=Fionka',
    MAX_COMPARE: 3,
    PAGE_SIZE:   12,
    COUPONS: { 'FIONKA10': 0.10, 'FIONKA15': 0.15, 'WELCOME20': 0.20, 'VIP30': 0.30 },
    FREE_SHIP:   500,
};

const CAT_LABELS = { rings:'خواتم', earrings:'انسيالات', necklaces:'سلاسل', watches:'ساعات', couples:'كابلز' };

// ============================================================
// DEFAULT PRODUCTS
// ============================================================
const DEFAULT_PRODUCTS = [
    { id:1,  name:'خاتم روز جولد',      category:'rings',    price:1250, rating:4.8, image:'https://placehold.co/600x600/ffccdd/ffffff?text=Rose+Ring',       isNew:true,  isBestseller:true,  description:'خاتم مرصع بأحجار روز كوارتز الطبيعية',    views:0, sales:0, createdAt:'2026-01-01T00:00:00.000Z' },
    { id:2,  name:'انسيال ألماس ناعم',  category:'earrings', price:1890, rating:4.9, image:'https://placehold.co/600x600/f9ced2/ffffff?text=Diamond+Earrings', isNew:false, isBestseller:false, description:'انسيال من الألماس الأبيض عيار 18',          views:0, sales:0, createdAt:'2026-01-02T00:00:00.000Z' },
    { id:3,  name:'سلسلة فيونكة',       category:'necklaces',price:990,  rating:4.7, image:'https://placehold.co/600x600/e6ccff/ffffff?text=Fionka+Necklace',  isNew:true,  isBestseller:false, description:'سلسلة فضة عيار 925 مع قلادة فيونكة',      views:0, sales:0, createdAt:'2026-01-03T00:00:00.000Z' },
    { id:4,  name:'ساعة فاخرة ذهبية',  category:'watches',  price:3450, rating:5.0, image:'https://placehold.co/600x600/f5e0d0/ffffff?text=Luxury+Watch',      isNew:false, isBestseller:true,  description:'ساعة سويسرية بتصميم عصري أنيق',           views:0, sales:0, createdAt:'2026-01-04T00:00:00.000Z' },
    { id:5,  name:'كابلز حب أبدي',      category:'couples',  price:2250, rating:4.9, image:'https://placehold.co/600x600/ffb3ba/ffffff?text=Couple+Set',        isNew:false, isBestseller:false, description:'طقم كابلز مطلي بالذهب الوردي',            views:0, sales:0, createdAt:'2026-01-05T00:00:00.000Z' },
    { id:6,  name:'خاتم سوليتير',       category:'rings',    price:4990, rating:5.0, image:'https://placehold.co/600x600/d9d2b0/ffffff?text=Solitaire+Ring',    isNew:false, isBestseller:false, description:'خاتم ماسي سوليتير فاخر',                  views:0, sales:0, createdAt:'2026-01-06T00:00:00.000Z' },
    { id:7,  name:'انسيال لؤلؤ',        category:'earrings', price:750,  rating:4.6, image:'https://placehold.co/600x600/ffe0f0/ffffff?text=Pearl+Earrings',    isNew:true,  isBestseller:false, description:'لؤلؤ طبيعي مع إطار فضي ناعم',             views:0, sales:0, createdAt:'2026-01-07T00:00:00.000Z' },
    { id:8,  name:'ساعة كاجوال روز',    category:'watches',  price:1890, rating:4.7, image:'https://placehold.co/600x600/fadadd/ffffff?text=Rose+Watch',         isNew:false, isBestseller:false, description:'ساعة أنيقة بسوار من الجلد الطبيعي',       views:0, sales:0, createdAt:'2026-01-08T00:00:00.000Z' },
    { id:9,  name:'سلسلة قلادة قلب',   category:'necklaces',price:590,  rating:4.5, image:'https://placehold.co/600x600/fce4ec/ffffff?text=Heart+Pendant',      isNew:true,  isBestseller:false, description:'قلادة بشكل قلب من الفضة عيار 925',        views:0, sales:0, createdAt:'2026-01-09T00:00:00.000Z' },
    { id:10, name:'كابلز ملكي',         category:'couples',  price:3200, rating:4.9, image:'https://placehold.co/600x600/e6c8d0/ffffff?text=Royal+Couple',       isNew:false, isBestseller:true,  description:'كابلز مطلي بالذهب عيار 24',               views:0, sales:0, createdAt:'2026-01-10T00:00:00.000Z' },
    { id:11, name:'طقم انسيال وخاتم',  category:'rings',    price:2100, rating:4.8, image:'https://placehold.co/600x600/f0d0ff/ffffff?text=Ring+Set',            isNew:true,  isBestseller:false, description:'طقم متناسق من انسيال وخاتم روز',          views:0, sales:0, createdAt:'2026-01-11T00:00:00.000Z' },
    { id:12, name:'سلسلة ذهب عيار 18', category:'necklaces',price:4200, rating:5.0, image:'https://placehold.co/600x600/f5e6a0/ffffff?text=Gold+Chain',          isNew:false, isBestseller:true,  description:'سلسلة ذهب أصفر عيار 18 قيراط',           views:0, sales:0, createdAt:'2026-01-12T00:00:00.000Z' },
];

// ============================================================
// APP STATE
// ============================================================
const App = {
    products:        [],
    cart:            [],
    wishlist:        [],
    compare:         [],
    recentlyViewed:  [],
    reviews:         [],
    couponApplied:   false,
    discountRate:    0,
    couponCode:      '',
    countdownTarget: null,
    countdownTimer:  null,
    currentPage:     1,
    filteredList:    [],
    gridView:        true,
    selectedStars:   0,
};

// ============================================================
// localStorage HELPERS
// ============================================================
function lsGet(key, fb = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; }
}
function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { console.warn('lsSet error', e); }
}

// ============================================================
// LOAD DATA
// ============================================================
async function loadData() {
    try {
        App.products = await API.loadProducts();
    } catch {
        // fallback to localStorage if server offline
        const saved = lsGet('fionka_products_v3');
        App.products = (saved && saved.length) ? saved : JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    }

    App.cart      = lsGet('fionka_cart_v3', []);
    App.wishlist  = lsGet('fionka_wishlist_v3', []);
    App.recentlyViewed = lsGet('fionka_recently_viewed', []);

    // trying reviews from API
    try { App.reviews = await API.loadReviews(); } catch { App.reviews = lsGet('fionka_reviews', []); }

    // مزامنة السلة مع أسعار المنتجات الحالية
    App.cart = App.cart.map(ci => {
        const fresh = App.products.find(p => p.id === ci.id);
        return fresh ? { ...fresh, quantity: ci.quantity } : null;
    }).filter(Boolean);

    App.wishlist = App.wishlist.map(wi => {
        return App.products.find(p => p.id === wi.id) || null;
    }).filter(Boolean);

    // countdown
    const savedTarget = lsGet('fionka_countdown');
    if (savedTarget && new Date(savedTarget) > new Date()) {
        App.countdownTarget = new Date(savedTarget);
    } else {
        try { const c = await API.loadCountdown(); if (c.target) App.countdownTarget = new Date(c.target); } catch {}
        if (!App.countdownTarget || App.countdownTarget <= new Date()) {
            App.countdownTarget = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
            lsSet('fionka_countdown', App.countdownTarget.toISOString());
        }
    }

    syncWindow();
}

function saveCart()     { lsSet('fionka_cart_v3', App.cart); }
function saveWishlist() { lsSet('fionka_wishlist_v3', App.wishlist); }
function saveProducts() {
    lsSet('fionka_products_v3', App.products);
    syncWindow();
    // sync to API (fire-and-forget)
    App.products.forEach(p => API.saveProduct(p).catch(() => {}));
}

function syncWindow() {
    window.App = App;
    window.masterProducts = App.products;
    window.products = App.products;
    window.saveProducts = saveProducts;
    window.refreshProducts = fullRefresh;
    window.lsGet = lsGet;
    window.lsSet = lsSet;
    window.showToast = showToast;
    window.applySavedTexts = applySavedTexts;
    window.applySavedFaq = applySavedFaq;
    window.API = API;
}

// ============================================================
// HTML ESCAPE
// ============================================================
function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

// ============================================================
// BUILD PRODUCT CARD
// ============================================================
function buildCard(p, size = 'normal') {
    const wished  = App.wishlist.some(w => w.id === p.id);
    const inCart  = App.cart.some(c => c.id === p.id);
    const compared = App.compare.some(c => c.id === p.id);
    const h = size === 'small' ? 'style="height:160px"' : '';

    const badges = [
        p.isNew        ? '<span class="badge-new">جديد</span>' : '',
        p.isBestseller ? '<span class="badge-best">🔥 مميز</span>' : '',
        p.salePercent  ? `<span class="badge-sale">-${esc(p.salePercent)}%</span>` : '',
    ].filter(Boolean).join('');

    const oldPrice = p.salePercent
        ? `<span class="old-price">${Math.round(p.price / (1 - p.salePercent / 100)).toLocaleString('ar-EG')}</span>`
        : '';

    return `
    <div class="product-card" data-id="${p.id}" role="listitem" tabindex="0">
        <div class="product-img-wrapper" ${h}>
            <img class="product-img" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"
                 onerror="this.src='${CFG.PLACEHOLDER}'">
            ${badges ? `<div class="product-badges">${badges}</div>` : ''}
            <div class="product-compare-check">
                <input type="checkbox" class="compare-checkbox" data-id="${p.id}"
                       ${compared ? 'checked' : ''} title="إضافة للمقارنة">
            </div>
            <div class="product-quick-actions">
                <button class="quick-action-btn btn-quick-view" data-id="${p.id}" title="معاينة سريعة">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="quick-action-btn btn-quick-wish ${wished ? 'wishlisted' : ''}" data-id="${p.id}" title="${wished ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">
                    <i class="${wished ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <button class="quick-action-btn btn-quick-share" data-id="${p.id}" title="مشاركة">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <h4 title="${esc(p.name)}">${esc(p.name)}</h4>
            <div class="product-price-row">
                <span class="product-price">${oldPrice}${p.price.toLocaleString('ar-EG')} ج.م</span>
                <span class="product-rating"><i class="fas fa-star"></i> ${p.rating} (${p.sales || 0})</span>
            </div>
            <div class="product-card-actions">
                <button class="btn-add-cart ${inCart ? 'in-cart' : ''}" data-id="${p.id}">
                    ${inCart ? '<i class="fas fa-check"></i> في السلة' : '<i class="fas fa-shopping-bag"></i> أضف للسلة'}
                </button>
                <button class="btn-wish-card ${wished ? 'active' : ''}" data-id="${p.id}">
                    <i class="${wished ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        </div>
    </div>`;
}

// ============================================================
// RENDER PRODUCTS
// ============================================================
function renderProducts(list) {
    const grid    = document.getElementById('productsGrid');
    const emptyEl = document.getElementById('noProducts');
    const lmWrap  = document.getElementById('loadMoreWrap');
    const subtitle = document.getElementById('productsSubtitle');
    if (!grid) return;

    const src = list !== undefined ? list : App.products;
    App.filteredList = src;

    // pagination
    const paged = src.slice(0, App.currentPage * CFG.PAGE_SIZE);
    const hasMore = src.length > paged.length;

    if (!src.length) {
        grid.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        if (lmWrap)  lmWrap.style.display  = 'none';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (subtitle) subtitle.textContent = `عرض ${paged.length} من ${src.length} منتج`;

    grid.innerHTML = paged.map(p => buildCard(p, 'normal')).join('');
    if (lmWrap) lmWrap.style.display = hasMore ? 'block' : 'none';

    attachCardEvents(grid);
    observeCards(grid);
    updateCatCounts();
}

function renderCategorySections() {
    ['rings','earrings','necklaces','watches','couples'].forEach(cat => {
        const grid = document.getElementById(`${cat}Grid`);
        if (!grid) return;
        const items = App.products.filter(p => p.category === cat).slice(0, 6);
        if (!items.length) {
            grid.innerHTML = '<div class="empty-sidebar" style="padding:2rem;"><i class="fas fa-gem"></i><p>لا توجد منتجات</p></div>';
            return;
        }
        grid.innerHTML = items.map(p => buildCard(p, 'small')).join('');
        attachCardEvents(grid);
        observeCards(grid);
    });
}

function renderRecentlyViewed() {
    const sec  = document.getElementById('recentlyViewedSection');
    const grid = document.getElementById('recentlyViewedGrid');
    if (!sec || !grid) return;
    const items = App.recentlyViewed
        .map(id => App.products.find(p => p.id === id))
        .filter(Boolean)
        .slice(0, 6);
    if (!items.length) { sec.style.display = 'none'; return; }
    sec.style.display = 'block';
    grid.innerHTML = items.map(p => buildCard(p, 'small')).join('');
    attachCardEvents(grid);
    observeCards(grid);
}

function updateCatCounts() {
    document.querySelectorAll('[data-cat-count]').forEach(el => {
        const cat = el.dataset.catCount;
        const count = App.products.filter(p => p.category === cat).length;
        el.textContent = `${count} منتج`;
    });
}

function fullRefresh() {
    renderProducts();
    renderCategorySections();
    renderRecentlyViewed();
    renderCartSidebar();
    renderWishlistSidebar();
    updateBadges();
    refreshCardButtons();
    renderCompareBar();
}

// ============================================================
// CARD EVENTS (Event Delegation)
// ============================================================
function attachCardEvents(container) {
    container.removeEventListener('click',   _handleCardClick);
    container.removeEventListener('change',  _handleCardChange);
    container.addEventListener('click',   _handleCardClick);
    container.addEventListener('change',  _handleCardChange);
}

function _handleCardClick(e) {
    const btn  = e.target.closest('button');
    const card = e.target.closest('.product-card');
    if (!card) return;
    const id = parseInt(card.dataset.id);
    if (btn) {
        e.stopPropagation();
        if (btn.classList.contains('btn-add-cart'))    addToCart(id);
        else if (btn.classList.contains('btn-wish-card') || btn.classList.contains('btn-quick-wish')) toggleWishlist(id);
        else if (btn.classList.contains('btn-quick-view')) openQuickView(id);
        else if (btn.classList.contains('btn-quick-share')) shareProduct(id);
    } else if (!e.target.closest('.compare-checkbox')) {
        openQuickView(id);
    }
}

function _handleCardChange(e) {
    const cb = e.target.closest('.compare-checkbox');
    if (!cb) return;
    const id = parseInt(cb.dataset.id);
    if (cb.checked) addToCompare(id);
    else removeFromCompare(id);
}

function refreshCardButtons() {
    document.querySelectorAll('.btn-add-cart[data-id]').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        const inCart = App.cart.some(c => c.id === id);
        btn.classList.toggle('in-cart', inCart);
        btn.innerHTML = inCart
            ? '<i class="fas fa-check"></i> في السلة'
            : '<i class="fas fa-shopping-bag"></i> أضف للسلة';
    });
    document.querySelectorAll('.btn-wish-card[data-id], .btn-quick-wish[data-id]').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        const w = App.wishlist.some(w => w.id === id);
        btn.classList.toggle('active',    w);
        btn.classList.toggle('wishlisted', w);
        btn.querySelector('i').className = w ? 'fas fa-heart' : 'far fa-heart';
    });
    document.querySelectorAll('.compare-checkbox[data-id]').forEach(cb => {
        const id = parseInt(cb.dataset.id);
        cb.checked = App.compare.some(c => c.id === id);
    });
}

// ============================================================
// CART
// ============================================================
function addToCart(id) {
    const p = App.products.find(x => x.id === id);
    if (!p) return;
    const ex = App.cart.find(x => x.id === id);
    if (ex) ex.quantity++;
    else App.cart.push({ ...p, quantity: 1 });
    saveCart();
    updateBadges();
    renderCartSidebar();
    refreshCardButtons();
    showToast(`🛍 "${p.name}" أُضيف للسلة`);
}

function removeFromCart(id) {
    App.cart = App.cart.filter(x => x.id !== id);
    saveCart();
    updateBadges();
    renderCartSidebar();
    refreshCardButtons();
    showToast('🗑 تم إزالة المنتج');
}

function changeQty(id, delta) {
    const item = App.cart.find(x => x.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) { removeFromCart(id); return; }
    saveCart();
    renderCartSidebar();
    updateBadges();
}

function getCartTotals() {
    const subtotal = App.cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = App.couponApplied ? Math.round(subtotal * App.discountRate) : 0;
    const total    = subtotal - discount;
    return { subtotal, discount, total };
}

// ============================================================
// WISHLIST
// ============================================================
function toggleWishlist(id) {
    const exists = App.wishlist.some(w => w.id === id);
    if (exists) {
        App.wishlist = App.wishlist.filter(w => w.id !== id);
        showToast('💔 تمت الإزالة من المفضلة');
    } else {
        const p = App.products.find(x => x.id === id);
        if (p) { App.wishlist.push({ ...p }); showToast('❤️ تمت الإضافة للمفضلة'); }
    }
    saveWishlist();
    updateBadges();
    renderWishlistSidebar();
    refreshCardButtons();
}

function removeFromWishlist(id) {
    App.wishlist = App.wishlist.filter(w => w.id !== id);
    saveWishlist();
    updateBadges();
    renderWishlistSidebar();
    refreshCardButtons();
}

function moveWishToCart(id) { addToCart(id); removeFromWishlist(id); }

// ============================================================
// COMPARE
// ============================================================
function addToCompare(id) {
    if (App.compare.length >= CFG.MAX_COMPARE) {
        showToast(`⚠️ الحد الأقصى ${CFG.MAX_COMPARE} منتجات للمقارنة`);
        document.querySelectorAll(`.compare-checkbox[data-id="${id}"]`).forEach(cb => cb.checked = false);
        return;
    }
    const p = App.products.find(x => x.id === id);
    if (p && !App.compare.some(c => c.id === id)) App.compare.push(p);
    renderCompareBar();
    refreshCardButtons();
}

function removeFromCompare(id) {
    App.compare = App.compare.filter(c => c.id !== id);
    renderCompareBar();
    refreshCardButtons();
}

function clearCompare() {
    App.compare = [];
    renderCompareBar();
    refreshCardButtons();
}

function renderCompareBar() {
    const bar = document.getElementById('compareBar');
    const itemsEl = document.getElementById('compareItems');
    const countEl = document.getElementById('compareCount');
    if (!bar) return;

    if (countEl) countEl.textContent = App.compare.length;

    if (!App.compare.length) { bar.style.display = 'none'; return; }
    bar.style.display = 'block';

    if (itemsEl) {
        itemsEl.innerHTML = App.compare.map(p => `
            <div class="compare-item-chip">
                <img src="${esc(p.image)}" onerror="this.src='${CFG.PLACEHOLDER}'" alt="${esc(p.name)}">
                <span>${esc(p.name)}</span>
                <button class="compare-remove-chip" data-id="${p.id}"><i class="fas fa-times"></i></button>
            </div>`).join('');
        itemsEl.querySelectorAll('.compare-remove-chip').forEach(btn => {
            btn.onclick = () => removeFromCompare(parseInt(btn.dataset.id));
        });
    }
}

function openCompareModal() {
    if (App.compare.length < 2) { showToast('⚠️ اختاري منتجين على الأقل للمقارنة'); return; }
    const wrap = document.getElementById('compareTableWrap');
    if (!wrap) return;

    const rows = [
        ['الصورة',       p => `<img src="${esc(p.image)}" onerror="this.src='${CFG.PLACEHOLDER}'" alt="${esc(p.name)}">`],
        ['الاسم',        p => esc(p.name)],
        ['القسم',        p => CAT_LABELS[p.category] || esc(p.category)],
        ['السعر',        p => `<strong>${p.price.toLocaleString('ar-EG')} ج.م</strong>`],
        ['التقييم',      p => `${'⭐'.repeat(Math.round(p.rating))} ${p.rating}`],
        ['المبيعات',     p => `${p.sales || 0} مبيعة`],
        ['المشاهدات',    p => `${p.views || 0} مشاهدة`],
        ['جديد؟',        p => p.isNew ? '<span style="color:#22aa55">✓ نعم</span>' : '—'],
        ['مميز؟',        p => p.isBestseller ? '<span style="color:#d4af7a">✓ نعم</span>' : '—'],
        ['الوصف',        p => `<small>${esc(p.description || '')}</small>`],
        ['إضافة للسلة',  p => `<button onclick="addToCart(${p.id});closeModal('compareModal')" style="background:linear-gradient(135deg,#ff99cc,#ff66b2);border:none;padding:6px 14px;border-radius:20px;color:#fff;font-weight:700;cursor:pointer;font-family:Cairo,sans-serif;">أضف للسلة</button>`],
    ];

    // إيجاد أفضل سعر وأعلى تقييم
    const minPrice  = Math.min(...App.compare.map(p => p.price));
    const maxRating = Math.max(...App.compare.map(p => p.rating));

    wrap.innerHTML = `
    <table class="compare-table">
        <thead>
            <tr>
                <th>المقارنة</th>
                ${App.compare.map(p => `<th>${esc(p.name)}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${rows.map(([label, fn]) => `
                <tr>
                    <td>${label}</td>
                    ${App.compare.map(p => {
                        let cls = '';
                        if (label === 'السعر' && p.price === minPrice) cls = 'compare-best';
                        if (label === 'التقييم' && p.rating === maxRating) cls = 'compare-best';
                        return `<td class="${cls}">${fn(p)}</td>`;
                    }).join('')}
                </tr>`).join('')}
        </tbody>
    </table>`;

    openModal('compareModal');
}

// ============================================================
// BADGES
// ============================================================
function updateBadges() {
    const cartN = App.cart.reduce((s, i) => s + i.quantity, 0);
    const wishN = App.wishlist.length;
    const cmpN  = App.compare.length;

    const cartEl = document.getElementById('cartCount');
    const wishEl = document.getElementById('wishCount');
    const cmpEl  = document.getElementById('compareCount');

    if (cartEl) {
        const old = cartEl.textContent;
        cartEl.textContent = cartN;
        if (old !== String(cartN)) { cartEl.classList.remove('bump'); void cartEl.offsetWidth; cartEl.classList.add('bump'); }
    }
    if (wishEl) wishEl.textContent = wishN;
    if (cmpEl)  cmpEl.textContent  = cmpN;
}

// ============================================================
// RENDER CART SIDEBAR
// ============================================================
function renderCartSidebar() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    if (!App.cart.length) {
        container.innerHTML = '<div class="empty-sidebar"><i class="fas fa-shopping-bag"></i><p>السلة فارغة</p></div>';
        _updateCartTotalsUI();
        return;
    }

    container.innerHTML = App.cart.map(item => `
        <div class="cart-item-card">
            <img class="cart-item-img" src="${esc(item.image)}" alt="${esc(item.name)}"
                 onerror="this.src='${CFG.PLACEHOLDER}'" loading="lazy">
            <div class="cart-item-info">
                <div class="cart-item-name">${esc(item.name)}</div>
                <div class="cart-item-price">${(item.price * item.quantity).toLocaleString('ar-EG')} ج.م</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
                    <span class="qty-num">${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
                </div>
            </div>
            <button class="btn-remove-cart" data-id="${item.id}"><i class="fas fa-times"></i></button>
        </div>`).join('');

    container.removeEventListener('click', _handleCartClick);
    container.addEventListener('click', _handleCartClick);
    _updateCartTotalsUI();
}

function _handleCartClick(e) {
    const rm  = e.target.closest('.btn-remove-cart');
    const qty = e.target.closest('.qty-btn');
    if (rm)  removeFromCart(parseInt(rm.dataset.id));
    if (qty) changeQty(parseInt(qty.dataset.id), parseInt(qty.dataset.delta));
}

function _updateCartTotalsUI() {
    const { subtotal, discount, total } = getCartTotals();
    const subEl  = document.getElementById('cartSubtotal');
    const totEl  = document.getElementById('cartTotal');
    const discEl = document.getElementById('discountAmount');
    const discRow = document.getElementById('discountRow');
    const shipEl = document.getElementById('shippingCost');

    if (subEl)  subEl.textContent  = subtotal.toLocaleString('ar-EG') + ' ج.م';
    if (totEl)  totEl.textContent  = total.toLocaleString('ar-EG') + ' ج.م';
    if (discEl) discEl.textContent = '- ' + discount.toLocaleString('ar-EG') + ' ج.م';
    if (discRow) discRow.style.display = App.couponApplied ? 'flex' : 'none';
    if (shipEl) shipEl.textContent = subtotal >= CFG.FREE_SHIP ? '🎉 مجاني' : 'يحدد عند الطلب';
}

// ============================================================
// RENDER WISHLIST SIDEBAR
// ============================================================
function renderWishlistSidebar() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;

    if (!App.wishlist.length) {
        container.innerHTML = '<div class="empty-sidebar"><i class="far fa-heart"></i><p>قائمة المفضلة فارغة</p></div>';
        return;
    }

    container.innerHTML = App.wishlist.map(item => `
        <div class="wish-item-card">
            <img class="wish-item-img" src="${esc(item.image)}" alt="${esc(item.name)}"
                 onerror="this.src='${CFG.PLACEHOLDER}'" loading="lazy">
            <div class="wish-item-info">
                <div class="wish-item-name">${esc(item.name)}</div>
                <div class="wish-item-price">${item.price.toLocaleString('ar-EG')} ج.م</div>
            </div>
            <div class="wish-item-actions">
                <button class="btn-wish-to-cart" data-id="${item.id}"><i class="fas fa-shopping-bag"></i> سلة</button>
                <button class="btn-remove-wish"  data-id="${item.id}"><i class="fas fa-times"></i></button>
            </div>
        </div>`).join('');

    container.removeEventListener('click', _handleWishClick);
    container.addEventListener('click', _handleWishClick);
}

function _handleWishClick(e) {
    const toCart = e.target.closest('.btn-wish-to-cart');
    const rm     = e.target.closest('.btn-remove-wish');
    if (toCart) moveWishToCart(parseInt(toCart.dataset.id));
    if (rm)     removeFromWishlist(parseInt(rm.dataset.id));
}

// ============================================================
// FILTER & SORT
// ============================================================
function getFilteredProducts() {
    const cat    = document.getElementById('categoryFilter')?.value || 'all';
    const maxP   = parseInt(document.getElementById('priceRange')?.value) || 5000;
    const search = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    const sort   = document.getElementById('sortSelect')?.value || 'default';

    let list = [...App.products];

    if (cat !== 'all') list = list.filter(p => p.category === cat);
    list = list.filter(p => p.price <= maxP);
    if (search) list = list.filter(p =>
        p.name.toLowerCase().includes(search) ||
        (p.description || '').toLowerCase().includes(search) ||
        (CAT_LABELS[p.category] || '').includes(search)
    );

    switch (sort) {
        case 'priceAsc':    list.sort((a,b) => a.price - b.price); break;
        case 'priceDesc':   list.sort((a,b) => b.price - a.price); break;
        case 'rating':      list.sort((a,b) => b.rating - a.rating); break;
        case 'bestseller':  list = list.filter(p => p.isBestseller); break;
        case 'newest':      list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
        case 'mostViewed':  list.sort((a,b) => (b.views||0) - (a.views||0)); break;
    }

    return list;
}

function applyFilter() {
    App.currentPage = 1;
    const filtered = getFilteredProducts();
    renderProducts(filtered);
    updateFilterChips();
}

function resetFilters() {
    ['categoryFilter','sortSelect'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = id === 'categoryFilter' ? 'all' : 'default';
    });
    const pr = document.getElementById('priceRange');
    const si = document.getElementById('searchInput');
    const pv = document.getElementById('priceVal');
    if (pr) pr.value = '5000';
    if (si) si.value = '';
    if (pv) pv.textContent = '5000 ج.م';
    App.currentPage = 1;
    renderProducts();
    updateFilterChips();
}

function filterByCategory(cat) {
    const el = document.getElementById('categoryFilter');
    if (el) el.value = cat;
    App.currentPage = 1;
    applyFilter();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
}

function filterOffers() {
    App.currentPage = 1;
    renderProducts(App.products.filter(p => p.isBestseller || p.price < 1000));
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
}

function updateFilterChips() {
    const chipsEl = document.getElementById('filterChips');
    if (!chipsEl) return;

    const chips = [];
    const cat = document.getElementById('categoryFilter')?.value;
    const sort = document.getElementById('sortSelect')?.value;
    const price = parseInt(document.getElementById('priceRange')?.value) || 5000;
    const search = document.getElementById('searchInput')?.value?.trim();

    if (cat && cat !== 'all')       chips.push({ label: CAT_LABELS[cat], key: 'cat' });
    if (sort && sort !== 'default') chips.push({ label: `ترتيب: ${document.getElementById('sortSelect')?.options[document.getElementById('sortSelect')?.selectedIndex]?.text}`, key: 'sort' });
    if (price < 5000)               chips.push({ label: `حتى ${price.toLocaleString('ar-EG')} ج.م`, key: 'price' });
    if (search)                     chips.push({ label: `"${search}"`, key: 'search' });

    chipsEl.innerHTML = chips.map(c => `
        <div class="chip">
            ${esc(c.label)}
            <button class="chip-remove" data-key="${c.key}"><i class="fas fa-times"></i></button>
        </div>`).join('');

    chipsEl.querySelectorAll('.chip-remove').forEach(btn => {
        btn.onclick = () => {
            const key = btn.dataset.key;
            if (key === 'cat')    { document.getElementById('categoryFilter').value = 'all'; }
            if (key === 'sort')   { document.getElementById('sortSelect').value = 'default'; }
            if (key === 'price')  { document.getElementById('priceRange').value = '5000'; document.getElementById('priceVal').textContent = '5000 ج.م'; }
            if (key === 'search') { document.getElementById('searchInput').value = ''; document.getElementById('clearSearch').style.display = 'none'; }
            applyFilter();
        };
    });
}

// ============================================================
// SEARCH SUGGESTIONS
// ============================================================
function showSuggestions(query) {
    const box = document.getElementById('searchSuggestions');
    if (!box) return;
    if (!query || query.length < 2) { box.classList.remove('show'); return; }

    const matches = App.products
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6);

    if (!matches.length) { box.classList.remove('show'); return; }

    box.innerHTML = matches.map(p => `
        <div class="suggestion-item" data-id="${p.id}">
            <i class="fas fa-search"></i>
            <span>${esc(p.name)}</span>
            <span style="color:var(--pink);font-weight:700;margin-right:auto">${p.price.toLocaleString('ar-EG')} ج.م</span>
        </div>`).join('');

    box.classList.add('show');

    box.querySelectorAll('.suggestion-item').forEach(item => {
        item.onclick = () => {
            openQuickView(parseInt(item.dataset.id));
            box.classList.remove('show');
        };
    });
}

// ============================================================
// QUICK VIEW
// ============================================================
function openQuickView(id) {
    const p = App.products.find(x => x.id === id);
    if (!p) return;

    // زيادة المشاهدات
    p.views = (p.views || 0) + 1;
    saveProducts();

    // recently viewed
    App.recentlyViewed = [p.id, ...App.recentlyViewed.filter(x => x !== p.id)].slice(0, 10);
    lsSet('fionka_recently_viewed', App.recentlyViewed);

    const inCart  = App.cart.some(c => c.id === id);
    const wished  = App.wishlist.some(w => w.id === id);
    const content = document.getElementById('quickModalContent');
    if (!content) return;

    content.innerHTML = `
        <button class="modal-close" id="closeQuick">&times;</button>
        <img class="quick-modal-img" src="${esc(p.image)}" alt="${esc(p.name)}"
             onerror="this.src='${CFG.PLACEHOLDER}'">
        <div class="quick-modal-body">
            <h2>${esc(p.name)}</h2>
            <p class="quick-modal-desc">${esc(p.description || '')}</p>
            <div class="quick-modal-meta">
                <span class="quick-modal-price">${p.price.toLocaleString('ar-EG')} ج.م</span>
                <span class="quick-modal-rating">
                    <i class="fas fa-star"></i> ${p.rating} · ${CAT_LABELS[p.category] || esc(p.category)}
                    · 👁 ${p.views} · 🛒 ${p.sales || 0}
                </span>
            </div>
            <div class="quick-modal-actions">
                <button class="btn-primary qv-cart ${inCart ? 'in-cart' : ''}" data-id="${p.id}" style="flex:1">
                    ${inCart ? '<i class="fas fa-check"></i> في السلة' : '<i class="fas fa-shopping-bag"></i> أضف للسلة'}
                </button>
                <button class="btn-wish-card qv-wish ${wished ? 'active' : ''}" data-id="${p.id}">
                    <i class="${wished ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <button class="btn-ghost qv-share" data-id="${p.id}" style="padding:11px 14px">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
            <a href="https://wa.me/${CFG.WA}?text=${encodeURIComponent(`أريد الاستفسار عن: ${p.name} - السعر: ${p.price} ج.م`)}"
               target="_blank" class="btn-ghost full-width" style="margin-top:10px;justify-content:center;display:flex;align-items:center;gap:8px;">
                <i class="fab fa-whatsapp"></i> استفسري عبر واتساب
            </a>
        </div>`;

    openModal('quickModal');

    content.querySelector('#closeQuick').onclick = () => closeModal('quickModal');
    content.querySelector('.qv-cart').onclick = () => {
        addToCart(p.id);
        const btn = content.querySelector('.qv-cart');
        if (btn) { btn.classList.add('in-cart'); btn.innerHTML = '<i class="fas fa-check"></i> في السلة'; }
    };
    content.querySelector('.qv-wish').onclick = () => {
        toggleWishlist(p.id);
        const btn = content.querySelector('.qv-wish');
        if (btn) {
            const w = App.wishlist.some(x => x.id === p.id);
            btn.classList.toggle('active', w);
            btn.querySelector('i').className = w ? 'fas fa-heart' : 'far fa-heart';
        }
    };
    content.querySelector('.qv-share').onclick = () => shareProduct(p.id);
}

// ============================================================
// SHARE PRODUCT
// ============================================================
function shareProduct(id) {
    const p = App.products.find(x => x.id === id);
    if (!p) return;
    const text = `✨ ${p.name}\n💰 السعر: ${p.price.toLocaleString('ar-EG')} ج.م\n🛍 من Fionka Luxury\n\n${window.location.href}`;
    if (navigator.share) {
        navigator.share({ title: p.name, text, url: window.location.href }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => showToast('📋 تم نسخ رابط المنتج'));
    }
}

// ============================================================
// COUPON
// ============================================================
function applyCoupon() {
    if (App.couponApplied) { showToast('ℹ️ كوبون مفعّل بالفعل'); return; }
    const code = (document.getElementById('couponInput')?.value || '').trim().toUpperCase();
    if (!code) { showToast('⚠️ أدخلي كود الخصم أولاً'); return; }
    const disc = CFG.COUPONS[code];
    if (disc) {
        App.couponApplied = true;
        App.discountRate  = disc;
        App.couponCode    = code;
        showToast(`🎉 تم تطبيق خصم ${Math.round(disc * 100)}%!`);
        renderCartSidebar();
    } else {
        showToast('❌ كود الخصم غير صالح');
    }
}

// ============================================================
// CHECKOUT - يحول للواتساب
// ============================================================
function openCheckout() {
    if (!App.cart.length) { showToast('⚠️ السلة فارغة'); return; }

    const { subtotal, discount, total } = getCartTotals();

    let msg = `🛍 *طلب جديد من Fionka*\n`;
    msg += `━━━━━━━━━━━━━━━━\n`;
    App.cart.forEach(item => {
        msg += `• ${item.name} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString('ar-EG')} ج.م\n`;
    });
    msg += `━━━━━━━━━━━━━━━━\n`;
    if (App.couponApplied) {
        msg += `💰 المجموع الفرعي: ${subtotal.toLocaleString('ar-EG')} ج.م\n`;
        msg += `🎁 خصم (${App.couponCode}): -${discount.toLocaleString('ar-EG')} ج.م\n`;
    }
    msg += `✅ *الإجمالي: ${total.toLocaleString('ar-EG')} ج.م*\n`;
    msg += `━━━━━━━━━━━━━━━━\n`;
    msg += `⚡ أرجو تأكيد الطلب وتحديد طريقة الدفع المناسبة:\n`;
    msg += `• فودافون كاش\n• إنستا باي\n• باي بال\n• بطاقة ائتمان\n• تحويل بنكي`;

    // submit order to server
    API.submitOrder({ items: App.cart, subtotal, discount, total, coupon: App.couponCode }).catch(() => {});

    const url = `https://wa.me/${CFG.WA}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    closeSidebar('cartSidebar');
    showToast('📱 جارٍ التحويل لواتساب الدعم...');
}

// ============================================================
// COUNTDOWN
// ============================================================
function startCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const tick = () => {
        const diff = App.countdownTarget - new Date();
        if (diff <= 0) { el.innerHTML = '<div class="countdown-unit"><span class="countdown-num">00</span><span class="countdown-label">انتهى</span></div>'; return; }
        const pad = n => String(n).padStart(2, '0');
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        el.innerHTML = `
            <div class="countdown-unit"><span class="countdown-num">${pad(d)}</span><span class="countdown-label">يوم</span></div>
            <div class="countdown-unit"><span class="countdown-num">${pad(h)}</span><span class="countdown-label">ساعة</span></div>
            <div class="countdown-unit"><span class="countdown-num">${pad(m)}</span><span class="countdown-label">دقيقة</span></div>
            <div class="countdown-unit"><span class="countdown-num">${pad(s)}</span><span class="countdown-label">ثانية</span></div>`;
    };
    tick();
    App.countdownTimer = setInterval(tick, 1000);
}

// ============================================================
// REVIEWS
// ============================================================
function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;

    const defaultReviews = [
        { name:'سارة م.',     rating:5, text:'منتجات خرافية وجودة عالية جداً! وصلني الطلب بسرعة ومغلف بشكل جميل ✨', date:'يناير 2026' },
        { name:'نور أ.',      rating:5, text:'Fionka هي وجهتي الأولى دايماً للإكسسوارات، كل قطعة تحفة فنية 💕',       date:'يناير 2026' },
        { name:'ياسمين ح.',   rating:4, text:'منتجات رائعة وخدمة عملاء ممتازة! التوصيل كان في الموعد',              date:'ديسمبر 2025' },
    ];

    const all = [...defaultReviews, ...App.reviews].slice(0, 9);
    grid.innerHTML = all.map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${esc(r.name)[0]}</div>
                <div>
                    <div class="review-name">${esc(r.name)}</div>
                    <div class="review-date">${esc(r.date || '')}</div>
                </div>
                <div style="margin-right:auto" class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            </div>
            <p class="review-text">${esc(r.text)}</p>
        </div>`).join('');
}

function submitReview() {
    const name = document.getElementById('reviewName')?.value.trim();
    const text = document.getElementById('reviewText')?.value.trim();
    if (!name || !text) { showToast('⚠️ أدخلي اسمك وتقييمك'); return; }
    if (!App.selectedStars) { showToast('⚠️ اختاري عدد النجوم'); return; }

    const review = {
        name, text, rating: App.selectedStars,
        date: new Date().toLocaleDateString('ar-EG', { year:'numeric', month:'long' })
    };
    App.reviews.push(review);
    lsSet('fionka_reviews', App.reviews);
    API.submitReview(review).catch(() => {});

    document.getElementById('reviewName').value = '';
    document.getElementById('reviewText').value = '';
    App.selectedStars = 0;
    document.querySelectorAll('#starRating i').forEach(i => { i.className = 'far fa-star'; });

    renderReviews();
    closeModal('reviewModal');
    showToast('⭐ شكراً على تقييمك!');
}

function initStarRating() {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const val = parseInt(star.dataset.val);
            stars.forEach(s => s.classList.toggle('hover-active', parseInt(s.dataset.val) <= val));
        });
        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hover-active'));
        });
        star.addEventListener('click', () => {
            App.selectedStars = parseInt(star.dataset.val);
            stars.forEach(s => {
                const v = parseInt(s.dataset.val);
                s.className = v <= App.selectedStars ? 'fas fa-star active' : 'far fa-star';
            });
        });
    });
}

// ============================================================
// MODALS
// ============================================================
function openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('open'); m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('open'); m.style.display = 'none'; document.body.style.overflow = ''; }
}

// ============================================================
// SIDEBARS
// ============================================================
function openSidebar(id) {
    document.getElementById(id)?.classList.add('open');
    const ovId = id === 'cartSidebar' ? 'cartOverlay' : 'wishOverlay';
    document.getElementById(ovId)?.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeSidebar(id) {
    document.getElementById(id)?.classList.remove('open');
    const ovId = id === 'cartSidebar' ? 'cartOverlay' : 'wishOverlay';
    document.getElementById(ovId)?.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// SIDE MENU
// ============================================================
function openSideMenu()  { document.getElementById('sideMenu')?.classList.add('open');    document.getElementById('sideOverlay')?.classList.add('active');    document.body.style.overflow = 'hidden'; }
function closeSideMenu() { document.getElementById('sideMenu')?.classList.remove('open'); document.getElementById('sideOverlay')?.classList.remove('active'); document.body.style.overflow = ''; }

// ============================================================
// THEME
// ============================================================
function initTheme() {
    if (localStorage.getItem('fionka_theme') === 'dark') document.body.classList.add('dark');
    updateThemeIcon();
}
function toggleTheme() {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    localStorage.setItem('fionka_theme', dark ? 'dark' : 'light');
    updateThemeIcon();
    showToast(dark ? '🌙 الوضع الليلي' : '☀️ الوضع النهاري');
}
function updateThemeIcon() {
    const i = document.querySelector('#themeBtn i');
    if (i) i.className = document.body.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
}

// ============================================================
// PARTICLES (Canvas)
// ============================================================
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const N = Math.min(35, Math.floor(W / 35));
    const pts = Array.from({ length: N }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.5 + 1,
        vy: -(Math.random() * .35 + .08),
        vx: (Math.random() - .5) * .15,
        a: Math.random() * .45 + .08
    }));
    function draw() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,102,178,${p.a})`; ctx.fill();
            p.y += p.vy; p.x += p.vx;
            if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        });
        requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }, { passive: true });
}

// ============================================================
// SCROLL & REVEAL
// ============================================================
function observeCards(container) {
    if (!container) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
    container.querySelectorAll('.product-card').forEach(c => { c.classList.remove('revealed'); obs.observe(c); });
}

function initScrollReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal-el').forEach(el => obs.observe(el));
}

function initScrollListeners() {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const pb = document.getElementById('progressBar');
            if (pb) pb.style.width = (scrolled * 100) + '%';
            const btn = document.getElementById('backToTop');
            if (btn) btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
            document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 10);

            // sticky filter
            const fb = document.getElementById('filterBar');
            if (fb) {
                const rect = fb.getBoundingClientRect();
                fb.classList.toggle('is-sticky', rect.top <= parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')));
            }

            // nav active link
            const sections = ['home','products','offers','about','contact'];
            sections.forEach(id => {
                const sec = document.getElementById(id);
                const link = document.querySelector(`.nav-link[href="#${id}"]`);
                if (!sec || !link) return;
                const r = sec.getBoundingClientRect();
                link.classList.toggle('active', r.top <= 100 && r.bottom > 100);
            });

            ticking = false;
        });
    }, { passive: true });
}

// ============================================================
// LOADER
// ============================================================
function initLoader() {
    const fill  = document.getElementById('loaderFill');
    const pct   = document.getElementById('loaderPercent');
    let p = 0;
    const iv = setInterval(() => {
        p = Math.min(p + Math.random() * 18, 95);
        if (fill) fill.style.width = p + '%';
        if (pct)  pct.textContent  = Math.round(p) + '%';
    }, 120);
    window.addEventListener('load', () => {
        clearInterval(iv);
        if (fill) fill.style.width = '100%';
        if (pct)  pct.textContent  = '100%';
        setTimeout(() => {
            const loader = document.getElementById('loading');
            if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 900); }
        }, 400);
    });
    // fallback
    setTimeout(() => {
        const loader = document.getElementById('loading');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden'); setTimeout(() => loader.remove(), 900);
        }
    }, 3500);
}

// ============================================================
// COOKIE BANNER
// ============================================================
function initCookieBanner() {
    if (localStorage.getItem('fionka_cookies')) return;
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    setTimeout(() => banner.classList.add('show'), 1500);
    document.getElementById('acceptCookies')?.addEventListener('click', () => {
        localStorage.setItem('fionka_cookies', 'accepted');
        banner.classList.remove('show');
    });
    document.getElementById('rejectCookies')?.addEventListener('click', () => {
        localStorage.setItem('fionka_cookies', 'rejected');
        banner.classList.remove('show');
    });
}

// ============================================================
// CONTACT FORM
// ============================================================
function saveContactMessage(name, email, phone, message) {
    const msgs = lsGet('fionka_contact_messages', []);
    msgs.push({ id: Date.now(), name, email, phone, message, date: new Date().toLocaleString('ar-EG'), read: false });
    lsSet('fionka_contact_messages', msgs);
    API.submitMessage({ name, email, phone, message }).catch(() => {});
}

// ============================================================
// APPLY SAVED TEXTS (from admin)
// ============================================================
async function applySavedTexts() {
    let t;
    try { t = await API.loadTexts(); } catch { t = lsGet('fionka_site_texts'); }
    if (!t) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    const setHref = (id, val) => { const el = document.getElementById(id); if (el && val) el.href = val; };

    set('heroText',  t.hero);
    set('aboutText', t.about);
    set('offerTitle', t.offer);
    set('heroBadgeText', t.heroBadge);
    set('footerTagline', t.footerTagline);

    const socials = ['insta','tiktok','fb'];
    socials.forEach(k => {
        if (t[k]) {
            setHref(k + 'Link', t[k]);
            setHref('footer' + k.charAt(0).toUpperCase() + k.slice(1), t[k]);
            setHref('side'   + k.charAt(0).toUpperCase() + k.slice(1) + 'Link', t[k]);
        }
    });

    if (t.wa) {
        const wa = t.wa.replace(/\D/g, '');
        const waLinks = document.querySelectorAll('[href*="wa.me"]');
        waLinks.forEach(el => {
            const href = el.href || el.getAttribute('href') || '';
            const newHref = href.replace(/wa\.me\/\d+/, `wa.me/${wa}`);
            el.href = newHref;
        });
    }
}

async function applySavedFaq() {
    let faq;
    try { faq = await API.loadFaq(); } catch { faq = lsGet('fionka_faq_items'); }
    if (!faq || !faq.length) return;
    const container = document.getElementById('faqContainer');
    if (!container) return;
    container.innerHTML = faq.map(item => `
        <div class="faq-item">
            <button class="faq-q" aria-expanded="false">${esc(item.q || item.question)} <i class="fas fa-chevron-down"></i></button>
            <div class="faq-a">${esc(item.a || item.answer)}</div>
        </div>`).join('');
    initFaq();
}

// ============================================================
// FAQ ACCORDION
// ============================================================
function initFaq() {
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.onclick = () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            document.querySelectorAll('.faq-q').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.closest('.faq-item')?.querySelector('.faq-a')?.classList.remove('open');
            });
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                btn.closest('.faq-item')?.querySelector('.faq-a')?.classList.add('open');
            }
        };
    });
}

// ============================================================
// TOAST
// ============================================================
let _toastTimer = null;
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    if (_toastTimer) clearTimeout(_toastTimer);
    t.textContent = msg;
    t.classList.add('show');
    _toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ============================================================
// DOM CONTENT LOADED
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    initLoader();
    await loadData();
    initTheme();

    // render everything
    renderProducts();
    renderCategorySections();
    renderRecentlyViewed();
    renderReviews();
    updateBadges();
    renderCartSidebar();
    renderWishlistSidebar();
    renderCompareBar();
    startCountdown();
    initParticles();
    initScrollReveal();
    initScrollListeners();
    initFaq();
    initStarRating();
    initCookieBanner();
    applySavedTexts();
    applySavedFaq();
    updateCatCounts();

    // ===== NAVBAR =====
    document.getElementById('menuBtn')?.addEventListener('click', openSideMenu);
    document.getElementById('closeMenu')?.addEventListener('click', closeSideMenu);
    document.getElementById('sideOverlay')?.addEventListener('click', closeSideMenu);
    document.getElementById('themeBtn')?.addEventListener('click', toggleTheme);

    const searchBtn = document.getElementById('searchBtn');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');

    searchBtn?.addEventListener('click', () => {
        searchBox?.classList.toggle('active');
        if (searchBox?.classList.contains('active')) searchInput?.focus();
    });

    searchInput?.addEventListener('input', () => {
        const q = searchInput.value.trim();
        if (clearSearch) clearSearch.style.display = q ? 'block' : 'none';
        showSuggestions(q);
        applyFilter();
    });

    clearSearch?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        clearSearch.style.display = 'none';
        document.getElementById('searchSuggestions')?.classList.remove('show');
        applyFilter();
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.search-box')) {
            document.getElementById('searchSuggestions')?.classList.remove('show');
        }
    });

    // ===== CART =====
    document.getElementById('cartBtn')?.addEventListener('click', () => { renderCartSidebar(); openSidebar('cartSidebar'); });
    document.getElementById('closeCart')?.addEventListener('click', () => closeSidebar('cartSidebar'));
    document.getElementById('cartOverlay')?.addEventListener('click', () => closeSidebar('cartSidebar'));
    document.getElementById('applyCouponBtn')?.addEventListener('click', applyCoupon);
    document.getElementById('couponInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') applyCoupon(); });
    document.getElementById('checkoutBtn')?.addEventListener('click', openCheckout);

    // ===== WISHLIST =====
    document.getElementById('wishlistBtn')?.addEventListener('click', () => { renderWishlistSidebar(); openSidebar('wishlistSidebar'); });
    document.getElementById('closeWishlist')?.addEventListener('click', () => closeSidebar('wishlistSidebar'));
    document.getElementById('wishOverlay')?.addEventListener('click', () => closeSidebar('wishlistSidebar'));

    // ===== FILTER =====
    document.getElementById('filterBtn')?.addEventListener('click', applyFilter);
    document.getElementById('resetBtn')?.addEventListener('click', resetFilters);
    document.getElementById('emptyReset')?.addEventListener('click', resetFilters);
    document.getElementById('categoryFilter')?.addEventListener('change', applyFilter);
    document.getElementById('sortSelect')?.addEventListener('change', applyFilter);
    document.getElementById('priceRange')?.addEventListener('input', e => {
        const v = parseInt(e.target.value).toLocaleString('ar-EG');
        const pv = document.getElementById('priceVal');
        if (pv) pv.textContent = `${v} ج.م`;
        applyFilter();
    });

    // ===== GRID TOGGLE =====
    document.getElementById('gridToggle')?.addEventListener('click', () => {
        App.gridView = !App.gridView;
        const grid = document.getElementById('productsGrid');
        const icon = document.getElementById('gridToggleIcon');
        if (grid) grid.classList.toggle('list-view', !App.gridView);
        if (icon) icon.className = App.gridView ? 'fas fa-th' : 'fas fa-list';
    });

    // ===== LOAD MORE =====
    document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
        App.currentPage++;
        renderProducts(App.filteredList);
    });

    // ===== HERO =====
    document.getElementById('shopNow')?.addEventListener('click', () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }));
    document.getElementById('viewOffersHero')?.addEventListener('click', () => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' }));
    document.getElementById('heroScroll')?.addEventListener('click', () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }));

    // ===== OFFERS =====
    document.getElementById('shopOffersBtn')?.addEventListener('click', () => { filterOffers(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); });

    // ===== SIDE MENU LINKS =====
    document.querySelectorAll('.side-link[data-cat]').forEach(link => {
        link.addEventListener('click', e => { e.preventDefault(); filterByCategory(link.dataset.cat); closeSideMenu(); });
    });
    document.getElementById('sideBestseller')?.addEventListener('click', e => { e.preventDefault(); renderProducts(App.products.filter(p => p.isBestseller)); closeSideMenu(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); });
    document.getElementById('sideNew')?.addEventListener('click', e => { e.preventDefault(); renderProducts(App.products.filter(p => p.isNew)); closeSideMenu(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); });
    document.getElementById('sideFeatured')?.addEventListener('click', e => { e.preventDefault(); renderProducts(App.products.slice(0, 6)); closeSideMenu(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); });
    document.getElementById('sideOffers')?.addEventListener('click', e => { e.preventDefault(); filterOffers(); closeSideMenu(); });

    // ===== VISUAL CATS =====
    document.querySelectorAll('.vis-cat[data-cat]').forEach(el => {
        el.addEventListener('click', () => filterByCategory(el.dataset.cat));
    });

    // ===== VIEW ALL BUTTONS =====
    document.querySelectorAll('.btn-view-all[data-cat]').forEach(btn => {
        btn.addEventListener('click', () => filterByCategory(btn.dataset.cat));
    });

    // ===== FOOTER CAT LINKS =====
    document.querySelectorAll('[data-cat-footer]').forEach(link => {
        link.addEventListener('click', e => { e.preventDefault(); filterByCategory(link.dataset.catFooter); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); });
    });

    // ===== FILTER TOGGLE =====
    const filterBar = document.getElementById('filterBar');
    const filterToggle = document.getElementById('filterToggle');
    filterToggle?.addEventListener('click', () => {
        filterBar?.classList.toggle('collapsed');
    });
    // Auto-expand filter when user interacts with filter controls
    document.querySelectorAll('#filterBtn, #resetBtn, #categoryFilter, #sortSelect, #priceRange').forEach(el => {
        el?.addEventListener('click', () => filterBar?.classList.remove('collapsed'));
        el?.addEventListener('change', () => filterBar?.classList.remove('collapsed'));
        el?.addEventListener('input', () => filterBar?.classList.remove('collapsed'));
    });

    // ===== COMPARE =====
    document.getElementById('doCompareBtn')?.addEventListener('click', openCompareModal);
    document.getElementById('clearCompareBtn')?.addEventListener('click', clearCompare);
    document.getElementById('closeCompareModal')?.addEventListener('click', () => closeModal('compareModal'));
    document.getElementById('compareModal')?.addEventListener('click', e => { if (e.target === document.getElementById('compareModal')) closeModal('compareModal'); });
    document.getElementById('compareBtn')?.addEventListener('click', openCompareModal);

    // ===== QUICK MODAL =====
    document.getElementById('quickModal')?.addEventListener('click', e => { if (e.target === document.getElementById('quickModal')) closeModal('quickModal'); });

    // ===== REVIEWS =====
    document.getElementById('openReviewBtn')?.addEventListener('click', () => openModal('reviewModal'));
    document.getElementById('closeReviewModal')?.addEventListener('click', () => closeModal('reviewModal'));
    document.getElementById('reviewModal')?.addEventListener('click', e => { if (e.target === document.getElementById('reviewModal')) closeModal('reviewModal'); });
    document.getElementById('submitReviewBtn')?.addEventListener('click', submitReview);

    // ===== PRIVACY =====
    document.getElementById('privacyLink')?.addEventListener('click', e => { e.preventDefault(); openModal('privacyModal'); });
    document.getElementById('privacyFooterLink')?.addEventListener('click', e => { e.preventDefault(); openModal('privacyModal'); });
    document.getElementById('closePrivacyModal')?.addEventListener('click', () => closeModal('privacyModal'));
    document.getElementById('privacyModal')?.addEventListener('click', e => { if (e.target === document.getElementById('privacyModal')) closeModal('privacyModal'); });

    // ===== CONTACT =====
    document.getElementById('sendMessageBtn')?.addEventListener('click', () => {
        const name    = document.getElementById('contactName')?.value.trim();
        const email   = document.getElementById('contactEmail')?.value.trim();
        const phone   = document.getElementById('contactPhone')?.value.trim();
        const message = document.getElementById('contactMessage')?.value.trim();
        if (!name || !message) { showToast('⚠️ أدخلي اسمك ورسالتك'); return; }
        saveContactMessage(name, email, phone, message);
        ['contactName','contactEmail','contactPhone','contactMessage'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        // إرسال عبر واتساب أيضاً
        const waMsg = `📩 *رسالة جديدة من موقع Fionka*\n━━━━━━━━━━━━━━━━\n👤 الاسم: ${name}\n📧 البريد: ${email || 'غير محدد'}\n📱 الهاتف: ${phone || 'غير محدد'}\n💬 الرسالة: ${message}`;
        window.open(`https://wa.me/${CFG.WA}?text=${encodeURIComponent(waMsg)}`, '_blank');
        showToast('📩 تم إرسال رسالتك!');
    });

    // ===== BACK TO TOP =====
    document.getElementById('backToTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ===== ADMIN FOOTER =====
    document.getElementById('adminFooterBtn')?.addEventListener('click', () => {
        if (typeof window.showAdminLogin === 'function') window.showAdminLogin();
    });

    // ===== ESCAPE KEY =====
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeModal('quickModal');
            closeModal('compareModal');
            closeModal('reviewModal');
            closeModal('privacyModal');
            closeSidebar('cartSidebar');
            closeSidebar('wishlistSidebar');
            closeSideMenu();
        }
    });
});

// ============================================================
// WINDOW EXPORTS
// ============================================================
window.App            = App;
window.masterProducts = App.products;
window.products       = App.products;
window.showToast      = showToast;
window.saveProducts   = saveProducts;
window.refreshProducts = fullRefresh;
window.lsGet          = lsGet;
window.lsSet          = lsSet;
window.applySavedTexts = applySavedTexts;
window.applySavedFaq  = applySavedFaq;
window.addToCart      = addToCart;
window.closeModal     = closeModal;