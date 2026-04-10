import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogOut, LayoutDashboard, ClipboardList, Shield, Star } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (path: string, icon: React.ReactNode, label: string) => (
    <Link
      to={path}
      title={label}
      className={`flex items-center justify-center p-3 rounded-xl transition-all ${
        location.pathname === path ? 'bg-slate-700/50 text-white scale-110' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      {icon}
    </Link>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-slate-200" />
          <h1 className="font-bold text-lg tracking-tight">Scrum Warden</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-slate-400 mt-1">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="w-full max-w-7xl mx-auto min-h-full p-4 pb-32 md:p-8 md:pb-12">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 h-14 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl md:hidden flex items-center justify-center gap-2 px-3 shadow-2xl z-50">
        {navLink('/', <LayoutDashboard className="w-5 h-5" />, 'Painel')}
        {navLink('/pacer', <Star className="w-5 h-5" />, 'PACER')}
        {user?.role === 'SM' && navLink('/daily', <ClipboardList className="w-5 h-5" />, 'Daily')}
        {user?.role === 'SM' && navLink('/admin', <Shield className="w-5 h-5" />, 'Admin')}
      </nav>

      {/* Desktop sidebar could go here, for now it's simple mobile-first nav on bottom */}
      <div className="hidden md:flex fixed top-14 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex-col p-4 gap-2">
         <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname==='/'?'bg-slate-100 text-slate-900 font-bold':'text-slate-300 hover:bg-slate-800/50'}`}>
          <LayoutDashboard className="w-4 h-4"/> Painel
         </Link>
         <Link to="/pacer" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname==='/pacer'?'bg-slate-100 text-slate-900 font-bold':'text-slate-300 hover:bg-slate-800/50'}`}>
          <Star className="w-4 h-4"/> PACER
         </Link>
         {user?.role === 'SM' && (
           <>
             <Link to="/daily" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname==='/daily'?'bg-slate-100 text-slate-900 font-bold':'text-slate-300 hover:bg-slate-800/50'}`}>
              <ClipboardList className="w-4 h-4"/> Registrar Daily
             </Link>
             <Link to="/admin" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname==='/admin'?'bg-slate-100 text-slate-900 font-bold':'text-slate-300 hover:bg-slate-800/50'}`}>
              <Shield className="w-4 h-4"/> Administração
             </Link>
           </>
         )}
      </div>
    </div>
  );
};
