import React, { useState, useEffect } from 'react';
import { reviewPodcastSummary } from '../services/geminiService';
import { FiveW1H, PodcastCorrectionResult } from '../types';

interface PodcastPracticeProps {
  initialUrl?: string;
  initialTopic?: string;
}

const PodcastPractice: React.FC<PodcastPracticeProps> = ({ initialUrl = '', initialTopic = '' }) => {
  const [videoUrl, setVideoUrl] = useState(initialUrl);
  const [topic, setTopic] = useState(initialTopic);
  const [inputs, setInputs] = useState<FiveW1H>({
    who: '', what: '', where: '', when: '', why: '', how: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<PodcastCorrectionResult | null>(null);

  useEffect(() => {
    if (initialUrl) setVideoUrl(initialUrl);
    if (initialTopic) setTopic(initialTopic);
  }, [initialUrl, initialTopic]);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleChange = (field: keyof FiveW1H, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!topic) {
      alert("Please enter the topic or title so AI can verify context.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await reviewPodcastSummary(topic, inputs);
      setFeedback(result);
    } catch (e) {
      console.error(e);
      alert("Analysis failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ytId = getYoutubeId(videoUrl);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">Podcast & Video Active Recall</h2>
        <p className="text-[#66605B] mt-1">Listen, then summarize using the 5W1H method. AI will grade your grammar and comprehension.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Source & Input */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-[#EBE6E0] shadow-sm">
            <label className="block text-sm font-bold text-[#1A1A1A] mb-3">Video/Podcast Source</label>
            <input 
              type="text" 
              className="w-full bg-[#F9F8F6] border border-[#E5E0D8] rounded-xl p-3 text-sm mb-4 focus:ring-2 focus:ring-[#FFC078] outline-none transition-all"
              placeholder="Paste YouTube link here..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            {ytId ? (
              <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-md">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${ytId}`} 
                  title="YouTube video player" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video w-full bg-[#F9F8F6] rounded-xl flex flex-col items-center justify-center text-[#A8A29D] border-2 border-dashed border-[#E5E0D8]">
                <span className="text-2xl mb-2">▶️</span>
                <span className="text-sm font-medium">Paste link to load video</span>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[24px] border border-[#EBE6E0] shadow-sm">
             <label className="block text-sm font-bold text-[#1A1A1A] mb-3">Topic / Context</label>
             <input 
              type="text" 
              className="w-full bg-[#F9F8F6] border border-[#E5E0D8] rounded-xl p-3 text-sm mb-8 focus:ring-2 focus:ring-[#FFC078] outline-none transition-all"
              placeholder="e.g. TED Talk on Procrastination"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <h3 className="font-extrabold text-[#1A1A1A] text-xl mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FFF0EB] text-[#FF6B4A] flex items-center justify-center text-sm">5W</span>
              Analysis
            </h3>
            
            <div className="space-y-4">
              {(Object.keys(inputs) as Array<keyof FiveW1H>).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase text-[#A8A29D] mb-1 ml-1">{key}?</label>
                  <textarea 
                    value={inputs[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full bg-[#F9F8F6] border border-[#E5E0D8] rounded-xl p-3 text-sm focus:bg-white focus:ring-2 focus:ring-[#FFC078] outline-none transition-all"
                    rows={2}
                    placeholder={`Describe the ${key}...`}
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full mt-8 bg-[#1A1A1A] text-white py-4 rounded-full font-bold hover:bg-[#333] transition-all shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'AI is Grading...' : 'Submit to AI Tutor'}
            </button>
          </div>
        </div>

        {/* Right Column: Feedback */}
        <div className="space-y-6">
          {feedback ? (
            <div className="bg-white rounded-[24px] border border-[#EBE6E0] shadow-lg overflow-hidden animate-fade-in relative">
               {/* Decorative Gradient Header */}
              <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FFC078] p-8 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">Feedback Report</h3>
                    <p className="text-white/80 text-sm">AI Analysis Result</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-extrabold">{feedback.overallScore}</div>
                    <span className="text-xs font-medium uppercase opacity-75">Score</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-[#A8A29D] uppercase tracking-widest mb-3">Content Analysis</h4>
                  <p className="text-[#44403C] leading-relaxed bg-[#FDFCF8] p-4 rounded-2xl border border-[#F5F2EF]">
                    {feedback.contentFeedback}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#A8A29D] uppercase tracking-widest mb-3">Grammar Check</h4>
                   <ul className="space-y-2">
                    {feedback.grammarFeedback.map((item, idx) => (
                      <li key={idx} className="text-[#DC2626] text-sm bg-red-50 p-3 rounded-xl border border-red-100 flex gap-2">
                        <span>⚠️</span> {item}
                      </li>
                    ))}
                    {feedback.grammarFeedback.length === 0 && (
                      <li className="text-[#16A34A] text-sm bg-green-50 p-3 rounded-xl border border-green-100 flex gap-2">
                        <span>✨</span> Perfect grammar!
                      </li>
                    )}
                  </ul>
                </div>

                <div className="bg-[#F0FDFA] p-6 rounded-[20px] border border-[#CCFBF1]">
                  <h4 className="text-xs font-bold text-[#0F766E] uppercase tracking-widest mb-3">Improved Version (C1)</h4>
                  <p className="text-[#134E4A] italic text-sm leading-relaxed">"{feedback.correctedText}"</p>
                </div>
              </div>
              
              <div className="bg-[#FAFAF9] p-4 text-center border-t border-[#F5F2EF]">
                <button className="text-[#1A1A1A] font-bold text-sm hover:underline">
                  Save Correction to Telegram History
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-[#F9F8F6] border-2 border-dashed border-[#E5E0D8] rounded-[24px] p-12">
              <div className="text-center text-[#A8A29D]">
                <p className="text-5xl mb-4 grayscale opacity-50">✍️</p>
                <p className="font-medium">Complete the 5W1H fields<br/>to receive AI feedback.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastPractice;