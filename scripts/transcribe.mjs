// Generates word-level captions from your footage's audio using Whisper, and
// writes them to public/captions.json (the format the video reads).
//
//   npm run transcribe                 # transcribes public/footage.mp4
//   WHISPER_MODEL=small.en npm run transcribe
//
// Requires network the first run (downloads whisper.cpp + the model) and a C
// compiler (build-essential / Xcode CLT). Models: tiny.en, base.en, small.en,
// medium.en (default), large-v3. Bigger = more accurate, slower.
import {installWhisperCpp, downloadWhisperModel, transcribe, toCaptions} from '@remotion/install-whisper-cpp';
import {execFileSync} from 'node:child_process';
import {existsSync, writeFileSync, rmSync} from 'node:fs';
import path from 'node:path';
import {findFootage} from './find-footage.mjs';

const ROOT = process.cwd();
const outJson = path.join(ROOT, 'public', 'captions.json');
const whisperDir = path.join(ROOT, '.whisper');
const model = process.env.WHISPER_MODEL || 'medium.en';

// Only honor an explicit path argument if it's a real file; otherwise auto-detect.
// (Guards against stray shell args, e.g. an un-stripped "# comment" in zsh.)
let footage = process.argv[2] && existsSync(process.argv[2]) ? process.argv[2] : null;
if (!footage) {
  const name = findFootage(path.join(ROOT, 'public'));
  if (name) footage = path.join(ROOT, 'public', name);
}

if (!footage || !existsSync(footage)) {
  console.error('No footage found in public/ (drop your clip there — any .mov/.mp4 works).');
  process.exit(1);
}
console.log('Transcribing footage:', path.basename(footage));

const wav = path.join(ROOT, '.tmp-audio.wav');
console.log('1/4  Extracting 16kHz mono audio…');
execFileSync('ffmpeg', ['-y', '-i', footage, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav], {stdio: 'inherit'});

const WHISPER_VERSION = '1.5.5';
console.log('2/4  Ensuring whisper.cpp…');
await installWhisperCpp({to: whisperDir, version: WHISPER_VERSION});

console.log(`3/4  Ensuring model "${model}"…`);
await downloadWhisperModel({folder: whisperDir, model});

console.log('4/4  Transcribing (word-level)…');
const {transcription} = await transcribe({
  inputPath: wav,
  whisperPath: whisperDir,
  whisperCppVersion: WHISPER_VERSION,
  model,
  tokenLevelTimestamps: true,
});

const {captions} = toCaptions({whisperCppOutput: {transcription}});
writeFileSync(outJson, JSON.stringify(captions, null, 2));
rmSync(wav, {force: true});
console.log(`\nWrote ${outJson} — ${captions.length} tokens. Re-run "npm run render".`);
