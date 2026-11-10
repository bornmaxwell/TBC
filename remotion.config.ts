import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// Use the pre-installed Chromium in this cloud environment so a render needs no
// network download. On a local machine this path won't exist and Remotion falls
// back to its own managed browser automatically.
const CLOUD_CHROME = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
if (existsSync(CLOUD_CHROME)) {
  Config.setBrowserExecutable(CLOUD_CHROME);
}
