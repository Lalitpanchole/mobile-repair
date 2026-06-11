import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Plus, Edit, Trash2, CheckCircle2, Image, Move, ArrowUp, ArrowDown, Save, X, Search } from 'lucide-react';

export default function AdminSliders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const [slides, setSlides] = useState([
    { id: '1', title: 'Get Your Screen Fixed Today', subtitle: 'Premium OLED and LCD replacements with lifetime warranty', btnText: 'Book Screen Repair', link: '/book-repair', order: 1, active: true, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
    { id: '2', name: 'Discount Promo banner', title: '10% Off Your First Micro-Soldering Repair', subtitle: 'Certified micro-solder technicians handling water and board failures', btnText: 'Claim Coupon', link: '/book-repair?promo=BOARD10', order: 2, active: true, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
    { id: '3', title: 'Mail-In Device Repair Nationwide', subtitle: 'Ship your device to our tech city center with free diagnostic reports', btnText: 'Start Mail-In Request', link: '/book-repair?type=mail-in', order: 3, active: false, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80' },
  ]);

  const toggleSlideActive = (id) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteSlide = (id) => {
    if (confirm('Are you sure you want to remove this banner slide?')) {
      setSlides(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleOrderChange = (id, direction) => {
    setSlides(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const updated = [...prev];
      const temp = updated[index].order;
      updated[index].order = updated[newIndex].order;
      updated[newIndex].order = temp;
      
      return updated.sort((a, b) => a.order - b.order);
    });
  };

  const openAddModal = () => {
    setEditingSlide({ id: '', title: '', subtitle: '', btnText: 'Learn More', link: '', order: slides.length + 1, active: true, image: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSlide(null);
  };

  const openEditModal = (slide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  const handleSaveSlide = (e) => {
    e.preventDefault();
    if (!editingSlide.id) {
      // Add mode
      const newSlide = {
        ...editingSlide,
        id: Date.now().toString(),
        image: editingSlide.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'
      };
      setSlides(prev => [...prev, newSlide].sort((a, b) => a.order - b.order));
    } else {
      // Edit mode
      setSlides(prev => prev.map(s => s.id === editingSlide.id ? editingSlide : s).sort((a, b) => a.order - b.order));
    }
    handleCloseModal();
  };

  const filteredSlides = slides.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-[#F3F4F6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-8 h-8 text-amber-500" /> Slider Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Configure homepage banners, redirects, button text, and displaying orders.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Slide
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] p-4 rounded-2xl shadow-sm transition-colors duration-300">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search slide titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm font-medium text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSlides.map((slide, idx) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between h-[360px] group transition-all"
            >
              {/* Header Image Cover */}
              <div className="h-40 relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  Order: #{slide.order}
                </div>

                <div className="absolute top-3 right-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={slide.active} 
                      onChange={() => toggleSlideActive(slide.id)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-950/60 border border-slate-700/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Text Information */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1">{slide.title}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1.5 line-clamp-2 leading-relaxed">{slide.subtitle}</p>
                </div>

                {/* Redirect preview details */}
                <div className="border-t border-gray-100 dark:border-[#1F2937] pt-4 flex justify-between items-center text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-450 uppercase font-black">Button Redirect</span>
                    <span className="text-gray-700 dark:text-gray-300 mt-0.5 truncate max-w-[120px]">{slide.btnText} ({slide.link})</span>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOrderChange(slide.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 border border-gray-150 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleOrderChange(slide.id, 'down')}
                      disabled={idx === filteredSlides.length - 1}
                      className="p-1 border border-gray-150 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions footer overlay */}
              <div className="px-5 py-3.5 bg-gray-50 dark:bg-gray-800/10 border-t border-gray-100 dark:border-[#1F2937] flex justify-end gap-2">
                <button 
                  onClick={() => openEditModal(slide)}
                  className="px-3 py-1.5 border border-gray-250 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-amber-900/10 text-amber-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteSlide(slide.id)}
                  className="px-3 py-1.5 border border-gray-250 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add / Edit Slide Modal */}
      <AnimatePresence>
        {isModalOpen && editingSlide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
              onClick={handleCloseModal}
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-2xl w-full max-w-md relative z-10 transition-colors duration-300 font-semibold text-sm"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
                {editingSlide.id ? 'Edit Slide Banner' : 'Create Slide Banner'}
              </h3>

              <form onSubmit={handleSaveSlide} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Slide Title</label>
                  <input 
                    type="text" 
                    required
                    value={editingSlide.title} 
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Subtitle / Description</label>
                  <textarea 
                    required
                    value={editingSlide.subtitle} 
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Button Text</label>
                    <input 
                      type="text" 
                      value={editingSlide.btnText} 
                      onChange={(e) => setEditingSlide({ ...editingSlide, btnText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Button Link Path</label>
                    <input 
                      type="text" 
                      value={editingSlide.link} 
                      onChange={(e) => setEditingSlide({ ...editingSlide, link: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Slide Image URL (Mockup)</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/slide.jpg"
                    value={editingSlide.image} 
                    onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm shadow-amber-500/10"
                  >
                    Save Slide
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









