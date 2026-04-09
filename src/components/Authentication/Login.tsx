
import { ArrowLeft, ArrowRight, Building, Eye, EyeOff, Github, Layout, Mail, Sparkles, Workflow } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { makeRequest } from '../../utils/makeRequest';
import { studioThemeColors } from '../../constants/themeColors';
import Logo from '../Common/Logo';

interface LoginProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('aahmed@lumenore.com');
  const [password, setPassword] = useState('Arham@99811');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Organization selection state
  const [step, setStep] = useState<'credentials' | 'organization'>('credentials');
  const [organizations, setOrganizations] = useState<{ id: string, name: string }[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await makeRequest.post('/secure/login-build', { email, password });

      if (data && data.tenant) {
        // Formats the tenant object into an array for selection
        const orgsList = Object.entries(data.tenant).map(([id, name]) => ({
          id,
          name: typeof name === 'string' ? name : 'Unknown Organization'
        }));
        
        setOrganizations(orgsList);
        setStep('organization');
      } else {
        setError(data.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await makeRequest.post('/secure/login-build', { 
        email, 
        password, 
        tenantUuid: selectedOrgId 
      });

      if (data && data.token) {
        // Store token in sessionStorage
        sessionStorage.setItem('access_token', data.token);
        onLogin(); // Proceed into the app
      } else {
        setError(data.message || 'Failed to obtain access token.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Org selection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex h-screen w-full ${studioThemeColors.global.auth.bg} overflow-hidden font-sans ${studioThemeColors.global.auth.selection}`}>
      {/* Left Side - Immersive Visual */}
      <div className={`hidden lg:flex flex-[1.2] relative overflow-hidden ${studioThemeColors.global.auth.cardBg} border-r border-slate-100`}>
        {/* Background Mesh Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className={`absolute -top-[10%] -left-[10%] w-[60%] h-[60%] ${studioThemeColors.global.auth.glow} blur-[100px] rounded-full`} 
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

        {/* Sophisticated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.5]" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #f8fafc 1px, transparent 1px), linear-gradient(to bottom, #f8fafc 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} />

        <div className="relative z-10 flex flex-col h-full p-8 xl:p-16">
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8 xl:mb-12 shrink-0"
          >
            <div className={`w-9 h-9 xl:w-10 xl:h-10 ${studioThemeColors.global.brand.logoBg} rounded-xl flex items-center justify-center text-white shadow-xl ${studioThemeColors.global.auth.shadow}`}>
              <Logo size={20} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl xl:text-2xl font-black tracking-tighter ${studioThemeColors.global.brand.logoText} uppercase`}>LUMENORE</span>
              <span className={`text-xl xl:text-2xl font-medium tracking-tighter ${studioThemeColors.global.brand.logoSecondary} lowercase italic opacity-80`}>studio</span>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto relative flex-1 flex flex-col justify-center py-4 xl:py-8 lg:pb-12 min-h-0 overflow-hidden w-full px-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${studioThemeColors.global.auth.badgeBg} ${studioThemeColors.global.auth.badgeText} text-[10px] font-bold uppercase tracking-widest mb-6 border ${studioThemeColors.global.auth.badgeBorder}`}>
                <Sparkles size={12} className="animate-pulse" />
                Low-Code & AI-Driven Platform
              </div>
              
              <h1 className={`text-5xl xl:text-7xl font-black leading-[1] ${studioThemeColors.global.auth.textPrimary} tracking-tighter mb-6 xl:mb-8`}>
                Future, <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${studioThemeColors.global.auth.accentGradient} pr-1`}>
                  Assembled.
                </span>
              </h1>

              <p className={`text-lg xl:text-xl ${studioThemeColors.global.auth.textSecondary} leading-relaxed mb-8 xl:mb-12 max-w-lg font-medium`}>
                From brainstorming a revolutionary idea to launching your next game-changing app, automated workflow, or AI agent - our platform empowers you to turn your vision into reality.
              </p>
            </motion.div>

            {/* Visual Abstract: Floating Cards */}
            <div className="flex justify-center items-start gap-4 xl:gap-6 mt-6 xl:mt-10 w-full max-w-2xl mx-auto h-40 xl:h-56">
              {/* Card 1: Apps */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="flex-1 max-w-[176px] p-3 xl:p-4 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50"
              >
                <div className="flex items-center gap-2 xl:gap-3 mb-3">
                  <div className="w-7 h-7 xl:w-8 xl:h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                    <Layout size={16} />
                  </div>
                  <div className="h-1.5 xl:h-2 flex-1 bg-slate-100 rounded-full" />
                </div>
                {/* Apps Animation: Staggered Grid */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="h-5 xl:h-6 bg-indigo-50 rounded border border-indigo-100"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Card 2: Workflows */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="flex-1 max-w-[176px] mt-8 xl:mt-12 p-3 xl:p-4 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50"
              >
                <div className="flex items-center gap-2 xl:gap-3 mb-3">
                  <div className={`w-7 h-7 xl:w-8 xl:h-8 ${studioThemeColors.global.auth.activeIconBg} rounded-lg flex items-center justify-center ${studioThemeColors.global.auth.activeIcon} shrink-0`}>
                    <Workflow size={16} />
                  </div>
                  <div className="h-1.5 xl:h-2 w-10 xl:w-14 bg-slate-100 rounded-full" />
                </div>
                {/* Workflows Animation: Sliding Progress Node */}
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className={`h-full w-1/2 ${studioThemeColors.global.auth.primaryBtn} rounded-full`} 
                    />
                  </div>
                  <div className="h-1.5 w-2/3 bg-slate-50 rounded-full" />
                </div>
              </motion.div>

              {/* Card 3: Agents */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="flex-1 max-w-[176px] mt-4 xl:mt-6 p-3 xl:p-4 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50"
              >
                <div className="flex items-center gap-2 xl:gap-3 mb-3">
                  <div className="w-7 h-7 xl:w-8 xl:h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div className="h-1.5 xl:h-2 flex-1 bg-slate-100 rounded-full" />
                </div>
                {/* Agents Animation: AI Processing Indicator */}
                <div className="flex gap-1.5">
                  <div className="h-5 xl:h-6 w-full bg-slate-50 rounded-md border border-slate-100 overflow-hidden relative">
                     <motion.div
                       animate={{ x: ['-100%', '200%'] }}
                       transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                       className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-teal-100 to-transparent opacity-50"
                     />
                  </div>
                  <div className="h-5 xl:h-6 w-8 xl:w-10 shrink-0 bg-teal-600/10 rounded-md border border-teal-600/20 flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-teal-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="mt-auto flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dev Speed</span>
                <span className={`text-xl font-bold ${studioThemeColors.global.auth.accentText}`}>10x Faster</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time to Market</span>
                <span className="text-xl font-bold text-teal-600">-80%</span>
              </div>
            </div>
            
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hidden xl:block">Lumenore Studio AI Engine</div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className={`flex-1 flex flex-col items-center justify-center lg:justify-center ${studioThemeColors.global.auth.cardBg} relative overflow-y-auto lg:overflow-hidden scrollbar-none`}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-sm w-full flex flex-col px-6 py-6 lg:py-12"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6 xl:mb-12 shrink-0">
            <div className={`w-8 h-8 ${studioThemeColors.global.brand.logoBg} rounded-lg flex items-center justify-center text-white shadow-xl ${studioThemeColors.global.auth.shadow}`}>
              <Logo size={18} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-black tracking-tighter ${studioThemeColors.global.brand.logoText} uppercase`}>LUMENORE</span>
              <span className={`text-lg font-medium tracking-tighter ${studioThemeColors.global.brand.logoSecondary} lowercase italic opacity-80`}>studio</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'credentials' ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4 sm:gap-8 w-full"
              >
                <div className="space-y-1 xl:space-y-2 mb-2 lg:mb-0">
                  <h2 className="text-xl sm:text-2xl xl:text-4xl font-black text-slate-900 tracking-tight">
                    {isLogin ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-slate-500 text-[10px] sm:text-xs xl:text-sm font-medium">
                    {isLogin ? 'Enter your credentials to access your studio' : 'Start your 14-day free trial today'}
                  </p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 ${studioThemeColors.global.auth.errorBg} border border-rose-100 rounded-xl ${studioThemeColors.global.auth.errorText} text-[11px] font-bold flex items-center gap-2`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 xl:space-y-5">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 ${studioThemeColors.global.auth.inputBg} border ${studioThemeColors.global.auth.inputBorder} rounded-xl ${studioThemeColors.global.auth.textPrimary} placeholder:text-slate-400 outline-none focus:ring-2 ${studioThemeColors.global.auth.focusRing} transition-all`}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={`w-full px-4 py-3 ${studioThemeColors.global.auth.inputBg} border ${studioThemeColors.global.auth.inputBorder} rounded-xl ${studioThemeColors.global.auth.textPrimary} placeholder:text-slate-400 outline-none focus:ring-2 ${studioThemeColors.global.auth.focusRing} transition-all`}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                      {isLogin && (
                        <button 
                          type="button" 
                          onClick={onForgotPassword}
                          className={`text-[10px] font-bold ${studioThemeColors.global.auth.link} ${studioThemeColors.global.auth.linkHover} uppercase tracking-widest`}
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-4 py-2.5 xl:py-3 ${studioThemeColors.global.auth.inputBg} border ${studioThemeColors.global.auth.inputBorder} rounded-xl ${studioThemeColors.global.auth.textPrimary} placeholder:text-slate-400 outline-none focus:ring-2 ${studioThemeColors.global.auth.focusRing} transition-all text-sm`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 xl:py-4 ${studioThemeColors.global.auth.primaryBtn} text-white rounded-xl font-bold ${studioThemeColors.global.auth.primaryBtnHover} transition-all ${studioThemeColors.global.auth.shadow} flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Studio'}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="relative my-2 xl:my-0">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                    <span className="bg-white px-4 text-slate-400 font-bold">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 xl:gap-4">
                  <button className="flex items-center justify-center gap-2 xl:gap-3 py-2.5 xl:py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium">
                    <Github size={18} /> <span className="hidden sm:inline">GitHub</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 xl:gap-3 py-2.5 xl:py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium">
                    <Mail size={18} /> <span className="hidden sm:inline">Google</span>
                  </button>
                </div>

                <p className="text-center text-[11px] xl:text-sm text-slate-500 mt-2 xl:mt-0">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className={`${studioThemeColors.global.auth.link} font-bold ${studioThemeColors.global.auth.linkHover} transition-colors`}
                  >
                    {isLogin ? 'Sign up for free' : 'Log in here'}
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="organization"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-4 sm:gap-8 w-full"
              >
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => {
                      setStep('credentials');
                      setSelectedOrgId(null);
                    }}
                    className="self-start text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                      Select Organization
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Choose which studio workspace you'd like to sign into
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
                </div>

                <form onSubmit={handleOrgSubmit} className="space-y-6">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {organizations.map((org) => (
                      <div
                        key={org.id}
                        onClick={() => setSelectedOrgId(org.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4
                          ${selectedOrgId === org.id 
                            ? `${studioThemeColors.global.auth.activeBorder} ${studioThemeColors.global.auth.activeBg} shadow-sm ${studioThemeColors.global.auth.shadow}` 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                          ${selectedOrgId === org.id ? `${studioThemeColors.global.auth.activeIconBg} ${studioThemeColors.global.auth.activeIcon}` : 'bg-slate-100 text-slate-500'}`}
                        >
                          <Building size={20} />
                        </div>
                        <div className="flex-1 font-semibold text-slate-900">
                          {org.name}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                          ${selectedOrgId === org.id ? studioThemeColors.global.auth.activeBorder : 'border-slate-300'}`}
                        >
                          {selectedOrgId === org.id && (
                            <div className={`w-2.5 h-2.5 ${studioThemeColors.global.auth.primaryBtn} rounded-full`} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !selectedOrgId}
                    className={`w-full py-4 ${studioThemeColors.global.auth.primaryBtn} text-white rounded-xl font-bold ${studioThemeColors.global.auth.primaryBtnHover} transition-all ${studioThemeColors.global.auth.shadow} flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Continue to Studio
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Links */}
        <div className="mt-auto lg:mt-0 lg:absolute lg:bottom-8 py-2 xl:py-8 flex flex-row items-center justify-center gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4 w-full">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Help</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
