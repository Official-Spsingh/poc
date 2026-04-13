
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Columns,
  Database,
  Edit2,
  Filter,
  Hash,
  MoreVertical,
  Plus,
  Search,
  Table as TableIcon,
  Trash2,
  Type
} from 'lucide-react';
import React, { useState } from 'react';


interface DataSectionProps {}

const DataSection: React.FC<DataSectionProps> = () => {
  // Theme is now driven by CSS variables via data-theme on the container div
  const [selectedTable, setSelectedTable] = useState('Test_table');
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['database', 'system', 'test-us-18411']);

  const toggleNode = (node: string) => {
    setExpandedNodes(prev => 
      prev.includes(node) ? prev.filter(n => n !== node) : [...prev, node]
    );
  };

  const columns = [
    { name: 'id', type: 'INTEGER', category: 'measure', icon: <Hash size={14} /> },
    { name: 'Name', type: 'STRING', category: 'dimension', icon: <Type size={14} /> },
    { name: 'OrderDate', type: 'DATE', category: 'dimension', icon: <Calendar size={14} /> },
    { name: 'Email', type: 'STRING', category: 'dimension', icon: <Type size={14} /> },
    { name: 'Product', type: 'STRING', category: 'dimension', icon: <Type size={14} /> },
    { name: 'Category', type: 'STRING', category: 'dimension', icon: <Type size={14} /> },
    { name: 'Price', type: 'NUMBER', category: 'measure', icon: <Hash size={14} /> },
    { name: 'Quantity', type: 'INTEGER', category: 'measure', icon: <Hash size={14} /> },
    { name: 'Total_price', type: 'NUMBER', category: 'measure', icon: <Hash size={14} /> },
  ];

  const data = [
    { id: 1, Name: 'testuser5', OrderDate: '2025-06-11', Email: 'testuser5@gmail.com', Product: 'Pen', Category: 'Stationary', Price: 10, Quantity: 500, Total_price: 5000, City: 'Indore', State: 'Madhya Pradesh', Approval: true },
    { id: 2, Name: 'Test3', OrderDate: '2025-06-01', Email: 'test3@testlume.com', Product: 'Headphone', Category: 'Electronics', Price: 2000, Quantity: 300, Total_price: 600000, City: 'Shajapur', State: 'Madhya Pradesh', Approval: false },
    { id: 3, Name: 'user2', OrderDate: '2025-05-02', Email: 'user2@gmail.com', Product: 'Shirt', Category: 'Cloths', Price: 350, Quantity: 2, Total_price: 700, City: 'Dewas', State: 'Madhya Pradesh', Approval: false },
    { id: 4, Name: 'testuser', OrderDate: '2025-05-01', Email: 'testuser@gmail.com', Product: 'Pen', Category: 'Stationary', Price: 10, Quantity: 500, Total_price: 5000, City: 'Indore', State: 'Madhya Pradesh', Approval: true },
    { id: 5, Name: 'Aman Singh', OrderDate: '2025-05-01', Email: 'aman.singh@exe.com', Product: 'Sports Shoes', Category: 'Footwear', Price: 1599, Quantity: 1, Total_price: 1599, City: 'Bhopal', State: 'Madhya Pradesh', Approval: true },
  ];

  return (
    <div className="flex h-full bg-mod-surface-card overflow-hidden">
      {/* Left Sidebar - Database Tree */}
      <aside className={`w-64 border-r border-mod-layout-border flex flex-col bg-mod-surface-bg`}>
        <div className={`p-4 border-b border-mod-layout-border bg-mod-surface-card`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-sm font-bold text-mod-card-status-text flex items-center gap-2`}>
              <Database size={16} /> Databases
            </h2>
            <button className="p-1 hover:bg-mod-surface-skeleton rounded-md text-mod-surface-text-muted">
              <Plus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mod-surface-text-muted" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              className={`w-full pl-9 pr-3 py-1.5 bg-mod-surface-skeleton border-transparent focus:bg-mod-surface-card focus:ring-2 mod-toolbar-focus-ring rounded-lg text-xs outline-none transition-all`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-custom">
          <div className="space-y-1">
            {/* Database Node */}
            <div>
              <button 
                onClick={() => toggleNode('database')}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-mod-surface-text-primary hover:bg-mod-surface-card rounded-md transition-all"
              >
                {expandedNodes.includes('database') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Database size={14} className="text-mod-surface-text-primary" /> Database
              </button>
              
              {expandedNodes.includes('database') && (
                <div className="ml-4 mt-1 space-y-1 border-l border-mod-surface-border-strong pl-2">
                  {/* System Node */}
                  <div>
                    <button 
                      onClick={() => toggleNode('system')}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-mod-surface-text-secondary hover:bg-mod-surface-card rounded-md transition-all"
                    >
                      {expandedNodes.includes('system') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      System
                    </button>
                    {expandedNodes.includes('system') && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-mod-surface-border-strong pl-2">
                        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-all">
                          <ChevronRight size={12} /> Users
                        </button>
                        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-all">
                          <ChevronRight size={12} /> Roles
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Test DB Node */}
                  <div>
                    <button 
                      onClick={() => toggleNode('test-us-18411')}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-mod-surface-text-secondary hover:bg-mod-surface-card rounded-md transition-all"
                    >
                      {expandedNodes.includes('test-us-18411') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      test-us-18411
                    </button>
                    {expandedNodes.includes('test-us-18411') && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-mod-surface-border-strong pl-2">
                        <button 
                          onClick={() => setSelectedTable('Test_table')}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-all ${selectedTable === 'Test_table' ? 'bg-mod-surface-skeleton text-mod-surface-text-primary font-bold' : 'text-mod-surface-text-muted hover:text-mod-surface-text-primary'}`}
                        >
                          <TableIcon size={12} /> Test_table
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Table Grid */}
      <main className="flex-1 flex flex-col min-w-0 bg-mod-surface-card">
        <header className={`h-14 border-b border-mod-layout-border px-6 flex items-center justify-between bg-mod-surface-card shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 bg-mod-status-draft-bg text-mod-status-draft-text border border-mod-status-draft-border rounded-lg`}>
              <TableIcon size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-mod-surface-text-primary">{selectedTable}</h1>
              <p className="text-[10px] text-mod-surface-text-muted font-medium">PostgreSQL • 5,241 rows • Updated 2m ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 bg-mod-status-draft-bg p-1 rounded-lg mr-2`}>
              <button className={`px-3 py-1 text-[10px] font-bold text-mod-card-status-text bg-mod-surface-card rounded-md uppercase tracking-wider`}>Table</button>
              <button className="px-3 py-1 text-[10px] font-bold text-mod-surface-text-muted hover:text-mod-surface-text-secondary uppercase tracking-wider">JSON</button>
            </div>
            <button className={`flex items-center gap-2 px-4 py-1.5 bg-mod-header-btn-bg text-mod-header-btn-text text-xs font-bold rounded-lg transition-all hover:bg-mod-header-btn-hover`}>
              <Plus size={14} /> Add Row
            </button>
            <button className="p-2 hover:bg-mod-surface-skeleton rounded-lg text-mod-surface-text-muted">
              <MoreVertical size={18} />
            </button>
          </div>
        </header>

        {/* Toolbar */}
        <div className={`px-6 py-3 border-b border-mod-surface-border flex items-center justify-between bg-mod-toolbar-bg-light/30`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-mod-surface-text-muted">
              <Filter size={14} />
              <span>Filter: <span className="text-mod-surface-text-primary font-medium">None</span></span>
            </div>
            <div className="w-px h-4 bg-mod-surface-border-strong" />
            <div className="flex items-center gap-2 text-xs text-mod-surface-text-muted">
              <ArrowUpDown size={14} />
              <span>Sort: <span className="text-mod-surface-text-primary font-medium">OrderDate (Desc)</span></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest">Show Identifier</span>
            <div className="w-8 h-4 bg-mod-surface-border-strong rounded-full relative cursor-pointer">
              <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-mod-surface-card rounded-full" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto scrollbar-custom">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 bg-mod-surface-card z-10">
              <tr className="border-b border-mod-surface-border-strong">
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider">
                  <div className="flex items-center gap-2">Name <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" /></div>
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider">OrderDate</th>
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider text-right">Price</th>
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider text-right">Quantity</th>
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider text-right">Total</th>
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-mod-surface-bg transition-colors group">
                  <td className="px-4 py-3 text-xs font-semibold text-mod-surface-text-primary">{row.Name}</td>
                  <td className="px-4 py-3 text-xs text-mod-surface-text-muted font-mono">{row.OrderDate}</td>
                  <td className="px-4 py-3 text-xs text-mod-surface-text-muted">{row.Email}</td>
                  <td className="px-4 py-3 text-xs text-mod-surface-text-secondary">{row.Product}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="px-2 py-0.5 bg-mod-surface-skeleton text-mod-surface-text-secondary rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {row.Category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-mod-surface-text-secondary text-right font-mono">${row.Price}</td>
                  <td className="px-4 py-3 text-xs text-mod-surface-text-secondary text-right font-mono">{row.Quantity}</td>
                  <td className="px-4 py-3 text-xs font-bold text-mod-surface-text-primary text-right font-mono">${row.Total_price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">
                    {row.Approval ? (
                      <span className={`flex items-center gap-1 bg-mod-status-active-bg text-mod-status-active-text border border-mod-status-active-border px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider w-fit`}>
                        <CheckCircle2 size={12} /> Approved
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1 bg-mod-status-draft-bg text-mod-status-draft-text border border-mod-status-draft-border px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider w-fit`}>
                        <AlertCircle size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-mod-surface-skeleton text-mod-surface-text-primary rounded-md transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-md transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className={`h-12 border-t border-mod-layout-border px-6 flex items-center justify-between bg-mod-surface-card shrink-0`}>
          <p className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest">1-5 of 5,241 items</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button className={`w-8 h-8 flex items-center justify-center rounded-lg bg-mod-header-btn-bg text-mod-header-btn-text text-xs font-bold`}>1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-mod-surface-skeleton text-mod-surface-text-secondary text-xs font-bold">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-mod-surface-skeleton text-mod-surface-text-secondary text-xs font-bold">3</button>
              <span className="px-2 text-slate-300">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-mod-surface-skeleton text-mod-surface-text-secondary text-xs font-bold">105</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest">Rows per page</span>
              <select className={`text-xs font-bold text-mod-card-status-text bg-mod-surface-hover border-none rounded-lg px-2 py-1 outline-none`}>
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </footer>
      </main>

      {/* Right Sidebar - Column Details */}
      <aside className={`w-64 border-l border-mod-layout-border flex flex-col bg-mod-surface-card`}>
        <header className={`h-14 border-b border-mod-layout-border px-6 flex items-center gap-2 bg-mod-toolbar-bg-light/30`}>
          <Columns size={16} className="text-mod-card-icon-text" />
          <h2 className={`text-sm font-bold text-mod-card-status-text`}>Column Details</h2>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 scrollbar-custom">
          <div className="space-y-8">
            {/* Selected Column Info */}
            <div>
              <h3 className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest mb-4">Selected Column</h3>
              <div className="bg-mod-surface-hover rounded-2xl p-4 border border-mod-surface-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-mod-surface-card rounded-xl flex items-center justify-center text-mod-surface-text-primary border border-mod-surface-border">
                    <Hash size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-mod-surface-text-primary">id</p>
                    <p className="text-[10px] text-mod-surface-text-muted font-medium uppercase tracking-wider">Primary Key</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] font-bold text-mod-surface-text-muted uppercase tracking-widest mb-1">Data Type</p>
                    <p className="text-xs font-semibold text-mod-surface-text-primary">INTEGER</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-mod-surface-text-muted uppercase tracking-widest mb-1">Category</p>
                    <p className="text-xs font-semibold text-mod-surface-text-primary">Measure</p>
                  </div>
                </div>
              </div>
            </div>

            {/* All Columns List */}
            <div>
              <h3 className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest mb-4">All Columns</h3>
              <div className="space-y-1">
                {columns.map((col, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-2 hover:bg-mod-surface-hover rounded-lg transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="text-mod-surface-text-muted group-hover:text-mod-surface-text-primary transition-colors">
                        {col.icon}
                      </div>
                      <span className="text-xs font-medium text-mod-surface-text-secondary group-hover:text-mod-surface-text-primary">{col.name}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{col.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DataSection;
