import { motion } from 'framer-motion';
import { Star, Search, Filter, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export default function AdminReviews() {
  const reviews = [
    { id: 'REV-101', customer: 'Alice Johnson', rating: 5, date: '1 day ago', text: 'Amazing service! They fixed my iPhone screen in under an hour. Highly recommend.', status: 'Published' },
    { id: 'REV-102', customer: 'Michael Chen', rating: 4, date: '3 days ago', text: 'Good repair on my MacBook, but it took an extra day for the parts to arrive.', status: 'Published' },
    { id: 'REV-103', customer: 'Sarah Williams', rating: 5, date: '1 week ago', text: 'Very professional. The tracking system kept me updated the whole time.', status: 'Published' },
    { id: 'REV-104', customer: 'David Martinez', rating: 2, date: '2 weeks ago', text: 'Price was a bit higher than quoted over the phone.', status: 'Hidden' },
    { id: 'REV-105', customer: 'Emma Thompson', rating: 5, date: '1 month ago', text: 'Replaced my Apple Watch battery and it works like new again!', status: 'Published' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Hidden': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-[#FFDE21] fill-[#FFDE21]' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Customer Reviews</h1>
          <p className="text-gray-500 font-medium mt-1">Manage testimonials and monitor customer satisfaction.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-black text-[#0F172A]">4.8</span>
            <div className="flex">{renderStars(5)}</div>
            <span className="text-sm font-bold text-gray-400 ml-1">(240)</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reviews by name or keyword..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-gray-600 font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/5">Review</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={review.id} 
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0F172A]">{review.customer}</span>
                      <span className="text-xs font-bold text-gray-400 mt-1">{review.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-0.5">
                      {renderStars(review.rating)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-600 line-clamp-2">{review.text}</p>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-500">{review.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(review.status)}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Publish">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hide">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#FFDE21] hover:bg-amber-50 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}









