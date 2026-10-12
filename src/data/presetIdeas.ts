export interface PresetIdea {
  id: string;
  title: string;
  badge: string;
  track: string;
  prompt: string;
  duration: number;
  teamSize: number;
}

export const PRESET_IDEAS: PresetIdea[] = [
  {
    id: 'ai-security',
    title: 'Autonomous Code & Vulnerability Healer',
    badge: 'DevSecOps & AI',
    track: 'AI & LLM',
    prompt: 'A real-time developer security copilot that scans Git commits for credential leaks, SQL injections, and broken auth, and uses Gemini 3.8 Flash to synthesize tested, verified fix PRs automatically.',
    duration: 24,
    teamSize: 3
  },
  {
    id: 'emergency-voice',
    title: 'Offline-First Emergency Dispatch Triage Agent',
    badge: 'Crisis & Civic',
    track: 'Social Good',
    prompt: 'A multimodal voice and SMS agent for natural disaster hotlines that transcribes 911/emergency calls, prioritizes medical urgency using AI semantic extraction, and plots geo-coordinates on a live responder dispatch map even under intermittent connectivity.',
    duration: 36,
    teamSize: 4
  },
  {
    id: 'climate-grid',
    title: 'Microgrid Energy Arbitrage & Solar Trading',
    badge: 'Climate & FinTech',
    track: 'FinTech',
    prompt: 'A peer-to-peer neighborhood solar energy trading platform where home batteries autonomously buy and sell surplus kilowatt-hours using dynamic grid spot pricing, localized weather forecasts, and smart micro-contracts.',
    duration: 24,
    teamSize: 3
  },
  {
    id: 'health-vision',
    title: 'Computer Vision Skin Lesion & Rash Pre-Screening',
    badge: 'HealthTech',
    track: 'HealthTech',
    prompt: 'A patient-facing web app that lets users upload smartphone photos of skin rashes or burns, runs multimodal image classification with dermatological guidelines, detects high-risk flags, and schedules a telemedicine consult with symptom summary.',
    duration: 36,
    teamSize: 3
  },
  {
    id: 'accessibility-ar',
    title: 'Audio Spatial Beacon for Visually Impaired Transit',
    badge: 'Accessibility',
    track: 'Social Good',
    prompt: 'A progressive web app using camera vision and audio feedback to guide visually impaired passengers through subway stations and bus hubs, reading signs aloud and generating subtle 3D sound chimes for door locations and obstacles.',
    duration: 24,
    teamSize: 2
  },
  {
    id: 'agentic-research',
    title: 'Deep Patent & Paper Prior-Art Hunter',
    badge: 'Knowledge & AI',
    track: 'AI & LLM',
    prompt: 'An AI engine that ingests an inventor’s markdown idea draft, cross-searches USPTO patents and arXiv research papers, diagrams technology overlaps, and outputs a defensible novelty matrix for startup founders.',
    duration: 48,
    teamSize: 4
  }
];
