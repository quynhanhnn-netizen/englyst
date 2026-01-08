import React, { useState, useEffect } from 'react';
import { analyzeArticle } from '../services/geminiService';
import { ArticleAnalysisResult, VocabularyItem } from '../types';

interface ArticleAnalyzerProps {
  initialText?: string;
  onSaveVocab: (vocab: Omit<VocabularyItem, 'id' | 'addedAt' | 'status'>) => void;
}

const ArticleAnalyzer: React.FC<ArticleAnalyzerProps> = ({ initialText = '', onSaveVocab }) => {
  const [inputText, setInputText] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ArticleAnalysisResult | null>(null);

  // Auto-analyze if initialText is provided and valid
  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const data = await analyzeArticle(inputText);
      setResult(data);
    } catch (error) {
      alert("Error analyzing text. Please check your API key or try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Article Analyzer</h2>
          <p className="text-[#66605B] mt-1">Paste an article to summarize it and extract C1 vocabulary.</p>
        </div>
      </header>

      <div className="bg-white rounded-[24px] p-2 border border-[#EBE6E0] shadow-sm">
        <textarea
          className="w-full h-56 p-6 rounded-[20px] bg-[#F9F8F6] border-none focus:ring-2 focus:ring-[#FFC078] resize-none text-[#1A1A1A] placeholder-[#A8A29D]"
          placeholder="Paste English article content here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="text-xs font-semibold text-[#A8A29D] uppercase tracking-wide">{inputText.length} characters</span>
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !inputText}
            className={`px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg
              ${isLoading 
                ? 'bg-[#A8A29D] cursor-wait' 
                : 'bg-[#1A1A1A] hover:bg-[#333] hover:shadow-xl hover:-translate-y-0.5'}`}
          >
            {isLoading ? 'AI is analyzing...' : 'Analyze Text'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Summary Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[24px] border border-[#EBE6E0] shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B4A] to-[#F59E0B]"></div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <span>📑</span> AI Summary
              </h3>
              <p className="text-[#44403C] leading-relaxed text-lg font-medium">
                {result.summary}
              </p>
            </div>
            
             <details className="group bg-white p-6 rounded-[24px] border border-[#EBE6E0] cursor-pointer">
                <summary className="text-sm font-bold text-[#66605B] flex items-center justify-between">
                  <span>View Original Text</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-sm text-[#8C857E] whitespace-pre-wrap leading-relaxed">{inputText}</p>
             </details>
          </div>

          {/* Vocabulary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[24px] border border-[#EBE6E0] shadow-sm overflow-hidden sticky top-8">
              <div className="p-6 border-b border-[#F5F2EF] bg-[#FFF9F5]">
                <h3 className="font-bold text-[#1A1A1A]">Suggested Vocabulary</h3>
                <p className="text-xs text-[#FF6B4A] font-medium mt-1">Click + to save to your bank</p>
              </div>
              <div className="divide-y divide-[#F5F2EF] max-h-[600px] overflow-y-auto custom-scrollbar">
                {result.keyVocabulary.map((item, idx) => (
                  <div key={idx} className="p-5 hover:bg-[#FAFAF9] transition-colors group relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg text-[#1A1A1A]">{item.word}</span>
                        <span className="text-[10px] font-bold text-[#66605B] bg-[#EBE6E0] px-2 py-1 rounded-md lowercase">{item.partOfSpeech}</span>
                      </div>
                      <button 
                        onClick={() => onSaveVocab({
                          word: item.word,
                          partOfSpeech: item.partOfSpeech,
                          definition: item.definition,
                          context: item.example,
                          source: 'Article Analysis'
                        })}
                        className="bg-white border border-[#E5E0D8] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full shadow-sm"
                        title="Save Word"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-[#66605B] mb-3 leading-snug">{item.definition}</p>
                    <div className="bg-[#F5F5F4] p-3 rounded-xl">
                      <p className="text-xs text-[#8C857E] italic">"{item.example}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleAnalyzer;