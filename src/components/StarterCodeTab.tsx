import React, { useState } from 'react';
import { 
  HackathonBlueprint, 
  StarterCodeItem 
} from '../types/blueprint';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Sparkles, 
  Terminal, 
  Bot,
  Layers
} from 'lucide-react';

interface StarterCodeTabProps {
  blueprint: HackathonBlueprint;
}

export const StarterCodeTab: React.FC<StarterCodeTabProps> = ({ blueprint }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { boilerplate } = blueprint;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedCode = boilerplate.starterCode[selectedFileIdx] || boilerplate.starterCode[0];

  // Generate complete Hackathon GitHub README.md
  const generateReadmeMarkdown = () => {
    const { profile, features, techStack, apis, timeline } = blueprint;
    return `# ${profile.title} 🚀
> ${profile.tagline}

[![Hackathon](https://img.shields.io/badge/Hackathon-Winner_Submission-emerald)](https://devpost.com)
[![Track](https://img.shields.io/badge/Track-${encodeURIComponent(profile.hackathonTrack)}-cyan)](https://devpost.com)
[![AI Engine](https://img.shields.io/badge/AI-Gemini_3.8_Flash-purple)](https://ai.google.dev)

## 💡 The Problem & The Solution
**The Problem:**
${profile.problemStatement}

**Our Solution:**
${profile.solutionOverview}

**The "Wow Factor":**
${profile.wowFactor}

---

## ⚡ Key Features (MoSCoW Prioritized)
${features.map(f => `- **${f.name}** [${f.tier.toUpperCase()}]: ${f.description} *(Est: ${f.estimatedHours}h, Role: ${f.assignedRole})*`).join('\n')}

---

## 🛠️ Tech Stack
${techStack.map(t => `- **${t.category}**: \`${t.tool}\` — ${t.justification}`).join('\n')}

---

## 🚀 Quickstart & Setup
\`\`\`bash
${blueprint.cliSetupCommands.join('\n')}
\`\`\`

### Environment Variables
\`\`\`env
${blueprint.envVarsRequired.map(v => `${v.key}="${v.placeholder}" # ${v.description}`).join('\n')}
\`\`\`

---

## 🔌 API Endpoints
${apis.map(a => `### \`${a.method} ${a.path}\`
${a.summary}
\`\`\`json
${a.responseSample}
\`\`\`
`).join('\n')}

---

## ⏱️ Hackathon ${timeline.hackathonDuration}-Hour Roadmap
${timeline.phases.map(p => `### ${p.phaseName}
**Goal:** ${p.objective}
${p.tasks.map(t => `- [x] **${t.title}** (${t.role}): ${t.deliverable}`).join('\n')}
`).join('\n')}

---

## 🏆 Pitch Day Arsenal
> "${blueprint.pitchKit.elevatorPitch}"

Built with ❤️ using **HackPilot AI Copilot**.
`;
  };

  const downloadReadme = () => {
    const blob = new Blob([generateReadmeMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              Starter Code, Gemini Prompts & GitHub README
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Plug-and-play boilerplate tailored specifically for this project's architecture and AI engine.
            </p>
          </div>

          <button
            onClick={downloadReadme}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download GitHub README.md</span>
          </button>
        </div>
      </div>

      {/* Gemini System Prompt Box */}
      <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-purple-500/20 text-purple-300">
              <Bot className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Gemini 3.8 Flash System Prompt (Pre-tuned for this domain)
            </span>
          </div>

          <button
            onClick={() => copyToClipboard(boilerplate.systemPromptForGemini, 'sys-prompt')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700/60 transition"
          >
            {copiedKey === 'sys-prompt' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-2">
          Pass this string into the <code className="text-purple-300 font-mono">systemInstruction</code> configuration parameter in <code className="text-purple-300 font-mono">@google/genai</code>:
        </p>

        <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-purple-200 leading-relaxed overflow-x-auto max-h-48 scrollbar-thin">
          {boilerplate.systemPromptForGemini}
        </pre>
      </div>

      {/* Starter Code Viewer */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 border-b border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* File Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {boilerplate.starterCode.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedFileIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  selectedFileIdx === i
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{item.filename}</span>
              </button>
            ))}
          </div>

          {selectedCode && (
            <button
              onClick={() => copyToClipboard(selectedCode.code, 'code')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition shrink-0"
            >
              {copiedKey === 'code' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          )}
        </div>

        {selectedCode && (
          <div>
            <div className="p-3 bg-slate-900/40 border-b border-slate-900 text-xs text-slate-400 flex items-center justify-between">
              <span>{selectedCode.description}</span>
              <span className="font-mono text-[10px] text-slate-500 uppercase">{selectedCode.language}</span>
            </div>

            <div className="p-4 overflow-x-auto max-h-[460px] bg-slate-950 font-mono text-xs text-emerald-300 leading-relaxed scrollbar-thin">
              <pre>{selectedCode.code}</pre>
            </div>
          </div>
        )}
      </div>

      {/* GitHub README Preview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Generated GitHub Submission README.md
          </h4>

          <button
            onClick={() => copyToClipboard(generateReadmeMarkdown(), 'readme')}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {copiedKey === 'readme' ? 'Copied Markdown' : 'Copy Markdown'}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-56 overflow-y-auto leading-relaxed scrollbar-thin">
          {generateReadmeMarkdown()}
        </pre>
      </div>
    </div>
  );
};
