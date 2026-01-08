import React, { useState } from 'react';
import { VocabularyItem } from '../types';

interface VocabBankProps {
  vocabList: VocabularyItem[];
  onSync: () => void;
}

const VocabBank: React.FC<VocabBankProps> = ({ vocabList, onSync }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call to n8n webhook
    setTimeout(() => {
      onSync();
      setIsSyncing(false);
      alert("Successfully pushed new words to n8n webhook! Check your Telegram.");
    }, 1500);
  };

  const newWords = vocabList.filter(v => v.status === 'new');
  const syncedWords = vocabList.filter(v => v.status === 'synced_to_telegram');

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Vocabulary Bank</h2>
          <p className="text-[#66605B] mt-1">Review collected words before sending them to your Spaced Repetition System.</p>
        </div>
        <button
          onClick={handleSync}
          disabled={newWords.length === 0 || isSyncing}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-md transition-all
            ${newWords.length === 0 
              ? 'bg-[#E5E0D8] text-[#A8A29D] cursor-not-allowed shadow-none' 
              : 'bg-[#FF6B4A] hover:bg-[#E65030] hover:shadow-lg'}`}
        >
          {isSyncing ? 'Syncing...' : `Sync ${newWords.length} Words`}
          <span className="text-xl">✈️</span>
        </button>
      </header>

      <div className="bg-white rounded-[24px] border border-[#EBE6E0] shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-[#F5F2EF] bg-[#FDFCF8] flex gap-8">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#A8A29D] uppercase tracking-wider">Total Words</span>
            <span className="text-2xl font-extrabold text-[#1A1A1A]">{vocabList.length}</span>
          </div>
          <div className="flex flex-col">
             <span className="text-xs font-bold text-[#A8A29D] uppercase tracking-wider">Pending Sync</span>
             <span className="text-2xl font-extrabold text-[#FF6B4A]">{newWords.length}</span>
          </div>
        </div>

        {vocabList.length === 0 ? (
          <div className="p-20 text-center text-[#A8A29D]">
            <p className="text-lg">No vocabulary saved yet.</p>
            <p className="text-sm mt-2">Go analyze some articles to build your bank!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F8F6] text-[#66605B] text-xs font-bold uppercase tracking-wider">
                  <th className="px-8 py-5">Word</th>
                  <th className="px-8 py-5">Definition</th>
                  <th className="px-8 py-5">Context</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EF]">
                {vocabList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FDFCF8] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-bold text-[#1A1A1A] text-lg">{item.word}</span>
                        <span className="text-[10px] font-bold text-[#8C857E] bg-[#EBE6E0] px-2 py-0.5 rounded-md uppercase tracking-wide">
                          {item.partOfSpeech}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-[#44403C] max-w-xs font-medium">{item.definition}</td>
                    <td className="px-8 py-6 text-sm text-[#66605B] max-w-xs">
                      <div className="bg-[#F5F5F4] p-3 rounded-xl border border-[#EBE6E0]">
                        <div className="italic mb-1 text-[#1A1A1A]">"{item.context}"</div>
                        <span className="text-[10px] font-bold uppercase text-[#A8A29D]">{item.source}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {item.status === 'new' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">
                          Synced
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabBank;