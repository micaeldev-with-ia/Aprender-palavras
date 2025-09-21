import React, { useState } from 'react';
import { Edit2, Trash2, BookOpen, Filter } from 'lucide-react';
import { useWords } from '../hooks/useWords';
import { Word } from '../types/database';

export function WordList() {
  const { words, loading, error, deleteWord } = useWords();
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredWords = words.filter(word => {
    const matchesDifficulty = filter === 'all' || word.difficulty === filter;
    const matchesCategory = !categoryFilter || word.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesDifficulty && matchesCategory;
  });

  const categories = [...new Set(words.map(word => word.category))];

  const getDifficultyColor = (difficulty: Word['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: Word['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  const handleDelete = async (id: string, word: string) => {
    if (window.confirm(`Tem certeza que deseja deletar a palavra "${word}"?`)) {
      await deleteWord(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dificuldade
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="easy">Fácil</option>
              <option value="medium">Médio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="Filtrar por categoria..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Lista de palavras */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {words.length === 0 ? 'Nenhuma palavra adicionada' : 'Nenhuma palavra encontrada'}
          </h3>
          <p className="text-gray-600">
            {words.length === 0 
              ? 'Comece adicionando sua primeira palavra para estudar!'
              : 'Tente ajustar os filtros para encontrar suas palavras.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredWords.map((word) => (
            <div key={word.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{word.word}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                      {getDifficultyLabel(word.difficulty)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{word.translation}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Categoria: {word.category}</span>
                    <span>Adicionada em: {new Date(word.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => {/* TODO: Implementar edição */}}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Editar palavra"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(word.id, word.word)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Deletar palavra"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}