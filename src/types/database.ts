export interface Word {
  id: string;
  word: string;
  translation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  created_at: string;
  user_id: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  word_id: string;
  correct_count: number;
  incorrect_count: number;
  last_practiced: string;
  mastery_level: number;
}