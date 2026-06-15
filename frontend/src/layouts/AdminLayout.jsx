import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('admin-theme') || 'light';
  });
  
  // Authentication check (must have both auth flag and token)
  const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true' && !!sessionStorage.getItem('adminToken');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'dark bg-[#0B0F19] text-[#F3F4F6]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-35 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader 
          onMenuClick={() => setIsSidebarOpen(true)} 
          theme={theme}
          toggleTheme={toggleTheme}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8 transition-colors duration-300">
          <Outlet context={{ theme, toggleTheme, isSidebarCollapsed, setIsSidebarCollapsed }} />
        </main>
      </div>
    </div>
  );
}

