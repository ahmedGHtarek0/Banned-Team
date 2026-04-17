import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  Settings, 
  LogOut, 
  ChevronRight,
  Sun,
  Moon,
  Building2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
  const { user, logout, isAdmin, isBranchManager, darkMode, toggleDarkMode } = useApp();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', show: true },
    { name: 'Calendar', icon: Calendar, path: '/calendar', show: true },
    { name: 'My Bookings', icon: ClipboardList, path: '/bookings', show: true },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/settings',
      show: isAdmin || isBranchManager
    },
  ];

  return (
    <aside className="w-64 glass-card h-[calc(100vh-2rem)] m-4 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-8 flex items-center gap-3 group">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 group-hover:rotate-12 transition-transform duration-500">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)] leading-none tracking-tighter uppercase">Uni<span className="text-blue-600">Reserve</span></h1>
          <p className="text-[10px] text-[var(--text-secondary)] font-black tracking-widest mt-1 uppercase">Institutional OS</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.filter(item => item.show).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] hover:text-[var(--text-primary)]'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={isActive ? 'animate-pulse' : ''} />
                <span className="text-sm font-black uppercase tracking-wider">{item.name}</span>
                <ChevronRight size={14} className={`ml-auto opacity-0 group-hover:opacity-40 transition-opacity`} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-[var(--border-subtle)] space-y-6">
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-500 hover:shadow-inner border border-transparent hover:border-[var(--border-subtle)]"
        >
          <div className="flex items-center gap-3">
             {darkMode ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-500" />}
             <span className="text-[10px] font-black uppercase tracking-widest">{darkMode ? 'Night' : 'Day'}</span>
          </div>
          <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-500 ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
             <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-500 transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </button>

        <div className="flex items-center gap-4 px-2">
          {user && <img src={user.avatar} alt="" className="w-10 h-10 rounded-xl border-2 border-[var(--bg-primary)] shadow-md" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-[var(--text-primary)] truncate">{user?.name || 'Guest'}</p>
            <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{user?.role?.replace('_', ' ') || 'Visitor'}</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-rose-500 font-black uppercase tracking-widest text-xs hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={18} />
          <span>Exit System</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
