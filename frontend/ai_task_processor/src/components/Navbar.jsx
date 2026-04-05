import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-bold text-white tracking-tight">AI Task Processor</span>
        </div>

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="px-4 py-1.5 text-sm font-medium text-gray-400 border border-gray-700 rounded-lg hover:border-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
