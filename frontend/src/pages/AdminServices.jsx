import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, Shield, Search, Plus, Filter, Edit, 
  Trash2, DollarSign, Clock, Smartphone, Laptop, Tablet, Watch, X 
} from 'lucide-react';

export default function AdminServices() {
  const location = useLocation();
  const showOnlyCategories = location.pathname.endsWith('/categories');

  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState(null);

  const [categories, setCategories] = useState([
    { id: '1', name: 'Phone', iconName: 'Smartphone', count: 2, active: true },
    { id: '2', name: 'Tablet', iconName: 'Tablet', count: 1, active: true },
    { id: '3', name: 'Laptop', iconName: 'Laptop', count: 2, active: true },
    { id: '4', name: 'Watch', iconName: 'Watch', count: 2, active: true },
  ]);

  // Modal State for Categories
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategoryRecord, setEditingCategoryRecord] = useState(null);

  // 2. Services State
  const [services, setServices] = useState([
    { id: '1', name: 'iPhone Screen Replacement', category: 'Phone', price: 149, time: '60 min', rating: 'OLED Premium', active: true, desc: 'Complete display module replacement using original quality screen panels.' },
    { id: '2', name: 'MacBook Battery Service', category: 'Laptop', price: 199, time: '90 min', rating: 'OEM Certified', active: true, desc: 'Safely extract old swollen batteries and install new high-health cells.' },
    { id: '3', name: 'iPad Charging Port Fix', category: 'Tablet', price: 89, time: '120 min', rating: 'Micro-solder', active: true, desc: 'Solder new USB-C/Lightning charging ports to restore connection.' },
    { id: '4', name: 'iPhone Battery Swap', category: 'Phone', price: 79, time: '45 min', rating: '100% Health', active: true, desc: 'Install standard certified replacement battery to restore battery life.' },
    { id: '5', name: 'MacBook Logic Board Diagnostic', category: 'Laptop', price: 299, time: '3-5 days', rating: 'Level 3 Solder', active: false, desc: 'In-depth chip-level trace repair for dead or water damaged MacBooks.' },
    { id: '6', name: 'Apple Watch Screen Repair', category: 'Watch', price: 129, time: '60 min', rating: 'Premium Glass', active: true, desc: 'Professional screen and digitizer replacement for Apple Watch Series.' },
    { id: '7', name: 'Apple Watch Battery Swap', category: 'Watch', price: 69, time: '45 min', rating: '100% Health', active: true, desc: 'Replace degraded watch battery to restore all-day battery life.' },
  ]);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  // Services Handlers
  const toggleStatus = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteService = (id) => {
    if (confirm('Are you sure you want to remove this service?')) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const openAddServiceModal = () => {
    setEditingService({ id: '', name: '', category: 'Phone', price: 99, time: '60 min', rating: 'Premium', active: true, desc: '' });
  };

  const handleServiceSave = (e) => {
    e.preventDefault();
    if (!editingService.id) {
      // Add
      const record = {
        ...editingService,
        id: Date.now().toString()
      };
      setServices(prev => [...prev, record]);
    } else {
      // Edit
      setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
    }
    setEditingService(null);
  };

  // Categories Handlers
  const toggleCategoryStatus = (id) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCategory = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const openAddCatModal = () => {
    setEditingCategoryRecord({ id: '', name: '', iconName: 'Smartphone', active: true });
    setIsCatModalOpen(true);
  };

  const openEditCatModal = (cat) => {
    setEditingCategoryRecord(cat);
    setIsCatModalOpen(true);
  };

  const handleCategorySave = (e) => {
    e.preventDefault();
    if (!editingCategoryRecord.id) {
      // Add
      const record = {
        ...editingCategoryRecord,
        id: Date.now().toString(),
        count: 0
      };
      setCategories(prev => [...prev, record]);
    } else {
      // Edit
      setCategories(prev => prev.map(c => c.id === editingCategoryRecord.id ? { ...c, ...editingCategoryRecord } : c));
    }
    setIsCatModalOpen(false);
    setEditingCategoryRecord(null);
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Smartphone': return Smartphone;
      case 'Tablet': return Tablet;
      case 'Laptop': return Laptop;
      case 'Watch': return Watch;
      default: return Wrench;
    }
  };

  // Filtering Logic
  const filteredServices = services.filter(s => {
    const matchesCat = activeCategoryFilter === 'All' || s.category === activeCategoryFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-[#F3F4F6]">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-8 h-8 text-amber-500" /> 
            {showOnlyCategories ? 'Service Categories' : 'Services Directory'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            {showOnlyCategories 
              ? 'Manage device categories, active groupings, and service filters.' 
              : 'Configure catalog details, pricing structures, and active categories.'}
          </p>
        </div>
        {showOnlyCategories ? (
          <button 
            onClick={openAddCatModal}
            className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        ) : (
          <button 
            onClick={openAddServiceModal}
            className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Service
          </button>
        )}
      </div>

      {/* Conditionally Render views */}
      {!showOnlyCategories ? (
        /* Standard Services list view */
        <>
          {/* Categories Tabs & Search Toolbar */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] p-4 rounded-2xl shadow-sm transition-colors duration-300">
            
            {/* Categories Filters */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button
                onClick={() => setActiveCategoryFilter('All')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategoryFilter === 'All'
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-[#FFDE21] dark:text-[#FFDE21] shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Wrench className="w-4 h-4" />
                All
              </button>
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.iconName);
                const isSelected = activeCategoryFilter === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-[#FFDE21] dark:text-[#FFDE21] shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search services..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm font-medium text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl p-6 flex flex-col justify-between h-[230px] shadow-sm hover:shadow-md hover:border-amber-500/25 transition-all relative group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        {service.category}
                      </span>
                      
                      {/* Status Switch Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={service.active} 
                          onChange={() => toggleStatus(service.id)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-255 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-600"></div>
                      </label>
                    </div>

                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white truncate">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium line-clamp-2 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 dark:border-[#1F2937] pt-4 mt-4">
                    <div className="flex gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-emerald-500" /> {service.price}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-500" /> {service.time}</span>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingService(service)}
                        className="p-1.5 border border-[#E2E8F0] dark:border-[#1F2937] hover:bg-amber-50 dark:hover:bg-amber-900/20 text-[#FFDE21] dark:text-[#FFDE21] rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteService(service.id)}
                        className="p-1.5 border border-[#E2E8F0] dark:border-[#1F2937] hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        /* Categories list view */
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Categories</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-semibold">Device types and catalogs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.iconName);
              return (
                <div 
                  key={cat.id}
                  className={`p-5 border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl flex flex-col justify-between gap-4 hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:shadow-md transition-all group ${!cat.active ? 'opacity-60' : ''}`}
                >
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 rounded-xl">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{cat.name}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                        {services.filter(s => s.category === cat.name).length} services linked
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 dark:border-gray-800/85 pt-4 flex justify-between items-center text-xs font-bold text-gray-500">
                    <span className="text-gray-450 text-[10px] uppercase font-black">Status</span>

                    <div className="flex items-center gap-3">
                      {/* Active toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={cat.active} 
                          onChange={() => toggleCategoryStatus(cat.id)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-200 dark:bg-gray-850 border border-gray-200 dark:border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-600"></div>
                      </label>

                      <button 
                        onClick={() => openEditCatModal(cat)}
                        className="p-1.5 border border-[#E2E8F0] dark:border-[#1F2937] hover:bg-amber-50 dark:hover:bg-amber-900/10 text-amber-600 rounded-lg cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1.5 border border-[#E2E8F0] dark:border-[#1F2937] hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit / Add Service Modal */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={() => setEditingService(null)}
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 transition-colors duration-300 font-semibold text-sm"
            >
              <button 
                onClick={() => setEditingService(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>

              <form onSubmit={handleServiceSave} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Service Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Phone Charging Port Repair"
                    value={editingService.name} 
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Price ($)</label>
                    <input 
                      type="number" 
                      required
                      value={editingService.price} 
                      onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Duration</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 45 min"
                      value={editingService.time} 
                      onChange={(e) => setEditingService({ ...editingService, time: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Quality / Rating Label</label>
                    <input 
                      type="text" 
                      placeholder="e.g. OEM Certified"
                      value={editingService.rating} 
                      onChange={(e) => setEditingService({ ...editingService, rating: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Category</label>
                    <select 
                      value={editingService.category} 
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:[&>option]:bg-[#111827]"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Description</label>
                  <textarea 
                    required
                    placeholder="Provide a detailed description of the diagnostic and repair process..."
                    value={editingService.desc} 
                    onChange={(e) => setEditingService({ ...editingService, desc: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm shadow-amber-500/10"
                  >
                    {editingService.id ? 'Save Changes' : 'Add Service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit / Add Category Modal */}
      <AnimatePresence>
        {isCatModalOpen && editingCategoryRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={() => {
                setIsCatModalOpen(false);
                setEditingCategoryRecord(null);
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
                  setIsCatModalOpen(false);
                  setEditingCategoryRecord(null);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
                {editingCategoryRecord.id ? 'Edit Category' : 'Add Category'}
              </h3>

              <form onSubmit={handleCategorySave} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Category Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Audio Devices"
                    value={editingCategoryRecord.name} 
                    onChange={(e) => setEditingCategoryRecord({ ...editingCategoryRecord, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Icon Visual representation</label>
                  <select 
                    value={editingCategoryRecord.iconName} 
                    onChange={(e) => setEditingCategoryRecord({ ...editingCategoryRecord, iconName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:[&>option]:bg-[#111827]"
                  >
                    <option value="Smartphone">Smartphone Icon</option>
                    <option value="Tablet">Tablet Icon</option>
                    <option value="Laptop">Laptop Icon</option>
                    <option value="Watch">Watch Icon</option>
                    <option value="Wrench">Wrench Tool Icon</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsCatModalOpen(false);
                      setEditingCategoryRecord(null);
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm shadow-amber-500/10"
                  >
                    {editingCategoryRecord.id ? 'Save Changes' : 'Add Category'}
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










