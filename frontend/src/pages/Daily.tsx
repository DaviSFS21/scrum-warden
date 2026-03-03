import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { CheckSquare, AlertCircle, Loader2 } from 'lucide-react';

type Member = { id: string; name: string };
type Rule = { id: string; name: string; points: number };
type Sprint = { id: string; name: string };

export default function Daily() {
  const [members, setMembers] = useState<Member[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [activeSprintId, setActiveSprintId] = useState('');
  
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [goldenRules, setGoldenRules] = useState<Record<string, boolean>>({});
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    Promise.all([
      api.get('/users').then(res => setMembers(res.data.filter((u: any) => u.role !== 'SM' && u.active))),
      api.get('/rules').then(res => setRules(res.data)),
      api.get('/sprints').then(res => setSprints(res.data.filter((s:any) => s.active)))
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (sprints.length > 0) setActiveSprintId(sprints[0].id);
  }, [sprints]);

  const toggleRule = (memberId: string, ruleId: string) => {
    setSelections(prev => {
      const memberSelections = prev[memberId] || [];
      if (memberSelections.includes(ruleId)) {
        return { ...prev, [memberId]: memberSelections.filter(id => id !== ruleId) };
      }
      return { ...prev, [memberId]: [...memberSelections, ruleId] };
    });
  };

  const toggleGoldenRule = (memberId: string) => {
    setGoldenRules(prev => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  const handleSubmit = async () => {
    if (!activeSprintId) {
      setMessage({ type: 'error', text: 'Nenhuma sprint ativa selecionada.' });
      return;
    }

    const entries: any[] = [];
    members.forEach(member => {
      const memberRules = selections[member.id] || [];
      memberRules.forEach(ruleId => {
        entries.push({ userId: member.id, ruleId });
      });
      if (goldenRules[member.id]) {
        entries.push({ userId: member.id, ruleId: rules[0]?.id, isGoldenRule: true, note: 'Não entregou na sprint (Regra de Ouro)' });
      }
    });

    if (entries.length === 0) {
      setMessage({ type: 'error', text: 'Nenhuma penalidade selecionada para envio.' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/daily', { sprintId: activeSprintId, entries });
      setMessage({ type: 'success', text: 'Penalidades registradas com sucesso!' });
      setSelections({});
      setGoldenRules({});
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao registrar.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Carregando membros e regras...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            Registro de Daily
          </h2>
          <p className="text-slate-400 text-sm mt-1">Selecione as falhas/atrasos ocorridos hoje.</p>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-slate-500 mb-1">Sprint Ativa</label>
          <select 
            className="bg-slate-900 border border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:ring-indigo-500"
            value={activeSprintId}
            onChange={e => setActiveSprintId(e.target.value)}
          >
            {sprints.length === 0 ? <option value="">Sem sprint ativa</option> : sprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border ${message.type === 'error' ? 'bg-red-400/10 border-red-400/20 text-red-400' : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'}`}>
          {message.text}
        </div>
      )}

      {members.length === 0 ? (
        <div className="p-8 text-center text-slate-500 border border-slate-800 border-dashed rounded-xl">
          Nenhum membro ativo cadastrado.
        </div>
      ) : (
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="font-semibold text-lg mb-4 text-indigo-100">{member.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {rules.map(rule => (
                  <label key={rule.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors group">
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        checked={(selections[member.id] || []).includes(rule.id)}
                        onChange={() => toggleRule(member.id, rule.id)}
                        className="w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-600/50 bg-slate-950/50"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{rule.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{rule.points} pontos</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Regra de Ouro separada, destacada */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-red-900/30 bg-red-950/20 hover:bg-red-950/40 cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={goldenRules[member.id] || false}
                    onChange={() => toggleGoldenRule(member.id)}
                    className="w-4 h-4 rounded border-red-800 text-red-600 focus:ring-red-600/50 bg-slate-950"
                  />
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="text-sm font-bold text-red-400 group-hover:text-red-300">Regra de Ouro: Não entregou na Sprint</div>
                      <div className="text-xs text-red-500/70 mt-1">Expulsão automática imediata</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting || sprints.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrar Penalidades'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
