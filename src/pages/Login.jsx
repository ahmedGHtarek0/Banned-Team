import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Input, Card } from '../components/ui';
import { BookOpen, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-4 z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl shadow-2xl mb-4">
            < BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2 font-medium">Room Management & Booking System</p>
        </div>

        <Card className="p-8 bg-slate-900/40 backdrop-blur-xl border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-500 hover:text-brand-400 font-bold">
                Request Access
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-center text-slate-500 leading-relaxed uppercase tracking-widest font-bold">
              Test Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 text-center">
              <div className="p-2 bg-slate-800/30 rounded-lg border border-slate-800/50">
                <p className="text-[10px] text-slate-500 font-bold">ADMIN</p>
                <p className="text-xs text-slate-300">akram / 1234</p>
              </div>
              <div className="p-2 bg-slate-800/30 rounded-lg border border-slate-800/50">
                <p className="text-[10px] text-slate-500 font-bold">MANAGER</p>
                <p className="text-xs text-slate-300">faisel / 123</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
