import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Plus, MapPin, Package, Truck, 
  Clock, User, Check, X, Calendar as CalendarIcon, Move, Wrench
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function AdminCalendar() {
  const [view, setView] = useState('month'); // 'month' | 'week' | 'day'
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 3)); // June 3, 2026
  const [activeEvent, setActiveEvent] = useState(null); // Clicked event for detail modal
  const [draggedOverDay, setDraggedOverDay] = useState(null);

  // Modal State for Adding Events
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newDevice, setNewDevice] = useState('');
  const [newIssue, setNewIssue] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newType, setNewType] = useState('In-Store');
  const [newTech, setNewTech] = useState('Alex');

  const { bookings: events, addBooking, updateBooking } = useBooking();

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, eventId) => {
    e.dataTransfer.setData('text/plain', eventId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    setDraggedOverDay(item.day);
  };

  const handleDrop = (e, item) => {
    e.preventDefault();
    setDraggedOverDay(null);
    const eventId = e.dataTransfer.getData('text/plain');
    if (eventId) {
      const targetDateStr = getCellDateStr(item);
      updateBooking(eventId, { dateStr: targetDateStr });
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'In-Store': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30';
      case 'Mail-In': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/30';
      case 'On-Site': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'In-Store': return <MapPin className="w-3.5 h-3.5" />;
      case 'Mail-In': return <Package className="w-3.5 h-3.5" />;
      case 'On-Site': return <Truck className="w-3.5 h-3.5" />;
      default: return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const handlePrev = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prevMonth);
  };

  const handleNext = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(nextMonth);
  };

  const getCellDateStr = (item) => {
    let itemMonth = currentDate.getMonth();
    let itemYear = currentDate.getFullYear();
    if (item.monthOffset === -1) {
      if (itemMonth === 0) {
        itemMonth = 11;
        itemYear--;
      } else {
        itemMonth--;
      }
    } else if (item.monthOffset === 1) {
      if (itemMonth === 11) {
        itemMonth = 0;
        itemYear++;
      } else {
        itemMonth++;
      }
    }
    return `${itemYear}-${(itemMonth + 1).toString().padStart(2, '0')}-${item.day.toString().padStart(2, '0')}`;
  };

  // Get dynamic dates array for Monday-first calendar month view grid
  const getGridDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    let firstDayIndex = new Date(year, month, 1).getDay();
    // Monday-first indexing (0 = Mon, 6 = Sun)
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const list = [];
    // 1. Overlap previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      list.push({ day: prevMonthTotalDays - i, isCurrentMonth: false, monthOffset: -1 });
    }
    // 2. Current month
    for (let i = 1; i <= totalDays; i++) {
      list.push({ day: i, isCurrentMonth: true, monthOffset: 0 });
    }
    // 3. Overlap next month
    const remaining = 42 - list.length;
    for (let i = 1; i <= remaining; i++) {
      list.push({ day: i, isCurrentMonth: false, monthOffset: 1 });
    }
    return list;
  };

  const gridDates = getGridDates();

  const getWeekDates = (date) => {
    const monday = new Date(date);
    const day = monday.getDay();
    const diff = day === 0 ? 6 : day - 1;
    monday.setDate(monday.getDate() - diff);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const todayDate = new Date();

  const handleOpenAddEvent = (dayVal) => {
    setIsAddModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!newCustomer.trim() || !newDevice.trim()) return;
    const newEv = {
      customer: newCustomer,
      device: newDevice,
      issue: newIssue || 'General Diagnostics',
      dateStr: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`,
      time: newTime,
      type: newType,
      status: 'Confirmed',
      tech: newTech
    };
    addBooking(newEv);
    setIsAddModalOpen(false);
    setNewCustomer('');
    setNewDevice('');
    setNewIssue('');
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-[#F3F4F6]">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-amber-500" /> Appointment Calendar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Drag and drop appointments to reschedule dates instantly.
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer border-0 ${view === v ? 'bg-white dark:bg-[#111827] text-amber-600 dark:text-amber-400 shadow-sm' : 'text-gray-550 hover:text-gray-950 dark:hover:text-white bg-transparent'}`}
            >
              {v} View
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex justify-between items-center bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] px-6 py-4 rounded-2xl shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <button onClick={handlePrev} className="p-2 border border-[#E2E8F0] dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer bg-transparent">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-lg font-black text-gray-850 dark:text-white">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNext} className="p-2 border border-[#E2E8F0] dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer bg-transparent">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <button 
          onClick={() => handleOpenAddEvent(currentDate.getDate())}
          className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer border-0 rounded-xl font-bold"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>


      {/* Month View Grid */}
      {view === 'month' && (
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
          
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 border-b border-[#E2E8F0] dark:border-[#1F2937] bg-gray-50/50 dark:bg-gray-800/20 text-center py-3 text-xs font-bold text-gray-405 dark:text-gray-500 uppercase tracking-wider">
                {weekdays.map(day => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 auto-rows-[140px] divide-x divide-y divide-[#E2E8F0] dark:divide-[#1F2937] border-l border-t border-[#E2E8F0] dark:border-[#1F2937]">
                {gridDates.map((item, idx) => {
                  const cellDateStr = getCellDateStr(item);
                  const dayEvents = events.filter(e => e.dateStr === cellDateStr);
                  const isToday = item.isCurrentMonth && 
                                  item.day === todayDate.getDate() && 
                                  currentDate.getMonth() === todayDate.getMonth() && 
                                  currentDate.getFullYear() === todayDate.getFullYear();
                  const isDraggedOver = draggedOverDay === item.day;

                  return (
                    <div
                      key={idx}
                      onDragOver={(e) => handleDragOver(e, item)}
                      onDrop={(e) => handleDrop(e, item)}
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), item.day))}
                      className={`p-3 flex flex-col justify-between transition-colors relative group/day cursor-pointer ${
                        !item.isCurrentMonth ? 'bg-gray-50/20 dark:bg-gray-900/10' : 'bg-transparent'
                      } ${isDraggedOver ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}
                    >
                      <span className={`text-sm font-extrabold flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                        isToday ? 'bg-[#FFDE21] text-white' : 'text-gray-850 dark:text-gray-200'
                      }`}>
                        {item.day}
                      </span>

                      {/* Day Events Container */}
                      <div className="flex-1 overflow-y-auto space-y-1.5 mt-2 custom-scrollbar pr-0.5">
                        {dayEvents.map(ev => (
                          <motion.div
                            key={ev.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, ev.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveEvent(ev);
                            }}
                            whileHover={{ scale: 1.02 }}
                            className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold flex flex-col justify-between gap-1 shadow-sm cursor-grab active:cursor-grabbing transition-colors ${getTypeColor(ev.type)}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="truncate pr-1">{ev.device}</span>
                              <Move className="w-3 h-3 text-gray-400 opacity-0 group-hover/day:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[9px] font-semibold opacity-75">{ev.time}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week View Simulation */}
      {view === 'week' && (
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl overflow-x-auto shadow-sm p-6 space-y-4 transition-colors duration-300">
          <p className="text-sm font-bold text-gray-400 font-semibold">
            Week View ({weekDates[0].toLocaleString('default', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })})
          </p>
          <div className="grid grid-cols-7 gap-4 min-w-[700px] overflow-x-auto">
            {weekDates.map((d, idx) => {
              const cellDateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.dateStr === cellDateStr);
              const isDayToday = d.getDate() === todayDate.getDate() && 
                                 d.getMonth() === todayDate.getMonth() && 
                                 d.getFullYear() === todayDate.getFullYear();
              return (
                <div key={idx} className={`border ${isDayToday ? 'border-[#FFDE21] ring-2 ring-amber-500/20' : 'border-[#E2E8F0] dark:border-[#1F2937]'} rounded-2xl p-4 bg-gray-50/50 dark:bg-gray-800/10 min-h-[300px] flex flex-col gap-3 cursor-pointer`} onClick={() => setCurrentDate(d)}>
                  <div className="text-center pb-2 border-b border-[#E2E8F0] dark:border-[#1F2937]">
                    <p className="text-xs font-bold text-gray-400 uppercase">{weekdays[idx]}</p>
                    <p className="text-lg font-black mt-1">{d.getDate()}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">{d.toLocaleString('default', { month: 'short' })}</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {dayEvents.map(ev => (
                      <div 
                        key={ev.id} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveEvent(ev);
                        }}
                        className={`p-3 rounded-xl border text-xs font-bold space-y-2 cursor-pointer hover:shadow-md transition-shadow ${getTypeColor(ev.type)}`}
                      >
                        <p className="text-gray-850 dark:text-gray-250 truncate">{ev.customer}</p>
                        <p className="text-[10px] font-medium opacity-80">{ev.device}</p>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ev.time}</span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length === 0 && (
                      <p className="text-[10px] text-gray-400 italic text-center mt-8 font-bold">No events</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View Simulation */}
      {view === 'day' && (
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm p-6 transition-colors duration-300">
          <p className="text-sm font-bold text-gray-400 mb-6">
            Day Schedule ({currentDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })})
          </p>
          <div className="space-y-4">
            {(() => {
              const selDateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.dateStr === selDateStr);
              if (dayEvents.length === 0) {
                return (
                  <div className="p-8 text-center text-gray-400 italic font-bold">
                    No appointments scheduled for this day.
                  </div>
                );
              }
              return dayEvents.map(ev => (
                <div 
                  key={ev.id}
                  onClick={() => setActiveEvent(ev)}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all cursor-pointer ${getTypeColor(ev.type)}`}
                >
                  <div className="flex gap-4 items-center">
                    <div className="p-3 bg-white dark:bg-[#111827] rounded-xl shadow-sm">
                      {getTypeIcon(ev.type)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-800 dark:text-white">{ev.customer}</h3>
                      <p className="text-xs font-medium opacity-75 mt-0.5">{ev.device} - {ev.issue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-xs font-bold text-gray-550 dark:text-gray-400 font-semibold">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500" /> {ev.time}</span>
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-purple-500" /> Tech: {ev.tech}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      ev.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400' :
                      ev.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400' : 'text-amber-600 bg-amber-50'
                    }`}>{ev.status}</span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Event Details Detail Modal */}
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
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border items-center gap-1.5 ${getTypeColor(activeEvent.type)}`}>
                  {getTypeIcon(activeEvent.type)} {activeEvent.type}
                </span>

                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{activeEvent.customer}</h3>
                  <p className="text-sm font-semibold text-gray-405 mt-1">Appointment Details</p>
                </div>

                <div className="space-y-3.5 border-t border-b border-gray-100 dark:border-[#1F2937] py-4 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Device</span>
                    <span className="font-bold text-gray-850 dark:text-white">{activeEvent.device}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Problem</span>
                    <span className="font-bold text-gray-850 dark:text-white">{activeEvent.issue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span className="font-bold text-gray-850 dark:text-white">
                      {(() => {
                        const d = new Date(activeEvent.dateStr);
                        return d.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Slot</span>
                    <span className="font-bold text-gray-850 dark:text-white">{activeEvent.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expert</span>
                    <span className="font-bold text-gray-850 dark:text-white">{activeEvent.tech}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    onClick={() => setActiveEvent(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer border-0"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      alert('Reschedule actions would open a calendar picker widget.');
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

      {/* Add Event Modal Dialog */}
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

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div>
                  <span className="bg-amber-100 dark:bg-amber-900/20 text-[#FFDE21] dark:text-[#FFDE21] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    New Appointment
                  </span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-2">Add Calendar Event</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Customer Name</label>
                    <input 
                      type="text" 
                      required
                      value={newCustomer}
                      onChange={(e) => setNewCustomer(e.target.value)}
                      placeholder="e.g. Alice Johnson"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Device Name</label>
                    <input 
                      type="text" 
                      required
                      value={newDevice}
                      onChange={(e) => setNewDevice(e.target.value)}
                      placeholder="e.g. iPhone 13 Pro Max"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Repair Issue</label>
                    <input 
                      type="text" 
                      required
                      value={newIssue}
                      onChange={(e) => setNewIssue(e.target.value)}
                      placeholder="e.g. Screen Replacement"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Time Slot</label>
                      <input 
                        type="text" 
                        required
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        placeholder="e.g. 10:30 AM"
                        className="w-full px-3 py-2 bg-gray-55/10 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Assigned Tech</label>
                      <select 
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-55/10 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                      >
                        <option value="Alex">Alex</option>
                        <option value="Sarah">Sarah</option>
                        <option value="James">James</option>
                        <option value="Unassigned">Unassigned</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-405 uppercase tracking-wider mb-1">Channel / Type</label>
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-55/10 dark:bg-[#1F2937]/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 dark:text-white font-bold"
                    >
                      <option value="In-Store">In-Store</option>
                      <option value="Mail-In">Mail-In</option>
                      <option value="On-Site">On-Site</option>
                    </select>
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
                    Save Event
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










