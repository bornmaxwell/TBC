# Found Profits AI — Short-Form Video Overlays

A [Remotion](https://remotion.dev) project that composites your talk-to-camera
footage with on-brand motion graphics and **word-level captions**, then renders a
final 1080×1920 MP4 for TikTok / Reels / Shorts.

Brand system (from the Found Profits AI kit): navy `#0A1628` / `#112240` grounds,
gold `#C9A84C` accents, off-white `#F6F7F9` text, muted `#B4C0D0` secondary,
Playfair Display headings + DM Sans labels/captions.

## What's in the frame

- Your footage as the base layer (`OffthreadVideo`).
- Persistent **Found Profits AI** brand bug.
- Timed overlays: opening hook, 5-minute speed-to-lead stopwatch, three-channel
  reply strip (Text / Email / Voicemail), "read it before you send it" caution,
  and a `$7` end card.
- **Whisper** captions synced word-by-word (the spoken word pops in gold).

## Setup (macOS)

```bash
# Prerequisites (once):
xcode-select --install                 # C compiler, for Whisper
brew install node ffmpeg               # Node 20+, ffmpeg/ffprobe

git clone https://github.com/bornmaxwell/TBC.git
cd TBC && git checkout claude/motion-graphics-video-f2h4cs
npm install
```

## Make a video

```bash
# 1. Put your recorded clip here (vertical 9:16, 4K is fine):
#      public/footage.mp4

# 2. Word-level captions from its audio (first run downloads Whisper + model):
npm run transcribe            # -> public/captions.json
#    options: WHISPER_MODEL=small.en npm run transcribe   (tiny.en…large-v3)

# 3. Preview / retime the overlays live:
npm run studio

# 4. Render:
npm run render                # 4K 2160x3840 -> out/found-profits-video-2160x3840.mp4
npm run render:1080           # 1080x1920 proof (faster)
```

The composition is authored at 1080×1920 and rendered at 2× for 4K, so a 4K
source clip keeps full detail and the graphics/captions stay crisp. Override with
`SCALE=2 CRF=16 npm run render`.

### Try it without footage

```bash
npm run render:sample        # -> out/sample-1080x1920.mp4  (bundled sample clip)
```

## Retiming the graphics

All overlay cue times live in [`src/config/cues.ts`](src/config/cues.ts) as
**seconds** — nudge `start` / `end` to land each graphic on the right spoken
moment, and edit the offer / channel copy there too. No component code needed.
`npm run studio` lets you scrub and adjust live.

## Notes

- Rendering uses Chromium. In this cloud environment it auto-uses the
  pre-installed browser; locally Remotion manages its own.
- `npm run transcribe` needs network on first run (downloads whisper.cpp + model)
  and a C compiler (`build-essential` / Xcode Command Line Tools).
- The HTML sketch `profit-leak-motion-graphics.html` was an early full-screen
  concept; this Remotion project is the production pipeline.
