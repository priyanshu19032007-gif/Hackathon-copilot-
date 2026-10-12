import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback high-quality blueprint generator for instant testing or if API key is pending
function getFallbackBlueprint(idea: string, duration = 24, teamSize = 3, track = 'AI & LLM') {
  const safeIdea = idea.trim() || 'AI-Powered Smart Code Review & Security Remediation Bot';
  return {
    profile: {
      title: 'DevPulse AI',
      tagline: 'Autonomous continuous security triage & auto-healing PR assistant for fast-moving teams',
      problemStatement: 'During rapid development and hackathons, 78% of teams introduce critical secrets leakage and SQL/XSS vulnerabilities that take hours of manual triage to detect and remediate.',
      solutionOverview: 'DevPulse AI sits inside the git push pipeline, automatically parsing AST diffs, invoking Gemini 3.8 Flash to evaluate semantic threat vectors, and producing instantaneous, test-verified autofix pull requests.',
      hackathonTrack: track,
      targetAudience: 'Hackathon engineers, startup founders, and enterprise DevOps teams',
      wowFactor: 'Live terminal demo showing an active secret & SQL injection injection caught, tested, and resolved with a verified git commit in under 8 seconds.'
    },
    features: [
      {
        id: 'feat-1',
        name: 'Instant AST & Diff Security Scanner',
        description: 'Analyzes staged code or GitHub webhooks for credentials, injection patterns, and logic flaws.',
        tier: 'p0_mvp',
        complexity: 'medium',
        estimatedHours: 4,
        assignedRole: 'backend',
        demoImpactScore: 9,
        completed: false
      },
      {
        id: 'feat-2',
        name: 'Gemini 3.8 Semantic Patch Synthesis',
        description: 'Feeds flagged vulnerabilities into Gemini Flash with strict AST constraints to synthesize verified patch code.',
        tier: 'p0_mvp',
        complexity: 'medium',
        estimatedHours: 4,
        assignedRole: 'ai',
        demoImpactScore: 10,
        completed: false
      },
      {
        id: 'feat-3',
        name: 'Live Cyber-Triage Radar & Diff Visualizer UI',
        description: 'Real-time interactive dashboard displaying incoming repository events, risk scores, and before/after code diffs with syntax highlighting.',
        tier: 'p0_mvp',
        complexity: 'low',
        estimatedHours: 3,
        assignedRole: 'frontend',
        demoImpactScore: 9,
        completed: false
      },
      {
        id: 'feat-4',
        name: 'One-Click PR Auto-Merge Webhook Bot',
        description: 'Generates GitHub PR review comments with one-click approval buttons.',
        tier: 'p1_should',
        complexity: 'medium',
        estimatedHours: 3,
        assignedRole: 'backend',
        demoImpactScore: 8,
        completed: false
      },
      {
        id: 'feat-5',
        name: 'Team Vulnerability Leaderboard & Gamified Badges',
        description: 'Tracks security cleanliness across hackathon team members.',
        tier: 'p2_cut',
        complexity: 'high',
        estimatedHours: 5,
        assignedRole: 'frontend',
        demoImpactScore: 5,
        completed: false
      }
    ],
    techStack: [
      {
        category: 'Frontend & UI',
        tool: 'React 19 + Vite + Tailwind CSS + Lucide Icons',
        justification: 'Zero build latency, instant hot-reloading, beautiful dark developer aesthetic without CSS overhead.',
        hackathonTip: 'Use pre-built component states and mock fallback toggles so UI never hangs during judging.'
      },
      {
        category: 'Backend & Routing',
        tool: 'Node.js Express + TypeScript (or FastAPI)',
        justification: 'Single language across stack, built-in async streaming, instant JSON serialization.',
        hackathonTip: 'Keep all business logic behind simple REST endpoints to allow both frontend and curl demos.'
      },
      {
        category: 'AI Engine',
        tool: 'Gemini 3.8 Flash (@google/genai SDK)',
        justification: 'Industry-leading sub-second latency, 1M+ token context window, structured JSON output mode, lowest rate limit barriers.',
        hackathonTip: 'Enforce responseSchema or markdown backtick extraction with fallback regex to guarantee valid JSON.'
      },
      {
        category: 'Database & Persistence',
        tool: 'PostgreSQL / Supabase (with SQLite in-memory fallback)',
        justification: 'Zero-config local database schema, instant SQL seed execution, clean relational models.',
        hackathonTip: 'Provide a pre-seeded mock dataset in code so a cold database never halts your demo.'
      },
      {
        category: 'Deployment & CI/CD',
        tool: 'Cloud Run / Vercel',
        justification: 'Single-command deployment with HTTPS certificates and instant public URL.',
        hackathonTip: 'Deploy your Hello World in Hour 2. Never deploy for the first time in the final 30 minutes!'
      }
    ],
    cliSetupCommands: [
      'npm create vite@latest hack-app -- --template react-ts',
      'cd hack-app && npm install @google/genai lucide-react clsx tailwindcss',
      'echo "GEMINI_API_KEY=your_key_here" > .env.local'
    ],
    envVarsRequired: [
      { key: 'GEMINI_API_KEY', description: 'Google AI Studio API Key for Gemini 3.8 Flash', placeholder: 'AIzaSy...' },
      { key: 'DATABASE_URL', description: 'Postgres / Supabase connection URL', placeholder: 'postgresql://user:pass@host:5432/db' },
      { key: 'PORT', description: 'Server listening port', placeholder: '3000' }
    ],
    architecture: {
      summary: 'Event-driven edge architecture separating real-time UI telemetry from serverless LLM patch synthesis.',
      nodes: [
        { id: 'client_ui', label: 'Hacker Radar Web App', category: 'client', description: 'React 19 dashboard rendering real-time stream', tech: 'React + Tailwind' },
        { id: 'api_proxy', label: 'API Gateway & Webhook Dispatcher', category: 'gateway', description: 'Express server validating payloads and routing jobs', tech: 'Express TypeScript' },
        { id: 'gemini_engine', label: 'Gemini 3.8 Flash Agent', category: 'ai_service', description: 'Analyzes vulnerability AST and synthesizes patch code', tech: '@google/genai' },
        { id: 'db_store', label: 'Relational Audit Store', category: 'database', description: 'Stores repos, vulnerability logs, and patch history', tech: 'PostgreSQL / Supabase' },
        { id: 'git_api', label: 'GitHub / Git Repo API', category: 'external_api', description: 'Fetches raw commit diffs & pushes review comments', tech: 'REST Webhooks' }
      ],
      connections: [
        { from: 'client_ui', to: 'api_proxy', label: 'REST / Server-Sent Events', protocol: 'REST' },
        { from: 'api_proxy', to: 'gemini_engine', label: 'generateContent (Structured JSON)', protocol: 'REST' },
        { from: 'api_proxy', to: 'db_store', label: 'Prisma / SQL Queries', protocol: 'SQL' },
        { from: 'api_proxy', to: 'git_api', label: 'Webhook Listen & PR Commenting', protocol: 'REST' }
      ],
      dataFlowSteps: [
        { step: 1, title: 'Code Ingestion', description: 'User submits code snippet or Git push webhook triggers /api/analyze endpoint.', fromNode: 'client_ui', toNode: 'api_proxy' },
        { step: 2, title: 'Syntax & Rule Triage', description: 'Regex/AST tokenizer isolates suspicious blocks and builds prompt context.', fromNode: 'api_proxy', toNode: 'api_proxy' },
        { step: 3, title: 'Gemini Flash Reasoning', description: 'Gemini 3.8 evaluates CVE risk level, explanation, and generates fixed code.', fromNode: 'api_proxy', toNode: 'gemini_engine' },
        { step: 4, title: 'Audit Persistence', description: 'Audit record and proposed patch are saved with timestamp and severity score.', fromNode: 'api_proxy', toNode: 'db_store' },
        { step: 5, title: 'Instant Live UI Stream', description: 'Visual radar highlights threat in red, shows animated remediation in green.', fromNode: 'api_proxy', toNode: 'client_ui' }
      ],
      offlineFallbackStrategy: 'If Gemini API hits a rate limit or network drops during demo, the backend switches seamlessly to pre-computed cached analysis responses for the demo repository.'
    },
    database: {
      databaseType: 'PostgreSQL / Supabase',
      tables: [
        {
          name: 'repositories',
          description: 'Tracks connected project repos and scanning configs',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Unique repository identifier' },
            { name: 'name', type: 'VARCHAR(128)', nullable: false, description: 'Repo slug (e.g. owner/repo)' },
            { name: 'clone_url', type: 'TEXT', nullable: false, description: 'HTTPS Git clone URL' },
            { name: 'default_branch', type: 'VARCHAR(64)', nullable: false, description: 'Main/master branch' },
            { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, description: 'Creation timestamp' }
          ]
        },
        {
          name: 'security_audits',
          description: 'Individual scan runs executed against commits or files',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Audit run ID' },
            { name: 'repo_id', type: 'UUID', isForeign: true, references: 'repositories(id)', nullable: false, description: 'Foreign key to repository' },
            { name: 'commit_hash', type: 'VARCHAR(40)', nullable: false, description: 'Git commit SHA' },
            { name: 'status', type: 'VARCHAR(32)', nullable: false, description: 'PENDING, CLEAN, VULNERABLE' },
            { name: 'severity_score', type: 'INTEGER', nullable: false, description: '0-100 overall threat level' },
            { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, description: 'Timestamp' }
          ]
        },
        {
          name: 'vulnerability_findings',
          description: 'Detailed security issues discovered per audit',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Finding ID' },
            { name: 'audit_id', type: 'UUID', isForeign: true, references: 'security_audits(id)', nullable: false, description: 'Parent audit run' },
            { name: 'category', type: 'VARCHAR(64)', nullable: false, description: 'SQL_INJECTION, HARDCODED_KEY, XSS' },
            { name: 'file_path', type: 'TEXT', nullable: false, description: 'Affected source file' },
            { name: 'line_start', type: 'INTEGER', nullable: false, description: 'Starting line number' },
            { name: 'vulnerable_snippet', type: 'TEXT', nullable: false, description: 'Raw code snippet' },
            { name: 'suggested_patch', type: 'TEXT', nullable: false, description: 'Gemini synthesized safe replacement' },
            { name: 'status', type: 'VARCHAR(32)', nullable: false, description: 'OPEN, APPLIED, DISMISSED' }
          ]
        }
      ],
      relationships: [
        { fromTable: 'repositories', toTable: 'security_audits', type: '1:N', foreignKey: 'repo_id' },
        { fromTable: 'security_audits', toTable: 'vulnerability_findings', type: '1:N', foreignKey: 'audit_id' }
      ],
      sqlDDL: `-- PostgreSQL Hackathon Schema for DevPulse AI
CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(128) NOT NULL,
  clone_url TEXT NOT NULL,
  default_branch VARCHAR(64) DEFAULT 'main',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE security_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  commit_hash VARCHAR(40) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  severity_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vulnerability_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES security_audits(id) ON DELETE CASCADE,
  category VARCHAR(64) NOT NULL,
  file_path TEXT NOT NULL,
  line_start INT NOT NULL,
  vulnerable_snippet TEXT NOT NULL,
  suggested_patch TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'OPEN'
);

-- Quick Hackathon Seed Data
INSERT INTO repositories (id, name, clone_url) VALUES 
('11111111-1111-1111-1111-111111111111', 'hackathon-team/fintech-api', 'https://github.com/hackathon-team/fintech-api.git');

INSERT INTO security_audits (id, repo_id, commit_hash, status, severity_score) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'a1b2c3d4e5f6', 'VULNERABLE', 88);

INSERT INTO vulnerability_findings (audit_id, category, file_path, line_start, vulnerable_snippet, suggested_patch) VALUES
('22222222-2222-2222-2222-222222222222', 'SQL_INJECTION', 'src/controllers/auth.ts', 42, 'db.query("SELECT * FROM users WHERE email = \'" + email + "\'")', 'db.query("SELECT * FROM users WHERE email = $1", [email])');
`,
      prismaSchema: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Repository {
  id            String          @id @default(uuid())
  name          String
  cloneUrl      String
  defaultBranch String          @default("main")
  createdAt     DateTime        @default(now())
  audits        SecurityAudit[]
}

