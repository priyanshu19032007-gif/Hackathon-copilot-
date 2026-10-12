export interface ProjectProfile {
  title: string;
  tagline: string;
  problemStatement: string;
  solutionOverview: string;
  hackathonTrack: string;
  targetAudience: string;
  wowFactor: string;
}

export type FeatureTier = 'p0_mvp' | 'p1_should' | 'p2_cut';
export type FeatureComplexity = 'low' | 'medium' | 'high';
export type AssignedRole = 'frontend' | 'backend' | 'ai' | 'fullstack';

export interface Feature {
  id: string;
  name: string;
  description: string;
  tier: FeatureTier;
  complexity: FeatureComplexity;
  estimatedHours: number;
  assignedRole: AssignedRole;
  demoImpactScore: number;
  completed?: boolean;
}

export interface TechStackItem {
  category: string;
  tool: string;
  justification: string;
  hackathonTip: string;
}

export interface EnvVarSpec {
  key: string;
  description: string;
  placeholder: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  category: 'client' | 'gateway' | 'ai_service' | 'database' | 'external_api';
  description: string;
  tech: string;
}

export interface ArchitectureConnection {
  from: string;
  to: string;
  label: string;
  protocol: 'REST' | 'WebSocket' | 'SQL' | 'gRPC';
}

export interface DataFlowStep {
  step: number;
  title: string;
  description: string;
  fromNode: string;
  toNode: string;
}

export interface ArchitectureSpec {
  summary: string;
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  dataFlowSteps: DataFlowStep[];
  offlineFallbackStrategy: string;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  nullable?: boolean;
  description?: string;
}

export interface DatabaseTable {
  name: string;
  description: string;
  columns: DatabaseColumn[];
}

export interface DatabaseRelationship {
  fromTable: string;
  toTable: string;
  type: '1:1' | '1:N' | 'N:M';
  foreignKey: string;
}

export interface DatabaseSpec {
  databaseType: string;
  tables: DatabaseTable[];
  relationships: DatabaseRelationship[];
  sqlDDL: string;
  prismaSchema: string;
}

export interface EndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  requestBodySample: string;
  responseSample: string;
  status: number;
  headers?: Record<string, string>;
  curlExample: string;
}

export interface TimelineTask {
  id: string;
  title: string;
  role: 'Frontend' | 'Backend' | 'AI' | 'All' | 'Fullstack';
  deliverable: string;
  riskAlert?: string;
  completed?: boolean;
}

export interface TimelinePhase {
  phaseName: string;
  startHour: number;
  endHour: number;
  objective: string;
  tasks: TimelineTask[];
}

export interface TimelineSpec {
  hackathonDuration: number;
  phases: TimelinePhase[];
  goldenRule: string;
}

export interface DemoScriptBeat {
  timestamp: string;
  segment: string;
  visualOnScreen: string;
  speakerScript: string;
}

export interface PitchDeckSlide {
  slideNumber: number;
  title: string;
  keyPoints: string[];
  visualSuggestion: string;
}

export interface PitchKitSpec {
  elevatorPitch: string;
  twoMinuteDemoScript: DemoScriptBeat[];
  pitchDeckSlides: PitchDeckSlide[];
  judgingCriteriaTactics: {
    innovation: string;
    technicalExecution: string;
    userExperience: string;
    businessViability: string;
  };
  emergencyDemoChecklist: string[];
}

export interface StarterCodeItem {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export interface BoilerplateSpec {
  systemPromptForGemini: string;
  starterCode: StarterCodeItem[];
}

export interface HackathonBlueprint {
  profile: ProjectProfile;
  features: Feature[];
  techStack: TechStackItem[];
  cliSetupCommands: string[];
  envVarsRequired: EnvVarSpec[];
  architecture: ArchitectureSpec;
  database: DatabaseSpec;
  apis: EndpointSpec[];
  timeline: TimelineSpec;
  pitchKit: PitchKitSpec;
  boilerplate: BoilerplateSpec;
}
