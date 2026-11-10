// Renders the composite video. Computes exact duration from the footage so the
// timeline matches your clip, then calls Remotion.
//
//   npm run render            -> 4K (2160x3840), public/footage.mp4
//   npm run render:1080       -> 1080x1920 proof
//   npm run render:sample     -> 1080 sample clip (no footage needed)
//   SCALE=2 CRF=16 npm run render   -> override quality/scale
//
// The composition is authored at 1080x1920; Remotion's --scale renders it at a
// higher pixel resolution, so a 4K source clip keeps its full detail and the
// vector graphics / captions stay crisp.
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const comp = process.argv[2] || 'FoundProfitsOverlay';
const isSample = comp === 'Sample';

// scale: 1 => 1080x1920, 2 => 2160x3840 (4K vertical). Default 4K for real footage.
const scale = Number(process.env.SCALE || (isSample ? 1 : 2));
const crf = Number(process.env.CRF || 17);

// Auto-detect the footage file (mp4 / mov / m4v / webm) so the filename extension
// doesn't matter — just name it footage.<ext> in public/.
const candidates = isSample ? ['sample-footage.mp4'] : ['footage.mp4', 'footage.mov', 'footage.m4v', 'footage.webm', 'footage.MOV', 'footage.MP4'];
let footageName = null;
for (const c of candidates) {
  if (existsSync(path.join(ROOT, 'public', c))) {
    footageName = c;
    break;
  }
}
const footage = footageName ? path.join(ROOT, 'public', footageName) : null;
const outDir = path.join(ROOT, 'out');
mkdirSync(outDir, {recursive: true});
const resTag = `${1080 * scale}x${1920 * scale}`;
const out = path.join(outDir, isSample ? `sample-${resTag}.mp4` : `found-profits-video-${resTag}.mp4`);

let durationInFrames = 0;
if (footage && existsSync(footage)) {
  try {
    const dur = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', footage])
      .toString()
      .trim();
    const sec = parseFloat(dur);
    if (sec > 0) durationInFrames = Math.round(sec * 30);
  } catch {
    console.warn('ffprobe unavailable — falling back to default duration.');
  }
} else if (!isSample) {
  console.warn('No footage found in public/ (footage.mp4 / footage.mov / …) — rendering placeholder.');
}

const props = JSON.stringify({durationInFrames, ...(footageName ? {footageSrc: footageName} : {})});
const args = ['remotion', 'render', comp, out, `--props=${props}`, `--crf=${crf}`];
if (scale !== 1) args.push(`--scale=${scale}`);

console.log(`Rendering ${comp} @ ${resTag} (crf ${crf}) → ${out}`);
execFileSync('npx', args, {stdio: 'inherit'});
console.log('\nDone:', out);
