import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Plus, Edit, Trash2, CheckCircle2, ChevronRight, Eye, Save, X } from 'lucide-react';

export default function AdminPages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  const [pages, setPages] = useState([
    { id: '1', title: 'About Us', slug: 'about-us', metaTitle: 'About MPC Repairs - Certified Specialists', metaDesc: 'Learn about our diagnostic tools and level 3 soldering labs.', status: 'Published', date: 'Oct 24, 2025' },
    { id: '2', title: 'Contact Us & Locations', slug: 'contact', metaTitle: 'Contact MPC Repairs - Tech City Locations', metaDesc: 'Find map locations, opening shifts, and technical email addresses.', status: 'Published', date: 'Oct 25, 2025' },
    { id: '3', title: 'Terms of Lifetime Warranty', slug: 'terms-warranty', metaTitle: 'Lifetime Warranty Policy - MPC Repairs', metaDesc: 'Details regarding component coverage, defect exceptions, and repair rules.', status: 'Draft', date: 'Dec 02, 2025' },
  ]);

  const togglePageStatus = (id) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' } : p));
  };

  const deletePage = (id) => {
    if (confirm('Are you sure you want to delete this content page?')) {
      setPages(prev => prev.filter(p => p.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingPage({ id: '', title: '', slug: '', metaTitle: '', metaDesc: '', status: 'Published', date: new Date().toLocaleDateString() });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
  };

  const openEditModal = (page) => {
    setEditingPage(page);
    setIsModalOpen(true);
  };

  const handleSavePage = (e) => {
    e.preventDefault();
    if (!editingPage.id) {
      const newPage = {
        ...editingPage,
        id: Date.now().toString(),
        slug: editingPage.slug || editingPage.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };
      setPages(prev => [...prev, newPage]);
    } else {
      setPages(prev => prev.map(p => p.id === editingPage.id ? editingPage : p));
    }
    handleCloseModal();
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-300 flex items-center gap-2">
            <FileText className="w-8 h-8 text-amber-500" /> Page Management
          </h1>
          <p className="text-gray-500 dark:text-gray-200 font-medium mt-1">
            Build website content pages, customize routing paths, and modify SEO tags.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Page
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] p-4 rounded-2xl shadow-sm transition-colors duration-300">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search pages by title or slug..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm font-medium text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Pages Grid */}
      <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#1F2937] bg-gray-50/50 dark:bg-gray-800/10 text-xs font-bold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                <th className="p-4 pl-6">Page Details</th>
                <th className="p-4">URL Routing slug</th>
                <th className="p-4">SEO description preview</th>
                <th className="p-4 text-right pr-6">Status / Configure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1F2937]">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-gray-900 dark:text-white">{page.title}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Created: {page.date}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-bold text-amber-600 dark:text-amber-400">
                    /{page.slug}
                  </td>
                  <td className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-200 truncate max-w-xs">
                    {page.metaDesc}
                  </td>
                  <td className="p-4 text-right pr-6 flex items-center justify-end gap-6 h-[61px]">
                    
                    {/* Status switch toggle */}
                    <span 
                      onClick={() => togglePageStatus(page.id)}
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border cursor-pointer select-none transition-colors ${
                        page.status === 'Published' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400' 
                          : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20'
                      }`}
                    >
                      {page.status}
                    </span>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(page)}
                        className="p-1.5 border border-gray-205 dark:border-gray-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 text-amber-600 cursor-pointer"
                        title="Edit Page"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deletePage(page.id)}
                        className="p-1.5 border border-gray-205 dark:border-gray-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 cursor-pointer"
                        title="Delete Page"
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

      {/* Add / Edit Page Modal */}
      <AnimatePresence>
        {isModalOpen && editingPage && (
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
                {editingPage.id ? 'Edit Content Page' : 'Create Content Page'}
              </h3>

              <form onSubmit={handleSavePage} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Page Title</label>
                  <input 
                    type="text" 
                    required
                    value={editingPage.title} 
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">URL slug path</label>
                  <input 
                    type="text" 
                    placeholder="about-us"
                    value={editingPage.slug} 
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div className="border-t border-gray-100 dark:border-[#1F2937] pt-3">
                  <span className="text-[10px] text-gray-400 font-black uppercase">SEO Metadata Tags</span>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">SEO Meta Title</label>
                  <input 
                    type="text" 
                    value={editingPage.metaTitle} 
                    onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">SEO Meta Description</label>
                  <textarea 
                    value={editingPage.metaDesc} 
                    onChange={(e) => setEditingPage({ ...editingPage, metaDesc: e.target.value })}
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
                    Save Page
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









