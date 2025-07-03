/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { generateProcessMap } from './aiProviders';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';

export default function App() {
  const [pdfText, setPdfText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // دالة استخراج النص من PDF
  const extractTextFromPDF = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return text;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      try {
        setLoading(true);
        const text = await extractTextFromPDF(e.target.files[0]);
        setPdfText(text);
      } catch (err) {
        setError('تعذر قراءة ملف PDF');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    if (pdfText) {
      try {
        setLoading(true);
        const res = await generateProcessMap(pdfText);
        setResult(res);
      } catch (err: any) {
        setError('حدث خطأ أثناء تحليل الملف: ' + (err?.message || ''));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <h2>مولّد خرائط العمليات بالذكاء الاصطناعي</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleAnalyze} disabled={!pdfText || loading} style={{ marginRight: 8 }}>
        {loading ? 'جاري التحليل...' : 'حلل الملف'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {pdfText && <div style={{ margin: '1rem 0', fontSize: 12, color: '#555', maxHeight: 120, overflow: 'auto', background: '#f7f7f7', padding: 8, borderRadius: 4 }}>
        <b>مقتطف من نص الملف:</b>
        <div dir="ltr">{pdfText.slice(0, 500)}{pdfText.length > 500 ? ' ...' : ''}</div>
      </div>}
      {result && <div style={{ marginTop: 16 }}>
        <h4>نتيجة التحليل:</h4>
        <pre style={{ background: '#f0f0f0', padding: 12, borderRadius: 4, maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(result, null, 2)}</pre>
      </div>}
    </div>
  );
}