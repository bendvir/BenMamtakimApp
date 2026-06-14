זה פרוייקט אנגולרי מאוד ישן שפותח לפני כמה שנים לדעתי באנגולר 2 
הפרוייקט הינו פרוייקט למכירה קמעונעית למוצרי מזון \ פירות יבשים \ ממתקים
אני רוצה לשדרג את הפרוייקט לאנגולר מתקדם 18 ומעלה 
אני רוצה לשפר את העיצוב כי הוא עיצוב מאוד מאוד מיושן 
אני רוצה לשפר את חווית המשתמש גם בסל הקניות בדומה לאתרי הקניות כמו שופר סל
אני רוצה ליצר שרת שינהל לי את כל הנתונים והמוצרים הקיימים אצלי בחנות ושם אני אוכל להוסיף עוד מוצרים ולהציגם בקליינט 
אני רוצה לייצר אפשרות לרכוש ישירות דרך האתר 
אני רוצה לשפר את התמונות שצולמו ממזמן עם תמונות חדישות

---

## סטטוס נוכחי — 14/06/2026 (עדכון אחרון)

### ✅ הושלם

#### תשתית פרויקט
- פרויקט **Angular 22** בנתיב: `D:\Angular Projects\BenMamtakimApp-v22`
- **Angular Material 22** עם פלטת צבעים ירוק זית (`#567333`) לכל האתר
- **Git** מחובר ל-GitHub: `https://github.com/bendvir/BenMamtakimApp`
- **מבנה Feature-based**:
  ```
  src/app/
    core/services/       ← BasketService, ProductService, AdminService
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
      not-found/         ← דף 404
    shared/
      navbar/            ← announcement bar + לוגו + ניווט + חיפוש autocomplete
      footer/
    models/              ← Product (כולל isNew), CartItem
    data/                ← CATEGORY_MAP לfallback סטטי
  src/environments/      ← environment.ts (apiUrl, syncIntervalMs)
  ```

#### Backend (Node.js + Express)
- **שרת**: `backend/server.js` על port 3000
- **אחסון**: JSON file store (`backend/data/shop.json`) — ללא native dependencies
- **37 מוצרים** ב-7 קטגוריות מגורעות:
  - פירות יבשים, אגוזים טבעיים, פיצוחים קלויים, שוקולדים וממתקים, מוצרי מזון, שתייה חריפה, שתייה קלה
- **Routes**:
  - `GET /api/products` — כל הקטגוריות עם מוצרים (ציבורי)
  - `GET /api/products/:categoryId` — קטגוריה ספציפית (ציבורי)
  - `POST /api/admin/login` — שלב 1: בדיקת סיסמה + שליחת OTP למייל → מחזיר `sessionId`
  - `POST /api/admin/verify-otp` — שלב 2: אימות קוד 6 ספרות → מחזיר JWT
  - `GET/POST/PUT/DELETE /api/admin/products` — CRUD מוגן ב-JWT
- **שדות מוצר**: `id, title, price, price_type (0=ק"ג/1=יחידה), category_id, image_url, description, in_stock, is_new, is_new_until, created_at, updated_at`
- **is_new auto-reset**: מוצר מסומן "חדש" מאפס אוטומטית אחרי 12 שעות (lazy cleanup ב-`getProducts()`)

#### Angular — שירותים וסנכרון
- **ProductService** (`core/services/product.service.ts`):
  - polling כל **5 דקות** עם `timer(0, syncIntervalMs)` + RxJS switchMap
  - fallback אוטומטי לנתוני CATEGORY_MAP סטטיים אם הbackend לא זמין
  - signals: `categories`, `loading`, `lastSync`, `error`
- **AdminService** (`core/services/admin.service.ts`):
  - JWT token ב-localStorage
  - 2FA: `requestOtp(password)` → `verifyOtp(sessionId, code)` → שמירת JWT
  - CRUD מלא: `logout, getCategories, getProducts, createProduct, updateProduct, deleteProduct`
  - `uploadImage(file)` — העלאת תמונה ל-backend → מחזיר `imageUrl`
