import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Scrum Warden</h1>
          <p className="text-slate-400 text-sm mt-1">Gestão de Critérios de Permanência</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
