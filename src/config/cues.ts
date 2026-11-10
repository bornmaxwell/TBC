// Graphic overlay schedule. Times are in SECONDS so they're easy to retime to
// your footage. After you transcribe/preview a clip, nudge start/end to land on
// the right spoken moments. Everything here is data — no code changes needed.

export type Cue =
  | {type: 'hook'; start: number; end: number; pre: string; emphasis: string}
  | {type: 'stopwatch'; start: number; end: number; label: string; sub: string}
  | {type: 'channels'; start: number; end: number}
  | {type: 'caution'; start: number; end: number; text: string}
  | {type: 'cta'; start: number; end: number};

export const CHANNELS: {name: string; windows: [string, string]}[] = [
  {name: 'Text', windows: ['0–5 min', '+1 hr']},
  {name: 'Email', windows: ['Same day', 'Day 2']},
  {name: 'Voicemail', windows: ['15 min', 'Next morning']},
];

// The product offer shown on the end card (from the Day 01 script).
export const OFFER = {
  product: 'Profit Leak Prompts',
  price: '$7',
  where: 'on Etsy',
  desc: '15 copy-and-paste prompts for service businesses',
  cta: 'Link in bio',
  hashtags: ['#leadfollowup', '#hvac', '#chatgptprompts', '#aitools'],
};

// Default cue timings — placeholders tuned to the ~26s Day 01 script. Retime per clip.
export const DEFAULT_CUES: Cue[] = [
  {type: 'hook', start: 0.4, end: 4.0, pre: 'The lead books with whoever', emphasis: 'texts back first.'},
  {type: 'stopwatch', start: 6.5, end: 10.5, label: '5-minute speed-to-lead', sub: 'The first useful reply wins'},
  {type: 'channels', start: 12.0, end: 17.5},
  {type: 'caution', start: 18.5, end: 20.8, text: 'Read it before you send it.'},
  {type: 'cta', start: 21.0, end: 26.5},
];
