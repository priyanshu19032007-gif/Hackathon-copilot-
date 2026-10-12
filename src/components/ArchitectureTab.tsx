import React, { useState } from 'react';
import { 
  HackathonBlueprint, 
  ArchitectureNode, 
  DataFlowStep 
} from '../types/blueprint';
import { 
  Network, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  Database, 
  Cpu, 
  Globe, 
  Server, 
  Monitor, 
  Play, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface ArchitectureTabProps {
  blueprint: HackathonBlueprint;
}

export const ArchitectureTab: React.FC<ArchitectureTabProps> = ({ blueprint }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const { architecture } = blueprint;

  const getNodeIcon = (category: string) => {
    switch (category) {
      case 'client':
        return <Monitor className="w-5 h-5 text-cyan-400" />;
      case 'gateway':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'ai_service':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-amber-400" />;
      case 'external_api':
        return <Globe className="w-5 h-5 text-blue-400" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'client':
        return 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300';
      case 'gateway':
        return 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300';
      case 'ai_service':
        return 'border-purple-500/40 bg-purple-950/30 text-purple-300';
      case 'database':
        return 'border-amber-500/40 bg-amber-950/30 text-amber-300';
      case 'external_api':
        return 'border-blue-500/40 bg-blue-950/30 text-blue-300';
      default:
        return 'border-slate-700 bg-slate-900 text-slate-300';
    }
  };

  const currentStep = architecture.dataFlowSteps[activeStepIndex] || architecture.dataFlowSteps[0];
  const selectedNode = architecture.nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="space-y-6">
      {/* Overview & High-level Summary */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              System Architecture & Data Pipeline
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {architecture.summary}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {architecture.nodes.length} System Nodes • {architecture.connections.length} Protocol Links
            </span>
          </div>
        </div>
      </div>

      {/* Visual System Diagram Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Interactive Topology (Click any node to inspect details)
            </span>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Step {activeStepIndex + 1} of {architecture.dataFlowSteps.length} highlighted
            </span>
          </div>

          {/* Interactive Topology Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 my-4">
            {architecture.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isActiveInStep = currentStep?.fromNode === node.id || currentStep?.toNode === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
                    isSelected
                      ? 'ring-2 ring-emerald-400 scale-[1.02] shadow-lg shadow-emerald-500/10'
                      : isActiveInStep
                      ? 'border-emerald-400/80 bg-slate-900 shadow-lg shadow-emerald-500/20'
                      : getCategoryColor(node.category)
                  }`}
                >
                  {isActiveInStep && (
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-500 text-slate-950 uppercase tracking-wider animate-pulse">
                      Active
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        {getNodeIcon(node.category)}
                      </div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-800">
                        {node.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">
                      {node.label}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {node.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="truncate">{node.tech}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connection Protocol Legend */}
          <div className="mt-4 pt-4 border-t border-slate-900 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Protocols:</span>
            {architecture.connections.map((conn, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {conn.from} ➔ {conn.to} ({conn.protocol})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex flex-col sm:flex-row items-start justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 mt-1">
              {getNodeIcon(selectedNode.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">{selectedNode.label}</h4>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {selectedNode.tech}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{selectedNode.description}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedNodeId(null)}
            className="text-xs font-semibold px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Close Inspector
          </button>
        </div>
      )}

      {/* Step-by-Step Data Flow Sequence */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Data Flow Sequence (Interactive Pipeline Walkthrough)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Follow the journey of a user action through the system from client input to Gemini AI synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : architecture.dataFlowSteps.length - 1))}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStepIndex((prev) => (prev + 1) % architecture.dataFlowSteps.length)}
              className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition flex items-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
          {architecture.dataFlowSteps.map((step, idx) => {
            const isCurrent = activeStepIndex === idx;
            return (
              <div
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-950 border-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    Step {step.step}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 truncate">
                    {step.fromNode} ➔ {step.toNode}
                  </span>
                </div>

                <h5 className={`text-xs font-bold mb-1 ${isCurrent ? 'text-emerald-300' : 'text-slate-200'}`}>
                  {step.title}
                </h5>

                <p className="text-[11px] text-slate-400 leading-snug line-clamp-3">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Murphy's Law & Offline Demo Fallback Strategy */}
      <div className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border border-red-500/30 rounded-2xl p-5 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-red-300 uppercase tracking-wider">
            Murphy's Law Fallback Strategy (Judge Demo Insurance)
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed mt-1">
            {architecture.offlineFallbackStrategy}
          </p>
          <div className="mt-2 text-[11px] font-mono text-amber-300/90 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tactic: Include a secret toggle button (<code className="px-1 py-0.5 bg-slate-900 rounded border border-slate-700">Ctrl+Shift+D</code>) that loads pre-warmed offline demo responses.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
