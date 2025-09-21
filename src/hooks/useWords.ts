import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Word } from '../types/database';
import { useAuth } from './useAuth';

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWords();
    } else {
      setWords([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar palavras');
    } finally {
      setLoading(false);
    }
  };

  const addWord = async (word: Omit<Word, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const { data, error } = await supabase
        .from('words')
        .insert([{ ...word, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setWords(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar palavra';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const updateWord = async (id: string, updates: Partial<Word>) => {
    try {
      const { data, error } = await supabase
        .from('words')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      setWords(prev => prev.map(w => w.id === id ? data : w));
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar palavra';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const deleteWord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      setWords(prev => prev.filter(w => w.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar palavra';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  return {
    words,
    loading,
    error,
    addWord,
    updateWord,
    deleteWord,
    refetch: fetchWords,
  };
}