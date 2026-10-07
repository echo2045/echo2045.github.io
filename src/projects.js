// Project data loader.
//
// Content lives in /project-details — three tab folders, one folder per
// project. Each folder has a project.txt you type into, and any images or
// videos you drop beside it. Nothing in this file needs editing when you add
// or remove a project: the folders are the source of truth.
//
//   project-details/
//     games/bangladesh-bus-simulator/
//       project.txt          ← text + explicit media order
//       gameplay-01.png      ← dropped in, shows up automatically
//
// Vite turns both globs below into build-time constants, so this runs during
// `vite build` and nothing is fetched at runtime.

/* ------------------------------------------------------------------ *
 *  Tab metadata
 *
 *  Labels are editorial, so they stay here. The tab only appears if at
 *  least one project folder exists under it.
 * ------------------------------------------------------------------ */

const TAB_META = [
  { id: "games", folder: "games", label: "Game Development Projects" },
  { id: "research", folder: "Research Projects", label: "Research Projects" },
  { id: "esports", folder: "esports", label: "Esports Events" },
];

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "ogv", "m4v"];

/* ------------------------------------------------------------------ *
 *  Text file parsing
 *
 *  A deliberately small line-based format, so editing it never means
 *  escaping quotes or fixing a broken bracket:
 *
 *    key: value              scalar
 *    intro:                  start of a paragraph
 *    more of the paragraph
 *    responsibilities:       start of a list
 *    - first item
 *    - second item
 *    links:                  start of a labelled list
 *    Play Store: https://...
 *    PDF: https://...
 *
 *  List items may be written either way — "- Label | value" or
 *  "Label: value". Only the section names below start a new section, so a
 *  single-word label like "PDF:" stays an item. "#" starts a comment.
 * ------------------------------------------------------------------ */

// The complete set of section names. Anything else is treated as a list item,
// which is what keeps "IEEEXplore: https://..." from being read as a setting.
// Keys are matched lowercased, so entries here must be lowercase too.
const SCALAR_KEYS = new Set([
  "title", "order", "role", "engine", "year", "hue", "tags", "cover", "coverfit", "summary", "intro",
]);

// "highlights" is an older name for "responsibilities".
const LIST_KEYS = new Set(["responsibilities", "highlights", "links", "media"]);

function parseProjectText(raw) {
  const lines = String(raw).replace(/\r\n?/g, "\n").split("\n");
  const scalars = Object.create(null);
  const lists = Object.create(null);
  let openKey = null;

  for (const line of lines) {
    if (!line.trim() || /^\s*#/.test(line)) {
      openKey = null;
      continue;
    }

    const match = /^([A-Za-z][A-Za-z0-9_-]*):[ \t]*(.*)$/.exec(line);
    const key = match ? match[1].toLowerCase() : null;

    if (key && LIST_KEYS.has(key)) {
      lists[key] = [];
      openKey = key;
      continue;
    }

    if (key && SCALAR_KEYS.has(key)) {
      const value = match[2].trim();
      if (value) {
        scalars[key] = value;
        openKey = null;
      } else {
        // The value continues on the following lines.
        openKey = key;
      }
      continue;
    }

    // Anything else belongs to the open block, whether that block is a list
    // or a paragraph still waiting for its text.
    if (openKey) {
      (lists[openKey] ??= []).push(line.trim());
    }
  }

  // Fold paragraph continuation lines into their scalar.
  for (const key of SCALAR_KEYS) {
    if (!(key in scalars) && lists[key]?.length) {
      scalars[key] = lists[key].join(" ").trim();
    }
  }

  return { scalars, lists };
}

const stripDash = (line) => line.replace(/^[-•*]\s*/, "");

// Splits one list line into fields.
//
//   "Play Store: https://..."        -> [label, url]   (colon form)
//   "- Play Store | https://..."     -> [label, url]   (pipe form)
//   "Trailer: https://... | full"    -> [label, url, full]
//
// A bare URL is returned whole so its own "https:" is never mistaken for a
// separator, and the pipe split comes last so a trailing " | full" survives
// the colon split above it.
// Splits one list line into [label, value, ...extra].
//
//   "Play Store: https://..."      -> [label, url]
//   "- Play Store | https://..."   -> [label, url]
//   "Trailer: https://... | full"  -> [label, url, full]
//
// The label ends at whichever comes first: a pipe, or a colon that is not
// part of a URL scheme. Everything up to there is the label; the next field is
// the value; any remaining pipe-separated fields are extras such as the span.
function splitValue(raw) {
  const line = stripDash(raw);
  if (/^(https?:\/\/|www\.)/i.test(line)) return [line.trim()];

  const pipe = line.indexOf("|");
  const colon = line.indexOf(":");

  // A pipe always separates fields. A colon does too, unless it is the one
  // opening a URL scheme — but only when a pipe did not already claim it.
  let cut = -1;
  if (pipe >= 0 && (colon < 0 || pipe < colon)) {
    cut = pipe;
  } else if (colon > 0) {
    // A label may be any words; only a lone scheme like "https:" at the very
    // start of the line is not a label boundary.
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(line.slice(0, colon + 3))) cut = colon;
  }

  if (cut < 0) return [line.trim()];

  const label = line.slice(0, cut).trim();
  const remainder = line.slice(cut + 1).trim();
  const nextPipe = remainder.indexOf("|");
  const value = nextPipe < 0 ? remainder : remainder.slice(0, nextPipe).trim();
  const extras = nextPipe < 0 ? [] : remainder.slice(nextPipe + 1).split("|").map((p) => p.trim());
  return [label, value, ...extras];
}