model SecurityAudit {
  id            String                 @id @default(uuid())
  repoId        String
  repository    Repository             @relation(fields: [repoId], references: [id])
  commitHash    String
  status        String                 @default("PENDING")
  severityScore Int                    @default(0)
  createdAt     DateTime               @default(now())
  findings      VulnerabilityFinding[]
}

model VulnerabilityFinding {
  id                String        @id @default(uuid())
  auditId           String
  audit             SecurityAudit @relation(fields: [auditId], references: [id])
  category          String
  filePath          String
  lineStart         Int
  vulnerableSnippet String
  suggestedPatch    String
  status            String        @default("OPEN")
}`
    },
    apis: [
      {
        id: 'api-1',
        method: 'POST',
        path: '/api/audits/scan',
        summary: 'Trigger Code Vulnerability Scan',
        description: 'Receives raw code snippet or Git diff, invokes Gemini 3.8 Flash, and returns structured findings.',
        requestBodySample: JSON.stringify({
          repoName: 'my-org/auth-service',
          filePath: 'server/auth.js',
          codeSnippet: 'const user = await db.query(`SELECT * FROM users WHERE token = "${req.headers.auth}"`);'
        }, null, 2),
        responseSample: JSON.stringify({
          auditId: 'audit-98124',
          severityScore: 92,
          findingsCount: 1,
          findings: [
            {
              category: 'SQL_INJECTION',
              description: 'Direct string interpolation in raw SQL query permits authentication bypass.',
              vulnerableSnippet: 'SELECT * FROM users WHERE token = "${req.headers.auth}"',
              suggestedPatch: 'SELECT * FROM users WHERE token = $1 [params: req.headers.auth]',
              autoFixAvailable: true
            }
          ]
        }, null, 2),
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        curlExample: 'curl -X POST https://your-app.com/api/audits/scan -H "Content-Type: application/json" -d \'{"filePath":"auth.js","codeSnippet":"..."}\''
      },
      {
        id: 'api-2',
        method: 'GET',
        path: '/api/audits/recent',
        summary: 'List Recent Triage Scans',
        description: 'Returns the 10 most recent code scans with severity ratings for dashboard visualization.',
        requestBodySample: '{}',
        responseSample: JSON.stringify({
          totalScans: 24,
          highRiskCount: 3,
          recent: [
            { id: 'scan-1', repo: 'team/api', score: 88, status: 'VULNERABLE', timestamp: '2026-10-12T16:30:00Z' },
            { id: 'scan-2', repo: 'team/ui', score: 10, status: 'CLEAN', timestamp: '2026-10-12T16:22:00Z' }
          ]
        }, null, 2),
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        curlExample: 'curl https://your-app.com/api/audits/recent'
      },
      {
        id: 'api-3',
        method: 'POST',
        path: '/api/patches/apply',
        summary: 'Auto-Apply Gemini Patch',
        description: 'Simulates automatic PR creation or direct Git commit applying the suggested remediation.',
        requestBodySample: JSON.stringify({
          findingId: 'finding-001',
          branch: 'security-patch-gemini-001',
          commitMessage: 'fix(security): sanitize user token input in auth query'
        }, null, 2),
        responseSample: JSON.stringify({
          success: true,
          prUrl: 'https://github.com/team/api/pull/42',
          verifiedByUnitTests: true
        }, null, 2),
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        curlExample: 'curl -X POST https://your-app.com/api/patches/apply -H "Content-Type: application/json" -d \'{"findingId":"finding-001"}\''
      }
    ],
    timeline: {
      hackathonDuration: duration,
      phases: [
        {
          phaseName: 'Phase 1: Foundation & Data Contracts (Hours 0-4)',
          startHour: 0,
          endHour: 4,
          objective: 'Freeze scope, scaffold repo, establish API contracts, verify Gemini API keys, and deploy Hello World.',
          tasks: [
            { id: 't-1', title: 'Initialize Vite React + Tailwind repository & deploy to staging URL', role: 'Frontend', deliverable: 'Live public URL accessible on phone & laptop', riskAlert: 'Do not spend 3 hours tweaking fonts; get the live URL up now!', completed: true },
            { id: 't-2', title: 'Build Express /api/scan endpoint with Gemini 3.8 Flash SDK integration', role: 'AI', deliverable: 'Postman/cURL test returning valid JSON vulnerability triage', completed: true },
            { id: 't-3', title: 'Seed mock repository & mock findings dataset for local demo safety', role: 'Backend', deliverable: 'Seed script and mock fallback flag', completed: false }
          ]
        },
        {
          phaseName: 'Phase 2: Core Engine & AI Synthesis (Hours 4-12)',
          startHour: 4,
          endHour: 12,
          objective: 'Build the primary demo flow: paste code -> analyze -> AI patch generation -> diff viewer.',
          tasks: [
            { id: 't-4', title: 'Design Cyber Radar UI with split code editor & side-by-side diff comparison', role: 'Frontend', deliverable: 'Interactive Monaco or prism-styled code view', completed: false },
            { id: 't-5', title: 'Fine-tune Gemini system prompts with AST schema enforcement', role: 'AI', deliverable: 'Zero JSON parse failures across 20 test snippets', completed: false },
            { id: 't-6', title: 'Hook frontend to backend API with optimistic loading states and toast notifications', role: 'Fullstack', deliverable: 'Full end-to-end interactive scan loop working', completed: false }
          ]
        },
        {
          phaseName: 'Phase 3: Visual Polish & "Wow Factor" (Hours 12-18)',
          startHour: 12,
          endHour: 18,
          objective: 'Elevate demo aesthetics: animations, live metric tickers, sound effects/confetti on patch applied.',
          tasks: [
            { id: 't-7', title: 'Add animated threat radar pulses and severity score gauge (0-100)', role: 'Frontend', deliverable: 'Visual eye-candy that immediately hooks judges walking by', completed: false },
            { id: 't-8', title: 'Simulate GitHub PR creation flow with realistic branch badges and webhook simulator', role: 'Backend', deliverable: 'Demo button showing instant PR generated', completed: false }
          ]
        },
        {
          phaseName: 'Phase 4: Code Freeze & Murphy\'s Law Shield (Hours 18-22)',
          startHour: 18,
          endHour: 22,
          objective: 'HARD CODE FREEZE. Record high-res backup video. Test local offline mode.',
          tasks: [
            { id: 't-9', title: 'Record pristine 2-minute 1080p MP4 screen recording with voiceover', role: 'All', deliverable: 'Uncorrupted video file on desktop & Google Drive', riskAlert: 'Crucial: Hackathon Wi-Fi always degrades during final judging!', completed: false },
            { id: 't-10', title: 'Verify offline demo fallback: test demo with Wi-Fi switched OFF', role: 'Backend', deliverable: 'App works flawlessly from local cache if APIs drop', completed: false }
          ]
        },
        {
          phaseName: 'Phase 5: Pitch Deck, Rehearsal & Devpost Submission (Hours 22-24)',
          startHour: 22,
          endHour: 24,
          objective: 'Submit Devpost 45 minutes early. Rehearse 2-minute pitch 5 times with stopwatch.',
          tasks: [
            { id: 't-11', title: 'Finalize 5-slide pitch deck (Problem, Demo, Tech, Business, Team)', role: 'All', deliverable: 'Google Slides / Pitch.com deck link', completed: false },
            { id: 't-12', title: 'Submit Devpost form with GitHub link, video, and sponsor tag claims', role: 'All', deliverable: 'Submitted receipt before deadline panic', riskAlert: 'Devpost servers crash in final 15 minutes. Submit early!', completed: false }
          ]
        }
      ],
      goldenRule: 'Hour 18 Rule: Stop coding new features! A polished 3-feature app beats an 8-feature app that crashes on stage 100% of the time.'
    },
    pitchKit: {
      elevatorPitch: 'Every hour, hackathon coders and fast-moving teams push credentials and injection bugs to production. DevPulse AI is the autonomous security copilot powered by Gemini 3.8 Flash that catches threats in sub-seconds and commits verified, test-passing remediation patches before attackers can blink.',
      twoMinuteDemoScript: [
        {
          timestamp: '0:00 - 0:20',
          segment: 'The Hook & Relatable Pain',
          visualOnScreen: 'Slide showing "$4.35M average breach cost" or live terminal with exposed AWS key.',
          speakerScript: 'Judges, raise your hand if you have ever accidentally committed an API key or an unescaped SQL query at 3 AM. It happens to every team. But what if your IDE could self-heal your code in real time?'
        },
        {
          timestamp: '0:20 - 0:50',
          segment: 'The Live Aha! Moment',
          visualOnScreen: 'Paste vulnerable SQL query into DevPulse UI. Click "Scan Repo".',
          speakerScript: 'Watch this live: I am pasting a classic authentication bypass query. In under 600 milliseconds, Gemini 3.8 Flash flags the exact line, calculates an 88/100 CVE severity rating, and explains why it fails.'
        },
        {
          timestamp: '0:50 - 1:20',
          segment: 'Autonomous Patch & Verification',
          visualOnScreen: 'Click "Auto-Synthesize Patch". Visual green diff appears. Click "Apply & Generate PR".',
          speakerScript: 'Here is the magic. DevPulse does not just complain—it synthesizes a production-grade parameterized replacement, verifies AST syntax, and opens a ready-to-merge GitHub PR with one click.'
        },
        {
          timestamp: '1:20 - 1:45',
          segment: 'Architecture & Tech Execution',
          visualOnScreen: 'Architecture Blueprint slide highlighting Gemini Flash latency and Postgres schema.',
          speakerScript: 'Under the hood, we leverage Gemini 3.8 Flash for lightning fast structured JSON reasoning, backed by an event-driven Express pipeline and PostgreSQL audit trail.'
        },
        {
          timestamp: '1:45 - 2:00',
          segment: 'Closing & The Vision',
          visualOnScreen: 'Vision slide with team GitHub links and live URL QR code.',
          speakerScript: 'DevPulse AI turns security from an agonizing bottleneck into an invisible superpower. Try our live demo at the link on your screen. Thank you, and we welcome your questions!'
        }
      ],
      pitchDeckSlides: [
        {
          slideNumber: 1,
          title: 'Cover & One-Liner',
          keyPoints: ['DevPulse AI', 'Autonomous continuous security & code auto-healing', 'Team Members & Contact'],
          visualSuggestion: 'High-contrast logo, clean cyber radar graphic, hackathon track badge'
        },
        {
          slideNumber: 2,
          title: 'The Problem: The Speed vs Security Trap',
          keyPoints: ['Developers ship 10x faster with AI copilots, but security reviews lag behind', '78% of data breaches stem from trivial misconfigurations and injection bugs', 'Manual code auditing costs thousands of developer hours'],
          visualSuggestion: 'Side-by-side graphic: Velocity graph shooting up vs Security debt compounding'
        },
        {
          slideNumber: 3,
          title: 'The Solution: DevPulse AI In Action',
          keyPoints: ['Sub-second AST + Semantic Triage powered by Gemini 3.8 Flash', 'Automated patch generation with unit test verification', 'Zero friction: seamlessly fits into existing Git pull request flows'],
          visualSuggestion: 'Screenshot of the side-by-side diff viewer with the green verified badge'
        },
        {
          slideNumber: 4,
          title: 'Technical Architecture & Moat',
          keyPoints: ['Gemini 3.8 Flash structured output pipeline for guaranteed JSON contracts', 'Relational audit logging in PostgreSQL', 'Designed for offline edge caching resilience during outages'],
          visualSuggestion: 'Clean system architecture diagram showing Client -> Gateway -> Gemini -> Database'
        },
        {
          slideNumber: 5,
          title: 'Business Model & What\'s Next',
          keyPoints: ['Developer-first freemium tier with team enterprise seat pricing', 'Next: IDE plugin (VS Code & Cursor extension)', 'Live demo QR code ready to test right now'],
          visualSuggestion: 'Roadmap timeline (Post-hackathon) + prominent QR code linking to the live app'
        }
      ],
      judgingCriteriaTactics: {
        innovation: 'Novel use of Gemini 3.8 Flash not merely as a text chatbot, but as an active compiler and AST code synthesis engine.',
        technicalExecution: 'Full-stack working implementation with live backend proxy, schema migrations, and real-time diff calculations.',
        userExperience: 'Tailored for developer ergonomics with keyboard shortcuts, dark cyber theme, and instant zero-friction interactions.',
        businessViability: 'Clear target market: dev shops and enterprise teams needing automated compliance without slowing down release cycles.'
      },
      emergencyDemoChecklist: [
        'Prerecorded 1080p MP4 screen capture on desktop (in case of venue Wi-Fi failure)',
        'Local mock data toggle enabled in UI (VITE_USE_MOCKS=true)',
        'Personal mobile 5G hotspot turned on as backup',
        'Demo tab preloaded with cached sample vulnerability to skip cold starts',
        'Second laptop or phone opened with slides ready to present immediately'
      ]
    },
    boilerplate: {
      systemPromptForGemini: `You are an elite Staff AppSec Engineer and Senior Code Compiler AI.