- **proxy**: `/api` + `/uploads` → `http://localhost:3000` דרך `proxy.conf.json`

#### Admin Panel (`/admin`)
- **Login 2FA**: שלב 1 — סיסמה → שלב 2 — קוד OTP 6 ספרות שנשלח ל-`bendvirrr@gmail.com`
  - OTP תקף 10 דקות, נמחק אחרי שימוש
  - Gmail SMTP דרך `backend/mailer.js` + nodemailer
  - credentials ב-`backend/.env` (לא ב-git)
- **טופס הוספה/עריכה** (native inputs — לא Material form fields):
  - Grid 2 עמודות: שם, מחיר (₪ addon), קטגוריה, סוג תמחור, נתיב תמונה, תיאור
  - **העלאת תמונה מהמחשב/טלפון**: כפתור "העלה תמונה" → `multer` שומר ב-`public/assets/images/uploads/` → מוגש ב-`/uploads/` → נתיב מתמלא אוטומטית + תצוגה מקדימה
  - Toggles: "במלאי" + "מוצר חדש" (ירוק זית — override global ב-styles.scss)
- **טבלת מוצרים**:
  - גלילה פנימית (`max-height: 62vh`) — לא צריך לגלול את הדף
  - Thead sticky
  - חיפוש לפי שם (computed signal)
  - מיון/סינון לפי קטגוריה (select)
  - עמודת "חדש" עם badge זהוב
  - עמודת מלאי (ירוק/אדום)
  - כפתורי עריכה ומחיקה

#### Navbar + חיפוש גלובלי
- **Announcement bar** עליון
- **חיפוש autocomplete**: לחיצה על 🔍 → slide-in input (260px) → תוצאות מ-ProductService → ניווט לקטגוריה
- תפריט dropdown 7 קטגוריות + hamburger mobile

#### Forms (native inputs בכל האתר)
- **Admin** + **Contact** — native `<input>`, `<select>`, `<textarea>` (לא `mat-form-field`)
- עיצוב אחיד: 38-42px height, border 1.5px, focus ring ירוק, label מעל

#### WhatsApp FAB
- כפתור צף (`position: fixed`, פינה שמאל תחתית) בכל דפי האתר
- צבע ירוק WhatsApp (`#25d366`), אייקון SVG רשמי
- לחיצה → פותח WhatsApp עם הודעה: "היי, הגעתי לממתקי התקוה דרך האתר אשמח לקבל עזרה"
- טלפון: `972502195499` (0502195499)
- Tooltip על hover, responsive למובייל
- קוד ב-`src/app/app.html` + `src/app/app.scss`

#### קטלוג מוצרים — Magnifier + Lightbox
- **זכוכית מגדלת (Hover)**: `MagnifierDirective` ב-`src/app/shared/directives/magnifier.directive.ts`
  - עיגול 140px עם זום 2.5x שעוקב אחרי העכבר
  - Shimmer animation + מסגרת ירוק זית
- **Lightbox (Click)**: לחיצה על תמונה פותחת modal מוגדל
  - `lightboxImg` + `lightboxTitle` signals
  - backdrop blur, אנימציה scale-in, סגירה ב-ESC + כפתור X
  - קוד ב-`products.ts`, `products.html`, `products.scss`

#### סל קניות — תיקון ספירה
- `totalItems` ב-`BasketService` מחזיר `this._items().length` (מספר מוצרים שונים) ולא סכום גרמים

#### תמונות מוצרים
- **פירות יבשים**: תמונות מקצועיות מ-Pexels ב-`public/assets/images/fruits/`
  - `dates-dark-bowl.jpg`, `cranberries-rustic.jpg`, `prunes-bowl.jpg`, `apricots-bowl.jpg`
  - `pineapple-rings-bowl.jpg`, `papaya-burlap.jpg`, `raisins-black-closeup.jpg`, `raisins-golden-large.jpg`