const readText = (data, key) => data.scalars[key] ?? "";

// Prose lists keep the whole line — a colon inside an item is not a separator.
const readList = (data, key) => (data.lists[key] ?? []).map(stripDash).filter(Boolean);

// Labelled lists (links) split into label + value.
const readItems = (data, key) => (data.lists[key] ?? []).map(splitValue).filter((p) => p[0]);

const SPAN_KEYS = new Set(["full", "half", "third"]);

// Media lines carry an optional trailing width, written either after a pipe
// in the new form or as the last field in the old one:
//
//   Trailer: https://youtu.be/abc | full
//   - image | gameplay.png | Gameplay Screenshot | full
function readMedia(data, key) {
  return (data.lists[key] ?? [])
    .map(splitValue)
    .map((parts) => {
      const [first, second, third, fourth] = parts;
      const legacy = /^(image|video|youtube|yt|embed)$/i.test(first ?? "");
      // The span, if any, is whichever trailing field names a width.
      const span = [third, fourth].find((p) => SPAN_KEYS.has((p || "").toLowerCase()));
      let caption = legacy ? third : first;
      if (SPAN_KEYS.has((caption || "").toLowerCase())) caption = "";
      return { caption, value: second, span };
    })
    .filter((m) => m.value && m.value.trim());
}

const readNumber = (data, key, fallback) => {
  const n = Number.parseInt(readText(data, key), 10);
  return Number.isFinite(n) ? n : fallback;
};

/* ------------------------------------------------------------------ *
 *  YouTube
 *
 *  Paste whatever form of link you have. watch / youtu.be / shorts / live /
 *  embed / a bare video id all resolve to the same privacy-enhanced embed.
 * ------------------------------------------------------------------ */

const YT_ID = /^[\w-]{11}$/;

// Accepts plain seconds ("90"), 1h2m3s notation ("1h2m3s") and clock
// notation ("1:02:03"), which are the three forms YouTube itself hands out.
function toSeconds(value) {
  if (!value) return null;
  const clock = /^(?:(\d+):)?(\d+):(\d+)$/.exec(value);
  if (clock) {
    const [, h = 0, m, s] = clock;
    return Number(h) * 3600 + Number(m) * 60 + Number(s);
  }
  const digits = /^(\d+)(?:\dh)?$/.exec(value);
  if (digits) return Number(digits[1]);
  const hms = /^(\d+h)?(\d+m)?(\d+s)?$/.exec(value);
  if (hms && value.length > 1) {
    return (
      Number(hms[1]?.slice(0, -1) || 0) * 3600 +
      Number(hms[2]?.slice(0, -1) || 0) * 60 +
      Number(hms[3]?.slice(0, -1) || 0)
    );
  }
  return null;
}

export function youtubeEmbed(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  let id = null;
  let start = null;

  if (YT_ID.test(raw)) {
    id = raw;
  } else {
    let url;
    try {
      url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    } catch {
      return null;
    }
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      id = url.pathname.slice(1);
    } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v");
      } else {
        const m = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/.exec(url.pathname);
        id = m ? m[1] : null;
      }
    }
    if (!id) return null;

    // A start offset can ride on any of the URL forms (?t=, ?start=, #t=).
    if (start === null) {
      const hashTime = /[#&]t=([\dhms:]+)/.exec(url.hash);
      const candidate =
        url.searchParams.get("t") ?? url.searchParams.get("start") ?? hashTime?.[1];
      const secs = toSeconds(candidate);
      if (secs !== null) start = secs;
    }
  }

  if (!YT_ID.test(id)) return null;

  const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
  embed.searchParams.set("rel", "0");
  if (start !== null && start > 0) embed.searchParams.set("start", String(Math.floor(start)));
  return { id, url: embed.toString() };
}

/* ------------------------------------------------------------------ *
 *  Media discovery
 *
 *  Declared entries come first, in the order you wrote them. Files sitting
 *  in the folder that you did not list are appended afterwards, captioned
 *  from their filename — so dropping a screenshot in works with no editing.
 * ------------------------------------------------------------------ */

// These patterns must stay literal. Vite matches `import.meta.glob` against
// the source text rather than evaluating it, so a template literal silently
// resolves to zero files instead of failing loudly.
const rawTexts = import.meta.glob("../project-details/**/project.txt", {
  query: "?raw",
  import: "default",
  eager: true,
});

const assetUrls = import.meta.glob(
  "../project-details/**/*.{webp,avif,jpg,jpeg,png,gif,svg,mp4,webm,mov,ogv,m4v}",
  { query: "?url", import: "default", eager: true },
);

