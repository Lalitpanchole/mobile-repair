import { motion } from 'framer-motion';
import { Settings, Battery, Droplets, HardDrive, CheckCircle2, ChevronDown, Star, ArrowRight, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useBooking } from '../../context/BookingContext';

export function ServicesSection() {
  const services = [
    { title: 'Screen Replacement', icon: Settings, desc: 'Original quality displays with true tone restoration.' },
    { title: 'Battery Service', icon: Battery, desc: 'High-capacity cells with 100% health guarantee.' },
    { title: 'Water Damage', icon: Droplets, desc: 'Advanced ultrasonic cleaning and board repair.' },
    { title: 'Data Recovery', icon: HardDrive, desc: 'Level 3 micro-soldering for dead motherboards.' },
  ];

  return (
    <section className="py-8 md:py-12 relative bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-10 md:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-6 tracking-tight"
          >
            Specialized Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium"
          >
            We handle complex logic board repairs that other shops simply can't fix.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-600 transition-all duration-500">
                  <Icon className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{service.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const steps = [
    { num: '01', title: 'Book Online', desc: 'Select your device and schedule a mail-in or walk-in repair.' },
    { num: '02', title: 'Free Diagnostic', desc: 'We analyze the device and provide a transparent quote.' },
    { num: '03', title: 'Expert Repair', desc: 'Our certified technicians fix your device using premium parts.' },
    { num: '04', title: 'Return & Warranty', desc: 'Device returned with a lifetime warranty on parts and labor.' },
  ];

  return (
    <section className="py-8 md:py-12 relative bg-white border-y border-[#E2E8F0] overflow-hidden" id="process">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-10 md:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-6 tracking-tight"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto font-medium"
          >
            A seamless, transparent process from start to finish.
          </motion.p>
        </div>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-10 md:left-0 md:top-10 md:bottom-auto md:w-full w-0.5 md:h-0.5 bg-gradient-to-b md:bg-gradient-to-r from-amber-100 via-amber-500 to-amber-100 z-0 opacity-20" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10 pl-20 md:pl-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col md:items-center md:text-center group"
              >
                <div className="absolute -left-20 md:relative md:-left-auto md:mx-auto w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-[#F8FAFC] rounded-full flex items-center justify-center text-xl md:text-2xl font-black text-gray-300 mb-8 shadow-sm group-hover:border-[#FFDE21] group-hover:text-[#FFDE21] transition-all duration-500 group-hover:scale-110">
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{step.title}</h3>
                <p className="text-[#64748B] font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const testimonials = [
    { name: "Sarah Jenkins", role: "Google", text: "Very prompt service and overall waiting time was convenient. The repair made the phone look as new and the technician was generous enough to throw in a free screen protector. This is my second experience here and I can proudly say it was a 5 star service both times. Highly...", rating: 5, date: "1 MONTH AGO", img: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random" },
    { name: "Michael Chen", role: "Google", text: "Walked in with a completely broken screen and cracked back glass on my iPhone 13 Pro, and within an hour, left with it good as new. Staff was obviously very well versed in his skills, as well as being kind and generous. Highly recommend their service!", rating: 5, date: "1 MONTH AGO", img: "https://ui-avatars.com/api/?name=Michael+Chen&background=random" },
    { name: "Emma Thompson", role: "Google", text: "I recently had my phone repaired at this shop, and the experience was outstanding from start to finish. The team was professional, knowledgeable, and transparent throughout the entire process. They diagnosed the issue quickly, explained the repair clearly, and delivered the phone back to...", rating: 5, date: "2 MONTHS AGO", img: "https://ui-avatars.com/api/?name=Emma+Thompson&background=random" }
  ];

  return (
    <section className="py-8 md:py-12 bg-white relative overflow-hidden" id="reviews">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12">
          <div className="text-left">
            <p className="text-amber-600 font-bold text-xs uppercase tracking-wider mb-2">Google Customer Reviews</p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight"
            >
              What real customers say.
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0 flex items-center gap-4 bg-[#F8FAFC] border border-gray-200 rounded-full px-6 py-3 shadow-sm"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-6 h-6" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#0F172A]">4.9</span>
                <div className="flex text-[#FFDE21]">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium">from 10,000+ reviews</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-500 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex text-[#FFDE21]">
                  {[...Array(t.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-xs font-bold text-gray-400">{t.date}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-8 leading-relaxed flex-grow">"{t.text}"</p>
              <div className="flex items-center gap-3 border-t border-gray-50 pt-5 mt-auto">
                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-grow">
                  <h4 className="font-bold text-[#0F172A] text-sm">{t.name}</h4>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-3 h-3" />
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center flex justify-center">
          <div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-sm font-bold text-[#0F172A] hover:bg-gray-50 transition-colors shadow-sm group cursor-default"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            Read all 240 reviews on Google
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  const { openBookingModal } = useBooking();

  return (
    <section className="py-8 md:py-12 relative overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-yellow-500/10 rounded-full blur-[100px]" />
      
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight"
        >
          Ready to fix your device?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-amber-100/80 mb-12 max-w-3xl mx-auto font-medium"
        >
          Join over 10,000 happy customers who trusted us with their tech. Book a repair today and get 10% off your first service.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button 
            onClick={openBookingModal}
            className="premium-button bg-white text-[#0F172A] text-base px-8 py-3.5 hover:bg-gray-50 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Book Your Repair Now
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-base font-medium text-amber-200"
        >
          <span className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400" /> No Fix, No Fee</span>
          <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-amber-500/50" />
          <span className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400" /> Free Diagnostics</span>
          <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-amber-500/50" />
          <span className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400" /> Lifetime Warranty</span>
        </motion.div>
      </div>
    </section>
  );
}

export function ExplainerVideoSection() {
  const mixedVideos = [
    'https://www.pexels.com/download/video/6754832/',
    'https://www.pexels.com/download/video/6755157/',
    'https://www.pexels.com/download/video/6754815/'
  ];
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const activeVideoRef = useRef(null);
  const containerRef = useRef(null);

  const totalDuration = 33;
  const videoDuration = 11;

  const [config, setConfig] = useState({
    videoTitle: 'MPC Repairs Process Explainer Video',
    activeColor: 'blue'
  });

  useEffect(() => {
    const saved = localStorage.getItem('irepair_video_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse config on public page:", e);
      }
    }
  }, []);

  // Handle Play/Pause synchronization with current active video
  useEffect(() => {
    if (activeVideoRef.current) {
      if (isPlaying) {
        activeVideoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      } else {
        activeVideoRef.current.pause();
      }
    }
  }, [isPlaying, currentVideoIndex]);

  // Master timeline progress (0 to 33)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        return next > totalDuration ? 0 : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Map progress to current video index
  useEffect(() => {
    let newIndex = Math.floor(progress / videoDuration);
    if (newIndex >= mixedVideos.length) newIndex = 0;
    if (newIndex !== currentVideoIndex) {
      setCurrentVideoIndex(newIndex);
      // Ensure the new video starts from beginning of its chunk
      if (activeVideoRef.current) {
        activeVideoRef.current.currentTime = 0;
      }
    }
  }, [progress, currentVideoIndex, mixedVideos.length]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleSeek = (e) => {
    const val = parseInt(e.target.value, 10);
    setProgress(val);
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const themeColors = {
    blue: { text: 'text-amber-600', border: 'border-amber-500/20' },
    purple: { text: 'text-purple-600', border: 'border-purple-500/20' },
    emerald: { text: 'text-emerald-600', border: 'border-emerald-500/20' },
    amber: { text: 'text-amber-500', border: 'border-amber-500/20' },
    rose: { text: 'text-rose-600', border: 'border-rose-500/20' }
  };

  const theme = themeColors[config.activeColor] || themeColors.blue;

  return (
    <section className="py-12 md:py-16 bg-white border-y border-gray-100 dark:border-gray-800" id="explainer">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 text-center space-y-6">
        
        <div className="space-y-4">
          <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-bold ${theme.text} bg-gray-50 border border-gray-150 uppercase tracking-wider`}>
            {config.videoTitle}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight">
            See Us in Action
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Watch our certified engineers perform premium screen diagnostics and precision soldering repairs.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative aspect-video max-w-3xl mx-auto bg-black rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-[16px] border-[#0F172A] ring-1 ring-black/5"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {mixedVideos.map((src, index) => (
            <video
              key={index}
              ref={currentVideoIndex === index ? activeVideoRef : null}
              src={src}
              loop={true}
              muted={isMuted}
              playsInline
              onClick={togglePlay}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentVideoIndex === index ? 'opacity-100 z-10 cursor-pointer' : 'opacity-0 z-0'}`}
            />
          ))}

          {/* Custom Overlay Control Bar */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-12 pb-4 px-4 flex flex-col gap-2 transition-opacity duration-300 z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex items-center gap-4 text-white">
              <button onClick={togglePlay} className="hover:text-amber-500 transition outline-none">
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              
              <div className="text-xs font-medium w-10 text-center">{formatTime(progress)}</div>
              
              <input 
                type="range" 
                min="0" 
                max={totalDuration} 
                value={progress} 
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              
              <div className="text-xs font-medium w-10 text-center">{formatTime(totalDuration)}</div>

              <button onClick={toggleMute} className="hover:text-amber-500 transition outline-none">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button onClick={toggleFullscreen} className="hover:text-amber-500 transition outline-none">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

