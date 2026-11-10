import React, {useEffect, useState} from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig, continueRender, delayRender} from 'remotion';
import {C, SCRIM} from './theme';
import {DISPLAY, BODY, waitForFonts} from './fonts';
import type {Cue} from './config/cues';
import {BrandBug} from './components/BrandBug';
import {Captions} from './components/Captions';
import {HookBumper} from './components/HookBumper';
import {StopwatchCallout} from './components/StopwatchCallout';
import {ChannelsStrip} from './components/ChannelsStrip';
import {CautionChip} from './components/CautionChip';
import {CTACard} from './components/CTACard';

export type OverlayProps = {
  footageSrc: string | null;
  captionsSrc: string;
  cues: Cue[];
  durationInFrames?: number;
};

const Placeholder: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(130% 90% at 50% 20%, ${C.panel} 0%, ${C.navy} 70%)`, alignItems: 'center', justifyContent: 'center'}}>
    <div style={{textAlign: 'center', opacity: 0.6}}>
      <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, color: C.offwhite}}>Add your footage</div>
      <div style={{fontFamily: BODY, fontSize: 28, color: C.muted, marginTop: 16, letterSpacing: '0.04em'}}>public/footage.mp4</div>
    </div>
  </AbsoluteFill>
);

const renderCue = (c: Cue) => {
  switch (c.type) {
    case 'hook':
      return <HookBumper pre={c.pre} emphasis={c.emphasis} />;
    case 'stopwatch':
      return <StopwatchCallout label={c.label} sub={c.sub} />;
    case 'channels':
      return <ChannelsStrip />;
    case 'caution':
      return <CautionChip text={c.text} />;
    case 'cta':
      return <CTACard />;
    default:
      return null;
  }
};

export const Overlay: React.FC<OverlayProps> = ({footageSrc, captionsSrc, cues}) => {
  const {fps} = useVideoConfig();
  const [fontHandle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    waitForFonts().then(() => continueRender(fontHandle));
  }, [fontHandle]);

  return (
    <AbsoluteFill style={{backgroundColor: C.navy}}>
      {footageSrc ? (
        <OffthreadVideo src={staticFile(footageSrc)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      ) : (
        <Placeholder />
      )}

      {/* Legibility scrim (top for brand bug, bottom for captions) */}
      <AbsoluteFill style={{background: SCRIM, pointerEvents: 'none'}} />

      <BrandBug />

      {cues.map((c, i) => {
        const from = Math.round(c.start * fps);
        const dur = Math.max(1, Math.round((c.end - c.start) * fps));
        return (
          <Sequence key={`${c.type}-${i}`} from={from} durationInFrames={dur} name={c.type} layout="none">
            {renderCue(c)}
          </Sequence>
        );
      })}

      <Captions src={captionsSrc} />
    </AbsoluteFill>
  );
};
