/* ─────────────────────────────────────────────────────────────
   THE ROUTE — edit this file, the world rebuilds itself.

   To add a stop: copy a block, give it a unique `id`, pick an `x`
   position along the line (0–4800; ~160 world-units per screen on
   a laptop), and write the label, title, lines, skills, and the
   one-line `learned`. Links render as buttons at the panel bottom.

   To remove a stop: delete its block. The nav, route dots, and
   "NEXT ▸" display update automatically.

   `x` positions that line up with buildings: ~225 intro board,
   ~590 depot, ~2080 arena, ~2760 lab, ~3675 construction,
   ~4180 arcade, ~4620 terminus gate.
   ───────────────────────────────────────────────────────────── */

export const LINKS = {
  github: "https://github.com/echo2045",
  linkedin: "https://www.linkedin.com/in/nafis-forkan-b24922184",
  email: "", // ← drop your email here; the LAST STOP gains a mail button
};

export const STOPS = [
  {
    id: "origin", x: 225, label: "Start", tag: "origin", title: "Campus Gate",
    lines: ["Started at UBC — BASc Engineering '18–'20, Vancouver.", "Finished at North South University, Dhaka — Computer Science."],
    skills: ["Computer Science", "Engineering", "Two Cities"],
    learned: "Vancouver taught the craft; Dhaka gave it a deadline.",
  },
  {
    id: "depot", x: 590, label: "Depot", tag: "day job", title: "Ghost Interactive",
    lines: ["Game Programmer — Unity titles live at scale.", "Bus Simulator Bangladesh carries 10M+ downloads on the store listing; keeping live games healthy is the job."],
    skills: ["Unity", "C#", "Live Ops"],
    learned: "Live code has ten million critics.",
    links: [["Play Store", "https://play.google.com/store/apps/details?id=com.GhostInteractive.BusSimulatorBangladesh"]],
  },
  {
    id: "intern", x: 940, label: "Intern Alley", tag: "first quests", title: "The Intern Run",
    lines: ["Vidribute — remote Game Developer Intern '23–'24 (Germany): game programming + documentation.", "Spectrum Software — Software Engineer Intern '25, Dhaka: PERN stack, on-site."],
    skills: ["Game Programming", "PERN", "Remote Work"],
    learned: "Every stack teaches a different honesty.",
  },
  {
    id: "dhaka", x: 1420, label: "Endless Dhaka", tag: "main quest", title: "Endless Dhaka",
    lines: ["Complete remake and release of the mobile racing game.", "Contributed to ~1M new downloads."],
    skills: ["Full Remake", "Release Pipeline", "Live Ops"],
    learned: "A remake is trust rebuilt in public — same name, new spine.",
    links: [["Play Store", "https://play.google.com/store/apps/details?id=com.GhostInteractive.EndlessDhaka"]],
  },
  {
    id: "stadium", x: 2080, label: "Esports Arena", tag: "the other career", title: "Esports Ops",
    lines: ["BYDESA — Co-Councillor, League of Legends Bangladesh '22–'24: online + LAN tournaments, sponsors, budgets, logistics.", "Anchored events and hosted player interviews — then trained the next anchors at NSU C&E Club."],
    skills: ["Hosting & Anchoring", "Tournament Ops", "Sponsorships"],
    learned: "A crowd is just a lobby with better lighting.",
  },
  {
    id: "lab", x: 2760, label: "Research Lab", tag: "research quest", title: "Stinger — IEEE",
    lines: ["3D asymmetric multiplayer serious game teaching dengue prevention in rural Bangladesh — published IEEE, Dec 2025.", "Early results: real knowledge retention and behavior adoption."],
    skills: ["Serious Games", "Asymmetric Multiplayer", "Research → Publication"],
    learned: "Games can teach what lectures can't.",
    links: [["Read paper", "https://ieeexplore.ieee.org/document/11313522"]],
  },
  {
    id: "crane", x: 3675, label: "Under Construction", tag: "now building", title: "UE5 Serious Game",
    lines: ["Currently building a 3D asynchronous multiplayer serious game on Unreal Engine 5.", "At the day job: custom traffic systems for Truck Simulator Bangladesh."],
    skills: ["Unreal Engine 5", "Async Multiplayer", "Traffic AI"],
    learned: "Async multiplayer is correspondence chess with packets.",
  },
  {
    id: "arcade", x: 4180, label: "Jam Arcade", tag: "side quests", title: "Side Quests",
    lines: ["Speak & Play — voice-controlled gaming for differently-abled players (NSU, Unity).", "Retsnom.Inc — befriend monsters · Polar Bear Run — BC Game Jam 2020 · Multiplayer Race — Photon PUN."],
    skills: ["HCI / Accessibility", "Photon PUN", "Game Jams"],
    learned: "Weekend builds keep the instinct sharp.",
    links: [["Browse repos", "https://github.com/echo2045?tab=repositories"]],
  },
  {
    id: "terminus", x: 4620, label: "Last Stop", tag: "terminus", title: "Say Hello",
    lines: ["Party slot open — studios, teams, collaborators.", "All lines terminate here."],
    skills: ["Available", "Collaborative", "Dhaka → anywhere"],
    learned: "Every route ends somewhere. This one ends with you.",
    links: [["GitHub", "https://github.com/echo2045"], ["LinkedIn", "https://www.linkedin.com/in/nafis-forkan-b24922184"]],
  },
];
