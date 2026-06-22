זה פרוייקט אנגולרי מאוד ישן שפותח לפני כמה שנים לדעתי באנגולר 2 
הפרוייקט הינו פרוייקט למכירה קמעונעית למוצרי מזון \ פירות יבשים \ ממתקים
אני רוצה לשדרג את הפרוייקט לאנגולר מתקדם 18 ומעלה 
אני רוצה לשפר את העיצוב כי הוא עיצוב מאוד מאוד מיושן 
אני רוצה לשפר את חווית המשתמש גם בסל הקניות בדומה לאתרי הקניות כמו שופר סל
אני רוצה ליצר שרת שינהל לי את כל הנתונים והמוצרים הקיימים אצלי בחנות ושם אני אוכל להוסיף עוד מוצרים ולהציגם בקליינט 
אני רוצה לייצר אפשרות לרכוש ישירות דרך האתר 
אני רוצה לשפר את התמונות שצולמו ממזמן עם תמונות חדישות

---

## סטטוס נוכחי — 22/06/2026 (עדכון 4)

### ✅ הושלם

#### תשתית פרויקט
- פרויקט **Angular 22** בנתיב: `d:\mamtakim2026`
- **Angular Material 22** עם פלטת צבעים ירוק זית (`#567333`) לכל האתר
- **Git** מחובר ל-GitHub: `https://github.com/bendvir/Mamtakim2026`
- **מבנה Feature-based**:
  ```
  src/app/
    core/services/       ← BasketService, ProductService, AdminService
                            AccessibilityService, CartDrawerService
    features/
      home/              ← דף בית עם hero + 4 קטגוריות
      landing/           ← Landing page (אודותינו)
      dashboard/         ← לוח ניתוח נתונים
      products/          ← קטלוג מוצרים דינמי לפי קטגוריה
      cart/              ← סל קניות מקצועי (e-commerce style)
      checkout/          ← טופס הזמנה עם משלוח/איסוף
      admin/             ← פאנל ניהול מוצרים (JWT auth)
      about/             ← דף אודות
      contact/           ← טופס יצירת קשר
      accessibility/     ← דף הצהרת נגישות
      not-found/         ← דף 404
    shared/
      navbar/            ← announcement bar + לוגו + ניווט + חיפוש autocomplete
      footer/            ← 4 עמודות מקצועי
      accessibility-widget/ ← כפתור נגישות צף
      cart-drawer/       ← סל צד slide-in
      directives/        ← MagnifierDirective
    models/              ← Product (כולל isNew), CartItem
    data/                ← CATEGORY_MAP לfallback סטטי
  src/environments/      ← environment.ts (apiUrl, syncIntervalMs)
  ```

#### Backend (Node.js + Express + MongoDB)
- **שרת**: `backend/server.js` על port 3000
- **מסד נתונים**: **MongoDB Atlas** (Free M0) — cluster: `mamtakim`
  - Connection string ב-`backend/.env` תחת `MONGODB_URI`
  - Models: `backend/models/Product.js`, `Category.js`, `Counter.js`
  - **56 מוצרים** ב-7 קטגוריות
- **תמונות**: **Cloudinary CDN** (cloud: `du7he711i`, folder: `mamtakim`)
  - כל 56 תמונות ב-Cloudinary — URLs מסוג `https://res.cloudinary.com/...`
  - העלאת תמונות חדשות דרך האדמין → `multer.memoryStorage()` → Cloudinary ישירות
- **Routes**:
  - `GET /api/products` — כל הקטגוריות עם מוצרים (ציבורי)
  - `GET /api/products/:categoryId` — קטגוריה ספציפית (ציבורי)
  - `POST /api/admin/login` — שלב 1: בדיקת סיסמה + שליחת OTP למייל → מחזיר `sessionId`
  - `POST /api/admin/verify-otp` — שלב 2: אימות קוד 6 ספרות → מחזיר JWT
  - `GET/POST/PUT/DELETE /api/admin/products` — CRUD מוגן ב-JWT (async)
  - `POST /api/admin/upload` — העלאת תמונה → Cloudinary → מחזיר URL
- **שדות מוצר**: `id, title, price, price_type (0=ק"ג/1=יחידה), category_id, image_url, description, in_stock, is_new, is_new_until, created_at, updated_at`
- **is_new auto-reset**: אחרי 12 שעות (MongoDB `updateMany` ב-`getProducts()`)

#### Angular — שירותים וסנכרון
- **ProductService** (`core/services/product.service.ts`):
  - polling כל **5 דקות** עם `timer(0, syncIntervalMs)` + RxJS switchMap
  - fallback אוטומטי לנתוני CATEGORY_MAP סטטיים אם הbackend לא זמין
  - signals: `categories`, `loading`, `lastSync`, `error`
