/**
 * THE GUIDE FIGURES
 * =================
 * Right-sized derivatives of the commissioned Nong Plub poses, written by
 * scripts/build-guide-figures.py: each pose cropped to its own alpha box
 * and resized to 300px tall.
 *
 * This map lives in its own module for one reason: it is used by the
 * presenter band AND by the city hero, and a component file that exports
 * a constant alongside a component trips the react-refresh rule. Two
 * consumers, one source of truth.
 */
export interface GuideFigure {
  src: string;
  w: number;
}

export const GUIDE: Record<string, GuideFigure> = {
  urban: { src: "/nong-plub/guide/nong-plub-urban.webp", w: 202 },
  heritage: { src: "/nong-plub/guide/nong-plub-heritage.webp", w: 222 },
  temple: { src: "/nong-plub/guide/nong-plub-temple.webp", w: 188 },
  cafe: { src: "/nong-plub/guide/nong-plub-cafe.webp", w: 253 },
  nature: { src: "/nong-plub/guide/nong-plub-nature.webp", w: 221 },
  welcome: { src: "/nong-plub/guide/nong-plub-welcome.webp", w: 253 },
  explain: { src: "/nong-plub/guide/nong-plub-explain.webp", w: 203 },
  glance: { src: "/nong-plub/guide/nong-plub-glance.webp", w: 232 },
  peace: { src: "/nong-plub/guide/nong-plub-peace.webp", w: 245 },
  colour: { src: "/nong-plub/guide/nong-plub-colour.webp", w: 187 },
  turn: { src: "/nong-plub/guide/nong-plub-turn.webp", w: 165 },
  walk: { src: "/nong-plub/guide/nong-plub-walk.webp", w: 198 },
  ledger: { src: "/nong-plub/guide/nong-plub-ledger.webp", w: 240 },
  portrait: { src: "/nong-plub/guide/nong-plub-portrait.webp", w: 282 },
  point: { src: "/nong-plub/guide/nong-plub-point.webp", w: 227 },
  seat: { src: "/nong-plub/guide/nong-plub-seat.webp", w: 197 },
  plain: { src: "/nong-plub/guide/nong-plub-plain.webp", w: 227 },
};
