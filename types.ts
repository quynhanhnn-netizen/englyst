export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ARTICLE_ANALYZER = 'ARTICLE_ANALYZER',
  PODCAST_PRACTICE = 'PODCAST_PRACTICE',
  VOCAB_BANK = 'VOCAB_BANK'
}

export interface VocabularyItem {
  id: string;
  word: string;
  partOfSpeech: string; // New field for Noun, Verb, Adj, etc.
  definition: string;
  context: string; // The sentence where it appeared
  source: string;
  addedAt: Date;
  status: 'new' | 'synced_to_telegram';
}

export interface ArticleAnalysisResult {
  summary: string;
  keyVocabulary: {
    word: string;
    partOfSpeech: string; // New field
    definition: string;
    example: string;
  }[];
}

export interface PodcastCorrectionResult {
  correctedText: string;
  grammarFeedback: string[];
  contentFeedback: string;
  overallScore: number;
}

export interface FiveW1H {
  who: string;
  what: string;
  where: string;
  when: string;
  why: string;
  how: string;
}

// New Interface for Automated Feeds
export interface IncomingResource {
  id: string;
  type: 'article' | 'video';
  title: string;
  source: string; // e.g., "BBC Learning English", "TED"
  date: string;
  content?: string; // Pre-fetched content for articles
  url?: string; // Link for videos
}