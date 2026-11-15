import type { ImageMetadata } from 'astro';
import { atlasProjects, type AtlasProjectId } from './atlas';
import pecs from '../assets/pecs-urban-scenario.png';
import traffic from '../assets/traffic-analysis.png';
import banking from '../assets/banking-schema.png';

interface CaseStudy {
  id: AtlasProjectId;
  number: string;
  short: string;
  domain: string;
  summary: string;
  status: string;
  image?: ImageMetadata;
  alt?: string;
  caption: string;
  sections: readonly { title: string; body: string; steps?: string[] }[];
  sources: readonly { label: string; href: string }[];
}

const entries: readonly CaseStudy[] = [
  {
    id: 'urban-uav', number: '01', short: 'Urban UAV', domain: 'Simulation · Robotics',
    summary: 'Explore how an unmanned aircraft can plan a route through a simulated urban environment.',
    status: 'Simulation experiment',
    image: pecs, alt: 'MATLAB rendering of the Pécs building mesh and a plotted flight path.',
    caption: 'Pécs urban scenario · Original MATLAB output',
    sections: [
      { title: 'The engineering question', body: 'An urban flight planner needs a model of the space around the aircraft before it can propose a route. This project explores that problem in MATLAB and Simulink using simulated flight scenarios.' },
      { title: 'From sensor readings to a trajectory', body: 'In the Budapest planner experiment, simulated lidar scans are inserted into a 3D occupancy map. An occupancy-map validator supplies collision checks to an RRT* planner. The script converts the planned positions to waypoints, builds a trajectory, and looks up aircraft poses as simulation time advances.', steps: ['Simulated lidar', '3D occupancy map', 'RRT* planner', 'Waypoint trajectory'] },
      { title: 'What the evidence shows', body: 'The Pécs figure shows the city mesh and a plotted route. The Budapest source separately demonstrates the mapping and planning sequence. These are simulation artifacts. They do not establish field-tested flight safety, delivery performance, or real-world localization accuracy.' },
    ],
    sources: [{ label: 'MATLAB autonomous planner', href: 'https://github.com/AppliedSystems-Lab/Multi-UAV-Path-Planning/blob/main/Autonomous_Planner.m' }],
  },
  {
    id: 'traffic-monitoring', number: '02', short: 'Traffic Monitoring', domain: 'Computer vision · BSc thesis',
    summary: 'Inspect predicted objects in aerial images and sampled video frames, down to a selected grid cell.',
    status: 'Experimental detector',
    image: traffic, alt: 'Traffic results interface showing model predictions on a roundabout and an inspector for the selected grid cell.',
    caption: 'Original application capture · Prediction and grid overlays',
    sections: [
      { title: 'The engineering question', body: 'Detection output needs to be inspectable. The application lets users review predicted boxes by class and by region, then reopen a saved analysis without resubmitting the media.' },
      { title: 'Processing and inspection', body: 'The frontend submits media to a FastAPI backend. OpenCV prepares image input and the detector predicts objects. For video, a background job samples frames and records source timestamps. PostgreSQL stores structured results for later inspection, while media is served separately.', steps: ['Submit media', 'Run inference', 'Save results', 'Review by frame or region'] },
      { title: 'Evaluation limits', body: 'The detector failed its evaluation quality gate. Dense crowd counting remains unsupported. Counts are predictions from each processed image or sampled frame, with no deduplication of people or vehicles across a recording. The screenshot demonstrates the inspection interface.' },
    ],
    sources: [
      { label: 'Application guide', href: 'https://github.com/AliCS-dev/traffic-crowd-monitoring-app/blob/main/docs/user_guide.md' },
      { label: 'Screenshot provenance', href: 'https://github.com/AliCS-dev/traffic-crowd-monitoring-app/blob/5cbd433eebed9678f2e288329d4a99b8ad295cc4/docs/images/user-guide/README.md' },
    ],
  },
  {
    id: 'banking', number: '03', short: 'Banking Application', domain: 'Full stack · Databases',
    summary: 'A team-built application connecting account and transaction forms to a relational data model.',
    status: 'Team project',
    image: banking, alt: 'Database diagram relating customers, account owners, accounts, transactions and transaction entries.',
    caption: 'Original team entity relationship diagram',
    sections: [
      { title: 'The engineering question', body: 'The application models account ownership and transaction activity while providing browser workflows for opening accounts and submitting deposits or withdrawals. The repository credits multiple team members. Individual ownership of particular modules is not established here.' },
      { title: 'Browser, API and data model', body: 'The React client communicates with a NestJS API. JWT authentication is implemented on the backend, and TypeORM connects application code to PostgreSQL. The schema separates customers, account ownership, accounts, transactions and per-transaction entries.', steps: ['React forms', 'NestJS API', 'PostgreSQL records'] },
      { title: 'Transaction handling', body: 'The transaction service groups related writes using a database transaction, with rollback on failure. The portfolio describes the source-backed application and schema. It makes no claims about production use, financial compliance or a security audit.' },
    ],
    sources: [
      { label: 'Team and setup documentation', href: 'https://github.com/AliCS-dev/banking-app#readme' },
      { label: 'Transaction service', href: 'https://github.com/AliCS-dev/banking-app/blob/9c4d0fd6b698003cb085567eb1f3aff3a1bdea32/backend/src/services/Transactions.service.ts' },
      { label: 'Full-size team diagram', href: 'https://github.com/AliCS-dev/banking-app/blob/9c4d0fd6b698003cb085567eb1f3aff3a1bdea32/backend/db/ERD.png' },
    ],
  },
  {
    id: 'mosaic-rag', number: '04', short: 'Mosaic-RAG', domain: 'Applied AI · Microservices',
    summary: 'A retrieval augmented generation prototype with independent retrieval and generation services.',
    status: 'Research prototype',
    caption: 'Architecture diagram derived from the API implementation',
    sections: [
      { title: 'The engineering question', body: 'Retrieval and answer generation solve different problems. Separating them makes it possible to modify how documents are selected while keeping the generation interface stable.' },
      { title: 'Request orchestration', body: 'The API receives a query and calls the retriever first. It extracts the returned documents and sends them, together with the query, to the generator. The API then returns the result. The retriever and generator do not call each other directly.', steps: ['API accepts query', 'Retriever returns documents', 'API forwards query and documents', 'Generator returns answer'] },
      { title: 'Evaluation scope', body: 'The repository includes retrieval evaluation tooling. This case study documents the service boundaries and request flow. It does not assert a benchmark improvement, answer accuracy, or a production deployment.' },
    ],
    sources: [
      { label: 'API implementation', href: 'https://github.com/AliCS-dev/Mosaic-RAG/blob/03e9b4bbf8a28c01bfecd2fc51cf83582d2f13a4/api/main.py' },
      { label: 'Service configuration', href: 'https://github.com/AliCS-dev/Mosaic-RAG/blob/03e9b4bbf8a28c01bfecd2fc51cf83582d2f13a4/docker-compose.yml' },
    ],
  },
];

export const caseStudies = entries.map(entry => ({ ...entry, ...atlasProjects[entry.id] }));
export const caseHref = (id: AtlasProjectId) => `/projects/${id}/`;
