import { 
  Search, Bell, Menu, Settings, LogOut, ChevronDown, 
  Sun, Moon, MessageSquare, AlertCircle, CalendarCheck, Check
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminHeader({ onMenuClick, theme, toggleTheme }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const msgRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target)) {
        setIsMessagesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    window.location.href = '/';
  };

  const notifications = [
    { id: 1, title: 'New Booking #BKG-5092', desc: 'Alice Johnson for Screen Replacement', time: '5m ago', unread: true, type: 'booking' },
    { id: 2, title: 'Low Stock Alert', desc: 'iPhone 13 screen inventory is less than 5', time: '1h ago', unread: true, type: 'alert' },
    { id: 3, title: 'Technician Assigned', desc: 'Sarah was assigned to Macbook repair', time: '3h ago', unread: false, type: 'assignment' },
  ];

  const messages = [
    { id: 1, sender: 'Michael Chen', text: 'Is my MacBook repair finished yet? Need it by tomorrow.', time: '10m ago', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=eff6ff&color=2563eb' },
    { id: 2, sender: 'Emma Thompson', text: 'Thanks for the quick diagnostic, I approved the quote!', time: '2h ago', avatar: 'https://ui-avatars.com/api/?name=Emma+Thompson&background=eff6ff&color=2563eb' },
    { id: 3, sender: 'David Martinez', text: 'Do you open on weekends?', time: '1d ago', avatar: 'https://ui-avatars.com/api/?name=David+Martinez&background=eff6ff&color=2563eb' },
  ];

  return (
    <header className="bg-white dark:bg-[#0B0F19] border-b border-[#E2E8F0] dark:border-[#1F2937] h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
      
      {/* Search & Menu Trigger */}
      <div className="flex items-center flex-1 gap-4 max-w-xl">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-[#64748B] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Animated Search Bar */}
        <div className="flex-1 relative hidden sm:block">
          <Search className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${searchFocused ? 'text-[#FFDE21]' : 'text-gray-400'}`} />
          <input 
            type="text" 
            placeholder="Search bookings, customers, services..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium text-[#0F172A] dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all duration-300 placeholder:font-normal"
          />
          
          {/* Mock Search Suggestions Dropdown */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#111827] border border-gray-100 dark:border-[#1F2937] rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.15)] p-4 z-50 overflow-hidden"
              >
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Suggested Searches</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-sm font-semibold transition-colors">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>Alice Johnson <span className="text-xs text-gray-400 font-medium">Customer</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-sm font-semibold transition-colors">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>Screen Replacement <span className="text-xs text-gray-400 font-medium">Service</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-sm font-semibold transition-colors">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>Booking #BKG-5092 <span className="text-xs text-gray-400 font-medium">Booking ID</span></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        
        {/* Dark/Light Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-[#FFDE21] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 relative overflow-hidden"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ y: 20, rotate: 45, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: -20, rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-amber-500" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ y: 20, rotate: 45, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: -20, rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Messages Dropdown */}
        <div className="relative" ref={msgRef}>
          <button 
            onClick={() => {
              setIsMessagesOpen(!isMessagesOpen);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-[#FFDE21] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 relative"
          >
            <MessageSquare className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-[#0B0F19] shadow-sm"></span>
          </button>
          
          <AnimatePresence>
            {isMessagesOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute right-[-80px] sm:right-0 mt-3 w-[300px] sm:w-96 bg-white dark:bg-[#111827] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-[#1F2937] py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-gray-100 dark:border-[#1F2937] flex justify-between items-center bg-gray-50/50 dark:bg-[#1f2937]/35">
                  <span className="font-bold text-sm text-[#0F172A] dark:text-white">Messages</span>
                  <button className="text-xs text-[#FFDE21] font-bold hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-[#1F2937]">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-3.5 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                      <img src={msg.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{msg.sender}</p>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsMessagesOpen(false);
              setIsProfileOpen(false);
            }}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-[#FFDE21] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 relative"
          >
            <Bell className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0B0F19] shadow-sm"></span>
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute right-[-40px] sm:right-0 mt-3 w-[300px] sm:w-96 bg-white dark:bg-[#111827] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-[#1F2937] py-2 z-50 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-gray-100 dark:border-[#1F2937] flex justify-between items-center bg-gray-50/50 dark:bg-[#1f2937]/35">
                  <span className="font-bold text-sm text-[#0F172A] dark:text-white">Notifications</span>
                  <button className="text-xs text-[#FFDE21] font-bold hover:underline">Clear all</button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-[#1F2937]">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${notif.unread ? 'bg-[#FFDE21]/5' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notif.type === 'booking' ? 'bg-amber-50 text-amber-500' :
                        notif.type === 'alert' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                      } dark:bg-opacity-10`}>
                        {notif.type === 'booking' && <CalendarCheck className="w-4 h-4" />}
                        {notif.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                        {notif.type === 'assignment' && <Check className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{notif.title}</p>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{notif.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">{notif.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative border-l border-[#E2E8F0] dark:border-[#1F2937] pl-3 sm:pl-4" ref={profileRef}>
          <div 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
              setIsMessagesOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-[#0F172A] dark:text-white leading-tight">Admin User</p>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFDE21] to-[#FFDE21] p-[2.5px] shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white dark:bg-[#111827] rounded-full flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=AD&background=FFDE21&color=0F172A&bold=true" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-amber-500' : ''}`} />
          </div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute right-[-10px] sm:right-0 mt-3 w-48 sm:w-52 bg-white dark:bg-[#111827] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-[#1F2937] py-2.5 z-50 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-gray-50 dark:border-[#1F2937] pb-3 mb-2 md:hidden">
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white">Admin User</p>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5">Super Admin</p>
                </div>
                <button 
                  onClick={() => {
                    navigate('/admin/settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-[#FFDE21] dark:hover:text-[#FFDE21] transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="h-px bg-gray-100 dark:bg-[#1F2937] my-1 mx-3" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}










