// Renders the composite video. Computes exact duration from the footage so the
// timeline matches your clip, then calls Remotion. Usage:
//   node scripts/render.mjs FoundProfitsOverlay   (uses public/footage.mp4)
//   node scripts/render.mjs Sample                (uses public/sample-footage.mp4)
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const comp = process.argv[2] || 'FoundProfitsOverlay';
const isSample = comp === 'Sample';

const footage = path.join(ROOT, 'public', isSample ? 'sample-footage.mp4' : 'footage.mp4');
const outDir = path.join(ROOT, 'out');
mkdirSync(outDir, {recursive: true});
const out = path.join(outDir, isSample ? 'sample.mp4' : 'found-profits-video.mp4');

let durationInFrames = 0;
if (existsSync(footage)) {
  try {
    const dur = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', footage])
      .toString()
      .trim();
    const sec = parseFloat(dur);
    if (sec > 0) durationInFrames = Math.round(sec * 30);
  } catch {
    console.warn('ffprobe unavailable — falling back to default duration.');
  }
} else {
  console.warn(`No footage at ${footage} — rendering with the placeholder background.`);
}

const props = JSON.stringify({durationInFrames});
console.log(`Rendering ${comp} → ${out}  (duration ${durationInFrames || 'default'} frames)`);
execFileSync('npx', ['remotion', 'render', comp, out, `--props=${props}`], {stdio: 'inherit'});
console.log('Done:', out);
