import type { DoodleKind } from './Doodles';

/** Messy-state placement: center as a fraction of the desk, plus rotation in degrees. */
export interface Messy { x: number; y: number; r: number }

export interface FolderDef { messy: Messy; mobile: boolean; depth: number }
export interface PaperDef { folder: number; slot: 0 | 1; kind: DoodleKind; messy: Messy; depth: number }
export interface NoteDef { messy: Messy; tone: 'cream' | 'navy'; mobile: boolean; depth: number }

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
  { folder: 0, slot: 0, kind: 'bar', messy: { x: 0.34, y: 0.22, r: -24 }, depth: 9 },
  { folder: 0, slot: 1, kind: 'text', messy: { x: 0.09, y: 0.56, r: 14 }, depth: 7 },
  { folder: 1, slot: 0, kind: 'table', messy: { x: 0.56, y: 0.34, r: 8 }, depth: 11 },
  { folder: 1, slot: 1, kind: 'erd', messy: { x: 0.88, y: 0.42, r: -16 }, depth: 8 },
  { folder: 2, slot: 0, kind: 'flow', messy: { x: 0.37, y: 0.47, r: 19 }, depth: 12 },
  { folder: 2, slot: 1, kind: 'line', messy: { x: 0.63, y: 0.56, r: -11 }, depth: 10 },
  { folder: 3, slot: 0, kind: 'pie', messy: { x: 0.71, y: 0.83, r: 6 }, depth: 9 },
  { folder: 3, slot: 1, kind: 'kanban', messy: { x: 0.5, y: 0.85, r: -20 }, depth: 11 },
  { folder: 4, slot: 0, kind: 'funnel', messy: { x: 0.11, y: 0.85, r: -6 }, depth: 7 },
  { folder: 4, slot: 1, kind: 'check', messy: { x: 0.29, y: 0.63, r: 26 }, depth: 10 },
];

export const notes: NoteDef[] = [
  { messy: { x: 0.58, y: 0.14, r: -9 }, tone: 'cream', mobile: true, depth: 12 },
  { messy: { x: 0.2, y: 0.47, r: 12 }, tone: 'navy', mobile: true, depth: 10 },
  { messy: { x: 0.8, y: 0.31, r: -5 }, tone: 'cream', mobile: false, depth: 11 },
  { messy: { x: 0.47, y: 0.73, r: 15 }, tone: 'cream', mobile: true, depth: 12 },
];
