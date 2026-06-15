import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, Clock, Search, MoreVertical, 
  CalendarCheck, MapPin, User, Package, Truck, X, Plus, Loader2 
} from 'lucide-react';
import { 
  fetchAdminBookings, 
  updateBookingStatus, 
  deleteAdminBooking, 
  createAdminBooking 
} from '../services/api';

export default function AdminBookings({ hideTabs = false, defaultTab: propDefaultTab }) {
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterToday, setFilterToday] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const location = useLocation();
  
  // URL Search query support (e.g. for header search navigation: /admin/bookings?search=BKG-0002)
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('search');

  const defaultTab = propDefaultTab || location.state?.defaultTab || 'Total Bookings';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBookings();
      const list = data.bookings || data || [];
      const formatted = list.map(b => ({
        ...b,
        id: b.id,
        bookingNumber: b.bookingNumber || `BKG-${b.id}`,
        customer: b.customerName,
        device: b.deviceModel,
        issue: b.partQuality ? `${b.repairName} (${b.partQuality})` : b.repairName,
        date: b.dateStr ? (() => {
          const d = new Date(b.dateStr);
          if (isNaN(d.getTime())) return b.dateStr;
          const monthsList = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          return `${monthsList[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
        })() : 'N/A',
        time: b.timeSlot,
        type: b.deviceType || 'In-Store',
        price: `A$${Number(b.finalPrice || 0).toFixed(2)}`,
        desc: b.notes || 'No description provided.',
        phone: b.customerPhone,
        email: b.customerEmail,
        brand: b.deviceBrand,
      }));
      setBookingList(formatted);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Update searchQuery if query param 'search' exists
  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    if (propDefaultTab) {
      setActiveTab(propDefaultTab);
    } else if (location.state?.defaultTab) {
      setActiveTab(location.state.defaultTab);
    }
  }, [location.state, propDefaultTab]);

  // New Appointment modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newDevice, setNewDevice] = useState('');
  const [newIssue, setNewIssue] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDate, setNewDate] = useState('Today');
  const [newType, setNewType] = useState('In-Store');
  const [newTech, setNewTech] = useState('Unassigned');
  const [newStatus, setNewStatus] = useState('Pending');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-25';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-25';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-25';
      case 'Rejected': 
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-25';
    }
  };

  const getCardStyle = (status) => {
    switch (status) {
      case 'Completed': 
        return 'bg-emerald-50/40 border-l-4 border-l-emerald-500 border-t border-r border-b border-emerald-100';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-red-50/40 border-l-4 border-l-red-500 border-t border-r border-b border-red-100';
      default: 
        return 'bg-white border-l-4 border-l-[#FFDE21] border-t border-r border-b border-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'In-Store': return <MapPin className="w-4 h-4 text-amber-500" />;
      case 'Mail-In': return <Package className="w-4 h-4 text-purple-500" />;
      case 'On-Site': return <Truck className="w-4 h-4 text-emerald-500" />;
      default: return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  };

  const statusFilteredBookings = (bookingList || []).filter(b => {
    if (activeTab === 'Total Bookings') return true;
    if (activeTab === 'New Bookings') return b.status === 'Pending';
    if (activeTab === 'Completed Bookings') return b.status === 'Completed';
    if (activeTab === 'Rejected Bookings') return b.status === 'Rejected' || b.status === 'Cancelled';
    return true;
  });

  const filteredBookings = statusFilteredBookings.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (b.customer && String(b.customer).toLowerCase().includes(q)) ||
      (b.device && String(b.device).toLowerCase().includes(q)) ||
      (b.id && String(b.id).toLowerCase().includes(q)) ||
      (b.bookingNumber && String(b.bookingNumber).toLowerCase().includes(q)) ||
      (b.issue && String(b.issue).toLowerCase().includes(q));
      
    let isToday = false;
    if (b.dateStr) {
      const bDate = new Date(b.dateStr);
      const today = new Date();
      isToday = bDate.getUTCFullYear() === today.getFullYear() &&
                bDate.getUTCMonth() === today.getMonth() &&
                bDate.getUTCDate() === today.getDate();
    }
    const matchesToday = !filterToday || isToday;
    
    return matchesSearch && matchesToday;
  });

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      loadBookings();
    } catch (err) {
      console.error(err);
    }
    setActiveDropdownId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteAdminBooking(id);
        loadBookings();
      } catch (err) {
        console.error(err);
      }
    }
    setActiveDropdownId(null);
  };

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    if (!newCustomer.trim() || !newDevice.trim()) return;

    let dateStr = '';
    const now = new Date();
    if (newDate === 'Today') {
      dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    } else if (newDate === 'Tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateStr = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`;
    } else {
      dateStr = newDate;
    }

    const newBooking = {
      customerName: newCustomer,
      customerPhone: 'N/A',
      customerEmail: 'admin@gmail.com',
      deviceBrand: 'Apple',
      deviceType: newType || 'In-Store',
      deviceModel: newDevice,
      repairName: newIssue || 'Diagnostics',
      partQuality: null,
      finalPrice: 0,
      repairSnapshot: {
        brand: 'Apple',
        deviceType: newType || 'In-Store',
        model: newDevice,
        repair: newIssue || 'Diagnostics',
        quality: 'Standard',
        price: 0,
        warranty: 'N/A'
      },
      dateStr: dateStr,
      timeSlot: newTime,
      branchId: 1,
      notes: '',
      createdSource: 'admin'
    };

    try {
      await createAdminBooking(newBooking);
      setIsModalOpen(false);
      // Reset Form
      setNewCustomer('');
      setNewDevice('');
      setNewIssue('');
      setNewTime('10:00 AM');
      setNewDate('Today');
      setNewType('In-Store');
      setNewTech('Unassigned');
      setNewStatus('Pending');
      loadBookings();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create booking');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">{activeTab}</h1>
          <p className="text-gray-500 font-medium mt-1">
            {activeTab === 'Total Bookings' && 'Complete master list of all bookings.'}
            {activeTab === 'New Bookings' && 'Review and manage incoming pending appointments.'}
            {activeTab === 'Completed Bookings' && 'History of successfully completed repairs.'}
            {activeTab === 'Rejected Bookings' && 'History of rejected or cancelled bookings.'}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="premium-button bg-[#FFDE21] text-white py-2.5 px-5 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] border-0 flex items-center gap-2 cursor-pointer font-bold rounded-xl"
        >
          <CalendarIcon className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Tabs */}
        {!hideTabs && (
          <div className="flex overflow-x-auto border-b border-gray-100 bg-white">
            {['Total Bookings', 'New Bookings', 'Completed Bookings', 'Rejected Bookings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors border-0 bg-transparent cursor-pointer ${
                  activeTab === tab 
                    ? 'border-[#FFDE21] text-[#0F172A]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, device or ID..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setFilterToday(!filterToday)}
              className={`flex-grow sm:flex-none items-center gap-2 px-4 py-2.5 font-bold border rounded-xl transition-colors flex justify-center cursor-pointer ${
                filterToday 
                  ? 'bg-[#FFDE21] text-white border-[#FFDE21]' 
                  : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
              Today Only
            </button>
          </div>
        </div>

        {/* Responsive Card Layout */}
        <div className="p-4 sm:p-6 bg-gray-50/30">
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <Loader2 className="w-10 h-10 text-[#FFDE21] animate-spin mb-4" />
                <p className="text-sm text-gray-500 font-semibold">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-bold bg-white rounded-2xl border border-gray-100">
                No bookings found.
              </div>
            ) : (
              filteredBookings.map((booking, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={booking.id}
                  className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group ${getCardStyle(booking.status)}`}
                >
                  <div className="flex-1 flex flex-col md:flex-row gap-6 w-full">
                    {/* Customer Info */}
                    <div className="flex-[1.5]">
                      <div className="flex justify-between items-start md:block">
                        <span className="text-[11px] font-black tracking-widest text-gray-400 mb-1 block">{booking.bookingNumber || booking.id}</span>
                        <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl">{booking.customer}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold border border-gray-200 shadow-sm">
                          {booking.device.replace(/\s*\(\d{4}\)/g, '')}
                        </span>
                        <span className="text-sm font-bold text-gray-400">•</span>
                        <span className="text-sm font-bold text-gray-600">{booking.issue}</span>
                        {booking.price && (
                          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 shadow-sm">
                            {booking.price}
                          </span>
                        )}
                      </div>
                      {booking.notes && (
                        <p className="text-xs font-medium text-gray-500 mt-2.5 italic flex items-start gap-1 bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                          <span className="text-amber-600 font-bold">Note:</span> {booking.notes}
                        </p>
                      )}
                    </div>
                    
                    {/* Date & Location */}
                    <div className="flex-1 flex flex-col gap-2.5 justify-center">
                      <div className="flex items-center gap-2.5 text-sm font-extrabold text-gray-700">
                        <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-2.5 text-sm font-extrabold text-gray-600">
                        <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                          {getTypeIcon(booking.type)}
                        </div>
                        {booking.type}
                      </div>
                    </div>

                    {/* Status & Tech */}
                    <div className="flex-1 flex flex-col items-start lg:items-end justify-center gap-2.5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(booking.status)}`}>
                        • {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full lg:w-auto flex justify-end gap-2 pt-4 lg:pt-0 border-t border-gray-100 lg:border-0 mt-2 lg:mt-0 shrink-0">
                    <button 
                      onClick={() => setSelectedBookingDetails(booking)}
                      className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all border border-gray-200 shadow-sm hover:shadow cursor-pointer"
                    >
                      View Details
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setActiveDropdownId(activeDropdownId === booking.id ? null : booking.id)}
                        className="p-2 bg-white hover:bg-amber-50 text-gray-400 hover:text-amber-600 rounded-xl transition-all border border-gray-200 shadow-sm hover:shadow cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {activeDropdownId === booking.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-150 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-2 text-left text-xs font-bold text-gray-750">
                            <button 
                              onClick={() => { handleUpdateStatus(booking.id, 'Completed'); setActiveDropdownId(null); }}
                              className="w-full px-4 py-2.5 hover:bg-emerald-50 text-left flex items-center gap-2.5 border-0 bg-transparent cursor-pointer text-emerald-700 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span> Mark Completed
                            </button>
                            <button 
                              onClick={() => { handleUpdateStatus(booking.id, 'Rejected'); setActiveDropdownId(null); }}
                              className="w-full px-4 py-2.5 hover:bg-red-50 text-left flex items-center gap-2.5 border-0 bg-transparent cursor-pointer text-red-600 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span> Reject
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                              onClick={() => { handleUpdateStatus(booking.id, 'Confirmed'); setActiveDropdownId(null); }}
                              className="w-full px-4 py-2.5 hover:bg-gray-50 text-left flex items-center gap-2.5 border-0 bg-transparent cursor-pointer text-gray-700 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full bg-gray-400 shadow-sm shadow-gray-400/50"></span> Mark Confirmed
                            </button>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Appointment Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 text-sm font-semibold"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-650 hover:bg-gray-50 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <form onSubmit={handleSaveAppointment} className="space-y-4">
                <div>
                  <span className="bg-amber-105 text-[#FFDE21] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Booking Registry
                  </span>
                  <h3 className="text-lg font-black text-gray-900 mt-2">New Appointment</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer Name</label>
                    <input 
                      type="text" 
                      required
                      value={newCustomer}
                      onChange={(e) => setNewCustomer(e.target.value)}
                      placeholder="e.g. Liam Smith"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Device Name</label>
                    <input 
                      type="text" 
                      required
                      value={newDevice}
                      onChange={(e) => setNewDevice(e.target.value)}
                      placeholder="e.g. iPad Pro 11"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Repair Issue</label>
                    <input 
                      type="text" 
                      required
                      value={newIssue}
                      onChange={(e) => setNewIssue(e.target.value)}
                      placeholder="e.g. Broken Charger Port"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time Slot</label>
                      <input 
                        type="text" 
                        required
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        placeholder="e.g. 10:30 AM"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</label>
                      <select 
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 font-bold"
                      >
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="Next Monday">Next Monday</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Service Type</label>
                      <select 
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 font-bold"
                      >
                        <option value="In-Store">In-Store</option>
                        <option value="Mail-In">Mail-In</option>
                        <option value="On-Site">On-Site</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                      <select 
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 font-bold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Assign Expert</label>
                    <select 
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-250 rounded-xl focus:outline-none focus:border-[#FFDE21] text-sm text-gray-850 font-bold"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Alex">Alex</option>
                      <option value="Sarah">Sarah</option>
                      <option value="James">James</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors border-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer border-0 shadow-sm"
                  >
                    Save Appointment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appointment Detail Modal Popup */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={() => setSelectedBookingDetails(null)}
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 transition-colors duration-300 font-semibold text-sm"
            >
              <button 
                onClick={() => setSelectedBookingDetails(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-5">
                <div>
                  <span className="bg-amber-100 dark:bg-amber-900/20 text-[#FFDE21] dark:text-[#FFDE21] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Booking Detail
                  </span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-2">{selectedBookingDetails.title || `${selectedBookingDetails.customer} with ${selectedBookingDetails.device.replace(/\s*\(\d{4}\)/g, '')}`}</h3>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-5 custom-scrollbar">
                  {/* Customer Group */}
                  <div className="bg-gray-50/50 dark:bg-[#1F2937]/30 rounded-2xl border border-[#E2E8F0] dark:border-[#1F2937] p-5 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">Customer Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Name</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{selectedBookingDetails.customer || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Phone</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{selectedBookingDetails.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Email</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right break-all">{selectedBookingDetails.email || 'N/A'}</span>
                      </div>
                      {selectedBookingDetails.notes && (
                        <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1F2937] mt-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-bold block mb-1">Message / Notes</span>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#111827] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937]">
                            {selectedBookingDetails.notes}
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
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{selectedBookingDetails.brand || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Model</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{selectedBookingDetails.device ? selectedBookingDetails.device.replace(/\s*\(\d{4}\)/g, '') : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Selected Repair(s)</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{selectedBookingDetails.issue || 'Diagnostics'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0] dark:border-[#1F2937] mt-3">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Repair Price</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 px-3 py-1 rounded-xl shadow-sm">
                          {selectedBookingDetails.price || 'Pending'}
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
                          selectedBookingDetails.status === 'Completed' ? 'text-emerald-600' :
                          selectedBookingDetails.status === 'Rejected' ? 'text-red-600' :
                          'text-amber-500'
                        }`}>{selectedBookingDetails.status || 'Pending'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Location</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{selectedBookingDetails.location || 'In-Store'}</span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Date</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">
                          {selectedBookingDetails.dateStr ? (() => {
                            const d = new Date(selectedBookingDetails.dateStr);
                            const monthsList = [
                              'January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'
                            ];
                            return `${monthsList[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
                          })() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 dark:text-gray-400 font-bold">Time Window</span>
                        <span className="font-extrabold text-gray-900 dark:text-white text-right">{selectedBookingDetails.time || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => setSelectedBookingDetails(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer border-0"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}









