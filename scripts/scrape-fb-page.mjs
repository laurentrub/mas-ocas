#!/usr/bin/env node
/**
 * Re-scrape Facebook page posts (text + fresh photo URLs) → scripts/fb-scrape.json
 *
 * Usage:
 *   node scripts/scrape-fb-page.mjs
 *   node scripts/scrape-fb-page.mjs --limit 5          # smoke test
 *   node scripts/scrape-fb-page.mjs --headed           # show Chrome (login if needed)
 *   node scripts/scrape-fb-page.mjs --feed-only        # scroll feed, skip per-post visits
 *
 * Page: profile id 61586367090088 (Bms trucksroutier / stock MAS OCS)
 * Requires Google Chrome. Uses puppeteer-core from loisirs-campingcar if present.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_PATH = path.join(__dirname, "fb-scrape.json");
const PAGE_ID = "61586367090088";
const PAGE_URL = `https://www.facebook.com/profile.php?id=${PAGE_ID}`;
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const USER_DATA =
  process.env.FB_CHROME_PROFILE ||
  path.join(ROOT, ".fb-chrome-profile");

const args = new Set(process.argv.slice(2));
const HEADED = args.has("--headed") || args.has("--login");
const FEED_ONLY = args.has("--feed-only");
const limitArg = process.argv.find((a) => a.startsWith("--limit"));
const LIMIT = limitArg
  ? Number(limitArg.includes("=") ? limitArg.split("=")[1] : process.argv[process.argv.indexOf(limitArg) + 1])
  : 0;

async function loadPuppeteer() {
  const require = createRequire(import.meta.url);
  const candidates = [
    path.join(ROOT, "node_modules/puppeteer-core"),
    "/Users/labowork/loisirs-campingcar/node_modules/puppeteer-core",
  ];
  for (const c of candidates) {
    try {
      return require(c);
    } catch {
      /* try next */
    }
  }
  throw new Error(
    "puppeteer-core introuvable. Installez-le (npm i -D puppeteer-core) ou utilisez loisirs-campingcar."
  );
}

function permalink(fbid) {
  return `https://www.facebook.com/permalink.php?story_fbid=${fbid}&id=${PAGE_ID}`;
}

