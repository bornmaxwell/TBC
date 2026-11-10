import React from 'react';
import {C} from '../theme';
import {DISPLAY} from '../fonts';

// "Found Profits AI" lockup — off-white + gold Playfair Display (dark-area version).
export const Wordmark: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 46, style}) => {
  return (
    <span
      style={{
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        color: C.offwhite,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      Found Profits <span style={{color: C.gold}}>AI</span>
    </span>
  );
};
