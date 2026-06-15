import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Sliders, Video, FileText, 
  MessageSquare, Store, Clock, Wrench, Settings, 
  Maximize, Globe, LogOut, ChevronDown, ChevronRight, X
} from 'lucide-react';

export default function AdminSidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Slider Management', icon: Sliders, path: '/admin/sliders' },
    { name: 'Home Video', icon: Video, path: '/admin/video' },
    { name: 'Page Management', icon: FileText, path: '/admin/pages' },
    { name: 'Testimonial', icon: MessageSquare, path: '/admin/testimonials' },
    { 
      name: 'Store Management', 
      icon: Store, 
      path: '#',
      subItems: [
        { name: 'Store Profiles', path: '/admin/store' },
        { name: 'Branch Locations', path: '/admin/store/branches' }
      ]
    },
    { 
      name: 'Working Hours', 
      icon: Clock, 
      path: '#',
      subItems: [
        { name: 'Operational Hours', path: '/admin/hours' },
        { name: 'Special Exclusions', path: '/admin/hours/exceptions' }
      ]
    },
    { 
      name: 'Services', 
      icon: Wrench, 
      path: '#',
      subItems: [
        { name: 'Services Directory', path: '/admin/services' },
        { name: 'Service Categories', path: '/admin/services/categories' }
      ]
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    window.location.href = '/';
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 bg-[#060913] border-r border-[#1e293b]/30 flex flex-col h-full 
      shadow-[4px_0_24px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out
      lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      ${isCollapsed ? 'w-20' : 'w-72'}
    `}>
      
      {/* Brand & Admin Profile */}
      <div className={`px-5 py-6 border-b border-[#1e293b]/30 flex flex-col items-center gap-4 ${isCollapsed ? 'h-24 justify-center py-2' : ''}`}>
        {/* Removed mobile close button as requested */}

        {/* Circular Avatar and Welcome Message */}
        <div className="flex items-center gap-3 w-full overflow-hidden">
          <div className="w-11 h-11 min-w-[44px] rounded-full border-2 border-amber-500/50 p-0.5 shadow-md shadow-amber-500/10 overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin&background=FFDE21&color=ffffff&bold=true" alt="Admin" className="w-full h-full object-cover rounded-full" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Welcome,</span>
              <span className="text-sm font-black text-white truncate">Admin</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5 custom-scrollbar">
        {menuItems.map((item) => {
          const isDropdown = item.path === '#';
          const isDropdownOpen = openDropdowns[item.name];
          const isActive = location.pathname === item.path || (item.subItems && item.subItems.some(sub => location.pathname === sub.path));
          const Icon = item.icon;

          if (isDropdown) {
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-slate-900 text-amber-400 font-bold' 
                      : 'text-slate-400 dark:text-slate-300 hover:bg-slate-900/60 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5">
                      <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'}`} />
                    </div>
                    {!isCollapsed && <span className="text-sm tracking-wide">{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-90 text-white' : ''}`} />
                  )}
                </button>

                {/* Sub Menu Links */}
                {!isCollapsed && isDropdownOpen && (
                  <div className="pl-12 pr-2 py-1 space-y-1.5 border-l border-slate-800/80 ml-6">
                    {item.subItems.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => setIsOpen(false)}
                          className={`block py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            isSubActive 
                              ? 'text-amber-400' 
                              : 'text-slate-500 dark:text-slate-300 hover:text-white'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Single Link Menu Items (Dashboard, Home Video)
          const isItemActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isItemActive 
                  ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-500/15' 
                  : 'text-slate-400 dark:text-slate-300 hover:bg-slate-900/60 hover:text-white font-medium'
              }`}
            >
              {isItemActive && (
                <div className="absolute left-0 top-1/4 h-1/2 w-1 bg-white rounded-r-full" />
              )}
              <div className="flex items-center justify-center w-5 h-5">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isItemActive ? 'text-white' : 'text-slate-400 group-hover:scale-110 group-hover:text-amber-400'}`} />
              </div>
              {!isCollapsed && <span className="text-sm tracking-wide">{item.name}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-950 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none z-50 whitespace-nowrap shadow-xl border border-slate-800">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Tool Actions (Redesigned matching screenshot buttons footer) */}
      <div className="p-3 border-t border-[#1e293b]/30 flex justify-between items-center gap-1 bg-[#03060c]">
        {/* Settings gear */}
        <Link 
          to="/admin/settings"
          className="p-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen}
          className="p-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-5 h-5" />
        </button>

        {/* View Site */}
        <Link 
          to="/"
          className="p-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
          title="View Site"
        >
          <Globe className="w-5 h-5" />
        </Link>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="p-2.5 rounded-lg text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-all cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

    </aside>
  );
}


