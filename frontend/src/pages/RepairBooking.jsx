import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Star, ShieldCheck, Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon, MessageSquare, Building2, Loader2
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchPublicSettings, fetchSlots, createBooking } from '../services/api';

const getScreenOptions = (priceStr, modelName, brandName, repairName = '', repair = null) => {
  if (repair && repair.options && repair.options.length > 0) {
    return repair.options;
  }
  if (brandName !== 'Apple' || !modelName.toLowerCase().startsWith('iphone')) {
    return [];
  }
  const basePriceMatch = priceStr.match(/[\d.]+/);
  const basePrice = basePriceMatch ? Math.floor(parseFloat(basePriceMatch[0])) : 199;
  
  // Default values relative to basePrice
  let refGenuine = basePrice;
  let refSoftOLED = Math.max(149, basePrice - 100);
  let refIncell = Math.max(99, basePrice - 170);
  
  const modelLower = modelName.toLowerCase();
  const repairLower = repairName ? repairName.toLowerCase() : '';

  if (repairLower.includes('back glass')) {
    if (modelLower.includes('16 pro max') || modelLower.includes('16promax') || modelLower === 'iphone 16 pro' || modelLower === 'iphone 16pro' || modelLower.includes('16 plus') || modelLower.includes('16plus')) {
      return [
        {
          id: 'standard_glass',
          name: 'Standard Quality',
          price: 'A$170.00',
          description: 'Standard quality back glass replacement designed for a precise fit and solid durability. budget-friendly.including support for wireless charging.'
        },
        {
          id: 'premium_glass',
          name: 'Premium Quality',
          price: 'A$220.00',
          description: 'Premium quality back glass replacement with original camera glass, designed for a precise fit, high durability. it restores the original look while maintaining full functionality, including wireless charging'
        }
      ];
    } else if (modelLower.includes('15 pro max') || modelLower.includes('15promax') || modelLower.includes('14 pro max') || modelLower.includes('14promax') || modelLower === 'iphone 14 pro' || modelLower === 'iphone 14pro' || modelLower.includes('14 plus') || modelLower.includes('14plus') || modelLower === 'iphone 14' || modelLower.includes('15 plus') || modelLower.includes('15plus') || modelLower === 'iphone 15 pro' || modelLower === 'iphone 15pro' || modelLower === 'iphone 15') {
      return [
        {
          id: 'standard_glass',
          name: 'Standard Quality',
          price: 'A$170.00',
          description: 'Standard back glass replacement.'
        },
        {
          id: 'premium_glass',
          name: 'Premium Quality',
          price: 'A$220.00',
          description: 'Premium back glass replacement with optimal durability.'
        }
      ];
    } else if (modelLower === 'iphone 16') {
      return [
        {
          id: 'standard_glass',
          name: 'Standard Quality',
          price: 'A$170.00',
          description: 'Standard quality back glass replacement designed for a precise fit and solid durability. budget-friendly.including support for wireless charging.'
        },
        {
          id: 'premium_glass',
          name: 'Premium Quality',
          price: 'A$220.00',
          description: 'Premium quality back glass replacement with original camera glass, designed for a precise fit, high durability. it restores the original look while maintaining full functionality, including wireless charging'
        }
      ];
    } else if (modelLower === 'iphone 15') {
      return [
        {
          id: 'standard_glass',
          name: 'Standard Quality',
          price: 'A$169.00',
          description: 'Standard back glass replacement.'
        },
        {
          id: 'premium_glass',
          name: 'Premium Quality',
          price: 'A$219.00',
          description: 'Premium back glass replacement with optimal durability.'
        }
      ];
    }
  }

  if (modelLower === 'iphone 17e' || modelLower === 'iphone 16e') {
    return [
      {
        id: 'incell',
        name: 'Aftermarket In-Cell LCD',
        price: 'A$169.00',
        description: 'A cost-effective choice for screen replacement. This in-cell LCD screen offers smooth daily performance. Note: It is slightly thicker than the OLED display and may cause slightly higher battery usage, backed by our 12-month warranty.'
      },
      {
        id: 'soft_oled',
        name: 'Aftermarket Soft OLED',
        price: 'A$219.00',
        description: 'Our most popular selection. This high-grade Soft OLED display mimics original performance with vibrant colors, deep black contrast, and optimal battery efficiency.'
      }
    ];
  }

  // Explicit reference prices + $20 premium mapping
  if (modelLower.includes('16 pro max') || modelLower.includes('16promax')) {
    refIncell = 249 + 20; // 269
    refSoftOLED = 349 + 20; // 369
    refGenuine = 679 + 20; // 699
  } else if (modelLower.includes('16 pro') || modelLower.includes('16pro')) {
    refIncell = 199 + 20; // 219
    refSoftOLED = 299 + 20; // 319
    refGenuine = 579 + 20; // 599
  } else if (modelLower.includes('16 plus') || modelLower.includes('16plus')) {
    refIncell = 169 + 20; // 189
    refSoftOLED = 219 + 20; // 239
    refGenuine = 429 + 20; // 449
  } else if (modelLower === 'iphone 16') {
    refIncell = 169 + 20; // 189
    refSoftOLED = 219 + 20; // 239
    refGenuine = 429 + 20; // 449
  } else if (modelLower.includes('15 pro max') || modelLower.includes('15promax')) {
    refIncell = 199 + 20; // 219
    refSoftOLED = 269 + 20; // 289
    refGenuine = 469 + 20; // 489
  } else if (modelLower.includes('15 pro') || modelLower.includes('15pro')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 279 + 20; // 299
    refGenuine = 549 + 20; // 569
  } else if (modelLower.includes('15 plus') || modelLower.includes('15plus')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 249 + 20; // 269
    refGenuine = 399 + 20; // 419
  } else if (modelLower === 'iphone 15') {
    refIncell = 119 + 20; // 139
    refSoftOLED = 169 + 20; // 189
    refGenuine = 269 + 20; // 289
  } else if (modelLower.includes('14 pro max') || modelLower.includes('14promax')) {
    refIncell = 169 + 20; // 189
    refSoftOLED = 219 + 20; // 239
    refGenuine = 369 + 20; // 389
  } else if (modelLower.includes('14 pro') || modelLower.includes('14pro')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 199 + 20; // 219
    refGenuine = 319 + 20; // 339
  } else if (modelLower.includes('14 plus') || modelLower.includes('14plus')) {
    refIncell = 119 + 20; // 139
    refSoftOLED = 169 + 20; // 189
    refGenuine = 269 + 20; // 289
  } else if (modelLower === 'iphone 14') {
    refIncell = 109 + 20; // 129
    refSoftOLED = 149 + 20; // 169
    refGenuine = 229 + 20; // 249
  } else if (modelLower.includes('13 pro max') || modelLower.includes('13promax')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 199 + 20; // 219
    refGenuine = 299 + 20; // 319
  } else if (modelLower.includes('13 pro') || modelLower.includes('13pro')) {
    refIncell = 129 + 20; // 149
    refSoftOLED = 179 + 20; // 199
    refGenuine = 269 + 20; // 289
  } else if (modelLower === 'iphone 13' || modelLower === 'iphone 13 mini') {
    refIncell = 99 + 20; // 119
    refSoftOLED = 139 + 20; // 159
    refGenuine = 199 + 20; // 219
  } else if (modelLower.includes('12 pro max') || modelLower.includes('12promax')) {
    refIncell = 119 + 20; // 139
    refSoftOLED = 149 + 20; // 169
    refGenuine = 219 + 20; // 239
  } else if (modelLower.includes('12 pro') || modelLower.includes('12pro')) {
    refIncell = 109 + 20; // 129
    refSoftOLED = 139 + 20; // 159
    refGenuine = 199 + 20; // 219
  } else if (modelLower === 'iphone 12' || modelLower === 'iphone 12 mini') {
    refIncell = 119 + 20; // 139
    refSoftOLED = 199 + 20; // 219
    refGenuine = 179 + 20; // 199
  } else if (modelLower.includes('11 pro max') || modelLower.includes('11promax')) {
    refIncell = 89 + 20; // 109
    refSoftOLED = 119 + 20; // 139
    refGenuine = 169 + 20; // 189
  } else if (modelLower.includes('11 pro') || modelLower.includes('11pro')) {
    refIncell = 79 + 20; // 99
    refSoftOLED = 109 + 20; // 129
    refGenuine = 149 + 20; // 169
  } else if (modelLower === 'iphone 11') {
    refIncell = 69 + 20; // 89
    refSoftOLED = 99 + 20; // 119
    refGenuine = 129 + 20; // 149
  } else if (modelLower.includes('xs max') || modelLower.includes('xsmax')) {
    refIncell = 79 + 20; // 99
    refSoftOLED = 109 + 20; // 129
    refGenuine = 149 + 20; // 169
  } else if (modelLower === 'iphone xs' || modelLower === 'iphone x') {
    refIncell = 69 + 20; // 89
    refSoftOLED = 89 + 20; // 109
    refGenuine = 129 + 20; // 149
  } else if (modelLower === 'iphone xr') {
    refIncell = 59 + 20; // 79
    refSoftOLED = 79 + 20; // 99
    refGenuine = 109 + 20; // 129
  } else if (modelLower === 'iphone 8 plus') {
    refIncell = 49 + 20; // 69
    refSoftOLED = 69 + 20; // 89
    refGenuine = 89 + 20; // 109
  } else if (modelLower === 'iphone 8') {
    refIncell = 39 + 20; // 59
    refSoftOLED = 59 + 20; // 79
    refGenuine = 79 + 20; // 99
  }

  return [
    {
      id: 'incell',
      name: 'Aftermarket In-Cell LCD',
      price: `A$${refIncell.toFixed(2)}`,
      description: 'A budget-friendly choice that utilizes standard LCD technology. While functional, it has thicker bezels, lower contrast/brightness, and higher power usage than original screen types. Backed by our 12-month warranty.'
    },
    {
      id: 'soft_oled',
      name: 'Aftermarket Soft OLED',
      price: `A$${refSoftOLED.toFixed(2)}`,
      description: 'A premium aftermarket display matching original specifications. Uses flexible Soft OLED substrate for true black contrast, sharp color vibrancy, exact bezel fit, and factory-standard power usage. Highly recommended.'
    },
    {
      id: 'genuine',
      name: 'Genuine Apple OLED',
      price: `A$${refGenuine.toFixed(2)}`,
      description: 'The premium factory-grade screen replacement. Restores original brightness, full HDR color accuracy, perfect touch response, and official True Tone functionality with maximal durability.'
    }
  ];
};

