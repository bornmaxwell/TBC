import React from 'react';
import {Composition, type CalculateMetadataFunction} from 'remotion';
import {Overlay, type OverlayProps} from './Overlay';
import {VIDEO} from './theme';
import {DEFAULT_CUES} from './config/cues';

const calc: CalculateMetadataFunction<OverlayProps> = ({props}) => {
  const durationInFrames = props.durationInFrames && props.durationInFrames > 0 ? Math.round(props.durationInFrames) : Math.round(26 * VIDEO.fps);
  return {durationInFrames, fps: VIDEO.fps, width: VIDEO.width, height: VIDEO.height};
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Production: drop your clip at public/footage.mp4 and captions at public/captions.json */}
      <Composition
        id="FoundProfitsOverlay"
        component={Overlay}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={Math.round(26 * VIDEO.fps)}
        calculateMetadata={calc}
        defaultProps={{
          footageSrc: 'footage.mp4',
          captionsSrc: 'captions.json',
          cues: DEFAULT_CUES,
          durationInFrames: 0,
        }}
      />

      {/* In-session test: sample clip + sample captions to preview the graphics */}
      <Composition
        id="Sample"
        component={Overlay}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={Math.round(26 * VIDEO.fps)}
        calculateMetadata={calc}
        defaultProps={{
          footageSrc: 'sample-footage.mp4',
          captionsSrc: 'captions.sample.json',
          cues: DEFAULT_CUES,
          durationInFrames: 0,
        }}
      />
    </>
  );
};
