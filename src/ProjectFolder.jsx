import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { PROJECT_TABS, PROJECTS_BY_TAB } from "./projects.js";

/* ------------------------------------------------------------------ *
 *  Motion presets
 * ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ *
 *  Generated cover art
 *
 *  Project art doesn't exist yet, so cards fall back to a deterministic
 *  holographic gradient derived from the project's hue. When a real
 *  `cover` image lands it layers in instead — no markup change.
 *
 *  `layoutId` is shared between the carousel card and the opened panel so
 *  the artwork physically flies from the card into the full view.
 * ------------------------------------------------------------------ */

function CoverArt({ project, className = "", layoutId }) {
  const { hue } = project;

  if (project.cover) {
    return (
      <motion.div className={`coverArt ${className}`} layoutId={layoutId}>
        <img src={project.cover} alt="" loading="lazy" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`coverArt generated ${className}`}
      layoutId={layoutId}
      style={{
        "--a": `hsl(${hue} 90% 66%)`,
        "--b": `hsl(${hue + 12} 78% 40%)`,
        "--c": `hsl(${hue - 8} 96% 82%)`,
      }}
    >
      <span className="coverGlyph" aria-hidden="true">
        {initials(project.title)}
      </span>
      <span className="coverScan" aria-hidden="true" />
      <span className="coverGlare" aria-hidden="true" />
    </motion.div>
  );
}

