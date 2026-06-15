import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Plus, Edit, Trash2, Star, User, Save, X } from 'lucide-react';

export default function AdminTestimonials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [testimonials, setTestimonials] = useState([
    { id: '1', name: 'Sarah Jenkins', role: 'Google User', rating: 5, date: '1 month ago', active: true, comment: 'Very prompt service and overall waiting time was convenient. The repair made the phone look as new and the technician was generous enough to throw in a free screen protector.' },
    { id: '2', name: 'Michael Chen', role: 'Google User', rating: 5, date: '1 month ago', active: true, comment: 'Walked in with a completely broken screen and cracked back glass on my iPhone 13 Pro, and within an hour, left with it good as new.' },
    { id: '3', name: 'Emma Thompson', role: 'Google User', rating: 5, date: '2 months ago', active: true, comment: 'I recently had my phone repaired at this shop, and the experience was outstanding from start to finish. The team was professional, knowledgeable, and transparent.' },
  ]);

  const toggleReviewActive = (id) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const deleteReview = (id) => {
    if (confirm('Are you sure you want to delete this customer testimonial review?')) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingReview({ id: '', name: '', role: 'Google User', rating: 5, date: 'Just now', active: true, comment: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const openEditModal = (review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!editingReview.id) {
      const newReview = {
        ...editingReview,
        id: Date.now().toString()
      };
      setTestimonials(prev => [...prev, newReview]);
    } else {
      setTestimonials(prev => prev.map(t => t.id === editingReview.id ? editingReview : t));
    }
    handleCloseModal();
  };

  const filteredReviews = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-300 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-amber-500" /> Testimonials Moderator
          </h1>
          <p className="text-gray-500 dark:text-gray-200 font-medium mt-1">
            Approve reviews to display on the public landing page, manage customer ratings, and add manual entries.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="premium-button bg-[#FFDE21] text-white flex items-center whitespace-nowrap gap-2 px-5 py-2.5 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] border-0 cursor-pointer font-bold rounded-xl"
        >
          <Plus className="w-4 h-4 shrink-0" /> Add Testimonial
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] p-4 rounded-2xl shadow-sm transition-colors duration-300">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search reviews by name or text..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm font-medium text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#1F2937] bg-gray-50/50 dark:bg-gray-800/10 text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Rating Index</th>
                <th className="p-4">Review content comment</th>
                <th className="p-4 text-right pr-6">Visible / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1F2937]">
              {filteredReviews.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                        <User className="w-4.5 h-4.5 text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">{item.name}</span>
                        <span className="text-[10px] text-gray-450 mt-0.5">{item.role} ({item.date})</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex text-[#FFDE21] gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-850'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-200 max-w-xs truncate">
                    "{item.comment}"
                  </td>
                  <td className="p-4 text-right pr-6 flex items-center justify-end gap-6 h-[65px]">
                    {/* Switch layout */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={item.active} 
                        onChange={() => toggleReviewActive(item.id)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-255 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-600"></div>
                    </label>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="p-1.5 border border-gray-205 dark:border-gray-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 text-amber-600 cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteReview(item.id)}
                        className="p-1.5 border border-gray-205 dark:border-gray-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Testimonial Modal */}
      <AnimatePresence>
        {isModalOpen && editingReview && (
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
                {editingReview.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>

              <form onSubmit={handleSaveReview} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Customer Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingReview.name} 
                    onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Designation / Role</label>
                  <input 
                    type="text" 
                    value={editingReview.role} 
                    onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Rating (Click Stars)</label>
                  <div className="flex text-[#FFDE21] gap-1.5 py-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        onClick={() => setEditingReview({ ...editingReview, rating: i + 1 })}
                        className={`w-6 h-6 cursor-pointer hover:scale-110 transition-transform ${
                          i < editingReview.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Review Comment</label>
                  <textarea 
                    required
                    value={editingReview.comment} 
                    onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#FFDE21] text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm shadow-amber-500/10"
                  >
                    Save Review
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









