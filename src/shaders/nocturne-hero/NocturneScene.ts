/* eslint-disable */
export const NOCTURNE_TITLES: Record<string, string> = {};
export const NOCTURNE_VARIANTS = ["midnight"] as const;
export type NocturneVariant = (typeof NOCTURNE_VARIANTS)[number];
export const buildNocturneDocument = (v: any) => "";