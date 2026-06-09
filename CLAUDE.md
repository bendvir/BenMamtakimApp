זה פרוייקט אנגולרי מאוד ישן שפותח לפני כמה שנים לדעתי באנגולר 2 
הפרוייקט הינו פרוייקט למכירה קמעונעית למוצרי מזון \ פירות יבשים \ ממתקים
אני רוצה לשדרג את הפרוייקט לאנגולר מתקדם 18 ומעלה 
אני רוצה לשפר את העיצוב כי הוא עיצוב מאוד מאוד מיושן 
אני רוצה לשפר את חווית המשתמש גם בסל הקניות בדומה לאתרי הקניות כמו שופר סל
אני רוצה ליצר שרת שינהל לי את כל הנתונים והמוצרים הקיימים אצלי בחנות ושם אני אוכל להוסיף עוד מוצרים ולהציגם בקליינט 
אני רוצה לייצר אפשרות לרכוש ישירות דרך האתר 
אני רוצה לשפר את התמונות שצולמו ממזמן עם תמונות חדישות

---

## סטטוס נוכחי — 09/06/2026

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
  - `POST /api/admin/login` — JWT auth (סיסמה: `mamtakim2024`)
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
  - CRUD מלא: `login, logout, getCategories, getProducts, createProduct, updateProduct, deleteProduct`
- **proxy**: `/api` → `http://localhost:3000` דרך `proxy.conf.json`

#### Admin Panel (`/admin`)
- **Login**: native password input עם JWT auth
- **טופס הוספה/עריכה** (native inputs — לא Material form fields):
  - Grid 2 עמודות: שם, מחיר (₪ addon), קטגוריה, סוג תמחור, נתיב תמונה, תיאור
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

#### עיצוב
- **פלטה**: ירוק זית (`#567333`), לבן/קרם (`#f7f8f3`), כהה (`#2b2f25`)
- **פונטים**: Heebo (גוף + כותרות) — RTL
- **Slide toggles**: override ל-ירוק זית בתוך `styles.scss` (`.toggle-olive` class)

### 🔄 עדיין חסר
- **תמונות מוצרים אמיתיות** — כרגע placeholder paths
- **מערכת תשלומים** (Stripe / PayPal)
- **Push notifications** כשנוסף מוצר חדש (WebSocket / SSE)
- **אימות מייל** לאדמין (כרגע רק סיסמה)
- **Pagination** בטבלת האדמין (כרגע הכל מוצג)

### הפעלת הפרויקט
```powershell
# טרמינל 1 — Backend
cd "d:\Angular Projects\BenMamtakimApp-v22\backend"
node server.js          # רץ על http://localhost:3000

# טרמינל 2 — Angular
cd "d:\Angular Projects\BenMamtakimApp-v22"
ng serve                # רץ על http://localhost:4200 (proxy → 3000)
```

### API endpoints חשובים
| Method | URL | תיאור |
|--------|-----|-------|
| GET | `/api/health` | בדיקת שרת |
| GET | `/api/products` | כל הקטגוריות + מוצרים |
| GET | `/api/products/:id` | קטגוריה ספציפית |
| POST | `/api/admin/login` | כניסת מנהל |
| GET | `/api/admin/products` | כל המוצרים (כולל אזולי מלאי) |
| POST | `/api/admin/products` | הוספת מוצר |
| PUT | `/api/admin/products/:id` | עדכון מוצר |
| DELETE | `/api/admin/products/:id` | מחיקת מוצר |

### טכנולוגיות
- **Frontend**: Angular 22, Angular Material 22, SCSS, Signals, RxJS, Lazy Loading
- **Backend**: Node.js 24, Express 4, JWT, JSON file store
- **Auth**: JWT Bearer token (8h expiry)
- **Fonts**: Heebo (Google Fonts)

### Skills מותקנים ב-`.claude/skills/`
- **ui-ux-pro-max** — כלי עיצוב UI/UX עם Playwright screenshots
- **AI Research Skills (98 skills)** מ-[Orchestra-Research/AI-Research-SKILLs](https://github.com/Orchestra-Research/AI-Research-SKILLs)
