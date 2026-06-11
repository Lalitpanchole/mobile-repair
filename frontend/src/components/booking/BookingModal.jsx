import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X, Search, Smartphone, Laptop, Watch, Tablet,
  ArrowRight, ShieldCheck, Clock, Check,
  Battery, Camera, Droplet, Cpu, PowerOff, Activity, Plug, Speaker, Wrench, MonitorSmartphone, Monitor,
  Keyboard, MousePointer2, Mic
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import repairDatabase from '../../data/repairDatabase.json';

const getScreenOptions = (priceStr, modelName, brandName, repairName = '') => {
  const basePriceMatch = priceStr.match(/[\d.]+/);
  const basePrice = basePriceMatch ? Math.floor(parseFloat(basePriceMatch[0])) : 199;

  // Default values relative to basePrice (which is the Genuine OLED price in our database)
  let refGenuine = basePrice;
  let refSoftOLED = Math.max(149, basePrice - 100);
  let refIncell = Math.max(99, basePrice - 170);

  const modelLower = modelName.toLowerCase();
  const repairLower = repairName ? repairName.toLowerCase() : '';

  if (repairLower.includes('back glass')) {
    if (modelLower.includes('16 pro max') || modelLower.includes('16promax') || modelLower === 'iphone 16 pro' || modelLower === 'iphone 16pro' || modelLower.includes('15 pro max') || modelLower.includes('15promax') || modelLower.includes('14 pro max') || modelLower.includes('14promax') || modelLower === 'iphone 14 pro' || modelLower === 'iphone 14pro' || modelLower.includes('14 plus') || modelLower.includes('14plus') || modelLower === 'iphone 14') {
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
    } else if (modelLower.includes('16 plus') || modelLower.includes('16plus')) {
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
          price: 'A$220.00',
          description: 'Premium back glass replacement with optimal durability.'
        }
      ];
    } else if (modelLower === 'iphone 16' || modelLower === 'iphone 15') {
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
    refGenuine = 639 + 20; // 659
  } else if (modelLower.includes('16 plus') || modelLower.includes('16plus')) {
    refIncell = 179 + 20; // 199
    refSoftOLED = 249 + 20; // 269
    refGenuine = 369 + 20; // 389
  } else if (modelLower.includes('16')) {
    refIncell = 159 + 20; // 179
    refSoftOLED = 229 + 20; // 249
    refGenuine = 349 + 20; // 369
  } else if (modelLower.includes('15 pro max') || modelLower.includes('15promax')) {
    refIncell = 199 + 20; // 219
    refSoftOLED = 299 + 20; // 319
    refGenuine = 549 + 20; // 569
  } else if (modelLower.includes('15 pro') || modelLower.includes('15pro')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 279 + 20; // 299
    refGenuine = 549 + 20; // 569
  } else if (modelLower.includes('15 plus') || modelLower.includes('15plus')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 219 + 20; // 239
    refGenuine = 319 + 20; // 339
  } else if (modelLower.includes('15') && !modelLower.includes('pro') && !modelLower.includes('plus')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 249 + 20; // 269
    refGenuine = 399 + 20; // 419
  } else if (modelLower.includes('14 pro max') || modelLower.includes('14promax')) {
    refIncell = 169 + 20; // 189
    refSoftOLED = 249 + 20; // 269
    refGenuine = 449 + 20; // 469
  } else if (modelLower.includes('14 pro') || modelLower.includes('14pro')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 259 + 20; // 279
    refGenuine = 399 + 20; // 419
  } else if (modelLower.includes('14 plus') || modelLower.includes('14plus')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 199 + 20; // 219
    refGenuine = 399 + 20; // 419
  } else if (modelLower.includes('14') && !modelLower.includes('pro') && !modelLower.includes('plus')) {
    refIncell = 150 + 20; // 170
    refSoftOLED = 199 + 20; // 219
    refGenuine = 349 + 20; // 369
  } else if (modelLower.includes('13 pro max') || modelLower.includes('13promax')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 199 + 20; // 219
    refGenuine = 349 + 20; // 369
  } else if (modelLower.includes('13 pro') || modelLower.includes('13pro')) {
    refIncell = 149 + 20; // 169
    refSoftOLED = 199 + 20; // 219
    refGenuine = 299 + 20; // 319
  } else if (modelLower.includes('13 mini') || modelLower.includes('13mini')) {
    refIncell = 109 + 20; // 129
    refSoftOLED = 169 + 20; // 189
    refGenuine = 249 + 20; // 269
  } else if (modelLower.includes('13') && !modelLower.includes('pro') && !modelLower.includes('mini')) {
    refIncell = 129 + 20; // 149
    refSoftOLED = 199 + 20; // 219
    refGenuine = 299 + 20; // 319
  } else if (modelLower.includes('12 pro max') || modelLower.includes('12promax')) {
    refIncell = 129 + 20; // 149
    refSoftOLED = 199 + 20; // 219
    refGenuine = 349 + 20; // 369
  } else if (modelLower.includes('12 pro') || modelLower.includes('12pro')) {
    refIncell = 139; // 139
    refSoftOLED = 219; // 219
    refGenuine = 349 + 20; // 369
  } else if (modelLower.includes('12 mini') || modelLower.includes('12mini')) {
    refIncell = 99 + 20; // 119
    refSoftOLED = 159 + 20; // 179
    refGenuine = 229 + 20; // 249
  } else if (modelLower.includes('12')) {
    refIncell = 139; // 139
    refSoftOLED = 219; // 219
    refGenuine = 229 + 20; // 249
  } else if (modelLower.includes('11 pro max') || modelLower.includes('11promax')) {
    refIncell = 119 + 20; // 139
    refSoftOLED = 179 + 20; // 199
    refGenuine = 299 + 20; // 319
  } else if (modelLower.includes('11 pro') || modelLower.includes('11pro')) {
    refIncell = 119 + 20; // 139
    refSoftOLED = 179 + 20; // 199
    refGenuine = 299 + 20; // 319
  } else if (modelLower.includes('11') || modelLower.includes('xr')) {
    refIncell = 99 + 20; // 119
    refSoftOLED = 149 + 20; // 169
    refGenuine = 249 + 20; // 269
  } else {
    refGenuine = basePrice;
    if (basePrice > 400) {
      refSoftOLED = basePrice - 200;
      refIncell = basePrice - 300;
    } else if (basePrice > 250) {
      refSoftOLED = basePrice - 80;
      refIncell = basePrice - 130;
    } else {
      refSoftOLED = basePrice - 50;
      refIncell = basePrice - 90;
    }
  }

  const finalIncell = refIncell;
  const finalSoftOLED = refSoftOLED;
  const finalGenuine = refGenuine;

  const options = [
    {
      id: 'incell',
      name: 'Aftermarket In-Cell LCD 120Hz',
      price: `A$${finalIncell.toFixed(2)}`,
      description: 'A cost-effective choice for screen replacement. This in-cell LCD screen offers smooth daily performance. Note: It is slightly thicker than the OLED display and may cause slightly higher battery usage, backed by our 12-month warranty.'
    },
    {
      id: 'soft_oled',
      name: 'Aftermarket Soft OLED 120Hz',
      price: `A$${finalSoftOLED.toFixed(2)}`,
      description: 'Our most popular selection. This high-grade Soft OLED display mimics original performance with a 120Hz refresh rate, vibrant colors, deep black contrast, and optimal battery efficiency.'
    }
  ];

  if (!(modelLower === 'iphone 16 pro' || modelLower === 'iphone 16pro' || modelLower.includes('16 plus') || modelLower.includes('16plus') || modelLower === 'iphone 16')) {
    options.push({
      id: 'genuine',
      name: `Genuine ${brandName} OLED`,
      price: `A$${finalGenuine.toFixed(2)}`,
      description: 'The premium factory-grade screen replacement. Restores original brightness, full HDR color accuracy, perfect touch response, and official True Tone functionality with maximal durability.'
    });
  }

  if (modelLower.includes('16 plus') || modelLower.includes('16plus')) {
    options[0].price = 'A$219.00';
  }

  if (modelLower === 'iphone 16') {
    options[0].price = 'A$219.00';
    options[1].price = 'A$269.00';
  }

  return options;
};

