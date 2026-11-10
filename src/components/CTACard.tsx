import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SAFE} from '../theme';
import {DISPLAY, BODY} from '../fonts';
import {OFFER} from '../config/cues';
import {envelope} from './ui';
import {Wordmark} from './Wordmark';

// End card: darken footage, bring up the Found Profits AI lockup + the offer.
export const CTACard: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const {opacity} = envelope(frame, durationInFrames, 18, 10);
  const scrim = interpolate(frame, [0, 18], [0, 0.9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const pricePop = spring({frame: frame - 8, fps, config: {damping: 13, stiffness: 110}});
  const pillBreathe = 1 + 0.03 * Math.sin((frame / fps) * 3.2);
  const ruleScale = interpolate(spring({frame: frame - 4, fps, config: {damping: 200}, durationInFrames: 24}), [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <AbsoluteFill style={{background: C.navy, opacity: scrim}} />
      <div
        style={{
          position: 'relative',
          width: 1080 - SAFE.side * 2,
          textAlign: 'center',
          opacity,
          paddingBottom: SAFE.bottom - 120,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 20}}>
          <Wordmark size={56} />
        </div>
        <div style={{width: 160, height: 3, background: C.gold, borderRadius: 999, margin: '0 auto 48px', transform: `scaleX(${ruleScale})`}} />

        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 220,
            lineHeight: 0.9,
            color: C.gold,
            letterSpacing: '-0.04em',
            transform: `scale(${interpolate(pricePop, [0, 1], [0.7, 1])})`,
            textShadow: '0 6px 50px rgba(201,168,76,0.3)',
          }}
        >
          {OFFER.price}
        </div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.offwhite, marginTop: 10}}>
          {OFFER.product} <span style={{color: C.muted}}>· {OFFER.where}</span>
        </div>
        <div style={{fontFamily: DISPLAY, fontStyle: 'italic', fontWeight: 700, fontSize: 42, color: C.offwhite, margin: '40px auto 44px', maxWidth: 760, lineHeight: 1.2}}>
          {OFFER.desc}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 18,
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 40,
            color: C.navy,
            background: C.gold,
            padding: '24px 52px',
            borderRadius: 999,
            transform: `scale(${pillBreathe})`,
            boxShadow: '0 0 50px rgba(201,168,76,0.4)',
          }}
        >
          <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
          {OFFER.cta}
        </div>

        <div style={{display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginTop: 46}}>
          {OFFER.hashtags.map((h) => (
            <span key={h} style={{fontFamily: BODY, fontWeight: 500, fontSize: 24, color: C.muted}}>
              {h}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
