
import React, { useState, useEffect, useRef } from 'react';
import { TimeLeft } from './types';
import Snowfall from './components/Snowfall';
import CountdownTimer from './components/CountdownTimer';
import SurpriseSection from './components/SurpriseSection';
import DebugControls from './components/DebugControls';
import { Sparkles, Volume2, VolumeX, Share2 } from 'lucide-react';

interface SimulatedDate {
  month: number;
  day: number;
}

const App: React.FC = () => {
  const [simulatedDate, setSimulatedDate] = useState<SimulatedDate | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isChristmas, setIsChristmas] = useState(false);
  const [isNewYearDay, setIsNewYearDay] = useState(false);
  const [isNewYearPending, setIsNewYearPending] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Navidad Mágica',
          text: '¡Mira esta cuenta regresiva para Navidad! 🎄✨',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error compartiendo:', err);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const isCelebration = isChristmas || isNewYearDay;
    if (isCelebration && isPlaying) {
      audio.volume = 0.4;
      audio.play().catch(() => setIsPlaying(false));
    } else if (!isCelebration) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isChristmas, isNewYearDay, isPlaying]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  useEffect(() => {
    const calculateTime = () => {
        let now = new Date();
        if (simulatedDate !== null) {
            now = new Date(now.getFullYear(), simulatedDate.month, simulatedDate.day, 10, 0, 0);
        }
        setCurrentDate(now);
        const month = now.getMonth();
        const day = now.getDate();
        const year = now.getFullYear();

        const checkIsChristmas = month === 11 && day === 25;
        const checkIsNewYearDay = month === 0 && day === 1;
        const checkIsNewYearPending = month === 11 && (day > 25 || (month === 11 && day === 31));

        setIsChristmas(checkIsChristmas);
        setIsNewYearDay(checkIsNewYearDay);
        setIsNewYearPending(checkIsNewYearPending);

        let target: Date;
        if (checkIsNewYearPending) {
            target = new Date(year + 1, 0, 1, 0, 0, 0);
        } else {
             target = new Date(year, 11, 25, 0, 0, 0);
        }

        const diff = target.getTime() - now.getTime();
        if (checkIsChristmas || checkIsNewYearDay) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else if (diff > 0) {
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        }
    };
    
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [simulatedDate]);

  const getStatusMessage = () => {
    if (isChristmas) return "¡Que tengas unas fiestas mágicas!";
    if (isNewYearDay) return "¡Salud, dinero y amor para este nuevo año!";
    if (isNewYearPending) return "¡Despidiendo el año viejo!";
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    if (month === 11) {
        if (day === 24) return "¡Ya casi es hora! Santa se acerca.";
        if (day >= 22) return "¡Haz una postal navideña!";
    }
    return "Faltan pocos días...";
  };

  const getMainTitle = () => {
    if (isChristmas) return "¡Feliz Navidad!";
    if (isNewYearDay) return "¡Feliz Año Nuevo!";
    if (isNewYearPending) return "Año Nuevo";
    return "Navidad";
  };

  return (
    <div className="min-h-screen bg-xmas-dark bg-gradient-to-b from-xmas-dark via-xmas-blue to-xmas-light flex flex-col items-center justify-center text-white overflow-hidden relative">
      <Snowfall />
      <audio ref={audioRef} loop crossOrigin="anonymous">
          <source src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Jazz_Sampler/Kevin_MacLeod_-_Jingle_Bells.mp3" type="audio/mpeg" />
      </audio>

      <div className="fixed top-6 right-6 z-[60] flex flex-col gap-3 items-end">
        <button onClick={handleShareApp} className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur border border-white/20 shadow-lg">
          <Share2 size={20} />
        </button>
      </div>

      <main className={`z-10 bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl max-w-[90%] w-[500px] flex flex-col items-center text-center transform transition-all duration-500 my-10 ${isChristmas || isNewYearDay ? "border-4 border-xmas-gold shadow-[0_0_60px_rgba(255,215,0,0.4)] scale-105" : "border border-white/20"}`}>
        <header className="mb-4 w-full flex flex-col items-center">
          <h1 className="font-christmas text-6xl md:text-7xl text-xmas-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] animate-pulse-slow">
            {getMainTitle()}
          </h1>
          {(isChristmas || isNewYearDay) && (
            <div className="flex flex-col items-center gap-4 mt-2">
              <Sparkles className="text-xmas-gold animate-spin-slow" size={40} />
              <button onClick={toggleMusic} className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-sm font-bold border border-white/20 shadow-lg">
                {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                {isPlaying ? "Pausar Melodía" : "Reproducir Melodía"}
              </button>
            </div>
          )}
        </header>

        <CountdownTimer timeLeft={timeLeft} />
        <h2 className="text-xl md:text-2xl font-light text-gray-200 mt-4 tracking-wide">{getStatusMessage()}</h2>
        {!isNewYearPending && !isNewYearDay && <SurpriseSection currentDate={currentDate} />}
      </main>

      <footer className="z-10 py-6 flex flex-col items-center gap-2">
        <a href="privacy.html" className="text-white/60 hover:text-xmas-gold text-xs underline decoration-white/20">Política de Privacidad</a>
      </footer>

      <DebugControls onSimulate={setSimulatedDate} currentSimulatedDate={simulatedDate} />
    </div>
  );
};

export default App;
