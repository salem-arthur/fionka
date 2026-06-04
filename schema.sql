DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    rating REAL DEFAULT 0,
    image TEXT DEFAULT '',
    isNew INTEGER DEFAULT 0,
    isBestseller INTEGER DEFAULT 0,
    description TEXT DEFAULT '',
    salePercent REAL DEFAULT 0,
    views INTEGER DEFAULT 0,
    sales INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now'))
);

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL,
    date TEXT DEFAULT '',
    createdAt TEXT DEFAULT (datetime('now'))
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT NOT NULL,
    subtotal REAL DEFAULT 0,
    discount REAL DEFAULT 0,
    total REAL DEFAULT 0,
    coupon TEXT DEFAULT '',
    customerName TEXT DEFAULT '',
    customerPhone TEXT DEFAULT '',
    customerAddress TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT (datetime('now'))
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    message TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
);

DROP TABLE IF EXISTS texts;
CREATE TABLE texts (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

DROP TABLE IF EXISTS faq;
CREATE TABLE faq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

-- Seed default texts
INSERT OR IGNORE INTO texts (key, value) VALUES ('hero', 'اكتشفي عالم Fionka — حيث الأناقة تلتقي بالفخامة');
INSERT OR IGNORE INTO texts (key, value) VALUES ('offer', '🌹 عروض حصرية لفترة محدودة');
INSERT OR IGNORE INTO texts (key, value) VALUES ('about', 'Fionka هي علامة مصرية فاخرة متخصصة في تصميم الإكسسوارات والمجوهرات الفريدة. نقدم لكِ قطعاً استثنائية تجمع بين الأناقة العصرية والجودة العالمية.');
INSERT OR IGNORE INTO texts (key, value) VALUES ('admin_pass', '$2a$10$dummy'); -- replaced at first deploy

-- Seed default FAQ
INSERT OR IGNORE INTO faq (id, question, answer) VALUES (1, 'ما هي طرق الدفع المتاحة؟', 'نوفر عدة طرق دفع مرنة: فودافون كاش، إنستا باي، باي بال، بطاقات الائتمان، وتحويل بنكي.');
INSERT OR IGNORE INTO faq (id, question, answer) VALUES (2, 'كم مدة التوصيل؟', 'التوصيل داخل مصر يستغرق من 3 إلى 7 أيام عمل حسب المحافظة.');
INSERT OR IGNORE INTO faq (id, question, answer) VALUES (3, 'هل يمكن إرجاع المنتج؟', 'نعم، نوفر إرجاع واستبدال خلال 14 يوماً من الاستلام بشرط أن يكون المنتج بحالته الأصلية.');
INSERT OR IGNORE INTO faq (id, question, answer) VALUES (4, 'هل الشحن مجاني؟', 'الشحن مجاني للطلبات التي تتجاوز 500 ج.م.');
INSERT OR IGNORE INTO faq (id, question, answer) VALUES (5, 'كيف أتواصل لإتمام الدفع؟', 'بعد اختيار منتجاتك اضغط "إتمام الشراء" وسيتم تحويلك لواتساب الدعم.');

-- Seed default products
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (1,'خاتم روز جولد','rings',1250,4.8,'https://placehold.co/600x600/ffccdd/ffffff?text=Rose+Ring',1,1,'خاتم مرصع بأحجار روز كوارتز الطبيعية');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (2,'انسيال ألماس ناعم','earrings',1890,4.9,'https://placehold.co/600x600/f9ced2/ffffff?text=Diamond+Earrings',0,0,'انسيال من الألماس الأبيض عيار 18');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (3,'سلسلة فيونكة','necklaces',990,4.7,'https://placehold.co/600x600/e6ccff/ffffff?text=Fionka+Necklace',1,0,'سلسلة فضة عيار 925 مع قلادة فيونكة');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (4,'ساعة فاخرة ذهبية','watches',3450,5.0,'https://placehold.co/600x600/f5e0d0/ffffff?text=Luxury+Watch',0,1,'ساعة سويسرية بتصميم عصري أنيق');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (5,'كابلز حب أبدي','couples',2250,4.9,'https://placehold.co/600x600/ffb3ba/ffffff?text=Couple+Set',0,0,'طقم كابلز مطلي بالذهب الوردي');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (6,'خاتم سوليتير','rings',4990,5.0,'https://placehold.co/600x600/d9d2b0/ffffff?text=Solitaire+Ring',0,0,'خاتم ماسي سوليتير فاخر');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (7,'انسيال لؤلؤ','earrings',750,4.6,'https://placehold.co/600x600/ffe0f0/ffffff?text=Pearl+Earrings',1,0,'لؤلؤ طبيعي مع إطار فضي ناعم');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (8,'ساعة كاجوال روز','watches',1890,4.7,'https://placehold.co/600x600/fadadd/ffffff?text=Rose+Watch',0,0,'ساعة أنيقة بسوار من الجلد الطبيعي');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (9,'سلسلة قلادة قلب','necklaces',590,4.5,'https://placehold.co/600x600/fce4ec/ffffff?text=Heart+Pendant',1,0,'قلادة بشكل قلب من الفضة عيار 925');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (10,'كابلز ملكي','couples',3200,4.9,'https://placehold.co/600x600/e6c8d0/ffffff?text=Royal+Couple',0,1,'كابلز مطلي بالذهب عيار 24');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (11,'طقم انسيال وخاتم','rings',2100,4.8,'https://placehold.co/600x600/f0d0ff/ffffff?text=Ring+Set',1,0,'طقم متناسق من انسيال وخاتم روز');
INSERT OR IGNORE INTO products (id,name,category,price,rating,image,isNew,isBestseller,description) VALUES (12,'سلسلة ذهب عيار 18','necklaces',4200,5.0,'https://placehold.co/600x600/f5e6a0/ffffff?text=Gold+Chain',0,1,'سلسلة ذهب أصفر عيار 18 قيراط');