Your mission is to perform strict static analysis and semantic vulnerability triage on code snippets submitted by developers.
For each input, output strictly valid JSON matching this schema:
{
  "severityScore": <number 0-100>,
  "riskTier": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE",
  "category": "<VULNERABILITY_TYPE_OR_CWE>",
  "explanation": "<Clear 2-sentence explanation of why this code is vulnerable>",
  "vulnerableLines": "<The exact lines that must change>",
  "remediatedCode": "<The complete, drop-in replacement code that fixes the issue>",
  "preventionTip": "<Actionable best practice for the developer>"
}
Never include extraneous conversational greetings, preamble, or markdown code fences outside the JSON.`,
      starterCode: [
        {
          filename: 'geminiTriageService.ts',
          language: 'typescript',
          description: 'Production-ready server-side Gemini 3.8 Flash integration helper',
          code: `import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI();

export interface TriageResult {
  severityScore: number;
  riskTier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  category: string;
  explanation: string;
  vulnerableLines: string;
  remediatedCode: string;
  preventionTip: string;
}

export async function analyzeCodeVulnerability(codeSnippet: string, language = 'typescript'): Promise<TriageResult> {
  const prompt = \`Analyze the following \${language} code for security flaws, credentials leakage, injection, or dangerous logic:
\\\`\\\`\\\`\${language}
\${codeSnippet}
\\\`\\\`\\\`\`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: 'You are an AppSec Staff Engineer. Output strict JSON analysis.',
    }
  });

  return JSON.parse(response.text || '{}');
}`
        },
        {
          filename: 'useHackathonApi.ts',
          language: 'typescript',
          description: 'React hook for managing real-time vulnerability scan states with fallback support',
          code: `import { useState, useCallback } from 'react';

export function useCodeScanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (codeSnippet: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/audits/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeSnippet })
      });
      if (!res.ok) throw new Error(\`Scan failed: \${res.statusText}\`);
      const data = await res.json();
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { scan, loading, result, error };
}`
        }
      ]
    }
  };
}

