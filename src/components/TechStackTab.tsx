import React, { useState } from 'react';
import { 
  HackathonBlueprint, 
  TechStackItem, 
  EnvVarSpec 
} from '../types/blueprint';
import { 
  Cpu, 
  Layers, 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  Lightbulb, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  Code2
} from 'lucide-react';

interface TechStackTabProps {
  blueprint: HackathonBlueprint;
}

export const TechStackTab: React.FC<TechStackTabProps> = ({ blueprint }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(identifier);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const allCliText = blueprint.cliSetupCommands.join(' && \\\n');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Battle-Tested Hackathon Tech Stack
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Curated specifically for minimum setup friction, zero cold starts, and maximum judging presentation impact.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              Stack Optimization: 100% Zero-Trap
            </span>
          </div>
        </div>
      </div>

      {/* Tech Stack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blueprint.techStack.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400/90 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {item.category}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                {item.tool}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {item.justification}
              </p>
            </div>

            {/* Hackathon Insider Tip */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold block text-[11px] uppercase tracking-wider mb-0.5">
                  Hackathon Insider Tip:
                </strong>
                <span className="text-[11px] leading-tight text-amber-200/80">
                  {item.hackathonTip}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CLI Setup Commands & Env Variables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CLI Setup */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Quickstart CLI Scaffolding
              </h4>
              <button
                onClick={() => copyToClipboard(allCliText, 'cli-all')}
                className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copiedKey === 'cli-all' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Run these commands in your terminal to bootstrap the project repository in under 60 seconds:
            </p>

            <div className="space-y-2">
              {blueprint.cliSetupCommands.map((cmd, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800/80"
                >
                  <span className="truncate mr-2">$ {cmd}</span>
                  <button
                    onClick={() => copyToClipboard(cmd, `cmd-${i}`)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition"
                    title="Copy command"
                  >
                    {copiedKey === `cmd-${i}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Golden Rule: Keep dependencies minimal. Less debugging, more shipping.</span>
          </div>
        </div>

        {/* Required Environment Variables */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                Required Environment Variables (.env)
              </h4>
              <button
                onClick={() => {
                  const envContent = blueprint.envVarsRequired
                    .map(v => `${v.key}="${v.placeholder}" # ${v.description}`)
                    .join('\n');
                  copyToClipboard(envContent, 'env-all');
                }}
                className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copiedKey === 'env-all' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy .env</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Add these keys to your <code className="text-emerald-400">.env</code> file. AI Studio injects Gemini API keys automatically via runtime secrets.
            </p>

            <div className="space-y-2.5">
              {blueprint.envVarsRequired.map((env, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {env.key}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${env.key}="${env.placeholder}"`, `env-${i}`)}
                      className="text-slate-400 hover:text-white transition"
                    >
                      {copiedKey === `env-${i}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {env.description}
                  </span>
                  <div className="font-mono text-[10px] text-slate-500 truncate bg-slate-900/60 p-1 rounded">
                    Example: {env.placeholder}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Never commit production API keys to public GitHub repositories!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
