import React, { useState } from 'react';
import { 
  HackathonBlueprint, 
  EndpointSpec 
} from '../types/blueprint';
import { 
  Globe, 
  Play, 
  Copy, 
  Check, 
  Send, 
  Clock, 
  Code2, 
  Terminal, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ApiSpecsTabProps {
  blueprint: HackathonBlueprint;
}

export const ApiSpecsTab: React.FC<ApiSpecsTabProps> = ({ blueprint }) => {
  const [selectedApiId, setSelectedApiId] = useState<string>(blueprint.apis[0]?.id || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    status: number;
    latency: number;
    data: any;
  } | null>(null);

  const selectedApi = blueprint.apis.find(a => a.id === selectedApiId) || blueprint.apis[0];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runMockTest = async () => {
    if (!selectedApi) return;
    setIsRunningTest(true);
    setTestResult(null);

    const startTime = performance.now();
    try {
      const res = await fetch('/api/mock-runner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleResponse: selectedApi.responseSample,
          status: selectedApi.status || 200
        })
      });

      const data = await res.json();
      const endTime = performance.now();
      setTestResult({
        status: res.status,
        latency: Math.round(endTime - startTime),
        data
      });
    } catch (err: any) {
      setTestResult({
        status: 500,
        latency: 12,
        data: { error: err.message || 'Execution error' }
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'POST':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'DELETE':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getTsFetchSnippet = (api: EndpointSpec) => {
    return `// TypeScript Client Call for ${api.path}
export async function ${api.path.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+/, '')}() {
  const response = await fetch('${api.path}', {
    method: '${api.method}',
    headers: {
      'Content-Type': 'application/json',
    },
    ${api.method !== 'GET' ? `body: JSON.stringify(${api.requestBodySample.replace(/\n/g, '\n    ')}),` : ''}
  });

  if (!response.ok) {
    throw new Error(\`Request failed with status \${response.status}\`);
  }

  return response.json();
}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              REST API Contract & Interactive Test Runner
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Zero-guesswork backend endpoints with live mock execution and ready-to-paste cURL and fetch calls.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              {blueprint.apis.length} Documented Endpoints
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint Navigation List */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Endpoints
          </span>
          {blueprint.apis.map((api) => {
            const isSelected = selectedApi?.id === api.id;
            return (
              <button
                key={api.id}
                onClick={() => {
                  setSelectedApiId(api.id);
                  setTestResult(null);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getMethodBadge(api.method)}`}>
                    {api.method}
                  </span>
                  <div className="truncate">
                    <span className="font-mono text-xs text-slate-200 block truncate font-semibold">
                      {api.path}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {api.summary}
                    </span>
                  </div>
                </div>

                <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right: Selected Endpoint Details & Live Mock Runner */}
        {selectedApi && (
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border uppercase ${getMethodBadge(selectedApi.method)}`}>
                    {selectedApi.method}
                  </span>
                  <h4 className="font-mono text-base font-bold text-white">
                    {selectedApi.path}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={runMockTest}
                    disabled={isRunningTest}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
                  >
                    {isRunningTest ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Test Endpoint</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 py-3">
                {selectedApi.description}
              </p>

              {/* Request & Response Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* Request Payload */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                      Request Body (JSON)
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedApi.requestBodySample, 'req')}
                      className="text-[10px] text-slate-400 hover:text-slate-200 transition"
                    >
                      {copiedKey === 'req' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-48 scrollbar-thin">
                    {selectedApi.requestBodySample || '{}'}
                  </pre>
                </div>

                {/* Expected Response Payload */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                      Expected Response ({selectedApi.status})
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedApi.responseSample, 'res')}
                      className="text-[10px] text-slate-400 hover:text-slate-200 transition"
                    >
                      {copiedKey === 'res' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-48 scrollbar-thin">
                    {selectedApi.responseSample || '{}'}
                  </pre>
                </div>
              </div>

              {/* Live Test Execution Result */}
              {testResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300">Live Test Result:</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        HTTP {testResult.status}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {testResult.latency}ms
                    </span>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto max-h-48 scrollbar-thin">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}

              {/* cURL & Fetch Snippets */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    cURL Command
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedApi.curlExample, 'curl')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition"
                  >
                    {copiedKey === 'curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'curl' ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  {selectedApi.curlExample}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
