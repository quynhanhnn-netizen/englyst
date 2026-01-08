import React from 'react';
import { ViewState } from '../types';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  
  const NavItem = ({ view, label, icon }: { view: ViewState; label: string; icon: React.ReactNode }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onChangeView(view)}
        className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-all rounded-full mb-1
          ${isActive 
            ? 'bg-[#FFF0EB] text-[#FF6B4A]' // Light orange bg with vibrant orange text
            : 'text-[#66605B] hover:bg-stone-100 hover:text-[#1A1A1A]'}`}
      >
        <span className={`text-lg ${isActive ? 'scale-110' : ''} transition-transform`}>{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFCF8]">
      {/* Sidebar */}
      <aside className="w-full md:w-72 flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="p-8 pb-4">
          <h1 className="text-2xl font-extrabold text-[#1A1A1A] flex items-center gap-2 tracking-tight">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg text-white flex items-center justify-center text-lg">
              ⚡
            </div>
            Englyst
          </h1>
          <p className="text-xs text-[#8C857E] mt-2 font-medium ml-1">Heexo-inspired Learning</p>
        </div>
        
        <nav className="px-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            <NavItem view={ViewState.DASHBOARD} label="Dashboard" icon="📊" />
          </div>
          
          <div className="text-[11px] font-bold text-[#A8A29D] uppercase tracking-widest mt-8 mb-3 px-6">
            Sources
          </div>
          <div className="space-y-1">
            <NavItem view={ViewState.ARTICLE_ANALYZER} label="Read Articles" icon="📰" />
            <NavItem view={ViewState.PODCAST_PRACTICE} label="Podcast & 5W1H" icon="🎧" />
          </div>

          <div className="text-[11px] font-bold text-[#A8A29D] uppercase tracking-widest mt-8 mb-3 px-6">
            Knowledge
          </div>
          <div className="space-y-1">
            <NavItem view={ViewState.VOCAB_BANK} label="Vocab Bank" icon="🧠" />
          </div>
        </nav>
        
        <div className="p-6">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
            <div className="text-xs font-bold text-[#1A1A1A] mb-2 uppercase tracking-wide">System Status</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#66605B]">
                <span className="w-2 h-2 bg-[#4ADE80] rounded-full shadow-[0_0_6px_#4ADE80]"></span>
                Supabase: Ready
              </div>
              <div className="flex items-center gap-2 text-xs text-[#66605B]">
                <span className="w-2 h-2 bg-[#4ADE80] rounded-full shadow-[0_0_6px_#4ADE80]"></span>
                n8n/Telegram: Ready
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;