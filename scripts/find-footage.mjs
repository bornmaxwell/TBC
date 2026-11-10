import {existsSync, readdirSync, statSync} from 'node:fs';
import path from 'node:path';

// Returns the basename of the footage clip inside `dir`, or null.
// Prefers a file literally named footage.<ext>; otherwise picks the largest
// video file in the folder (ignoring the bundled sample). So you can drop any
// clip — IMG_1234.mov, my take.mp4 — into public/ and it just works.
export const findFootage = (dir) => {
  const named = ['footage.mp4', 'footage.mov', 'footage.m4v', 'footage.webm', 'footage.MOV', 'footage.MP4'];
  for (const n of named) {
    if (existsSync(path.join(dir, n))) return n;
  }
  let vids = [];
  try {
    vids = readdirSync(dir).filter((f) => /\.(mov|mp4|m4v|webm)$/i.test(f) && f !== 'sample-footage.mp4');
  } catch {
    return null;
  }
  if (!vids.length) return null;
  vids.sort((a, b) => statSync(path.join(dir, b)).size - statSync(path.join(dir, a)).size);
  return vids[0];
};
