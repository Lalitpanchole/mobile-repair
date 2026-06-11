import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.email === 'admin@gmail.com' && formData.password === '123') {
      sessionStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid email or password. Please use demo credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden font-sans">
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[#0F172A] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full font-bold text-sm hover:bg-white shadow-sm transition-all border border-[#E2E8F0]"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Left Side: Image (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#FFDE21]">
        {/* Unsplash Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=1200" 
            alt="Device Repair Desk" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-end p-16 w-full text-white pb-24">

          
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Manage repairs <br/>with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">precision.</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-md font-medium mb-12">
            The ultimate dashboard for tracking services, managing customers, and growing your repair business.
          </p>
          
          <div className="flex gap-8 border-t border-white/20 pt-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-1"><Zap className="w-5 h-5 text-yellow-400 fill-current" /> Fast</div>
              <p className="text-sm text-gray-400">Streamlined workflow</p>
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-1"><ShieldCheck className="w-5 h-5 text-amber-400" /> Secure</div>
              <p className="text-sm text-gray-400">Enterprise grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#F8FAFC] lg:bg-white relative">
        <div className="w-full max-w-md relative z-10">
          
          {/* Mobile Only Header */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <Logo variant="dark" className="h-12 w-auto drop-shadow-md" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3 tracking-tight">Welcome Back</h1>
              <p className="text-[#64748B] font-medium text-lg">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">!</div>
                  <p className="text-sm font-bold text-red-600">{error}</p>
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-2" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      className="w-full bg-white border border-[#E2E8F0] rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all duration-300 shadow-sm placeholder:text-gray-400"
                      placeholder="admin@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-2" htmlFor="password">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full bg-white border border-[#E2E8F0] rounded-2xl pl-12 pr-12 py-4 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#FFDE21]/20 focus:border-[#FFDE21] transition-all duration-300 shadow-sm placeholder:text-gray-400"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-[#FFDE21] transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-[#FFDE21] transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-[#E2E8F0] rounded-md bg-white peer-checked:bg-[#FFDE21] peer-checked:border-[#FFDE21] transition-all"></div>
                    <svg className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 left-[3px] top-[3px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-semibold text-[#64748B] group-hover:text-[#0F172A] transition-colors">Remember me</span>
                </label>
                <a href="#" className="font-bold text-[#FFDE21] hover:text-[#1D4ED8] transition-colors">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="w-full premium-button bg-[#FFDE21] text-white py-4 text-base font-bold shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_25px_-8px_rgba(37,99,235,0.6)] rounded-2xl mt-4"
              >
                Sign In
              </button>
            </form>


          </motion.div>
        </div>
      </div>
      
    </div>
  );
}









