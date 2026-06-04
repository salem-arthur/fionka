// ========== FIONKA ADMIN PANEL v3 - 2026 ==========
'use strict';

(function () {

// ============================================================
// AUTH
// ============================================================
async function _check(u, p) {
    try {
        const r = await API.login(u, p);
        if (r.token) { API.setToken(r.token); return true; }
    } catch {}
    return false;
}

// ============================================================
// STATE
// ============================================================
const A = {
    panel:      null,
    activeTab:  'dashboard',
    tempImg:    null,
    editingId:  null,
};

// ============================================================
// HELPERS
// ============================================================
const esc = s => s == null ? '' : String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const lsGet = (k, fb = null) => (typeof window.lsGet === 'function') ? window.lsGet(k, fb) : (() => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } })();
const lsSet = (k, v) => (typeof window.lsSet === 'function') ? window.lsSet(k, v) : (() => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) { console.warn(e); } })();
const toast = m => (typeof window.showToast === 'function') ? window.showToast(m) : alert(m);
const getProds = () => window.App?.products || window.masterProducts || [];
const setProds = list => {
    if (window.App) window.App.products = list;
    window.masterProducts = list;
    window.products = list;
    if (typeof window.saveProducts === 'function') window.saveProducts();
    if (typeof window.refreshProducts === 'function') window.refreshProducts();
};
const CAT = { rings:'خواتم', earrings:'انسيالات', necklaces:'سلاسل', watches:'ساعات', couples:'كابلز' };

// ============================================================
// STYLES
// ============================================================
const S = {
    input: `width:100%;padding:10px 14px;border-radius:30px;border:1.5px solid rgba(255,102,178,.4);background:#1a1a2e;color:#f0e8f5;outline:none;font-family:Cairo,sans-serif;font-size:.92rem;box-sizing:border-box;`,
    textarea: `width:100%;padding:10px 14px;border-radius:16px;border:1.5px solid rgba(255,102,178,.4);background:#1a1a2e;color:#f0e8f5;outline:none;font-family:Cairo,sans-serif;font-size:.92rem;resize:vertical;box-sizing:border-box;`,
    label: `display:block;margin-bottom:5px;color:#c8b8d5;font-size:.83rem;font-weight:700;`,
    btn: (bg, c='white') => `background:${bg};border:none;padding:9px 20px;border-radius:30px;color:${c};font-weight:700;cursor:pointer;font-family:Cairo,sans-serif;font-size:.85rem;transition:opacity .2s;`,
    card: `background:rgba(255,255,255,.04);border:1px solid rgba(255,102,178,.2);border-radius:20px;padding:1rem;`,
    statCard: (color) => `background:rgba(255,255,255,.04);border:1px solid ${color}33;border-radius:20px;padding:1.2rem;text-align:center;`,
};

// ============================================================
// IMAGE PICKER
// ============================================================
function pickImage(cb) {
    const ov = document.createElement('div');
    ov.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:700000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)`;
    ov.innerHTML = `
        <div style="background:#0d0b18;border:2px solid #ff66b2;border-radius:30px;padding:2rem;width:380px;text-align:center;box-shadow:0 0 50px rgba(255,102,178,.3)">
            <h3 style="color:#ff66b2;margin-bottom:1.5rem;font-family:Cairo,sans-serif">📷 اختر طريقة إضافة الصورة</h3>
            <label style="display:block;background:linear-gradient(135deg,#ff99cc,#ff66b2);border-radius:25px;padding:12px;color:white;font-weight:700;font-size:1rem;cursor:pointer;font-family:Cairo,sans-serif;margin-bottom:12px">
                💾 رفع من الجهاز (حتى 2MB)
                <input type="file" id="_adminImgFile" accept="image/*" style="display:none">
            </label>
            <div style="color:#666;font-size:.82rem;margin:8px 0">— أو أدخل رابط URL —</div>
            <div style="display:flex;gap:8px;margin-top:8px">
                <input type="text" id="_adminImgUrl" placeholder="https://..." style="${S.input}flex:1;">
                <button id="_adminImgUrlOk" style="${S.btn('#d4af7a','#3a2000')}">تأكيد</button>
            </div>
            <button id="_adminImgCancel" style="${S.btn('transparent','#888')}border:1px solid #444;margin-top:12px;width:100%">إلغاء</button>
        </div>`;
    document.body.appendChild(ov);

    document.getElementById('_adminImgFile').addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast('⚠️ الصورة أكبر من 2MB — استخدم رابط URL'); return; }
        if (!file.type.startsWith('image/')) { toast('⚠️ يرجى اختيار ملف صورة فقط (jpg, png, gif, webp)'); return; }
        const reader = new FileReader();
        reader.onload = ev => { ov.remove(); A.tempImg = ev.target.result; cb(ev.target.result); };
        reader.readAsDataURL(file);
    });

    document.getElementById('_adminImgUrlOk').onclick = () => {
        const url = document.getElementById('_adminImgUrl').value.trim();
        if (!url) { toast('⚠️ أدخل رابط الصورة'); return; }
        ov.remove(); A.tempImg = url; cb(url);
    };

    document.getElementById('_adminImgCancel').onclick = () => ov.remove();
    ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
}

// ============================================================
// LOGIN
// ============================================================
function showLogin() {
    document.getElementById('_fionkaLogin')?.remove();
    const m = document.createElement('div');
    m.id = '_fionkaLogin';
    m.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.96);z-index:600000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(15px)`;
    m.innerHTML = `
        <div style="background:#080810;border-radius:40px;padding:2.5rem;width:380px;text-align:center;border:2px solid #ff66b2;box-shadow:0 0 60px rgba(255,102,178,.35)">
            <div style="font-size:3rem;margin-bottom:.5rem">🔐</div>
            <h2 style="color:#ff66b2;font-family:'Playfair Display',serif;font-size:1.5rem;margin-bottom:.3rem">لوحة الإدارة</h2>
            <p style="color:#666;font-size:.78rem;margin-bottom:1.5rem;font-family:Cairo,sans-serif">Fionka Admin Panel — 2026</p>
            <input type="text" id="_lu" placeholder="اسم المستخدم" autocomplete="username"
                   style="${S.input}display:block;margin:6px 0">
            <input type="password" id="_lp" placeholder="كلمة المرور" autocomplete="current-password"
                   style="${S.input}display:block;margin:6px 0">
            <div id="_lerr" style="color:#ff4444;font-size:.82rem;min-height:20px;margin:6px 0;font-family:Cairo,sans-serif"></div>
            <button id="_loginOk" style="${S.btn('linear-gradient(135deg,#ff99cc,#ff66b2)')}width:100%;padding:13px;font-size:1rem;margin-top:8px">دخول</button>
            <button id="_loginCancel" style="${S.btn('transparent','#888')}border:1.5px solid #333;width:100%;padding:11px;margin-top:8px">إلغاء</button>
        </div>`;
    document.body.appendChild(m);

    const lu = document.getElementById('_lu');
    const lp = document.getElementById('_lp');
    const err = document.getElementById('_lerr');
    lu.focus();

    const tryLogin = async () => {
        const ok = await _check(lu.value, lp.value);
        if (ok) {
            m.remove(); openPanel(); toast('🔓 أهلاً بك في لوحة التحكم!');
        } else {
            err.textContent = '❌ بيانات الدخول غير صحيحة';
            lp.value = ''; lp.focus();
            setTimeout(() => err.textContent = '', 3000);
        }
    };

    document.getElementById('_loginOk').onclick = tryLogin;
    document.getElementById('_loginCancel').onclick = () => m.remove();
    [lu, lp].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); }));
}

