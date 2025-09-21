import React, { useState } from 'react';
import { Plus, LogOut, BookOpen, User } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { WordForm } from './components/WordForm';
import { WordList } from './components/WordList';

function App() {
  const { user, loading, signOut } = useAuth();
  const [showWordForm, setShowWordForm] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vocabulário</h1>
                <p className="text-sm text-gray-600">Aprenda novas palavras</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Suas Palavras</h2>
            <p className="text-gray-600 mt-1">Gerencie seu vocabulário de estudo</p>
          </div>
          
          <button
            onClick={() => setShowWordForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Palavra</span>
          </button>
        </div>

        <WordList />
      </main>

      {/* Modal */}
      {showWordForm && (
        <WordForm onClose={() => setShowWordForm(false)} />
      )}
    </div>
  );
}

export default App;