import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogOut, LayoutDashboard, ClipboardList, Shield } from 'lucide-react';

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
      className={`flex flex-col items-center justify-center w-full h-full text-xs gap-1 ${
        location.pathname === path ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-500" />
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

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto h-full">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 md:hidden flex items-center justify-between px-2 pb-safe">
        {navLink('/', <LayoutDashboard className="w-5 h-5" />, 'Painel')}
        {user?.role === 'SM' && navLink('/daily', <ClipboardList className="w-5 h-5" />, 'Daily')}
        {user?.role === 'SM' && navLink('/admin', <Shield className="w-5 h-5" />, 'Admin')}
      </nav>

      {/* Desktop sidebar could go here, for now it's simple mobile-first nav on bottom */}
      <div className="hidden md:flex fixed top-14 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex-col p-4 gap-2">
         <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-md ${location.pathname==='/'?'bg-slate-800 text-indigo-400':'text-slate-300 hover:bg-slate-800/50'}`}>
          <LayoutDashboard className="w-4 h-4"/> Painel
         </Link>
         {user?.role === 'SM' && (
           <>
             <Link to="/daily" className={`flex items-center gap-3 px-3 py-2 rounded-md ${location.pathname==='/daily'?'bg-slate-800 text-indigo-400':'text-slate-300 hover:bg-slate-800/50'}`}>
              <ClipboardList className="w-4 h-4"/> Registrar Daily
             </Link>
             <Link to="/admin" className={`flex items-center gap-3 px-3 py-2 rounded-md ${location.pathname==='/admin'?'bg-slate-800 text-indigo-400':'text-slate-300 hover:bg-slate-800/50'}`}>
              <Shield className="w-4 h-4"/> Administração
             </Link>
           </>
         )}
      </div>
    </div>
  );
};
