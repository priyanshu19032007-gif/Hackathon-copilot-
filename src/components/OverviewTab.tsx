import React, { useState } from 'react';
import { 
  HackathonBlueprint, 
  Feature, 
  FeatureTier 
} from '../types/blueprint';
import { 
  Sparkles, 
  Target, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Flame, 
  Zap, 
  Clock, 
  Users, 
  Award, 
  Plus, 
  Trash2,
  HelpCircle,
  TrendingUp,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OverviewTabProps {
  blueprint: HackathonBlueprint;
  onUpdateBlueprint: (updated: HackathonBlueprint) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  blueprint,
  onUpdateBlueprint
}) => {
  const [activeTierFilter, setActiveTierFilter] = useState<'all' | FeatureTier>('all');
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureTier, setNewFeatureTier] = useState<FeatureTier>('p0_mvp');
  const [newFeatureRole, setNewFeatureRole] = useState<'frontend' | 'backend' | 'ai' | 'fullstack'>('frontend');
  const [isAdding, setIsAdding] = useState(false);

  const toggleFeatureCompleted = (id: string) => {
    const updatedFeatures = blueprint.features.map(f => {
      if (f.id === id) {
        const nextState = !f.completed;
        if (nextState) {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 }
          });
        }
        return { ...f, completed: nextState };
      }
      return f;
    });
    onUpdateBlueprint({ ...blueprint, features: updatedFeatures });
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;

    const newFeat: Feature = {
      id: `feat-${Date.now()}`,
      name: newFeatureName.trim(),
      description: 'Custom hackathon feature added by team.',
      tier: newFeatureTier,
      complexity: 'medium',
      estimatedHours: 3,
      assignedRole: newFeatureRole,
      demoImpactScore: 8,
      completed: false
    };

    onUpdateBlueprint({
      ...blueprint,
      features: [...blueprint.features, newFeat]
    });
    setNewFeatureName('');
    setIsAdding(false);
  };

  const deleteFeature = (id: string) => {
    onUpdateBlueprint({
      ...blueprint,
      features: blueprint.features.filter(f => f.id !== id)
    });
  };

  const p0Features = blueprint.features.filter(f => f.tier === 'p0_mvp');
  const p0Completed = p0Features.filter(f => f.completed).length;
  const p0Total = p0Features.length;
  const p0Percent = p0Total > 0 ? Math.round((p0Completed / p0Total) * 100) : 0;

  const totalEstHours = blueprint.features.reduce((acc, f) => acc + (f.estimatedHours || 0), 0);

  const filteredFeatures = blueprint.features.filter(f => {
    if (activeTierFilter === 'all') return true;
    return f.tier === activeTierFilter;
  });

  return (
    <div className="space-y-6">
      {/* Hero Overview Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Track: {blueprint.profile.hackathonTrack}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700">
                Audience: {blueprint.profile.targetAudience}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Est. Team Load: {totalEstHours} dev-hours</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {blueprint.profile.title}
            </h1>
            <p className="text-base sm:text-lg text-emerald-400 font-medium mt-1">
              "{blueprint.profile.tagline}"
            </p>
          </div>

          {/* Problem vs Solution Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                <AlertTriangle className="w-4 h-4" />
                The Friction Point / Problem
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {blueprint.profile.problemStatement}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
                The Hackathon Solution
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {blueprint.profile.solutionOverview}
              </p>
            </div>
          </div>

          {/* Demo Wow Factor */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-cyan-500/10 border border-amber-500/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                The Demo "Wow Factor" (Judges Aha! Moment)
              </span>
              <p className="text-sm text-slate-200 font-medium mt-0.5 leading-relaxed">
                {blueprint.profile.wowFactor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Scoping (MoSCoW Matrix) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              MoSCoW Feature Scoping Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ruthlessly prioritized feature set. P0 represents your non-negotiable live demo MVP.
            </p>
          </div>

          {/* P0 Completion Health Meter */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                P0 Demo Readiness
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {p0Completed} / {p0Total} MVP Features ({p0Percent}%)
              </span>
            </div>
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300" 
                style={{ width: `${p0Percent}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Filter Pills & Add Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTierFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTierFilter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              All ({blueprint.features.length})
            </button>
            <button
              onClick={() => setActiveTierFilter('p0_mvp')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTierFilter === 'p0_mvp'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              P0: Must Have (MVP)
            </button>
            <button
              onClick={() => setActiveTierFilter('p1_should')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTierFilter === 'p1_should'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              P1: Nice to Have
            </button>
            <button
              onClick={() => setActiveTierFilter('p2_cut')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTierFilter === 'p2_cut'
                  ? 'bg-slate-700 text-slate-300 border border-slate-600'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              P2: Cut First If Behind
            </button>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Feature</span>
          </button>
        </div>

        {/* Inline Add Feature Form */}
        {isAdding && (
          <form onSubmit={handleAddFeature} className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 mb-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              placeholder="e.g. Export results as JSON or PDF..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
            />
            <select
              value={newFeatureTier}
              onChange={(e) => setNewFeatureTier(e.target.value as FeatureTier)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300"
            >
              <option value="p0_mvp">P0: MVP Must-Have</option>
              <option value="p1_should">P1: Nice to Have</option>
              <option value="p2_cut">P2: Cut First</option>
            </select>
            <select
              value={newFeatureRole}
              onChange={(e) => setNewFeatureRole(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="ai">AI / ML</option>
              <option value="fullstack">Fullstack</option>
            </select>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold hover:bg-emerald-300 transition"
            >
              Add
            </button>
          </form>
        )}

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFeatures.map((feat) => {
            const isP0 = feat.tier === 'p0_mvp';
            const isP1 = feat.tier === 'p1_should';
            const isP2 = feat.tier === 'p2_cut';

            return (
              <div
                key={feat.id}
                className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                  feat.completed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                    : isP0
                    ? 'bg-slate-950/80 border-red-500/30 hover:border-red-500/50'
                    : isP1
                    ? 'bg-slate-950/80 border-amber-500/30 hover:border-amber-500/50'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <button
                      onClick={() => toggleFeatureCompleted(feat.id)}
                      className="flex items-start gap-2.5 text-left group"
                    >
                      <div className="mt-0.5 text-slate-500 group-hover:text-emerald-400 transition">
                        {feat.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <span className={`text-sm font-bold ${feat.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {feat.name}
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isP0
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isP1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {isP0 ? 'P0: MVP' : isP1 ? 'P1: Should' : 'P2: Cut'}
                      </span>

                      <button
                        onClick={() => deleteFeature(feat.id)}
                        className="p-1 text-slate-600 hover:text-red-400 transition"
                        title="Delete feature"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 ml-7 mb-3 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 ml-7 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="capitalize font-medium text-slate-400">
                      Role: <strong className="text-slate-300">{feat.assignedRole}</strong>
                    </span>
                    <span>Est: {feat.estimatedHours}h</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400/90 font-mono">
                    <Sparkles className="w-3 h-3" />
                    <span>Demo Impact: {feat.demoImpactScore}/10</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
