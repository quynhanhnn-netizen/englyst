import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ArticleAnalyzer from './components/ArticleAnalyzer';
import PodcastPractice from './components/PodcastPractice';
import VocabBank from './components/VocabBank';
import { ViewState, VocabularyItem, IncomingResource } from './types';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [incomingResources, setIncomingResources] = useState<IncomingResource[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  
  // State to hold data passed from Dashboard to other views
  const [activeResource, setActiveResource] = useState<IncomingResource | null>(null);

  // Fetch data from Supabase on mount
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoadingFeed(true);
      const { data, error } = await supabase
        .from('incoming_resources')
        .select('*')
        .eq('status', 'new') // Only fetch new items
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data) {
        // Map Supabase fields to our IncomingResource type
        // Note: Make sure Supabase column names match or map them here
        const mappedData: IncomingResource[] = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          source: item.source || 'Unknown Source',
          date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }),
          content: item.content,
          url: item.url
        }));
        setIncomingResources(mappedData);
      } else {
        console.warn("Supabase connection missing or empty. Using fallback UI.", error);
        // Fallback for demo if Supabase isn't configured yet
        setIncomingResources([
           {
            id: 'demo-1',
            type: 'article',
            title: 'Setup Supabase to see real data',
            source: 'System',
            date: 'Now',
            content: 'Please configure services/supabaseClient.ts with your credentials to see data from n8n.'
          }
        ]);
      }
      setIsLoadingFeed(false);
    };

    fetchResources();
  }, []);

  const handleSaveVocab = (newItem: Omit<VocabularyItem, 'id' | 'addedAt' | 'status'>) => {
    const item: VocabularyItem = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date(),
      status: 'new'
    };
    setVocabList(prev => [item, ...prev]);
  };

  const handleSyncVocab = () => {
    setVocabList(prev => prev.map(item => ({ ...item, status: 'synced_to_telegram' })));
  };

  const handleProcessResource = (resource: IncomingResource) => {
    setActiveResource(resource);
    if (resource.type === 'article') {
      setCurrentView(ViewState.ARTICLE_ANALYZER);
    } else {
      setCurrentView(ViewState.PODCAST_PRACTICE);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.ARTICLE_ANALYZER:
        return (
          <ArticleAnalyzer 
            onSaveVocab={handleSaveVocab} 
            initialText={activeResource?.type === 'article' ? activeResource.content : ''} 
          />
        );
      case ViewState.PODCAST_PRACTICE:
        return (
          <PodcastPractice 
            initialUrl={activeResource?.type === 'video' ? activeResource.url : ''} 
            initialTopic={activeResource?.title}
          />
        );
      case ViewState.VOCAB_BANK:
        return <VocabBank vocabList={vocabList} onSync={handleSyncVocab} />;
      case ViewState.DASHBOARD:
      default:
        return (
          <div className="space-y-10 animate-fade-in">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFF4E6] via-[#FFF9F0] to-[#FFFFFF] border border-[#F0EAE0] p-10 md:p-14 shadow-sm">
              <svg className="absolute top-0 right-0 h-full w-1/2 opacity-50 pointer-events-none" viewBox="0 0 400 200">
                <path d="M50 200 C150 100, 250 250, 350 50" stroke="#FF6B4A" strokeWidth="2" fill="none" />
                <path d="M0 150 C100 50, 200 200, 400 0" stroke="#FFC078" strokeWidth="2" fill="none" />
              </svg>
              
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-6">
                  Master English with <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] to-[#F59E0B]">Intelligent Recall</span>
                </h2>
                <p className="text-lg text-[#66605B] mb-8 font-medium">
                  Your automated study feed is ready. Pick an item below or start fresh.
                </p>
              </div>
            </div>

            {/* Incoming Feed Section */}
            <div>
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-xl font-extrabold text-[#1A1A1A] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B4A]"></span>
                  Incoming from n8n & Supabase
                </h3>
                <div className="flex gap-3">
                  <span className="text-xs font-bold uppercase text-[#A8A29D] tracking-wider self-center">Auto-Captured</span>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-xs bg-white border border-[#E5E0D8] px-2 py-1 rounded-full hover:bg-[#F9F8F6]"
                  >
                    ↻ Refresh
                  </button>
                </div>
              </div>
              
              {isLoadingFeed ? (
                <div className="p-12 text-center text-[#A8A29D]">Loading feed from Supabase...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {incomingResources.length > 0 ? (
                    incomingResources.map((item) => (
                      <div key={item.id} className="bg-white p-6 rounded-[24px] border border-[#EBE6E0] shadow-sm hover:border-[#FFC078] hover:shadow-md transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full 
                            ${item.type === 'article' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                            {item.type}
                          </span>
                          <span className="text-xs text-[#A8A29D] font-medium">{item.date}</span>
                        </div>
                        <h4 className="font-bold text-[#1A1A1A] text-lg mb-2 leading-tight group-hover:text-[#FF6B4A] transition-colors line-clamp-2 min-h-[3rem]">
                          {item.title}
                        </h4>
                        <p className="text-sm text-[#8C857E] mb-6">Source: {item.source}</p>
                        
                        <button 
                          onClick={() => handleProcessResource(item)}
                          className="w-full bg-[#F9F8F6] text-[#1A1A1A] font-bold py-3 rounded-xl border border-[#E5E0D8] group-hover:bg-[#1A1A1A] group-hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          Process Now <span>→</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-10 bg-white rounded-[24px] border border-dashed border-[#E5E0D8]">
                      <p className="text-[#A8A29D]">No new items found. Check your n8n workflow!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex items-center justify-between mb-6 px-2">
                 <h3 className="text-xl font-extrabold text-[#1A1A1A]">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => { setActiveResource(null); setCurrentView(ViewState.ARTICLE_ANALYZER); }}
                  className="bg-white p-6 rounded-[24px] border border-[#EBE6E0] cursor-pointer hover:border-[#A8A29D] transition-all flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-[#F5F5F4] rounded-xl flex items-center justify-center text-2xl">📰</div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Manual Article</h4>
                    <p className="text-xs text-[#8C857E]">Paste text manually</p>
                  </div>
                </div>

                <div 
                  onClick={() => { setActiveResource(null); setCurrentView(ViewState.PODCAST_PRACTICE); }}
                  className="bg-white p-6 rounded-[24px] border border-[#EBE6E0] cursor-pointer hover:border-[#A8A29D] transition-all flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-[#F5F5F4] rounded-xl flex items-center justify-center text-2xl">🎧</div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Manual Podcast</h4>
                    <p className="text-xs text-[#8C857E]">Paste YouTube link</p>
                  </div>
                </div>

                <div 
                  onClick={() => setCurrentView(ViewState.VOCAB_BANK)}
                  className="bg-white p-6 rounded-[24px] border border-[#EBE6E0] cursor-pointer hover:border-[#A8A29D] transition-all flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-[#F5F5F4] rounded-xl flex items-center justify-center text-2xl">🧠</div>
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Vocab Bank</h4>
                    <p className="text-xs text-[#8C857E]">Review saved words</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;