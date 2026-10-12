import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Users, 
  Clock, 
  Target, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  ChevronDown, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { PRESET_IDEAS, PresetIdea } from '../data/presetIdeas';

interface IdeaInputBarProps {
  onGenerate: (params: {
    idea: string;
    duration: number;
    teamSize: number;
    track: string;
    scopeBias: string;
  }) => Promise<void>;
  isLoading: boolean;
  activeTrack: string;
}

export const IdeaInputBar: React.FC<IdeaInputBarProps> = ({
  onGenerate,
  isLoading,
  activeTrack
}) => {
  const [ideaText, setIdeaText] = useState('');
  const [duration, setDuration] = useState<number>(24);
  const [teamSize, setTeamSize] = useState<number>(3);
  const [track, setTrack] = useState<string>('AI & LLM');
  const [scopeBias, setScopeBias] = useState<string>('Lean MVP (Finish & Win)');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Loading animation step messages
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleApplyPreset = (preset: PresetIdea) => {
    setIdeaText(preset.prompt);
    setDuration(preset.duration);
    setTeamSize(preset.teamSize);
    setTrack(preset.track);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ideaText.trim() || isLoading) return;

    onGenerate({
      idea: ideaText.trim(),
      duration,
      teamSize,
      track,
      scopeBias
    });
  };

  const tracks = [
    'AI & LLM',
    'DevTools & Infra',
    'FinTech & Commerce',
    'HealthTech & Bio',
    'Social Good & Climate',
    'CyberSecurity',
    'Web3 & Decentralized'
  ];

  const scopeOptions = [
    { label: 'Lean MVP (Finish & Win)', desc: 'Ruthless 3-feature cut. Guarantees a polished submission.' },
    { label: 'Crowd-Pleasing Visual Demo', desc: 'Focus on interactive wow-factor and audio/visual delight.' },
    { label: 'High-Tech Deep Dive', desc: 'Showcases advanced architecture, algorithms, and models.' }
  ];

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 backdrop-blur-sm transition">
      <div className="flex flex-col gap-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </span>
              Hackathon Project Blueprint Generator
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Turn any raw concept into an MVP feature scope, system architecture, database ERD, API specs, and hour-by-hour execution sprint.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="self-start sm:self-center flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Constraints & Strategy</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="Describe your hackathon idea, target problem, or sponsor prize target (e.g. 'An AI voice agent for 911 dispatchers that triages medical emergencies and maps live ambulances...')"
              rows={3}
              className="w-full bg-slate-950/90 border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 resize-none outline-none font-sans transition"
            />

            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={isLoading || !ideaText.trim()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm text-slate-950 transition shadow-lg ${
                  isLoading || !ideaText.trim()
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20 hover:shadow-emerald-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Blueprint...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Generate Blueprint</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Preset Ideas Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Winning Hackathon Templates:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_IDEAS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-emerald-300 border border-slate-700/60 transition flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Constraints Panel (Toggled or Always visible) */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Duration */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Hackathon Duration
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[24, 36, 48].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setDuration(hours)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        duration === hours
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {hours} Hours
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  Team Size
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setTeamSize(size)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        teamSize === size
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {size === 1 ? 'Solo' : `${size} Devs`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Track Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Target className="w-3.5 h-3.5 text-purple-400" />
                  Category / Track
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-purple-500"
                >
                  {tracks.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scope Bias */}
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Winning Strategy
                </label>
                <select
                  value={scopeBias}
                  onChange={(e) => setScopeBias(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                >
                  {scopeOptions.map((opt) => (
                    <option key={opt.label} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
