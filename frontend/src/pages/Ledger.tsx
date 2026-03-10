import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { format } from 'date-fns';
import { ArrowLeft, History, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Ledger() {
  const { user: currentUser } = useAuth();
  const { userId } = useParams();
  const [entries, setEntries] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      api.get(`/users/${userId}`).then(res => setUser(res.data));
      api.get(`/points?userId=${userId}`).then(res => setEntries(res.data));
    }
  }, [userId]);

  const handleDeleteEntry = async (entryId: string) => {
    if (confirm('Tem certeza que deseja remover esta infração?')) {
      await api.delete(`/points/${entryId}`);
      setEntries(entries.filter(e => e.id !== entryId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <Link to="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Extrato de Pontos</h2>
          <p className="text-slate-400 text-sm mt-1">{user?.name} ({user?.role})</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <History className="w-12 h-12 mb-3 opacity-20" />
            <p>Nenhuma penalidade registrada.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {entries.map(entry => (
              <li key={entry.id} className="p-4 sm:px-6 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-200">
                      {entry.isGoldenRule ? '⚠️ Regra de Ouro Violada' : entry.rule?.name || 'Penalidade Manual'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {format(new Date(entry.createdAt), 'dd/MM/yyyy HH:mm')} — Sprint: {entry.sprint?.name}
                    </span>
                    {entry.note && (
                      <span className="text-sm text-slate-400 mt-2 bg-slate-950 px-3 py-1.5 rounded-md inline-block border border-slate-800">
                        Nota: {entry.note}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className={`text-lg font-bold flex-shrink-0 ml-4 ${entry.isGoldenRule ? 'text-red-500' : 'text-yellow-500'}`}>
                      +{entry.points} pts
                    </div>
                    {currentUser?.role === 'SM' && (
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        title="Remover Infração"
                        className="ml-4 p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
