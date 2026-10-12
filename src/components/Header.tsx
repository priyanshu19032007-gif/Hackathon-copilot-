import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Sparkles, 
  MessageSquareCode, 
  Share2, 
  Layers,
  Award
} from 'lucide-react';
import { HackathonBlueprint } from '../types/blueprint';

interface HeaderProps {
  blueprint: HackathonBlueprint | null;
  onOpenCopilot: () => void;
  onOpenExport: () => void;
  hackathonDurationHours: number;
}

export const Header: React.FC<HeaderProps> = ({
  blueprint,
  onOpenCopilot,
  onOpenExport,
  hackathonDurationHours
}) => {
  // Hackathon countdown timer in seconds
  const initialSeconds = hackathonDurationHours * 3600;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showTimerEdit, setShowTimerEdit] = useState<boolean>(false);

  useEffect(() => {
    setSecondsRemaining(hackathonDurationHours * 3600);
  }, [hackathonDurationHours]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining]);

  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const elapsedPercent = Math.min(100, Math.max(0, ((initialSeconds - secondsRemaining) / initialSeconds) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg shadow-emerald-500/20 text-slate-950">
              <Terminal className="w-5 h-5 font-bold" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  HackPilot
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold tracking-wider">
                    v2.5
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI Architect & Hackathon Blueprint Engine
              </p>
            </div>
          </div>

          {blueprint && (
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800">
              <span className="text-xs font-medium text-slate-300 max-w-[200px] truncate" title={blueprint.profile.title}>
                {blueprint.profile.title}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800/90 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                <Award className="w-3 h-3" />
                {blueprint.profile.hackathonTrack}
              </span>
            </div>
          )}
        </div>

        {/* Center: Live Hackathon Clock */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
          <Clock className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-slate-100">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-[10px] text-slate-400 font-mono uppercase">
                {isRunning ? 'RUNNING' : 'PAUSED'}
              </span>
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-28 sm:w-36 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${elapsedPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 ml-1 pl-2 border-l border-slate-800">
            <button
              onClick={() => setIsRunning(!isRunning)}
              title={isRunning ? 'Pause Timer' : 'Start Timer'}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-emerald-400 transition"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsRemaining(initialSeconds);
              }}
              title="Reset Timer"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Emergency Copilot</span>
          </button>

          {blueprint && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Plan</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
