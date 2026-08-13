# لمسة جمال — Beauty POS (OFFLINE Version)

> **نظام نقاط بيع يعمل 100% بدون إنترنت** — كل البيانات محلية في SQLite.

[![Offline](https://img.shields.io/badge/Mode-Offline%20Only-success)]()
[![SQLite](https://img.shields.io/badge/DB-SQLite-blue)]()
[![Tauri](https://img.shields.io/badge/Desktop-Tauri%202-orange)]()

---

## 📋 الفرق بين النسخة دي والنسخة الكاملة

| الميزة | النسخة Offline (دي) | النسخة الكاملة |
|--------|---------------------|----------------|
| يعمل بدون إنترنت | ✅ نعم 100% | ✅ نعم |
| يحتاج Supabase | ❌ لا | ✅ نعم (للمزامنة) |
| المزامنة السحابية | ❌ معطّلة | ✅ مفعّلة |
| تعدد الأجهزة | ❌ لا | ✅ نعم |
| قاعدة البيانات | SQLite محلي فقط | SQLite + Supabase |
| التعقيد | بسيط — لا إعداد سحابي | يحتاج إعداد Supabase |

**النسخة دي مناسبة لـ:** محل واحد، جهاز واحد، بدون حاجة لمزامنة سحابية.

---

## 🚀 التشغيل السريع

### المتطلبات الأساسية (مرة واحدة)

**Windows:**
- [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- [Rust](https://www.rust-lang.org/tools/install)
- [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (موجود على Windows 10/11)

**macOS:**
```bash
xcode-select --install
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### التشغيل

```bash
# 1. تثبيت dependencies
npm install

# 2. تشغيل في وضع التطوير (hot-reload)
npm run tauri:dev

# 3. أو بناء نسخة production ( installer جاهز للتوزيع)
npm run tauri:build
```

أول تشغيل هياخد 5-10 دقايق (cargo بيجمّع dependencies مرة واحدة). بعدها هتفتح نافذة التطبيق تلقائياً.

---

## 🔑 بيانات الدخول (تُنشأ تلقائياً أول تشغيل)

| المستخدم | كلمة المرور | الدور |
|---------|------------|-------|
| `admin` | `123456` | ADMIN (كل الصلاحيات) |

> ⚠️ **غيّر كلمة المرور بعد أول دخول** من الإعدادات ← المستخدمون.

---

## 📦 البيانات الأولية (تُنشأ تلقائياً أول تشغيل)

أول مرة تشغّل التطبيق، بيتم زرع:
- ✅ **40 منتج** (عطور، مكياج، عناية بالبشرة، شعر، جسم، أدوات) — بأسعار وأكواد باركود ومخزون
- ✅ **15 عميل** (4 فئات ولاء: برونزي/فضي/ذهبي/VIP)
- ✅ **8 موردين**
- ✅ **7 فئات** رئيسية للمنتجات
- ✅ **5 فئات مصروفات** (إيجار، كهرباء، إنترنت، رواتب، أخرى)
- ✅ **4 مستويات ولاء**
- ✅ **جلسة خزنة مفتوحة** (500 ج.م رصيد افتتاحي)
- ✅ **12 إعداد** (ضرائب، ولاء، إيصال، إلخ)

كل ده بدون أي تدخل منك — التطبيق جاهز للاستخدام فوراً.

---

## 💾 مكان قاعدة البيانات

قاعدة البيانات `pos.db` بتُحفظ في:
- **Windows:** `%APPDATA%/com.lamsa-jamal.pos/pos.db`
- **macOS:** `~/Library/Application Support/com.lamsa-jamal.pos/pos.db`
- **Linux:** `~/.local/share/com.lamsa-jamal.pos/pos.db`

> **النسخ الاحتياطي:** انسخ ملف `pos.db` ده لأي مكان آمن. ده كل بياناتك.

---

## 🛠️ التقنيات المستخدمة

| الفئة | التقنية |
|-------|---------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| UI | Tailwind CSS 4, shadcn/ui, Lucide Icons |
| Desktop | Tauri 2 (Rust) |
| Database | SQLite (محلي) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Auth | bcryptjs (محلي) |

---

## 📁 هيكل المشروع

```
beauty-pos-offline/
├── src/
│   ├── app/                    # Next.js pages + API routes
│   ├── components/             # React components (16 modules)
│   └── lib/
│       ├── desktop-api.ts      # ← الطبقة الرئيسية (SQLite + seeding)
│       ├── data/               # unified data layer
│       └── ...
├── src-tauri/                  # Tauri (Rust) — desktop shell
│   ├── src/main.rs             # migrations + plugin setup
│   └── tauri.conf.json
├── prisma/                     # Prisma schema (for dev reference)
├── db/sqlite-schema.sql        # SQLite schema (reference)
└── package.json
```

---

## ❓ الأسئلة الشائعة

**س: هل التطبيق بيحاول يتصل بالإنترنت؟**
ج: لأ. النسخة دي معطّل فيها أي اتصال سحابي. كل العمليات محلية.

**س: لو حابت مزامنة سحابية بعدين؟**
ج: استخدم النسخة الكاملة: https://github.com/mathatqra-arch/beauty-pos-lamsa-jamal

**س: هل أقدر أنقل البيانات لجهاز تاني؟**
ج: آه — انسخ ملف `pos.db` لنفس المسار على الجهاز الجديد.

**س: لو نسيت كلمة المرور؟**
ج: احذف ملف `pos.db` (هتخسر كل البيانات) وشغّل التطبيق تاني — هينشئ admin جديد.

---

## 📝 الترخيص

© 2026 لمسة جمال. جميع الحقوق محفوظة.