- **AdminService** (`core/services/admin.service.ts`):
  - JWT token ב-localStorage
  - 2FA: `requestOtp(password)` → `verifyOtp(sessionId, code)` → שמירת JWT
  - CRUD מלא: `logout, getCategories, getProducts, createProduct, updateProduct, deleteProduct`
  - `uploadImage(file)` — העלאת תמונה → Cloudinary URL
- **proxy**: `/api` + `/uploads` → `http://localhost:3000` דרך `proxy.conf.json`

#### Admin Panel (`/admin`)
- **Login 2FA**: שלב 1 — סיסמה → שלב 2 — קוד OTP 6 ספרות שנשלח ל-`bendvirrr@gmail.com`
  - OTP תקף 10 דקות, נמחק אחרי שימוש
  - Gmail SMTP דרך `backend/mailer.js` + nodemailer
  - credentials ב-`backend/.env` (לא ב-git)
- **טופס הוספה/עריכה** (native inputs):
  - Grid 2 עמודות: שם, מחיר (₪ addon), קטגוריה, סוג תמחור, תמונה, תיאור
  - **העלאת תמונה**: כפתור "העלה תמונה" → multer → Cloudinary → URL מתמלא + תצוגה מקדימה
  - Toggles: "במלאי" + "מוצר חדש"
- **טבלת מוצרים**: גלילה פנימית, Thead sticky, חיפוש, סינון קטגוריה, badge חדש/מלאי

#### UI / UX
- **Navbar**: Announcement bar + לוגו (`בהיר.png`) עגול 72px + ניווט + חיפוש autocomplete + סל
- **WhatsApp FAB**: כפתור צף שמאל תחתית → `972502195499`
- **Cart Drawer**: slide-in מימין — weight pills לק"ג / stepper ליחידות
- **Magnifier + Lightbox**: זכוכית מגדלת hover + modal בלחיצה
- **Out-of-stock**: overlay + badge "אזל המלאי" + כפתורים מנוטרלים
- **Footer**: 4 עמודות — לוגו/WhatsApp/שעות | קטגוריות | ניווט | יצירת קשר
- **נגישות (IS 5568)**: AccessibilityWidget צף (bottom-right) + דף הצהרה `/accessibility`

#### עיצוב
- **פלטה**: ירוק זית (`#567333`), לבן/קרם (`#f7f8f3`), כהה (`#2b2f25`)
- **פונטים**: Heebo (גוף + כותרות) — RTL
- **Forms**: native `<input>`, `<select>`, `<textarea>` — עיצוב אחיד 38-42px

---

### הפעלת הפרויקט
```powershell
# טרמינל 1 — Backend
cd "d:\mamtakim2026\backend"
node server.js          # מתחבר ל-MongoDB Atlas ורץ על http://localhost:3000

# טרמינל 2 — Angular
cd "d:\mamtakim2026"
node node_modules/@angular/cli/bin/ng.js serve   # רץ על http://localhost:4200
# אם ng serve לא עובד (execution policy):
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### משתני סביבה — `backend/.env`
```env
PORT=3000
ADMIN_PASSWORD=mamtakim2024
JWT_SECRET=mamtakim-jwt-secret-2026
EMAIL_USER=bendvirrr@gmail.com
EMAIL_PASS=xzltkkorryqxzcgc
EMAIL_TO=bendvirrr@gmail.com
MONGODB_URI=mongodb+srv://bendvirrr_db_user:***@mamtakim.2fa60fx.mongodb.net/mamtakim
CLOUDINARY_CLOUD_NAME=du7he711i
CLOUDINARY_API_KEY=721732273267933
CLOUDINARY_API_SECRET=***
```

### API endpoints חשובים
| Method | URL | תיאור |
|--------|-----|-------|
| GET | `/api/health` | בדיקת שרת |
| GET | `/api/products` | כל הקטגוריות + מוצרים |
| GET | `/api/products/:id` | קטגוריה ספציפית |
| POST | `/api/admin/login` | שלב 1 — סיסמה → שולח OTP למייל |
| POST | `/api/admin/verify-otp` | שלב 2 — אימות OTP → JWT |
| GET | `/api/admin/products` | כל המוצרים (כולל אזולי מלאי) |
| POST | `/api/admin/products` | הוספת מוצר |
| PUT | `/api/admin/products/:id` | עדכון מוצר |
| DELETE | `/api/admin/products/:id` | מחיקת מוצר |
| POST | `/api/admin/upload` | העלאת תמונה → Cloudinary URL |

### טכנולוגיות
- **Frontend**: Angular 22, Angular Material 22, SCSS, Signals, RxJS, Lazy Loading
- **Backend**: Node.js 24, Express 4, Mongoose 8, JWT, Multer (memory)
- **Database**: MongoDB Atlas (Free M0) — `mamtakim` cluster
- **Images**: Cloudinary CDN — cloud `du7he711i`, folder `mamtakim`
- **Auth**: JWT Bearer token (8h expiry) + Gmail OTP 2FA
- **Fonts**: Heebo (Google Fonts)

### סקריפטים שימושיים
```powershell
# מיגרציה עתידית — ייבוא shop.json ל-MongoDB (כבר רץ פעם אחת)
node backend/migrate-to-mongodb.js