// folder path (e.g. "games/bangladesh-bus-simulator") -> filename -> url
const assetsByFolder = new Map();
for (const [filePath, url] of Object.entries(assetUrls)) {
  const folder = folderOf(filePath);
  if (!assetsByFolder.has(folder)) assetsByFolder.set(folder, new Map());
  assetsByFolder.get(folder).set(fileNameOf(filePath).toLowerCase(), url);
}

function folderOf(filePath) {
  const parts = filePath.split("/").filter(Boolean);
  parts.shift(); // the ".." segment
  parts.shift(); // "project-details"
  parts.pop(); // the filename
  return parts.join("/");
}

function fileNameOf(filePath) {
  return filePath.split("/").pop() ?? "";
}

const extensionOf = (name) => (name.includes(".") ? name.split(".").pop().toLowerCase() : "");
const stemOf = (name) => name.replace(/\.[^.]+$/, "");

const captionFromFile = (name) =>
  stemOf(name)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || name;

/* ------------------------------------------------------------------ *
 *  Build one project
 * ------------------------------------------------------------------ */

function hueFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  // Keep every generated cover in the existing blue family.
  return 180 + (h % 51);
}

function buildProject(folder, data) {
  const id = folder.split("/").pop();
  const assets = assetsByFolder.get(folder) ?? new Map();
  const media = [];
  const claimed = new Set();

  const addLocal = (kind, filename, caption, span) => {
    const key = String(filename || "").trim().toLowerCase();
    if (!key || claimed.has(key)) return false;
    claimed.add(key);
    media.push({ type: kind, src: assets.get(key) ?? null, caption: caption || captionFromFile(key), span });
    return true;
  };

  const isVideoName = (name) => /\.(mp4|webm|mov|ogv|m4v)$/i.test(name);

  // Media entries are "Caption: value" — a YouTube link, a link to a file
  // hosted elsewhere, or a filename sitting in this folder. The older form
  // spelled the type out first and is still accepted, so nothing already
  // written needs rewriting:
  //   - image | gameplay.png | Gameplay Screenshot
  for (const { caption, value, span } of readMedia(data, "media")) {
    const v = value.trim();
    if (YT_ID.test(v)) {
      addEmbed(v, caption, span);
    } else if (/^(https?:\/\/|www\.)/i.test(v)) {
      const yt = youtubeEmbed(v);
      if (yt) {
        media.push({ type: "embed", src: yt.url, youtubeId: yt.id, caption: caption || "YouTube Video", span });
      } else {
        // Any other remote link is used as-is; the extension decides the tag.
        const type = isVideoName(new URL(v, "https://x").pathname) ? "video" : "image";
        media.push({ type, src: v, caption: caption || type, span });
      }
    } else {
      addLocal(isVideoName(v) ? "video" : "image", v, caption, span);
    }
  }

  const coverName = readText(data, "cover").trim().toLowerCase();

  for (const [file, url] of [...assets.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    // The cover already has its own slot, so it is never repeated as media.
    if (claimed.has(file) || file === coverName) continue;
    const ext = extensionOf(file);
    media.push({
      type: VIDEO_EXTENSIONS.includes(ext) ? "video" : "image",
      src: url,
      caption: captionFromFile(file),
    });
    claimed.add(file);
  }

  const links = readItems(data, "links").map(([label, url]) => ({
    label,
    url: url && url.trim() ? url.trim() : null,
  }));

  // "highlights" is accepted as an alias for "responsibilities".
  const responsibilities = [...readList(data, "responsibilities"), ...readList(data, "highlights")];

  return {
    id,
    title: readText(data, "title") || id,
    order: readNumber(data, "order", 999),
    role: readText(data, "role"),
    engine: readText(data, "engine"),
    year: readText(data, "year"),
    tags: readText(data, "tags"),
    hue: readNumber(data, "hue", hueFromId(id)),
    cover: coverName ? assets.get(coverName) ?? null : null,
    // A landscape logo in a portrait card would be cropped at the sides, so
    // `contain` lets it sit whole. Defaults to filling the box.
    coverFit: readText(data, "coverfit").trim().toLowerCase() === "contain" ? "contain" : "cover",
    summary: readText(data, "summary"),
    links,
    detail: {
      intro: readText(data, "intro"),
      highlights: responsibilities,
      media,
    },
  };
}

/* ------------------------------------------------------------------ *
 *  Assemble
 * ------------------------------------------------------------------ */

const byTab = new Map(TAB_META.map((t) => [t.folder, []]));

for (const [filePath, raw] of Object.entries(rawTexts)) {
  const folder = folderOf(filePath);
  const tabFolder = folder.split("/")[0];
  if (!byTab.has(tabFolder)) continue;
  byTab.get(tabFolder).push(buildProject(folder, parseProjectText(raw)));
}

for (const list of byTab.values()) {
  list.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export const PROJECTS_BY_TAB = Object.fromEntries(
  TAB_META.map((t) => [t.id, byTab.get(t.folder) ?? []]),
);

export const PROJECT_TABS = TAB_META.filter((t) => PROJECTS_BY_TAB[t.id].length > 0);
