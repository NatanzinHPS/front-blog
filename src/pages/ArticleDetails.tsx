import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ArticleDetail: React.FC = () => {
interface Article {
  id: number;
  title: string;
  content: string;
  image?: string;
  author: string;
  created_at: string;
  updated_at: string;
}
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle(parseInt(id));
    }
  }, [id]);

  const fetchArticle = async (articleId: number) => {
    try {
      setLoading(true);
      const data = await authService.getArticleById(articleId);
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar artigo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!article || !window.confirm('Tem certeza que deseja excluir este artigo?')) {
      return;
    }

    try {
      setDeleting(true);
      await authService.deleteArticle(article.id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir artigo');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAuthor = isAuthenticated && user?.name === article?.author;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-xl text-gray-500">Carregando artigo...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error || 'Artigo não encontrado'}
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Voltar para lista de artigos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Voltar para lista de artigos
          </Link>
        </div>

        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {article.image && (
            <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8 lg:p-12">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center text-gray-500 mb-6 space-y-2 lg:space-y-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {article.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700">Por {article.author}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Publicado em {formatDate(article.created_at)}</div>
                  {article.updated_at !== article.created_at && (
                    <div className="text-gray-400">
                      Atualizado em {formatDate(article.updated_at)}
                    </div>
                  )}
                </div>
              </div>

              {isAuthor && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <Link
                    to={`/edit-article/${article.id}`}
                    className="inline-flex items-center bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {deleting ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              )}
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {article.content}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;