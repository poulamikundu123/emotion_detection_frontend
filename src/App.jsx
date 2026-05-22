import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, CameraOff, Music, Search, PlayCircle, Loader2, 
  Mic, Link, Volume2, Sparkles, Shuffle, Play, ChevronRight, HelpCircle 
} from 'lucide-react';

const PLAYLISTS = {
  Happy: "https://www.youtube.com/embed/2yjhszAnI5k?autoplay=1", 
  Sad: "https://www.youtube.com/embed/PebHWpYYW4E?autoplay=1", 
  Angry: "https://www.youtube.com/embed/gZwuU12nRrI?autoplay=1", 
  Fear: "https://www.youtube.com/embed/gUv1X6o-UvY?autoplay=1", 
  Surprise: "https://www.youtube.com/embed/Cyrp4W_uggk?autoplay=1", 
  Neutral: "https://www.youtube.com/embed/ZS7tYvJXkrw?autoplay=1", 
  Calm: "https://www.youtube.com/embed/3NycM9lYdRI?autoplay=1", 
  Energetic: "https://www.youtube.com/embed/HbElKpm9c3g?autoplay=1"
};

const EMOTION_EMOJIS = {
  Happy: "😄",
  Sad: "🥺",
  Angry: "😡",
  Fear: "😰",
  Surprise: "😮",
  Neutral: "😐",
  Calm: "😌",
  Energetic: "⚡",
  "No Face Detected": "❓"
};

const EMOTION_COLORS = {
  Happy: "text-yellow-400 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]",
  Sad: "text-blue-400 border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]",
  Angry: "text-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]",
  Fear: "text-purple-400 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.5)]",
  Surprise: "text-orange-400 border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.5)]",
  Neutral: "text-gray-300 border-gray-400 shadow-[0_0_20px_rgba(156,163,175,0.5)]",
  Calm: "text-teal-400 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.5)]",
  Energetic: "text-orange-500 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]",
  "No Face Detected": "text-gray-400 border-gray-500 shadow-[0_0_20px_rgba(156,163,175,0.3)]"
};