window.showAdminLogin = showLogin;

// ============================================================
// PANEL
// ============================================================
const TABS = [
    { id:'dashboard',  icon:'📊', label:'الرئيسية'  },
    { id:'products',   icon:'📦', label:'المنتجات'  },
    { id:'addProduct', icon:'➕', label:'إضافة'     },
    { id:'orders',     icon:'🛒', label:'الطلبات'   },
    { id:'messages',   icon:'📩', label:'الرسائل'   },
    { id:'reviews',    icon:'⭐', label:'التقييمات' },
    { id:'texts',      icon:'✏️', label:'النصوص'    },
    { id:'faq',        icon:'❓', label:'FAQ'        },
    { id:'settings',   icon:'⚙️', label:'الإعدادات' },
];

function openPanel() {
    if (A.panel && document.body.contains(A.panel)) {
        A.panel.style.display = 'flex';
        renderTab(A.activeTab);
        return;
    }
    const panel = document.createElement('div');
    panel.id = '_fionkaPanel';
    panel.style.cssText = `position:fixed;inset:0;background:rgba(5,4,15,.98);backdrop-filter:blur(25px);z-index:600001;display:flex;flex-direction:row;font-family:Cairo,sans-serif;color:#f0e8f5;direction:rtl;overflow:hidden`;
    panel.innerHTML = `
        <!-- SIDEBAR -->
        <div style="width:220px;min-width:220px;background:rgba(255,255,255,.03);border-left:1px solid rgba(255,102,178,.2);display:flex;flex-direction:column;overflow-y:auto;flex-shrink:0">
            <div style="padding:1.5rem 1.2rem;border-bottom:1px solid rgba(255,102,178,.15)">
                <div style="font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:900;background:linear-gradient(135deg,#ff99cc,#ff66b2,#d4af7a);-webkit-background-clip:text;background-clip:text;color:transparent">Fionka</div>
                <div style="font-size:.72rem;color:#666;margin-top:2px">Admin Panel 2026</div>
            </div>
            <nav id="_adminNav" style="padding:.6rem .5rem;flex:1">
                ${TABS.map(t => `
                    <button class="_adminTab" data-tab="${t.id}"
                            style="width:100%;background:transparent;border:none;padding:10px 14px;border-radius:25px;color:#8a7898;font-size:.88rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:10px;font-family:Cairo,sans-serif;transition:all .2s;margin:2px 0;text-align:right">
                        <span>${t.icon}</span><span>${t.label}</span>
                    </button>`).join('')}
            </nav>
            <div style="padding:1rem;border-top:1px solid rgba(255,102,178,.1)">
                <button id="_closePanel" style="${S.btn('rgba(255,102,178,.15)','#ff66b2')}width:100%;padding:10px">✖ إغلاق</button>
            </div>
        </div>
        <!-- CONTENT -->
        <div id="_adminContent" style="flex:1;overflow-y:auto;padding:1.5rem 2rem">
        </div>`;

    document.body.appendChild(panel);
    A.panel = panel;

    document.getElementById('_closePanel').onclick = () => { panel.style.display = 'none'; };

    panel.querySelectorAll('._adminTab').forEach(btn => {
        btn.addEventListener('click', () => {
            A.activeTab = btn.dataset.tab;
            panel.querySelectorAll('._adminTab').forEach(b => {
                b.style.background = 'transparent';
                b.style.color = '#8a7898';
            });
            btn.style.background = 'rgba(255,102,178,.15)';
            btn.style.color = '#ff66b2';
            renderTab(btn.dataset.tab);
        });
    });

    // فتح الـ dashboard أول مرة
    const first = panel.querySelector('._adminTab[data-tab="dashboard"]');
    if (first) first.click();

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && A.panel?.style.display !== 'none') A.panel.style.display = 'none';
    });
}

function renderTab(tab) {
    const content = document.getElementById('_adminContent');
    if (!content) return;
    content.innerHTML = '<p style="text-align:center;padding:3rem;color:#666;">⏳ جارٍ التحميل...</p>';
    const map = {
        dashboard:  tabDashboard,
        products:   tabProducts,
        addProduct: tabAddProduct,
        orders:     tabOrders,
        messages:   tabMessages,
        reviews:    tabReviews,
        texts:      tabTexts,
        faq:        tabFaq,
        settings:   tabSettings,
    };
    const fn = map[tab] || (() => { content.innerHTML = '<p>قريباً...</p>'; });
    const result = fn(content);
    if (result && typeof result.then === 'function') result.catch(() => { content.innerHTML = '<p style="text-align:center;padding:3rem;color:#ff4444;">❌ حدث خطأ</p>'; });
}

