// Fionka API Layer
const API = {
    base: '/api',
    token: localStorage.getItem('fionka_token'),

    setToken(t) { this.token = t; if (t) localStorage.setItem('fionka_token', t); else localStorage.removeItem('fionka_token'); },

    headers(extra) { const h = { 'Content-Type': 'application/json', ...extra }; if (this.token) h['Authorization'] = 'Bearer ' + this.token; return h; },

    async get(path) { const r = await fetch(this.base + path, { headers: this.headers() }); if (!r.ok) throw await r.json(); return r.json(); },

    async post(path, body) { const r = await fetch(this.base + path, { method: 'POST', headers: this.headers(), body: JSON.stringify(body) }); if (!r.ok) throw await r.json(); return r.json(); },

    async put(path, body) { const r = await fetch(this.base + path, { method: 'PUT', headers: this.headers(), body: JSON.stringify(body) }); if (!r.ok) throw await r.json(); return r.json(); },

    async del(path) { const r = await fetch(this.base + path, { method: 'DELETE', headers: this.headers() }); if (!r.ok) throw await r.json(); return r.json(); },

    // ---- Products ----
    async loadProducts() { return this.get('/products'); },
    async getProduct(id) { return this.get('/products/' + id); },
    async saveProduct(p) { return p.id ? this.put('/products/' + p.id, p) : this.post('/products', p); },
    async deleteProduct(id) { return this.del('/products/' + id); },
    async incrementView(id) { return this.post('/products/' + id + '/view', {}); },
    async incrementSale(id) { return this.post('/products/' + id + '/sale', {}); },

    // ---- Reviews ----
    async loadReviews() { return this.get('/reviews'); },
    async submitReview(r) { return this.post('/reviews', r); },
    async deleteReview(id) { return this.del('/reviews/' + id); },

    // ---- Orders ----
    async loadOrders() { return this.get('/orders'); },
    async submitOrder(o) { return this.post('/orders', o); },
    async updateOrderStatus(id, status) { return this.put('/orders/' + id, { status }); },
    async deleteOrder(id) { return this.del('/orders/' + id); },

    // ---- Messages ----
    async loadMessages() { return this.get('/messages'); },
    async submitMessage(m) { return this.post('/messages', m); },
    async deleteMessage(id) { return this.del('/messages/' + id); },

    // ---- Texts ----
    async loadTexts() { return this.get('/texts'); },
    async saveTexts(t) { return this.put('/texts', t); },

    // ---- FAQ ----
    async loadFaq() { return this.get('/faq'); },
    async saveFaq(f) { return this.put('/faq', f); },

    // ---- Stats ----
    async loadStats() { return this.get('/stats'); },

    // ---- Countdown ----
    async loadCountdown() { return this.get('/countdown'); },
    async saveCountdown(t) { return this.put('/countdown', { target: t }); },

    // ---- Auth ----
    async login(username, password) { return this.post('/auth/login', { username, password }); },
    async changePassword(current, newPass) { return this.post('/auth/change-password', { current, newPass }); },
};
