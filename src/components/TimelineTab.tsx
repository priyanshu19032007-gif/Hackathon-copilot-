import React, { useState } from 'react';
import { 
  HackathonBlueprint, 
  TimelinePhase, 
  TimelineTask 
} from '../types/blueprint';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Flame, 
  Award, 
  Users, 
  Zap, 
  ShieldCheck, 
  Calendar,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimelineTabProps {
  blueprint: HackathonBlueprint;
  onUpdateBlueprint: (updated: HackathonBlueprint) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  blueprint,
  onUpdateBlueprint
}) => {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(0);
  const [roleFilter, setRoleFilter] = useState<string>('All');

  const { timeline } = blueprint;

  const toggleTask = (phaseIdx: number, taskId: string) => {
    const updatedPhases = timeline.phases.map((phase, pIdx) => {
      if (pIdx !== phaseIdx) return phase;

      const updatedTasks = phase.tasks.map(t => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.7 }
            });
          }
          return { ...t, completed: nextState };
        }
        return t;
      });

      return { ...phase, tasks: updatedTasks };
    });

    onUpdateBlueprint({
      ...blueprint,
      timeline: {
        ...timeline,
        phases: updatedPhases
      }
    });
  };

  // Overall statistics
  const allTasks = timeline.phases.flatMap(p => p.tasks);
  const completedTasks = allTasks.filter(t => t.completed).length;
  const totalTasks = allTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const currentPhase = timeline.phases[selectedPhaseIndex] || timeline.phases[0];

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'frontend':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'backend':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'ai':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              {timeline.hackathonDuration}-Hour Execution Sprint Roadmap
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Phased milestone breakdown structured around the universal rhythm of winning hackathons.
            </p>
          </div>

          {/* Progress Gauge */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Sprint Completion
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {completedTasks} / {totalTasks} Tasks ({progressPercent}%)
              </span>
            </div>
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phase Navigator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {timeline.phases.map((phase, idx) => {
          const isSelected = selectedPhaseIndex === idx;
          const pCompleted = phase.tasks.filter(t => t.completed).length;
          const pTotal = phase.tasks.length;
          const isAllDone = pTotal > 0 && pCompleted === pTotal;

          return (
            <button
              key={idx}
              onClick={() => setSelectedPhaseIndex(idx)}
              className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Hours {phase.startHour} - {phase.endHour}
                  </span>
                  {isAllDone && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Phase complete!" />
                  )}
                </div>

                <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                  {phase.phaseName}
                </h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>{pCompleted}/{pTotal} done</span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  {pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Phase Detail & Task Checklist */}
      {currentPhase && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                Hours {currentPhase.startHour} – {currentPhase.endHour} Milestone
              </span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {currentPhase.phaseName}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                <strong>Objective:</strong> {currentPhase.objective}
              </p>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {['All', 'Frontend', 'Backend', 'AI'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    roleFilter === r
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Task Items */}
          <div className="space-y-3">
            {currentPhase.tasks
              .filter(t => roleFilter === 'All' || t.role.toLowerCase() === roleFilter.toLowerCase())
              .map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-slate-900/30 border-slate-800/50 opacity-70'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(selectedPhaseIndex, task.id)}
                      className="mt-0.5 text-slate-500 hover:text-emerald-400 transition"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                          {task.title}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getRoleBadge(task.role)}`}>
                          {task.role}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span className="text-slate-300">Deliverable:</span>
                        <span className="font-mono text-emerald-300/90">{task.deliverable}</span>
                      </div>

                      {task.riskAlert && (
                        <div className="mt-2 text-[11px] text-amber-300/90 flex items-center gap-1.5 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{task.riskAlert}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleTask(selectedPhaseIndex, task.id)}
                    className={`self-end sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      task.completed
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                    }`}
                  >
                    {task.completed ? 'Completed' : 'Mark Done'}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Hackathon Golden Rule Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border border-emerald-500/30 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
            Hackathon Golden Rule of Survival
          </span>
          <p className="text-sm text-slate-200 font-medium mt-0.5 leading-relaxed">
            {timeline.goldenRule}
          </p>
        </div>
      </div>
    </div>
  );
};
