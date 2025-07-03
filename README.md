<<<<<<< HEAD
# مولّد خرائط العمليات بالذكاء الاصطناعي

تطبيق ويب يستخدم الذكاء الاصطناعي لتحليل النصوص ورسم خرائط العمليات، مع دعم تعدد مزودي الذكاء الاصطناعي (Gemini, OpenAI, DeepSeek, Cohere, Claude, Mistral, OpenRouter).

## المتطلبات
- Node.js 18 أو أحدث
- npm

## الإعداد
1. **تثبيت التبعيات:**
   ```
   npm install
   ```
2. **إضافة مفاتيح مزودي الذكاء الاصطناعي:**
   أنشئ ملف `.env.local` في جذر المشروع وأضف المفاتيح التي لديك:
   ```
   VITE_GEMINI_API_KEY=مفتاح_gemini
   VITE_OPENAI_API_KEY=مفتاح_openai
   VITE_DEEPSEEK_API_KEY=مفتاح_deepseek
   VITE_COHERE_API_KEY=مفتاح_cohere
   VITE_CLAUDE_API_KEY=مفتاح_claude
   VITE_MISTRAL_API_KEY=مفتاح_mistral
   VITE_OPENROUTER_API_KEY=مفتاح_openrouter
   ```
   يمكنك وضع فقط المفاتيح المتوفرة لديك.

3. **تشغيل التطبيق محليًا:**
   ```
   npm run dev
   ```
   ثم افتح الرابط الذي يظهر في الطرفية (غالبًا http://localhost:5173).

4. **بناء نسخة للنشر:**
   ```
   npm run build
   ```
   ستجد الملفات الجاهزة للنشر في مجلد `dist`.

## الملاحظات
- التطبيق سيستخدم تلقائيًا أول مزود متاح من القائمة، وإذا فشل ينتقل للذي يليه.
- لا تشارك مفاتيحك مع أي شخص.
- إذا أضفت مزودًا جديدًا، أضف متغير البيئة الخاص به في `.env.local` وحدث ملف `vite-env.d.ts` و`aiProviders.ts`.
=======
# workflows
>>>>>>> 7b99c8d8d0a92e29a12bb5dccf665230da9d9ad9
