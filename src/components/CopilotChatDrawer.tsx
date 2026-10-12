import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Terminal, 
  Bot, 
  User, 
  Flame, 
  ShieldAlert, 
  Copy, 
  Check, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { HackathonBlueprint } from '../types/blueprint';

interface CopilotChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: HackathonBlueprint | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
}

export const CopilotChatDrawer: React.FC<CopilotChatDrawerProps> = ({
  isOpen,
  onClose,
  blueprint
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'copilot',
      text: "⚡ **HackPilot Emergency Triage Online!**\n\nI'm your 24/7 veteran hackathon mentor. Stuck on a bug, running out of time, or need an answer to an aggressive judge question? Ask me anything!",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "Our auth broke 2 hours before deadline, how do we pivot?",
    "What will judges ask about our system scalability?",
    "How do we highlight our Gemini AI integration to win the AI track?",
    "Write an opening hook to wake up tired judges"
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          projectContext: blueprint ? {
            title: blueprint.profile.title,
            track: blueprint.profile.hackathonTrack,
            problem: blueprint.profile.problemStatement,
            solution: blueprint.profile.solutionOverview,
            features: blueprint.features.map(f => f.name)
          } : undefined
        })
      });

      const data = await res.json();
      const copilotMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: data.answer || "Focus on the core demo! Keep hacking.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, copilotMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: "⚠️ **Triage Rule**: If network APIs fail, drop in local mock JSON data immediately so your frontend demo never stutters!",
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              Emergency Copilot
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                LIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Veteran hackathon mentor & judge strategist
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
        {messages.map((m) => {
          const isCopilot = m.sender === 'copilot';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isCopilot ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isCopilot
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-600 text-slate-950'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                {isCopilot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed group relative ${
                  isCopilot
                    ? 'bg-slate-900 border border-slate-800 text-slate-200'
                    : 'bg-emerald-600 text-slate-950 font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {m.text}
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] opacity-60">
                  <span>{m.timestamp}</span>
                  {isCopilot && (
                    <button
                      onClick={() => copyText(m.text, m.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-white transition flex items-center gap-0.5 ml-2"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 w-fit">
            <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-mono">Copilot is formulating triage plan...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Pills */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-900">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          Quick Triage Prompts:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-[11px] text-left px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 transition truncate max-w-full"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Copilot (e.g. 'How to mock Stripe in 10 mins?')"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
