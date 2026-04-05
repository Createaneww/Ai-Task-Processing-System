import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';

    try {
      const { data } = await api.post(endpoint, { email, password });

      if (tab === 'login') {
        const token = data.token || data.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          navigate('/home');
        } else {
          setError('Login succeeded but no token received.');
        }
      } else {
        setSuccess('Account created! You can now log in.');
        handleTabSwitch('login');
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 hover:bg-gray-700 rounded-lg p-1.5 transition-colors"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-gray-700 mb-6">
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              id={`tab-${t}`}
              onClick={() => handleTabSwitch(t)}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              {t === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">
          {tab === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          {/* Switch hint */}
          {tab === 'signup' && (
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <span
                className="text-indigo-400 cursor-pointer hover:underline"
                onClick={() => handleTabSwitch('login')}
              >
                Log in
              </span>
            </p>
          )}

          {/* Submit */}
          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors mt-1"
          >
            {loading
              ? 'Please wait…'
              : tab === 'login'
              ? 'Log In'
              : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
