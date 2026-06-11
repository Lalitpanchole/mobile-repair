import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, CheckCircle2, ChevronRight, Sliders, Image } from 'lucide-react';

export default function AdminPlaceholder({ title }) {
  const [search, setSearch] = useState('');
  
  // Custom mock data depending on the page title
  const getMockData = () => {
    switch (title) {
      case 'Slider Management':
        return [
          { id: '1', name: 'Hero Main banner', detail: 'Welcome to MPC Repairs banner', date: 'Oct 24, 2025', active: true },
          { id: '2', name: 'Discount Promo slide', detail: '10% off for new customers banner', date: 'Nov 01, 2025', active: true },
          { id: '3', name: 'Winter Offer slider', detail: 'Free glass protection slide', date: 'Jan 10, 2026', active: false },
        ];
      case 'Home Video':
        return [
          { id: '1', name: 'Intro Explainer video', detail: 'How MPC Repairs process works (YouTube link)', date: 'Sep 12, 2025', active: true },
        ];
      case 'Page Management':
        return [
          { id: '1', name: 'About Us Page', detail: '/about-us route content layout', date: 'Oct 10, 2025', active: true },
          { id: '2', name: 'Contact Us Page', detail: '/contact route phone/email/maps', date: 'Oct 11, 2025', active: true },
          { id: '3', name: 'Privacy Policy', detail: 'Terms and data conditions page details', date: 'Dec 02, 2025', active: true },
        ];
      case 'Testimonial':
        return [
          { id: '1', name: 'Sarah Jenkins Review', detail: 'Google testimonial - 5 stars', date: 'Oct 29, 2025', active: true },
          { id: '2', name: 'Michael Chen Review', detail: 'Vocal video testimony file links', date: 'Nov 02, 2025', active: true },
          { id: '3', name: 'Emma Thompson Review', detail: 'In-store kiosk rating survey log', date: 'Nov 12, 2025', active: true },
        ];
      default:
        return [
          { id: '1', name: 'General list entry', detail: 'Standard parameters details item', date: 'Nov 03, 2025', active: true },
        ];
    }
  };

  const [items, setItems] = useState(getMockData());

  const toggleItemActive = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-[#F3F4F6]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            {title === 'Slider Management' && <Sliders className="w-8 h-8 text-amber-500" />}
            {title === 'Home Video' && <Image className="w-8 h-8 text-amber-500" />}
            <span>{title}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Configure dynamic contents, view parameters list, and toggle activation filters.
          </p>
        </div>
        <button className="premium-button bg-[#FFDE21] text-white flex items-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer">
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Toolbar controls */}
      <div className="flex justify-between items-center bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] p-4 rounded-2xl shadow-sm transition-colors duration-300">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm font-medium text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Main List Box */}
      <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#1F2937] bg-gray-50/50 dark:bg-gray-800/10 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Record Details</th>
                <th className="p-4">Description Info</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right pr-6">Status / Configure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1F2937]">
              {items
                .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
                .map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors">
                    <td className="p-4 pl-6">
                      <span className="font-extrabold text-sm text-gray-900 dark:text-white">{item.name}</span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400">{item.detail}</td>
                    <td className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400">{item.date}</td>
                    <td className="p-4 text-right pr-6 flex items-center justify-end gap-6 h-[53px]">
                      {/* Active Status switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={item.active} 
                          onChange={() => toggleItemActive(item.id)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-255 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-600"></div>
                      </label>

                      <div className="flex gap-2">
                        <button className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 text-amber-600 cursor-pointer">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 cursor-pointer">
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
    </div>
  );
}