function albumUrl(fbid) {
  return `https://www.facebook.com/media/set/?set=pcb.${fbid}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function dismissBanners(page) {
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button, [role="button"]')];
    for (const b of buttons) {
      const t = (b.innerText || "").toLowerCase();
      if (
        t.includes("allow all") ||
        t.includes("tout accepter") ||
        t.includes("accepter") ||
        t.includes("decline optional") ||
        t.includes("refuser les cookies") ||
        t.includes("autoriser")
      ) {
        try {
          b.click();
        } catch {
          /* ignore */
        }
      }
    }
  });
}

async function expandSeeMore(page) {
  return page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('div[role="button"], span')) {
      const t = (el.innerText || "").trim();
      if (
        t === "See more" ||
        t === "Voir plus" ||
        t === "Afficher la suite" ||
        /^voir plus$/i.test(t)
      ) {
        try {
          el.click();
          n++;
        } catch {
          /* ignore */
        }
      }
    }
    return n;
  });
}

function normalizeImageUrl(src) {
  if (!src || !/^https?:\/\//i.test(src)) return null;
  if (!/fbcdn\.net|facebook\.com/i.test(src)) return null;
  if (/emoji|static\.xx\.fbcdn|rsrc\.php|safe_image/i.test(src)) return null;
  // Prefer full-size variants when present
  return src.replace(/&amp;/g, "&");
}

async function extractImages(page) {
  return page.evaluate(() => {
    const urls = [];
    const seen = new Set();
    const push = (u) => {
      if (!u || seen.has(u)) return;
      seen.add(u);
      urls.push(u);
    };
    for (const img of document.querySelectorAll("img")) {
      const src = img.currentSrc || img.src || img.getAttribute("src");
      if (src) push(src);
      const srcset = img.getAttribute("srcset");
      if (srcset) {
        for (const part of srcset.split(",")) {
          const u = part.trim().split(/\s+/)[0];
          if (u) push(u);
        }
      }
    }
    // background images sometimes used for photos
    for (const el of document.querySelectorAll("[style*='background']")) {
      const m = String(el.getAttribute("style") || "").match(
        /url\(["']?(https[^"')]+)["']?\)/
      );
      if (m?.[1]) push(m[1]);
    }
    return urls;
  });
}

async function extractCaption(page) {
  return page.evaluate(() => {
    const texts = [];
    for (const sel of [
      '[data-ad-preview="message"]',
      '[data-testid="post_message"]',
      'div[data-ad-comet-preview="message"]',
    ]) {
      for (const el of document.querySelectorAll(sel)) {
        const t = (el.innerText || "").trim();
        if (t.length > 40) texts.push(t);
      }
    }
    if (!texts.length) {
      for (const el of document.querySelectorAll('div[dir="auto"]')) {
        const t = (el.innerText || "").trim();
        if (
          t.length > 80 &&
          t.length < 25000 &&
          /(€|euros?|km|PRIX|Prix|BlueHDi|Diesel|Automatique)/i.test(t)
        ) {
          texts.push(t);
        }
      }
    }
    texts.sort((a, b) => b.length - a.length);
    return texts[0] || "";
  });
}

async function collectFeedPostIds(page, maxScrolls = 40) {
  const ids = new Set();
  for (let i = 0; i < maxScrolls; i++) {
    const found = await page.evaluate(() => {
      const out = [];
      const html = document.documentElement.innerHTML;
      const re =
        /(?:story_fbid=|posts\/|multi_permalinks=|pfbid)([A-Za-z0-9_-]+)|"post_id":"(\d+)"|"story_fbid":\{"result":true,"value":"?(\d+)/g;
      let m;
      while ((m = re.exec(html))) {
        const id = m[1] || m[2] || m[3];
        if (id && /^\d{10,}$/.test(id)) out.push(id);
      }
      // anchors
      for (const a of document.querySelectorAll("a[href]")) {
        const href = a.getAttribute("href") || "";
        const m2 = href.match(/story_fbid=(\d+)/) || href.match(/\/posts\/(\d+)/);
        if (m2?.[1]) out.push(m2[1]);
        const m3 = href.match(/pfbid[A-Za-z0-9]+/);
        if (m3?.[0]) out.push(m3[0]);
      }
      return out;
    });
    for (const id of found) ids.add(id);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.4));
    await sleep(1200 + Math.floor(Math.random() * 800));
    if (ids.size >= 120) break;
  }
  return [...ids];
}

async function scrapeOnePost(page, fbid) {
  const urlsToTry = [permalink(fbid), albumUrl(fbid)];
  let text = "";
  let images = [];

  for (const url of urlsToTry) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await sleep(2800);
      await dismissBanners(page);
      await sleep(600);
      await expandSeeMore(page);
      await sleep(900);
      await expandSeeMore(page);
      await sleep(500);

      const cap = await extractCaption(page);
      if (cap.length > text.length) text = cap;

      const raw = await extractImages(page);
      const cleaned = raw
        .map(normalizeImageUrl)
        .filter(Boolean)
        .filter((u) => /scontent|fbcdn/i.test(u));
      // Prefer larger images (often contain t39.30808)
      const ranked = [...new Set(cleaned)].sort((a, b) => b.length - a.length);
      if (ranked.length > images.length) images = ranked.slice(0, 12);
      if (text.length > 80 && images.length >= 1) break;
    } catch (err) {
      console.warn("  visit fail", url, err.message || err);
    }
  }

  return { id: String(fbid), text, images };
}

function loadExistingIds() {
  try {
    const raw = JSON.parse(fs.readFileSync(OUT_PATH, "utf8"));
    const posts = Array.isArray(raw) ? raw : raw.posts || [];
    return posts.map((p) => String(p.id || p.post_id || "")).filter(Boolean);
  } catch {
    return [];
  }
}

async function main() {
  if (!fs.existsSync(CHROME)) {
    console.error("Chrome introuvable:", CHROME);
    process.exit(1);
  }

  const puppeteer = await loadPuppeteer();
  fs.mkdirSync(USER_DATA, { recursive: true });

  console.log("Launching Chrome…", HEADED ? "(headed)" : "(headless)");
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: HEADED ? false : true,
    userDataDir: USER_DATA,
    defaultViewport: { width: 1280, height: 900 },
    args: [
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--lang=fr-FR,fr",
    ],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
  );

  try {
    console.log("Open page", PAGE_URL);
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded", timeout: 90000 });
    await sleep(4000);
    await dismissBanners(page);

    if (HEADED) {
      console.log(
        "\n→ Si Facebook demande une connexion, connecte-toi dans la fenêtre Chrome.\n  Puis appuie Entrée ici pour continuer.\n"
      );
      await new Promise((resolve) => {
        process.stdin.resume();
        process.stdin.once("data", resolve);
      });
    }

    // Detect login wall
    const title = await page.title();
    console.log("Title:", title);
    if (/log in|connexion|se connecter/i.test(title)) {
      console.warn(
        "Possible login wall. Relance avec --headed et connecte-toi."
      );
    }

    let ids = loadExistingIds();
    console.log("IDs from previous scrape:", ids.length);

    if (!FEED_ONLY) {
      console.log("Collecting post ids from feed…");
      await page.goto(`${PAGE_URL}`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await sleep(3000);
      await dismissBanners(page);
      const feedIds = await collectFeedPostIds(page, 45);
      console.log("Feed ids found:", feedIds.length);
      const merged = new Set([...ids, ...feedIds.filter((id) => /^\d{10,}$/.test(id))]);
      ids = [...merged];
    }

    // Keep numeric story fbiids only for permalink visits
    ids = ids.filter((id) => /^\d{10,}$/.test(id));
    if (!ids.length) {
      console.error("Aucun post id trouvé. Relance avec --headed après login.");
      process.exit(1);
    }

    if (LIMIT > 0) ids = ids.slice(0, LIMIT);
    console.log(`Scraping ${ids.length} posts…`);

    const posts = [];
    const partialPath = OUT_PATH.replace(/\.json$/, ".partial.json");

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      process.stdout.write(`[${i + 1}/${ids.length}] ${id} `);
      const post = await scrapeOnePost(page, id);
      console.log(
        `text=${post.text.length} imgs=${post.images.length}`
      );
      if (post.text.length >= 20 || post.images.length) {
        posts.push(post);
      }
      // Checkpoint so a kill doesn't lose progress
      fs.writeFileSync(partialPath, JSON.stringify(posts, null, 2) + "\n");
      await sleep(900 + Math.floor(Math.random() * 700));
    }

    fs.writeFileSync(OUT_PATH, JSON.stringify(posts, null, 2) + "\n");
    try {
      fs.unlinkSync(partialPath);
    } catch {
      /* ignore */
    }
    console.log(`\nWrote ${posts.length} posts → ${OUT_PATH}`);

    const withImgs = posts.filter((p) => p.images.length > 0).length;
    console.log(`With images: ${withImgs}/${posts.length}`);
  } finally {
    await browser.close();
  }
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}