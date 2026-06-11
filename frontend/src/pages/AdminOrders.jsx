import { motion } from 'framer-motion';
import { Package, Search, Filter, ArrowUpRight, MoreVertical, Clock, CheckCircle2, Truck } from 'lucide-react';

export default function AdminOrders() {
  const stats = [
    { label: 'Total Orders', value: '1,284', trend: '+12.5%', color: 'blue' },
    { label: 'Pending Fulfillment', value: '45', trend: '-2.4%', color: 'amber' },
    { label: 'Completed Today', value: '18', trend: '+5.2%', color: 'emerald' },
  ];

  const orders = [
    { id: '#ORD-2024-001', customer: 'Alice Johnson', items: 'iPhone 13 Pro Max Screen, Battery', total: '$145.00', date: '2026-06-02', status: 'Delivered' },
    { id: '#ORD-2024-002', customer: 'Michael Chen', items: 'MacBook Pro M1 Logic Board', total: '$450.00', date: '2026-06-02', status: 'Processing' },
    { id: '#ORD-2024-003', customer: 'Sarah Williams', items: 'iPad Air 4 Digitizer', total: '$89.99', date: '2026-06-01', status: 'Shipped' },
    { id: '#ORD-2024-004', customer: 'David Martinez', items: 'Samsung S22 Ultra Back Glass', total: '$45.00', date: '2026-06-01', status: 'Delivered' },
    { id: '#ORD-2024-005', customer: 'Emma Thompson', items: 'Apple Watch S7 Battery', total: '$35.50', date: '2026-05-30', status: 'Pending' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Processing': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'Processing': return <Package className="w-4 h-4 mr-1.5" />;
      case 'Shipped': return <Truck className="w-4 h-4 mr-1.5" />;
      case 'Pending': return <Clock className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Repair Orders</h1>
          <p className="text-gray-500 font-medium mt-1">Manage incoming parts and service orders.</p>
        </div>
        <button className="premium-button bg-[#FFDE21] text-white py-2.5 px-5 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]">
          <Package className="w-5 h-5 mr-2" />
          Create Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-[#0F172A]">{stat.value}</h3>
              <span className={`flex items-center text-sm font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend}
                <ArrowUpRight className={`w-4 h-4 ml-1 ${!stat.trend.startsWith('+') && 'rotate-90'}`} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
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
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={order.id} 
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="p-4">
                    <span className="font-bold text-[#0F172A]">{order.id}</span>
                  </td>
                  <td className="p-4 font-medium text-gray-600">{order.customer}</td>
                  <td className="p-4">
                    <p className="text-sm text-gray-500 font-medium truncate max-w-xs">{order.items}</p>
                  </td>
                  <td className="p-4 font-bold text-[#0F172A]">{order.total}</td>
                  <td className="p-4 text-sm font-medium text-gray-500">{order.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-[#FFDE21] hover:bg-amber-50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm font-medium text-gray-500 bg-gray-50/50">
          <span>Showing 1 to 5 of 1,284 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm font-bold text-[#0F172A]">1</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors">2</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}









