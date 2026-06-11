import { motion } from 'framer-motion';
import { Smartphone, Search, Filter, MoreVertical, ShieldCheck, Battery, AlertTriangle, AlertCircle } from 'lucide-react';

export default function AdminDevices() {
  const devices = [
    { id: '#DEV-8001', model: 'iPhone 13 Pro Max', serial: 'FFJ8D9A2L', owner: 'Alice Johnson', issue: 'Shattered Display', status: 'In Repair', warranty: 'Valid' },
    { id: '#DEV-8002', model: 'MacBook Pro M1 16"', serial: 'C02XD4D9MD', owner: 'Michael Chen', issue: 'Liquid Damage', status: 'Diagnostic', warranty: 'Expired' },
    { id: '#DEV-8003', model: 'iPad Air 4', serial: 'DMPJ98A2K', owner: 'Sarah Williams', issue: 'Battery Drain', status: 'Ready for Pickup', warranty: 'Valid' },
    { id: '#DEV-8004', model: 'Samsung Galaxy S22 Ultra', serial: 'R9JR928KA', owner: 'David Martinez', issue: 'Cracked Back Glass', status: 'Completed', warranty: 'Expired' },
    { id: '#DEV-8005', model: 'Apple Watch Series 7', serial: 'G98DA2L9A', owner: 'Emma Thompson', issue: 'Not Powering On', status: 'Waiting on Parts', warranty: 'Expired' },
    { id: '#DEV-8006', model: 'iPhone 14', serial: 'J98A2L9AA', owner: 'Oliver Twist', issue: 'FaceID Failure', status: 'In Repair', warranty: 'Valid' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ready for Pickup': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Completed': return 'bg-green-50 text-green-600 border-green-200';
      case 'In Repair': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Diagnostic': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Waiting on Parts': return 'bg-amber-50 text-amber-600 border-amber-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getWarrantyIcon = (warranty) => {
    return warranty === 'Valid' ? 
      <span className="flex items-center text-emerald-600 font-bold text-xs"><ShieldCheck className="w-4 h-4 mr-1" /> Valid</span> : 
      <span className="flex items-center text-red-500 font-bold text-xs"><AlertTriangle className="w-4 h-4 mr-1" /> Expired</span>;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Device Inventory</h1>
          <p className="text-gray-500 font-medium mt-1">Track customer devices currently in the shop.</p>
        </div>
        <button className="premium-button bg-[#0F172A] text-white py-2.5 px-5 shadow-[0_4px_14px_0_rgb(15,23,42,0.39)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)]">
          <Smartphone className="w-5 h-5 mr-2" />
          Log New Device
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by model, serial, or owner..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none items-center gap-2 px-4 py-2.5 text-gray-600 font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex justify-center">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Device Info</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reported Issue</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Warranty</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {devices.map((device, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={device.id} 
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0F172A]">{device.model}</span>
                      <span className="text-xs font-bold text-gray-400 font-mono mt-0.5">SN: {device.serial}</span>
                      <span className="text-xs font-bold text-amber-500 mt-0.5">{device.id}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-600">{device.owner}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-gray-600">{device.issue}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(device.status)}`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {getWarrantyIcon(device.warranty)}
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