function initials(title) {
  return title
    .split(/\s+/)
    .filter((w) => /[a-z0-9]/i.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/* ------------------------------------------------------------------ *
 *  Media
 * ------------------------------------------------------------------ */

function MediaItem({ item }) {
  const aspect = "16 / 9";

  if (item.src) {
    return (
      <figure className="mediaItem">
        {item.type === "video" ? (
          <video src={item.src} controls preload="metadata" playsInline />
        ) : item.type === "embed" ? (
          <iframe
            src={item.src}
            title={item.caption}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img src={item.src} alt={item.caption} loading="lazy" />
        )}
        <figcaption>{item.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="mediaItem">
      <div className="mediaSlot" style={{ aspectRatio: aspect }}>
        <span className="mediaIcon" aria-hidden="true">
          {item.type === "video" ? "▶" : item.type === "embed" ? "⌗" : "▣"}
        </span>
        <span className="mediaType">
          {item.type === "video" ? "Video" : item.type === "embed" ? "Embed" : "Image"}
        </span>
        <span className="mediaCap">{item.caption}</span>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ *
 *  Collapsed card (carousel)
 * ------------------------------------------------------------------ */

function ProjectCard({ project, onOpen, layoutId }) {
  return (
    <motion.article
      className="projectCard"
      layout
      transition={{ layout: { duration: 0.4, ease: EASE } }}
      whileHover={{ y: -4 }}
    >
      <button
        type="button"
        className="cardFace"
        onClick={() => onOpen(project.id)}
        aria-label={`Open ${project.title}`}
      >
        <CoverArt project={project} layoutId={layoutId} />

        <div className="cardMeta">
          <div className="cardTopRow">
            {project.engine ? <span className="pill">{project.engine}</span> : null}
            {project.year ? <span className="pill ghost">{project.year}</span> : null}
          </div>

          <h3 className="cardTitle">{project.title}</h3>
          <div className="cardRole">{project.role}</div>
          <div className="cardTags">{project.tags}</div>

          <span className="cardCue" aria-hidden="true">
            Open File <span>→</span>
          </span>
        </div>
      </button>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ *
 *  Opened project — occupies the whole folder body
 * ------------------------------------------------------------------ */

function ProjectPanel({ project, onClose }) {
  const { detail, links = [] } = project;
  const closeRef = useRef(null);

  // Escape closes; focus moves to the close control so keyboard users land
  // somewhere sensible after a card they were no longer looking at vanishes.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="projectPanel"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.32, ease: EASE }}
    >
      <div className="panelTop">
        <button
          ref={closeRef}
          type="button"
          className="panelBack"
          onClick={onClose}
          aria-label="Back to all projects"
        >
          ← All Projects
        </button>

        <div className="panelIndex" aria-hidden="true">
          {project.engine ? <span className="pill">{project.engine}</span> : null}
          {project.year ? <span className="pill ghost">{project.year}</span> : null}
        </div>
      </div>

      <div className="panelHead">
        <CoverArt project={project} className="panelCover" layoutId={`cover-${project.id}`} />

        <div className="panelIntro">
          <h3 className="panelTitle">{project.title}</h3>
          <div className="panelRole">{project.role}</div>
          <div className="cardTags">{project.tags}</div>
          {detail.intro ? <p className="detailIntro">{detail.intro}</p> : null}
        </div>
      </div>

      {detail.highlights?.length ? (
        <ul className="detailHighlights">
          {detail.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      ) : null}

      {detail.media?.length ? (
        <div className="mediaGrid">
          {detail.media.map((m, i) => (
            <MediaItem key={i} item={m} />
          ))}
        </div>
      ) : null}

      {links.length ? (
        <div className="detailLinks">
          {links.map((l, i) =>
            l.url ? (
              <a key={i} className="linkChip isLive" href={l.url} target="_blank" rel="noreferrer noopener">
                {l.label} ↗
              </a>
            ) : (
              <span key={i} className="linkChip isPending" title="Link coming soon">
                {l.label} · soon
              </span>
            ),
          )}
        </div>
      ) : null}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 *  Carousel — an infinite wheel
 *
 *  There is no scrollbar and no scroll position to jump back to. The track is
 *  translated by CSS and the active project is a virtual index that only
 *  counts up or down. Each card is looked up with a wrapping modulo rather
 *  than by array index, so the visible window is always full however far the
 *  wheel has turned — 05 -> 01 is just another step, not a snap home.
 * ------------------------------------------------------------------ */

const ROTATE_MS = 3800;

function Carousel({ projects, position, onStep, onOpen }) {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [slotW, setSlotW] = useState(330);
  const [step, setStep] = useState(330);
  const [pageW, setPageW] = useState(0);

  const count = projects.length;

  // Real index wrapped into 0..count-1, so dots/counter always read 01..05.
  const index = count ? ((position % count) + count) % count : 0;

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      const slots = el.querySelectorAll(".carouselSlot");
      const first = slots[0];
      if (!first) return;
      // Measure the real centre-to-centre distance (card width + flex gap)
      // instead of assuming it, so cards stay exactly centred.
      const second = slots[1];
      const advance =
        second && first.getBoundingClientRect().width > 0
          ? second.offsetLeft - first.offsetLeft
          : first.getBoundingClientRect().width;
      setSlotW(first.getBoundingClientRect().width || 330);
      setStep(advance || 330);
      setPageW(el.parentElement?.clientWidth || 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current?.parentElement) ro.observe(trackRef.current.parentElement);
    return () => ro.disconnect();
  }, [count]);

  // Only a window of cards around the centre is mounted. Positions are wrapped
// with a true modulo, so the window is always full no matter how far
// `position` has travelled — a burst of clicks in either direction can never
// walk off the end of the array and empty the middle of the wheel.
  const WINDOW = 2;
  const visible = useMemo(() => {
    if (!count) return [];
    const at = (i) => projects[((i % count) + count) % count];
    const out = [];
    for (let o = -WINDOW; o <= WINDOW; o++) {
      const i = position + o;
      const p = at(i);
      out.push({ project: p, offset: o, key: `${p.id}-${i}` });
    }
    return out;
  }, [projects, count, position]);

  // Track offset: keep the active card centred as the window slides.
  const x = pageW ? pageW / 2 - WINDOW * step - slotW / 2 : 0;

  useEffect(() => {
    if (!autoRotate || count < 2 || reduce) return;
    const id = setInterval(() => onStep(1), ROTATE_MS);
    return () => clearInterval(id);
  }, [autoRotate, count, onStep, reduce]);

  const takeControl = (fn) => () => {
    setAutoRotate(false);
    fn();
  };

  return (
    <div className="carousel">
      <div className="carouselViewport">
        <motion.div
          className="carouselTrack"
          ref={trackRef}
          animate={{ x }}
          transition={{ type: "spring", stiffness: 220, damping: 30, mass: 0.9 }}
        >
          {visible.map(({ project, offset, key }) => {
            const isActive = offset === 0;
            return (
              <div
                className={`carouselSlot${isActive ? " isActive" : ""}`}
                data-offset={offset}
                data-id={project.id}
                key={key}
              >
                <ProjectCard
                  project={project}
                  onOpen={() => onOpen(project.id)}
                  /* layoutId must be unique: clones of the same project would
                     collide and break framer-motion's layout animation. */
                  layoutId={isActive ? `cover-${project.id}` : undefined}
                />
              </div>
            );
          })}
        </motion.div>
      </div>

      {count > 1 ? (
        <div className="carouselControls">
          <button
            type="button"
            className="navBtn"
            onClick={takeControl(() => onStep(-1))}
            aria-label="Previous project"
          >
            ←
          </button>

          <div className="dots">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-label={p.title}
                aria-current={i === index}
                className={`dot${i === index ? " isOn" : ""}`}
                onClick={takeControl(() => onStep(i - position))}
              />
            ))}
          </div>

          <span className="counter">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>

          <button
            type="button"
            className="navBtn"
            onClick={takeControl(() => onStep(1))}
            aria-label="Next project"
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Folder
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 *  Simple grid — used for short lists (research, few esports entries)
 *
 *  The wheel needs enough projects to feel like a wheel. With one or two
 *  entries it is just a strip, so those tabs get a plain grid instead.
 * ------------------------------------------------------------------ */

const WHEEL_MIN = 4;

function ProjectGrid({ projects, onOpen }) {
  return (
    <div className="projectGrid">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} onOpen={() => onOpen(p.id)} />
      ))}
    </div>
  );
}

export default function ProjectFolder() {
  const [tab, setTab] = useState(PROJECT_TABS[0].id);
  // `position` is a virtual wheel position that only ever counts up or down,
  // so the carousel never has to scroll "back" to the start. It is wrapped
  // into a real index where it matters (dots, counter, opened project).
  const [positionByTab, setPositionByTab] = useState({});
  const [openByTab, setOpenByTab] = useState({});

  const projects = PROJECTS_BY_TAB[tab];
  const count = projects.length;
  const position = positionByTab[tab] ?? 0;
  const openId = openByTab[tab] ?? null;
  const openProject = openId ? projects.find((p) => p.id === openId) ?? null : null;

  const step = useCallback(
    (delta) => setPositionByTab((prev) => ({ ...prev, [tab]: (prev[tab] ?? 0) + delta })),
    [tab],
  );

  const open = (id) => setOpenByTab((prev) => ({ ...prev, [tab]: id }));
  const close = () => setOpenByTab((prev) => ({ ...prev, [tab]: null }));

  // Switching tabs always returns to the grid, so a project from another
  // category can never appear to stay open.
  const switchTab = (id) => {
    setTab(id);
    setOpenByTab((prev) => ({ ...prev, [id]: null }));
  };

  return (
    <MotionConfig reducedMotion="user">
      <section className="featured">
        <h2>Project Archive</h2>

        <div className="folder">
          {/* Tab strip */}
          <div className="folderTabs" role="tablist" aria-label="Project categories">
            {PROJECT_TABS.map((t) => {
              const isOn = t.id === tab;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`foldertab-${t.id}`}
                  aria-selected={isOn}
                  aria-controls="folderpanel"
                  className={`folderTab${isOn ? " isOn" : ""}`}
                  onClick={() => switchTab(t.id)}
                >
                  <span className="tabGlow" aria-hidden="true" />
                  <span className="tabText">{t.label}</span>
                  <span className="tabCount">{PROJECTS_BY_TAB[t.id].length}</span>
                </button>
              );
            })}
          </div>

          {/* Folder body — grid or opened project, never both */}
          <div
            className="folderBody"
            id="folderpanel"
            role="tabpanel"
            aria-labelledby={`foldertab-${tab}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {openProject ? (
                    <ProjectPanel key={openProject.id} project={openProject} onClose={close} />
                  ) : (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                    >
                      {count >= WHEEL_MIN ? (
                        <Carousel
                          projects={projects}
                          position={position}
                          onStep={step}
                          onOpen={open}
                        />
                      ) : (
                        <ProjectGrid projects={projects} onOpen={open} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
