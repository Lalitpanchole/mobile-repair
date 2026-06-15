import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Save, Coffee, CalendarOff, CheckCircle2, 
  Calendar, Plus, Edit, Trash2, X, Loader2
} from 'lucide-react';
import {
  fetchStoreHours,
  updateStoreHours,
  fetchAdminExceptions,
  createException,
  updateException,
  deleteException
} from '../services/api';

export default function AdminHours() {
  const location = useLocation();
  const showExceptions = location.pathname.endsWith('/exceptions');

  // Weekly Schedule State
  const [schedule, setSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Exceptions State
  const [exceptions, setExceptions] = useState([]);
  const [exceptionsLoading, setExceptionsLoading] = useState(false);

  // Modal State for Exceptions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingException, setEditingException] = useState(null);

  // Load schedule and exceptions on mount
  const loadHoursAndExceptions = async () => {
    setScheduleLoading(true);
    setExceptionsLoading(true);
    try {
      const hours = await fetchStoreHours();
      // Map dayNames correctly
      const sortedDaysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const mappedSchedule = sortedDaysOrder.map(day => {
        const match = hours.find(h => h.dayName === day);
        return {
          day,
          open: match ? match.openTime : '09:00',
          close: match ? match.closeTime : '18:00',
          breakStart: match ? match.breakStart || '13:00' : '13:00',
          breakEnd: match ? match.breakEnd || '14:00' : '14:00',
          closed: match ? match.isClosed : (day === 'Sunday')
        };
      });
      setSchedule(mappedSchedule);
      setScheduleLoading(false);

      const excs = await fetchAdminExceptions();
      const mappedExcs = (excs || []).map(e => ({
        id: String(e.id),
        title: e.title,
        date: e.date,
        type: e.type === 'Closed' ? 'Closed' : 'Custom Hours',
        open: e.customOpen || '09:00',
        close: e.customClose || '17:00',
        active: e.active
      }));
      setExceptions(mappedExcs);
    } catch (err) {
      console.error('Failed to load hours/exceptions:', err);
    } finally {
      setScheduleLoading(false);
      setExceptionsLoading(false);
    }
  };

  useEffect(() => {
    loadHoursAndExceptions();
  }, []);

  // Handlers for Weekly schedule
  const handleToggleClosed = (index) => {
    setSchedule(prev => prev.map((s, idx) => idx === index ? { ...s, closed: !s.closed } : s));
  };

  const handleTimeChange = (index, field, value) => {
    setSchedule(prev => prev.map((s, idx) => idx === index ? { ...s, [field]: value } : s));
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    try {
      const payload = schedule.map(item => ({
        dayName: item.day,
        openTime: item.open,
        closeTime: item.close,
        breakStart: item.breakStart,
        breakEnd: item.breakEnd,
        isClosed: item.closed
      }));
      await updateStoreHours(payload);
      alert('Standard operating hours updated successfully!');
      loadHoursAndExceptions();
    } catch (err) {
      console.error(err);
      alert('Failed to update operating hours');
    }
  };

  // Handlers for Exceptions
  const toggleExceptionStatus = async (exc) => {
    try {
      const payload = {
        title: exc.title,
        date: exc.date,
        type: exc.type,
        customOpen: exc.type === 'Custom Hours' ? exc.open : null,
        customClose: exc.type === 'Custom Hours' ? exc.close : null,
        active: !exc.active
      };
      await updateException(exc.id, payload);
      // Reload exceptions
      const excs = await fetchAdminExceptions();
      setExceptions((excs || []).map(e => ({
        id: String(e.id),
        title: e.title,
        date: e.date,
        type: e.type === 'Closed' ? 'Closed' : 'Custom Hours',
        open: e.customOpen || '09:00',
        close: e.customClose || '17:00',
        active: e.active
      })));
    } catch (err) {
      console.error(err);
      alert('Failed to update schedule exception status');
    }
  };

  const handleDeleteException = async (id) => {
    if (confirm('Are you sure you want to remove this schedule exception?')) {
      try {
        await deleteException(id);
        const excs = await fetchAdminExceptions();
        setExceptions((excs || []).map(e => ({
          id: String(e.id),
          title: e.title,
          date: e.date,
          type: e.type === 'Closed' ? 'Closed' : 'Custom Hours',
          open: e.customOpen || '09:00',
          close: e.customClose || '17:00',
          active: e.active
        })));
      } catch (err) {
        console.error(err);
        alert('Failed to delete exception');
      }
    }
  };

  const openAddModal = () => {
    setEditingException({ id: '', title: '', date: '', type: 'Closed', open: '09:00', close: '17:00', active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (exc) => {
    setEditingException(exc);
    setIsModalOpen(true);
  };

  const handleSaveException = async (e) => {
    e.preventDefault();
    const payload = {
      title: editingException.title,
      date: editingException.date,
      type: editingException.type,
      customOpen: editingException.type === 'Custom Hours' ? editingException.open : null,
      customClose: editingException.type === 'Custom Hours' ? editingException.close : null,
      active: editingException.active
    };

    try {
      if (!editingException.id) {
        await createException(payload);
      } else {
        await updateException(editingException.id, payload);
      }
      setIsModalOpen(false);
      setEditingException(null);
      // Reload exceptions
      const excs = await fetchAdminExceptions();
      setExceptions((excs || []).map(e => ({
        id: String(e.id),
        title: e.title,
        date: e.date,
        type: e.type === 'Closed' ? 'Closed' : 'Custom Hours',
        open: e.customOpen || '09:00',
        close: e.customClose || '17:00',
        active: e.active
      })));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save exception');
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-[#F3F4F6]">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            {showExceptions ? <Calendar className="w-8 h-8 text-amber-500" /> : <Clock className="w-8 h-8 text-amber-500" />}
            {showExceptions ? 'Schedule Exceptions' : 'Working Hours'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            {showExceptions 
              ? 'Configure holiday closures, staff retreat schedules, and emergency overrides.'
              : 'Define daily operating hours, lunch break slots, and custom day-off schedules.'}
          </p>
        </div>
        {showExceptions ? (
          <button 
            onClick={openAddModal}
            className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Exception
          </button>
        ) : (
          <button 
            onClick={handleSaveSchedule}
            className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Schedule
          </button>
        )}
      </div>

      {/* Conditionally Render standard vs exceptions views */}
      {scheduleLoading || exceptionsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl shadow-sm">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <p className="text-sm text-gray-500 font-semibold">Loading shift details...</p>
        </div>
      ) : !showExceptions ? (
        /* Standard Operating Hours schedule form */
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300">
          <div className="space-y-4">
            
            {/* Day Rows Header */}
            <div className="hidden lg:grid grid-cols-12 gap-6 pb-2 border-b border-gray-100 dark:border-[#1F2937] text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <span className="col-span-2">Day of Week</span>
              <span className="col-span-4">Operating Shift</span>
              <span className="col-span-4">Lunch Break Slot</span>
              <span className="col-span-2 text-right pr-4">Active / Closed Status</span>
            </div>

            {/* Day Rows */}
            {schedule.map((item, idx) => (
              <div 
                key={item.day}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-6 py-4 border-b border-gray-50 dark:border-[#1f2937]/50 last:border-0 items-center transition-opacity duration-300 ${item.closed ? 'opacity-55' : 'opacity-100'}`}
              >
                
                {/* Day Label */}
                <div className="col-span-2 flex items-center gap-2">
                  <span className="font-extrabold text-sm text-gray-900 dark:text-white w-28">{item.day}</span>
                  {item.closed && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full text-[10px] font-bold">
                      <CalendarOff className="w-3 h-3" /> Day Off
                    </span>
                  )}
                </div>

                {/* Operating Shift Time Pickers */}
                <div className="col-span-4 flex items-center gap-2.5">
                  <input 
                    type="time" 
                    value={item.open}
                    disabled={item.closed}
                    onChange={(e) => handleTimeChange(idx, 'open', e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-50 w-full"
                  />
                  <span className="text-gray-400 text-xs font-bold shrink-0">to</span>
                  <input 
                    type="time" 
                    value={item.close}
                    disabled={item.closed}
                    onChange={(e) => handleTimeChange(idx, 'close', e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-50 w-full"
                  />
                </div>

                {/* Break Time Pickers */}
                <div className="col-span-4 flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 text-amber-500/80 hidden lg:block shrink-0" />
                  <input 
                    type="time" 
                    value={item.breakStart}
                    disabled={item.closed}
                    onChange={(e) => handleTimeChange(idx, 'breakStart', e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-50 w-full"
                  />
                  <span className="text-gray-400 text-xs font-bold shrink-0">to</span>
                  <input 
                    type="time" 
                    value={item.breakEnd}
                    disabled={item.closed}
                    onChange={(e) => handleTimeChange(idx, 'breakEnd', e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-50 w-full"
                  />
                </div>

                {/* Day Off Switch Status */}
                <div className="col-span-2 flex justify-start lg:justify-end items-center pr-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!item.closed} 
                      onChange={() => handleToggleClosed(idx)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-gray-250 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-600"></div>
                  </label>
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Schedule Exceptions tab */
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Exceptions</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-semibold">Special dates and calendar overrides</p>
          </div>

          {exceptions.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-bold bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800">
              No schedule exceptions configured.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exceptions.map((exc) => (
                <div 
                  key={exc.id}
                  className={`p-5 border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl flex flex-col justify-between gap-4 hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:shadow-md transition-all group ${!exc.active ? 'opacity-60' : 'opacity-100'}`}
                >
                  <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-xl ${exc.type === 'Closed' ? 'bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-950/10 text-amber-600 dark:text-amber-400'}`}>
                      {exc.type === 'Closed' ? <CalendarOff className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{exc.title}</h3>
                      <div className="text-xs text-gray-400 dark:text-gray-500 font-semibold flex flex-wrap items-center gap-1.5">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 px-2 py-0.5 rounded text-[10px] font-bold">
                          {exc.date}
                        </span>
                        •
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${exc.type === 'Closed' ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/20' : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20'}`}>
                          {exc.type === 'Closed' ? 'Full Closure' : `Custom Hours: ${exc.open} - ${exc.close}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 dark:border-gray-800/80 pt-4 flex justify-between items-center text-xs font-bold text-gray-550">
                    <span className="text-gray-455 text-[10px] uppercase font-black">Exception Status</span>
                    
                    <div className="flex items-center gap-3">
                      {/* Active toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={exc.active} 
                          onChange={() => toggleExceptionStatus(exc)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-200 dark:bg-gray-855 border border-gray-200 dark:border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-600"></div>
                      </label>

                      <button 
                        onClick={() => openEditModal(exc)}
                        className="p-1.5 border border-[#E2E8F0] dark:border-[#1F2937] hover:bg-amber-50 dark:hover:bg-amber-900/10 text-amber-600 rounded-lg cursor-pointer"
                        title="Edit Exception"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => handleDeleteException(exc.id)}
                        className="p-1.5 border border-gray-205 dark:border-gray-850 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg cursor-pointer"
                        title="Delete Exception"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Exception Modal */}
      <AnimatePresence>
        {isModalOpen && editingException && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={() => {
                setIsModalOpen(false);
                setEditingException(null);
              }}
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 transition-colors duration-300 font-semibold text-sm"
            >
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingException(null);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
                {editingException.id ? 'Edit Schedule Exception' : 'Add Schedule Exception'}
              </h3>

              <form onSubmit={handleSaveException} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Exception Label / Reason</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Christmas Day Closure"
                    value={editingException.title} 
                    onChange={(e) => setEditingException({ ...editingException, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Date</label>
                    <input 
                      type="date" 
                      required
                      value={editingException.date} 
                      onChange={(e) => setEditingException({ ...editingException, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Shift Override Type</label>
                    <select 
                      value={editingException.type} 
                      onChange={(e) => setEditingException({ ...editingException, type: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:[&>option]:bg-[#111827]"
                    >
                      <option value="Closed">Fully Closed (Day Off)</option>
                      <option value="Custom Hours">Custom Hours (Special Shift)</option>
                    </select>
                  </div>
                </div>

                {editingException.type === 'Custom Hours' && (
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800/80 pt-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Open Time</label>
                      <input 
                        type="time" 
                        required
                        value={editingException.open} 
                        onChange={(e) => setEditingException({ ...editingException, open: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Close Time</label>
                      <input 
                        type="time" 
                        required
                        value={editingException.close} 
                        onChange={(e) => setEditingException({ ...editingException, close: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingException(null);
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm shadow-amber-500/10"
                  >
                    {editingException.id ? 'Save Exception' : 'Add Exception'}
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
