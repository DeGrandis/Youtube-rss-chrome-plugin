// Adds an RSS button next to the subscribe button on video and channel pages. Clicking it
// copies the channel's feed URL. YouTube is a single page app, so the button is put back
// whenever YouTube redraws, and the channel is read at click time rather than at load.

const FEED = 'https://www.youtube.com/feeds/videos.xml?channel_id=';
const CHANNEL_PATH = /^\/(channel\/UC[\w-]{22}|@[^/?#]+)/;

// Where the button goes: under a video, and in a channel's header.
const SPOTS = [
  { page: () => location.pathname === '/watch', after: '#owner #subscribe-button' },
  { page: () => CHANNEL_PATH.test(location.pathname), inside: '#page-header yt-flexible-actions-view-model' },
];

// "/@handle" or "/channel/UC…" for the channel the current page belongs to.
function channelPath() {
  let href = location.pathname;
  if (href === '/watch') {
    const owner = document.querySelector('#owner a[href^="/channel/UC"]')
      ?? document.querySelector('#owner a[href^="/@"]');
    href = owner?.getAttribute('href') ?? '';
  }
  return href.match(CHANNEL_PATH)?.[0] ?? null;
}

// YouTube no longer puts the channel ID on video pages, but each channel page still links
// its own feed. Looked up once per channel, ahead of the click where possible.
const ids = new Map();

function channelId(path) {
  const direct = path.match(/^\/channel\/(UC[\w-]{22})$/);
  if (direct) return Promise.resolve(direct[1]);
  if (!ids.has(path)) {
    const lookup = fetch(path, { credentials: 'omit' })
      .then((response) => response.text())
      .then((html) => {
        const id = html.match(/type="application\/rss\+xml"[^>]*channel_id=(UC[\w-]{22})/)?.[1]
          ?? html.match(/"externalId":"(UC[\w-]{22})"/)?.[1];
        if (!id) throw new Error(`No channel ID found on ${path}`);
        return id;
      });
    lookup.catch(() => ids.delete(path));
    ids.set(path, lookup);
  }
  return ids.get(path);
}

// `url` is shown in a box to copy by hand, only when the clipboard refused it.
function showResult(button, message, url) {
  button.parentElement.querySelector('.yt-rss-result')?.remove();
  const result = document.createElement('div');
  result.className = 'yt-rss-result';
  const text = document.createElement('p');
  text.textContent = message;
  result.append(text);
  if (url) {
    const field = document.createElement('input');
    field.readOnly = true;
    field.value = url;
    field.addEventListener('focus', () => field.select());
    result.append(field);
  }
  button.after(result);
  setTimeout(() => result.remove(), url ? 12000 : 4000);
}

async function copyFeed(button) {
  const path = channelPath();
  if (!path) return showResult(button, 'Could not find this channel.');
  let url;
  try {
    url = FEED + await channelId(path);
  } catch {
    return showResult(button, 'Could not find this channel\'s feed. Try again in a moment.');
  }
  try {
    await navigator.clipboard.writeText(url);
    showResult(button, 'RSS link copied to clipboard');
  } catch {
    showResult(button, 'Copy this RSS link:', url);
  }
}

function createButton() {
  const wrapper = document.createElement('div');
  wrapper.className = 'yt-rss';
  const button = document.createElement('button');
  button.className = 'yt-rss-button';
  button.type = 'button';
  button.textContent = 'RSS';
  button.title = 'Copy this channel\'s RSS feed link';
  button.addEventListener('click', () => copyFeed(button));
  wrapper.append(button);
  return wrapper;
}

function placeButton() {
  for (const spot of SPOTS) {
    if (!spot.page()) continue;
    const anchor = document.querySelector(spot.after ?? spot.inside);
    if (!anchor) continue;
    const parent = spot.after ? anchor.parentElement : anchor;
    if (!parent.querySelector(':scope > .yt-rss')) {
      if (spot.after) anchor.after(createButton());
      else anchor.append(createButton());
    }
    const path = channelPath();
    if (path) channelId(path).catch(() => {});
  }
}

let queued = false;
new MutationObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    placeButton();
  });
}).observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener('yt-navigate-finish', placeButton);
placeButton();
