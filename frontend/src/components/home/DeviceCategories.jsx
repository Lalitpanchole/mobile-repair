import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Laptop, Tablet, Watch, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';

export default function DeviceCategories() {
  const [activeTab, setActiveTab] = useState(0);
  const { openBookingModal } = useBooking();

  const categories = [
    { 
      name: 'Smartphones', 
      icon: Smartphone, 
      count: '4.2k+ Repairs', 
      desc: 'From cracked screens to battery replacements and motherboard repairs, we restore your phone to factory condition in hours.',
      features: ['Genuine OEM Parts', 'Same-day Service', 'Lifetime Warranty'],
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      gradient: 'from-amber-600 to-yellow-500'
    },
    { 
      name: 'Laptops & MacBooks', 
      icon: Laptop, 
      count: '2.8k+ Repairs', 
      desc: 'Expert diagnostics and repairs for dead logic boards, liquid damage, broken hinges, and failing batteries.',
      features: ['Advanced Micro-soldering', 'Data Recovery', 'Thermal Repasting'],
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10',
      gradient: 'from-purple-600 to-pink-500'
    },
    { 
      name: 'Tablets & iPads', 
      icon: Tablet, 
      count: '1.5k+ Repairs', 
      desc: 'Precision glass replacement, charge port repair, and battery upgrades for all major tablet brands.',
      features: ['Dust-free Assembly', 'OEM Adhesives', 'Touch IC Repair'],
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
      gradient: 'from-emerald-500 to-teal-400'
    },
    { 
      name: 'Wearables', 
      icon: Watch, 
      count: '900+ Repairs', 
      desc: 'Delicate repairs for smartwatches including screen replacements and battery swaps while maintaining water resistance.',
      features: ['Water Resistance Testing', 'Micro-component Repair', 'Strap Replacement'],
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10',
      gradient: 'from-orange-500 to-amber-400'
    },
  ];

  return (
    <section className="py-10 md:py-12 relative bg-white z-10 border-y border-gray-100" id="services">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="mb-10 md:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight"
          >
            What can we fix for you?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-500 mt-6 max-w-2xl font-medium"
          >
            Select a category below to explore our specialized workflows and premium repair standards.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column: Interactive List */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-2">
            {categories.map((category, idx) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-500 group flex items-center justify-between ${
                  activeTab === idx 
                    ? 'bg-[#F8FAFC] shadow-sm border border-gray-100' 
                    : 'hover:bg-gray-50 border border-transparent cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                    activeTab === idx ? category.bg : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <category.icon className={`w-6 h-6 transition-colors duration-500 ${
                      activeTab === idx ? category.color : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`text-lg md:text-xl font-bold transition-colors duration-500 tracking-tight ${
                      activeTab === idx ? 'text-[#0F172A]' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      {category.name}
                    </h3>
                  </div>
                </div>
                <ArrowRight className={`w-5 h-5 transition-all duration-500 ${
                  activeTab === idx ? `${category.color} translate-x-0 opacity-100` : 'text-gray-300 -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                }`} />
              </motion.button>
            ))}
          </div>

          {/* Right Column: Dynamic Display Panel */}
          <div className="w-full lg:w-1/2">
            <div className="relative h-full min-h-[350px] w-full bg-[#0F172A] rounded-[2rem] overflow-hidden shadow-2xl p-8 md:p-10 flex flex-col justify-center border border-gray-800">
              {/* Background abstract gradient */}
              <div className="absolute inset-0 opacity-30">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`absolute -inset-1/2 rounded-full bg-gradient-to-br ${categories[activeTab].gradient} blur-[100px]`}
                  />
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative z-10"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">{categories[activeTab].count}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                    {categories[activeTab].name}
                  </h3>
                  
                  <p className="text-base text-gray-300 leading-relaxed mb-8 font-medium max-w-lg">
                    {categories[activeTab].desc}
                  </p>

                  <div className="space-y-3">
                    {categories[activeTab].features.map((feature, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        key={i} 
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${categories[activeTab].color.replace('text-', 'text-')}`} />
                        <span className="text-white font-semibold text-base">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <button 
                    onClick={openBookingModal}
                    className="mt-8 group inline-flex items-center gap-2 text-white font-bold text-base border-b-2 border-white/30 pb-1 hover:border-white transition-colors"
                  >
                    Start {categories[activeTab].name.split(' ')[0]} Repair
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