# מיגרציית תמונות ל-Cloudinary (כבר רץ פעם אחת)
node backend/migrate-images-to-cloudinary.js
```

### Skills מותקנים ב-`.claude/skills/`
- **ui-ux-pro-max** — כלי עיצוב UI/UX עם Playwright screenshots
- **AI Research Skills (98 skills)**

---

## 🔄 עדיין חסר / TODO

### עדיפות גבוהה — לפני פרודקשן
| משימה | פירוט |
|-------|-------|
| **Deployment** | Frontend → Vercel · Backend → Railway/Render |
| **environment.prod.ts** | יצירת קובץ עם URL backend אמיתי |
| **secrets לפרודקשן** | ADMIN_PASSWORD חזק, JWT_SECRET אקראי, ALLOWED_ORIGINS |

### עדיפות בינונית
| משימה | פירוט |
|-------|-------|
| **מערכת תשלומים** | Cardcom ישראלי / Stripe |
| **Pagination** | טבלת מוצרים באדמין — כרגע הכל מוצג |

### עדיפות נמוכה
| משימה | פירוט |
|-------|-------|
| **Push Notifications** | WebSocket/SSE כשנוסף מוצר חדש |
| **מדיניות פרטיות** | דף `/privacy` — placeholder בfooter |
| **SEO** | meta tags, Open Graph, sitemap.xml |

---

## ✅ צ'קליסט לפני העלאה לפרודקשן

### 1. `backend/.env` — עדכן secrets
```env
ADMIN_PASSWORD=סיסמה-חזקה-אחרת
JWT_SECRET=מחרוזת-רנדומלית-ארוכה-64-תווים
ALLOWED_ORIGINS=https://your-domain.com
MONGODB_URI=...  # כבר מוגדר
CLOUDINARY_*=... # כבר מוגדר
```

### 2. `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-BACKEND-DOMAIN.com/api',
  syncIntervalMs: 5 * 60 * 1000,
};
```
לוודא ב-`angular.json` שיש `fileReplacements` env.ts → env.prod.ts.

### 3. Angular build לפרודקשן
```powershell
ng build --configuration production
```

### 4. Backend — הרץ עם PM2
```bash
npm install -g pm2
pm2 start backend/server.js --name mamtakim-backend
pm2 save
```

### 5. HTTPS — חובה
- Gmail OTP לא יעבוד ללא HTTPS
- MongoDB Atlas מחייר IP whitelist — לפרודקשן: הוסף IP של השרת (לא `0.0.0.0/0`)

### 6. proxy.conf.json — עובד רק ב-dev
- ב-`ng serve` — proxy מעביר `/api` → `localhost:3000`
- ב-`ng build` — חייבים `environment.prod.ts` עם URL מלא

---

## 🆕 עדכון 4 — 22/06/2026

### ✅ נוסף בסשן זה

#### לוגו
- לוגו עודכן ל-`בהיר.png` ב-navbar וב-footer

#### Cloudinary — אחסון תמונות בענן
- כל 54 תמונות המוצרים הועלו ל-Cloudinary (`mamtakim` folder)
- `shop.json` עודכן עם Cloudinary URLs
- Admin upload route: `multer.diskStorage` ← הוחלף ב-`multer.memoryStorage()` + Cloudinary stream
- `backend/migrate-images-to-cloudinary.js` — סקריפט מיגרציה (רץ פעם אחת)

#### MongoDB Atlas — מסד נתונים בענן
- **הוחלף**: `shop.json` (קובץ מקומי) → MongoDB Atlas (M0 Free)
- Models: `backend/models/Product.js`, `Category.js`, `Counter.js`
- `backend/database.js` שוכתב כ-async עם Mongoose
- כל routes עודכנו ל-async/await
- `backend/server.js` מתחבר ל-MongoDB לפני האזנה ל-port
- `backend/migrate-to-mongodb.js` — ייבא 56 מוצרים + 7 קטגוריות (רץ פעם אחת)
- **יתרון**: עובד מכל מחשב (לפטופ/מחשב/שרת) — אין תלות בקובץ מקומי
