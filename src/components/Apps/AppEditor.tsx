
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Box,
  ChevronDown,
  ChevronRight,
  Columns,
  Component,
  Copy,
  FileText,
  Folder,
  Grid,
  Image as ImageIcon,
  Layers,
  Layout,
  Lock,
  Maximize2,
  Monitor,
  MousePointer2,
  Navigation,
  Palette,
  Play,
  Plus,
  Rocket,
  Search,
  Settings2,
  Share2,
  Smartphone,
  Smile,
  Tablet,
  Trash2,
  Type,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import ActionDropdown from '../Common/ActionDropdown';

interface AppEditorProps {
  onBack: () => void;
}

const AppEditor: React.FC<AppEditorProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'components' | 'layers'>('components');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeRightTab, setActiveRightTab] = useState<'config' | 'style' | 'engine'>('config');

  const [modules, setModules] = useState([
    { 
      id: 'mod-1', 
      name: 'Login Module', 
      pages: [
        { id: 'page-1', name: 'Login Page' },
        { id: 'page-2', name: 'Signup Page' }
      ] 
    },
    { 
      id: 'mod-2', 
      name: 'Dashboard Module', 
      pages: [
        { id: 'page-3', name: 'Overview' },
        { id: 'page-4', name: 'Analytics' }
      ] 
    }
  ]);
  const [activeModuleId, setActiveModuleId] = useState('mod-1');
  const [activePageId, setActivePageId] = useState('page-1');

  const activeModule = modules.find(m => m.id === activeModuleId);
  const activePage = activeModule?.pages.find(p => p.id === activePageId);

  const handleCreateModule = () => {
    const newModId = `mod-${Date.now()}`;
    const newPageId = `page-${Date.now()}`;
    const newModule = {
      id: newModId,
      name: `New Module ${modules.length + 1}`,
      pages: [{ id: newPageId, name: 'Home' }]
    };
    setModules([...modules, newModule]);
    setActiveModuleId(newModId);
    setActivePageId(newPageId);
  };

  const handleCreatePage = (moduleId: string) => {
    const newPageId = `page-${Date.now()}`;
    const newPage = { id: newPageId, name: `New Page` };
    setModules(modules.map(m => m.id === moduleId ? { ...m, pages: [...m.pages, newPage] } : m));
    setActivePageId(newPageId);
  };

  const componentCategories = [
    {
      name: 'BASICS',
      items: [
        { icon: <Type size={18} />, label: 'Text' },
        { icon: <MousePointer2 size={18} />, label: 'Button' },
        { icon: <ImageIcon size={18} />, label: 'Image' },
        { icon: <Smile size={18} />, label: 'Icon' },
      ]
    },
    {
      name: 'LAYOUT',
      items: [
        { icon: <Box size={18} />, label: 'Container' },
        { icon: <Navigation size={18} />, label: 'Navbar' },
        { icon: <Grid size={18} />, label: 'Grid' },
        { icon: <Columns size={18} />, label: 'Tabs' },
        { icon: <ChevronDown size={18} />, label: 'Accordion' },
        { icon: <Maximize2 size={18} />, label: 'Splitter' },
        { icon: <Box size={18} />, label: 'Modal' },
        { icon: <Columns size={18} />, label: 'Stepped Form' },
      ]
    },
    {
      name: 'ADAPTIVE LAYOUT',
      items: [
        { icon: <Columns size={18} />, label: 'Layout (20/80)' },
        { icon: <Columns size={18} />, label: 'Layout (50/50)' },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#F1F5F9] overflow-hidden font-sans">
      {/* Top Header - Spans full width */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center pr-6 justify-between z-30 shadow-sm shrink-0">
        {/* Left Section - Hierarchy & Navigation (Aligned with Sidebar) */}
        <div className="flex items-center gap-2 w-64 shrink-0 overflow-hidden pl-6 pr-4 border-r border-gray-100 h-full">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-all group shrink-0"
            title="Back to Apps"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold text-gray-800">Apps</span>
          </button>
        </div>

        {/* Center-Left Section - Selectors starting after sidebar width */}
        <div className="flex-1 flex items-center gap-2 pl-4">

          <ActionDropdown
            itemHoverClass="hover:bg-mod-hero-badge-bg hover:text-mod-hero-icon-color"
            header={{
              title: 'Select Module',
              onAction: handleCreateModule
            }}
            trigger={(isOpen) => (
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-all group">
                <div className={`p-1.5 ${isOpen ? 'bg-sky-800 text-white' : 'bg-slate-50 text-sky-800'} border border-slate-100 rounded-md group-hover:bg-sky-800 group-hover:text-white transition-all`}>
                  <Folder size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Module</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800 leading-none">{activeModule?.name}</span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>
            )}
            items={modules.map(mod => ({
              label: mod.name,
              icon: <Folder size={14} />,
              active: activeModuleId === mod.id,
              onClick: () => {
                setActiveModuleId(mod.id);
                setActivePageId(mod.pages[0].id);
              }
            }))}
          />

          <ChevronRight size={14} className="text-gray-300 mx-0.5" />

          <ActionDropdown
            itemHoverClass="hover:bg-mod-hero-badge-bg hover:text-mod-hero-icon-color"
            header={{
              title: 'Module Pages',
              onAction: () => handleCreatePage(activeModuleId)
            }}
            trigger={(isOpen) => (
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-all group">
                <div className={`p-1.5 ${isOpen ? 'bg-sky-800 text-white' : 'bg-slate-50 text-sky-800'} border border-slate-100 rounded-md group-hover:bg-sky-800 group-hover:text-white transition-all`}>
                  <FileText size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Page</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800 leading-none">{activePage?.name}</span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>
            )}
            items={activeModule?.pages.map(page => ({
              label: page.name,
              icon: <FileText size={14} />,
              active: activePageId === page.id,
              onClick: () => setActivePageId(page.id)
            })) || []}
          />
        </div>

        {/* Center Section - Viewport Switcher */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-100 shadow-inner">
            <button 
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${viewport === 'desktop' ? 'bg-white text-sky-800 shadow-sm px-3' : 'text-gray-400 hover:text-gray-600 px-2'}`}
              title="Desktop View"
            >
              <Monitor size={14} />
            </button>
            <button 
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${viewport === 'tablet' ? 'bg-white text-sky-800 shadow-sm px-3' : 'text-gray-400 hover:text-gray-600 px-2'}`}
              title="Tablet View"
            >
              <Tablet size={14} />
            </button>
            <button 
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${viewport === 'mobile' ? 'bg-white text-sky-800 shadow-sm px-3' : 'text-gray-400 hover:text-gray-600 px-2'}`}
              title="Mobile View"
            >
              <Smartphone size={14} />
            </button>
          </div>
        </div>

        {/* Right Section - Global Actions */}
        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 mr-2">
            <button className="p-2 text-gray-600 hover:text-sky-800 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="Preview">
              <Play size={16} />
            </button>
            <button className="p-2 text-gray-600 hover:text-sky-800 hover:bg-white hover:shadow-sm rounded-lg transition-all" title="Share Project">
              <Share2 size={16} />
            </button>
          </div>
          <button className="px-5 py-2 bg-sky-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-700/10 hover:bg-sky-900 transition-all flex items-center gap-2 active:scale-95">
            <Rocket size={14} /> Deploy
          </button>
        </div>
      </header>

      {/* Main Workspace Section - Contains Sidebars and Canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Component Palette */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 shrink-0">
          <div className="flex p-1 bg-gray-100 m-3 rounded-lg">
            <button 
              onClick={() => setActiveTab('components')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === 'components' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Component size={14} /> Components
            </button>
            <button 
              onClick={() => setActiveTab('layers')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === 'layers' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Layers size={14} /> Layers
            </button>
          </div>

          <div className="px-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search components..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] outline-none focus:ring-1 focus:ring-sky-700 focus:border-sky-700 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-custom px-3 space-y-6 pb-6">
            {componentCategories.map((cat) => (
              <div key={cat.name}>
                <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">{cat.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {cat.items.map((item) => (
                    <button key={item.label} className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-lg hover:border-sky-800/40 hover:shadow-sm transition-all group">
                      <div className="text-gray-400 group-hover:text-sky-800 mb-2 transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-[9px] font-medium text-gray-600 group-hover:text-gray-900">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F8FAFC]">
          <div className="flex-1 overflow-auto p-12 flex justify-center">
            <div className={`bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] transition-all duration-500 border border-gray-100 relative rounded-2xl overflow-hidden ${
              viewport === 'desktop' ? 'w-full max-w-5xl' : 
              viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            } min-h-[800px]`}>
              {/* Canvas Content */}
              <div className="absolute inset-0 flex flex-col">
                 {/* Page Header Placeholder */}
                 <div className="h-16 border-b border-gray-50 flex items-center px-8 justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-sky-50 text-sky-800 rounded-lg flex items-center justify-center">
                        <Layout size={16} />
                      </div>
                      <span className="font-bold text-gray-800">{activePage?.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full" />
                      <div className="w-12 h-2 bg-gray-100 rounded-full" />
                    </div>
                 </div>

                 <div className="flex-1 flex items-center justify-center p-12">
                    <div className="w-full max-w-md space-y-6">
                      <div className="space-y-2">
                        <div className="h-4 w-1/3 bg-gray-100 rounded-lg" />
                        <div className="h-12 w-full border-2 border-dashed border-sky-100 rounded-xl flex items-center justify-center">
                          <span className="text-[10px] font-bold text-sky-800 uppercase tracking-widest">Drop Input Here</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-1/4 bg-gray-100 rounded-lg" />
                        <div className="h-12 w-full border-2 border-dashed border-sky-100 rounded-xl flex items-center justify-center">
                          <span className="text-[10px] font-bold text-sky-800 uppercase tracking-widest">Drop Input Here</span>
                        </div>
                      </div>
                      <div className="h-12 w-full bg-sky-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-sky-700/10">
                        <span className="font-bold text-sm">Action Button</span>
                      </div>
                    </div>
                 </div>
              </div>
              
              {/* Selection Overlay Placeholder */}
              <div className="absolute top-[30%] left-[10%] w-[80%] h-[120px] border-2 border-sky-700 pointer-events-none rounded-xl">
                 <div className="absolute -top-3 left-4 bg-sky-700 text-white text-[9px] px-2 py-0.5 font-bold rounded shadow-sm">Active_Section</div>
                 <div className="absolute -right-2 -top-2 w-4 h-4 bg-white border-2 border-sky-700 rounded-full shadow-sm" />
                 <div className="absolute -right-2 -bottom-2 w-4 h-4 bg-white border-2 border-sky-700 rounded-full shadow-sm" />
                 <div className="absolute -left-2 -top-2 w-4 h-4 bg-white border-2 border-sky-700 rounded-full shadow-sm" />
                 <div className="absolute -left-2 -bottom-2 w-4 h-4 bg-white border-2 border-sky-700 rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-64 bg-white border-l border-gray-200 flex flex-col z-20 shrink-0">
          <div className="p-4 border-b border-gray-100">
             <div className="flex items-center gap-2 text-[10px] font-bold text-sky-800 uppercase tracking-tight mb-2">
                <ChevronRight size={12} className="rotate-180" /> CONTAINER <ChevronRight size={12} /> ROOT
             </div>
             <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-gray-800">Main_Container</h2>
                <div className="flex gap-2">
                   <button className="text-gray-400 hover:text-gray-600"><Copy size={14} /></button>
                   <button className="text-gray-400 hover:text-rose-500"><Trash2 size={14} /></button>
                </div>
             </div>
          </div>

          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveRightTab('config')}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all border-b-2 ${activeRightTab === 'config' ? 'border-sky-800 text-sky-800' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <Zap size={14} />
              <span className="text-[9px] font-bold uppercase">Config</span>
            </button>
            <button 
              onClick={() => setActiveRightTab('style')}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all border-b-2 ${activeRightTab === 'style' ? 'border-sky-800 text-sky-800' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <Palette size={14} />
              <span className="text-[9px] font-bold uppercase">Style</span>
            </button>
            <button 
              onClick={() => setActiveRightTab('engine')}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all border-b-2 ${activeRightTab === 'engine' ? 'border-sky-800 text-sky-800' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <Settings2 size={14} />
              <span className="text-[9px] font-bold uppercase">Engine</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-6">
            <section>
              <h3 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-4">GENERAL & LOGIC</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase">Element ID</label>
                    <Lock size={10} className="text-gray-300" />
                  </div>
                  <input 
                    type="text" 
                    value="Main_Container"
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-500 outline-none italic"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1.5">Default Value</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 0 or 'Untitled'"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[11px] outline-none focus:ring-1 focus:ring-sky-700 transition-all"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-4">INTERACTIONS</h3>
              <button className="w-full aspect-video border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-sky-700 hover:bg-sky-50 transition-all group">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <Zap size={16} />
                </div>
                <span className="text-[9px] font-bold text-gray-400 group-hover:text-sky-800 uppercase tracking-widest">Add Action Workflow</span>
              </button>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AppEditor;
