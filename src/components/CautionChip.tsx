import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {DISPLAY, BODY} from '../fonts';
import {envelope, panelStyle} from './ui';

// "Read it before you send it." — a navy card with a gold rule and mark.
export const CautionChip: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const {opacity, rise} = envelope(frame, durationInFrames, 14, 12);
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 120}, durationInFrames: 22});

  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 420,
          ...panelStyle(28),
          padding: '34px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          opacity,
          transform: `translateY(${rise}px) scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
        }}
      >
        <div style={{width: 72, height: 72, borderRadius: 16, display: 'grid', placeItems: 'center', background: 'rgba(201,168,76,0.14)', border: '1px solid rgba(201,168,76,0.4)'}}>
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 2.5 20h19L12 3Z" />
            <path d="M12 10v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <div>
          <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 22, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 8}}>
            Approve every word
          </div>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, color: C.offwhite, lineHeight: 1.05}}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