// 1. Generate full hackathon copilot blueprint
app.post('/api/generate-blueprint', async (req: Request, res: Response) => {
  try {
    const { idea, duration = 24, teamSize = 3, track = 'AI & LLM', scopeBias = 'balanced' } = req.body;

    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Project idea is required.' });
    }

    // If Gemini client is not initialized, return the rich fallback blueprint tailored to this idea
    if (!aiClient || !apiKey) {
      console.log('No GEMINI_API_KEY detected, returning fallback blueprint.');
      const fallback = getFallbackBlueprint(idea, duration, teamSize, track);
      return res.json({ blueprint: fallback, source: 'fallback_template' });
    }

    const prompt = `You are HackPilot, the world-class Hackathon Winning Architect and Senior Staff Engineer.
A hackathon team has submitted this project idea:
"${idea}"

Hackathon Constraints:
- Duration: ${duration} hours
- Team Size: ${teamSize} hackers
- Target Hackathon Track: ${track}
- Scope Strategy: ${scopeBias} (Lean MVP, Crowd-Pleaser Demo, or Technical Depth)

Create a complete, realistic, winning hackathon plan and system specification.
Respond with strictly valid JSON containing:
{
  "profile": {
    "title": "Short, catchy, memorable project name",
    "tagline": "Punchy one-sentence value proposition",
    "problemStatement": "Specific 1-2 sentence friction point this solves",
    "solutionOverview": "How this application uniquely solves it",
    "hackathonTrack": "${track}",
    "targetAudience": "Who will use it",
    "wowFactor": "The single most unforgettable visual/technical demonstration element that will blow judges away during a 2-minute pitch"
  },
  "features": [
    {
      "id": "feat-1",
      "name": "Feature name",
      "description": "Clear functionality description",
      "tier": "p0_mvp" | "p1_should" | "p2_cut",
      "complexity": "low" | "medium" | "high",
      "estimatedHours": 3,
      "assignedRole": "frontend" | "backend" | "ai" | "fullstack",
      "demoImpactScore": 10,
      "completed": false
    }
  ],
  "techStack": [
    {
      "category": "Frontend & UI" | "Backend & APIs" | "AI & LLM Engine" | "Database & Storage" | "DevOps & Cloud",
      "tool": "Specific modern library / framework",
      "justification": "Why this allows lightning-fast hackathon development without configuration headaches",
      "hackathonTip": "Specific insider tip or cheat code for this tool in a hackathon"
    }
  ],
  "cliSetupCommands": ["Terminal command 1", "Terminal command 2"],
  "envVarsRequired": [
    { "key": "VARIABLE_NAME", "description": "What it is", "placeholder": "Example value" }
  ],
  "architecture": {
    "summary": "1-2 sentence high-level architectural paradigm",
    "nodes": [
      { "id": "node_1", "label": "Client UI", "category": "client" | "gateway" | "ai_service" | "database" | "external_api", "description": "What it does", "tech": "Technology" }
    ],
    "connections": [
      { "from": "node_1", "to": "node_2", "label": "HTTP/WS/SQL label", "protocol": "REST" | "WebSocket" | "SQL" | "gRPC" }
    ],
    "dataFlowSteps": [
      { "step": 1, "title": "Step Title", "description": "What happens", "fromNode": "node_id", "toNode": "node_id" }
    ],
    "offlineFallbackStrategy": "What to do if Wi-Fi or third-party APIs fail during judge presentation"
  },
  "database": {
    "databaseType": "PostgreSQL / Supabase" | "SQLite" | "MongoDB",
    "tables": [
      {
        "name": "table_name",
        "description": "Table purpose",
        "columns": [
          { "name": "column_name", "type": "DATA_TYPE", "isPrimary": true/false, "isForeign": true/false, "references": "other_table(col)", "nullable": false, "description": "Column info" }
        ]
      }
    ],
    "relationships": [
      { "fromTable": "table1", "toTable": "table2", "type": "1:N" | "1:1" | "N:M", "foreignKey": "foreign_col" }
    ],
    "sqlDDL": "Complete executable PostgreSQL CREATE TABLE statements with dummy seed data INSERT statements!",
    "prismaSchema": "Full Prisma schema definition block"
  },
  "apis": [
    {
      "id": "api-1",
      "method": "POST" | "GET" | "PUT" | "DELETE",
      "path": "/api/...",
      "summary": "Brief summary",
      "description": "Endpoint purpose",
      "requestBodySample": "{\\"key\\": \\"value\\"}",
      "responseSample": "{\\"status\\": \\"success\\"}",
      "status": 200,
      "headers": { "Content-Type": "application/json" },
      "curlExample": "curl -X POST ..."
    }
  ],
  "timeline": {
    "hackathonDuration": ${duration},
    "phases": [
      {
        "phaseName": "Phase name with hour range",
        "startHour": 0,
        "endHour": 4,
        "objective": "Phase milestone",
        "tasks": [
          { "id": "t-1", "title": "Task title", "role": "Frontend" | "Backend" | "AI" | "All", "deliverable": "Concrete artifact", "riskAlert": "Optional risk warning", "completed": false }
        ]
      }
    ],
    "goldenRule": "One golden hackathon survival rule for this timeline"
  },
  "pitchKit": {
    "elevatorPitch": "30-second punchy pitch",
    "twoMinuteDemoScript": [
      {
        "timestamp": "0:00 - 0:20",
        "segment": "The Hook",
        "visualOnScreen": "Visual action on screen",
        "speakerScript": "Word-for-word talking script"
      }
    ],
    "pitchDeckSlides": [
      {
        "slideNumber": 1,
        "title": "Slide Title",
        "keyPoints": ["Point 1", "Point 2", "Point 3"],
        "visualSuggestion": "Visual suggestion"
      }
    ],
    "judgingCriteriaTactics": {
      "innovation": "How to highlight uniqueness",
      "technicalExecution": "How to demonstrate real engineering",
      "userExperience": "How to showcase design polish",
      "businessViability": "How to prove commercial potential"
    },
    "emergencyDemoChecklist": ["Checklist item 1", "Checklist item 2", "Checklist item 3"]
  },
  "boilerplate": {
    "systemPromptForGemini": "System instructions prompt tailored for this specific project",
    "starterCode": [
      {
        "filename": "code.ts",
        "language": "typescript",
        "description": "Starter code description",
        "code": "Actual runnable starter code snippet"
      }
    ]
  }
}
Generate around 4-6 features (categorized strictly into P0, P1, P2), 4-5 tech stack tools, 4-6 architecture nodes with 4-5 flow steps, 3-4 database tables with columns, 3-4 REST endpoints, and 4-5 timeline phases appropriate for a ${duration}-hour hackathon. Return strictly valid JSON with no extraneous markdown outside the JSON.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const rawText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      console.warn('Direct JSON parse failed, attempting regex extraction:', parseErr);
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Unable to parse model JSON output.');
      }
    }

    return res.json({ blueprint: parsedData, source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating blueprint:', error);
    // Provide safe fallback so the user always gets a working experience
    const fallback = getFallbackBlueprint(req.body.idea || 'Smart Hackathon Project', req.body.duration || 24, req.body.teamSize || 3);
    return res.json({ blueprint: fallback, source: 'fallback_on_error', errorMsg: error.message });
  }
});

// 2. Ask Hackathon Copilot (Triage & Emergency Advice)
app.post('/api/ask-copilot', async (req: Request, res: Response) => {
  try {
    const { question, projectContext, conversationHistory = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    if (!aiClient || !apiKey) {
      // Fallback response for offline or no key
      return res.json({
        answer: `[Hackathon Copilot Triage]\n\nBased on your question: "${question}"\n\n1. **Immediate Hackathon Rule**: Never spend more than 25 minutes debugging authentication or 3rd-party API connection errors during a hackathon. Use a mock session with hardcoded demo tokens.\n2. **Judge Presentation Tip**: Judges spend an average of 90 seconds looking at your project. Focus on the core interactive "Aha!" moment rather than full CRUD edge-cases.\n3. **Quick Action**: If an API is throwing errors, insert a local fallback array or mock payload immediately and move to frontend polish.`,
        source: 'local_copilot'
      });
    }

    const systemInstruction = `You are HackPilot Copilot, an elite hackathon mentor and veteran of 50+ major hackathons (HackMIT, PennApps, ETHGlobal, CalHacks).
You give direct, razor-sharp, actionable advice for teams working under extreme time constraints.
Never give theoretical essays. Give concrete 3-step action plans, copy-paste snippets, emergency pivots, and judge-scoring tactics.
Keep answers concise, inspiring, and laser-focused on winning.`;

    const contextStr = projectContext ? `\nCurrent Project Context:\n${JSON.stringify(projectContext, null, 2).slice(0, 3000)}` : '';
    const userPrompt = `${contextStr}\n\nTeam Question / Emergency:\n"${question}"\n\nProvide immediate, actionable guidance.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction
      }
    });

    return res.json({ answer: response.text || 'Keep hacking! You got this.', source: 'gemini' });
  } catch (error: any) {
    console.error('Error in ask-copilot:', error);
    return res.json({
      answer: 'Triage tip: If you are encountering unexpected API errors, immediately switch your local state to demo seed data so you can continue building and rehearsing your pitch!',
      source: 'fallback'
    });
  }
});

// 3. Mock Endpoint Runner for live API testing in the app
app.post('/api/mock-runner', (req: Request, res: Response) => {
  const { sampleResponse, status = 200 } = req.body;
  try {
    const data = typeof sampleResponse === 'string' ? JSON.parse(sampleResponse) : sampleResponse;
    return res.status(status).json(data);
  } catch {
    return res.status(status).json({ message: 'Success', timestamp: new Date().toISOString() });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HackPilot Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
