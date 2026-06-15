import { 
  Search, Bell, Menu, Settings, LogOut, ChevronDown, 
  Sun, Moon, AlertCircle, CalendarCheck, Check,
  RefreshCw, Loader2
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchNotifications, 
  markNotificationRead, 
  clearNotifications, 
  logoutAdmin, 
  globalSearch 
} from '../../services/api';

export default function AdminHeader({ onMenuClick, theme, toggleTheme }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 500ms Debounce Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await globalSearch(searchQuery);
        setSearchResults(res.bookings || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    }
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearNotifications = async (e) => {
    e.stopPropagation();
    try {
      await clearNotifications();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

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
          
          {/* Debounced Search Suggestions Dropdown */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#111827] border border-gray-100 dark:border-[#1F2937] rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.15)] p-4 z-50 overflow-hidden max-h-80 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-100 dark:border-[#1F2937]">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Search Results</p>
                  {searchLoading && <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
                </div>
                
                <div className="space-y-1.5">
                  {searchQuery.trim() === '' ? (
                    <p className="text-xs text-gray-400 text-center py-2">Type to search bookings...</p>
                  ) : searchLoading && searchResults.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">Searching...</p>
                  ) : searchResults.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">No bookings found for "{searchQuery}"</p>
                  ) : (
                    searchResults.map((booking) => (
                      <div 
                        key={booking.id} 
                        onClick={() => {
                          navigate(`/admin/bookings?search=${booking.bookingNumber}`);
                          setSearchFocused(false);
                        }}
                        className="flex flex-col p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-sm font-semibold transition-colors"
                      >
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-[#0F172A] dark:text-gray-100 font-bold">{booking.customerName}</span>
                          <span className="text-xs text-amber-500 font-bold">{booking.bookingNumber}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 font-medium">
                          <span>{booking.deviceModel} - {booking.repairName}</span>
                          <span className="text-gray-500">{booking.dateStr}</span>
                        </div>
                      </div>
                    ))
                  )}
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

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-[#FFDE21] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 relative"
          >
            <Bell className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0B0F19] shadow-sm"></span>
            )}
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
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0F172A] dark:text-white">Notifications ({unreadCount})</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); loadNotifications(); }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      title="Refresh Notifications"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  <button 
                    onClick={handleClearNotifications}
                    className="text-xs text-[#FFDE21] font-bold hover:underline"
                  >
                    Clear Read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-[#1F2937]">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      className={`p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-[#FFDE21]/5' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notif.type === 'booking' ? 'bg-amber-50 text-amber-500' :
                        notif.type === 'alert' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                      } dark:bg-opacity-10`}>
                        {notif.type === 'booking' && <CalendarCheck className="w-4 h-4" />}
                        {notif.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                        {(notif.type === 'system' || notif.type === 'assignment') && <Check className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{notif.title}</p>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">{notif.description}</p>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  )}
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
