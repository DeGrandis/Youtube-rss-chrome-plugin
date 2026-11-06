// Loads the extension into Chromium and checks the RSS button on live YouTube pages.
// Needs no YouTube account. Run with: npm install && npm run check
//   node check.mjs --ext <dir>      check another copy of the extension
import { chromium } from 'playwright';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const flag = process.argv.indexOf('--ext');
const ext = resolve(flag === -1 ? join(here, '..', 'plugin') : process.argv[flag + 1]);
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const feed = (id) => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;

let failed = 0;
function check(name, ok, detail = '') {
  if (!ok) failed += 1;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${name}${ok ? '' : `  ${detail}`}`);
}

const profile = mkdtempSync(join(tmpdir(), 'yt-rss-'));
const context = await chromium.launchPersistentContext(profile, {
  channel: 'chromium',
  headless: true,
  locale: 'en-US',
  viewport: { width: 1366, height: 900 },
  args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
});
await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'https://www.youtube.com' });

async function clickAndRead(page, scope) {
  await page.evaluate(() => navigator.clipboard.writeText('empty'));
  await page.locator(`${scope} .yt-rss-button`).first().click();
  await page.waitForSelector(`${scope} .yt-rss-result`, { timeout: 15000 });
  return {
    clipboard: await page.evaluate(() => navigator.clipboard.readText()),
    message: await page.locator(`${scope} .yt-rss-result p`).first().textContent(),
  };
}

try {
  const page = await context.newPage();

  // A channel whose video page only links its @handle.
  await page.goto('https://www.youtube.com/watch?v=jNQXAC9IVRw', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#owner .yt-rss-button', { timeout: 20000 });
  check('button appears under a video', await page.locator('#owner .yt-rss-button').count() === 1);
  const box = await page.locator('#owner .yt-rss-button').boundingBox();
  const row = await page.locator('#owner').boundingBox();
  check('button is not cut off (#12)',
    box.width > 40 && box.height >= 30 && box.x + box.width <= row.x + row.width + 1, JSON.stringify({ box, row }));
  let copied = await clickAndRead(page, '#owner');
  check('copies the feed for a channel linked by @handle (#9)',
    copied.clipboard === feed('UC4QobU6STFB0P71PMvOGN5A'), copied.clipboard);
  check('says it was copied', copied.message.includes('copied'), copied.message);
  check('explains that YouTube\'s feed server is unreliable',
    (await page.locator('#owner .yt-rss-note').textContent()).includes('try adding it again'));
  const top = await page.locator('#above-the-fold #top-row').boundingBox();
  await page.screenshot({ path: join(out, 'watch.png'), clip: { x: top.x, y: top.y - 10, width: top.width, height: 160 } });

  // Moving to another video inside YouTube, without a page load.
  await page.evaluate(() => document.querySelector('ytd-app').dispatchEvent(new CustomEvent('yt-navigate', {
    bubbles: true,
    composed: true,
    detail: { endpoint: {
      commandMetadata: { webCommandMetadata: { url: '/watch?v=dQw4w9WgXcQ', webPageType: 'WEB_PAGE_TYPE_WATCH', rootVe: 3832 } },
      watchEndpoint: { videoId: 'dQw4w9WgXcQ' },
    } },
  })));
  // YouTube's Trusted Types policy blocks waitForFunction, so poll instead.
  for (let i = 0; i < 40; i += 1) {
    if (await page.locator('#owner a[href^="/@RickAstley"]').count()) break;
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(1500);
  check('one button after moving to another video', await page.locator('#owner .yt-rss-button').count() === 1,
    String(await page.locator('#owner .yt-rss-button').count()));
  copied = await clickAndRead(page, '#owner');
  check('copies the new channel after moving to another video',
    copied.clipboard === feed('UCuAXFkgsw1L7xaCfnd5JJOw'), copied.clipboard);

  // A channel's own page (#4).
  await page.goto('https://www.youtube.com/@MKBHD', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#page-header .yt-rss-button', { timeout: 20000 });
  copied = await clickAndRead(page, '#page-header');
  check('copies the feed from a channel page (#4)',
    copied.clipboard === feed('UCBJycsmduvYEL83R_U4JriQ'), copied.clipboard);
  await page.screenshot({ path: join(out, 'channel.png'), clip: { x: 0, y: 0, width: 1366, height: 500 } });
} finally {
  await context.close();
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
}

console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
