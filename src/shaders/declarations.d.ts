/* eslint-disable */
declare module "*.html?raw" {
  const content: string;
  export default content;
}

declare module "../tidecrest-hero/tidecrestDocument.js" {
  export const buildTidecrestDocument: ((variant: any) => string) | undefined;
}

declare module "../meridian-landing-page/meridianDocument.js" {
  export const buildMeridianDocument: ((variant: any, presentation?: any) => string) | undefined;
}

declare module "../ascii-field/asciiFieldDocuments.js" {
  export const buildAsciiFieldDocument: ((variant: any) => string) | undefined;
}

declare module "../betawise-globe/betawiseGlobeDocument.js" {
  export const buildBetawiseGlobeDocument: ((variant: any) => string) | undefined;
}

declare module "../nocturne-hero/NocturneScene" {
  export const NOCTURNE_TITLES: Record<string, string>;
  export const NOCTURNE_VARIANTS: readonly string[];
  export const buildNocturneDocument: (variant: any) => string;
  export type NocturneVariant = string;
}

declare module "./sandboxedPageDocument" {
  export function buildSandboxedPageDocument(source: string, options?: any): string;
}

declare module "../sylva-living-world/SylvaLivingWorldScene" {
  export const MAPLE_AUTUMN_STYLE: string;
  export const SAKURA_SUNSET_STYLE: string;
  export const SEQUOIA_MIST_STYLE: string;
  export function applyMapleAutumnVariant(source: string): string;
  export function applySakuraSunsetVariant(source: string): string;
  export function applySequoiaMistVariant(source: string): string;
}
