
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  LogIn, 
  LayoutTemplate, 
  Grid, 
  FileText, 
  Globe, 
  Copy, 
  Trash2, 
  FileSpreadsheet, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ChevronRight,
  Rocket,
  Image as ImageIconIcon // Renamed to avoid name clash if needed, but let's keep it simple
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Module {
  id: string;
  name: string;
  isDefault?: boolean;
  icon?: string;
  blueprint?: string;
}

interface AppModuleConfigProps {
  onBack: () => void;
  onFinish: () => void;
}

const AppModuleConfig: React.FC<AppModuleConfigProps> = ({ 
  onBack, 
  onFinish 
}) => {
  const [modules, setModules] = useState<Module[]>([
    { id: 'mod-login', name: 'Login', isDefault: true, icon: 'LogIn', blueprint: '' }
  ]);
  const [activeModuleId, setActiveModuleId] = useState('mod-login');
  
  const activeModule = modules.find(m => m.id === activeModuleId);

  const [formName, setFormName] = useState(activeModule?.name || '');
  const [formIcon, setFormIcon] = useState(activeModule?.icon || 'LayoutTemplate');
  const [formBlueprint, setFormBlueprint] = useState(activeModule?.blueprint || '');

  // Update form when active module changes
  const handleSelectModule = (mod: Module) => {
    setActiveModuleId(mod.id);
    setFormName(mod.name);
    setFormIcon(mod.icon || 'LayoutTemplate');
    setFormBlueprint(mod.blueprint || '');
  };

  const iconMap: Record<string, any> = {
    LogIn,
    LayoutTemplate,
    Grid,
    FileText,
    Globe
  };

  const handleSaveModule = () => {
    if (formName.trim()) {
      setModules(prev => prev.map(m => 
        m.id === activeModuleId 
          ? { ...m, name: formName, icon: formIcon, blueprint: formBlueprint } 
          : m
      ));
    }
  };

  const handleAddModule = () => {
    const newModId = `mod-${Date.now()}`;
    const newMod: Module = { 
      id: newModId, 
      name: `New Module ${modules.length + 1}`,
      icon: 'LayoutTemplate',
      blueprint: ''
    };
    setModules([...modules, newMod]);
    handleSelectModule(newMod);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden h-full">
      <header className="h-16 border-b border-gray-100 px-8 flex items-center justify-between shrink-0 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Module Configuration</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Architectural Components</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
            {modules.map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center text-[10px] font-bold text-sky-800">
                {i + 1}
              </div>
            ))}
          </div>
          <button 
            onClick={onFinish}
            className="px-6 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"
          >
            Finish Setup <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Modules List */}
        <aside className="w-80 bg-gray-50/50 border-r border-gray-100 flex flex-col p-8 shrink-0">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">App Modules</h3>
            <button 
              onClick={handleAddModule}
              className="p-2 bg-sky-100 text-sky-800 rounded-xl hover:bg-sky-200 transition-all shadow-sm"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {modules.map(mod => (
              <button 
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group border ${
                  activeModuleId === mod.id 
                    ? 'bg-white shadow-xl border-sky-100 text-sky-800' 
                    : 'text-gray-500 hover:bg-white/60 hover:shadow-md border-transparent hover:border-gray-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-all ${
                  activeModuleId === mod.id 
                    ? 'bg-sky-800 text-white shadow-lg shadow-sky-100' 
                    : 'bg-gray-200 text-gray-400 group-hover:bg-gray-300'
                }`}>
                  {React.createElement(iconMap[mod.icon || 'LayoutTemplate'] || LayoutTemplate, { size: 18 })}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate">{mod.name}</p>
                  <p className={`text-[10px] font-medium ${activeModuleId === mod.id ? 'text-sky-600' : 'text-gray-400'}`}>
                    {mod.isDefault ? 'Core Module' : 'Custom Module'}
                  </p>
                </div>
                {activeModuleId === mod.id && <ChevronRight size={16} className="text-sky-300" />}
              </button>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-sky-800 to-indigo-950 rounded-[32px] text-white shadow-2xl shadow-sky-200/50 relative overflow-hidden group">
            <div className="relative z-10">
              <Sparkles size={24} className="mb-4 text-sky-300" />
              <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">AI Architect</h4>
              <p className="text-[10px] text-sky-100/70 leading-relaxed font-medium">Our AI can suggest optimized modules based on your application concept. Try our generator!</p>
              <button className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-bold transition-all backdrop-blur-md uppercase tracking-widest active:scale-95">
                Generate Suggestions
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
          </div>
        </aside>

        {/* Main Content - Module Config */}
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-white">
          <div className="max-w-3xl mx-auto space-y-10">
            <header className="flex items-center justify-between">
              <div>
                <nav className="flex items-center gap-2 text-[9px] font-black text-sky-800 uppercase tracking-widest mb-3">
                  <span className="opacity-40">App Studio</span>
                  <ChevronRight size={10} className="opacity-40" />
                  <span>Configure {activeModule?.name}</span>
                </nav>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Module Settings</h1>
                <p className="text-sm text-gray-500 mt-1 font-medium">Define the core identity and logic for this component.</p>
              </div>
              <div className="flex gap-3">
                <button className="p-3 text-gray-400 hover:text-sky-800 hover:bg-sky-50 rounded-2xl transition-all border border-transparent hover:border-sky-100">
                  <Copy size={20} />
                </button>
                <button 
                  onClick={() => {
                    if (modules.length > 1) {
                      const newMods = modules.filter(m => m.id !== activeModuleId);
                      setModules(newMods);
                      handleSelectModule(newMods[0]);
                    }
                  }}
                  className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </header>

            <div className="bg-[#F8FAFC] p-8 lg:p-10 rounded-[40px] border border-gray-100 shadow-xl space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2.5 block">
                    <span className="text-rose-500 mr-1">*</span> Module Identity
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. User Dashboard"
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-800 transition-all text-sm font-bold shadow-sm"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2.5 block">Visual Identifier</label>
                  <div className="flex gap-3">
                    {[
                      { icon: LogIn, name: 'LogIn' },
                      { icon: LayoutTemplate, name: 'LayoutTemplate' },
                      { icon: Grid, name: 'Grid' },
                      { icon: FileText, name: 'FileText' },
                      { icon: Globe, name: 'Globe' }
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        onClick={() => setFormIcon(item.name)}
                        className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                          formIcon === item.name 
                            ? 'bg-sky-50 border-sky-800 text-sky-800 shadow-lg shadow-sky-100' 
                            : 'bg-white border-gray-200 text-gray-400 hover:border-sky-800 hover:text-sky-800'
                        }`}
                      >
                        <item.icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Generation Blueprint (AI)</label>
                <textarea 
                  placeholder="Describe the specialized functionality for this module..."
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-800/20 transition-all text-sm h-32 resize-none font-medium shadow-sm"
                  value={formBlueprint}
                  onChange={(e) => setFormBlueprint(e.target.value)}
                />
              </div>

              <div className="py-6 border-2 border-dashed border-gray-200 rounded-[28px] flex flex-col items-center justify-center bg-white/60 group hover:border-sky-300 hover:bg-white transition-all cursor-pointer shadow-inner">
                <div className="w-12 h-12 bg-sky-50 text-sky-800 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-sky-100">
                  <FileSpreadsheet size={24} />
                </div>
                <h4 className="text-sm font-black text-gray-900 mb-1">Initialize with Data</h4>
                <p className="text-[10px] text-gray-400 mb-4 text-center max-w-xs px-6 font-medium leading-relaxed">Drop an Excel or CSV file to bootstrap your module structures and records automatically.</p>
                <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-700 hover:bg-gray-50 transition-all shadow-md hover:shadow-sky-100 active:scale-95 uppercase tracking-widest">
                  Choose Source
                </button>
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  onClick={handleSaveModule}
                  className="px-16 py-4 bg-sky-800 text-white rounded-2xl font-black shadow-2xl shadow-sky-200 hover:bg-sky-900 active:scale-95 transition-all flex items-center gap-3 text-sm uppercase tracking-widest"
                >
                  Save Module <CheckCircle2 size={20} />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pb-12">
              <div className="p-8 bg-sky-50/50 border border-sky-100 rounded-[40px] group hover:bg-white hover:shadow-2xl hover:shadow-sky-100 transition-all border-dashed">
                <div className="w-12 h-12 bg-sky-800 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-sky-200">
                  <Sparkles size={24} />
                </div>
                <h4 className="text-base font-black text-gray-900 mb-2">Smart Architecture</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Lumenore handles the heavy lifting by injecting enterprise-grade components based on your data patterns.</p>
              </div>
              <div className="p-8 bg-teal-50/50 border border-teal-100 rounded-[40px] group hover:bg-white hover:shadow-2xl hover:shadow-teal-100 transition-all border-dashed">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-teal-100">
                  <Zap size={24} />
                </div>
                <h4 className="text-base font-black text-gray-900 mb-2">Instant Integration</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Ready-to-use workflows and API connectors are automatically mapped to your new module structure.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppModuleConfig;
