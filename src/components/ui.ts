import type {CSSProperties} from 'react';
import {interpolate, Easing} from 'remotion';
import {PANEL_BG, PANEL_BORDER} from '../theme';

// Shared panel surface for overlay cards.
export const panelStyle = (radius = 30): CSSProperties => ({
  background: PANEL_BG,
  border: `1px solid ${PANEL_BORDER}`,
  borderRadius: radius,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
});

// Smooth in/out envelope for a cue: fades/slides in, holds, fades out.
export const envelope = (frame: number, dur: number, inF = 14, outF = 12) => {
  const appear = interpolate(frame, [0, inF], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const disappear = interpolate(frame, [dur - outF, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const opacity = Math.min(appear, disappear);
  const rise = interpolate(appear, [0, 1], [26, 0]);
  return {opacity, rise};
};
