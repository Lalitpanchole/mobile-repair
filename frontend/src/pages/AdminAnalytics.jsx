import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Calendar, DollarSign, TrendingUp, Download, 
  Printer, ArrowUpRight, Wrench, Clock, Smile, ChevronRight
} from 'lucide-react';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30days');

  const cards = [
    { title: 'Gross Revenue', value: '$45,231.89', change: '+20.1%', positive: true, icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Repair Efficiency', value: '1.2 days', change: '-8.5%', positive: true, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Satisfaction Score', value: '98.6%', change: '+1.2%', positive: true, icon: Smile, color: 'text-purple-500 bg-purple-500/10' },
  ];

  // SVG Chart Coordinates (Width: 600, Height: 200)
  const linePoints = [
    { label: 'Week 1', val: 3200 },
    { label: 'Week 2', val: 4500 },
    { label: 'Week 3', val: 3800 },
    { label: 'Week 4', val: 5600 },
    { label: 'Week 5', val: 4900 },
    { label: 'Week 6', val: 7200 },
  ];

  const maxVal = 8000;
  const padding = 30;
  const chartHeight = 160;
  const chartWidth = 600;
  
  const getSplinePath = () => {
    const step = (chartWidth - padding * 2) / (linePoints.length - 1);
    let path = `M ${padding} ${chartHeight - (linePoints[0].val / maxVal) * (chartHeight - padding * 2)}`;
    
    for (let i = 1; i < linePoints.length; i++) {
      const x = padding + i * step;
      const y = chartHeight - (linePoints[i].val / maxVal) * (chartHeight - padding * 2);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  const getAreaPath = () => {
    const spline = getSplinePath();
    const step = (chartWidth - padding * 2) / (linePoints.length - 1);
    const endX = padding + (linePoints.length - 1) * step;
    return `${spline} L ${endX} ${chartHeight} L ${padding} ${chartHeight} Z`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-[#F3F4F6]">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-amber-500" /> Reports &amp; Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Analyze revenue margins, workload statistics, and store feedback indexes.
          </p>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] text-gray-750 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex-1 sm:flex-none premium-button bg-[#FFDE21] text-white flex items-center justify-center gap-2 px-4 py-2 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Date Filters Row */}
      <div className="flex justify-between items-center bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] p-4 rounded-2xl shadow-sm transition-colors duration-300">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {[
            { id: '7days', name: 'Last 7 Days' },
            { id: '30days', name: 'Last 30 Days' },
            { id: 'ytd', name: 'Year to Date' },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeRange === range.id ? 'bg-white dark:bg-[#111827] text-amber-600 dark:text-amber-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              {range.name}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-amber-500" /> May 1 - Jun 3, 2026</span>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
            >
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-450 uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{card.value}</p>
                <span className={`inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  card.change.includes('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-100 text-red-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <div className={`p-4 rounded-2xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Graph and Breakdown Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-sm transition-colors duration-300">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> Revenue Growth Curve
            </h2>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Weekly performance tracking</p>
          </div>

          <div className="w-full h-64 mt-4 flex items-end">
            <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFDE21" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FFDE21" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                <line 
                  key={i}
                  x1="10"
                  y1={r * 120 + 20}
                  x2="590"
                  y2={r * 120 + 20}
                  className="stroke-gray-100 dark:stroke-gray-800/40"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area */}
              <path d={getAreaPath()} fill="url(#areaGradient)" />

              {/* Spline Path */}
              <path d={getSplinePath()} fill="none" stroke="#FFDE21" strokeWidth="3" strokeLinecap="round" />

              {/* Plot Nodes */}
              {linePoints.map((pt, idx) => {
                const step = (chartWidth - padding * 2) / (linePoints.length - 1);
                const x = padding + idx * step;
                const y = chartHeight - (pt.val / maxVal) * (chartHeight - padding * 2);

                return (
                  <g key={idx} className="group/node">
                    <circle cx={x} cy={y} r="4" className="fill-amber-600 dark:fill-amber-500 stroke-white dark:stroke-[#111827] group-hover/node:r-6 transition-all" strokeWidth="2" />
                    <text x={x} y="155" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500 text-[10px] font-bold">{pt.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Channels Breakdown */}
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-sm transition-colors duration-300 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" /> Channel Booking Rates
            </h2>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Customer channels split</p>
          </div>

          <div className="space-y-4 my-6">
            {[
              { source: 'Mobile Web App', percentage: 54, bookings: 648, color: 'bg-amber-500' },
              { source: 'Desktop Portal', percentage: 36, bookings: 432, color: 'bg-purple-500' },
              { source: 'In-Store kiosk', percentage: 10, bookings: 120, color: 'bg-emerald-500' },
            ].map((ch, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-baseline text-xs font-bold">
                  <span className="text-gray-600 dark:text-gray-400">{ch.source}</span>
                  <span className="text-gray-950 dark:text-white">{ch.bookings} ({ch.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${ch.color}`} style={{ width: `${ch.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-150 dark:border-[#1F2937] pt-4 flex justify-between items-center text-xs">
            <span className="text-gray-400 font-bold">Audited live database</span>
            <span className="text-amber-500 dark:text-[#FFDE21] font-bold hover:underline cursor-pointer flex items-center">Download PDF <ChevronRight className="w-4 h-4 ml-0.5" /></span>
          </div>
        </div>

      </div>

    </div>
  );
}