// ============================================================
// TAB: DASHBOARD
// ============================================================
async function tabDashboard(c) {
    let prods = [], msgs = [], orders = [], reviews = [], stats;
    try {
        stats = await API.loadStats();
        prods = getProds();
        msgs  = await API.loadMessages();
        orders = await API.loadOrders();
        reviews = await API.loadReviews();
    } catch {
        prods = getProds();
        msgs  = lsGet('fionka_contact_messages', []);
        orders = lsGet('fionka_orders', []);
        reviews = lsGet('fionka_reviews', []);
    }
    const totalSales   = stats?.totalSales ?? prods.reduce((s,p) => s + (p.sales||0), 0);
    const totalViews   = stats?.totalViews ?? prods.reduce((s,p) => s + (p.views||0), 0);
    const totalRevenue = stats?.ordersRevenue ?? prods.reduce((s,p) => s + p.price * (p.sales||0), 0);
    const unreadMsgs   = msgs.filter(m => !m.read).length;

    const topSellers = [...prods].sort((a,b) => (b.sales||0)-(a.sales||0)).slice(0,5);
    const topViewed  = [...prods].sort((a,b) => (b.views||0)-(a.views||0)).slice(0,5);

    const catData = stats?.catCounts ? Object.fromEntries(stats.catCounts.map(x => [x.category, x.count])) : {};
    if (!stats?.catCounts) prods.forEach(p => { catData[p.category] = (catData[p.category]||0)+1; });

    c.innerHTML = `
    <h2 style="color:#ff66b2;margin-bottom:1.5rem;font-size:1.4rem">📊 لوحة التحكم</h2>

    <!-- STATS -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem;margin-bottom:2rem">
        ${[
            ['📦','المنتجات',    prods.length,                          '#ff66b2'],
            ['🛒','المبيعات',    totalSales,                            '#22aa55'],
            ['👁','المشاهدات',   totalViews,                            '#8a6aff'],
            ['💰','الإيرادات',   totalRevenue.toLocaleString('ar-EG')+' ج.م', '#d4af7a'],
            ['📩','رسائل جديدة', unreadMsgs,                            '#ff4444'],
            ['📋','الطلبات',     orders.length,                         '#00bbcc'],
            ['⭐','التقييمات',   reviews.length,                        '#f5b942'],
        ].map(([ico,lbl,val,clr]) => `
            <div style="${S.statCard(clr)}">
                <div style="font-size:2rem;margin-bottom:6px">${ico}</div>
                <div style="font-size:1.4rem;font-weight:900;color:${clr}">${val}</div>
                <div style="color:#888;font-size:.78rem;margin-top:3px">${lbl}</div>
            </div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem">
        <!-- TOP SELLERS -->
        <div style="${S.card}">
            <h4 style="color:#d4af7a;margin-bottom:1rem;font-family:Cairo,sans-serif">🔥 الأكثر مبيعاً</h4>
            ${topSellers.map((p,i) => `
                <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06)">
                    <span style="color:#555;font-size:.82rem;width:16px">${i+1}</span>
                    <img src="${esc(p.image)}" style="width:36px;height:36px;border-radius:10px;object-fit:cover" onerror="this.src='https://placehold.co/36x36/ff99cc/fff?text=?'">
                    <div style="flex:1;min-width:0">
                        <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.85rem">${esc(p.name)}</div>
                        <div style="color:#d4af7a;font-size:.75rem">${p.sales||0} مبيعة · ${p.price.toLocaleString('ar-EG')} ج.م</div>
                    </div>
                </div>`).join('')}
        </div>
        <!-- TOP VIEWED -->
        <div style="${S.card}">
            <h4 style="color:#8a6aff;margin-bottom:1rem;font-family:Cairo,sans-serif">👁 الأكثر مشاهدة</h4>
            ${topViewed.map((p,i) => `
                <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06)">
                    <span style="color:#555;font-size:.82rem;width:16px">${i+1}</span>
                    <img src="${esc(p.image)}" style="width:36px;height:36px;border-radius:10px;object-fit:cover" onerror="this.src='https://placehold.co/36x36/ff99cc/fff?text=?'">
                    <div style="flex:1;min-width:0">
                        <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.85rem">${esc(p.name)}</div>
                        <div style="color:#8a6aff;font-size:.75rem">${p.views||0} مشاهدة · ⭐${p.rating}</div>
                    </div>
                </div>`).join('')}
        </div>
    </div>

    <!-- CAT DISTRIBUTION -->
    <div style="${S.card}">
        <h4 style="color:#ff66b2;margin-bottom:1rem;font-family:Cairo,sans-serif">🗂 توزيع المنتجات بالأقسام</h4>
        <div style="display:flex;flex-wrap:wrap;gap:.8rem">
            ${Object.entries(catData).map(([cat,count]) => {
                const pct = Math.round((count/prods.length)*100);
                return `
                <div style="flex:1;min-width:130px;background:rgba(255,255,255,.03);border-radius:12px;padding:10px 14px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:.88rem">
                        <span>${CAT[cat]||esc(cat)}</span>
                        <span style="color:#ff66b2;font-weight:700">${count}</span>
                    </div>
                    <div style="background:rgba(255,255,255,.08);border-radius:10px;height:5px">
                        <div style="width:${pct}%;height:100%;background:linear-gradient(135deg,#ff99cc,#ff66b2);border-radius:10px"></div>
                    </div>
                    <div style="color:#666;font-size:.72rem;margin-top:4px">${pct}%</div>
                </div>`;
            }).join('')}
        </div>
    </div>`;
}

// ============================================================
// TAB: PRODUCTS
// ============================================================
function tabProducts(c) {
    const list = getProds();
    function render(list) {
        const grid = document.getElementById('_prodsGrid');
        if (!grid) return;
        if (!list.length) { grid.innerHTML = '<div style="color:#888;text-align:center;padding:3rem;grid-column:1/-1">لا توجد منتجات</div>'; return; }
        grid.innerHTML = list.map(p => `
            <div style="${S.card}transition:border-color .2s" onmouseover="this.style.borderColor='#ff66b2'" onmouseout="this.style.borderColor='rgba(255,102,178,.2)'">
                <div style="display:flex;gap:12px;margin-bottom:10px">
                    <img src="${esc(p.image)}" style="width:70px;height:70px;border-radius:14px;object-fit:cover;flex-shrink:0" onerror="this.src='https://placehold.co/70x70/ff99cc/fff?text=?'">
                    <div style="flex:1;min-width:0">
                        <div style="font-weight:700;font-size:.93rem;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(p.name)}">${esc(p.name)}</div>
                        <div style="color:#ff66b2;font-weight:800;font-size:1rem">${p.price.toLocaleString('ar-EG')} ج.م</div>
                        <div style="color:#888;font-size:.75rem;margin-top:2px">${CAT[p.category]||esc(p.category)} · ⭐${p.rating}</div>
                        <div style="color:#555;font-size:.72rem;margin-top:2px">👁${p.views||0} · 🛒${p.sales||0}</div>
                    </div>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:5px">
                    <button onclick="_adminEditProd(${p.id})" style="${S.btn('#8a6aff')}padding:5px 12px;font-size:.78rem">✏️ تعديل</button>
                    <button onclick="_adminEditImg(${p.id})" style="${S.btn('#d4af7a','#3a2000')}padding:5px 12px;font-size:.78rem">📷 صورة</button>
                    <button onclick="_adminToggle(${p.id},'isNew')" style="${S.btn(p.isNew?'#22aa55':'#333')}padding:5px 12px;font-size:.78rem">${p.isNew?'✓ جديد':'+جديد'}</button>
                    <button onclick="_adminToggle(${p.id},'isBestseller')" style="${S.btn(p.isBestseller?'#d4af7a':'#333',p.isBestseller?'#3a2000':'white')}padding:5px 12px;font-size:.78rem">${p.isBestseller?'⭐ مميز':'+مميز'}</button>
                    <button onclick="_adminDelProd(${p.id})" style="${S.btn('#cc2222')}padding:5px 12px;font-size:.78rem">🗑 حذف</button>
                </div>
            </div>`).join('');
    }

    c.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap;gap:10px">
            <h2 style="color:#ff66b2;font-size:1.3rem">📦 المنتجات (${list.length})</h2>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
                <input type="text" id="_prodSearch" placeholder="بحث..." style="${S.input}width:180px">
                <select id="_prodCatF" style="${S.input}width:130px">
                    <option value="all">كل الأقسام</option>
                    ${Object.entries(CAT).map(([k,v]) => `<option value="${k}">${v}</option>`).join('')}
                </select>
            </div>
        </div>
        <div id="_prodsGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1rem"></div>`;

    render(list);

    const filter = () => {
        const q = document.getElementById('_prodSearch')?.value.toLowerCase() || '';
        const cat = document.getElementById('_prodCatF')?.value || 'all';
        let list = getProds();
        if (cat !== 'all') list = list.filter(p => p.category === cat);
        if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
        render(list);
    };

    document.getElementById('_prodSearch')?.addEventListener('input', filter);
    document.getElementById('_prodCatF')?.addEventListener('change', filter);
}

