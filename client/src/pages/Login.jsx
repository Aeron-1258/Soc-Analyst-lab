import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen w-screen bg-[#030303] text-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* 1. Subtle Radial Backlight for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* 2. Centered Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] bg-[#0A0A0D]/55 border border-white/[0.04] backdrop-blur-2xl rounded-[24px] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] z-10 relative"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4 shadow-sm">
            <ShieldCheck className="text-[#8B5CF6] w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#F8FAFC] font-display text-center">
            Welcome back
          </h1>
          <p className="text-xs text-[#64748B] text-center mt-1.5 max-w-[280px] leading-relaxed">
            Sign in to continue to Security Operations Center
          </p>
        </div>

        {/* Error Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              className="mb-5 p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex items-start gap-2.5 text-red-400 text-xs font-medium"
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span className="leading-normal">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-[#CBD5E1] ml-0.5">
              Email address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-[#64748B] pointer-events-none" size={15} />
              <input
                id="email"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#030303]/30 border border-white/5 hover:border-white/10 focus:border-[#8B5CF6] rounded-xl py-3 pl-10 pr-4 text-sm text-[#F8FAFC] placeholder:text-[#64748B]/35 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-[#CBD5E1] ml-0.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-[#64748B] pointer-events-none" size={15} />
              <input
                id="password"
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#030303]/30 border border-white/5 hover:border-white/10 focus:border-[#8B5CF6] rounded-xl py-3 pl-10 pr-4 text-sm text-[#F8FAFC] placeholder:text-[#64748B]/35 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ y: -0.5 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow-[0_4px_12px_rgba(139,92,246,0.15)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isSignup ? 'Create account' : 'Sign in'
              )}
            </motion.button>
          </div>
        </form>

        {/* Switch Login/Signup */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs text-[#64748B] hover:text-[#CBD5E1] transition-colors font-medium"
          >
            {isSignup ? 'Already have an account? Sign in' : 'Create an account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