const MOOD_THEMES = {
  Happy: {
    bgGradient: "from-[#1a1605] via-[#0b0c10] to-[#120e02]",
    radialGlow: "radial-gradient(circle at 80% 20%, rgba(250,204,21,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(250,204,21,0.1), transparent 50%)",
    accent: "#facc15",
    accentText: "text-yellow-400",
    buttonBg: "bg-yellow-400/20 text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/30",
    scanColor: "bg-yellow-400/50 shadow-[0_0_10px_#facc15]",
    heading: "Sunny & Joyful",
    description: "Feel the positive energy! Let the bright tunes keep you smiling."
  },
  Sad: {
    bgGradient: "from-[#081226] via-[#0b0c10] to-[#040b17]",
    radialGlow: "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(59,130,246,0.1), transparent 50%)",
    accent: "#3b82f6",
    accentText: "text-blue-400",
    buttonBg: "bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30",
    scanColor: "bg-blue-500/50 shadow-[0_0_10px_#3b82f6]",
    heading: "Let the music hold you",
    description: "It's okay to feel down. Let these gentle melodies accompany your thoughts."
  },
  Angry: {
    bgGradient: "from-[#240a0a] via-[#0b0c10] to-[#140505]",
    radialGlow: "radial-gradient(circle at 80% 20%, rgba(239,68,68,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(239,68,68,0.1), transparent 50%)",
    accent: "#ef4444",
    accentText: "text-red-400",
    buttonBg: "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30",
    scanColor: "bg-red-500/50 shadow-[0_0_10px_#ef4444]",
    heading: "Intense & Fiery",
    description: "Channeling the energy! Time for some powerful, high-octane beats."
  },
  Fear: {
    bgGradient: "from-[#1b0826] via-[#0b0c10] to-[#0e0317]",
    radialGlow: "radial-gradient(circle at 80% 20%, rgba(168,85,247,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(168,85,247,0.1), transparent 50%)",
    accent: "#a855f7",
    accentText: "text-purple-400",
    buttonBg: "bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30",
    scanColor: "bg-purple-500/50 shadow-[0_0_10px_#a855f7]",
    heading: "Mysterious & Cozy",
    description: "Let's ease the tension. Breathe in and listen to relaxing, calming soundscapes."
  },
  Surprise: {
    bgGradient: "from-[#261508] via-[#0b0c10] to-[#140b03]",
    radialGlow: "radial-gradient(circle at 80% 20%, rgba(249,115,22,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(249,115,22,0.1), transparent 50%)",
    accent: "#f97316",
    accentText: "text-orange-400",
    buttonBg: "bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30",
    scanColor: "bg-orange-500/50 shadow-[0_0_10px_#f97316]",
    heading: "The world just got bigger",
    description: "Expect the unexpected! Here's an exciting playlist to match your spark."
  },
  Neutral: {
    bgGradient: "from-[#111827] via-[#0b0c10] to-[#030712]",
    radialGlow: "radial-gradient(circle at 80% 20%, rgba(102,252,241,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(102,252,241,0.1), transparent 50%)",
    accent: "#66fcf1",
    accentText: "text-[#66fcf1]",
    buttonBg: "bg-[#45a29e]/20 text-[#66fcf1] border-[#66fcf1]/50 hover:bg-[#45a29e]/40",
    scanColor: "bg-[#66fcf1]/50 shadow-[0_0_10px_#66fcf1]",
    heading: "Balanced & Focus",
    description: "Cool and collected. Enjoy some relaxing ambient and focus tracks."
  },
  Calm: {
    bgGradient: "from-[#081a24] via-[#0b0c10] to-[#051017]",
    radialGlow: "radial-gradient(circle at 80% 20%, rgba(45,212,191,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(45,212,191,0.1), transparent 50%)",
    accent: "#2dd4bf",
    accentText: "text-teal-400",
    buttonBg: "bg-teal-400/20 text-teal-400 border-teal-400/50 hover:bg-teal-400/30",
    scanColor: "bg-teal-400/50 shadow-[0_0_10px_#2dd4bf]",
    heading: "Peaceful and present",
    description: "Take a deep breath and connect. Smooth and soothing tracks for you."
  },
  Energetic: {
    bgGradient: "from-[#2a1506] via-[#0b0c10] to-[#150a03]",
    radialGlow: "radial-gradient(circle at 80% 20%, rgba(249,115,22,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(249,115,22,0.1), transparent 50%)",
    accent: "#f97316",
    accentText: "text-orange-500",
    buttonBg: "bg-orange-500/20 text-orange-500 border-orange-500/50 hover:bg-orange-500/30",
    scanColor: "bg-orange-500/50 shadow-[0_0_10px_#f97316]",
    heading: "Electric & High Energy",
    description: "Ignite the fire! High tempo, pulsating rhythms to elevate your mood."
  }
};