// ============================================================
// TAB: ADD / EDIT PRODUCT
// ============================================================
function tabAddProduct(c, editProd = null) {
    A.tempImg = editProd?.image || null;
    A.editingId = editProd?.id || null;

    c.innerHTML = `
        <h2 style="color:#ff66b2;margin-bottom:1.5rem;font-size:1.3rem">${editProd ? '✏️ تعديل منتج' : '➕ إضافة منتج جديد'}</h2>
        <div style="max-width:550px;display:flex;flex-direction:column;gap:1.1rem">
            <div>
                <label style="${S.label}">اسم المنتج *</label>
                <input type="text" id="_pName" value="${esc(editProd?.name||'')}" placeholder="مثال: خاتم روز جولد" style="${S.input}">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
                <div>
                    <label style="${S.label}">القسم *</label>
                    <select id="_pCat" style="${S.input}">
                        ${Object.entries(CAT).map(([k,v]) => `<option value="${k}" ${editProd?.category===k?'selected':''}>${v}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="${S.label}">السعر (ج.م) *</label>
                    <input type="number" id="_pPrice" value="${editProd?.price||''}" min="0" placeholder="1500" style="${S.input}">
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
                <div>
                    <label style="${S.label}">التقييم (1–5)</label>
                    <input type="number" id="_pRating" value="${editProd?.rating||'4.5'}" min="1" max="5" step="0.1" style="${S.input}">
                </div>
                <div>
                    <label style="${S.label}">نسبة الخصم % (اختياري)</label>
                    <input type="number" id="_pSale" value="${editProd?.salePercent||''}" min="0" max="90" placeholder="مثال: 20" style="${S.input}">
                </div>
            </div>
            <div>
                <label style="${S.label}">وصف المنتج</label>
                <textarea id="_pDesc" rows="3" placeholder="وصف مختصر..." style="${S.textarea}">${esc(editProd?.description||'')}</textarea>
            </div>
            <div>
                <label style="${S.label}">صورة المنتج *</label>
                <button id="_pImgBtn" style="${S.btn('#8a6aff')}padding:10px 20px;font-size:.92rem;width:100%">📷 اختر صورة (ملف أو رابط)</button>
                <div id="_pImgPreview" style="margin-top:10px">
                    ${A.tempImg ? `<div style="display:flex;align-items:center;gap:10px;color:#aaa;font-size:.82rem"><img src="${esc(A.tempImg)}" style="width:80px;height:80px;border-radius:14px;object-fit:cover"><span>✅ صورة محددة</span></div>` : ''}
                </div>
            </div>
            <div style="display:flex;gap:1.5rem;flex-wrap:wrap">
                <label style="display:flex;align-items:center;gap:7px;cursor:pointer;color:#c8b8d5;font-size:.88rem">
                    <input type="checkbox" id="_pNew" ${editProd?.isNew?'checked':''} style="accent-color:#ff66b2;width:16px;height:16px"> منتج جديد
                </label>
                <label style="display:flex;align-items:center;gap:7px;cursor:pointer;color:#c8b8d5;font-size:.88rem">
                    <input type="checkbox" id="_pBest" ${editProd?.isBestseller?'checked':''} style="accent-color:#d4af7a;width:16px;height:16px"> الأكثر مبيعاً
                </label>
            </div>
            <div style="display:flex;gap:10px">
                <button id="_pSubmit" style="${S.btn('linear-gradient(135deg,#ff99cc,#ff66b2)')}flex:1;padding:13px;font-size:1rem">
                    ${editProd ? '💾 حفظ التعديلات' : '✅ إضافة المنتج'}
                </button>
                ${editProd ? `<button id="_pCancelEdit" style="${S.btn('#333')}padding:13px 20px">إلغاء</button>` : ''}
            </div>
        </div>`;

    document.getElementById('_pImgBtn').onclick = () => {
        pickImage(src => {
            document.getElementById('_pImgPreview').innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;color:#aaa;font-size:.82rem">
                    <img src="${esc(src)}" style="width:80px;height:80px;border-radius:14px;object-fit:cover" onerror="this.src='https://placehold.co/80x80/ff99cc/fff?text=?'">
                    <span>✅ تم اختيار الصورة</span>
                </div>`;
            toast('✅ تم اختيار الصورة');
        });
    };

    document.getElementById('_pSubmit').onclick = async () => {
        const name   = document.getElementById('_pName')?.value.trim();
        const cat    = document.getElementById('_pCat')?.value;
        const price  = parseFloat(document.getElementById('_pPrice')?.value);
        const rating = parseFloat(document.getElementById('_pRating')?.value) || 4.5;
        const desc   = document.getElementById('_pDesc')?.value.trim() || 'منتج فاخر من Fionka';
        const isNew  = document.getElementById('_pNew')?.checked;
        const isBest = document.getElementById('_pBest')?.checked;
        const sale   = parseInt(document.getElementById('_pSale')?.value) || 0;

        if (!name)               { toast('⚠️ أدخل اسم المنتج'); return; }
        if (isNaN(price)||price<=0) { toast('⚠️ أدخل سعراً صحيحاً'); return; }
        if (!A.tempImg)          { toast('⚠️ اختر صورة للمنتج'); return; }
        if (rating<1||rating>5)  { toast('⚠️ التقييم بين 1 و 5'); return; }

        const payload = { name, category:cat, price, rating:Math.round(rating*10)/10, image:A.tempImg, description:desc, isNew, isBestseller:isBest, salePercent:sale||0 };
        if (A.editingId) payload.id = A.editingId;

        try {
            const result = await API.saveProduct(payload);
            // also update localStorage for fallback
            const prods = getProds();
            if (A.editingId) {
                const idx = prods.findIndex(p => p.id === A.editingId);
                if (idx !== -1) prods[idx] = result;
            } else {
                prods.push(result);
            }
            setProds(prods);
            toast(`✅ ${A.editingId ? 'تم التعديل' : 'تمت الإضافة'} "${name}"`);
        } catch { toast('❌ فشل الحفظ'); return; }

        A.tempImg = null; A.editingId = null;
        setTimeout(() => { A.activeTab = 'products'; A.panel?.querySelector('._adminTab[data-tab="products"]')?.click(); }, 600);
    };

    document.getElementById('_pCancelEdit')?.addEventListener('click', () => {
        A.tempImg = null; A.editingId = null;
        A.panel?.querySelector('._adminTab[data-tab="products"]')?.click();
    });
}

