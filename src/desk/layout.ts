import type { DoodleKind } from './Doodles';

/** Messy-state placement: center as a fraction of the desk, plus rotation in degrees. */
export interface Messy { x: number; y: number; r: number }

export interface FolderDef { messy: Messy; mobile: boolean; depth: number }
export interface PaperDef { folder: number; slot: 0 | 1; kind: DoodleKind; messy: Messy; depth: number }

/** Index of the folder that opens into the toolkit (section 2). */
export const TOOLKIT_FOLDER = 2;

export const folders: FolderDef[] = [
  { messy: { x: 0.17, y: 0.33, r: -18 }, mobile: false, depth: 5 },
  { messy: { x: 0.7, y: 0.25, r: 12 }, mobile: true, depth: 4 },
  { messy: { x: 0.46, y: 0.6, r: -7 }, mobile: true, depth: 6 },
  { messy: { x: 0.83, y: 0.67, r: 21 }, mobile: true, depth: 5 },
  { messy: { x: 0.25, y: 0.8, r: 9 }, mobile: false, depth: 4 },
];

export const papers: PaperDef[] = [
  { folder: 0, slot: 0, kind: 'brd', messy: { x: 0.34, y: 0.22, r: -24 }, depth: 9 },
  { folder: 0, slot: 1, kind: 'matrix', messy: { x: 0.09, y: 0.56, r: 14 }, depth: 7 },
  { folder: 1, slot: 0, kind: 'table', messy: { x: 0.56, y: 0.34, r: 8 }, depth: 11 },
  { folder: 1, slot: 1, kind: 'sql', messy: { x: 0.88, y: 0.42, r: -16 }, depth: 8 },
  { folder: 2, slot: 0, kind: 'erd', messy: { x: 0.37, y: 0.47, r: 19 }, depth: 12 },
  { folder: 2, slot: 1, kind: 'process', messy: { x: 0.63, y: 0.56, r: -11 }, depth: 10 },
  { folder: 3, slot: 0, kind: 'dashboard', messy: { x: 0.71, y: 0.83, r: 6 }, depth: 9 },
  { folder: 3, slot: 1, kind: 'trend', messy: { x: 0.5, y: 0.85, r: -20 }, depth: 11 },
  { folder: 4, slot: 0, kind: 'stakeholder', messy: { x: 0.11, y: 0.85, r: -6 }, depth: 7 },
  { folder: 4, slot: 1, kind: 'audit', messy: { x: 0.29, y: 0.63, r: 26 }, depth: 10 },
];
