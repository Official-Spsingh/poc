import { ArrowLeft, Camera, Check, Eye, EyeOff, Info, Lock, Mail, Save, Sparkles, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useCallback } from 'react';
import StudioPageWrapper, { StudioMain } from '../Common/StudioPageWrapper';
import StudioHeader from '../Common/StudioHeader';

const CheckItem = ({ label, met, isInverse = false }: { label: string, met: boolean, isInverse?: boolean }) => {
    const isSuccess = met; 
    return (
        <div className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-mod-surface-divider text-mod-surface-text-muted'}`}>
                {isSuccess ? <Check size={12} strokeWidth={4} /> : (isInverse && !met ? <X size={12} strokeWidth={4} className="text-rose-500" /> : <div className="w-1 h-1 rounded-full bg-current" />)}
            </div>
            <span className={`text-[11px] font-semibold transition-colors ${isSuccess ? 'text-mod-surface-text-primary' : 'text-mod-surface-text-muted opacity-75'}`}>
                {label}
            </span>
        </div>
    );
};

interface ProfileProps {
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const [fullName, setFullName] = useState('Shubham Pratap SIngh');
  const [email] = useState('spsingh@lumenore.com');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  
  // Password State
  const [passwords, setPasswords] = useState({
    existing: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    existing: false,
    new: false,
    confirm: false
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Validation Rules
  const validation = {
    minLength: passwords.new.length >= 15,
    hasLowercase: /[a-z]/.test(passwords.new),
    hasUppercase: /[A-Z]/.test(passwords.new),
    hasDigit: /[0-9]/.test(passwords.new),
    hasSpecial: /[!@#$%&*()_+{}[\]:;,.?~]/.test(passwords.new),
    noForbidden: !/['"`\/|^\-=> <]/.test(passwords.new)
  };

  const isPasswordSectionTouched = passwords.existing || passwords.new || passwords.confirm;
  const isPasswordValid = Object.values(validation).every(Boolean);
  const isConfirmValid = passwords.new === passwords.confirm;
  
  const canSave = !isUpdating && 
    fullName.trim().length > 0 &&
    (!isPasswordSectionTouched || (passwords.existing && isPasswordValid && isConfirmValid));

  const handleUpdate = async () => {
    if (!canSave) return;
    
    setIsUpdating(true);
    setUpdateStatus('idle');

    // API Placeholder
    try {
      console.log('Updating profile...', {
        fullName,
        profilePic,
        passwords: isPasswordSectionTouched ? {
          existing: passwords.existing,
          new: passwords.new
        } : undefined
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUpdateStatus('success');
      // Reset passwords after success
      setPasswords({ existing: '', new: '', confirm: '' });
      
      setTimeout(() => setUpdateStatus('idle'), 3000);
    } catch (error) {
      setUpdateStatus('error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <StudioPageWrapper>
      <StudioHeader 
        icon={User}
        title="My Profile"
        subtitle="Manage your personal information and account security"
        buttons={[
          {
            label: "Back",
            icon: ArrowLeft,
            onClick: onBack,
            variant: 'secondary'
          },
          {
            label: isUpdating ? "Updating..." : (updateStatus === 'success' ? "Saved" : "Update Changes"),
            icon: isUpdating ? undefined : (updateStatus === 'success' ? Check : Save),
            onClick: handleUpdate,
            variant: 'primary'
          }
        ]}
      />

      <StudioMain>
        <div className="max-w-4xl mx-auto space-y-6 pb-6">
          
          {/* Avatar & Profile Card */}
          <section className="bg-mod-surface-card p-6 md:p-8 rounded-[24px] border border-mod-card-border shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group/profile">
             {/* Decorative Background Glows */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-mod-page-blur-1 blur-[60px] opacity-20 pointer-events-none transition-opacity" />

             <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-mod-hero-gradient-from to-mod-hero-gradient-to p-0.5 shadow-xl relative">
                    <div className="w-full h-full rounded-full bg-mod-surface-card overflow-hidden flex items-center justify-center border-2 border-mod-surface-card transition-all duration-500">
                        {profilePic ? (
                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-black text-mod-hero-icon-color opacity-20">
                                {fullName.charAt(0)}
                            </span>
                        )}
                    </div>
                    {/* Upload Overlay */}
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity z-10 group/upload">
                        <div className="bg-mod-hero-btn-bg p-2.5 rounded-full text-white shadow-lg scale-75 group-hover/upload:scale-100 transition-all duration-300">
                            <Camera size={18} />
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-2 border-mod-surface-card rounded-full flex items-center justify-center text-white shadow-md">
                    <Check size={14} strokeWidth={4} />
                </div>
             </div>

             <div className="flex-1 text-center md:text-left space-y-1">
                <div className="space-y-0.5">
                    <h2 className="text-xl md:text-2xl font-black text-mod-surface-text-primary tracking-tight">{fullName}</h2>
                    <p className="text-xs text-mod-surface-text-secondary font-medium flex items-center justify-center md:justify-start gap-2 opacity-80">
                        <Mail size={14} className="text-mod-hero-icon-color" /> {email}
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-mod-hero-badge-bg text-mod-hero-badge-text text-[9px] font-black uppercase tracking-widest border border-mod-hero-badge-bg/30">
                    <Sparkles size={12} /> Lumenore Pro Member
                </div>
             </div>
          </section>

          {/* Details & Password Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* General Info */}
            <div className="bg-mod-surface-card p-6 rounded-[24px] border border-mod-card-border shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-mod-surface-divider">
                    <div className="w-10 h-10 rounded-xl bg-mod-header-icon-bg text-mod-header-icon-text flex items-center justify-center border border-mod-header-icon-border">
                        <User size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-mod-surface-text-primary">Personal Details</h3>
                        <p className="text-[11px] text-mod-surface-text-secondary">Update your contact profile information.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group/input">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mod-surface-text-muted group-focus-within/input:text-mod-hero-icon-color transition-colors">
                                <User size={16} />
                            </div>
                            <input 
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-mod-surface-input-bg border border-mod-surface-input-border rounded-xl text-mod-surface-text-primary text-sm font-semibold outline-none focus:border-mod-hero-icon-color transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Email (Read Only) */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest ml-1 flex justify-between">
                            Email Address
                            <span className="text-[9px] text-amber-500 lowercase normal-case italic opacity-80 flex items-center gap-1 bg-amber-500/5 px-1.5 py-0.5 rounded">
                               locked
                            </span>
                        </label>
                        <div className="relative opacity-60">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mod-surface-text-muted">
                                <Mail size={16} />
                            </div>
                            <input 
                                type="email"
                                value={email}
                                readOnly
                                className="w-full pl-10 pr-4 py-2.5 bg-mod-surface-divider border border-mod-surface-divider rounded-xl text-mod-surface-text-muted text-sm font-semibold cursor-not-allowed italic"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Section */}
            <div className="bg-mod-surface-card p-6 rounded-[24px] border border-mod-card-border shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-mod-surface-divider">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                        <Lock size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-mod-surface-text-primary">Security & Password</h3>
                        <p className="text-[11px] text-mod-surface-text-secondary">Keep your account safe with a strong password.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest ml-1">Existing Password</label>
                        <div className="relative group/input">
                            <input 
                                type={showPasswords.existing ? 'text' : 'password'}
                                value={passwords.existing}
                                onChange={(e) => setPasswords({...passwords, existing: e.target.value})}
                                placeholder="••••••••"
                                className={`w-full px-4 py-2.5 bg-mod-surface-input-bg border rounded-xl text-mod-surface-text-primary text-sm font-semibold outline-none transition-all ${isPasswordSectionTouched && !passwords.existing ? 'border-rose-400' : 'border-mod-surface-input-border focus:border-mod-hero-icon-color shadow-sm'}`}
                            />
                            <button onClick={() => setShowPasswords({...showPasswords, existing: !showPasswords.existing})} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-colors">
                                {showPasswords.existing ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest ml-1">New Password</label>
                        <div className="relative group/input">
                            <input 
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                placeholder="••••••••"
                                className={`w-full px-4 py-2.5 bg-mod-surface-input-bg border rounded-xl text-mod-surface-text-primary text-sm font-semibold outline-none transition-all ${passwords.new && !isPasswordValid ? 'border-amber-400' : (passwords.new && isPasswordValid ? 'border-emerald-400' : 'border-mod-surface-input-border focus:border-mod-hero-icon-color shadow-sm')}`}
                            />
                            <button onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-colors">
                                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest ml-1">Confirm New</label>
                        <div className="relative group/input">
                            <input 
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                placeholder="••••••••"
                                className={`w-full px-4 py-2.5 bg-mod-surface-input-bg border rounded-xl text-mod-surface-text-primary text-sm font-semibold outline-none transition-all ${passwords.confirm && !isConfirmValid ? 'border-rose-400' : (passwords.confirm && isConfirmValid ? 'border-emerald-400' : 'border-mod-surface-input-border focus:border-mod-hero-icon-color shadow-sm')}`}
                            />
                            <button onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-colors">
                                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Validation Checklist */}
                <div className="bg-mod-surface-bg/50 rounded-2xl p-6 border border-mod-card-border overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                        <Info size={14} className="text-mod-hero-icon-color" />
                        <p className="text-[10px] font-black text-mod-surface-text-primary uppercase tracking-widest">Security Checklist</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                        <CheckItem label="Min. 15 characters" met={validation.minLength} />
                        <CheckItem label="Lowercase letter" met={validation.hasLowercase} />
                        <CheckItem label="Uppercase letter" met={validation.hasUppercase} />
                        <CheckItem label="Numerical digit" met={validation.hasDigit} />
                        <CheckItem label="Special character" met={validation.hasSpecial} />
                        <CheckItem label={'No forbidden chars'} met={validation.noForbidden} isInverse />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </StudioMain>

      {/* Floating Notifications */}
      <AnimatePresence>
          {updateStatus === 'success' && (
              <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-2xl"
              >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Check size={12} strokeWidth={4} />
                  </div>
                  Profile Updated Successfully
              </motion.div>
          )}
      </AnimatePresence>
    </StudioPageWrapper>
  );
};

export default Profile;


