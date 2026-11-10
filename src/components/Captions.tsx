import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {C, SAFE} from '../theme';
import {BODY} from '../fonts';

type Page = {startMs: number; endMs: number; tokens: {text: string; fromMs: number; toMs: number}[]};

// Chunk word-level captions into short karaoke pages (2–4 words), breaking on a
// pause or the end of a sentence. Keeps captions punchy for mute viewing.
const toPages = (caps: Caption[], maxWords = 4, maxGapMs = 650): Page[] => {
  const pages: Page[] = [];
  let cur: Caption[] = [];
  const flush = () => {
    if (!cur.length) return;
    pages.push({
      startMs: cur[0].startMs,
      endMs: cur[cur.length - 1].endMs,
      tokens: cur.map((t) => ({text: t.text, fromMs: t.startMs, toMs: t.endMs})),
    });
    cur = [];
  };
  for (const c of caps) {
    if (cur.length) {
      const prev = cur[cur.length - 1];
      const gap = c.startMs - prev.endMs;
      const prevEndsSentence = /[.!?]$/.test(prev.text.trim());
      if (cur.length >= maxWords || gap > maxGapMs || prevEndsSentence) flush();
    }
    cur.push(c);
  }
  flush();
  return pages;
};

export const Captions: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [handle] = useState(() => delayRender('load-captions'));

  useEffect(() => {
    let alive = true;
    fetch(staticFile(src))
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Caption[]) => {
        if (alive) setCaptions(Array.isArray(data) ? data : []);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
    return () => {
      alive = false;
    };
  }, [src, handle]);

  if (captions.length === 0) return null;

  const pages = toPages(captions);
  const timeMs = (frame / fps) * 1000;

  let page: Page | null = null;
  for (const p of pages) {
    if (p.startMs <= timeMs) page = p;
    else break;
  }
  if (!page || timeMs > page.endMs + 360) return null;

  return (
    <div style={{position: 'absolute', left: SAFE.side, right: SAFE.side, bottom: SAFE.bottom, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          maxWidth: 860,
          padding: '20px 34px',
          borderRadius: 24,
          background: 'rgba(10,22,40,0.78)',
          border: '1px solid rgba(201,168,76,0.22)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2px 16px',
          textAlign: 'center',
        }}
      >
        {page.tokens.map((t, i) => {
          const active = timeMs >= t.fromMs && timeMs < t.toMs;
          return (
            <span
              key={i}
              style={{
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 62,
                lineHeight: 1.12,
                letterSpacing: '-0.01em',
                color: active ? C.gold : C.offwhite,
                transform: active ? 'translateY(-2px) scale(1.05)' : 'none',
                textShadow: active ? '0 0 22px rgba(201,168,76,0.45)' : '0 2px 10px rgba(0,0,0,0.5)',
                display: 'inline-block',
              }}
            >
              {t.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};
