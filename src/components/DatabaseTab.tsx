import React, { useState } from 'react';
import { 
  HackathonBlueprint, 
  DatabaseTable, 
  DatabaseRelationship 
} from '../types/blueprint';
import { 
  Database, 
  Key, 
  Link, 
  Copy, 
  Check, 
  Download, 
  Code, 
  Layers, 
  FileCode2, 
  Sparkles,
  Table
} from 'lucide-react';

interface DatabaseTabProps {
  blueprint: HackathonBlueprint;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ blueprint }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'sql' | 'prisma' | 'ts'>('sql');
  const [copied, setCopied] = useState<boolean>(false);

  const { database } = blueprint;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSql = () => {
    const blob = new Blob([database.sqlDDL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blueprint.profile.title.toLowerCase().replace(/\s+/g, '_')}_schema.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate TypeScript interfaces from database tables
  const generateTsInterfaces = () => {
    return database.tables.map(table => {
      const interfaceName = table.name.charAt(0).toUpperCase() + table.name.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      const fields = table.columns.map(col => {
        let tsType = 'string';
        const lowerType = col.type.toLowerCase();
        if (lowerType.includes('int') || lowerType.includes('numeric') || lowerType.includes('float') || lowerType.includes('double')) {
          tsType = 'number';
        } else if (lowerType.includes('bool')) {
          tsType = 'boolean';
        } else if (lowerType.includes('time') || lowerType.includes('date')) {
          tsType = 'Date | string';
        } else if (lowerType.includes('json')) {
          tsType = 'Record<string, any>';
        }
        const optional = col.nullable ? '?' : '';
        return `  ${col.name}${optional}: ${tsType};${col.description ? ` // ${col.description}` : ''}`;
      }).join('\n');

      return `export interface ${interfaceName} {\n${fields}\n}`;
    }).join('\n\n');
  };

  const getActiveCode = () => {
    if (activeCodeTab === 'sql') return database.sqlDDL;
    if (activeCodeTab === 'prisma') return database.prismaSchema;
    return generateTsInterfaces();
  };

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              Database Schema & Entity Relationship Diagram (ERD)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Optimized for {database.databaseType} with instant seed scripts for zero-friction hackathon demos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
              {database.tables.length} Tables • {database.relationships.length} Foreign Relationships
            </span>
          </div>
        </div>
      </div>

      {/* Visual ERD Table Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {database.tables.map((table) => (
          <div
            key={table.name}
            className="rounded-xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Table Header */}
              <div className="bg-slate-900/90 border-b border-slate-800 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs font-bold text-white">
                    {table.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {table.columns.length} columns
                </span>
              </div>

              {/* Table Columns List */}
              <div className="p-2 divide-y divide-slate-900">
                {table.columns.map((col) => (
                  <div
                    key={col.name}
                    className="p-2 flex items-center justify-between text-xs hover:bg-slate-900/40 rounded transition"
                  >
                    <div className="flex items-center gap-2">
                      {col.isPrimary && (
                        <span title="Primary Key">
                          <Key className="w-3 h-3 text-amber-400 shrink-0" />
                        </span>
                      )}
                      {col.isForeign && (
                        <span title={`Foreign Key: ${col.references}`}>
                          <Link className="w-3 h-3 text-cyan-400 shrink-0" />
                        </span>
                      )}
                      {!col.isPrimary && !col.isForeign && (
                        <span className="w-3 h-3 rounded-full bg-slate-800 shrink-0" />
                      )}
                      <span className={`font-mono ${col.isPrimary ? 'font-bold text-amber-300' : 'text-slate-200'}`}>
                        {col.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {col.type}
                      </span>
                      {col.nullable && (
                        <span className="text-[9px] text-slate-500 font-mono">null</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-900/40 border-t border-slate-900 text-[11px] text-slate-400 italic">
              {table.description}
            </div>
          </div>
        ))}
      </div>

      {/* Relationships Legend */}
      {database.relationships.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Link className="w-4 h-4 text-cyan-400" />
            Entity Relationships:
          </span>
          {database.relationships.map((rel, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 flex items-center gap-1.5"
            >
              <span className="text-amber-400">{rel.fromTable}</span>
              <span className="text-slate-500">[{rel.type}]</span>
              <span className="text-cyan-400">{rel.toTable}</span>
              <span className="text-slate-500 text-[10px]">({rel.foreignKey})</span>
            </span>
          ))}
        </div>
      )}

      {/* Multi-Format Schema Exporter */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 border-b border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('sql')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition flex items-center gap-1.5 ${
                activeCodeTab === 'sql'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              PostgreSQL DDL + Seed
            </button>
            <button
              onClick={() => setActiveCodeTab('prisma')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition flex items-center gap-1.5 ${
                activeCodeTab === 'prisma'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Prisma Schema
            </button>
            <button
              onClick={() => setActiveCodeTab('ts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition flex items-center gap-1.5 ${
                activeCodeTab === 'ts'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              TypeScript Types
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyCode(getActiveCode())}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            {activeCodeTab === 'sql' && (
              <button
                onClick={downloadSql}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .sql</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-4 overflow-x-auto max-h-[420px] bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
          <pre>{getActiveCode()}</pre>
        </div>
      </div>
    </div>
  );
};
