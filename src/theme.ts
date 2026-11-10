// Found Profits AI — brand system for video overlays (the "dark area" treatment
// from the brand kit: navy grounds, off-white text, gold accents).
export const C = {
  navy: '#0A1628', // primary dark ground
  panel: '#112240', // secondary panel on dark
  gold: '#C9A84C', // accents, rules, priority indicators
  goldSoft: '#DcC27E', // lighter gold for subtle fills/strokes
  offwhite: '#F6F7F9', // primary text on dark
  muted: '#B4C0D0', // secondary text on dark
} as const;

// Translucent navy so footage reads faintly through panels while text stays legible.
export const PANEL_BG = 'rgba(10,22,40,0.86)';
export const PANEL_BORDER = 'rgba(201,168,76,0.38)';
export const SCRIM =
  'linear-gradient(180deg, rgba(10,22,40,0.78) 0%, rgba(10,22,40,0) 42%, rgba(10,22,40,0) 60%, rgba(10,22,40,0.82) 100%)';

// 9:16 canvas + safe zones (TikTok/Reels/Shorts UI sits bottom + right).
export const VIDEO = {width: 1080, height: 1920, fps: 30} as const;
export const SAFE = {bottom: 340, right: 120, top: 70, side: 64} as const;
