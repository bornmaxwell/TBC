import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadDMSans} from '@remotion/google-fonts/DMSans';

// Headings: Playfair Display. Body / labels / captions: DM Sans.
const playfair = loadPlayfair('normal', {weights: ['400', '700', '800', '900'], subsets: ['latin']});
const playfairItalic = loadPlayfair('italic', {weights: ['700', '900'], subsets: ['latin']});
const dmsans = loadDMSans('normal', {weights: ['400', '500', '700'], subsets: ['latin']});

export const DISPLAY = playfair.fontFamily; // Playfair Display
export const DISPLAY_ITALIC = playfairItalic.fontFamily;
export const BODY = dmsans.fontFamily; // DM Sans

export const waitForFonts = async () => {
  await Promise.all([playfair.waitUntilDone(), playfairItalic.waitUntilDone(), dmsans.waitUntilDone()]);
};
