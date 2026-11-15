import type { ImageMetadata } from 'astro';
import { atlasProjects, type AtlasProjectId } from './atlas';
import pecsScene from '../assets/pecs-urban-scenario.png';
import trafficCapture from '../assets/traffic-analysis.png';
import bankingSchema from '../assets/banking-schema.png';

interface Artifact {
  id: AtlasProjectId;
  tab: string;
  domain: string;
  label: string;
  context: string;
  visual: { kind: 'image'; src: ImageMetadata; alt: string } | { kind: 'mosaic' };
  source?: string;
}

const artifacts = [
  {
    id: 'urban-uav',
    tab: 'Urban UAV',
    domain: 'Simulation',
    label: 'MATLAB · Pécs urban scenario',
    context: 'Inspect the building geometry and plotted flight path in the Pécs simulation.',
    visual: { kind: 'image', src: pecsScene, alt: 'MATLAB view of the Pécs city mesh with a plotted UAV path and position axes' },
  },
  {
    id: 'traffic-monitoring',
    tab: 'Traffic',
    domain: 'Computer vision',
    label: 'Application capture · Grid inspection',
    context: 'The results view overlays experimental detections and displays counts for the selected grid cell. Dense crowd counting is unsupported, and the detector failed its evaluation quality gate.',
    visual: { kind: 'image', src: trafficCapture, alt: 'Traffic results screen showing predicted boxes, a grid overlay, and a selected-cell inspector' },
    source: 'https://github.com/AliCS-dev/traffic-crowd-monitoring-app/blob/5cbd433eebed9678f2e288329d4a99b8ad295cc4/docs/images/user-guide/image-result.png',
  },
  {
    id: 'banking',
    tab: 'Banking',
    domain: 'Full stack · Team project',
    label: 'Database design · Entity relationships',
    context: 'The team’s database diagram shows how customers, account ownership, accounts, and transaction entries are related.',
    visual: { kind: 'image', src: bankingSchema, alt: 'Entity relationship diagram linking banking customers, account owners, accounts, and transaction entries' },
    source: 'https://github.com/AliCS-dev/banking-app/blob/9c4d0fd6b698003cb085567eb1f3aff3a1bdea32/backend/db/ERD.png',
  },
  {
    id: 'mosaic-rag',
    tab: 'Mosaic-RAG',
    domain: 'Applied AI · Research prototype',
    label: 'Service architecture · API request',
    context: 'The API retrieves documents, passes them with the query to the generator, and returns the answer.',
    visual: { kind: 'mosaic' },
  },
] satisfies readonly Artifact[];

export const workbenchArtifacts: readonly (Artifact & { title: string; repository: string })[] =
  artifacts.map(artifact => ({ ...atlasProjects[artifact.id], ...artifact }));
