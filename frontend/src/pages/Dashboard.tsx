import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ShieldAlert, AlertTriangle, UserX, Skull, Download, Loader2 } from 'lucide-react';

type MemberSummary = {
  id: string;
  name: string;
  role: string;
  sprintPoints: number;
  globalPoints: number;
  riskLevel: 'green' | 'yellow' | 'red';
  expelled: boolean;
  expulsionReason?: string;
};

export default function Dashboard() {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [sprint, setSprint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => {
        setMembers(res.data.members.filter((m: any) => m.role !== 'SM'));
        setSprint(res.data.sprint);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    if (!sprint) return;
    setExporting(true);
    try {
      const res = await api.get(`/export/markdown?sprintId=${sprint.id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/markdown' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-sprint-${sprint.name.toLowerCase().replace(/\s+/g, '-')}.md`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Não foi possível exportar o relatório.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-800 rounded w-3/4"></div></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
          <p className="text-slate-400 text-sm mt-1">
            {sprint ? `Sprint Ativa: ${sprint.name}` : 'Nenhuma Sprint Ativa'}
          </p>
        </div>
        
        {sprint && (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-indigo-400" />}
            <span className="hidden sm:inline">Exportar Relatório</span>
            <span className="sm:hidden">Exportar</span>
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map(member => (
          <Link
            key={member.id}
            to={`/ledger/${member.id}`}
            className={`block relative overflow-hidden rounded-xl border p-5 transition-all hover:-translate-y-1 ${
              member.expelled 
                ? 'bg-red-950/20 border-red-900/50 hover:bg-red-950/40' 
                : member.riskLevel === 'red'
                  ? 'bg-red-900/10 border-red-800/50 hover:bg-red-900/20'
                  : member.riskLevel === 'yellow'
                    ? 'bg-yellow-900/10 border-yellow-800/50 hover:bg-yellow-900/20'
                    : 'bg-emerald-900/10 border-emerald-800/50 hover:bg-emerald-900/20'
            }`}
          >
            {member.expelled && (
               <div className="absolute top-0 right-0 py-1 px-3 bg-red-900/80 text-white text-xs font-bold rounded-bl-lg flex items-center gap-1">
                 <Skull className="w-3 h-3"/> Expulso
               </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-xs text-slate-500">{member.role}</p>
              </div>
              <div className={`p-2 rounded-full ${
                member.expelled ? 'bg-red-500/20 text-red-500' :
                member.riskLevel === 'red' ? 'bg-red-500/20 text-red-500' :
                member.riskLevel === 'yellow' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-emerald-500/20 text-emerald-500'
              }`}>
                {member.expelled ? <UserX className="w-5 h-5"/> : 
                 member.riskLevel === 'red' ? <ShieldAlert className="w-5 h-5"/> :
                 member.riskLevel === 'yellow' ? <AlertTriangle className="w-5 h-5"/> :
                 <div className="w-5 h-5 rounded-full border-2 border-emerald-500"/>}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Pontos Sprint</span>
                  <span className="font-medium text-slate-200">{member.sprintPoints} / 10</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${member.riskLevel === 'green' ? 'bg-emerald-500' : member.riskLevel === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((member.sprintPoints / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Pontos Globais</span>
                  <span className="font-medium text-slate-200">{member.globalPoints} / 17</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${member.globalPoints >= 17 ? 'bg-red-500' : member.globalPoints >= 12 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min((member.globalPoints / 17) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              {member.expelled && member.expulsionReason && (
                <div className="mt-3 text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-500/20">
                  <span className="font-semibold block mb-0.5">Motivo Expulsão:</span>
                  {member.expulsionReason}
                </div>
              )}
            </div>
          </Link>
        ))}
        {members.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Nenhum membro encontrado. Acesse o painel Admin para criar.
          </div>
        )}
      </div>
    </div>
  );
}
