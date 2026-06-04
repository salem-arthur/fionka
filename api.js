const API = {
    token: localStorage.getItem('fionka_token'),
    setToken(t) { this.token = t; if (t) localStorage.setItem('fionka_token', t); else localStorage.removeItem('fionka_token'); },
    _get(k, fb = null) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
    _set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) { console.warn(e); } },

    async loadProducts() {
        const saved = this._get('fionka_products_v3');
        return (saved && saved.length) ? saved : JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    },
    async getProduct(id) { const all = await this.loadProducts(); return all.find(p => p.id === id); },
    async saveProduct(p) {
        const all = await this.loadProducts();
        if (p.id) { const i = all.findIndex(x => x.id === p.id); if (i !== -1) all[i] = p; }
        else { p.id = Date.now(); p.createdAt = new Date().toISOString(); p.views = 0; p.sales = 0; all.push(p); }
        this._set('fionka_products_v3', all);
        return p;
    },
    async deleteProduct(id) {
        this._set('fionka_products_v3', (await this.loadProducts()).filter(p => p.id !== id));
        return { success: true };
    },
    async incrementView(id) { const p = await this.getProduct(id); if (p) { p.views = (p.views||0) + 1; this._set('fionka_products_v3', await this.loadProducts()); } return {}; },
    async incrementSale(id) { const p = await this.getProduct(id); if (p) { p.sales = (p.sales||0) + 1; this._set('fionka_products_v3', await this.loadProducts()); } return {}; },

    async loadReviews() { return this._get('fionka_reviews', []); },
    async submitReview(r) { const all = await this.loadReviews(); r.id = Date.now(); all.push(r); this._set('fionka_reviews', all); return r; },
    async deleteReview(id) { this._set('fionka_reviews', (await this.loadReviews()).filter(r => r.id !== id)); return {}; },

    async loadOrders() { return this._get('fionka_orders', []); },
    async submitOrder(o) { const all = await this.loadOrders(); o.id = Date.now(); o.createdAt = new Date().toISOString(); o.status = 'جديد'; all.push(o); this._set('fionka_orders', all); return o; },
    async updateOrderStatus(id, s) { const all = await this.loadOrders(); const o = all.find(x => x.id === id); if (o) o.status = s; this._set('fionka_orders', all); return {}; },
    async deleteOrder(id) { this._set('fionka_orders', (await this.loadOrders()).filter(o => o.id !== id)); return {}; },

    async loadMessages() { return this._get('fionka_contact_messages', []); },
    async submitMessage(m) { const all = await this.loadMessages(); m.id = Date.now(); m.createdAt = new Date().toISOString(); m.read = false; all.push(m); this._set('fionka_contact_messages', all); return m; },
    async deleteMessage(id) { this._set('fionka_contact_messages', (await this.loadMessages()).filter(m => m.id !== id)); return {}; },

    async loadTexts() { return this._get('fionka_site_texts', {}); },
    async saveTexts(t) { this._set('fionka_site_texts', t); return {}; },

    async loadFaq() {
        let items = this._get('fionka_faq_items');
        if (!Array.isArray(items) || !items.length) {
            items = [
                { question:'كيف أتواصل لإتمام الدفع؟', answer:'بعد اختيار منتجاتك اضغط "إتمام الشراء" وسيتم تحويلك لواتساب الدعم.' },
                { question:'ما هي طرق الدفع المتاحة؟', answer:'فودافون كاش، إنستا باي، باي بال، بطاقة ائتمان، تحويل بنكي.' },
                { question:'ما مدة التوصيل؟', answer:'من 2 إلى 5 أيام عمل داخل مصر.' },
                { question:'ما سياسة الإرجاع؟', answer:'يمكنك الإرجاع خلال 14 يوماً من الاستلام.' },
                { question:'هل الشحن مجاني؟', answer:'الشحن مجاني على الطلبات التي تتجاوز 500 ج.م داخل مصر.' },
            ];
            this._set('fionka_faq_items', items);
        }
        return items;
    },
    async saveFaq(f) { this._set('fionka_faq_items', f); return {}; },

    async loadStats() {
        const p = await this.loadProducts();
        return {
            totalSales: p.reduce((s,x) => s+(x.sales||0), 0),
            totalViews: p.reduce((s,x) => s+(x.views||0), 0),
            ordersRevenue: (await this.loadOrders()).reduce((s,o) => s+(o.total||0), 0),
            catCounts: Object.entries(p.reduce((a,x) => { a[x.category] = (a[x.category]||0)+1; return a; }, {})).map(([k,v]) => ({category:k, count:v})),
        };
    },

    async loadCountdown() { return { target: localStorage.getItem('fionka_countdown') }; },
    async saveCountdown(t) { localStorage.setItem('fionka_countdown', t.target); return {}; },

    async login(u, p) {
        const a = this._get('fionka_admin_auth', { username:'admin', password:'nChLQPQ4NYyOfXhr' });
        if (u === a.username && p === a.password) { const t = 'tok_' + Date.now(); this.setToken(t); return { token: t }; }
        throw { error:'بيانات الدخول غير صحيحة' };
    },
    async changePassword(c, n) {
        const a = this._get('fionka_admin_auth', { username:'admin', password:'nChLQPQ4NYyOfXhr' });
        if (c !== a.password) throw { error:'كلمة المرور الحالية غير صحيحة' };
        a.password = n; this._set('fionka_admin_auth', a); return {};
    },
};
