import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {DISPLAY, BODY} from '../fonts';
import {envelope, panelStyle} from './ui';

const R = 120;
const CIRC = 2 * Math.PI * R;

// A compact navy card with a gold stopwatch ring that depletes from 5:00 and
// resolves to "Found." — reinforcing speed-to-lead.
export const StopwatchCallout: React.FC<{label: string; sub: string}> = ({label, sub}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const {opacity, rise} = envelope(frame, durationInFrames, 16, 12);
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 110}, durationInFrames: 24});

  // deplete the ring + count down after a short hold
  const holdF = 18;
  const runF = 60;
  const p = interpolate(frame, [holdF, holdF + runF], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const remainSec = 300 * (1 - p);
  const mm = Math.floor(remainSec / 60);
  const ss = Math.floor(remainSec % 60);
  const done = p >= 1;
  const readout = done ? 'Booked' : `${mm}:${ss < 10 ? '0' : ''}${ss}`;
  const doneScale = done ? interpolate(spring({frame: frame - (holdF + runF), fps, config: {damping: 12}}), [0, 1], [0.8, 1]) : 1;

  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 340,
          ...panelStyle(34),
          padding: '46px 60px',
          display: 'flex',
          alignItems: 'center',
          gap: 46,
          opacity,
          transform: `translateY(${rise}px) scale(${interpolate(pop, [0, 1], [0.9, 1])})`,
        }}
      >
        <div style={{position: 'relative', width: 300, height: 300, display: 'grid', placeItems: 'center'}}>
          <svg width={300} height={300} viewBox="0 0 300 300" style={{transform: 'rotate(-90deg)'}}>
            <circle cx={150} cy={150} r={R} fill="none" stroke="rgba(180,192,208,0.22)" strokeWidth={16} />
            <circle
              cx={150}
              cy={150}
              r={R}
              fill="none"
              stroke={C.gold}
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * p}
              style={{filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.5))'}}
            />
          </svg>
          <div style={{position: 'absolute', textAlign: 'center', transform: `scale(${doneScale})`}}>
            <div
              style={{
                fontFamily: done ? DISPLAY : BODY,
                fontWeight: done ? 800 : 700,
                fontSize: done ? 68 : 86,
                color: done ? C.gold : C.offwhite,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: done ? '0' : '-0.03em',
              }}
            >
              {readout}
            </div>
            {!done ? (
              <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 20, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.muted, marginTop: 8}}>
                Window
              </div>
            ) : null}
          </div>
        </div>

        <div style={{maxWidth: 360}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, lineHeight: 1.05, color: C.offwhite}}>{label}</div>
          <div style={{width: 72, height: 3, background: C.gold, borderRadius: 999, margin: '20px 0'}} />
          <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: C.muted}}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
