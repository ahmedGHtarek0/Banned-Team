import React from 'react';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';
import { Bell, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { notifications, markNotificationAsRead, isAdmin } = useApp();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-64 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl w-96 border border-slate-200/50">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search bookings, rooms..." 
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && <span className="text-xs text-brand-600 font-medium">{unreadCount} new</span>}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-brand-50/30' : ''}`}
                        onClick={() => markNotificationAsRead(n.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            n.type === 'INFO' ? 'bg-blue-100 text-blue-600' : 
                            n.type === 'SUCCESS' ? 'bg-green-100 text-green-600' : 
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            < Bell size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="w-px h-6 bg-slate-200" />
        
        <button className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-xl transition-colors">
          <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center font-bold text-sm">
            {isAdmin ? 'AD' : 'US'}
          </div>
          <User size={18} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
