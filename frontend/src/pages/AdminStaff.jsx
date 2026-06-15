import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, Shield, Star, Plus, Mail, Phone, Edit, 
  Trash2, Award, Calendar, CheckCircle2, Clock
} from 'lucide-react';

export default function AdminStaff() {
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [staff, setStaff] = useState([
    { id: '1', name: 'Alex Rivera', role: 'Senior Repair Expert', email: 'alex@irepair.com', phone: '+1 (555) 123-4567', rating: 4.9, active: true, load: 3, maxLoad: 5, avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=dbeafe&color=2563eb&bold=true' },
    { id: '2', name: 'Samantha Lee', role: 'Micro-solder Specialist', email: 'sam@irepair.com', phone: '+1 (555) 987-6543', rating: 5.0, active: true, load: 5, maxLoad: 5, avatar: 'https://ui-avatars.com/api/?name=Samantha+Lee&background=fce7f3&color=db2777&bold=true' },
    { id: '3', name: 'Marcus Johnson', role: 'Store Manager', email: 'marcus@irepair.com', phone: '+1 (555) 555-5555', rating: 4.8, active: true, load: 1, maxLoad: 2, avatar: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=d1fae5&color=059669&bold=true' },
    { id: '4', name: 'Emma Watson', role: 'Junior Repair Expert', email: 'emma@irepair.com', phone: '+1 (555) 345-6789', rating: 4.5, active: false, load: 0, maxLoad: 4, avatar: 'https://ui-avatars.com/api/?name=Emma+Watson&background=fff7ed&color=FFDE21&bold=true' },
  ]);

  const toggleStaffStatus = (id) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const getLoadStatusColor = (load, max) => {
    const ratio = load / max;
    if (ratio >= 1) return 'bg-red-500 text-red-500';
    if (ratio >= 0.6) return 'bg-amber-500 text-amber-500';
    return 'bg-emerald-500 text-emerald-500';
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-white">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-300 flex items-center gap-2">
            <UserCheck className="w-8 h-8 text-amber-500" /> Staff Management
          </h1>
          <p className="text-gray-500 dark:text-gray-200 font-medium mt-1">
            Assign repair workloads, manage shifts, and monitor team metrics.
          </p>
        </div>
        <button className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer">
          <Plus className="w-4 h-4" /> Add Repair Expert
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staff.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-500/25 transition-all flex flex-col justify-between h-[340px] group"
          >
            {/* Top Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                
                {/* Active Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={member.active} 
                    onChange={() => toggleStaffStatus(member.id)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-gray-255 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-600"></div>
                </label>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-1.5">
                  {member.name}
                  {member.rating >= 4.9 && <Award className="w-4 h-4 text-amber-500" />}
                </h3>
                <p className="text-xs font-bold text-[#FFDE21] dark:text-[#FFDE21] mt-0.5">{member.role}</p>
              </div>

              {/* Workload Indicator */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-400">
                  <span>Today's Load</span>
                  <span className="text-gray-700 dark:text-gray-100">{member.load} / {member.maxLoad} tasks</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getLoadStatusColor(member.load, member.maxLoad).split(' ')[0]}`}
                    style={{ width: `${(member.load / member.maxLoad) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions/Contacts */}
            <div className="border-t border-gray-100 dark:border-[#1F2937] pt-4 mt-4 space-y-3">
              <div className="flex flex-col gap-1.5 text-xs text-gray-500 dark:text-gray-200 font-semibold">
                <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {member.email}</span>
                <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {member.phone}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs font-bold pt-1.5">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {member.rating.toFixed(1)}</span>
                <button 
                  onClick={() => setSelectedStaff(member)}
                  className="px-3.5 py-1.5 border border-[#E2E8F0] dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Staff Editor Modal */}
      <AnimatePresence>
        {selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={() => setSelectedStaff(null)}
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 transition-colors duration-300 font-semibold text-sm"
            >
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Edit Staff Profile</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Role Designation</label>
                  <select 
                    value={selectedStaff.role}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, role: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:[&>option]:bg-[#111827]"
                  >
                    <option>Senior Repair Expert</option>
                    <option>Micro-solder Specialist</option>
                    <option>Store Manager</option>
                    <option>Junior Repair Expert</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Active Load</label>
                    <input 
                      type="number" 
                      value={selectedStaff.load}
                      onChange={(e) => setSelectedStaff({ ...selectedStaff, load: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Max Threshold</label>
                    <input 
                      type="number" 
                      value={selectedStaff.maxLoad}
                      onChange={(e) => setSelectedStaff({ ...selectedStaff, maxLoad: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => setSelectedStaff(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setStaff(prev => prev.map(s => s.id === selectedStaff.id ? selectedStaff : s));
                      setSelectedStaff(null);
                    }}
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm shadow-amber-500/10"
                  >
                    Save Changes
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