#### עיצוב
- **פלטה**: ירוק זית (`#567333`), לבן/קרם (`#f7f8f3`), כהה (`#2b2f25`)
- **פונטים**: Heebo (גוף + כותרות) — RTL
- **Slide toggles**: override ל-ירוק זית בתוך `styles.scss` (`.toggle-olive` class)

### 🔄 עדיין חסר
- **מערכת תשלומים** (Stripe / PayPal)
- **Push notifications** כשנוסף מוצר חדש (WebSocket / SSE)
- **Pagination** בטבלת האדמין (כרגע הכל מוצג)

### הפעלת הפרויקט
```powershell
# טרמינל 1 — Backend
cd "d:\Angular Projects\BenMamtakimApp-v22\backend"
node server.js          # רץ על http://localhost:3000

# טרמינל 2 — Angular
cd "d:\Angular Projects\BenMamtakimApp-v22"
npx ng serve            # רץ על http://localhost:4200 (proxy → 3000)
# אם ng serve לא עובד (execution policy):
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
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
| POST | `/api/admin/upload` | העלאת תמונה (JWT) → שומר ב-`uploads/` |
| GET | `/uploads/:filename` | הגשת תמונות שהועלו |

### טכנולוגיות
- **Frontend**: Angular 22, Angular Material 22, SCSS, Signals, RxJS, Lazy Loading
- **Backend**: Node.js 24, Express 4, JWT, JSON file store, Multer (file uploads)
- **Auth**: JWT Bearer token (8h expiry)
- **Fonts**: Heebo (Google Fonts)

### Skills מותקנים ב-`.claude/skills/`
- **ui-ux-pro-max** — כלי עיצוב UI/UX עם Playwright screenshots
- **AI Research Skills (98 skills)** מ-[Orchestra-Research/AI-Research-SKILLs](https://github.com/Orchestra-Research/AI-Research-SKILLs)

---

## ✅ צ'קליסט לפני העלאה לפרודקשן

### 1. `backend/.env` — עדכן את כל ה-secrets
```env
ADMIN_PASSWORD=סיסמה-חזקה-אחרת     # לא mamtakim2024
JWT_SECRET=מחרוזת-רנדומלית-ארוכה   # לא dev-secret
ALLOWED_ORIGINS=https://your-domain.com
EMAIL_USER=bendvirrr@gmail.com
EMAIL_PASS=gmail-app-password       # כבר מוגדר
EMAIL_TO=bendvirrr@gmail.com
```

### 2. `src/environments/environment.prod.ts` — יצור קובץ זה עם ה-URL האמיתי
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-BACKEND-DOMAIN.com/api',  // כתובת ה-backend בפרודקשן
  syncIntervalMs: 5 * 60 * 1000,
};
```
ולוודא ב-`angular.json` שיש `fileReplacements` שמחליף `environment.ts` → `environment.prod.ts` ב-build.

### 3. Angular build לפרודקשן
```powershell
ng build --configuration production
# מייצר dist/ — יש להגיש דרך Nginx / Apache / hosting
```

### 4. Backend — הרץ עם PM2 (לא node ישיר)
```bash
npm install -g pm2
pm2 start backend/server.js --name mamtakim-backend
pm2 save
```

### 5. HTTPS — חובה (Let's Encrypt / Cloudflare)
- ה-Gmail OTP לא יעבוד אם האתר לא על HTTPS בפרודקשן
- גם cookies ו-JWT בטוחים יותר על HTTPS

### 6. שים לב — `proxy.conf.json` עובד רק ב-dev
- ב-`ng serve` — ה-proxy מעביר `/api` → `localhost:3000`
- ב-`ng build` — אין proxy, חייבים `environment.prod.ts` עם URL מלא
