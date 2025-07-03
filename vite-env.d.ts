/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_DEEPSEEK_API_KEY: string;
  readonly VITE_COHERE_API_KEY: string;
  // أضف المزيد حسب الحاجة
  readonly VITE_CLAUDE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 