// ============================================================
// PRODUCT ACTIONS (global)
// ============================================================
window._adminEditProd = id => {
    const p = getProds().find(x => x.id === id);
    if (!p) return;
    A.activeTab = 'addProduct';
    A.panel?.querySelectorAll('._adminTab').forEach(b => { b.style.background='transparent'; b.style.color='#8a7898'; });
    const btn = A.panel?.querySelector('._adminTab[data-tab="addProduct"]');
    if (btn) { btn.style.background='rgba(255,102,178,.15)'; btn.style.color='#ff66b2'; }
    const c = document.getElementById('_adminContent');
    if (c) tabAddProduct(c, p);
};

window._adminEditImg = id => {
    pickImage(async src => {
        try { await API.saveProduct({ id, image: src }); } catch {}
        const prods = getProds();
        const p = prods.find(x => x.id === id);
        if (!p) return;
        p.image = src;
        setProds(prods);
        toast('✅ تم تغيير الصورة');
        A.panel?.querySelector('._adminTab[data-tab="products"]')?.click();
    });
};

window._adminToggle = async (id, flag) => {
    const prods = getProds();
    const p = prods.find(x => x.id === id);
    if (!p) return;
    p[flag] = !p[flag];
    try { await API.saveProduct(p); } catch {}
    setProds(prods);
    const labels = { isNew:'وسم "جديد"', isBestseller:'وسم "مميز"' };
    toast(`✅ تم تحديث ${labels[flag]||flag}`);
    A.panel?.querySelector('._adminTab[data-tab="products"]')?.click();
};

window._adminDelProd = async id => {
    const prods = getProds();
    const p = prods.find(x => x.id === id);
    if (!p) return;
    if (!confirm(`هل أنت متأكد من حذف "${p.name}"؟`)) return;
    try { await API.deleteProduct(id); } catch {}
    setProds(prods.filter(x => x.id !== id));
    toast('🗑 تم حذف المنتج');
    A.panel?.querySelector('._adminTab[data-tab="products"]')?.click();
};

