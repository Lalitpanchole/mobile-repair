import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Bell, Shield, CreditCard, Save, Lock, 
  Smartphone, Mail, FileText, CheckCircle2 
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('Store Details');
  
  // Store Details states
  const [storeName, setStoreName] = useState('MPC Repairs');
  const [contactEmail, setContactEmail] = useState('mpcrepairskotara@gmail.com');
  const [storeAddress, setStoreAddress] = useState('168 Cavendish Road, Coorparoo, QLD 4151');
  const [storePhone, setStorePhone] = useState('+61 426 186 212');
  const [currency, setCurrency] = useState('AUD ($)');

  // Operating Hours states
  const [monFriOpen, setMonFriOpen] = useState('09:00');
  const [monFriClose, setMonFriClose] = useState('18:00');
  const [satOpen, setSatOpen] = useState('09:00');
  const [satClose, setSatClose] = useState('15:00');
  const [sunClosed, setSunClosed] = useState(true);

  // Notification Preferences states
  const [notifPreferences, setNotifPreferences] = useState([
    { title: 'New Repair Bookings', desc: 'Receive alerts when a customer books a new repair.', email: true, sms: true },
    { title: 'Customer Messages', desc: 'Get notified when a customer sends a message.', email: true, sms: false },
    { title: 'Inventory Alerts', desc: 'Alerts when parts are running low in stock.', email: true, sms: false },
    { title: 'Marketing Updates', desc: 'News and updates about the MPC Repairs platform.', email: false, sms: false },
  ]);

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false);

  // Saving states
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveChanges = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const handleToggleNotif = (index, field) => {
    setNotifPreferences(prev => prev.map((item, idx) => 
      idx === index ? { ...item, [field]: !item[field] } : item
    ));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    handleSaveChanges();
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl animate-in fade-in duration-300">
      {/* Save Notification Toast */}
      <AnimatePresence>
        {saved && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            Settings updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Settings</h1>
          <p className="text-gray-550 font-medium mt-1">Manage your store preferences, notifications, and security.</p>
        </div>
        <button 
          onClick={handleSaveChanges}
          disabled={saving}
          className="premium-button bg-[#FFDE21] text-white py-2.5 px-5 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] border-0 flex items-center gap-2 cursor-pointer font-bold rounded-xl disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
            {[
              { name: 'Store Details', icon: Store },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold border-0 cursor-pointer text-left ${
                  activeTab === item.name
                    ? 'bg-amber-50 text-[#FFDE21] shadow-sm shadow-amber-500/5' 
                    : 'text-gray-500 hover:bg-white hover:shadow-sm hover:text-[#0F172A] bg-transparent'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
        </div>

        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            
            {activeTab === 'Store Details' && (
              <motion.div 
                key="store"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Section 1: Store Information */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-[#0F172A] mb-6">Store Information</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Store Name</label>
                        <input 
                          type="text" 
                          value={storeName} 
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all font-bold text-[#0F172A] focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email</label>
                        <input 
                          type="email" 
                          value={contactEmail} 
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all font-bold text-[#0F172A] focus:outline-none" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Store Headquarters Address</label>
                      <input 
                        type="text" 
                        value={storeAddress} 
                        onChange={(e) => setStoreAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all font-bold text-[#0F172A] focus:outline-none" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          value={storePhone} 
                          onChange={(e) => setStorePhone(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all font-bold text-[#0F172A] focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
                        <select 
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all font-bold text-[#0F172A] bg-white focus:outline-none"
                        >
                          <option value="AUD ($)">AUD ($)</option>
                          <option value="USD ($)">USD ($)</option>
                          <option value="EUR (€)">EUR (€)</option>
                          <option value="GBP (£)">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Operating Hours */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-[#0F172A] mb-6">Operating Hours</h2>
                  <div className="space-y-4">
                    
                    {/* Mon-Fri */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 border-b border-gray-50 last:border-0 gap-3 lg:gap-0">
                      <span className="font-bold text-gray-600">Monday - Friday</span>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input type="time" value={monFriOpen} onChange={(e) => setMonFriOpen(e.target.value)} className="px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 font-medium text-sm text-gray-650 focus:outline-none focus:border-[#FFDE21]" />
                        <span className="text-gray-400 font-bold">to</span>
                        <input type="time" value={monFriClose} onChange={(e) => setMonFriClose(e.target.value)} className="px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 font-medium text-sm text-gray-650 focus:outline-none focus:border-[#FFDE21]" />
                      </div>
                    </div>

                    {/* Sat */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 border-b border-gray-50 last:border-0 gap-3 lg:gap-0">
                      <span className="font-bold text-gray-600">Saturday</span>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input type="time" value={satOpen} onChange={(e) => setSatOpen(e.target.value)} className="px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 font-medium text-sm text-gray-650 focus:outline-none focus:border-[#FFDE21]" />
                        <span className="text-gray-400 font-bold">to</span>
                        <input type="time" value={satClose} onChange={(e) => setSatClose(e.target.value)} className="px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 font-medium text-sm text-gray-650 focus:outline-none focus:border-[#FFDE21]" />
                      </div>
                    </div>

                    {/* Sun */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 border-b border-gray-50 last:border-0 gap-3 lg:gap-0">
                      <span className="font-bold text-gray-600">Sunday</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={sunClosed} onChange={() => setSunClosed(!sunClosed)} className="w-4 h-4 text-[#FFDE21] rounded border-gray-300" />
                          <span className="text-sm font-bold text-gray-600">Closed All Day</span>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm"
              >
                <h2 className="text-xl font-bold text-[#0F172A] mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {notifPreferences.map((item, i) => (
                    <div key={i} className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0">
                      <div className="pr-4">
                        <p className="font-bold text-[#0F172A] mb-1">{item.title}</p>
                        <p className="text-sm font-medium text-gray-500">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={item.email} 
                            onChange={() => handleToggleNotif(i, 'email')}
                            className="w-4 h-4 text-[#FFDE21] rounded border-gray-300" 
                          />
                          <span className="text-sm font-bold text-gray-600">Email</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={item.sms} 
                            onChange={() => handleToggleNotif(i, 'sms')}
                            className="w-4 h-4 text-[#FFDE21] rounded border-gray-300" 
                          />
                          <span className="text-sm font-bold text-gray-600">SMS</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-[#0F172A] mb-6">Change Password</h2>
                  <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all focus:outline-none" 
                      />
                    </div>
                    <button 
                      type="submit"
                      className="mt-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors cursor-pointer border-0"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between flex-col md:flex-row gap-4 md:gap-0">
                    <div>
                      <h2 className="text-xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-[#FFDE21]" /> Two-Factor Authentication
                      </h2>
                      <p className="text-sm font-medium text-gray-500 max-w-md">Add an extra layer of security to your account by requiring a code from your mobile device upon login.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIs2faEnabled(!is2faEnabled);
                        handleSaveChanges();
                      }}
                      className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer border ${
                        is2faEnabled 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                          : 'bg-white border-gray-200 text-[#0F172A] hover:bg-gray-50'
                      }`}
                    >
                      {is2faEnabled ? '2FA Enabled' : 'Enable 2FA'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Billing' && (
              <motion.div 
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#0F172A]">Current Plan</h2>
                    <span className="bg-amber-50 text-[#FFDE21] px-3 py-1 rounded-full text-sm font-bold">Pro Tier</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                    <div>
                      <p className="text-3xl font-extrabold text-[#0F172A]">$49.00<span className="text-lg text-gray-400 font-medium">/month</span></p>
                      <p className="text-sm font-medium text-gray-500 mt-1">Your next billing date is July 1, 2026.</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-white border border-gray-200 text-[#0F172A] px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors border-0 cursor-pointer">
                        Cancel Plan
                      </button>
                      <button className="bg-[#FFDE21] text-white px-4 py-2 rounded-xl font-bold hover:bg-amber-700 transition-colors shadow-sm border-0 cursor-pointer">
                        Upgrade
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-amber-900 text-xs tracking-wider">VISA</div>
                        <div>
                          <p className="font-bold text-[#0F172A]">Visa ending in 4242</p>
                          <p className="text-xs font-medium text-gray-500">Expires 12/28</p>
                        </div>
                      </div>
                      <button className="text-sm font-bold text-[#FFDE21] hover:underline bg-transparent border-0 cursor-pointer">Edit</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-[#0F172A] mb-6">Billing History</h2>
                  <div className="space-y-3">
                    {[
                      { date: 'Jun 1, 2026', amount: '$49.00', status: 'Paid', invoice: 'INV-2026-06' },
                      { date: 'May 1, 2026', amount: '$49.00', status: 'Paid', invoice: 'INV-2026-05' },
                      { date: 'Apr 1, 2026', amount: '$49.00', status: 'Paid', invoice: 'INV-2026-04' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl">
                        <div className="flex items-center gap-4">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-bold text-[#0F172A]">{item.date}</p>
                            <p className="text-xs font-medium text-gray-500">{item.invoice}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-[#0F172A]">{item.amount}</p>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}