const PLAYLIST_TRACKS = {
  Happy: [
    { title: "Happy", artist: "Pharrell Williams", plays: "1.2B", time: "3:53", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/2smzJwgUYQY?autoplay=1" },
    { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", plays: "980M", time: "3:56", cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/R9Z8X45J5tM?autoplay=1" },
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", plays: "1.6B", time: "4:29", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/e_U3T94kLhM?autoplay=1" },
    { title: "Walking on Sunshine", artist: "Katrina and the Waves", plays: "340M", time: "3:58", cover: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/jpgvtdtgjTI?autoplay=1" },
    { title: "Good Vibrations", artist: "The Beach Boys", plays: "180M", time: "3:35", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/7ZuIwVvwe-I?autoplay=1" }
  ],
  Sad: [
    { title: "Hello", artist: "Adele", plays: "1.4B", time: "4:55", cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/mom24WidJ1Y?autoplay=1" },
    { title: "Someone Like You", artist: "Adele", plays: "1.2B", time: "4:45", cover: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/jC8mo8jj9L8?autoplay=1" },
    { title: "Fix You", artist: "Coldplay", plays: "890M", time: "4:54", cover: "https://images.unsplash.com/photo-1446057032654-9d8885b7a391?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/pefzSBTd0m0?autoplay=1" },
    { title: "Yesterday", artist: "The Beatles", plays: "310M", time: "2:05", cover: "https://images.unsplash.com/photo-1453733190148-c44698c26588?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/1hM81iZiTX4?autoplay=1" },
    { title: "Stay With Me", artist: "Sam Smith", plays: "980M", time: "2:52", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/xcj5fYVHwmI?autoplay=1" }
  ],
  Angry: [
    { title: "Thunderstruck", artist: "AC/DC", plays: "850M", time: "4:52", cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/tcA9-HZr6cs?autoplay=1" },
    { title: "In the End", artist: "Linkin Park", plays: "1.1B", time: "3:36", cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/coGLk2Clq3g?autoplay=1" },
    { title: "Killing in the Name", artist: "Rage Against the Machine", plays: "420M", time: "5:14", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/pYkEPuyT0Do?autoplay=1" },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", plays: "1.3B", time: "5:01", cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/XVD5Et-k52o?autoplay=1" },
    { title: "Chop Suey!", artist: "System of a Down", plays: "950M", time: "3:30", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/T-264qysl8c?autoplay=1" }
  ],
  Fear: [
    { title: "Breathe Me", artist: "Sia", plays: "240M", time: "4:34", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/oEZoqdZzjho?autoplay=1" },
    { title: "Running Up That Hill", artist: "Kate Bush", plays: "380M", time: "4:58", cover: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/H9jXaGVZsTk?autoplay=1" },
    { title: "In the Shadows", artist: "The Rasmus", plays: "150M", time: "4:18", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/mSJgwvSBBks?autoplay=1" },
    { title: "Nightcall", artist: "Kavinsky", plays: "210M", time: "4:18", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/VWaULZRTcNs?autoplay=1" },
    { title: "Creep", artist: "Radiohead", plays: "880M", time: "3:56", cover: "https://images.unsplash.com/photo-1453733190148-c44698c26588?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/kNORk6yFt_I?autoplay=1" }
  ],
  Surprise: [
    { title: "Lean On", artist: "Major Lazer & DJ Snake", plays: "1.5B", time: "2:56", cover: "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/b1qN9-vZFCM?autoplay=1" },
    { title: "Starboy", artist: "The Weeknd ft. Daft Punk", plays: "1.4B", time: "3:50", cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/yOOGW7fsnjI?autoplay=1" },
    { title: "Intro", artist: "The xx", plays: "420M", time: "2:08", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/znWMOOUT6V4?autoplay=1" },
    { title: "Midnight City", artist: "M83", plays: "390M", time: "4:03", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/wVcrWhHjmxE?autoplay=1" },
    { title: "Lights", artist: "Ellie Goulding", plays: "280M", time: "3:32", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/p58i0NS8-KY?autoplay=1" }
  ],
  Neutral: [
    { title: "Lofi Study Beats", artist: "Lofi Girl", plays: "Live", time: "24/7", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1" },
    { title: "Resonance", artist: "Home", plays: "290M", time: "3:32", cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/QvMrwrC218E?autoplay=1" },
    { title: "Weird Fishes/Arpeggi", artist: "Radiohead", plays: "120M", time: "5:18", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/XeKfPVQDoQs?autoplay=1" },
    { title: "Gymnopédie No. 1", artist: "Erik Satie", plays: "210M", time: "3:11", cover: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/2WfaotSK3mI?autoplay=1" },
    { title: "Clair de Lune", artist: "Claude Debussy", plays: "350M", time: "5:05", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/WNcsUNKlAKw?autoplay=1" }
  ],
  Calm: [
    { title: "Ocean Eyes", artist: "Billie Eilish", plays: "950M", time: "3:22", cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/IXZ-leHBdFk?autoplay=1" },
    { title: "Breathe (2AM)", artist: "Anna Nalick", plays: "180M", time: "4:04", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/D88dF1GDa5g?autoplay=1" },
    { title: "Holocene", artist: "Bon Iver", plays: "260M", time: "5:37", cover: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/M3q6fHdWbQ8?autoplay=1" },
    { title: "The Sound of Silence", artist: "Simon & Garfunkel", plays: "490M", time: "3:05", cover: "https://images.unsplash.com/photo-1453733190148-c44698c26588?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/GBUQUECiU8s?autoplay=1" },
    { title: "Moon River", artist: "Audrey Hepburn", plays: "210M", time: "2:43", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/BPMO769ZCkY?autoplay=1" }
  ],
  Energetic: [
    { title: "Levels", artist: "Avicii", plays: "620M", time: "3:19", cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/PSolYNrEiWc?autoplay=1" },
    { title: "Titanium", artist: "David Guetta ft. Sia", plays: "980M", time: "4:05", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/x_DXYtZK6BU?autoplay=1" },
    { title: "Don't Stop Me Now", artist: "Queen", plays: "890M", time: "3:29", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/LrQnnhAXLt0?autoplay=1" },
    { title: "Stronger", artist: "Kanye West", plays: "780M", time: "5:11", cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/DH4e3W9A8cI?autoplay=1" },
    { title: "Pump It", artist: "Black Eyed Peas", plays: "390M", time: "3:33", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&auto=format&fit=crop&q=60", embedUrl: "https://www.youtube.com/embed/GwnWM_UlHsk?autoplay=1" }
  ]
};

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [emotion, setEmotion] = useState("Neutral");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isOverride, setIsOverride] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(PLAYLISTS.Neutral);
  const [customLink, setCustomLink] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [isDetectionPaused, setIsDetectionPaused] = useState(false);
  const [activeTab, setActiveTab] = useState("pick-mood"); // "pick-mood" or "playlist-url"
  const [isPlayerOpen, setIsPlayerOpen] = useState(false); // Collapsible floating YouTube panel
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [volume, setVolume] = useState(72);

  // Bind stream to video element when it mounts or isCameraActive becomes true
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(e => console.error("Error playing video:", e));
    }
  }, [cameraStream, isCameraActive]);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraActive(true);
      setError(null);
      setIsDetectionPaused(false);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsDetecting(false);
    setIsDetectionPaused(false);
  };

  // Capture frame and send to backend
  const detectEmotion = async () => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current || isDetectionPaused) return;
    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) return;

    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    // Backend expects the full data URI so it can split by ','
    const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.8);

    setIsDetecting(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/detect-emotion', {
        image: base64Image
      });

      if (response.data && response.data.emotion) {
        const detectedEmotion = response.data.emotion;
        // capitalize first letter if needed, assume backend returns capitalized like "Happy" or "happy"
        let formattedEmotion = detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1).toLowerCase();
        
        // Map backend Surprise -> Surprised for consistency in UI
        if (formattedEmotion === "Surprise") {
          formattedEmotion = "Surprised";
        }
        
        if (formattedEmotion !== "No face detected" && formattedEmotion !== "No Face Detected") {
          // If surprise, map to Surprised
          const UI_EMOTION = formattedEmotion === "Surprise" ? "Surprised" : formattedEmotion;
          setEmotion(UI_EMOTION);
          setIsDetectionPaused(true);
          // If we detect an emotion, turn off camera feed after scanning for a polished feel
          stopCamera();
        } else {
          setEmotion("No Face Detected");
        }
      }
    } catch (err) {
      console.error("Error detecting emotion:", err);
    }
  };

  // Poll emotion every 2 seconds if camera is active and detection is not paused
  useEffect(() => {
    let intervalId;
    if (isCameraActive && !isDetectionPaused) {
      intervalId = setInterval(detectEmotion, 2000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCameraActive, isDetectionPaused]);

  // Update playlist when emotion changes (if not overridden)
  useEffect(() => {
    // Map Surprised -> Surprise for PLAYLISTS
    const playlistKey = emotion === "Surprised" ? "Surprise" : emotion;
    if (!isOverride && PLAYLISTS[playlistKey]) {
      setCurrentPlaylist(PLAYLISTS[playlistKey]);
    }
  }, [emotion, isOverride]);

  // Handle Manual Mood Selection
  const handleManualMood = (mood) => {
    setIsOverride(true);
    setEmotion(mood);
    const playlistKey = mood === "Surprised" ? "Surprise" : mood;
    setCurrentPlaylist(PLAYLISTS[playlistKey]);
  };

  // Restart AI face scanning
  const handleScanAgain = () => {
    setIsOverride(false);
    setIsDetectionPaused(false);
    startCamera();
  };

  // Handle Custom YouTube Link Submission
  const handleCustomLinkSubmit = (e) => {
    e.preventDefault();
    if (!customLink.trim()) return;
    
    // Simple logic to extract embed URL if regular YouTube link is pasted
    let finalUrl = customLink;
    if (customLink.includes("watch?v=")) {
      const videoId = new URL(customLink).searchParams.get("v");
      finalUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    setIsOverride(true);
    setCurrentPlaylist(finalUrl);
  };

  // Reset to AI mode
  const resetToAI = () => {
    setIsOverride(false);
    setCustomLink("");
    setIsDetectionPaused(false);
    // Map Surprised -> Surprise for PLAYLISTS
    const playlistKey = emotion === "Surprised" ? "Surprise" : emotion;
    if (PLAYLISTS[playlistKey]) {
      setCurrentPlaylist(PLAYLISTS[playlistKey]);
    }
  };

  // Map Surprised back to Surprise for internal dictionaries if required
  const themeKey = emotion === "Surprised" ? "Surprise" : (emotion === "No Face Detected" ? "Neutral" : emotion);
  const activeTheme = MOOD_THEMES[themeKey] || MOOD_THEMES.Neutral;
  
  // Get active tracklist
  const activeTracksKey = emotion === "Surprised" ? "Surprise" : (emotion === "No Face Detected" ? "Neutral" : emotion);
  const currentTracks = PLAYLIST_TRACKS[activeTracksKey] || PLAYLIST_TRACKS.Neutral;
  const playlistKey = currentPlaylist;

  return (
    <div 
      className={`min-h-screen p-4 md:p-8 flex flex-col items-center transition-all duration-1000 bg-gradient-to-br ${activeTheme.bgGradient}`}
      style={{
        backgroundImage: `${activeTheme.radialGlow}, linear-gradient(to bottom right, var(--tw-gradient-stops))`
      }}
    >
      <canvas ref={canvasRef} className="hidden" style={{ display: 'none' }} />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-6xl flex justify-between items-center mb-10 px-2 py-2"
      >
        {/* Logo moodwave */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-cyan-400 text-sm font-semibold">((o))</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            moodwave
          </span>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-300 transition-all duration-300 hover:w-36 overflow-hidden w-20 group">
            <Volume2 size={13} className="text-gray-400 shrink-0" />
            <span className="shrink-0">{volume}%</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 outline-none hidden group-hover:block transition-all"
            />
          </div>
        </div>
      </motion.header>

      {/* Main Grid: Split Layout */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 items-start mb-10">
        
        {/* Left Column: Vertical Emotion Card & Camera Circle */}
        <div className="lg:col-span-4 flex flex-col gap-6 items-start">
          
          <div className="flex flex-col gap-2">
            <span 
              className="text-xs uppercase font-extrabold tracking-widest transition-all duration-1000"
              style={{ color: activeTheme.accent }}
            >
              Detected Emotion
            </span>
            <AnimatePresence mode="wait">
              <motion.h2 
                key={emotion}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight transition-all duration-1000"
              >
                {emotion}
              </motion.h2>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p 
                key={emotion}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-lg text-gray-400/90 font-medium tracking-normal transition-all duration-1000"
              >
                {activeTheme.heading}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Premium Circular Scanner / Orb */}
          <div className="relative flex items-center justify-center py-6 w-full max-w-[240px] aspect-square">
            {/* Fuzzy Soft Glow Halo */}
            <div 
              className="absolute w-40 h-40 rounded-full opacity-35 blur-2xl transition-all duration-1000"
              style={{ 
                backgroundColor: activeTheme.accent, 
                boxShadow: `0 0 50px 15px ${activeTheme.accent}` 
              }} 
            />

            {/* Inner Dark Circular Border Container */}
            <div 
              className="relative w-44 h-44 rounded-full bg-black/45 border-2 flex items-center justify-center overflow-hidden transition-all duration-1000"
              style={{ borderColor: `${activeTheme.accent}30` }}
            >
              {isCameraActive ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {/* Circular scanning laser beam */}
                  {isDetecting && !isOverride && !isDetectionPaused && (
                    <motion.div 
                      className={`absolute left-0 w-full h-0.5 transition-all duration-1000 ${activeTheme.scanColor}`}
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </>
              ) : (
                <div className="text-7xl select-none transition-all duration-1000">
                  {EMOTION_EMOJIS[emotion] || "😐"}
                </div>
              )}
            </div>
            
            {/* Small floating lock badge */}
            {isDetectionPaused && isCameraActive && (
              <span className="absolute bottom-4 bg-amber-500 text-black px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg">
                Locked
              </span>
            )}
          </div>

          {/* Action Trigger Button */}
          {isCameraActive ? (
            <button 
              onClick={stopCamera}
              className="px-6 py-3 rounded-full border border-red-500/40 bg-red-950/20 text-red-400 text-sm font-semibold hover:bg-red-900/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <CameraOff size={16} />
              <span>Cancel Scan</span>
            </button>
          ) : (
            <button 
              onClick={isDetectionPaused ? handleScanAgain : () => { setIsOverride(false); startCamera(); }}
              className="px-6 py-3.5 rounded-full text-white text-sm font-semibold transition-all flex items-center gap-2 hover:scale-[1.02] shadow-md border"
              style={{ 
                backgroundColor: `${activeTheme.accent}20`, 
                borderColor: `${activeTheme.accent}40`,
                boxShadow: `0 4px 15px -3px ${activeTheme.accent}20` 
              }}
            >
              <Camera size={16} style={{ color: activeTheme.accent }} />
              <span style={{ color: activeTheme.accent }}>
                {isDetectionPaused ? "Scan Face Again" : "Detect My Mood"}
              </span>
              <ChevronRight size={14} className="text-white/60 ml-0.5" />
            </button>
          )}

          {error && <div className="text-red-400 text-xs mt-2 max-w-xs">{error}</div>}

        </div>

        {/* Right Column: Tab Switches & 4x2 Interactive Grid */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          
          {/* Top Custom Selector Tab Switches */}
          <div className="flex bg-black/45 border border-white/5 p-1 rounded-full w-fit">
            <button 
              onClick={() => setActiveTab("pick-mood")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${activeTab === "pick-mood" ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              <Mic size={13} />
              <span>Pick Mood</span>
            </button>
            <button 
              onClick={() => setActiveTab("playlist-url")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${activeTab === "playlist-url" ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              <Link size={13} />
              <span>Playlist URL</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "pick-mood" ? (
              <motion.div 
                key="pick-mood"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                <span className="text-sm font-semibold text-gray-400">
                  How are you feeling right now?
                </span>

                {/* 4x2 Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.keys(PLAYLIST_TRACKS).map((moodName) => {
                    const isActive = emotion === moodName;
                    const moodThemeObj = MOOD_THEMES[moodName] || MOOD_THEMES.Neutral;
                    
                    return (
                      <button
                        key={moodName}
                        onClick={() => handleManualMood(moodName)}
                        className={`flex flex-col items-center justify-center py-6 px-4 rounded-2xl bg-black/25 border transition-all duration-300 relative group overflow-hidden ${
                          isActive && isOverride
                            ? 'border-2 shadow-lg'
                            : 'border-white/5 hover:border-white/15 hover:bg-black/35'
                        }`}
                        style={
                          isActive && isOverride
                            ? { 
                                borderColor: moodThemeObj.accent,
                                boxShadow: `inset 0 0 15px -3px ${moodThemeObj.accent}25, 0 8px 20px -8px ${moodThemeObj.accent}20` 
                              }
                            : {}
                        }
                      >
                        {/* Glow Behind Active Emoji inside Card */}
                        {isActive && isOverride && (
                          <div 
                            className="absolute -top-6 w-16 h-16 rounded-full opacity-20 blur-md transition-all duration-300"
                            style={{ backgroundColor: moodThemeObj.accent }}
                          />
                        )}
                        
                        <span className="text-3xl mb-3 group-hover:scale-110 transition-transform select-none">
                          {EMOTION_EMOJIS[moodName]}
                        </span>
                        <span className="text-xs font-semibold text-gray-300">
                          {moodName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="playlist-url"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                <span className="text-sm font-semibold text-gray-400">
                  Override active recommended AI songs with your own playlist:
                </span>
                
                <form onSubmit={handleCustomLinkSubmit} className="relative w-full max-w-lg">
                  <input 
                    type="text" 
                    placeholder="Paste YouTube Link or Playlist URL..."
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-full py-3.5 pl-6 pr-14 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm text-white placeholder-gray-500 shadow-inner"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-cyan-500/20 text-cyan-400 rounded-full hover:bg-cyan-500/40 transition-colors"
                  >
                    <Search size={16} />
                  </button>
                </form>

                {isOverride && (
                  <button 
                    onClick={resetToAI}
                    className="text-xs text-cyan-400/80 hover:text-cyan-400 font-bold flex items-center gap-1 mt-1 transition-colors"
                  >
                    ← Resume AI Recommendation
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Bottom Panel: Spotify style tracklist */}
      <div className="w-full max-w-6xl flex flex-col gap-6 mt-6 pb-20 border-t border-white/5 pt-10">
        
        {/* Playlist Actions Header */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-3xl font-black text-white tracking-tight">
              Your Playlist
            </h3>
            <span className="text-sm text-gray-400/90 font-medium">
              Curated for your <span style={{ color: activeTheme.accent }} className="font-bold transition-all duration-1000">{emotion.toLowerCase()}</span> mood • 5 tracks
            </span>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => {
                if (currentTracks && currentTracks.length > 0) {
                  const randomIdx = Math.floor(Math.random() * currentTracks.length);
                  if (currentTracks[randomIdx].embedUrl) {
                    setCurrentPlaylist(currentTracks[randomIdx].embedUrl);
                  }
                }
                setIsPlayerOpen(true);
              }}
              className="flex items-center gap-2 border border-white/10 bg-black/25 hover:bg-black/45 rounded-full px-5 py-2 text-xs font-bold text-gray-300 transition-all hover:scale-[1.02]"
            >
              <Shuffle size={13} />
              <span>Shuffle</span>
            </button>
            <button 
              onClick={() => {
                if (currentTracks && currentTracks[0] && currentTracks[0].embedUrl) {
                  setCurrentPlaylist(currentTracks[0].embedUrl);
                }
                setIsPlayerOpen(true);
              }}
              className="flex items-center gap-2 rounded-full px-6 py-2 text-xs font-extrabold text-black transition-all hover:scale-[1.02] shadow-lg"
              style={{ backgroundColor: activeTheme.accent }}
            >
              <Play size={13} fill="black" />
              <span>Play All</span>
            </button>
          </div>
        </div>

        {/* Playlist Table */}
        <div className="w-full bg-black/20 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-gray-500">
                <th className="py-4 pl-6 w-12 text-center">#</th>
                <th className="py-4 px-4">Title</th>
                <th className="py-4 px-4 text-right sm:text-left">Plays</th>
                <th className="py-4 pr-6 text-right w-20">Time</th>
              </tr>
            </thead>
            <tbody>
              {currentTracks.map((track, idx) => (
                <tr 
                  key={idx}
                  onMouseEnter={() => setHoveredTrack(idx)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  onClick={() => {
                    if (track.embedUrl) {
                      setCurrentPlaylist(track.embedUrl);
                    }
                    setIsPlayerOpen(true);
                  }}
                  className="group hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-b-0 cursor-pointer"
                >
                  {/* Column # */}
                  <td className="py-3.5 pl-6 text-center text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                    {hoveredTrack === idx ? (
                      <Play size={10} fill="currentColor" className="mx-auto" />
                    ) : (
                      idx + 1
                    )}
                  </td>

                  {/* Column Title with art */}
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img 
                      src={track.cover} 
                      alt={track.title} 
                      className="w-10 h-10 rounded-lg object-cover shadow-md border border-white/5 transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {track.title}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {track.artist}
                      </span>
                    </div>
                  </td>

                  {/* Column Plays */}
                  <td className="py-3.5 px-4 text-xs font-semibold text-gray-400 text-right sm:text-left">
                    {track.plays}
                  </td>

                  {/* Column Time */}
                  <td className="py-3.5 pr-6 text-right text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                    {track.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Floating collapsible mini audio player in bottom right */}
      <AnimatePresence>
        {isPlayerOpen && (
          <motion.div 
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 h-[210px] bg-black/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 backdrop-blur-xl"
          >
            <div className="flex justify-between items-center bg-white/5 px-4 py-2 border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Music size={10} /> Active YouTube Feed
              </span>
              <button 
                onClick={() => setIsPlayerOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded hover:bg-white/5 transition-all"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="w-full flex-1 bg-black relative">
              <iframe
                key={playlistKey}
                className="w-full h-full absolute inset-0"
                src={currentPlaylist}
                title="YouTube music player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mini toggle to reopen player when closed */}
      {!isPlayerOpen && (
        <button 
          onClick={() => setIsPlayerOpen(true)}
          className="fixed bottom-6 right-6 bg-cyan-950/90 border border-cyan-500/40 text-cyan-400 p-3 rounded-full shadow-2xl z-50 hover:bg-cyan-900/90 transition-all hover:scale-105 hover:rotate-12 duration-300"
          title="Open Player"
        >
          <Music size={18} />
        </button>
      )}

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-6xl flex justify-between items-center text-xs text-gray-600 border-t border-white/5 py-6 mt-auto"
      >
        <span className="flex items-center gap-1"><Music size={11} /> Built for the Future • AI Emotion Music Recommender</span>
        <span>Powered by Emotion AI</span>
      </motion.footer>

    </div>
  );
}

export default App;
