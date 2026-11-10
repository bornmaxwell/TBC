import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SAFE} from '../theme';
import {Wordmark} from './Wordmark';

// Persistent brand lockup, top-left, over a subtle navy chip for legibility.
export const BrandBug: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 20});
  const x = interpolate(enter, [0, 1], [-30, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE.top + 24,
        left: SAFE.side,
        opacity: enter,
        transform: `translateX(${x}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 24px 16px 20px',
        borderRadius: 999,
        background: 'rgba(10,22,40,0.72)',
        border: '1px solid rgba(201,168,76,0.30)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div style={{width: 10, height: 10, borderRadius: 999, background: C.gold, boxShadow: `0 0 14px ${C.gold}`}} />
      <Wordmark size={34} />
    </div>
  );
};
