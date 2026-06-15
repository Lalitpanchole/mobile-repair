import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X, Search, Smartphone, Laptop, Watch, Tablet,
  ArrowRight, ShieldCheck, Clock, Check,
  Battery, Camera, Droplet, Cpu, PowerOff, Activity, Plug, Speaker, Wrench, MonitorSmartphone, Monitor,
  Keyboard, MousePointer2, Mic, Loader2
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useCatalog } from '../../context/CatalogContext';
import repairDatabase from '../../data/repairDatabase.json';

const getScreenOptions = (priceStr, modelName, brandName, repairName = '', repair = null) => {
  if (repair && repair.options && repair.options.length > 0) {
    return repair.options;
  }
  if (brandName !== 'Apple' || !modelName.toLowerCase().startsWith('iphone')) {
    return [];
  }
  const basePriceMatch = priceStr.match(/[\d.]+/);
  const basePrice = basePriceMatch ? Math.floor(parseFloat(basePriceMatch[0])) : 199;

  // Default values relative to basePrice (which is the Genuine OLED price in our database)
  let refGenuine = basePrice;
  let refSoftOLED = Math.max(149, basePrice - 100);
  let refIncell = Math.max(99, basePrice - 170);

  const modelLower = modelName.toLowerCase();
  if (modelLower.startsWith('iphone 17') && !modelLower.startsWith('iphone 17e')) {
    return [];
  }
  const repairLower = repairName ? repairName.toLowerCase() : '';
  const isScreen = repairLower.includes('screen') || repairLower.includes('display') || repairLower.includes('lcd') || repairLower.includes('oled') || repairLower.includes('front glass');

  if (repairLower.includes('back glass')) {
    if (modelLower.includes('16 pro max') || modelLower.includes('16promax') || modelLower === 'iphone 16 pro' || modelLower === 'iphone 16pro' || modelLower.includes('16 plus') || modelLower.includes('16plus') || modelLower === 'iphone 16') {
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
    return []; // No options for other model back glasses
  }

  if (!isScreen) {
    return [];
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

export default function BookingModal() {
  const { isBookingModalOpen, closeBookingModal, updateBookingData, resetBookingData, bookingData } = useBooking();
  const { catalog, loading: catalogLoading } = useCatalog();
  const db = catalog || repairDatabase;

  const navigate = useNavigate();
  const location = useLocation();
  // Force HMR refresh
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBaseRepair, setSelectedBaseRepair] = useState(null);
  const [selectedQualityOption, setSelectedQualityOption] = useState('soft_oled');
  const contentRef = useRef(null);

  // Reset scroll position of the content container on step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [step]);

  // Reset step when modal opens
  useEffect(() => {
    if (isBookingModalOpen) {
      setStep(1);
      if (location.pathname !== '/book-repair') {
        resetBookingData();
      }
      setSearchQuery('');
      setSelectedBaseRepair(null);
      setSelectedQualityOption('soft_oled');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBookingModalOpen, location.pathname]);


  if (!isBookingModalOpen) return null;

  const brandIcons = {
    'Apple': Smartphone, 'Samsung': Smartphone, 'Google': Smartphone, 'Microsoft': Laptop,
    'Oppo': Smartphone, 'OnePlus': Smartphone, 'Motorola': Smartphone,
    'Huawei': Smartphone, 'Dell': Laptop, 'HP': Laptop, 'Lenovo': Laptop, 'Asus': Laptop, 'Acer': Laptop
  };

  const brands = Object.keys(db).map(name => ({ name, icon: brandIcons[name] || Smartphone }));

  const handleBrandSelect = (brand) => {
    updateBookingData({ brand: brand.name });
    setStep(2);
  };

  const handleTypeSelect = (type) => {
    updateBookingData({ deviceType: type });
    setStep(3);
    setSearchQuery(''); // clear search when going to models step
  };

  const handleModelSelect = (model) => {
    updateBookingData({ model: model.name });
    setStep(4);
  };

  const handleRepairSelect = (repair) => {
    const isScreenRepair = repair.name.toLowerCase().includes('screen') || repair.name.toLowerCase().includes('display') || repair.name.toLowerCase().includes('glass');
    const isPhone = !bookingData?.deviceType || bookingData.deviceType.toLowerCase().includes('phone') || bookingData.deviceType.toLowerCase() === 'iphone' || bookingData.model?.toLowerCase().includes('iphone');

    const opts = getScreenOptions(repair.price, bookingData.model, bookingData.brand, repair.name, repair);
    const shouldGoToStep5 = repair.partOption === true || opts.length > 0;

    if (shouldGoToStep5) {
      setSelectedBaseRepair(repair);
      const recommendedOpt = opts.find(o => o.recommended) || opts.find(o => o.id === 'soft_oled') || opts[1] || opts[0];
      setSelectedQualityOption(recommendedOpt ? recommendedOpt.id : 'soft_oled');
      setStep(5);
    } else {
      updateBookingData({
        repair: {
          ...repair,
          price: repair.price
        }
      });
      closeBookingModal();
      navigate('/book-repair');
    }
  };

  const handleBack = () => {
    if (step === 5) {
      setSelectedBaseRepair(null);
    }
    setStep(step - 1);
  };

  const getAvailableTypes = () => {
    if (!bookingData?.brand || !db[bookingData.brand]) return [];
    return Object.keys(db[bookingData.brand]);
  };

  const getTypeIcon = (type) => {
    const t = type.toLowerCase();
    if (t.includes('phone') || t === 'iphone') return Smartphone;
    if (t.includes('pad') || t.includes('tablet') || t.includes('surface pro') || t.includes('surface go')) return Tablet;
    if (t.includes('macbook') || t.includes('laptop') || t.includes('chromebook')) return Laptop;
    if (t.includes('watch') || t.includes('band')) return Watch;
    if (t.includes('buds') || t.includes('airpods') || t.includes('earbuds')) return Watch;
    if (t.includes('desktop') || t.includes('studio') || t.includes('xbox')) return Laptop;
    if (t.includes('monitor') || t.includes('display')) return Laptop;
    return Smartphone;
  };

  const availableTypes = getAvailableTypes();

  // Filter models by both brand and the selected deviceType
  const modelsForType = bookingData?.brand && bookingData?.deviceType && db[bookingData.brand]?.[bookingData.deviceType]
    ? db[bookingData.brand][bookingData.deviceType].models
    : [];

  const filteredModels = modelsForType.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Get repairs for selected model
  const repairsForModel = bookingData?.brand && bookingData?.deviceType && bookingData?.model && db[bookingData.brand]?.[bookingData.deviceType]
    ? db[bookingData.brand][bookingData.deviceType].repairs[bookingData.model] || []
    : [];

  const stepTitles = {
    1: 'Select Your Brand',
    2: bookingData?.brand ? `${bookingData.brand} Devices` : 'Select Device Type',
    3: bookingData?.deviceType ? `Which ${bookingData.deviceType}?` : 'Select a Model',
    4: 'What Needs Repair?',
    5: 'Choose Quality Level'
  };

  const stepDescriptions = {
    1: 'Choose the manufacturer of your device to see specialized repair options',
    2: bookingData?.brand ? `Select the type of device you need help with` : 'Choose a category',
    3: bookingData?.deviceType ? `${modelsForType.length} models available` : 'Select a type first',
    4: 'Professional repair services',
    5: `${bookingData?.brand}  >  ${bookingData?.deviceType}  >  ${bookingData?.model?.replace(/\s*\(\d{4}\)/g, '')}`
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6"
        onClick={closeBookingModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 pb-0 flex justify-between items-start relative">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="text-sm font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                ← Back
              </button>
            )}
            {!step && <div />} {/* Spacer if no back button */}

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 top-6">
              {Array.from({ length: selectedBaseRepair ? 5 : 4 }, (_, idx) => idx + 1).map((i) => (
                <div key={i} className={`w-8 h-1.5 rounded-full transition-colors duration-300 ${i === step ? 'bg-[#FFDE21]' : i < step ? 'bg-[#22C55E]' : 'bg-gray-200'}`} />
              ))}
            </div>

            <button
              onClick={closeBookingModal}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors ml-auto z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center pt-8 pb-6 px-6">
            <p className="text-[#FFDE21] text-xs font-bold uppercase tracking-wider mb-2">Step {step} of {selectedBaseRepair ? 5 : 4}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">{stepTitles[step]}</h2>
            <p className="text-[#64748B] font-medium mt-2">{stepDescriptions[step]}</p>
          </div>

          {/* Content Area */}
          <div ref={contentRef} className="flex-1 overflow-y-auto px-6 sm:px-10 pb-10 custom-scrollbar">
            {catalogLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                <p className="text-sm font-semibold text-gray-500">Loading repair options...</p>
              </div>
            ) : (
              <>
                {/* Step 1: Brand */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {brands.map((brand, i) => (
                  <button
                    key={i}
                    onClick={() => handleBrandSelect(brand)}
                    className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-2xl hover:border-[#FFDE21] hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.15)] transition-all group"
                  >
                    <div className="flex flex-col items-start gap-3">
                      <div className="p-2.5 bg-amber-50 text-[#FFDE21] rounded-xl group-hover:bg-[#FFDE21] group-hover:text-white transition-colors">
                        <brand.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-[#0F172A] text-sm">{brand.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FFDE21] transition-colors" />
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step 2: Device Type */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {availableTypes.map((type, i) => {
                  const TypeIcon = getTypeIcon(type);
                  return (
                    <button
                      key={i}
                      onClick={() => handleTypeSelect(type)}
                      className="flex items-center justify-between p-5 bg-white border border-[#E2E8F0] rounded-2xl hover:border-[#FFDE21] hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.15)] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-[#FFDE21] rounded-xl group-hover:bg-[#FFDE21] group-hover:text-white transition-colors">
                          <TypeIcon className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-[#0F172A] text-lg">{type}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#FFDE21] transition-colors" />
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* Step 3: Model */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or model number (e.g. A2287)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-full pl-12 pr-4 py-3.5 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all duration-300 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredModels.map((model, i) => {
                    const TypeIcon = getTypeIcon(bookingData.deviceType || 'Phone');
                    return (
                      <button
                        key={i}
                        onClick={() => handleModelSelect(model)}
                        className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-2xl hover:border-[#FFDE21] hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.15)] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-gray-50 text-gray-600 rounded-xl group-hover:bg-amber-50 group-hover:text-[#FFDE21] transition-colors">
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-[#0F172A] text-sm">{model.name.replace(/\s*\(\d{4}\)/g, '')}</p>
                            <p className="text-xs text-[#64748B] font-medium">({model.year})</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FFDE21] transition-colors" />
                      </button>
                    )
                  })}
                  {filteredModels.length === 0 && (
                    <div className="col-span-2 text-center text-[#64748B] py-8">
                      No models found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={repairsForModel.length === 0 ? "max-w-2xl mx-auto w-full text-center py-6" : "max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"}
              >
                {repairsForModel.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-10">
                    <div className="p-4 bg-amber-50 text-[#FFDE21] rounded-2xl">
                      <Wrench className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#0F172A] text-xl">No repair services available yet</h3>
                      <p className="text-[#64748B] text-sm mt-2 font-medium max-w-sm mx-auto leading-relaxed">
                        We don't support repairs for the selected model at this time. Please check back later or contact us directly.
                      </p>
                    </div>
                  </div>
                ) : (
                  repairsForModel.map((repair, i) => {
                    const getRepairIcon = (name) => {
                      const lower = name.toLowerCase();
                      if (lower.includes('battery')) return Battery;
                      if (lower.includes('camera') || lower.includes('lens')) return Camera;
                      if (lower.includes('water') || lower.includes('liquid')) return Droplet;
                      if (lower.includes('motherboard') || lower.includes('logicboard')) return Cpu;
                      if (lower.includes('turning on') || lower.includes('power')) return PowerOff;
                      if (lower.includes('diagnostic')) return Activity;
                      if (lower.includes('charging') || lower.includes('port')) return Plug;
                      if (lower.includes('speaker') || lower.includes('audio')) return Speaker;
                      if (lower.includes('screen') || lower.includes('glass') || lower.includes('lcd') || lower.includes('oled') || lower.includes('display')) return Smartphone;
                      if (lower.includes('keyboard')) return Keyboard;
                      if (lower.includes('trackpad') || lower.includes('mouse')) return MousePointer2;
                      if (lower.includes('microphone') || lower.includes('mic')) return Mic;
                      return Wrench;
                    };
                    const RepairIcon = getRepairIcon(repair.name);

                    const displayPrice = repair.price;

                    return (
                      <button
                        key={i}
                        onClick={() => handleRepairSelect(repair)}
                        className="flex items-center justify-between p-5 bg-white border border-[#E2E8F0] rounded-2xl hover:border-[#FFDE21] hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.15)] transition-all group relative overflow-hidden"
                      >
                        {repair.popular && (
                          <div className="absolute top-0 right-0 bg-[#FFDE21] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                            Popular
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-left">
                          <div className="p-3 bg-amber-50 text-[#FFDE21] rounded-xl group-hover:bg-[#FFDE21] group-hover:text-white transition-colors shrink-0">
                            <RepairIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-[#0F172A] text-lg leading-tight mb-1">{repair.name}</p>
                            <div className="flex items-center gap-3 text-xs font-medium text-[#64748B]">
                              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {repair.duration}</span>
                              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#22C55E]" /> {repair.warranty}</span>
                            </div>
                          </div>
                        </div>
                        {/* Price Display */}
                        <div className="flex items-center gap-3 shrink-0 ml-auto mr-2">
                          <span className="text-sm font-bold text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-full">{displayPrice}</span>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FFDE21] transition-colors shrink-0" />
                        </div>
                      </button>
                    )
                  })
                )}
              </motion.div>
            )}

            {/* Step 5: Choose Quality Level */}
            {step === 5 && selectedBaseRepair && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                <div className="space-y-4">
                  {getScreenOptions(selectedBaseRepair.price, bookingData.model, bookingData.brand, selectedBaseRepair.name, selectedBaseRepair).map((option) => {
                    const isSelected = selectedQualityOption === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => setSelectedQualityOption(isSelected ? null : option.id)}
                        className={`text-left p-6 rounded-3xl border-2 transition-all cursor-pointer ${isSelected
                          ? 'border-[#FFDE21] bg-amber-50/10 shadow-lg shadow-[#FFDE21]/5'
                          : 'border-[#E2E8F0] hover:border-gray-300 bg-white'
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-extrabold text-[#0F172A] text-lg leading-snug">{option.name}</h4>
                            {(option.recommended || option.id === 'soft_oled' || option.id.includes('premium')) && (
                              <span className="bg-[#FFDE21] text-white text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
                                Recommended
                              </span>
                            )}
                            {(option.id === 'genuine' || option.name.toLowerCase().includes('genuine')) && (
                              <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
                                Premium OEM
                              </span>
                            )}
                          </div>
                          <span className="text-3xl font-black text-[#0F172A] tracking-tight shrink-0">{option.price}</span>
                        </div>

                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 pt-4 border-t border-dashed border-gray-200"
                          >
                            <p className="text-sm font-medium text-[#64748B] leading-relaxed mb-4">
                              {option.description}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const chosenRepair = {
                                  ...selectedBaseRepair,
                                  selectedQualityId: option.id
                                };
                                updateBookingData({ repair: chosenRepair });
                                closeBookingModal();
                                navigate('/book-repair');
                              }}
                              className="w-full py-3 rounded-xl bg-[#0F172A] text-white text-sm font-bold hover:bg-slate-900 transition-colors text-center cursor-pointer border-0"
                            >
                              Select This Quality
                            </button>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}