// ============================================================
// TAB: ORDERS
// ============================================================
async function tabOrders(c) {
    let orders;
    try { orders = await API.loadOrders(); } catch { orders = lsGet('fionka_orders', []); }
    if (!Array.isArray(orders)) orders = [];

    c.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap;gap:10px">
            <h2 style="color:#ff66b2;font-size:1.3rem">🛒 الطلبات (${orders.length})</h2>
            <div style="font-size:.8rem;color:#888">الطلبات تُسجَّل تلقائياً عند إتمام الطلب من الموقع</div>
        </div>
        <button id="_addOrderBtn" style="${S.btn('linear-gradient(135deg,#ff99cc,#ff66b2)')}padding:10px 24px;font-size:.92rem;margin-bottom:1rem">
            ➕ تسجيل طلب يدوي
        </button>
        <div id="_ordersList">
            ${!orders.length
                ? '<div style="text-align:center;padding:3rem;color:#666">لا توجد طلبات مسجلة بعد</div>'
                : orders.map((o,i) => {
                    const items = typeof o.items === 'string' ? o.items : (o.items?.map?.(it => `${it.name}×${it.quantity}`).join(', ') || JSON.stringify(o.items));
                    return `
                    <div style="${S.card}margin-bottom:.8rem">
                        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px">
                            <div>
                                <strong style="color:#ff66b2">#${o.id}</strong>
                                <span style="color:#aaa;font-size:.82rem;margin-right:10px">${esc(o.customerName||o.name||'')}</span>
                            </div>
                            <div style="display:flex;gap:8px;align-items:center">
                                <span style="background:${o.status==='مكتمل'?'#22aa5522':o.status==='ملغي'?'#cc222233':'rgba(212,175,122,.2)'};color:${o.status==='مكتمل'?'#22aa55':o.status==='ملغي'?'#cc2222':'#d4af7a'};padding:3px 12px;border-radius:20px;font-size:.78rem;font-weight:700">${o.status||'جديد'}</span>
                                <span style="color:#d4af7a;font-weight:800">${(o.total||0).toLocaleString('ar-EG')} ج.م</span>
                            </div>
                        </div>
                        <div style="font-size:.8rem;color:#666">${esc(items)} · ${o.createdAt?.slice(0,10)||o.date||''} · 📱 ${esc(o.customerPhone||o.phone||'')}</div>
                        <div style="display:flex;gap:6px;margin-top:8px">
                            <button onclick="_orderStatus(${o.id},'مكتمل')" style="${S.btn('#22aa55')}padding:4px 12px;font-size:.75rem">✓ مكتمل</button>
                            <button onclick="_orderStatus(${o.id},'ملغي')" style="${S.btn('#cc2222')}padding:4px 12px;font-size:.75rem">✗ ملغي</button>
                            <button onclick="_orderDel(${o.id})" style="${S.btn('#555')}padding:4px 12px;font-size:.75rem">🗑</button>
                        </div>
                    </div>`;
                }).join('')}
        </div>`;

    document.getElementById('_addOrderBtn').onclick = async () => {
        const name  = prompt('اسم العميل:');
        const phone = prompt('رقم الهاتف:');
        const items = prompt('المنتجات (وصف مختصر):');
        const total = parseFloat(prompt('الإجمالي (ج.م):'));
        if (!name || !total) return;
        try {
            await API.submitOrder({ items: [{ name, quantity: 1 }], total, customerName: name, customerPhone: phone });
        } catch {}
        const orders2 = lsGet('fionka_orders', []);
        orders2.push({ id: Date.now(), name, phone, items, total, status:'جديد', date: new Date().toLocaleString('ar-EG') });
        lsSet('fionka_orders', orders2);
        toast('✅ تم تسجيل الطلب');
        tabOrders(c);
    };
}

window._orderStatus = async (id, status) => {
    try { await API.updateOrderStatus(id, status); } catch {}
    const orders = lsGet('fionka_orders', []);
    const o = orders.find(x => x.id === id);
    if (o) { o.status = status; lsSet('fionka_orders', orders); }
    toast(`✅ تم تحديث حالة الطلب: ${status}`);
    const c = document.getElementById('_adminContent');
    if (c) tabOrders(c);
};

window._orderDel = async id => {
    if (!confirm('حذف هذا الطلب؟')) return;
    try { await API.deleteOrder(id); } catch {}
    const orders = lsGet('fionka_orders', []);
    lsSet('fionka_orders', orders.filter(o => o.id !== id));
    toast('🗑 تم حذف الطلب');
    const c = document.getElementById('_adminContent');
    if (c) tabOrders(c);
};

// ============================================================
// TAB: MESSAGES
// ============================================================
async function tabMessages(c) {
    let msgs;
    try { msgs = await API.loadMessages(); } catch { msgs = lsGet('fionka_contact_messages', []); }
    if (!Array.isArray(msgs)) msgs = [];
    const unread = msgs.filter(m => !m.read).length;

    c.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap;gap:10px">
            <h2 style="color:#ff66b2;font-size:1.3rem">📩 الرسائل (${msgs.length}) ${unread ? `<span style="background:#ff4444;color:#fff;padding:2px 10px;border-radius:20px;font-size:.72rem;margin-right:6px">${unread} جديدة</span>` : ''}</h2>
            <div style="display:flex;gap:8px">
                <button id="_refreshMsgs" style="${S.btn('#d4af7a','#3a2000')}padding:7px 14px;font-size:.8rem">🔄 تحديث</button>
            </div>
        </div>
        <div id="_msgsList">
            ${!msgs.length
                ? '<div style="text-align:center;padding:3rem;color:#666">لا توجد رسائل بعد</div>'
                : msgs.map((m,idx) => `
                    <div style="${S.card}margin-bottom:.8rem;border-color:${m.read?'rgba(255,255,255,.08)':'#ff66b2'};background:${m.read?'rgba(255,255,255,.03)':'rgba(255,102,178,.07)'}">
                        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:6px">
                            <div>
                                <strong style="font-size:.95rem">${esc(m.name)}</strong>
                                ${m.email ? `<span style="color:#888;font-size:.8rem;margin-right:8px">${esc(m.email)}</span>` : ''}
                                ${m.phone ? `<span style="color:#888;font-size:.8rem;margin-right:8px">📱${esc(m.phone)}</span>` : ''}
                            </div>
                            <span style="color:#555;font-size:.75rem">${m.createdAt?.slice(0,10)||m.date||''}</span>
                        </div>
                        <p style="color:#ccc;font-size:.88rem;line-height:1.65;margin-bottom:8px">${esc(m.message)}</p>
                        <div style="display:flex;gap:6px;flex-wrap:wrap">
                            ${m.phone ? `<a href="https://wa.me/${m.phone.replace(/\D/g,'')}" target="_blank" style="${S.btn('#25d366')}padding:4px 12px;font-size:.75rem;text-decoration:none">💬 رد واتساب</a>` : ''}
                            <button onclick="_msgDel(${m.id})" style="${S.btn('#cc2222')}padding:4px 12px;font-size:.75rem">🗑</button>
                        </div>
                    </div>`).join('')}
        </div>`;

    document.getElementById('_refreshMsgs').onclick = () => { tabMessages(c); toast('🔄 تم تحديث الرسائل'); };
}

window._msgDel = async (id) => {
    if (!confirm('حذف هذه الرسالة؟')) return;
    try { await API.deleteMessage(id); } catch {}
    const msgs = lsGet('fionka_contact_messages', []);
    lsSet('fionka_contact_messages', msgs.filter(m => m.id !== id));
    toast('🗑 تم حذف الرسالة');
    const c = document.getElementById('_adminContent'); if (c) tabMessages(c);
};

// ============================================================
// TAB: REVIEWS
// ============================================================
async function tabReviews(c) {
    let reviews;
    try { reviews = await API.loadReviews(); } catch { reviews = lsGet('fionka_reviews', []); }
    if (!Array.isArray(reviews)) reviews = [];
    c.innerHTML = `
        <h2 style="color:#ff66b2;margin-bottom:1.2rem;font-size:1.3rem">⭐ تقييمات العملاء (${reviews.length})</h2>
        ${!reviews.length
            ? '<div style="text-align:center;padding:3rem;color:#666">لا توجد تقييمات بعد</div>'
            : reviews.map((r,i) => `
                <div style="${S.card}margin-bottom:.8rem">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:6px">
                        <div>
                            <strong>${esc(r.name)}</strong>
                            <span style="color:#f5b942;margin-right:10px">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
                        </div>
                        <div style="display:flex;gap:6px;align-items:center">
                            <span style="color:#555;font-size:.75rem">${r.date||''}</span>
                            <button onclick="_delReview(${r.id})" style="${S.btn('#cc2222')}padding:3px 10px;font-size:.75rem">🗑</button>
                        </div>
                    </div>
                    <p style="color:#ccc;font-size:.88rem;line-height:1.65">${esc(r.text)}</p>
                </div>`).join('')}`;
}

window._delReview = async id => {
    if (!confirm('حذف هذا التقييم؟')) return;
    try { await API.deleteReview(id); } catch {}
    const reviews = lsGet('fionka_reviews', []);
    lsSet('fionka_reviews', reviews.filter(r => r.id !== id));
    toast('🗑 تم حذف التقييم');
    if (typeof window.refreshProducts === 'function') window.refreshProducts();
    const c = document.getElementById('_adminContent'); if (c) tabReviews(c);
};

