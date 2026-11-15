import type { AtlasDisciplineId, AtlasProjectId } from './atlas';

// These coordinates describe portfolio relationships, not physical locations.
export const sectors = {
  simulation: {
    label: [62, 68],
    code: 'A1',
    boundary: 'M35 51Q131 27 240 47L291 83Q292 128 247 156L174 199 59 184 29 139Z',
    contour: 'M49 64Q138 43 231 59L276 90Q275 122 239 145L170 185 68 172 44 135Z',
    routes: { 'urban-uav': 'M74 108Q112 105 136 123T193 131' },
  },
  retrieval: {
    label: [361, 68],
    code: 'A2',
    boundary: 'M303 82L353 48Q465 22 569 62L593 123 561 178 464 196 361 177 307 133Z',
    contour: 'M318 87L359 61Q467 37 559 73L578 122 550 166 464 183 368 165 322 126Z',
    routes: { 'mosaic-rag': 'M378 107Q443 91 479 137T522 179' },
  },
  backend: {
    label: [330, 268],
    code: 'B2',
    boundary: 'M333 183L402 169 513 172 575 189 593 254 568 330 484 357 379 347 306 320 286 260Z',
    contour: 'M344 197L403 183 511 185 563 201 579 255 557 319 483 343 383 334 318 309 301 263Z',
    routes: {
      'mosaic-rag': 'M358 310Q383 253 444 231T522 179',
      banking: 'M358 310Q411 332 475 302',
      'traffic-monitoring': 'M358 310Q309 269 257 274',
    },
  },
  vision: {
    label: [63, 235],
    code: 'B1',
    boundary: 'M36 211Q100 190 169 212L237 209 282 246 306 319 252 351 144 360 61 341 28 290Z',
    contour: 'M49 222Q102 204 169 225L233 222 270 253 291 315 248 338 145 347 71 329 42 287Z',
    routes: { 'traffic-monitoring': 'M72 275Q128 301 181 284T257 274' },
  },
} as const satisfies Record<AtlasDisciplineId, {
  label: readonly [number, number];
  code: string;
  boundary: string;
  contour: string;
  routes: Partial<Record<AtlasProjectId, string>>;
}>;

export const waypoints = {
  'urban-uav': { x: 193, y: 131, anchor: 'end' },
  'mosaic-rag': { x: 522, y: 179, anchor: 'end' },
  banking: { x: 475, y: 302, anchor: 'start' },
  'traffic-monitoring': { x: 257, y: 274, anchor: 'end' },
} as const satisfies Record<AtlasProjectId, { x: number; y: number; anchor: 'start' | 'end' }>;
