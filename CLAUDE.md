זה פרוייקט אנגולרי מאוד ישן שפותח לפני כמה שנים לדעתי באנגולר 2 
הפרוייקט הינו פרוייקט למכירה קמעונעית למוצרי מזון \ פירות יבשים \ ממתקים
אני רוצה לשדרג את הפרוייקט לאנגולר מתקדם 18 ומעלה 
אני רוצה לשפר את העיצוב כי הוא עיצוב מאוד מאוד מיושן 
אני רוצה לשפר את חווית המשתמש גם בסל הקניות בדומה לאתרי הקניות כמו שופר סל
אני רוצה ליצר שרת שינהל לי את כל הנתונים והמוצרים הקיימים אצלי בחנות ושם אני אוכל להוסיף עוד מוצרים ולהציגם בקליינט 
אני רוצה לייצר אפשרות לרכוש ישירות דרך האתר 
אני רוצה לשפר את התמונות שצולמו ממזמן עם תמונות חדישות

---

## סטטוס נוכחי — 07/06/2026

### ✅ הושלם
- פרויקט חדש **Angular 22** נוצר בנתיב: `D:\Angular Projects\BenMamtakimApp-v22`
- **Angular Material** (גרסה 22) מותקן עם פלטת צבעים מותאמת לחנות
- **מבנה תיקיות מודרני** (Feature-based architecture):
  ```
  src/app/
    core/services/       ← BasketService עם Angular Signals
    features/
      home/              ← דף בית עם hero + קטגוריות
      landing/           ← Landing page יוקרתי (Jolika-style)
      dashboard/         ← לוח ניתוח נתונים / אדמין
      products/          ← קטלוג מוצרים דינמי לפי קטגוריה
      cart/              ← סל קניות מלא
      checkout/          ← טופס הזמנה עם משלוח/איסוף
      about/             ← דף אודות
      contact/           ← טופס יצירת קשר
      not-found/         ← דף 404
    shared/
      navbar/            ← ניווט עם announcement bar + centered logo
      footer/
    models/              ← Product, CartItem interfaces
    data/                ← נתוני מוצרים סטטיים (זמני)
  ```
- **Routing** עם Lazy Loading לכל הדפים
- **Signals** לניהול סל הקניות (totalItems, totalPrice - computed)
- **ניווט** עם announcement bar קבוע + תפריטי dropdown + hamburger mobile
- הפרויקט **בונה ועובד** (ng serve על localhost:4200)
- **Git** מחובר ל-GitHub: `https://github.com/bendvir/BenMamtakimApp`

#### עיצוב — Luxury Minimalism (Jolika Chocolate style)
- **פלטת צבעים**: שוקולד כהה (`#2c1a0e`), קרם חם (`#faf5ef`), זהב (`#b8860b`)
- **פונטים**: Cormorant Garamond (כותרות), Heebo (טקסט גוף) — RTL
- **Announcement bar**: פס עליון כהה עם מידע משלוח + טלפון
- **Navbar**: backdrop-filter blur, grid תלת-עמודות (אייקונים | לוגו | ניווט)
- **Landing page**: hero כהה, editorial product grid, stats strip, reviews, CTA
- **Home page**: hero כהה, category cards, features section (dark)
- **Dashboard**: KPI cards, bar chart, category stats, orders table

#### Skills מותקנים ב-`.claude/skills/`
- **ui-ux-pro-max** — כלי עיצוב UI/UX עם Playwright screenshots
- **AI Research Skills (98 skills)** מ-[Orchestra-Research/AI-Research-SKILLs](https://github.com/Orchestra-Research/AI-Research-SKILLs):
  - `autoresearch` — אורקסטרציה אוטונומית של מחקר AI
  - Model Architectures: `litgpt`, `mamba`, `nanogpt`, `rwkv`, `torchtitan`
  - Fine-tuning: `axolotl`, `llama-factory`, `peft`, `unsloth`
  - Post-training: `grpo-rl-training`, `trl-fine-tuning`, `openrlhf`, `simpo`, `verl`
  - Safety: `constitutional-ai`, `llamaguard`, `nemo-guardrails`, `prompt-guard`
  - Distributed: `deepspeed`, `megatron-core`, `pytorch-fsdp2`, `ray-train`, `accelerate`
  - Inference: `vllm`, `tensorrt-llm`, `llama-cpp`, `sglang`
  - RAG: `chroma`, `faiss`, `pinecone`, `qdrant`, `sentence-transformers`
  - Agents: `langchain`, `llamaindex`, `crewai`, `autogpt`, `a-evolve`
  - Evaluation: `lm-evaluation-harness`, `bigcode-evaluation-harness`, `nemo-evaluator`
  - MLOps: `weights-and-biases`, `mlflow`, `tensorboard`, `swanlab`
  - Multimodal: `clip`, `whisper`, `llava`, `stable-diffusion`, `segment-anything`
  - Paper Writing: `ml-paper-writing`, `academic-plotting`, `systems-paper-writing`
  - Research: `brainstorming-research-ideas`, `creative-thinking-for-research`
  - Emerging: `moe-training`, `model-merging`, `speculative-decoding`, `knowledge-distillation`

### 🔄 בתהליך / עדיין חסר
- **Backend (Node.js/Express)** — לניהול מוצרים מ-DB אמיתי במקום נתונים סטטיים
- **תמונות מוצרים אמיתיות** — כרגע placeholder / CSS art
- **מערכת תשלומים** (Stripe / PayPal / כרטיס אשראי)
- **Admin panel** — ממשק להוספת/עריכת מוצרים
- **Push לגיטהאב** — הקוד עדיין לא נדחף

### טכנולוגיות בשימוש
- Angular 22 + Angular Material 22
- TypeScript 5.x
- SCSS + CSS Custom Properties (design tokens)
- Angular Signals (state management)
- Lazy Loading routes
- Reactive Forms + FormBuilder
- Google Fonts: Cormorant Garamond + Heebo