// ============================================================
// TAB: TEXTS
// ============================================================
async function tabTexts(c) {
    let saved;
    try { saved = await API.loadTexts(); } catch { saved = lsGet('fionka_site_texts', {}); }
    const get = key => {
        if (saved && saved[key]) return saved[key];
        const map = {
            hero:         () => document.getElementById('heroText')?.textContent || '',
            about:        () => document.getElementById('aboutText')?.textContent || '',
            heroBadge:    () => document.getElementById('heroBadgeText')?.textContent || '',
            footerTagline:() => document.getElementById('footerTagline')?.textContent || '',
        };
        return map[key]?.() || '';
    };

    c.innerHTML = `
        <h2 style="color:#ff66b2;margin-bottom:1.5rem;font-size:1.3rem">✏️ تعديل نصوص الموقع</h2>
        <div style="max-width:620px;display:flex;flex-direction:column;gap:1.2rem">
            ${[
                ['heroBadge',    'شارة الهيرو', S.input, 'input', get('heroBadge')],
                ['hero',         'نص الترحيب الرئيسي', S.textarea, 'textarea', get('hero')],
                ['about',        'نص عن العلامة', S.textarea, 'textarea', get('about')],
                ['offer',        'عنوان العرض الخاص', S.input, 'input', get('offer')],
                ['offerPct',     'نسبة خصم العرض (مثال: 30%)', S.input, 'input', get('offerPct')],
                ['footerTagline','شعار الفوتر', S.input, 'input', get('footerTagline')],
            ].map(([k,lbl,st,tag,val]) => `
                <div>
                    <label style="${S.label}">${lbl}</label>
                    ${tag==='textarea'
                        ? `<textarea id="_t_${k}" rows="3" style="${st}">${esc(val)}</textarea>`
                        : `<input type="text" id="_t_${k}" value="${esc(val)}" style="${st}">`}
                </div>`).join('')}

            <div style="background:rgba(255,102,178,.06);border-radius:16px;padding:1.2rem">
                <label style="${S.label}margin-bottom:10px">روابط السوشيال ميديا</label>
                ${[
                    ['insta',  '📷 انستقرام', 'https://instagram.com/...', saved?.insta||''],
                    ['tiktok', '🎵 تيك توك',  'https://tiktok.com/@...',  saved?.tiktok||''],
                    ['fb',     '📘 فيسبوك',   'https://facebook.com/...',  saved?.fb||''],
                    ['wa',     '📱 واتساب (أرقام فقط)', '201229507232',   saved?.wa||'201229507232'],
                ].map(([k,lbl,ph,val]) => `
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                        <span style="width:100px;font-size:.82rem;color:#aaa;flex-shrink:0">${lbl}</span>
                        <input type="text" id="_t_${k}" value="${esc(val)}" placeholder="${ph}" style="${S.input}flex:1">
                    </div>`).join('')}
            </div>

            <button id="_saveTexts" style="${S.btn('linear-gradient(135deg,#d4af7a,#b8935a)','#1a0a00')}padding:13px;font-size:1rem;width:100%">
                💾 حفظ جميع النصوص والروابط
            </button>
        </div>`;

    document.getElementById('_saveTexts').onclick = async () => {
        const keys = ['heroBadge','hero','about','offer','offerPct','footerTagline','insta','tiktok','fb','wa'];
        const texts = {};
        keys.forEach(k => {
            const el = document.getElementById(`_t_${k}`);
            if (el) texts[k] = el.value.trim();
        });
        lsSet('fionka_site_texts', texts);
        try { await API.saveTexts(texts); } catch {}
        if (typeof window.applySavedTexts === 'function') window.applySavedTexts();

        const pctEl = document.getElementById('offerPctText');
        if (pctEl && texts.offerPct) pctEl.textContent = texts.offerPct;

        toast('💾 تم حفظ النصوص والروابط بنجاح!');
    };
}

