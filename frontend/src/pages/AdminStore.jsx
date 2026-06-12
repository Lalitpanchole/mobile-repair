import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, MapPin, Phone, Mail, User, Save, 
  Plus, Edit, Trash2, CheckCircle2, Building, X
} from 'lucide-react';

export default function AdminStore() {
  const location = useLocation();
  const showOnlyBranches = location.pathname.endsWith('/branches');

  const [storeName, setStoreName] = useState('MPC Repairs');
  const [storeEmail, setStoreEmail] = useState('mpcrepairskotara@gmail.com');
  const [storePhone, setStorePhone] = useState('+61 426 186 212');
  const [storeAddr, setStoreAddr] = useState('Westfield Kotara, K230, Level 2/89 Northcott Dr, Kotara NSW 2289');

  const [branches, setBranches] = useState([
    { id: '1', name: 'Westfield Kotara', address: 'K230, Level 2/89 Northcott Dr, Kotara NSW 2289', phone: '+61 426 186 212', manager: 'Sarah Jenkins', active: true },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const toggleBranchStatus = (id) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const deleteBranch = (id) => {
    if (confirm('Are you sure you want to remove this branch location?')) {
      setBranches(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleSaveStore = (e) => {
    e.preventDefault();
    alert('Global store parameters updated successfully!');
  };

  const openAddModal = () => {
    setEditingBranch({ id: '', name: '', address: '', phone: '', manager: '', active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleSaveBranch = (e) => {
    e.preventDefault();
    if (!editingBranch.id) {
      const branchRecord = {
        ...editingBranch,
        id: Date.now().toString()
      };
      setBranches(prev => [...prev, branchRecord]);
    } else {
      setBranches(prev => prev.map(b => b.id === editingBranch.id ? editingBranch : b));
    }
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-[#F3F4F6]">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Store className="w-8 h-8 text-amber-500" /> 
            {showOnlyBranches ? 'Branch Locations Directory' : 'Store Management'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            {showOnlyBranches 
              ? 'Add, edit, and toggle active branch outlets for your repair operations.' 
              : 'Configure parameters, billing contacts, and brand descriptions.'}
          </p>
        </div>

        {showOnlyBranches && (
          <button 
            onClick={openAddModal}
            className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer animate-bounce"
          >
            <Plus className="w-4 h-4" /> Add New Branch
          </button>
        )}
      </div>

      {/* Conditionally Render store vs branches views */}
      {!showOnlyBranches ? (
        /* Store Parameters Page */
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 md:p-8 max-w-2xl shadow-sm transition-colors duration-300">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Store Parameters</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-semibold">Primary brand configurations</p>
          </div>
          
          <form onSubmit={handleSaveStore} className="space-y-5 font-semibold text-sm">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Business Name</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Support Email</label>
                <input 
                  type="email" 
                  value={storeEmail} 
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Primary Contact</label>
                <input 
                  type="text" 
                  value={storePhone} 
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Store Address</label>
              <input 
                type="text" 
                value={storeAddr} 
                onChange={(e) => setStoreAddr(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <button 
              type="submit"
              className="premium-button bg-[#FFDE21] text-white flex items-center justify-center gap-2 py-2.5 px-6 shadow-[0_4px_14px_rgba(37,99,235,0.3)] mt-4 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Store Changes
            </button>
          </form>
        </div>
      ) : (
        /* Branches Directory Page */
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Branches</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-semibold">Listing all corporate outlets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((b) => (
              <div 
                key={b.id}
                className="p-5 border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl flex flex-col justify-between gap-4 hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:shadow-md transition-all group"
              >
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 rounded-xl">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{b.name}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5" /> {b.address}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-50 dark:border-gray-800/80 pt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-bold text-gray-500">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {b.phone}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-purple-400" /> Manager: {b.manager}</span>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    {/* Active toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={b.active} 
                        onChange={() => toggleBranchStatus(b.id)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-600"></div>
                    </label>

                    <button 
                      onClick={() => openEditModal(b)}
                      className="p-1.5 border border-[#E2E8F0] dark:border-[#1F2937] hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-500 rounded-lg cursor-pointer"
                      title="Edit Branch"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => deleteBranch(b.id)}
                      className="p-1.5 border border-gray-200 dark:border-gray-850 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg cursor-pointer"
                      title="Delete Branch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Branch Modal */}
      <AnimatePresence>
        {isModalOpen && editingBranch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={() => {
                setIsModalOpen(false);
                setEditingBranch(null);
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
                  setEditingBranch(null);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
                {editingBranch.id ? 'Edit Branch Location' : 'Add Branch Location'}
              </h3>

              <form onSubmit={handleSaveBranch} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Branch Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Uptown Retail Outlet"
                    value={editingBranch.name} 
                    onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Full Address</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 500 Market St, San Francisco, CA"
                    value={editingBranch.address} 
                    onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Phone Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="+61 7 3000 0000"
                      value={editingBranch.phone} 
                      onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Manager Assigned</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={editingBranch.manager} 
                      onChange={(e) => setEditingBranch({ ...editingBranch, manager: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingBranch(null);
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm shadow-amber-500/10"
                  >
                    {editingBranch.id ? 'Save Changes' : 'Add Branch'}
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