export default function RepairBooking() {
  const { bookingData, openBookingModal, resetBookingData } = useBooking();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [storeSettings, setStoreSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [currentMonth, setCurrentMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!bookingData?.model || !bookingData?.repair) {
      openBookingModal();
    }
  }, [bookingData, openBookingModal]);

  // Load public store settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchPublicSettings();
        setStoreSettings(settings || null);
      } catch (err) {
        console.error('Failed to fetch store settings:', err);
      } finally {
        setSettingsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Fetch slots for selected date
  useEffect(() => {
    const loadSlots = async () => {
      setSlotsLoading(true);
      try {
        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = selectedDate.getDate().toString().padStart(2, '0');
        const dStr = `${year}-${month}-${day}`;
        
        const res = await fetchSlots(dStr);
        setAvailableSlots(res.slots || []);
      } catch (err) {
        console.error('Failed to fetch slots:', err);
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    loadSlots();
  }, [selectedDate]);

  // Scroll to top when the repair changes or on mount
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
  }, [bookingData?.repair?.name]);

  if (!bookingData?.model || !bookingData?.repair) {
    return <Navigate to="/" replace />;
  }

  const brand = bookingData.brand;
  const model = bookingData.model;
  const displayModel = model.replace(/\s*\(\d{4}\)/g, '');
  const repair = bookingData.repair;
  const selectedScreenOption = bookingData?.repair?.selectedQualityId || 'soft_oled';

  const screenOptions = getScreenOptions(repair.price, model, brand, repair.name, repair);
  const showOptions = repair.partOption === true || screenOptions.length > 0;

  const activeOption = showOptions ? screenOptions.find(opt => opt.id === selectedScreenOption) || screenOptions.find(opt => opt.recommended) || screenOptions[1] || screenOptions[0] : null;

  const currentPrice = showOptions ? activeOption.price : repair.price;

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Helper functions for date comparison
  const isPastDate = (date) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return date < todayStart;
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  // Generate grid cells for the navigated month
  const gridDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    
    const daysArray = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push({ day: null, key: `pad-${i}` });
    }
    for (let d = 1; d <= totalDaysInMonth; d++) {
      daysArray.push({ day: d, key: `day-${d}`, date: new Date(year, month, d) });
    }
    return daysArray;
  }, [currentMonth]);

  // Keep selectedTimeSlot in sync with available slots
  useEffect(() => {
    if (availableSlots.length > 0) {
      if (!availableSlots.includes(selectedTimeSlot)) {
        setSelectedTimeSlot(availableSlots[0]);
      }
    } else {
      setSelectedTimeSlot('');
    }
  }, [availableSlots, selectedTimeSlot]);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const storeName = storeSettings?.storeName || 'MPC Repairs';

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim() || !selectedTimeSlot) {
      setErrorMessage('Please fill in all required fields and choose a time slot.');
      return;
    }

    const phoneRegex = /^[+]?[\d\s-]{8,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const isPhoneValid = phoneRegex.test(phone.trim());
    const isEmailValid = emailRegex.test(email.trim());
    
    if (!isPhoneValid && !isEmailValid) {
      setErrorMessage('Invalid phone number and Invalid email');
      return;
    } else if (!isPhoneValid) {
      setErrorMessage('Invalid phone number');
      return;
    } else if (!isEmailValid) {
      setErrorMessage('Invalid email');
      return;
    }

    setErrorMessage('');
    
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const dStr = `${year}-${month}-${day}`;

    const priceNum = parseFloat(String(currentPrice).replace(/[^0-9.]/g, '')) || 0;

    const snapshot = {
      brand: brand,
      deviceType: bookingData.deviceType || 'Phone',
      model: model,
      repair: repair.name,
      quality: showOptions ? activeOption.name : 'Standard',
      price: priceNum,
      warranty: repair.warranty || '12-mo warranty'
    };

    try {
      const payload = {
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        deviceBrand: brand,
        deviceType: bookingData.deviceType || 'Phone',
        deviceModel: model,
        repairName: repair.name,
        partQuality: showOptions ? activeOption.name : null,
        finalPrice: priceNum,
        repairSnapshot: snapshot,
        dateStr: dStr,
        timeSlot: selectedTimeSlot,
        notes: notes,
        createdSource: 'website'
      };

      await createBooking(payload);
      setIsSuccessOpen(true);
    } catch (err) {
      console.error('Booking confirmation failed:', err);
      setErrorMessage(err.message || 'Failed to confirm booking. Please try another slot.');
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-10 pb-24 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button Selection Link */}
        <div className="mb-8 flex justify-between items-center">
          <button
            type="button"
            onClick={openBookingModal}
            className="inline-flex items-center gap-2.5 text-sm font-bold text-[#64748B] hover:text-[#0F172A] transition-all bg-white border border-[#E2E8F0] hover:border-gray-300 rounded-full px-5 py-2.5 hover:shadow-sm cursor-pointer"
          >
            ← Back to Selection
          </button>
        </div>

        {/* Breadcrumb / Title */}
        <div className="mb-10">
          <p className="text-[#FFDE21] text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE21]"></span> {brand} {displayModel}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight mb-4">
            {repair.name}.
          </h1>
          <p className="text-[#64748B] text-lg font-medium max-w-2xl">
            Fast, professional repair for your {displayModel} — most jobs done same day, walk-ins welcome.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm font-bold text-[#0F172A]">
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-[#FFDE21] fill-current" /> 4.9 / 200+</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#FFDE21]" /> {repair.warranty || '12-mo warranty'}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#FFDE21]" /> {repair.duration}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">

          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-12">

            {/* Price Box */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm">
              <div>
                <p className="text-[#64748B] font-bold text-sm uppercase tracking-wider mb-2">
                  {showOptions ? `Repair Price (${activeOption.name})` : 'Repair Price'}
                </p>
                <div className="text-5xl font-extrabold text-[#0F172A] tracking-tight">{currentPrice}</div>
                <div className="flex items-center gap-4 mt-3 text-sm font-medium text-[#64748B]">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {repair.duration}</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> {repair.warranty || '12 months'}</span>
                </div>
              </div>
              <button
                onClick={() => document.getElementById('booking-form-card')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-6 sm:mt-0 w-full sm:w-auto premium-button bg-[#0F172A] text-white cursor-pointer border-0"
              >
                Book Now
              </button>
            </div>

            {/* Description */}
            <div>
              <p className="text-[#64748B] font-bold text-xs uppercase tracking-wider mb-3">Service Details</p>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
                About {displayModel} {showOptions ? `${repair.name} (${activeOption.name})` : repair.name}
              </h2>
              <p className="text-[#64748B] font-medium leading-relaxed">
                {showOptions ? (
                  <>
                    Is your {displayModel} broken or damaged? Get it fixed at our repair center. We offer a professional screen replacement utilizing our high-quality <strong>{activeOption.name}</strong>. {activeOption.description} This service is priced at <strong>{currentPrice}</strong> and includes a 12-month warranty with same-day completion.
                  </>
                ) : (
                  <>
                    Is your {displayModel} broken or damaged? Get it fixed at our repair center. Professional {repair.name.toLowerCase()} service with transparent pricing from {repair.price}. Our skilled specialists use premium quality parts to fix your device fast. Whether it needs repair or full replacement, we'll restore it to perfect working condition.
                  </>
                )}
              </p>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">What's Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Premium quality parts', '1-hour repair',
                  '12-month warranty', 'Full functionality test',
                  'Professional diagnosis', 'No fix, no fee guarantee'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#E2E8F0]">
                    <div className="w-6 h-6 rounded-full bg-amber-50 text-[#FFDE21] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-[#0F172A]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden" style={{ color: '#ffffff' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDE21]/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              <h3 className="text-2xl font-bold mb-8 relative z-10 text-white" style={{ color: '#ffffff' }}>Why Choose MPC Repairs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10 text-left">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-[#FFDE21] mb-3"><ShieldCheck className="w-6 h-6" /></div>
                  <h4 className="font-bold mb-1 text-white" style={{ color: '#ffffff' }}>Expert Technicians</h4>
                  <p className="text-gray-300 text-sm" style={{ color: '#d1d5db' }}>Skilled specialists who can fix any broken device with premium quality parts.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-[#FFDE21] mb-3"><Clock className="w-6 h-6" /></div>
                  <h4 className="font-bold mb-1 text-white" style={{ color: '#ffffff' }}>Fast Repair Service</h4>
                  <p className="text-gray-300 text-sm" style={{ color: '#d1d5db' }}>Most repairs completed while you wait at our location.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-5 relative" id="booking-form-card">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden sticky top-24">

              <div className="bg-[#FFDE21] py-3 px-6 text-white text-sm font-bold text-center flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Book Online - Save Time
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-3 mb-6">
                  Book Your Repair
                </h3>

                <form onSubmit={handleConfirmBooking} className="space-y-6" noValidate>
                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-150">
                      {errorMessage}
                    </div>
                  )}

                  {/* Details */}
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] placeholder-gray-400 focus:outline-none focus:border-[#FFDE21] focus:ring-2 focus:ring-[#FFDE21]/20 transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] placeholder-gray-400 focus:outline-none focus:border-[#FFDE21] focus:ring-2 focus:ring-[#FFDE21]/20 transition-all"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] placeholder-gray-400 focus:outline-none focus:border-[#FFDE21] focus:ring-2 focus:ring-[#FFDE21]/20 transition-all"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Repair Location</p>
                    {settingsLoading ? (
                      <div className="flex items-center gap-2 p-4 text-sm font-semibold text-gray-500 bg-white border border-[#E2E8F0] rounded-xl">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        Loading store location...
                      </div>
                    ) : (
                      <div className="flex items-start gap-4 p-4 rounded-xl border border-[#FFDE21] bg-amber-50/50">
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-base font-extrabold text-[#0F172A]">{storeSettings?.storeName || 'MPC Repairs'}</p>
                          <p className="text-xs font-semibold text-[#64748B] mt-0.5">{storeSettings?.storeAddress || '168 Cavendish Road, Coorparoo, QLD 4151'}</p>
                          <p className="text-xs font-bold text-gray-500 mt-1">Phone: {storeSettings?.storePhone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div>
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Choose Appointment</p>

                    {/* Calendar grid widget */}
                    <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-white shadow-sm mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="p-1 hover:bg-gray-50 rounded-lg text-gray-450 cursor-pointer border-0 bg-transparent"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-extrabold text-sm text-[#0F172A]">
                          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1 hover:bg-gray-50 rounded-lg text-[#FFDE21] cursor-pointer border-0 bg-transparent"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 text-center gap-1 mb-2">
                        {days.map(d => <div key={d} className="text-[10px] font-extrabold text-[#64748B] uppercase">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 text-center gap-1.5">
                        {gridDays.map((item) => (
                          item.day === null ? (
                            <div key={item.key} className="w-8 h-8" />
                          ) : (
                            <button
                              key={item.key}
                              type="button"
                              disabled={isPastDate(item.date)}
                              onClick={() => setSelectedDate(item.date)}
                              className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center mx-auto transition-colors border
                                ${isSelected(item.date)
                                  ? 'bg-[#FFDE21] text-white border-[#FFDE21] shadow-md shadow-amber-500/20'
                                  : isToday(item.date)
                                  ? 'border-[#FFDE21] text-[#0F172A] hover:bg-gray-50 bg-transparent'
                                  : 'border-transparent text-[#0F172A] hover:bg-gray-50 bg-transparent'}
                                ${isPastDate(item.date) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                              `}
                            >
                              {item.day}
                            </button>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Time slots widget */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Available Time Slots</label>
                      {slotsLoading ? (
                        <div className="flex items-center justify-center py-4 text-xs font-bold text-gray-405 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          <Loader2 className="w-4 h-4 animate-spin text-amber-500 mr-2" />
                          Loading slots...
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.length > 0 ? (
                            availableSlots.map(slot => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedTimeSlot(slot)}
                                className={`py-2 px-1 text-xs font-extrabold rounded-xl border text-center transition-all cursor-pointer ${selectedTimeSlot === slot
                                  ? 'bg-[#FFDE21] text-white border-[#FFDE21] shadow-sm shadow-amber-500/10'
                                  : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-gray-50'
                                  }`}
                              >
                                {slot}
                              </button>
                            ))
                          ) : (
                            <div className="col-span-3 py-3 text-center text-xs font-bold text-gray-400 bg-gray-55/10 rounded-xl border border-dashed border-gray-200">
                              {selectedDate.getDay() === 0 ? 'Store is closed on Sundays' : 'No available slots for this date'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-[#0F172A] mb-1.5">
                      <MessageSquare className="w-4 h-4 text-gray-400" /> Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] placeholder-gray-400 focus:outline-none focus:border-[#FFDE21] focus:ring-2 focus:ring-[#FFDE21]/20 transition-all resize-none"
                      placeholder="Any specific details, passcodes, or special requests"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button type="submit" className="w-full premium-button bg-[#0F172A] text-white shadow-xl hover:shadow-2xl font-bold py-3.5 border-0">
                      Confirm Appointment - {currentPrice}
                    </button>
                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                        <Check className="w-3.5 h-3.5 text-[#22C55E]" /> Free diagnostic with every repair
                      </p>
                      <p className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
                        <Check className="w-3.5 h-3.5 text-[#22C55E]" /> Walk-ins welcome, appointments preferred
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Success Dialog Modal Popup */}
      <AnimatePresence>
        {isSuccessOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md relative z-[101] text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6 shadow-sm border border-emerald-100/50">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <h3 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">Appointment Booked!</h3>
              <p className="text-gray-500 text-sm font-semibold mb-6 text-center">
                Your booking for <strong>{displayModel} {repair.name}</strong> has been successfully registered. We will see you at <strong>{storeName}</strong> on <strong>{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {selectedTimeSlot}</strong>.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessOpen(false);
                    setFullName('');
                    setPhone('');
                    setEmail('');
                    setSelectedDate(new Date());
                    setCurrentMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
                    setSelectedTimeSlot('10:30 AM');
                    resetBookingData();
                    navigate('/', { replace: true });
                  }}
                  className="w-full premium-button bg-[#0F172A] text-white font-bold py-3 rounded-xl shadow-lg cursor-pointer border-0"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
