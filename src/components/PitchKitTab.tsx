import React, { useState } from 'react';
import { 
  HackathonBlueprint, 
  DemoScriptBeat, 
  PitchDeckSlide 
} from '../types/blueprint';
import { 
  Mic, 
  Video, 
  FileText, 
  Copy, 
  Check, 
  ShieldAlert, 
  Award, 
  Sparkles, 
  Eye, 
  Volume2, 
  ChevronRight,
  Presentation,
  CheckCircle2
} from 'lucide-react';

interface PitchKitTabProps {
  blueprint: HackathonBlueprint;
}

export const PitchKitTab: React.FC<PitchKitTabProps> = ({ blueprint }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const { pitchKit } = blueprint;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Presentation className="w-5 h-5 text-amber-400" />
              Demo Day Pitch Kit & Judging Defense
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              80% of hackathons are won or lost in the final 2-minute demo. Here is your battle-tested script, slide deck, and criteria alignment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
              120s Demo Script • 5 Pitch Slides
            </span>
          </div>
        </div>
      </div>

      {/* 30-Second Elevator Pitch */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Mic className="w-4 h-4" />
            30-Second Elevator Pitch (For roving judges & sponsor booths)
          </span>

          <button
            onClick={() => copyToClipboard(pitchKit.elevatorPitch, 'pitch-30')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {copiedKey === 'pitch-30' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Pitch</span>
              </>
            )}
          </button>
        </div>

        <blockquote className="text-base sm:text-lg text-slate-200 font-medium italic border-l-4 border-amber-400 pl-4 py-1 leading-relaxed bg-slate-900/40 rounded-r-xl">
          "{pitchKit.elevatorPitch}"
        </blockquote>
      </div>

      {/* Second-by-Second 2-Minute Demo Script */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              Second-by-Second 2-Minute Live Demo Flow
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict timing choreography to avoid getting cut off by the judge timer buzzer.
            </p>
          </div>

          <button
            onClick={() => {
              const fullScript = pitchKit.twoMinuteDemoScript
                .map(s => `[${s.timestamp}] ${s.segment}\nVisual: ${s.visualOnScreen}\nSpoken: "${s.speakerScript}"`)
                .join('\n\n');
              copyToClipboard(fullScript, 'full-script');
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            {copiedKey === 'full-script' ? 'Copied Full Script' : 'Copy All Script'}
          </button>
        </div>

        <div className="space-y-3">
          {pitchKit.twoMinuteDemoScript.map((beat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition flex flex-col md:flex-row gap-4"
            >
              {/* Timing Badge & Segment */}
              <div className="md:w-48 shrink-0 flex flex-col justify-start">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 inline-block w-fit">
                  {beat.timestamp}
                </span>
                <span className="text-xs font-bold text-white mt-1.5">
                  {beat.segment}
                </span>
              </div>

              {/* Action on screen vs Spoken Words */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start gap-2">
                  <Eye className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                      Visual On Screen
                    </span>
                    <p className="text-xs text-slate-300 leading-snug">
                      {beat.visualOnScreen}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                      Word-for-Word Speaker Script
                    </span>
                    <p className="text-xs text-slate-200 font-medium italic leading-snug">
                      "{beat.speakerScript}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Slide Pitch Deck Structure & Judging Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5-Slide Deck Blueprint */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Presentation className="w-4 h-4 text-purple-400" />
              5-Slide Pitch Deck Blueprint
            </h4>
            <span className="text-xs font-mono text-purple-300">
              Slide {activeSlideIndex + 1} of {pitchKit.pitchDeckSlides.length}
            </span>
          </div>

          {/* Slide Navigator Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-slate-800">
            {pitchKit.pitchDeckSlides.map((slide, i) => (
              <button
                key={i}
                onClick={() => setActiveSlideIndex(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeSlideIndex === i
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-900'
                }`}
              >
                Slide {slide.slideNumber}: {slide.title}
              </button>
            ))}
          </div>

          {/* Active Slide Preview */}
          {pitchKit.pitchDeckSlides[activeSlideIndex] && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Slide {pitchKit.pitchDeckSlides[activeSlideIndex].slideNumber}
                </span>
                <span className="text-xs font-bold text-white">
                  {pitchKit.pitchDeckSlides[activeSlideIndex].title}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Key Bullet Points:
                </span>
                <ul className="space-y-1.5">
                  {pitchKit.pitchDeckSlides[activeSlideIndex].keyPoints.map((point, k) => (
                    <li key={k} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-900 text-xs text-purple-300/90 font-medium">
                <strong>Visual Suggestion:</strong> {pitchKit.pitchDeckSlides[activeSlideIndex].visualSuggestion}
              </div>
            </div>
          )}
        </div>

        {/* Judging Criteria Tactics */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            Hackathon Judging Criteria Tactics
          </h4>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                1. Innovation & Novelty (25%)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pitchKit.judgingCriteriaTactics.innovation}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                2. Technical Execution & Depth (25%)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pitchKit.judgingCriteriaTactics.technicalExecution}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                3. User Experience & Design Polish (25%)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pitchKit.judgingCriteriaTactics.userExperience}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                4. Impact & Viability (25%)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pitchKit.judgingCriteriaTactics.businessViability}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Demo Checklist */}
      <div className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-red-500/30 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-red-300 uppercase tracking-wider flex items-center gap-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          Pre-Pitch Emergency Checklist (Do Not Take the Stage Without This)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {pitchKit.emergencyDemoChecklist.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
