import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, MoreHorizontal, 
  ChevronDown, X, Phone, Mail, 
  ShoppingBag, DollarSign, TrendingUp,
  ArrowUpRight, Edit, Trash2
} from 'lucide-react';

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for stats
  const stats = [
    { title: 'Total Customers', value: '1,204', change: '+12.5%', positive: true, icon: Users },
    { title: 'Active (30 days)', value: '842', change: '+8.2%', positive: true, icon: TrendingUp },
    { title: 'Average Value', value: '$324.50', change: '+4.5%', positive: true, icon: DollarSign },
    { title: 'New This Month', value: '128', change: '+15.3%', positive: true, icon: UserPlus },
  ];

  // Mock data for customers
  const initialCustomers = [
    { id: 'CUS-001', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '+1 (555) 123-4567', orders: 5, spent: '$849.00', status: 'Active', lastActive: '2 hours ago', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=eff6ff&color=2563eb' },
    { id: 'CUS-002', name: 'Bob Smith', email: 'bob.smith@example.com', phone: '+1 (555) 987-6543', orders: 2, spent: '$499.00', status: 'Active', lastActive: '1 day ago', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=f0fdf4&color=16a34a' },
    { id: 'CUS-003', name: 'Charlie Brown', email: 'charlie.b@example.com', phone: '+1 (555) 456-7890', orders: 1, spent: '$89.00', status: 'Inactive', lastActive: '2 months ago', avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=fef2f2&color=dc2626' },
    { id: 'CUS-004', name: 'Diana Prince', email: 'diana.p@example.com', phone: '+1 (555) 234-5678', orders: 8, spent: '$1,299.00', status: 'Active', lastActive: '5 mins ago', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince&background=faf5ff&color=9333ea' },
    { id: 'CUS-005', name: 'Evan Wright', email: 'evan.w@example.com', phone: '+1 (555) 345-6789', orders: 3, spent: '$199.00', status: 'Inactive', lastActive: '3 weeks ago', avatar: 'https://ui-avatars.com/api/?name=Evan+Wright&background=fffbeb&color=d97706' },
    { id: 'CUS-006', name: 'Fiona Gallagher', email: 'fiona.g@example.com', phone: '+1 (555) 876-5432', orders: 4, spent: '$650.00', status: 'Active', lastActive: '4 days ago', avatar: 'https://ui-avatars.com/api/?name=Fiona+Gallagher&background=eff6ff&color=2563eb' },
  ];

  const [customers] = useState(initialCustomers);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Customers</h1>
          <p className="text-[#64748B] font-medium mt-1">Manage and view your customer base and their repair history.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto premium-button bg-[#FFDE21] text-white flex items-center justify-center gap-2 px-5 py-2.5 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
        >
          <UserPlus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              variants={itemVariants}
              key={index}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`flex items-center text-sm font-bold ${stat.positive ? 'text-[#22C55E] bg-green-50' : 'text-red-600 bg-red-50'} px-2.5 py-1 rounded-full`}>
                  {stat.positive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-[#64748B] text-sm font-semibold mb-1">{stat.title}</h3>
                <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Controls: Search & Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white p-4 rounded-t-2xl border border-[#E2E8F0] border-b-0 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]"
      >
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, email or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar hide-scrollbar-on-mobile">
          {['All', 'Active', 'Inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                selectedStatus === status 
                  ? 'bg-[#FFDE21] text-white shadow-md' 
                  : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
          <button className="px-4 py-2 bg-white text-[#0F172A] border border-[#E2E8F0] rounded-xl text-sm font-bold flex flex-shrink-0 items-center gap-2 hover:bg-gray-50 transition-colors ml-auto md:ml-2 whitespace-nowrap">
            <Filter className="w-4 h-4" /> Sort By <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Customers Table */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white border border-[#E2E8F0] rounded-b-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider hidden lg:table-cell">Orders</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider">Spent</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider hidden xl:table-cell">Last Active</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <AnimatePresence>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <motion.tr 
                      key={customer.id}
                      initial={{ opacity: 0, opacity: 0 }}
                      animate={{ opacity: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleRowClick(customer)}
                      className="hover:bg-amber-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full bg-gray-100 object-cover" />
                          <div>
                            <p className="text-sm font-bold text-[#0F172A]">{customer.name}</p>
                            <p className="text-xs font-medium text-[#64748B] mt-0.5">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell text-sm font-medium text-[#64748B]">{customer.phone}</td>
                      <td className="py-4 px-6 hidden lg:table-cell text-sm font-bold text-[#0F172A]">{customer.orders}</td>
                      <td className="py-4 px-6 text-sm font-bold text-[#0F172A]">{customer.spent}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                          ${customer.status === 'Active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-gray-100 text-[#64748B]'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${customer.status === 'Active' ? 'bg-[#22C55E]' : 'bg-gray-400'}`}></span>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 hidden xl:table-cell text-sm font-medium text-[#64748B]">{customer.lastActive}</td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-2 text-gray-400 hover:text-[#FFDE21] hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent group-hover:border-[#E2E8F0]">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#64748B] font-medium">
                      No customers found matching your criteria.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Slide-over Detail Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedCustomer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-[#E2E8F0]"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <h2 className="text-lg font-bold text-[#0F172A]">Customer Profile</h2>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-[#0F172A] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0] shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-8">
                  <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4" />
                  <h3 className="text-xl font-extrabold text-[#0F172A]">{selectedCustomer.name}</h3>
                  <p className="text-sm font-medium text-[#64748B] mt-1">{selectedCustomer.id}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-3
                    ${selectedCustomer.status === 'Active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-gray-100 text-[#64748B]'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${selectedCustomer.status === 'Active' ? 'bg-[#22C55E]' : 'bg-gray-400'}`}></span>
                    {selectedCustomer.status}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="bg-[#F8FAFC] rounded-2xl p-5 mb-6 border border-[#E2E8F0]">
                  <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4">Contact Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-[#0F172A]">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E2E8F0] text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      {selectedCustomer.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-[#0F172A]">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E2E8F0] text-gray-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      {selectedCustomer.phone}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
                    <div className="text-gray-400 mb-2"><ShoppingBag className="w-5 h-5" /></div>
                    <p className="text-2xl font-extrabold text-[#0F172A]">{selectedCustomer.orders}</p>
                    <p className="text-xs font-medium text-[#64748B] mt-1">Total Orders</p>
                  </div>
                  <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
                    <div className="text-gray-400 mb-2"><DollarSign className="w-5 h-5" /></div>
                    <p className="text-2xl font-extrabold text-[#0F172A]">{selectedCustomer.spent}</p>
                    <p className="text-xs font-medium text-[#64748B] mt-1">Lifetime Value</p>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Customer Notes</h4>
                  <textarea 
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all resize-none h-28"
                    placeholder="Add notes about this customer..."
                    defaultValue="Prefers morning calls. Has a protection plan active until 2027."
                  />
                  <div className="flex justify-end mt-2">
                    <button className="text-xs font-bold text-[#FFDE21] hover:underline">Save Note</button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-[#E2E8F0] bg-white grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-white/20"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#0F172A]">Add New Customer</h2>
                      <p className="text-sm font-medium text-[#64748B] mt-1">Enter the customer details below.</p>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1.5">Full Name</label>
                      <input type="text" className="floating-label-input" placeholder="e.g. John Doe" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5">Email Address</label>
                        <input type="email" className="floating-label-input" placeholder="john@example.com" required />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5">Phone Number</label>
                        <input type="tel" className="floating-label-input" placeholder="+1 (555) 000-0000" />
                      </div>
                    </div>
                    
                    <div className="pt-4 mt-6 border-t border-[#E2E8F0] flex justify-end gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl font-bold text-[#64748B] hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="premium-button bg-[#FFDE21] text-white shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
                      >
                        Create Customer
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}