const getAppleiPhoneRepairPrice = (modelName, repairName, dbPrice) => {
  const modelLower = modelName.toLowerCase();
  const repairLower = repairName.toLowerCase();

  if (modelLower === 'iphone 13 mini') {
    if (repairLower.includes('back glass')) {
      return 'A$170.00';
    }
    if (repairLower.includes('screen') || repairLower.includes('display')) {
      return 'A$139.00';
    }
  }

  if (modelLower === 'iphone 12 pro' || modelLower === 'iphone 12' || modelLower === 'iphone 12 mini') {
    if (!repairLower.includes('screen') && !repairLower.includes('display')) {
      return dbPrice;
    }
  }

  if (modelLower === 'iphone 11 pro max' || modelLower === 'iphone 11 pro' || modelLower === 'iphone 11' || modelLower === 'iphone xs max' || modelLower === 'iphone xs' || modelLower === 'iphone x' || modelLower === 'iphone 8 plus' || modelLower === 'iphone 8') {
    return dbPrice;
  }
  if (modelLower === 'iphone 17e' || modelLower === 'iphone 17 pro max' || modelLower === 'iphone 17 pro' || modelLower === 'iphone 17' || modelLower === 'iphone 16e' || modelLower === 'iphone 16 pro max' || modelLower === 'iphone 16promax' || modelLower === 'iphone 16 pro' || modelLower === 'iphone 16pro' || modelLower.includes('16 plus') || modelLower.includes('16plus') || modelLower === 'iphone 16' || modelLower.includes('15 pro max') || modelLower.includes('15promax') || modelLower === 'iphone 15' || modelLower.includes('14 pro max') || modelLower.includes('14promax') || modelLower === 'iphone 14 pro' || modelLower === 'iphone 14pro' || modelLower.includes('14 plus') || modelLower.includes('14plus') || modelLower === 'iphone 14' || modelLower.includes('13 pro max') || modelLower.includes('13promax') || modelLower === 'iphone 13 pro' || modelLower === 'iphone 13pro' || modelLower === 'iphone 13') {
    return dbPrice;
  }

  // If it's a diagnostic or free
  if (repairLower.includes('diagnostic') || dbPrice === 'Free' || dbPrice === '0') {
    return 'Free';
  }

  const is16Series = modelLower.includes('16');
  const is15Series = modelLower.includes('15');
  const is14Series = modelLower.includes('14');
  const is13Series = modelLower.includes('13');
  const is12Series = modelLower.includes('12');
  const is11Series = modelLower.includes('11');
  const isXrXsX = modelLower.includes('xr') || modelLower.includes('xs') || modelLower.includes('x') || modelLower.includes('se');

  // 1. Screen Repair starting price
  if (repairLower.includes('screen') || repairLower.includes('display') || (repairLower.includes('glass') && !repairLower.includes('back') && !repairLower.includes('rear') && !repairLower.includes('camera'))) {
    if (is16Series) {
      if (modelLower.includes('pro max') || modelLower.includes('promax')) return 'A$269';
      if (modelLower.includes('pro')) return 'A$219';
      if (modelLower.includes('plus')) return 'A$199';
      return 'A$179';
    }
    if (is15Series) {
      if (modelLower.includes('pro max') || modelLower.includes('promax')) return 'A$219';
      if (modelLower.includes('pro')) return 'A$199';
      if (modelLower.includes('plus')) return 'A$169';
      return 'A$149';
    }
    if (is14Series) {
      if (modelLower.includes('pro max') || modelLower.includes('promax')) return 'A$199';
      if (modelLower.includes('pro')) return 'A$179';
      if (modelLower.includes('plus')) return 'A$149';
      return 'A$129';
    }
    if (is13Series) {
      if (modelLower.includes('pro max') || modelLower.includes('promax')) return 'A$189';
      if (modelLower.includes('pro')) return 'A$169';
      return 'A$129';
    }
    if (is12Series) {
      if (modelLower.includes('pro max') || modelLower.includes('promax')) return 'A$149';
      if (modelLower.includes('pro')) return 'A$149';
      if (modelLower === 'iphone 12') return 'A$139';
      return 'A$119';
    }
    if (is11Series || isXrXsX) {
      if (modelLower.includes('pro max') || modelLower.includes('promax')) return 'A$139';
      if (modelLower.includes('pro')) return 'A$139';
      return 'A$119';
    }
    return 'A$119';
  }

  // 2. Battery Replacement
  if (repairLower.includes('battery')) {
    if (is16Series) return 'A$170';
    if (is15Series) return 'A$159';
    if (is14Series) return 'A$170';
    if (is13Series) return 'A$140';
    if (is12Series) return 'A$130';
    if (is11Series) return 'A$119';
    return 'A$100';
  }

  // 3. Back Glass Replacement
  if (repairLower.includes('back glass') || repairLower.includes('rear glass') || repairLower.includes('back cover')) {
    if (is16Series || is15Series || is14Series) return 'A$170';
    if (is13Series) return 'A$150';
    if (is12Series) return 'A$140';
    if (is11Series) return 'A$130';
    return 'A$110';
  }

  // 4. Charging Port Replacement
  if (repairLower.includes('charging') || repairLower.includes('port') || repairLower.includes('usb')) {
    if (is16Series || is15Series) return 'A$170';
    if (is14Series || is13Series || is12Series || is11Series) return 'A$120';
    return 'A$100';
  }

  // 5. Front Camera
  if (repairLower.includes('front camera')) {
    if (is16Series || is15Series) return 'A$170';
    if (is14Series || is13Series || is12Series || is11Series) return 'A$120';
    return 'A$100';
  }

  // 6. Rear Camera
  if (repairLower.includes('rear camera') || (repairLower.includes('camera') && !repairLower.includes('glass') && !repairLower.includes('front'))) {
    if (is16Series) return 'A$270';
    if (is15Series || is14Series) return 'A$220';
    if (is13Series) return 'A$200';
    if (is12Series) return 'A$170';
    if (is11Series) return 'A$150';
    return 'A$120';
  }

  // 7. Camera Glass Broken
  if (repairLower.includes('camera glass')) {
    return 'A$70';
  }

  // 8. Speaker Repair
  if (repairLower.includes('speaker')) {
    if (modelLower.includes('16 pro max') || modelLower.includes('16promax')) return 'A$87';
    if (is16Series || is15Series || is14Series || is13Series || is12Series) return 'A$120';
    if (is11Series) return 'A$110';
    return 'A$100';
  }

  // 9. Microphone Replacement
  if (repairLower.includes('microphone') || repairLower.includes('mic')) {
    if (is16Series) return 'A$170';
    if (is15Series || is14Series || is13Series || is12Series || is11Series) return 'A$120';
    return 'A$100';
  }

  // 10. Power / Volume Buttons
  if (repairLower.includes('power') || repairLower.includes('volume') || repairLower.includes('button')) {
    if (is16Series || is15Series || is14Series || is13Series || is12Series || is11Series) return 'A$170';
    return 'A$120';
  }

  // 11. Motherboard / Not Turning On / Water Damage
  if (repairLower.includes('motherboard') || repairLower.includes('logic') || repairLower.includes('turning on') || repairLower.includes('water') || repairLower.includes('liquid')) {
    if (is16Series) return 'A$320';
    if (is15Series) return 'A$270';
    if (is14Series || is13Series) return 'A$220';
    if (is12Series) return 'A$200';
    if (is11Series) return 'A$170';
    return 'A$150';
  }

  // 12. Software Update / Restore
  if (repairLower.includes('software')) {
    return 'A$70';
  }

  const match = dbPrice.match(/\d+/);
  if (match) {
    if (modelLower.includes('macbook air 13') && modelLower.includes('m3')) {
      return dbPrice;
    }
    const numericPrice = parseInt(match[0]);
    const adjusted = numericPrice + 20;
    return dbPrice.replace(/\d+/, adjusted);
  }

  return dbPrice;
};

