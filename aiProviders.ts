export type AIProvider = 'gemini' | 'openai' | 'deepseek' | 'cohere' | 'claude' | 'mistral' | 'openrouter';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

// Gemini
async function callGemini(prompt: string): Promise<ProcessStep[]> {
  // استيراد ديناميكي لتقليل حجم الباندل إذا لم يُستخدم
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-04-17',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });
  let jsonStr = (response.text || '').trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  const parsedData = JSON.parse(jsonStr) as ProcessStep[];
  return parsedData.sort((a, b) => a.step - b.step);
}

// OpenAI
async function callOpenAI(prompt: string): Promise<ProcessStep[]> {
  // تحتاج لإضافة مكتبة openai: npm install openai
  const { OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  let jsonStr = response.choices[0]?.message?.content?.trim() || '';
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  const parsedData = JSON.parse(jsonStr) as ProcessStep[];
  return parsedData.sort((a, b) => a.step - b.step);
}

// DeepSeek
async function callDeepSeek(prompt: string): Promise<ProcessStep[]> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    }),
  });
  const data = await response.json();
  let jsonStr = data.choices?.[0]?.message?.content?.trim() || '';
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  const parsedData = JSON.parse(jsonStr) as ProcessStep[];
  return parsedData.sort((a, b) => a.step - b.step);
}

// OpenRouter
async function callOpenRouter(prompt: string): Promise<ProcessStep[]> {
  // تحتاج لإضافة مكتبة openrouter: npm install openrouter
  const { OpenRouter } = await import('openrouter');
  const openrouter = new OpenRouter({ apiKey: import.meta.env.VITE_OPENROUTER_API_KEY });
  const response = await openrouter.chat.completions.create({
    model: 'openrouter-model',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  let jsonStr = response.choices[0]?.message?.content?.trim() || '';
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  const parsedData = JSON.parse(jsonStr) as ProcessStep[];
  return parsedData.sort((a, b) => a.step - b.step);
}

// الدالة الموحدة مع fallback
export async function generateProcessMap(prompt: string, providers: AIProvider[] = ['gemini', 'openai', 'deepseek', 'cohere', 'claude', 'mistral', 'openrouter']): Promise<ProcessStep[]> {
  let lastError = null;
  for (const provider of providers) {
    try {
      if (provider === 'gemini') {
        return await callGemini(prompt);
      }
      if (provider === 'openai') {
        return await callOpenAI(prompt);
      }
      if (provider === 'deepseek') {
        return await callDeepSeek(prompt);
      }
      if (provider === 'mistral') {
        // تحتاج لإضافة مكتبة mistralai: npm install mistralai
        // const { MistralClient } = await import('mistralai');
        // const mistral = new MistralClient(import.meta.env.VITE_MISTRAL_API_KEY);
        // const response = await mistral.chat({
        //   model: 'mistral-large-latest',
        //   messages: [{ role: 'user', content: prompt }],
        //   response_format: 'json',
        // });
        // let jsonStr = response.choices[0]?.message?.content?.trim() || '';
        // const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        // const match = jsonStr.match(fenceRegex);
        // if (match && match[2]) {
        //   jsonStr = match[2].trim();
        // }
        // const parsedData = JSON.parse(jsonStr) as ProcessStep[];
        // return parsedData.sort((a, b) => a.step - b.step);
      }
      if (provider === 'openrouter') {
        return await callOpenRouter(prompt);
      }
      // أضف مزودين آخرين هنا لاحقًا
    } catch (e) {
      lastError = e;
      // جرب المزود التالي
    }
  }
  throw lastError || new Error('لم ينجح أي مزود ذكاء اصطناعي');
} 