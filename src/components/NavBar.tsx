import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-neutral-50 border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        <Link to="/" className="text-2xl font-semibold text-neutral-800 hover:text-neutral-600 transition">
           Meu Blog
        </Link>


        <div className="flex items-center space-x-6 text-sm">
          <Link to="/" className="text-neutral-700 hover:text-neutral-500 transition">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/create-article" className="text-neutral-700 hover:text-neutral-500 transition">
                Criar Artigo
              </Link>
              <Link to="/profile" className="text-neutral-700 hover:text-neutral-500 transition">
                Perfil
              </Link>
              <span className="text-neutral-500">Olá, <span className="font-medium">{user.name}</span></span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-neutral-700 hover:text-neutral-500 transition">
                Entrar
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded border border-blue-300 text-blue-600 hover:bg-blue-50 transition"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
