import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SAFE} from '../theme';
import {DISPLAY, BODY} from '../fonts';
import {CHANNELS} from '../config/cues';
import {envelope, panelStyle} from './ui';

const Icon: React.FC<{name: string}> = ({name}) => {
  const common = {fill: 'none', stroke: C.gold, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const paths: Record<string, React.ReactNode> = {
    Text: <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 20l1-4.5A8.4 8.4 0 1 1 21 11.5Z" {...common} />,
    Email: (
      <>
        <rect x={3} y={5} width={18} height={14} rx={2.4} {...common} />
        <path d="m4 7 8 6 8-6" {...common} />
      </>
    ),
    Voicemail: <path d="M5 4h3l1.6 4-2 1.4a12 12 0 0 0 5.5 5.5l1.4-2 4 1.6V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" {...common} />,
  };
  return (
    <svg width={44} height={44} viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
};

export const ChannelsStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const {opacity, rise} = envelope(frame, durationInFrames, 16, 12);

  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: SAFE.side,
          right: SAFE.side,
          ...panelStyle(34),
          padding: '44px 44px 48px',
          opacity,
          transform: `translateY(${rise}px)`,
        }}
      >
        <div style={{textAlign: 'center', marginBottom: 10}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 56, lineHeight: 1.04, color: C.offwhite}}>
            One prompt. <span style={{fontStyle: 'italic', color: C.gold}}>Three replies.</span>
          </div>
          <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 24, letterSpacing: '0.04em', color: C.muted, marginTop: 14}}>
            A text, an email, a voicemail — two time windows each
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30}}>
          {CHANNELS.map((ch, i) => {
            const rowIn = spring({frame: frame - 8 - i * 7, fps, config: {damping: 18, stiffness: 120}});
            return (
              <div
                key={ch.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  padding: '22px 26px',
                  borderRadius: 20,
                  background: 'rgba(17,34,64,0.7)',
                  border: '1px solid rgba(201,168,76,0.18)',
                  opacity: rowIn,
                  transform: `translateX(${interpolate(rowIn, [0, 1], [26, 0])}px)`,
                }}
              >
                <div style={{width: 72, height: 72, borderRadius: 16, display: 'grid', placeItems: 'center', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)'}}>
                  <Icon name={ch.name} />
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 38, color: C.offwhite, letterSpacing: '-0.01em'}}>{ch.name}</div>
                  <div style={{display: 'flex', gap: 12, marginTop: 10}}>
                    {ch.windows.map((w, j) => (
                      <span
                        key={j}
                        style={{
                          fontFamily: BODY,
                          fontWeight: 500,
                          fontSize: 24,
                          color: j === 0 ? C.gold : C.muted,
                          background: 'rgba(10,22,40,0.6)',
                          border: `1px solid ${j === 0 ? 'rgba(201,168,76,0.45)' : 'rgba(180,192,208,0.25)'}`,
                          padding: '8px 18px',
                          borderRadius: 999,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{width: 52, height: 52, borderRadius: 999, background: C.gold, display: 'grid', placeItems: 'center', color: C.navy, fontSize: 30, fontWeight: 700, transform: `scale(${rowIn})`}}>
                  ✓
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
