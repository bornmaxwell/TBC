import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, SAFE} from '../theme';
import {DISPLAY, DISPLAY_ITALIC, BODY} from '../fonts';
import {envelope} from './ui';

// Opening hook: elegant Playfair statement in the upper band, gold emphasis + rule.
export const HookBumper: React.FC<{pre: string; emphasis: string}> = ({pre, emphasis}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const {opacity, rise} = envelope(frame, durationInFrames, 16, 12);

  const ruleScale = interpolate(
    spring({frame: frame - 4, fps, config: {damping: 200}, durationInFrames: 26}),
    [0, 1],
    [0, 1]
  );
  const emphShift = interpolate(
    spring({frame: frame - 8, fps, config: {damping: 16, stiffness: 120}}),
    [0, 1],
    [18, 0]
  );
  const emphOpacity = interpolate(frame, [8, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: SAFE.side,
          right: SAFE.side,
          textAlign: 'center',
          opacity,
          transform: `translateY(${rise}px)`,
        }}
      >
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: C.gold,
            marginBottom: 30,
          }}
        >
          Local service businesses
        </div>
        <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 76, lineHeight: 1.08, color: C.offwhite, textShadow: '0 2px 24px rgba(0,0,0,0.55)'}}>
          {pre}
        </div>
        <div
          style={{
            fontFamily: DISPLAY_ITALIC,
            fontStyle: 'italic',
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1.02,
            color: C.gold,
            marginTop: 6,
            opacity: emphOpacity,
            transform: `translateY(${emphShift}px)`,
            textShadow: '0 4px 30px rgba(201,168,76,0.35)',
          }}
        >
          {emphasis}
        </div>
        <div
          style={{
            width: 180,
            height: 4,
            background: C.gold,
            borderRadius: 999,
            margin: '36px auto 0',
            transform: `scaleX(${ruleScale})`,
            boxShadow: `0 0 18px rgba(201,168,76,0.5)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
