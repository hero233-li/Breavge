import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Environment } from '../types';
import { apiService } from '../services/apiService';
import { 
  FileText, 
  CheckSquare, 
  PenTool, 
  DollarSign, 
  CreditCard, 
  Search, 
  Cpu, 
  Settings, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { key: 'apply', label: 'Process Apply', path: '/apply', icon: <FileText size={18} /> },
  { key: 'approve', label: 'Process Approve', path: '/approve', icon: <CheckSquare size={18} /> },
  { key: 'sign', label: 'Data Signing', path: '/sign', icon: <PenTool size={18} /> },
  { key: 'withdraw', label: 'Data Withdraw', path: '/withdraw', icon: <DollarSign size={18} /> },
  { key: 'repay', label: 'Data Repay', path: '/repay', icon: <CreditCard size={18} /> },
  { key: 'query', label: 'Data Query', path: '/query', icon: <Search size={18} /> },
  { key: 'auto', label: 'Auto Run', path: '/auto', icon: <Cpu size={18} /> },
];

const Layout: React.FC = () => {
  const [currentEnv, setCurrentEnv] = useState<Environment>('DEV');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleEnvChange = (env: Environment) => {
    setCurrentEnv(env);
    apiService.setEnvironment(env);
  };

  const currentTitle = navItems.find(item => item.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#001529] text-white shadow-xl z-20">
        <div className="h-16 flex items-center justify-center border-b border-gray-700 bg-[#002140]">
           <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">FD</div>
             <span>FinDebug</span>
           </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {navItems.map((item) => (
             <NavLink
               key={item.key}
               to={item.path}
               className={({ isActive }) => `
                  flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-white border-r-4 border-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
               `}
             >
               {item.icon}
               {item.label}
             </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
           <div className="text-xs text-gray-500 text-center">v1.0.0 Internal Build</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 sticky top-0">
           <div className="flex items-center gap-4">
             <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
             </button>
             <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">{currentTitle}</h2>
           </div>

           <div className="flex items-center gap-4">
              {/* Env Selector */}
              <div className="relative group">
                 <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                    <span className={`w-2 h-2 rounded-full ${
                        currentEnv === 'PROD' ? 'bg-red-500' : currentEnv === 'TEST' ? 'bg-orange-400' : 'bg-green-500'
                    }`}></span>
                    Environment: {currentEnv}
                    <ChevronDown size={14} className="text-gray-400"/>
                 </button>
                 
                 {/* Dropdown */}
                 <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-100 py-1 hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-200">
                    {(['DEV', 'TEST', 'PROD'] as Environment[]).map(env => (
                        <button
                            key={env}
                            onClick={() => handleEnvChange(env)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${currentEnv === env ? 'text-primary font-medium bg-blue-50' : 'text-gray-600'}`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                                env === 'PROD' ? 'bg-red-500' : env === 'TEST' ? 'bg-orange-400' : 'bg-green-500'
                            }`}></span>
                            {env}
                        </button>
                    ))}
                 </div>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                QA
              </div>
           </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
           <Outlet />
        </main>

      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden flex">
            <div className="w-64 bg-[#001529] text-white h-full shadow-2xl flex flex-col">
                <div className="p-4 border-b border-gray-700 font-bold text-xl flex items-center gap-2">
                     <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">FD</div>
                     FinDebug
                </div>
                <nav className="flex-1 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                        key={item.key}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                            ${isActive ? 'bg-primary text-white' : 'text-gray-400'}
                        `}
                        >
                        {item.icon}
                        {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </div>
  );
};

export default Layout;
