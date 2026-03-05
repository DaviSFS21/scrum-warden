import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Settings, Users, Trash2 } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'sprints' | 'rules' | 'members'>('sprints');
  
  // Data
  const [sprints, setSprints] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // Form states
  const [newSprint, setNewSprint] = useState({ name: '', startDate: '', endDate: '' });
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [newRule, setNewRule] = useState({ name: '', description: '', points: 0 });

  const loadData = () => {
    api.get('/sprints').then(res => setSprints(res.data));
    api.get('/rules').then(res => setRules(res.data));
    api.get('/users').then(res => setMembers(res.data));
  };

  useEffect(() => { loadData(); }, []);

  // --- Handlers ---
  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/sprints', newSprint);
    setNewSprint({ name: '', startDate: '', endDate: '' });
    loadData();
  };

  const handleActivateSprint = async (id: string) => {
    await api.patch(`/sprints/${id}/activate`);
    loadData();
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/users', newMember);
    setNewMember({ name: '', email: '', password: '', role: 'MEMBER' });
    loadData();
  };

  const updateRulePoints = async (id: string, current: any, pointsStr: string) => {
    const points = parseInt(pointsStr);
    if (!isNaN(points) && points >= 0) {
      await api.patch(`/rules/${id}`, { name: current.name, description: current.description, points });
      loadData();
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/rules', { ...newRule, points: Number(newRule.points) });
    setNewRule({ name: '', description: '', points: 0 });
    loadData();
  };

  const handleDeactivateRule = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este critério?')) {
      await api.delete(`/rules/${id}`);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold tracking-tight">Administração</h2>
        <p className="text-slate-400 text-sm mt-1">Configurações globais do sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['sprints', 'rules', 'members'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {tab === 'sprints' && 'Sprints (Períodos)'}
            {tab === 'rules' && 'Critérios (Regras)'}
            {tab === 'members' && 'Integrantes'}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        {activeTab === 'sprints' && (
          <div className="space-y-8">
            <form onSubmit={handleCreateSprint} className="grid md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nome da Sprint</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm" value={newSprint.name} onChange={e => setNewSprint({...newSprint, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Início</label>
                <input required type="date" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm" value={newSprint.startDate} onChange={e => setNewSprint({...newSprint, startDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Fim</label>
                <input required type="date" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm" value={newSprint.endDate} onChange={e => setNewSprint({...newSprint, endDate: e.target.value})} />
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded text-sm font-medium">Criar Sprint</button>
            </form>

            <table className="w-full text-left text-sm">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr><th className="pb-2">Nome</th><th className="pb-2">Duração</th><th className="pb-2">Status</th><th className="pb-2">Ação</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sprints.map(s => (
                  <tr key={s.id}>
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="py-3 text-slate-400">{new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${s.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {s.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="py-3">
                      {!s.active && <button onClick={() => handleActivateSprint(s.id)} className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">Ativar Sprint</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-8">
            <form onSubmit={handleCreateRule} className="grid md:grid-cols-4 gap-4 items-end bg-slate-950 p-4 border border-slate-800 rounded-lg">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Nome do Critério</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs text-slate-400 mb-1">Pontos Base</label>
                <input required type="number" min="0" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm" value={newRule.points} onChange={e => setNewRule({...newRule, points: parseInt(e.target.value) || 0})} />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 text-sm rounded font-medium h-fit">Adicionar Critério</button>
              
              <div className="col-span-1 md:col-span-4 mt-[-8px]">
                <label className="block text-xs text-slate-400 mb-1">Descrição</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm" value={newRule.description} onChange={e => setNewRule({...newRule, description: e.target.value})} />
              </div>
            </form>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="text-sm text-slate-400 mb-6 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Altere o peso de cada critério para o projeto atual ou remova-os.
              </div>
            {rules.map(rule => (
              <div key={rule.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-slate-800 rounded-lg gap-4">
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">{rule.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{rule.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">Pontos:</span>
                    <input
                      type="number"
                      min="0"
                      defaultValue={rule.points}
                      onBlur={(e) => updateRulePoints(rule.id, rule, e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-700 rounded p-1.5 text-center text-sm font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <button 
                    onClick={() => handleDeactivateRule(rule.id)}
                    title="Remover Critério"
                    className="p-1.5 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-8">
            <form onSubmit={handleCreateMember} className="grid md:grid-cols-5 gap-4 items-end bg-slate-950 p-4 border border-slate-800 rounded-lg">
              <div className="col-span-1">
                <label className="block text-xs text-slate-400 mb-1">Nome</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs text-slate-400 mb-1">E-mail</label>
                <input required type="email" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs text-slate-400 mb-1">Senha Inicial</label>
                <input required type="password" minLength={6} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm" value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs text-slate-400 mb-1">Perfil</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}>
                  <option value="MEMBER">Membro (Dev)</option>
                  <option value="PO">Product Owner</option>
                  <option value="SM">Scrum Master</option>
                </select>
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 text-sm rounded font-medium h-fit">Adicionar</button>
            </form>

            <table className="w-full text-left text-sm">
              <thead className="text-slate-500 border-b border-slate-800">
                <tr><th className="pb-2">Nome</th><th className="pb-2">E-mail</th><th className="pb-2">Perfil</th><th className="pb-2">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {members.map(m => (
                  <tr key={m.id}>
                    <td className="py-3 font-medium flex items-center gap-2"><Users className="w-4 h-4 text-slate-500"/>{m.name}</td>
                    <td className="py-3 text-slate-400">{m.email}</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded text-xs bg-slate-800">{m.role}</span></td>
                    <td className="py-3 text-slate-400">{m.active ? 'Ativo' : 'Inativo'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
