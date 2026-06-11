import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wrench, User, Shield } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import Logo from './Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openBookingModal } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'Reviews', href: '#reviews' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        // Navigate to home page first, then the hash will auto-scroll
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 600);
      } else {
        // Already on home page, just scroll after menu closes
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 350);
      }
    } else if (href === '/') {
      if (location.pathname === '/') {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 350);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-[#E2E8F0] shadow-sm py-2.5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo variant="light" className="h-10 w-auto transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name} 
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[#0F172A]/70 hover:text-[#FFDE21] transition-colors text-sm font-semibold relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#FFDE21] transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[#0F172A]/70 hover:text-[#FFDE21] transition-colors text-sm font-semibold relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#FFDE21] transition-all duration-300 group-hover:w-full rounded-full" />
                </a>
              )
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[#0F172A] font-semibold hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            >
              <User className="w-4 h-4" />
              Login
            </button>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openBookingModal}
              className="premium-button bg-[#FFDE21] text-white hover:shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)]"
            >
              Book Repair
            </motion.button>
          </div>

          <button 
            className="md:hidden text-[#0F172A] p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block px-4 py-3 text-base font-bold text-[#0F172A] hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a 
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-3 text-base font-bold text-[#0F172A] hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="pt-6 mt-2 border-t border-gray-100 flex flex-col gap-3">
                <button 
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gray-50 text-[#0F172A] font-bold hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <User className="w-5 h-5" /> Login
                </button>
                <button 
                  onClick={() => { openBookingModal(); setMobileMenuOpen(false); }}
                  className="w-full premium-button bg-[#FFDE21] text-white rounded-xl py-3.5 text-base"
                >
                  Book Repair
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}









