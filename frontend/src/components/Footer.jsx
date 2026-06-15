import { Link } from 'react-router-dom';
import { Wrench, MapPin, Phone, Mail, Globe, MessageCircle, Share2, Camera, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#060913] py-8 md:py-12 border-t border-[#1e293b]/50 relative overflow-hidden text-gray-400">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10">
        


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-4">
          
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo variant="dark" className="h-12 w-auto drop-shadow-[0_0_20px_rgba(255,222,33,0.3)] transform group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
              Premium enterprise-grade device repair services. Fast, reliable, and guaranteed to bring your devices back to life.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <p className="text-gray-500 font-medium text-sm">© 2026 MPC Repairs. All rights reserved.</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-lg mb-4 tracking-tight">Services</h3>
            <ul className="space-y-2 font-medium text-sm">
              {['iPhone Repair', 'MacBook Repair', 'iPad Repair', 'Data Recovery', 'Battery Replacement'].map(item => (
                <li key={item}><a href="javascript:void(0)" className="hover:text-amber-400 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-white font-bold text-lg mb-4 tracking-tight">Contact Us</h3>
            <ul className="space-y-3 font-medium text-sm">
              <li className="flex items-start gap-4 group">
                <div className="p-2 bg-[#111827] rounded-lg border border-[#334155] text-amber-500 shrink-0 group-hover:scale-110 transition-transform"><MapPin className="w-5 h-5" /></div>
                <span className="leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">Westfield Kotara, K230, Level 2/89<br />Northcott Dr, Kotara NSW 2289</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-[#111827] rounded-lg border border-[#334155] text-green-500 shrink-0 group-hover:scale-110 transition-transform"><Phone className="w-5 h-5" /></div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">+61 426 186 212</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="p-2 bg-[#111827] rounded-lg border border-[#334155] text-purple-500 shrink-0 group-hover:scale-110 transition-transform"><Mail className="w-5 h-5" /></div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">mpcrepairskotara@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>


      </div>
    </footer>
  );
}


