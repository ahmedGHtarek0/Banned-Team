import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Input, Card } from '../components/ui';
import { BookOpen, Lock, User, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ROLES } from '../data/mockData';

const Signup = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: ROLES.EMPLOYEE
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    
    setTimeout(() => {
      const result = signup(formData);
      if (result.success) {
        setStatus('success');
      } else {
        setError(result.message);
        setStatus('idle');
      }
    }, 1000);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="p-12 text-center bg-slate-900/40 backdrop-blur-xl border-slate-800 shadow-2xl">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Request Sent!</h2>
            <p className="text-slate-400 mb-8">Your account request for <strong>{formData.name}</strong> has been sent to Akram for approval.</p>
            <Link to="/login">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-6">
          <Link to="/login" className="text-slate-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-2xl shadow-xl mb-4">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-slate-400 mt-2">Join the university room management system.</p>
        </div>

        <Card className="p-8 bg-slate-900/40 backdrop-blur-xl border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
              <Input 
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
                <Input 
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Role</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white outline-none focus:border-brand-500 transition-all font-medium"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value={ROLES.EMPLOYEE}>Employee</option>
                  <option value={ROLES.SECRETARY}>Secretary</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <Input 
                type="password"
                className="bg-slate-800/50 border-slate-700 text-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-medium">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full py-4 bg-brand-600 hover:bg-brand-500"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending Request...' : 'Sign Up'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
