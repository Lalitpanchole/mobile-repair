import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const { openBookingModal } = useBooking();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <section className="relative flex items-center justify-center pt-8 pb-8 md:pt-12 lg:pt-16 lg:pb-12 overflow-hidden bg-[#F8FAFC]">
      {/* Animated Background Glow Orbs */}
      <div className="absolute top-20 -left-20 w-[30rem] h-[30rem] bg-amber-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob pointer-events-none" />
      <div className="absolute top-40 -right-20 w-[30rem] h-[30rem] bg-yellow-300/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-purple-300/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000 pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 mb-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Accepting new repairs today
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-extrabold text-[#0F172A] leading-[1.1] mb-8 tracking-tight">
              Premium Repair.<br />
              <span className="gradient-text inline-block mt-2">Zero Compromise.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl font-medium leading-relaxed">
              Experience world-class device repair with enterprise-grade security, lightning-fast turnaround, and a lifetime warranty.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mb-14">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openBookingModal}
                className="premium-button bg-[#FFDE21] text-white flex items-center justify-center gap-2 group shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)]"
              >
                Start Repair
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </motion.button>

            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-8 border-t border-gray-200">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.img 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    key={i} 
                    src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} 
                    alt="User" 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md z-10" 
                    style={{ zIndex: 10 - i }}
                  />
                ))}
              </div>
              <div>
                <div className="flex gap-1 text-[#FFDE21] mb-1.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-gray-600 font-semibold text-sm">4.9/5 from 10k+ verified reviews</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: y1 }}
            className="relative hidden lg:block h-full min-h-[300px] xl:min-h-[400px] perspective-1000 -mt-[120px] lg:-mt-[180px] xl:-mt-[220px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-yellow-400/10 rounded-[3rem] rotate-3 blur-2xl" />
              
              <motion.div 
                initial={{ opacity: 0, rotateY: 15, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: -5, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                whileHover={{ rotateY: 0, scale: 1.02 }}
                className="relative z-10 w-full max-w-[250px] sm:max-w-[280px] lg:max-w-[300px] xl:max-w-[340px] mx-auto"
              >
                <img 
                  src="https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=1200" 
                  alt="3D Premium Device"
                  className="w-full h-auto object-cover rounded-[2.5rem] shadow-[0_30px_80px_-15px_rgba(37,99,235,0.3)] ring-1 ring-black/5"
                />
              </motion.div>
              
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-[15%] -left-[5%] glass-card p-4 flex items-center gap-4 z-20"
              >
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[#0F172A] font-bold text-sm">Lifetime</p>
                  <p className="text-gray-500 text-xs font-medium">Warranty</p>
                </div>
              </motion.div>

              <motion.div 
                style={{ y: y2 }}
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute bottom-[20%] -right-[5%] glass-card p-4 flex items-center gap-4 z-20"
              >
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
                  <Zap className="text-yellow-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-[#0F172A] font-bold text-sm">Under 2 Hrs</p>
                  <p className="text-gray-500 text-xs font-medium">Fast Turnaround</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}