// ============================================================
// TAB: FAQ
// ============================================================
async function tabFaq(c) {
    let faqItems;
    try { faqItems = await API.loadFaq(); } catch { faqItems = lsGet('fionka_faq_items'); }
    if (!Array.isArray(faqItems) || !faqItems.length) {
        faqItems = [
            { question:'كيف أتواصل لإتمام الدفع؟',       answer:'بعد اختيار منتجاتك اضغط "إتمام الشراء" وسيتم تحويلك لواتساب الدعم.' },
            { question:'ما هي طرق الدفع المتاحة؟',         answer:'فودافون كاش، إنستا باي، باي بال، بطاقة ائتمان، تحويل بنكي.' },
            { question:'ما مدة التوصيل؟',                  answer:'من 2 إلى 5 أيام عمل داخل مصر.' },
            { question:'ما سياسة الإرجاع؟',                answer:'يمكنك الإرجاع خلال 14 يوماً من الاستلام.' },
            { question:'هل الشحن مجاني؟',                  answer:'الشحن مجاني على الطلبات التي تتجاوز 500 ج.م داخل مصر.' },
        ];
    }

    function renderFaqList() {
        c.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap;gap:10px">
                <h2 style="color:#ff66b2;font-size:1.3rem">❓ الأسئلة الشائعة (${faqItems.length})</h2>
                <button id="_addFaq" style="${S.btn('#ff66b2')}padding:8px 20px">+ إضافة سؤال</button>
            </div>
            <div id="_faqList" style="display:flex;flex-direction:column;gap:.8rem;max-width:700px">
                ${faqItems.map((item,idx) => `
                    <div style="${S.card}">
                        <div style="display:flex;gap:8px;margin-bottom:6px">
                            <span style="color:#555;font-size:.8rem;padding-top:10px;width:20px;flex-shrink:0">${idx+1}</span>
                            <input type="text" class="_faqQ" data-idx="${idx}" value="${esc(item.question || item.q)}"
                                   style="${S.input}flex:1" placeholder="السؤال">
                        </div>
                        <div style="display:flex;gap:8px">
                            <span style="width:20px;flex-shrink:0"></span>
                            <textarea class="_faqA" data-idx="${idx}" rows="2"
                                      style="${S.textarea}flex:1" placeholder="الإجابة">${esc(item.answer || item.a)}</textarea>
                            <button class="_faqDel" data-idx="${idx}"
                                    style="${S.btn('#cc2222')}padding:6px 12px;flex-shrink:0;align-self:center">🗑</button>
                        </div>
                    </div>`).join('')}
            </div>
            <button id="_saveFaq" style="${S.btn('linear-gradient(135deg,#d4af7a,#b8935a)','#1a0a00')}padding:12px 30px;margin-top:1.2rem;font-size:.95rem">
                💾 حفظ الأسئلة
            </button>`;

        c.querySelectorAll('._faqQ').forEach(inp => inp.onchange = () => { faqItems[parseInt(inp.dataset.idx)].question = inp.value; });
        c.querySelectorAll('._faqA').forEach(inp => inp.onchange = () => { faqItems[parseInt(inp.dataset.idx)].answer = inp.value; });
        c.querySelectorAll('._faqDel').forEach(btn => btn.onclick = () => { faqItems.splice(parseInt(btn.dataset.idx),1); saveFaq(); renderFaqList(); });

        document.getElementById('_addFaq').onclick = () => { faqItems.push({ question:'سؤال جديد', answer:'إجابة جديدة' }); renderFaqList(); };
        document.getElementById('_saveFaq').onclick = () => {
            c.querySelectorAll('._faqQ').forEach(inp => { faqItems[parseInt(inp.dataset.idx)].question = inp.value; });
            c.querySelectorAll('._faqA').forEach(inp => { faqItems[parseInt(inp.dataset.idx)].answer = inp.value; });
            saveFaq(); toast('💾 تم حفظ الأسئلة الشائعة!');
        };
    }

    function saveFaq() {
        lsSet('fionka_faq_items', faqItems);
        API.saveFaq(faqItems.map(i => ({ question: i.question || i.q, answer: i.answer || i.a }))).catch(() => {});
        if (typeof window.applySavedFaq === 'function') window.applySavedFaq();
    }

    renderFaqList();
}

// ============================================================
// TAB: SETTINGS
// ============================================================
function tabSettings(c) {
    const cfg = lsGet('fionka_settings', {});
    c.innerHTML = `
        <h2 style="color:#ff66b2;margin-bottom:1.5rem;font-size:1.3rem">⚙️ إعدادات الموقع</h2>
        <div style="max-width:580px;display:flex;flex-direction:column;gap:1.5rem">

            <div style="${S.card}">
                <h4 style="color:#d4af7a;margin-bottom:1rem;font-family:Cairo,sans-serif">🛒 إعدادات المتجر</h4>
                <div style="display:flex;flex-direction:column;gap:.8rem">
                    <div><label style="${S.label}">الحد الأدنى للشحن المجاني (ج.م)</label>
                        <input type="number" id="_sFreeShip" value="${cfg.freeShip||500}" style="${S.input}"></div>
                    <div><label style="${S.label}">الحد الأقصى للمقارنة</label>
                        <input type="number" id="_sMaxCmp" value="${cfg.maxCompare||3}" min="2" max="5" style="${S.input}"></div>
                    <div><label style="${S.label}">عدد المنتجات في الصفحة (Load More)</label>
                        <input type="number" id="_sPageSize" value="${cfg.pageSize||12}" min="4" max="50" style="${S.input}"></div>
                </div>
            </div>

            <div style="${S.card}">
                <h4 style="color:#d4af7a;margin-bottom:1rem;font-family:Cairo,sans-serif">🎟 كوبونات الخصم</h4>
                <div style="font-size:.82rem;color:#888;margin-bottom:.8rem">الكوبونات الحالية:</div>
                ${Object.entries({ FIONKA10:.10, FIONKA15:.15, WELCOME20:.20, VIP30:.30 }).map(([code,disc]) => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05)">
                        <span style="color:#ff66b2;font-weight:700;font-size:.9rem">${code}</span>
                        <span style="color:#d4af7a;font-weight:700">خصم ${Math.round(disc*100)}%</span>
                    </div>`).join('')}
                <p style="color:#666;font-size:.78rem;margin-top:8px">لإضافة كوبونات جديدة، عدّل ثابت CFG.COUPONS في script.js</p>
            </div>

            <div style="${S.card}">
                <h4 style="color:#d4af7a;margin-bottom:1rem;font-family:Cairo,sans-serif">🗑 إدارة البيانات</h4>
                <div style="display:flex;flex-wrap:wrap;gap:8px">
                    <button onclick="_clearData('cart')"     style="${S.btn('#cc4444')}padding:8px 16px;font-size:.82rem">🛒 مسح السلة</button>
                    <button onclick="_clearData('wishlist')" style="${S.btn('#cc4444')}padding:8px 16px;font-size:.82rem">❤️ مسح المفضلة</button>
                    <button onclick="_clearData('reviews')"  style="${S.btn('#cc4444')}padding:8px 16px;font-size:.82rem">⭐ مسح التقييمات</button>
                    <button onclick="_clearData('messages')" style="${S.btn('#cc4444')}padding:8px 16px;font-size:.82rem">📩 مسح الرسائل</button>
                    <button onclick="_clearData('orders')"   style="${S.btn('#cc4444')}padding:8px 16px;font-size:.82rem">📋 مسح الطلبات</button>
                    <button onclick="_resetProds()"          style="${S.btn('#aa2222')}padding:8px 16px;font-size:.82rem">⚠️ إعادة ضبط المنتجات</button>
                </div>
            </div>

            <button id="_saveSettings" style="${S.btn('linear-gradient(135deg,#d4af7a,#b8935a)','#1a0a00')}padding:13px;font-size:1rem">
                💾 حفظ الإعدادات
            </button>
        </div>`;

    document.getElementById('_saveSettings').onclick = () => {
        const cfg = {
            freeShip:   parseInt(document.getElementById('_sFreeShip')?.value) || 500,
            maxCompare: parseInt(document.getElementById('_sMaxCmp')?.value)  || 3,
            pageSize:   parseInt(document.getElementById('_sPageSize')?.value) || 12,
        };
        lsSet('fionka_settings', cfg);
        toast('💾 تم حفظ الإعدادات');
    };
}

window._clearData = key => {
    const map = {
        cart:     'fionka_cart_v3',
        wishlist: 'fionka_wishlist_v3',
        reviews:  'fionka_reviews',
        messages: 'fionka_contact_messages',
        orders:   'fionka_orders',
    };
    if (!map[key] || !confirm(`مسح ${key} نهائياً؟`)) return;
    localStorage.removeItem(map[key]);
    if (window.App) {
        if (key === 'cart')    window.App.cart = [];
        if (key === 'wishlist') window.App.wishlist = [];
    }
    if (typeof window.refreshProducts === 'function') window.refreshProducts();
    toast(`✅ تم مسح ${key}`);
};

window._resetProds = () => {
    if (!confirm('⚠️ هذا سيحذف جميع المنتجات المضافة ويعيد المنتجات الافتراضية. متأكد؟')) return;
    localStorage.removeItem('fionka_products_v3');
    location.reload();
};

// ============================================================
// BIND
// ============================================================
function bindFooterBtn() {
    const btn = document.getElementById('adminFooterBtn');
    if (btn) { btn.onclick = e => { e.preventDefault(); showLogin(); }; }
    else setTimeout(bindFooterBtn, 400);
}
bindFooterBtn();

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); showLogin(); }
});

console.log('%c✅ Fionka Admin Ready — 2026', 'color:#ff66b2;font-weight:bold;font-size:13px');
console.log('%cCtrl+Shift+A → فتح لوحة الإدارة', 'color:#888');

})();