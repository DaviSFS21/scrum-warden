import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Users, Star, Loader2, Info, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Sprint = { id: string; name: string; active: boolean };
type Member = { id: string; name: string; active: boolean };
type PacerScore = { proactivity: number; autonomy: number; collaboration: number; delivery: number };
type PacerResult = { userId: string; name: string; active: boolean; evaluationsCount: number; proactivity: number; autonomy: number; collaboration: number; delivery: number; };

const LabelledInput = ({ memberId, field, label, val, onChange }: { memberId: string, field: keyof PacerScore, label: string, val: number, onChange: (memberId: string, field: keyof PacerScore, value: number) => void }) => {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-slate-400 mb-1">{label}</label>
      <input 
        type="number" 
        min="0" max="3" 
        value={val}
        onChange={(e) => onChange(memberId, field, parseInt(e.target.value) || 0)}
        className="bg-slate-950 border border-slate-700 text-sm rounded-lg px-3 py-2 focus:ring-slate-500 focus:border-slate-500 w-full"
      />
    </div>
  );
};

export default function Pacer() {
  const { user } = useAuth();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeSprintId, setActiveSprintId] = useState('');
  const [activeTab, setActiveTab] = useState<'evaluate' | 'results'>('evaluate');

  const [evaluations, setEvaluations] = useState<Record<string, PacerScore>>({});
  const [results, setResults] = useState<PacerResult[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    Promise.all([
      api.get('/sprints').then(res => setSprints(res.data)),
      api.get('/users').then(res => setMembers(res.data.filter((u: Member) => u.active)))
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (sprints.length > 0 && !activeSprintId) {
      const active = sprints.find(s => s.active);
      setActiveSprintId(active ? active.id : sprints[0].id);
    }
  }, [sprints, activeSprintId]);

  useEffect(() => {
    if (!activeSprintId) return;

    if (activeTab === 'evaluate') {
      api.get(`/pacer/sprint/${activeSprintId}/my-evaluations`).then(res => {
        setEvaluations(res.data || {});
      }).catch(err => console.error(err));
    } else {
      api.get(`/pacer/sprint/${activeSprintId}`).then(res => {
        setResults(res.data || []);
      }).catch(err => console.error(err));
    }
  }, [activeSprintId, activeTab]);

  const handleScoreChange = (memberId: string, field: keyof PacerScore, value: number) => {
    setEvaluations(prev => {
      const current = prev[memberId] || { proactivity: 0, autonomy: 0, collaboration: 0, delivery: 0 };
      return {
        ...prev,
        [memberId]: { ...current, [field]: value }
      };
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(evaluations).length === 0) {
      setMessage({ type: 'error', text: 'Você não avaliou ninguém ainda.' });
      return;
    }
    
    // Validate if any score is out of bounds
    for (const [_mid, scores] of Object.entries(evaluations)) {
       const vals = Object.values(scores);
       if (vals.some(v => v < 0 || v > 3)) {
         setMessage({ type: 'error', text: 'As notas devem ser entre 0 e 3.' });
         return;
       }
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/pacer', { sprintId: activeSprintId, evaluations });
      setMessage({ type: 'success', text: 'Avaliação enviada com sucesso!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao enviar avaliação.' });
    } finally {
      setSaving(false);
    }
  };

  const handleExportMarkdown = () => {
    if (results.length === 0) return;
    
    const activeSprint = sprints.find(s => s.id === activeSprintId);
    const sprintName = activeSprint ? activeSprint.name : 'Sprint';

    let markdown = `# Resultados PACER - ${sprintName}\n\n`;
    markdown += `| Nome | Proatividade | Autonomia | Colaboração | Entrega | Votos |\n`;
    markdown += `|---|:---:|:---:|:---:|:---:|:---:|\n`;
    
    results.forEach(r => {
      markdown += `| ${r.name} | ${r.proactivity} | ${r.autonomy} | ${r.collaboration} | ${r.delivery} | ${r.evaluationsCount} |\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pacer-resultados-${sprintName.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex items-center justify-center p-12 text-slate-500 "><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const isSelectedSprintActive = sprints.find(s => s.id === activeSprintId)?.active;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-slate-200" />
            Avaliação PACER
          </h2>
          <p className="text-slate-400 text-sm mt-1">Avalie os integrantes da equipe (Proatividade, Autonomia, Colaboração, Entrega).</p>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-slate-500 mb-1">Sprint</label>
          <select 
            className="bg-slate-900 border border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:ring-slate-500"
            value={activeSprintId}
            onChange={e => { setActiveSprintId(e.target.value); setMessage({text:'',type:''}); }}
          >
            {sprints.length === 0 ? <option value="">Sem sprints cadastradas</option> : sprints.map(s => <option key={s.id} value={s.id}>{s.name} {s.active && '(Ativa)'}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-800">
        <button 
          onClick={() => { setActiveTab('evaluate'); setMessage({text:'',type:''}) }} 
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'evaluate' ? 'border-slate-300 text-slate-100' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Minha Avaliação
        </button>
        <button 
          onClick={() => { setActiveTab('results'); setMessage({text:'',type:''}) }} 
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'results' ? 'border-slate-300 text-slate-100' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Resultados Finais
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border ${message.type === 'error' ? 'bg-red-400/10 border-red-400/20 text-red-400' : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'}`}>
          {message.text}
        </div>
      )}

      {activeTab === 'evaluate' && (
        <div className="space-y-6">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
             <Info className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
             <p className="text-sm text-slate-300">Dê notas de 0 a 3 para você e seus colegas. Essa pontuação determinará as médias da sprint.</p>
          </div>
          {members.length === 0 ? (
            <div className="text-center p-8 text-slate-500">Nenhum membro ativo cadastrado.</div>
          ) : (
            <>
              {!isSelectedSprintActive && (
                <div className="bg-amber-400/10 border border-amber-400/20 text-amber-500 p-4 rounded-xl flex items-start gap-3">
                   <Info className="w-5 h-5 mt-0.5 shrink-0" />
                   <p className="text-sm">A votação só é permitida na sprint atual (ativa).</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map(m => (
                  <div key={m.id} className={`bg-slate-900 border ${m.id === user?.id ? 'border-sky-500/50 shadow-md shadow-sky-900/10' : 'border-slate-800'} rounded-xl p-4`}>
                     <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                       <Users className="w-4 h-4 text-slate-500" />
                       {m.name} {m.id === user?.id && <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-medium">Você</span>}
                     </h3>
                     
                     <div className="grid grid-cols-2 gap-3">
                        <LabelledInput memberId={m.id} field="proactivity" label="Proatividade" val={evaluations[m.id]?.proactivity || 0} onChange={handleScoreChange} />
                        <LabelledInput memberId={m.id} field="autonomy" label="Autonomia" val={evaluations[m.id]?.autonomy || 0} onChange={handleScoreChange} />
                        <LabelledInput memberId={m.id} field="collaboration" label="Colaboração" val={evaluations[m.id]?.collaboration || 0} onChange={handleScoreChange} />
                        <LabelledInput memberId={m.id} field="delivery" label="Entrega" val={evaluations[m.id]?.delivery || 0} onChange={handleScoreChange} />
                     </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={saving || sprints.length === 0 || !isSelectedSprintActive}
              className="bg-slate-100 hover:bg-white text-slate-900 font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Avaliação'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-4">
          {results.length === 0 ? (
             <div className="text-center p-12 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                Nenhum resultado recebido para esta sprint ainda.
             </div>
          ) : (
            <div className="flex flex-col gap-4">
               <div className="flex justify-end">
                 <button
                   onClick={handleExportMarkdown}
                   className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 border border-slate-700 hover:border-slate-600"
                 >
                   <Download className="w-4 h-4" />
                   Exportar Markdown
                 </button>
               </div>
               <div className="overflow-x-auto w-full bg-slate-900 border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-800/80 text-slate-400">
                     <tr>
                        <th className="px-4 py-3 font-semibold rounded-tl-xl">Nome</th>
                        <th className="px-4 py-3 font-semibold text-center">Proatividade</th>
                        <th className="px-4 py-3 font-semibold text-center">Autonomia</th>
                        <th className="px-4 py-3 font-semibold text-center">Colaboração</th>
                        <th className="px-4 py-3 font-semibold text-center">Entrega</th>
                        <th className="px-4 py-3 font-semibold text-center text-xs opacity-70 rounded-tr-xl">Qtd de Votos</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                     {results.map(r => (
                        <tr key={r.userId} className="hover:bg-slate-800/20 transition-colors">
                           <td className="px-4 py-4 font-medium flex items-center gap-2">
                             {r.name}
                             {!r.active && <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">Inativo</span>}
                           </td>
                           <td className="px-4 py-4 text-center font-bold text-sky-400">{r.proactivity}</td>
                           <td className="px-4 py-4 text-center font-bold text-sky-400">{r.autonomy}</td>
                           <td className="px-4 py-4 text-center font-bold text-sky-400">{r.collaboration}</td>
                           <td className="px-4 py-4 text-center font-bold text-sky-400">{r.delivery}</td>
                           <td className="px-4 py-4 text-center text-xs text-slate-500">{r.evaluationsCount}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
          )}
        </div>
      )}

    </div>
  );
}
