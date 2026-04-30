import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to ' + (isSignup ? 'sign up' : 'login') + '. Check your credentials.');
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full cyber-grid-bg opacity-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glass-panel border border-slate-700/50 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-neon-blue/20 rounded-2xl border border-neon-blue/50 mb-4 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
            <ShieldCheck className="text-neon-blue" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            SOC<span className="text-neon-blue">AI</span> COMMAND
          </h1>
          <p className="text-slate-400 mt-2">Secure Analyst Terminal Access</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-3 bg-neon-red/10 border border-neon-red/50 rounded-lg flex items-center gap-3 text-neon-red text-sm"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                required 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/30 transition-all"
                placeholder="analyst@agency.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Security Token (Password)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                required 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/30 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-neon-blue hover:bg-neon-blue/90 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck size={20} />
                {isSignup ? 'Initialize Account' : 'Establish Connection'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignup(!isSignup)}
            className="text-slate-400 text-sm hover:text-neon-blue transition-colors"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Request Access"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-center gap-4">
          <span className="text-[10px] text-slate-600 font-mono">SECURE ACCESS GATEWAY</span>
          <span className="text-[10px] text-slate-600 font-mono">•</span>
          <span className="text-[10px] text-slate-600 font-mono">ENCRYPTION: AES-256</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