export default function BookingModal() {
  const { isBookingModalOpen, closeBookingModal, updateBookingData, resetBookingData, bookingData } = useBooking();
  const navigate = useNavigate();
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
      resetBookingData();
      setSearchQuery('');
      setSelectedBaseRepair(null);
      setSelectedQualityOption('soft_oled');
    }
  }, [isBookingModalOpen]);

  if (!isBookingModalOpen) return null;

  const brandIcons = {
    'Apple': Smartphone, 'Samsung': Smartphone, 'Google': Smartphone, 'Microsoft': Laptop,
    'Oppo': Smartphone, 'Xiaomi': Smartphone, 'OnePlus': Smartphone, 'Motorola': Smartphone,
    'Huawei': Smartphone, 'Dell': Laptop, 'HP': Laptop, 'Lenovo': Laptop, 'Asus': Laptop, 'Acer': Laptop
  };

  const brands = Object.keys(repairDatabase).map(name => ({ name, icon: brandIcons[name] || Smartphone }));

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

    const shouldGoToStep5 = repair.partOption !== undefined ? repair.partOption : (isScreenRepair && isPhone);

    if (shouldGoToStep5) {
      setSelectedBaseRepair(repair);
      setStep(5);
    } else {
      const adjustedPrice = ((bookingData.brand === 'Google' && bookingData.deviceType === 'Pixel') || bookingData.model === 'iPhone 17e')
        ? repair.price
        : getAppleiPhoneRepairPrice(bookingData.model, repair.name, repair.price);
      updateBookingData({
        repair: {
          ...repair,
          price: adjustedPrice
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
    if (!bookingData?.brand || !repairDatabase[bookingData.brand]) return [];
    return Object.keys(repairDatabase[bookingData.brand]);
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
  const modelsForType = bookingData?.brand && bookingData?.deviceType && repairDatabase[bookingData.brand]?.[bookingData.deviceType]
    ? repairDatabase[bookingData.brand][bookingData.deviceType].models
    : [];

  const filteredModels = modelsForType.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Get repairs for selected model
  const repairsForModel = bookingData?.brand && bookingData?.deviceType && bookingData?.model && repairDatabase[bookingData.brand]?.[bookingData.deviceType]
    ? repairDatabase[bookingData.brand][bookingData.deviceType].repairs[bookingData.model] || []
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
    5: `${bookingData?.brand}  >  ${bookingData?.deviceType}  >  ${bookingData?.model}`
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
                            <p className="font-bold text-[#0F172A] text-sm">{model.name}</p>
                            <p className="text-xs text-[#64748B] font-medium">{model.year}</p>
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
                className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {repairsForModel.map((repair, i) => {
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

                  const displayPrice = ((bookingData.brand === 'Google' && bookingData.deviceType === 'Pixel') || bookingData.model === 'iPhone 17e')
                    ? repair.price
                    : getAppleiPhoneRepairPrice(bookingData.model, repair.name, repair.price);

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
                })}
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
                  {getScreenOptions(selectedBaseRepair.price, bookingData.model, bookingData.brand, selectedBaseRepair.name).map((option) => {
                    const isSelected = selectedQualityOption === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => setSelectedQualityOption(option.id)}
                        className={`text-left p-6 rounded-3xl border-2 transition-all cursor-pointer ${isSelected
                          ? 'border-[#FFDE21] bg-amber-50/10 shadow-lg shadow-[#FFDE21]/5'
                          : 'border-[#E2E8F0] hover:border-gray-300 bg-white'
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-extrabold text-[#0F172A] text-lg leading-snug">{option.name}</h4>
                            {option.id === 'soft_oled' && (
                              <span className="bg-[#FFDE21] text-white text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
                                Recommended
                              </span>
                            )}
                            {option.id === 'genuine' && (
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

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}









