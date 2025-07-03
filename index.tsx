/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render } from 'preact';
import { signal } from '@preact/signals';
import { generateProcessMap } from './aiProviders';
import { html } from 'htm/preact';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

const userInput = signal('');
const processSteps = signal<ProcessStep[] | null>(null);
const isLoading = signal(false);
const error = signal<string | null>(null);

const App = () => {
  const handleGenerate = async () => {
    if (!userInput.value.trim() || isLoading.value) return;

    isLoading.value = true;
    error.value = null;
    processSteps.value = null;

    try {
      const prompt = `
        بناءً على الوصف التالي، قم بإنشاء خريطة عملية خطوة بخطوة. 
        أرجع الإخراج كـ JSON array حيث يحتوي كل كائن على "step" (رقم)، و "title" (عنوان)، و "description" (وصف).
        تأكد من أن العناوين والأوصاف قصيرة وواضحة ومباشرة.
        الوصف: "${userInput.value}"
      `;

      const steps = await generateProcessMap(prompt, ['gemini', 'openai']);
      processSteps.value = steps;

    } catch (e) {
      console.error(e);
      error.value = 'حدث خطأ أثناء إنشاء خريطة العمليات. يرجى المحاولة مرة أخرى.';
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <>
      <header>
        <h1>مولّد خرائط العمليات بالذكاء الاصطناعي</h1>
        <p>صف العملية التي تريد تخطيطها، وسيقوم الذكاء الاصطناعي بتحويلها إلى خريطة عمليات مرئية.</p>
      </header>
      
      <div class="input-section">
        <textarea
          value={userInput.value}
          onInput={(e) => (userInput.value = (e.currentTarget as HTMLTextAreaElement).value)}
          placeholder="مثال: عملية إعداد كوب من القهوة صباحًا"
          disabled={isLoading.value}
          aria-label="أدخل وصف العملية"
        ></textarea>
        <button onClick={handleGenerate} disabled={isLoading.value || !userInput.value.trim()}>
          {isLoading.value ? 'جاري الإنشاء...' : 'إنشاء الخريطة'}
        </button>
      </div>

      <div class="result-section">
        {isLoading.value && <div class="loader" aria-label="جاري التحميل"></div>}
        {error.value && <div class="error">{error.value}</div>}
        {processSteps.value && (
          <div class="process-map">
            {processSteps.value.map((step) => (
              <div key={step.step} class="step">
                <div class="step-title">{step.title}</div>
                <div class="step-description">{step.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

render(<App />, document.getElementById('app')!);