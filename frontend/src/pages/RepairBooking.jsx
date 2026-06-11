import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Star, ShieldCheck, Clock, MapPin, ChevronLeft, ChevronRight, Calendar as CalendarIcon, MessageSquare, Building2
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { Navigate } from 'react-router-dom';

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

export default function RepairBooking() {
  const { bookingData, addBooking, openBookingModal } = useBooking();

  // If user navigates directly without selecting device, we could redirect or show a fallback.
  // For now, we will use fallback mock data if bookingData is empty.
  const brand = bookingData?.brand || 'Apple';
  const model = bookingData?.model || 'iPhone 13 Pro';
  const repair = bookingData?.repair || { name: 'Screen Repair', price: '20$', duration: '1 hour' };
  const selectedScreenOption = bookingData?.repair?.selectedQualityId || 'soft_oled';

  const isScreenRepair = repair.name.toLowerCase().includes('screen') || repair.name.toLowerCase().includes('display') || repair.name.toLowerCase().includes('glass');
  const isPhone = !bookingData?.deviceType || bookingData.deviceType.toLowerCase().includes('phone') || bookingData.deviceType.toLowerCase() === 'iphone' || model.toLowerCase().includes('iphone');
  const showOptions = repair.partOption !== undefined ? repair.partOption : (isScreenRepair && isPhone);

  const screenOptions = showOptions ? getScreenOptions(repair.price, model, brand, repair.name) : [];
  const activeOption = showOptions ? screenOptions.find(opt => opt.id === selectedScreenOption) || screenOptions[1] : null;

  const isApple = brand.toLowerCase() === 'apple';
  const adjustedRepairPrice = (isApple && isPhone && !isScreenRepair) 
    ? getAppleiPhoneRepairPrice(model, repair.name, repair.price) 
    : repair.price;

  const currentPrice = showOptions ? activeOption.price : adjustedRepairPrice;

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Westfield Expert Kotara');
  const [selectedDateDay, setSelectedDateDay] = useState(12); // June 12, 2026
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:30 AM');
  const [notes, setNotes] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate calendar days for mock UI (June 2026 starting on Monday June 1st)
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);
  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM'];

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    setErrorMessage('');
    const dStr = `2026-06-${selectedDateDay.toString().padStart(2, '0')}`;

    addBooking({
      customer: fullName,
      phone,
      email,
      location: selectedLocation,
      brand,
      device: model,
      issue: showOptions ? `${repair.name} (${activeOption.name})` : repair.name,
      dateStr: dStr,
      time: selectedTimeSlot,
      type: 'In-Store',
      price: currentPrice,
      notes: notes,
      desc: `Location: ${selectedLocation}. Device model: ${model}. Contact: ${phone} (${email})`
    });

    setIsSuccessOpen(true);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-24">
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE21]"></span> {brand} {model}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight mb-4">
            {repair.name}.
          </h1>
          <p className="text-[#64748B] text-lg font-medium max-w-2xl">
            Fast, professional repair for your {model} — most jobs done same day, walk-ins welcome.
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
                About {model} {showOptions ? `${repair.name} (${activeOption.name})` : repair.name}
              </h2>
              <p className="text-[#64748B] font-medium leading-relaxed">
                {showOptions ? (
                  <>
                    Is your {model} broken or damaged? Get it fixed at our repair center. We offer a professional screen replacement utilizing our high-quality <strong>{activeOption.name}</strong>. {activeOption.description} This service is priced at <strong>{currentPrice}</strong> and includes a 12-month warranty with same-day completion.
                  </>
                ) : (
                  <>
                    Is your {model} broken or damaged? Get it fixed at our repair center. Professional {repair.name.toLowerCase()} service with transparent pricing from {repair.price}. Our skilled specialists use premium quality parts to fix your device fast. Whether it needs repair or full replacement, we'll restore it to perfect working condition.
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

                <form onSubmit={handleConfirmBooking} className="space-y-6">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-150">
                      {errorMessage}
                    </div>
                  )}

                  {/* Details */}
                  <div>
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Your Details</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="floating-label-input py-2.5 text-sm w-full font-bold focus:border-[#FFDE21] focus:ring-1 focus:ring-[#FFDE21]"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0F172A] mb-1.5">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="floating-label-input py-2.5 text-sm w-full font-bold focus:border-[#FFDE21] focus:ring-1 focus:ring-[#FFDE21]"
                          placeholder="+61 412 345 678"
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
                        className="floating-label-input py-2.5 text-sm w-full font-bold focus:border-[#FFDE21] focus:ring-1 focus:ring-[#FFDE21]"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Select Location *</p>
                    <div className="space-y-3">
                      {[
                        { name: 'Westfield Expert Kotara', address: 'K230, Level 2/89 Northcott Dr, Kotara NSW 2289' }
                      ].map((loc, i) => (
                        <label key={i} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:border-[#FFDE21] group ${selectedLocation === loc.name ? 'border-[#FFDE21] bg-amber-50/50' : 'border-[#E2E8F0]'
                          }`}>
                          <input
                            type="radio"
                            name="location"
                            className="text-[#FFDE21] w-4 h-4 cursor-pointer"
                            checked={selectedLocation === loc.name}
                            onChange={() => setSelectedLocation(loc.name)}
                          />
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-[#0F172A]">{loc.name}</p>
                            <p className="text-sm font-medium text-[#64748B] mt-0.5">{loc.address}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">Choose Appointment</p>

                    {/* Calendar grid widget */}
                    <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-white shadow-sm mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <button type="button" className="p-1 hover:bg-gray-50 rounded-lg text-gray-450"><ChevronLeft className="w-5 h-5" /></button>
                        <span className="font-extrabold text-sm text-[#0F172A]">June 2026</span>
                        <button type="button" className="p-1 hover:bg-gray-50 rounded-lg text-[#FFDE21]"><ChevronRight className="w-5 h-5" /></button>
                      </div>
                      <div className="grid grid-cols-7 text-center gap-1 mb-2">
                        {days.map(d => <div key={d} className="text-[10px] font-extrabold text-[#64748B] uppercase">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 text-center gap-1.5">
                        {dates.slice(0, 14).map(d => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDateDay(d)}
                            className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center mx-auto transition-colors cursor-pointer border-0
                              ${selectedDateDay === d
                                ? 'bg-[#FFDE21] text-white shadow-md shadow-amber-500/20'
                                : 'text-[#0F172A] hover:bg-gray-50 bg-transparent'}
                            `}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time slots widget */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Available Time Slots</label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(slot => (
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
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="bg-gray-50/50 rounded-2xl p-4 border border-[#E2E8F0] focus-within:border-[#FFDE21] focus-within:bg-amber-50/20 transition-all group">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 group-focus-within:text-[#0F172A] transition-colors">
                      <MessageSquare className="w-4 h-4 text-[#FFDE21]" /> Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="3"
                      className="w-full bg-transparent border-0 focus:ring-0 p-0 text-sm font-medium text-[#0F172A] placeholder-gray-400 resize-none outline-none"
                      placeholder="Share any specific details about the issue, passcodes if needed, or special requests..."
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
              <p className="text-gray-500 text-sm font-semibold mb-6">
                Your booking for <strong>{model} {repair.name}</strong> has been successfully registered. We will see you at <strong>{selectedLocation}</strong> on <strong>June {selectedDateDay}, 2026 at {selectedTimeSlot}</strong>.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessOpen(false);
                    setFullName('');
                    setPhone('');
                    setEmail('');
                    setSelectedDateDay(12);
                    setSelectedTimeSlot('10:30 AM');
                  }}
                  className="w-full premium-button bg-[#0F172A] text-white font-bold py-3 rounded-xl shadow-lg cursor-pointer border-0"
                >
                  Done
                </button>
                <a
                  href="/admin"
                  className="block text-xs font-bold text-[#FFDE21] hover:underline py-1"
                >
                  Go to Admin Dashboard to check calendar
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}










