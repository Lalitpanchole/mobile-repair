import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Grid, List, HelpCircle, 
  Settings, ChevronLeft, ChevronRight, Plus, MapPin, 
  Clock, User, X, Wrench, Menu, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchDashboardStats, 
  fetchDashboardCalendar, 
  createAdminBooking, 
  rescheduleBooking,
  updateBookingStatus
} from '../services/api';

// Animated Counter Component
function AnimatedCounter({ value, duration = 1200 }) {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    const target = parseInt(value, 10);
    if (isNaN(target) || target === 0) {
      setDisplayVal(value);
      return;
    }

    let start = 0;
    const stepTime = 20; // 50 fps
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        setDisplayVal(target.toLocaleString());
      } else {
        setDisplayVal(Math.floor(start).toLocaleString());
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{displayVal}</span>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    newBookings: 0,
    totalBookings: 0,
    completedBookings: 0,
    todayBookings: 0
  });
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState('month'); // 'month' | 'week' | 'day' | 'list'
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 5 = June (0-indexed)
  const [activeEvent, setActiveEvent] = useState(null);
  const [draggedOverDay, setDraggedOverDay] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Selected date for Week and Day views
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 3)); // June 3, 2026

  // Add Booking Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBookingDate, setNewBookingDate] = useState('');
  const [newBookingTitle, setNewBookingTitle] = useState('');
  const [newBookingTime, setNewBookingTime] = useState('10:00 AM');
  const [newBookingType, setNewBookingType] = useState('In-Store');
  const [newBookingDesc, setNewBookingDesc] = useState('');

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get date string formatted as YYYY-MM-DD for a grid cell item
  const getCellDateStr = (item) => {
    let itemMonth = currentMonth;
    let itemYear = currentYear;
    if (item.monthOffset === -1) {
      if (currentMonth === 0) {
        itemMonth = 11;
        itemYear = currentYear - 1;
      } else {
        itemMonth = currentMonth - 1;
      }
    } else if (item.monthOffset === 1) {
      if (currentMonth === 11) {
        itemMonth = 0;
        itemYear = currentYear + 1;
      } else {
        itemMonth = currentMonth + 1;
      }
    }
    return `${itemYear}-${(itemMonth + 1).toString().padStart(2, '0')}-${item.day.toString().padStart(2, '0')}`;
  };

  // Dynamic grid dates generation for the calendar month
  const getGridDates = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();
    
    const list = [];
    // 1. Prev month overlapping cells
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      list.push({ day: prevMonthTotalDays - i, isCurrentMonth: false, monthOffset: -1 });
    }
    // 2. Current month cells
    for (let i = 1; i <= totalDays; i++) {
      list.push({ day: i, isCurrentMonth: true, monthOffset: 0 });
    }
    // 3. Next month overlapping cells (fill 6 weeks / 42 slots)
    const remaining = 42 - list.length;
    for (let i = 1; i <= remaining; i++) {
      list.push({ day: i, isCurrentMonth: false, monthOffset: 1 });
    }
    return list;
  };

  const gridDates = getGridDates();

  const getStartAndEndDates = () => {
    const grid = getGridDates();
    if (grid.length === 0) return { start: '', end: '' };
    const firstDateStr = getCellDateStr(grid[0]);
    const lastDateStr = getCellDateStr(grid[grid.length - 1]);
    return { start: firstDateStr, end: lastDateStr };
  };

  const getWeekDates = (date) => {
    const sunday = new Date(date);
    const day = sunday.getDay();
    sunday.setDate(sunday.getDate() - day);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);
  const todayDate = new Date();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { start, end } = getStartAndEndDates();
      const [statsData, calendarEvents] = await Promise.all([
        fetchDashboardStats(),
        fetchDashboardCalendar(start, end)
      ]);
      setStats(statsData || {
        newBookings: 0,
        totalBookings: 0,
        completedBookings: 0,
        todayBookings: 0
      });
      
      const formatted = (calendarEvents || []).map(ev => ({
        ...ev,
        title: ev.title || `${ev.customerName} with ${ev.deviceModel}`,
        time: ev.time || ev.timeSlot,
        type: ev.type || 'In-Store',
        desc: ev.desc || ev.notes || 'No description provided.',
        tech: ev.tech || 'Unassigned',
        customer: ev.customerName,
        phone: ev.customerPhone,
        email: ev.customerEmail,
        brand: ev.deviceBrand,
      }));
      setEvents(formatted);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentYear, currentMonth]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today);
  };

  // Drag and Drop simulation
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    setDraggedOverDay(item.day);
  };

  const handleDrop = async (e, dayInfo) => {
    e.preventDefault();
    setDraggedOverDay(null);
    const idStr = e.dataTransfer.getData('text/plain');
    if (idStr) {
      const bookingId = parseInt(idStr, 10);
      const targetDateStr = getCellDateStr(dayInfo);
      const booking = events.find(ev => ev.id === bookingId);
      const timeSlot = booking ? booking.timeSlot : '10:00 AM';
      try {
        await rescheduleBooking(bookingId, targetDateStr, timeSlot);
        fetchDashboardData();
      } catch (err) {
        console.error('Failed to reschedule:', err);
        alert(err.message || 'Reschedule failed');
      }
    }
  };

  const handleCellClick = (item) => {
    let eventMonth = currentMonth;
    let eventYear = currentYear;
    if (item.monthOffset === -1) {
      if (currentMonth === 0) {
        eventMonth = 11;
        eventYear = currentYear - 1;
      } else {
        eventMonth = currentMonth - 1;
      }
    } else if (item.monthOffset === 1) {
      if (currentMonth === 11) {
        eventMonth = 0;
        eventYear = currentYear + 1;
      } else {
        eventMonth = currentMonth + 1;
      }
    }
    setSelectedDate(new Date(eventYear, eventMonth, item.day));
  };

  const handleOpenAddBooking = (item) => {
    let targetDateStr = '';
    if (typeof item === 'string') {
      targetDateStr = item;
    } else {
      targetDateStr = getCellDateStr(item);
    }
    setNewBookingDate(targetDateStr);
    setIsAddModalOpen(true);
  };

  const handleSaveBooking = async (e) => {
    e.preventDefault();
    if (!newBookingTitle.trim()) return;
    const newB = {
      customerName: newBookingTitle,
      customerPhone: 'N/A',
      customerEmail: 'admin@gmail.com',
      deviceBrand: 'Apple',
      deviceType: 'Phone',
      deviceModel: 'General Device',
      repairName: newBookingDesc || 'General Issue',
      partQuality: null,
      finalPrice: 0,
      repairSnapshot: {
        brand: 'Apple',
        deviceType: 'Phone',
        model: 'General Device',
        repair: newBookingDesc || 'General Issue',
        quality: 'Standard',
        price: 0,
        warranty: 'N/A'
      },
      dateStr: newBookingDate,
      timeSlot: newBookingTime,
      branchId: 1,
      notes: newBookingDesc || '',
      createdSource: 'admin'
    };
    try {
      await createAdminBooking(newB);
      setIsAddModalOpen(false);
      setNewBookingTitle('');
      setNewBookingDesc('');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create booking');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update status');
    }
  };

  const pendingBookingsCount = stats.newBookings;
  const totalBookingsCount = stats.totalBookings;

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-[#F3F4F6]">
      
      {/* 3 Stats Cards Rows matching screenshot exactly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: New Booking */}
        <div 
          onClick={() => navigate('/admin/bookings')}
          className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40 group relative overflow-hidden cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-4xl font-extrabold text-[#FFDE21] tracking-tight">
                <AnimatedCounter value={pendingBookingsCount} />
              </p>
              <p className="text-base font-bold text-gray-600 dark:text-gray-400 mt-2">New Booking</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/admin/bookings'); }}
            className="text-xs font-bold text-[#FFDE21] hover:underline text-left mt-4 cursor-pointer border-0 bg-transparent"
          >
            View All
          </button>
        </div>

        {/* Card 2: Total Booking */}
        <div 
          onClick={() => navigate('/admin/bookings')}
          className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40 group relative overflow-hidden cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                <AnimatedCounter value={totalBookingsCount} />
              </p>
              <p className="text-base font-bold text-gray-600 dark:text-gray-400 mt-2">Total Booking</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <List className="w-6 h-6" />
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/admin/bookings'); }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-left mt-4 cursor-pointer border-0 bg-transparent"
          >
            View All
          </button>
        </div>

        {/* Card 3: Settings */}
        <div 
          onClick={() => navigate('/admin/settings')}
          className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40 group cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">*</p>
              <p className="text-base font-bold text-gray-600 dark:text-gray-400 mt-2">Settings</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/10 text-purple-600 rounded-xl group-hover:rotate-45 transition-transform duration-500">
              <Settings className="w-6 h-6" />
            </div>
          </div>
          <span className="text-xs font-bold text-[#FFDE21] group-hover:underline text-left mt-4">
            Settings
          </span>
        </div>

      </div>

      {/* Main Full-Width Calendar Section */}
      <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
        
        {/* Calendar Navigation Bar */}
        <div className="p-5 border-b border-[#E2E8F0] dark:border-[#1F2937] flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-800/10">
          
          {/* Left: Navigation Buttons & Add Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#111827] p-1 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-550 dark:text-gray-400 transition-colors flex items-center justify-center cursor-pointer border-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleToday}
                className="px-3 py-1 text-xs font-bold text-gray-650 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
              >
                today
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-550 dark:text-gray-400 transition-colors flex items-center justify-center cursor-pointer border-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => handleOpenAddBooking(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`)}
              className="premium-button bg-[#FFDE21] text-white flex items-center gap-1.5 px-3 py-1.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] text-xs cursor-pointer rounded-xl font-bold border-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add Booking
            </button>
          </div>

          {/* Center: Month Name Label */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
              {monthsList[currentMonth]} {currentYear}
            </h2>
          </div>

          {/* Right: View Toggles */}
          <div className="flex border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-1 bg-white dark:bg-[#111827] shadow-sm gap-0.5">
            {['month', 'week', 'day', 'list'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer border-0 ${
                  view === v 
                    ? 'bg-[#FFDE21] text-white shadow-sm shadow-amber-500/10' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

        </div>

        {/* View Layouts */}
        <AnimatePresence mode="wait">
          
          {/* Month View Grid */}
          {view === 'month' && (
            <motion.div
              key="month-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full overflow-x-auto"
            >
              <div className="min-w-full lg:min-w-[760px]">
                {/* Weekday Labels Headers */}
                <div className="grid grid-cols-7 border-b border-[#E2E8F0] dark:border-[#1F2937] bg-gray-50 dark:bg-gray-800/20 text-center py-3 text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {weekdays.map(day => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                {/* Days Grid Cells */}
                <div className="grid grid-cols-7 auto-rows-[80px] sm:auto-rows-[140px] divide-x divide-y divide-[#E2E8F0] dark:divide-[#1F2937] border-l border-t border-[#E2E8F0] dark:border-[#1F2937]">
                  {gridDates.map((item, idx) => {
                    const cellDateStr = getCellDateStr(item);
                    const dayEvents = events.filter(e => e.dateStr === cellDateStr);
                    const isDraggedOver = draggedOverDay === item.day;
                    const isToday = item.isCurrentMonth && 
                                    item.day === todayDate.getDate() && 
                                    currentMonth === todayDate.getMonth() && 
                                    currentYear === todayDate.getFullYear();
                    const isSelected = item.isCurrentMonth && 
                                       item.day === selectedDate.getDate() && 
                                       currentMonth === selectedDate.getMonth() && 
                                       currentYear === selectedDate.getFullYear();

                    return (
                      <div
                        key={idx}
                        onDragOver={!isMobile ? (e) => handleDragOver(e, item) : undefined}
                        onDrop={!isMobile ? (e) => handleDrop(e, item) : undefined}
                        onClick={() => handleCellClick(item)}
                        className={`p-2 flex flex-col justify-between transition-colors relative group/day cursor-pointer ${
                          !item.isCurrentMonth ? 'bg-gray-50/20 dark:bg-gray-900/10' : 'bg-transparent'
                        } ${isDraggedOver ? 'bg-amber-50/40 dark:bg-amber-900/10' : ''} ${
                          isSelected ? 'bg-amber-50/10 dark:bg-amber-900/5 ring-1 ring-amber-500/20' : ''
                        }`}
                      >
                        {/* Day Header */}
                        <div className="flex justify-between items-center w-full">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddBooking(item);
                            }}
                            className="hidden sm:block text-[9px] text-[#FFDE21] hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-bold opacity-0 group-hover/day:opacity-100 transition-opacity pl-1 cursor-pointer bg-transparent border-0"
                          >
                            + Add
                          </button>
                          
                          <span className={`text-[11px] font-extrabold flex items-center justify-center w-6 h-6 rounded-full ${
                            item.isCurrentMonth 
                              ? 'text-gray-800 dark:text-gray-200 font-black' 
                              : 'text-gray-350 dark:text-gray-650'
                          } ${
                            isToday
                              ? 'bg-[#FFDE21] text-white font-bold'
                              : ''
                          }`}>
                            {item.day}
                          </span>
                        </div>

                        {/* Event Cells */}
                        <div className="flex-1 overflow-y-auto space-y-1 mt-2 pr-0.5 custom-scrollbar">
                          {dayEvents.map(ev => {
                            // Dynamic Event Styles
                            let badgeStyle = 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30 border-l-[3px] border-l-amber-500';
                            if (ev.type === 'Mail-In') {
                              badgeStyle = 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-[#1F2937]/30 border-l-[3px] border-l-purple-500';
                            } else if (ev.type === 'On-Site') {
                              badgeStyle = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30 border-l-[3px] border-l-emerald-500';
                            }

                            return (
                              <div
                                key={ev.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, ev.id)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveEvent(ev);
                                }}
                                className={`px-1 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold truncate cursor-grab active:cursor-grabbing transition-all shadow-sm hover:scale-[1.02] ${badgeStyle}`}
                                title={`${ev.time} - ${ev.title}`}
                              >
                                {ev.title}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Week View Simulation */}
          {view === 'week' && (
            <motion.div 
              key="week-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-4 overflow-x-auto"
            >
              <p className="text-sm font-bold text-gray-400 font-semibold">
                Week View ({monthsList[weekDates[0].getMonth()]} {weekDates[0].getDate()} - {monthsList[weekDates[6].getMonth()]} {weekDates[6].getDate()}, {weekDates[6].getFullYear()})
              </p>
              <div className="grid grid-cols-7 gap-4 min-w-[700px]">
                {weekDates.map((d, idx) => {
                  const cellDateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
                  const dayEvents = events.filter(e => e.dateStr === cellDateStr);
                  const isDayToday = d.getDate() === todayDate.getDate() && 
                                     d.getMonth() === todayDate.getMonth() && 
                                     d.getFullYear() === todayDate.getFullYear();
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedDate(d)}
                      className={`border ${isDayToday ? 'border-[#FFDE21] ring-2 ring-amber-500/20' : 'border-[#E2E8F0] dark:border-[#1F2937]'} rounded-2xl p-4 bg-gray-50/50 dark:bg-gray-800/10 min-h-[300px] flex flex-col gap-3 cursor-pointer`}
                    >
                      <div className="text-center pb-2 border-b border-[#E2E8F0] dark:border-[#1F2937]">
                        <p className="text-xs font-bold text-gray-400 uppercase">{weekdays[idx]}</p>
                        <p className="text-lg font-black mt-1">{d.getDate()}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{monthsList[d.getMonth()].substring(0, 3)}</p>
                      </div>
                      <div className="flex-grow space-y-2">
                        {dayEvents.map(ev => {
                          let badgeStyle = 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30 border-l-[3px] border-l-amber-500';
                          if (ev.type === 'Mail-In') {
                            badgeStyle = 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/30 border-l-[3px] border-l-purple-500';
                          } else if (ev.type === 'On-Site') {
                            badgeStyle = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30 border-l-[3px] border-l-emerald-500';
                          }

                          return (
                            <div 
                              key={ev.id} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveEvent(ev);
                              }}
                              className={`p-3 rounded-xl text-xs font-bold space-y-1.5 cursor-pointer transition-all shadow-sm hover:scale-[1.02] ${badgeStyle}`}
                            >
                              <p className="truncate">{ev.title}</p>
                              <div className="flex items-center gap-1 text-[9px] opacity-90"><Clock className="w-3 h-3" /> {ev.time}</div>
                            </div>
                          );
                        })}
                        {dayEvents.length === 0 && (
                          <p className="text-[10px] text-gray-400 italic text-center mt-8 font-bold">No bookings</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Day View Simulation */}
          {view === 'day' && (
            <motion.div 
              key="day-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-4"
            >
              <p className="text-sm font-bold text-gray-400 font-semibold">
                Day View ({monthsList[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()})
              </p>
              <div className="space-y-3">
                {(() => {
                  const selDateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
                  const dayEvents = events.filter(e => e.dateStr === selDateStr);
                  if (dayEvents.length === 0) {
                    return (
                      <div className="p-8 text-center text-gray-450 italic font-bold">
                        No appointments booked for this day.
                      </div>
                    );
                  }
                  return dayEvents.map(ev => (
                    <div 
                      key={ev.id}
                      onClick={() => setActiveEvent(ev)}
                      className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex justify-between items-center hover:shadow-md cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-600 text-white rounded-xl"><Wrench className="w-5 h-5" /></div>
                        <div>
                          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">{ev.title}</h3>
                          <p className="text-xs font-semibold text-gray-400 mt-0.5">{ev.desc}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400"><Clock className="w-4 h-4 text-[#FFDE21]" /> {ev.time}</span>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          )}

          {/* List View Simulation */}
          {view === 'list' && (
            <motion.div 
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-x-auto"
            >
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] dark:border-[#1F2937] bg-gray-50/50 dark:bg-gray-800/10 text-xs font-bold text-gray-455 uppercase tracking-wider">
                    <th className="p-4 pl-6 whitespace-nowrap">Customer / Device</th>
                    <th className="p-4 whitespace-nowrap">Date</th>
                    <th className="p-4 whitespace-nowrap">Time Slot</th>
                    <th className="p-4 whitespace-nowrap">Type</th>
                    <th className="p-4 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1F2937]">
                  {events
                    .filter(ev => {
                      const parts = ev.dateStr.split('-');
                      return parseInt(parts[0], 10) === currentYear && parseInt(parts[1], 10) === (currentMonth + 1);
                    })
                    .map((ev) => (
                      <tr 
                        key={ev.id}
                        onClick={() => setActiveEvent(ev)}
                        className={`group cursor-pointer transition-colors ${
                          ev.status === 'Completed' ? 'bg-emerald-100/60 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' :
                          ev.status === 'Rejected' ? 'bg-red-100/60 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40' :
                          'bg-white dark:bg-[#111827] hover:bg-gray-50/50 dark:hover:bg-gray-850/20'
                        }`}
                      >
                        <td className="p-4 pl-6">
                          <div className="flex flex-col gap-1.5">
                            <div className="font-extrabold text-sm text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                              {ev.customer || (ev.title && ev.title.includes(' with ') ? ev.title.split(' with ')[0] : ev.title) || 'Unknown Customer'}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] font-bold border border-gray-200 dark:border-gray-700 shadow-sm">
                                {(ev.device || (ev.title && ev.title.includes(' with ') ? ev.title.split(' with ')[1] : 'Unknown Device')).replace(/\s*\(\d{4}\)/g, '')}
                              </span>
                              {ev.price && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-extrabold border border-emerald-200/60 dark:border-emerald-500/20 shadow-sm">
                                  {ev.price}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                          {(() => {
                            const d = new Date(ev.dateStr);
                            return `${monthsList[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
                          })()}
                        </td>
                        <td className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400">{ev.time}</td>
                        <td className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400">{ev.type || 'In-Store'}</td>
                        <td className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                              ev.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                              ev.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200/60 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                              'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                ev.status === 'Completed' ? 'bg-emerald-500' :
                                ev.status === 'Rejected' ? 'bg-red-500' :
                                'bg-amber-500'
                              }`}></span>
                              {ev.status || 'Pending'}
                            </span>
                            
                            {ev.status !== 'Completed' && ev.status !== 'Rejected' && (
                              <div className="flex items-center flex-wrap gap-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(ev.id, 'Pending'); }} 
                                  disabled={ev.status === 'Pending' || ev.status === 'Completed' || ev.status === 'Rejected'}
                                  className={`px-3 py-1.5 text-[11px] font-extrabold rounded-lg transition-all border shadow-sm ${
                                    ev.status === 'Pending' ? 'bg-amber-50/50 text-amber-400 border-amber-200/50 cursor-not-allowed hidden' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 cursor-pointer'
                                  }`}
                                >
                                  Pending
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(ev.id, 'Completed'); }} 
                                  className="px-3 py-1.5 text-[11px] font-extrabold rounded-lg transition-all border shadow-sm bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                                >
                                  Mark Complete
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(ev.id, 'Rejected'); }} 
                                  className="px-3 py-1.5 text-[11px] font-extrabold rounded-lg transition-all border shadow-sm bg-white text-gray-700 border-gray-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Appointment Detail Modal Popup */}
      <AnimatePresence>
        {activeEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={() => setActiveEvent(null)}
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 transition-colors duration-300 font-semibold text-sm"
            >
              <button 
                onClick={() => setActiveEvent(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-5">
                <div>
                  <span className="bg-amber-100 dark:bg-amber-900/20 text-[#FFDE21] dark:text-[#FFDE21] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Booking Detail
                  </span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-2">{activeEvent.title}</h3>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-5 custom-scrollbar">
                  {/* Customer Group */}
                  <div className="bg-gray-50/50 dark:bg-[#1F2937]/30 rounded-2xl border border-[#E2E8F0] dark:border-[#1F2937] p-5 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">Customer Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Name</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{activeEvent.customer || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Phone</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{activeEvent.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Email</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right break-all">{activeEvent.email || 'N/A'}</span>
                      </div>
                      {activeEvent.notes && (
                        <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1F2937] mt-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-bold block mb-1">Message / Notes</span>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#111827] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937]">
                            {activeEvent.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Device & Repair Group */}
                  <div className="bg-gray-50/50 dark:bg-[#1F2937]/30 rounded-2xl border border-[#E2E8F0] dark:border-[#1F2937] p-5 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">Device & Repair</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Brand</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{activeEvent.brand || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Model</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{activeEvent.device ? activeEvent.device.replace(/\s*\(\d{4}\)/g, '') : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Selected Repair(s)</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{activeEvent.issue || 'Diagnostics'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0] dark:border-[#1F2937] mt-3">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Repair Price</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 px-3 py-1 rounded-xl shadow-sm">
                          {activeEvent.price || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Group */}
                  <div className="bg-gray-50/50 dark:bg-[#1F2937]/30 rounded-2xl border border-[#E2E8F0] dark:border-[#1F2937] p-5 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">Appointment Info</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Status</span>
                        <span className={`font-extrabold ${
                          activeEvent.status === 'Completed' ? 'text-emerald-600' :
                          activeEvent.status === 'Rejected' ? 'text-red-600' :
                          'text-amber-500'
                        }`}>{activeEvent.status || 'Pending'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Location</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{activeEvent.location || 'In-Store'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Date</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">
                          {activeEvent.dateStr ? (() => {
                            const d = new Date(activeEvent.dateStr);
                            return `${monthsList[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
                          })() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Time Window</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{activeEvent.time || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => setActiveEvent(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer border-0"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      alert('Rescheduling feature mockup.');
                      setActiveEvent(null);
                    }}
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm shadow-amber-500/10 border-0"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Booking Modal Dialog */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 transition-colors duration-300 text-sm"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleSaveBooking} className="space-y-4">
                <div>
                  <span className="bg-amber-100 dark:bg-amber-900/20 text-[#FFDE21] dark:text-[#FFDE21] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    New Booking
                  </span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-2">Add Appointment</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Customer / Device Name</label>
                    <input 
                      type="text" 
                      required
                      value={newBookingTitle}
                      onChange={(e) => setNewBookingTitle(e.target.value)}
                      placeholder="e.g. Alice with iPhone 13 Screen"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Time Slot</label>
                      <input 
                        type="text" 
                        required
                        value={newBookingTime}
                        onChange={(e) => setNewBookingTime(e.target.value)}
                        placeholder="e.g. 10:30 AM"
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Date</label>
                      <input 
                        type="text" 
                        required
                        value={newBookingDate}
                        onChange={(e) => setNewBookingDate(e.target.value)}
                        placeholder="YYYY-MM-DD"
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Type</label>
                    <select 
                      value={newBookingType}
                      onChange={(e) => setNewBookingType(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                    >
                      <option value="In-Store">In-Store</option>
                      <option value="Mail-In">Mail-In</option>
                      <option value="On-Site">On-Site</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Description</label>
                    <textarea 
                      value={newBookingDesc}
                      onChange={(e) => setNewBookingDesc(e.target.value)}
                      placeholder="Enter repair details..."
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-55/10 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer border-0"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm shadow-amber-500/10 border-0"
                  >
                    Save Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}










