import { motion } from 'framer-motion';
import { DollarSign, Search, Filter, MoreVertical, CreditCard, ArrowDownToLine, Receipt } from 'lucide-react';

export default function AdminPayments() {
  const transactions = [
    { id: 'TXN-9021', invoice: 'INV-4012', customer: 'Alice Johnson', amount: '$145.00', date: 'Jun 02, 2026', method: 'Credit Card', status: 'Completed' },
    { id: 'TXN-9022', invoice: 'INV-4013', customer: 'Michael Chen', amount: '$450.00', date: 'Jun 02, 2026', method: 'Apple Pay', status: 'Pending' },
    { id: 'TXN-9023', invoice: 'INV-4014', customer: 'Sarah Williams', amount: '$89.99', date: 'Jun 01, 2026', method: 'Debit Card', status: 'Completed' },
    { id: 'TXN-9024', invoice: 'INV-4015', customer: 'David Martinez', amount: '$45.00', date: 'Jun 01, 2026', method: 'Cash', status: 'Refunded' },
    { id: 'TXN-9025', invoice: 'INV-4016', customer: 'Emma Thompson', amount: '$35.50', date: 'May 30, 2026', method: 'Credit Card', status: 'Failed' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Refunded': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Failed': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Payments & Invoices</h1>
          <p className="text-gray-500 font-medium mt-1">Manage transactions, issue refunds, and generate invoices.</p>
        </div>
        <div className="flex gap-3">
          <button className="premium-button bg-white text-[#0F172A] border border-gray-200 hover:bg-gray-50 py-2.5 px-4 shadow-sm">
            <ArrowDownToLine className="w-5 h-5 mr-2" />
            Export CSV
          </button>
          <button className="premium-button bg-[#FFDE21] text-white py-2.5 px-5 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]">
            <Receipt className="w-5 h-5 mr-2" />
            New Invoice
          </button>
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
              placeholder="Search by TXN, invoice, or customer..." 
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
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((txn, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={txn.id} 
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0F172A]">{txn.id}</span>
                      <span className="text-xs font-bold text-gray-400 mt-1">Inv: {txn.invoice}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-700">{txn.customer}</td>
                  <td className="p-4 font-medium text-gray-500">{txn.date}</td>
                  <td className="p-4">
                    <span className="font-bold text-[#0F172A] text-lg">{txn.amount}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      {txn.method}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(txn.status)}`}>
                      {txn.status}
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
      </div>
    </div>
  );
}









