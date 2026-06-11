import { Link } from 'react-router-dom';
import { Wrench, MapPin, Phone, Mail, Globe, MessageCircle, Share2, Camera, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#060913] py-12 md:py-20 border-t border-[#1e293b]/50 relative overflow-hidden text-gray-400">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10">
        
        {/* Newsletter / CTA Section */}
        <div className="mb-16 md:mb-20 bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-3xl p-8 md:p-12 border border-[#334155]/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">Stay updated with MPC Repairs</h2>
            <p className="text-gray-400 font-medium">Get exclusive repair tips and special offers directly to your inbox.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-[#0B0F19] border border-[#334155] rounded-xl px-4 py-3 w-full sm:w-64 md:w-80 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 w-full sm:w-auto rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0">
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo variant="dark" className="h-16 w-auto drop-shadow-[0_0_20px_rgba(255,222,33,0.3)] transform group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
              Premium enterprise-grade device repair services. Fast, reliable, and guaranteed to bring your devices back to life.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Camera, Share2].map((Icon, i) => (
                <a key={i} href="javascript:void(0)" className="w-10 h-10 rounded-full bg-[#111827] border border-[#334155] flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300 hover:scale-110">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6 tracking-tight">Services</h3>
            <ul className="space-y-4 font-medium text-sm">
              {['iPhone Repair', 'MacBook Repair', 'iPad Repair', 'Data Recovery', 'Battery Replacement'].map(item => (
                <li key={item}><a href="javascript:void(0)" className="hover:text-amber-400 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6 tracking-tight">Company</h3>
            <ul className="space-y-4 font-medium text-sm">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map(item => (
                <li key={item}><a href="javascript:void(0)" className="hover:text-amber-400 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-white font-bold text-lg mb-6 tracking-tight">Contact Us</h3>
            <ul className="space-y-5 font-medium text-sm">
              <li className="flex items-start gap-4 group">
                <div className="p-2 bg-[#111827] rounded-lg border border-[#334155] text-amber-500 shrink-0 group-hover:scale-110 transition-transform"><MapPin className="w-5 h-5" /></div>
                <span className="leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">Westfield Kotara, K230, Level 2/89<br />Northcott Dr, Kotara NSW 2289</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-[#111827] rounded-lg border border-[#334155] text-green-500 shrink-0 group-hover:scale-110 transition-transform"><Phone className="w-5 h-5" /></div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">+61 2 4016 2570</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-[#111827] rounded-lg border border-[#334155] text-purple-500 shrink-0 group-hover:scale-110 transition-transform"><Mail className="w-5 h-5" /></div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">support@irepair.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e293b] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <p className="text-gray-500 font-medium text-sm">Â© 2026 MPC Repairs. All rights reserved.</p>
          </div>
          <div className="flex gap-6 font-bold text-sm">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Admin Portal</Link>
            <a href="javascript:void(0)" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              System Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


