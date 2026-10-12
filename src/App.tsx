import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IdeaInputBar } from './components/IdeaInputBar';
import { OverviewTab } from './components/OverviewTab';
import { TechStackTab } from './components/TechStackTab';
import { ArchitectureTab } from './components/ArchitectureTab';
import { DatabaseTab } from './components/DatabaseTab';
import { ApiSpecsTab } from './components/ApiSpecsTab';
import { TimelineTab } from './components/TimelineTab';
import { PitchKitTab } from './components/PitchKitTab';
import { StarterCodeTab } from './components/StarterCodeTab';
import { CopilotChatDrawer } from './components/CopilotChatDrawer';
import { ExportModal } from './components/ExportModal';
import { HackathonBlueprint } from './types/blueprint';
import { 
  Layers, 
  Cpu, 
  Network, 
  Database, 
  Globe, 
  Clock, 
  Presentation, 
  Code2, 
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';

const STORAGE_KEY = 'hackpilot_active_blueprint';

export default function App() {
  const [blueprint, setBlueprint] = useState<HackathonBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tech_stack' | 'architecture' | 'database' | 'apis' | 'timeline' | 'pitch_kit' | 'starter_code'
  >('overview');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize from localStorage or generate initial blueprint
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBlueprint(JSON.parse(saved));
        return;
      } catch (e) {
        console.warn('Failed to parse saved blueprint from localStorage:', e);
      }
    }

    // Generate initial sample blueprint
    handleGenerate({
      idea: 'Autonomous continuous security triage & auto-healing code review bot powered by Gemini 3.8 Flash',
      duration: 24,
      teamSize: 3,
      track: 'AI & LLM',
      scopeBias: 'Lean MVP (Finish & Win)'
    });
  }, []);

  // Save changes to localStorage
  const handleUpdateBlueprint = (updated: HackathonBlueprint) => {
    setBlueprint(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save blueprint to localStorage:', e);
    }
  };

  const handleGenerate = async ({
    idea,
    duration,
    teamSize,
    track,
    scopeBias
  }: {
    idea: string;
    duration: number;
    teamSize: number;
    track: string;
    scopeBias: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          duration,
          teamSize,
          track,
          scopeBias
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.blueprint) {
        handleUpdateBlueprint(data.blueprint);
        setActiveTab('overview');
      } else {
        throw new Error('Invalid blueprint payload received.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Failed to synthesize blueprint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Scope & MoSCoW',
      icon: <Layers className="w-4 h-4" />,
      badge: blueprint ? `${blueprint.features.filter(f => f.tier === 'p0_mvp').length} P0` : undefined
    },
    {
      id: 'tech_stack',
      label: 'Tech Stack',
      icon: <Cpu className="w-4 h-4" />,
      badge: blueprint ? `${blueprint.techStack.length}` : undefined
    },
    {
      id: 'architecture',
      label: 'Architecture',
      icon: <Network className="w-4 h-4" />,
      badge: blueprint ? `${blueprint.architecture.nodes.length} Nodes` : undefined
    },
    {
      id: 'database',
      label: 'Database & ERD',
      icon: <Database className="w-4 h-4" />,
      badge: blueprint ? `${blueprint.database.tables.length} Tables` : undefined
    },
    {
      id: 'apis',
      label: 'APIs & Runner',
      icon: <Globe className="w-4 h-4" />,
      badge: blueprint ? `${blueprint.apis.length} Endpoints` : undefined
    },
    {
      id: 'timeline',
      label: 'Execution Sprint',
      icon: <Clock className="w-4 h-4" />,
      badge: blueprint ? `${blueprint.timeline.hackathonDuration}h` : undefined
    },
    {
      id: 'pitch_kit',
      label: 'Pitch Day Kit',
      icon: <Presentation className="w-4 h-4" />,
      badge: '120s Demo'
    },
    {
      id: 'starter_code',
      label: 'Code & Prompts',
      icon: <Code2 className="w-4 h-4" />,
      badge: 'Ready'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* App Header with Live Hackathon Countdown Clock */}
      <Header
        blueprint={blueprint}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        hackathonDurationHours={blueprint?.timeline?.hackathonDuration || 24}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Error Notification Banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Bar & Constraints Configurator */}
        <IdeaInputBar
          onGenerate={handleGenerate}
          isLoading={isLoading}
          activeTrack={blueprint?.profile?.hackathonTrack || 'AI & LLM'}
        />

        {/* Navigation Tabs */}
        {blueprint && (
          <div className="border-b border-slate-800/80 -mx-4 sm:-mx-6 px-4 sm:px-6 sticky top-[61px] z-30 bg-slate-950/90 backdrop-blur-md pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Tab View */}
        {blueprint && (
          <div className="pt-2 animate-in fade-in duration-200">
            {activeTab === 'overview' && (
              <OverviewTab
                blueprint={blueprint}
                onUpdateBlueprint={handleUpdateBlueprint}
              />
            )}
            {activeTab === 'tech_stack' && (
              <TechStackTab blueprint={blueprint} />
            )}
            {activeTab === 'architecture' && (
              <ArchitectureTab blueprint={blueprint} />
            )}
            {activeTab === 'database' && (
              <DatabaseTab blueprint={blueprint} />
            )}
            {activeTab === 'apis' && (
              <ApiSpecsTab blueprint={blueprint} />
            )}
            {activeTab === 'timeline' && (
              <TimelineTab
                blueprint={blueprint}
                onUpdateBlueprint={handleUpdateBlueprint}
              />
            )}
            {activeTab === 'pitch_kit' && (
              <PitchKitTab blueprint={blueprint} />
            )}
            {activeTab === 'starter_code' && (
              <StarterCodeTab blueprint={blueprint} />
            )}
          </div>
        )}
      </main>

      {/* Floating Emergency Copilot Chat Drawer */}
      <CopilotChatDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        blueprint={blueprint}
      />

      {/* Export Plan Modal */}
      {blueprint && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          blueprint={blueprint}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HackPilot • Turn raw project ideas into hackathon champions</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Built for 24h/36h/48h Hackathons
          </span>
        </div>
      </footer>
    </div>
  );
}
