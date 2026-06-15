import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Save, CheckCircle2, Loader2, Clock, Globe, Shield, Eye, EyeOff
} from 'lucide-react';
import {
  fetchAdminSettings,
  updateAdminSettings,
  changeAdminPassword
} from '../services/api';

export default function AdminSettings() {
  // Store Details & Settings states
  const [storeName, setStoreName] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [currency, setCurrency] = useState('AUD ($)');
  const [timezone, setTimezone] = useState('Australia/Brisbane');
  const [bookingSlotDuration, setBookingSlotDuration] = useState(90);

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading/Saving states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminSettings();
      if (data) {
        setStoreName(data.storeName || '');
        setStoreEmail(data.storeEmail || '');
        setStoreAddress(data.storeAddress || '');
        setStorePhone(data.storePhone || '');
        setCurrency(data.currency || 'AUD ($)');
        setTimezone(data.timezone || 'Australia/Brisbane');
        setBookingSlotDuration(data.bookingSlotDuration || 90);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        storeName,
        storeEmail,
        storePhone,
        storeAddress,
        currency,
        timezone,
        bookingSlotDuration: parseInt(bookingSlotDuration, 10) || 90
      };
      await updateAdminSettings(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadSettings();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update settings parameters');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    setPasswordUpdating(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update password');
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto w-full pb-10 animate-in fade-in duration-300 text-gray-900 dark:text-[#F3F4F6]">
      {/* Save Notification Toast */}
      <AnimatePresence>
        {(saved || passwordSaved) && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            {saved ? 'Settings updated successfully!' : 'Password updated successfully!'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Store className="w-8 h-8 text-amber-500" />
            Store Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Manage your store details, booking slot duration, and credentials.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl shadow-sm">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <p className="text-sm text-gray-500 font-semibold">Loading settings configuration...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Card 1: Store Settings Form */}
          <form onSubmit={handleSaveChanges} className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 md:p-8 shadow-sm space-y-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
              Store Profile Details
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Store Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Store Name</label>
                  <input 
                    type="text" 
                    required
                    value={storeName} 
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-gray-900 dark:text-white focus:outline-none" 
                  />
                </div>

                {/* 2. Contact Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    required
                    value={storeEmail} 
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-gray-900 dark:text-white focus:outline-none" 
                  />
                </div>
              </div>

              {/* 3. Address */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Store Address</label>
                <input 
                  type="text" 
                  required
                  value={storeAddress} 
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-gray-900 dark:text-white focus:outline-none" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 4. Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={storePhone} 
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-gray-900 dark:text-white focus:outline-none" 
                  />
                </div>

                {/* 5. Booking Slot Duration */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-500" /> Booking Slot Duration (Minutes)
                  </label>
                  <input 
                    type="number" 
                    required
                    min={15}
                    max={480}
                    value={bookingSlotDuration} 
                    onChange={(e) => setBookingSlotDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-gray-900 dark:text-white focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className="premium-button bg-[#FFDE21] text-white py-2.5 px-6 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] border-0 flex items-center gap-2 cursor-pointer font-bold rounded-xl disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>

          {/* Card 2: Security & Password */}
          <form onSubmit={handleUpdatePassword} className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 md:p-8 shadow-sm space-y-6 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" /> Change Security Password
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-gray-900 dark:text-white focus:outline-none" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-650 dark:hover:text-gray-250 border-0 bg-transparent cursor-pointer flex items-center justify-center p-0.5"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Password (Min 6 chars)</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-gray-900 dark:text-white focus:outline-none" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-650 dark:hover:text-gray-250 border-0 bg-transparent cursor-pointer flex items-center justify-center p-0.5"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-gray-900 dark:text-white focus:outline-none" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-650 dark:hover:text-gray-250 border-0 bg-transparent cursor-pointer flex items-center justify-center p-0.5"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button 
                type="submit"
                disabled={passwordUpdating}
                className="premium-button bg-[#0f172a] text-white py-2.5 px-6 hover:bg-gray-800 border-0 flex items-center gap-2 cursor-pointer font-bold rounded-xl disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {passwordUpdating ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
