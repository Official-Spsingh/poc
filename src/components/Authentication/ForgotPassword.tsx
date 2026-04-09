import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { makeRequest } from '../../utils/makeRequest';
import Logo from '../Common/Logo';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await makeRequest.post('https://rsh.lumenore.com/appsapi/secure/password/studio/reset-link', {
        data: { userEmail: email }
      });

      if (data) {
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again later.');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F1F5F9] overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Left Side - Immersive Visual (Consistent with Login) */}
      <div className="hidden lg:flex flex-[1.2] relative overflow-hidden bg-white border-r border-slate-100">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-400/10 blur-[100px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-teal-400/10 blur-[100px] rounded-full" 
          />
        </div>

        <div className="absolute inset-0 opacity-[0.5]" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #f8fafc 1px, transparent 1px), linear-gradient(to bottom, #f8fafc 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} />
        
        <div className="relative z-10 flex flex-col h-full p-8 xl:p-16 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8 xl:mb-12 shrink-0 justify-center lg:justify-start"
          >
            <div className="w-9 h-9 xl:w-10 xl:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Logo size={20} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl xl:text-2xl font-black tracking-tighter text-slate-900 uppercase">LUMENORE</span>
              <span className="text-xl xl:text-2xl font-medium tracking-tighter text-blue-600 lowercase italic opacity-80">studio</span>
            </div>
          </motion.div>

          <div className="max-w-2xl mx-auto lg:mx-0 relative flex-1 flex flex-col justify-center py-4 xl:py-8 lg:pb-12 min-h-0 overflow-hidden w-full px-8 lg:px-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100 mx-auto lg:mx-0">
                <Sparkles size={12} className="animate-pulse" />
                Security & Access Control
              </div>
              
              <h1 className="text-5xl xl:text-7xl font-black leading-[1] text-slate-900 tracking-tighter mb-6 xl:mb-8">
                Reset <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-600 to-teal-600 pr-1">
                  Password.
                </span>
              </h1>

              <p className="text-lg xl:text-xl text-slate-500 leading-relaxed max-w-lg font-medium mx-auto lg:mx-0">
                Don't worry, it happens to the best of us. Let's get you back into your studio workspace safely and securely.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white relative overflow-y-auto lg:overflow-hidden scrollbar-none">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-sm w-full flex flex-col px-6 py-6 lg:py-12"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Logo size={18} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">LUMENORE</span>
              <span className="text-lg font-medium tracking-tighter text-blue-600 lowercase italic opacity-80">studio</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 w-full"
              >
                <div className="space-y-2">
                  <button 
                    onClick={onBackToLogin}
                    className="flex items-center gap-2 px-0 py-1 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest mb-4"
                  >
                    <ArrowLeft size={14} /> Back to Login
                  </button>
                  <h2 className="text-2xl xl:text-4xl font-black text-slate-900 tracking-tight">
                    Forgot Password
                  </h2>
                  <p className="text-slate-500 text-xs xl:text-sm font-medium">
                    Enter the email associated with your account and we'll send a reset link.
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[11px] font-bold flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-6 py-4"
              >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[24px] flex items-center justify-center shadow-sm border border-emerald-100">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Check your email</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    The reset link has been sent to mail.<br />
                    Please follow the instructions in the email to recover your account.
                  </p>
                </div>
                <button
                  onClick={onBackToLogin}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-auto lg:mt-0 lg:absolute lg:bottom-8 py-8 flex flex-row items-center justify-center gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4 w-full">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Help</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
