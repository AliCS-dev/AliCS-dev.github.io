export const atlasProjects = {
  'urban-uav': {
    title: 'Urban UAV Logistics Simulation',
    label: 'Urban UAV',
    repository: 'https://github.com/AppliedSystems-Lab/Multi-UAV-Path-Planning',
  },
  'mosaic-rag': {
    title: 'Mosaic-RAG',
    label: 'Mosaic-RAG',
    repository: 'https://github.com/AliCS-dev/Mosaic-RAG',
  },
  'traffic-monitoring': {
    title: 'Traffic and Crowd Monitoring',
    label: 'Traffic & Crowd',
    repository: 'https://github.com/AliCS-dev/traffic-crowd-monitoring-app',
  },
  banking: {
    title: 'Banking Application',
    label: 'Banking App',
    repository: 'https://github.com/AliCS-dev/banking-app',
  },
} as const;

export type AtlasProjectId = keyof typeof atlasProjects;

export interface AtlasDiscipline {
  id: string;
  label: string;
  description: string;
  projects: readonly [AtlasProjectId, ...AtlasProjectId[]];
}

export const atlasDisciplines = [
  {
    id: 'simulation',
    label: 'Simulation',
    description: 'Urban flight scenarios for exploring UAV path planning in MATLAB and Simulink.',
    projects: ['urban-uav'],
  },
  {
    id: 'retrieval',
    label: 'Retrieval & AI',
    description: 'A modular RAG prototype with separate retrieval and generation services.',
    projects: ['mosaic-rag'],
  },
  {
    id: 'backend',
    label: 'Backend services',
    description: 'APIs for orchestrating retrieval, processing aerial detections, and managing bank accounts and transactions.',
    projects: ['mosaic-rag', 'banking', 'traffic-monitoring'],
  },
  {
    id: 'vision',
    label: 'Computer vision',
    description: 'Experimental object detection in aerial images and sampled video frames.',
    projects: ['traffic-monitoring'],
  },
] as const satisfies readonly AtlasDiscipline[];

export type AtlasDisciplineId = (typeof atlasDisciplines)[number]['id'];

export const projectHref = (id: AtlasProjectId) => `#project-${id}`;
