import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Save, Play, Pause, RefreshCw, Volume2, VolumeX, 
  Eye, Maximize, Tv, Smartphone, Tablet, Settings, Sliders, Palette, CheckCircle2
} from 'lucide-react';

export default function AdminVideo() {
  const videoRef = useRef(null);
  
  // Mixed videos
  const mixedVideos = [
    'https://www.pexels.com/download/video/6754832/',
    'https://www.pexels.com/download/video/6755157/',
    'https://www.pexels.com/download/video/6754815/'
  ];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Custom Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Settings Configuration Form States
  const [videoTitle, setVideoTitle] = useState('MPC Repairs Process Explainer Video');
  const [activeColor, setActiveColor] = useState('blue');
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Preset Premium Direct MP4 Technology Loops
  const presets = [
    {
      id: 'mixed-repair',
      name: 'Premium Repair Mix (45s)',
      url: 'MIXED_SEQUENCE',
    },
    {
      id: 'ui-design',
      name: 'UI Design Workflow',
      url: 'https://ak.picdn.net/shutterstock/videos/1068868616/preview/stock-footage-designer-working-on-ux-ui-design.mp4',
    },
    {
      id: 'software-dev',
      name: 'Software Development',
      url: 'https://ak.picdn.net/shutterstock/videos/1027162622/preview/stock-footage-programming-code-running-down-a-computer-screen-terminal.mp4',
    },
    {
      id: 'laptop-work',
      name: 'UX Prototyping',
      url: 'https://ak.picdn.net/shutterstock/videos/1054366601/preview/stock-footage-ux-designer-working-on-prototype.mp4',
    }
  ];

  const [selectedPreset, setSelectedPreset] = useState(presets[0].id);
  const [videoUrl, setVideoUrl] = useState(presets[0].url);

  // Custom switches
  const [autoplay, setAutoplay] = useState(false);
  const [loop, setLoop] = useState(true);
  const [muted, setMuted] = useState(true);

  // Load saved video settings on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('irepair_video_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.videoTitle) setVideoTitle(parsed.videoTitle);
        // FORCE 'MIXED_SEQUENCE' as default for this request
        setVideoUrl('MIXED_SEQUENCE');
        setSelectedPreset('mixed-repair');
        if (parsed.autoplay !== undefined) setAutoplay(parsed.autoplay);
        if (parsed.loop !== undefined) setLoop(parsed.loop);
        if (parsed.muted !== undefined) {
          setMuted(parsed.muted);
          setIsMuted(parsed.muted);
        }
        if (parsed.activeColor && ['blue', 'purple', 'emerald', 'amber', 'rose'].includes(parsed.activeColor)) {
          setActiveColor(parsed.activeColor);
        }
      } catch (e) {
        console.error("Failed to parse saved config:", e);
      }
    }
  }, []);

  // Switch mixed sequence videos every 11 seconds (approx 33s total loop)
  useEffect(() => {
    if (videoUrl === 'MIXED_SEQUENCE') {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % mixedVideos.length);
      }, 11000);
      return () => clearInterval(interval);
    }
  }, [videoUrl, mixedVideos.length]);

  // Themes Colors mapping
  const colors = {
    blue: { name: 'Sleek Blue', hex: '#FFDE21', text: 'text-amber-500', bg: 'bg-amber-600', hoverBg: 'hover:bg-amber-700', border: 'border-amber-500/25', ring: 'ring-amber-500/20' },
    purple: { name: 'Royal Purple', hex: '#8B5CF6', text: 'text-purple-500', bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700', border: 'border-purple-500/25', ring: 'ring-purple-500/20' },
    emerald: { name: 'Mint Emerald', hex: '#10B981', text: 'text-emerald-500', bg: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-700', border: 'border-emerald-500/25', ring: 'ring-emerald-500/20' },
    amber: { name: 'Sunset Amber', hex: '#FFDE21', text: 'text-amber-500', bg: 'bg-amber-600', hoverBg: 'hover:bg-amber-700', border: 'border-amber-500/25', ring: 'ring-amber-500/20' },
    rose: { name: 'Neon Rose', hex: '#F43F5E', text: 'text-rose-500', bg: 'bg-rose-600', hoverBg: 'hover:bg-rose-700', border: 'border-rose-500/25', ring: 'ring-rose-500/20' },
  };

  // Sync preset choice with URL field
  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    if (presetId !== 'custom') {
      const choice = presets.find(p => p.id === presetId);
      if (choice) {
        setVideoUrl(choice.url);
        setIsPlaying(false);
        setCurrentVideoIndex(0);
      }
    }
  };

  // Re-load video whenever source URL or index alters
  useEffect(() => {
    if (videoRef.current) {
      if (videoUrl !== 'MIXED_SEQUENCE') {
        videoRef.current.load();
      }
      setIsPlaying(false);
      if (autoplay || videoUrl === 'MIXED_SEQUENCE') {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(() => {
            setIsPlaying(false);
          });
        }
      }
    }
  }, [videoUrl, autoplay, currentVideoIndex]);

  // Video controller handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log('Playback error:', err);
        });
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleProgressChange = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Save settings to localStorage
    const config = {
      videoTitle,
      videoUrl,
      selectedPreset,
      autoplay,
      loop,
      muted,
      activeColor
    };
    localStorage.setItem('irepair_video_config', JSON.stringify(config));

    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10 space-y-8 animate-in fade-in duration-500 text-gray-900 dark:text-[#F3F4F6]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Video className="w-8 h-8 text-amber-500" /> Home Video Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Configure the promotional explainer video displayed on the homepage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Parameters Studio Form */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-sm h-fit space-y-6 transition-colors duration-300">
          
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <Sliders className={`w-5 h-5 ${colors[activeColor].text}`} />
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Video Parameters</h2>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Customize homepage looping explainer</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5 font-semibold text-sm">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Video Overlay Title</label>
              <input 
                type="text" 
                required
                value={videoTitle} 
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
              />
            </div>

            {/* Presets Repair loops */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Preset Repair Clips</label>
              <select 
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
              >
                {presets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
                <option value="custom">Custom MP4 Link...</option>
              </select>
            </div>

            {/* Video Url Input (only editable when custom is selected) */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Direct MP4 Source URL</label>
              <input 
                type="text" 
                required
                disabled={selectedPreset !== 'custom'}
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
                className={`w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1F2937] bg-transparent text-sm text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium ${selectedPreset !== 'custom' ? 'opacity-60 cursor-not-allowed bg-gray-50/50 dark:bg-gray-800/10' : ''}`}
              />
            </div>

            {/* Theme Accent selector */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Player Accent Color
              </label>
              <div className="flex gap-2">
                {Object.keys(colors).map((cKey) => {
                  const color = colors[cKey];
                  const isActive = activeColor === cKey;
                  return (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setActiveColor(cKey)}
                      className={`w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer relative ${color.bg} ${isActive ? 'scale-110 ring-4 ring-offset-2 dark:ring-offset-[#111827]' : 'opacity-70 hover:opacity-100'} border-0`}
                      style={{ ringColor: color.hex }}
                      title={color.name}
                    >
                      {isActive && <CheckCircle2 className="w-4 h-4 text-white font-black" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Configuration Switches */}
            <div className="space-y-3.5 pt-3 border-t border-gray-100 dark:border-gray-800">
              
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Autoplay video loops</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoplay} 
                    onChange={() => setAutoplay(!autoplay)}
                    className="sr-only peer" 
                  />
                  <div className={`w-9 h-5 bg-gray-200 dark:bg-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all ${colors[activeColor].bg}`}></div>
                </label>
              </div>

              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Loop continuously</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={loop} 
                    onChange={() => setLoop(!loop)}
                    className="sr-only peer" 
                  />
                  <div className={`w-9 h-5 bg-gray-200 dark:bg-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all ${colors[activeColor].bg}`}></div>
                </label>
              </div>

              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Default Muted</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={muted} 
                    onChange={() => setMuted(!muted)}
                    className="sr-only peer" 
                  />
                  <div className={`w-9 h-5 bg-gray-200 dark:bg-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-4 after:w-4 after:transition-all ${colors[activeColor].bg}`}></div>
                </label>
              </div>

            </div>

            <button 
              type="submit"
              disabled={saving}
              className={`w-full premium-button ${colors[activeColor].bg} ${colors[activeColor].hoverBg} text-white flex items-center justify-center gap-2 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.3)] mt-4 cursor-pointer border-0 rounded-xl font-bold`}
            >
              {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Video Config</>}
            </button>
            
            {saved && (
              <p className="text-xs text-emerald-500 font-extrabold text-center mt-2 flex items-center justify-center gap-1">
                Homepage explainer video configuration saved successfully!
              </p>
            )}
          </form>
        </div>

        {/* Right Side: Viewport Simulator & Custom Player Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1F2937] rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 flex flex-col justify-between">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className={`w-5 h-5 ${colors[activeColor].text}`} /> Real-time Screen Simulator
              </h2>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Click frame options to view responsive layout scaling</p>
            </div>

            {/* Device Viewport controls */}
            <div className="flex bg-gray-50 dark:bg-gray-800 p-1 border border-gray-100 dark:border-gray-700 rounded-xl gap-0.5 self-end sm:self-auto">
              {[
                { id: 'desktop', label: 'Desktop', icon: Tv },
                { id: 'tablet', label: 'Tablet', icon: Tablet },
                { id: 'mobile', label: 'Mobile', icon: Smartphone },
              ].map((v) => {
                const Icon = v.icon;
                const isSel = viewport === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setViewport(v.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer border-0 flex items-center gap-1.5 ${
                      isSel 
                        ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-400 hover:text-gray-650'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulator Content Area */}
          <div className="flex-1 flex items-center justify-center p-2 bg-gray-50/50 dark:bg-gray-950/20 rounded-2xl min-h-[360px]">
            
            {/* Device Frame Wrap */}
            <div className={`transition-all duration-500 w-full flex flex-col items-center`}>
              
              <div 
                className={`relative bg-[#0F172A] border-[10px] dark:border-[#1E293B] shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 relative group ${
                  viewport === 'desktop' ? 'aspect-video w-full' :
                  viewport === 'tablet' ? 'aspect-[4/3] w-full max-w-sm border-[14px]' :
                  'aspect-[9/16] w-[220px] border-[14px]'
                }`}
              >
                {/* HTML5 Native Video Tag */}
                {videoUrl === 'MIXED_SEQUENCE' ? (
                  <>
                    {mixedVideos.map((src, index) => (
                      <video
                        key={index}
                        ref={currentVideoIndex === index ? videoRef : null}
                        src={src}
                        loop={true}
                        muted={isMuted}
                        autoPlay={autoplay}
                        onTimeUpdate={currentVideoIndex === index ? handleTimeUpdate : undefined}
                        onLoadedMetadata={currentVideoIndex === index ? handleLoadedMetadata : undefined}
                        onClick={handlePlayPause}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentVideoIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      />
                    ))}
                  </>
                ) : (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    loop={loop}
                    muted={isMuted}
                    autoPlay={autoplay}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={handlePlayPause}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Custom Overlay Controllers */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 flex flex-col justify-between p-4 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                  }`}
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(isPlaying)}
                >
                  
                  {/* Top Bar: Overlay Info */}
                  <div className="flex justify-between items-start text-white">
                    <div className="space-y-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white ${colors[activeColor].bg}`}>
                        PREVIEW
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold tracking-tight drop-shadow truncate max-w-[180px] sm:max-w-xs">{videoTitle}</h4>
                    </div>
                    <span className="text-[10px] bg-black/45 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 font-bold">
                      {viewport.toUpperCase()}
                    </span>
                  </div>

                  {/* Middle Play Button Overlay */}
                  <button 
                    onClick={handlePlayPause}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-0"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                  </button>

                  {/* Bottom Controller Bar */}
                  <div className="space-y-3">
                    
                    {/* Scrub/Progress Bar */}
                    <div className="flex items-center gap-2 text-white text-[10px] font-bold">
                      <span>{formatTime(currentTime)}</span>
                      <input 
                        type="range"
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="flex-1 accent-white h-1 bg-white/30 rounded-lg cursor-pointer appearance-none outline-none focus:outline-none"
                      />
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Button actions */}
                    <div className="flex justify-between items-center text-white">
                      
                      <div className="flex items-center gap-3">
                        <button 
                          type="button" 
                          onClick={handlePlayPause} 
                          className="hover:text-gray-300 transition-colors bg-transparent border-0 text-white cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>

                        {/* Mute and volume */}
                        <div className="flex items-center gap-2 group/volume">
                          <button 
                            type="button" 
                            onClick={handleMuteToggle} 
                            className="hover:text-gray-300 transition-colors bg-transparent border-0 text-white cursor-pointer"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <input 
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className={`w-0 group-hover/volume:w-12 transition-all duration-300 h-1 bg-white/30 rounded appearance-none outline-none focus:outline-none`}
                            style={{ accentColor: colors[activeColor].hex }}
                          />
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={handleFullscreen} 
                        className="hover:text-gray-300 transition-colors bg-transparent border-0 text-white cursor-pointer"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                      
                    </div>

                  </div>

                </div>

              </div>

              {/* Monitor Stand Base for Desktop View */}
              {viewport === 'desktop' && (
                <div className="hidden sm:flex flex-col items-center">
                  <div className="w-16 h-8 bg-gray-250 dark:bg-gray-800 border-x-2 border-b-2 border-gray-300 dark:border-gray-700"></div>
                  <div className="w-28 h-2 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
                </div>
              )}

            </div>

          </div>

          {/* System Instructions / Details */}
          <div className="bg-gray-50 dark:bg-gray-800/10 p-4 rounded-2xl text-[11px] font-bold text-gray-400 space-y-1.5 leading-relaxed">
            <span className="text-[10px] text-gray-450 uppercase font-black block mb-1">Redesign Walkthrough</span>
            <p>1. **Ad-Free Native Loop**: Dropped the cluttered YouTube embed logic to provide direct ad-free HTML5 background streaming.</p>
            <p>2. **Accent Branding**: Switch between accent colors to see how controls adjust styling instantly.</p>
            <p>3. **Viewport Simulators**: Hover over the device screens and click the controls to review progress indicators and play status.</p>
          </div>

        </div>

      </div>

    </div>
  );
}









