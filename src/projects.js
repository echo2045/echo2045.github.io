// Project data model for the Featured Projects folder.
//
// Every entry follows the same shape, so filling a project in is pure data:
//   cover    – image path for the card art   (null = generated monogram art)
//   summary  – one line shown on the card
//   role     – your job on the project
//   links    – [{ label, url }]  (url: null renders as "coming soon")
//   detail   – { intro, highlights[], media[] }
//   detail.media[] – { type: "image" | "video" | "embed", src, caption }
//                    src: null renders a labelled placeholder slot.
//
// `hue` drives the generated cover-art gradient so tabs stay visually distinct
// while staying in the light-blue family.

export const PROJECT_TABS = [
  { id: "games", label: "Game Development Projects" },
  { id: "research", label: "Research Projects" },
  { id: "esports", label: "Esports Events" },
];

export const PROJECTS_BY_TAB = {
  games: [
    {
      id: "bangladesh-bus-simulator",
      title: "Bangladesh Bus Simulator",
      role: "Gameplay Programmer",
      engine: "Unity",
      year: "Live",
      hue: 205,
      cover: null,
      tags: "Unity • Mobile • Live Project • Simulation",
      summary: "Live mobile simulation game with 10M+ downloads.",
      links: [
        { label: "Play Store", url: null },
        { label: "Source", url: null },
      ],
      detail: {
        intro:
          "A live mobile bus simulator serving 10M+ downloads. Contributions span optimization, bug fixing, Addressables, Cloud Content Delivery and traffic system improvements.",
        highlights: [
          "Update and maintain the live build end to end.",
          "Content delivery rework using Addressables.",
          "Traffic system and simulation improvements.",
          "Ongoing optimization and bug fixing.",
        ],
        media: [
          { type: "image", src: null, caption: "Gameplay Screenshot" },
          { type: "video", src: null, caption: "Gameplay Video" },
          { type: "image", src: null, caption: "Traffic System" },
        ],
      },
    },
    {
      id: "endless-dhaka",
      title: "Endless Dhaka",
      role: "Contributor",
      engine: "Unity",
      year: "Released",
      hue: 198,
      cover: null,
      tags: "Unity • Mobile • Racing",
      summary: "Complete remake and release, contributing to ~1M new downloads.",
      links: [{ label: "Play Store", url: null }],
      detail: {
        intro:
          "A complete remake and release of a mobile racing game, contributing to approximately 1M new downloads.",
        highlights: ["Remake and release of the full title."],
        media: [
          { type: "image", src: null, caption: "Racing Gameplay" },
          { type: "video", src: null, caption: "Trailer" },
        ],
      },
    },
    {
      id: "truck-simulator-bangladesh",
      title: "Truck Simulator Bangladesh",
      role: "Game Systems Programmer",
      engine: "Unity",
      year: "Systems",
      hue: 212,
      cover: null,
      tags: "Unity • Mobile • Game Systems",
      summary: "Custom traffic system designed for realistic simulation.",
      links: [{ label: "Play Store", url: null }],
      detail: {
        intro:
          "Designed and programmed a custom traffic system tailored for realistic simulation and player experience.",
        highlights: ["Custom traffic system architecture."],
        media: [{ type: "video", src: null, caption: "Traffic System Demo" }],
      },
    },
    {
      id: "purrfect-collars",
      title: "Purrfect Collars",
      role: "Unity Developer",
      engine: "Unity",
      year: "Live",
      hue: 192,
      cover: null,
      tags: "Unity • Developer • Live Project",
      summary: "Unity development work on a live title.",
      links: [{ label: "Play Store", url: null }],
      detail: {
        intro: "",
        highlights: [],
        media: [{ type: "image", src: null, caption: "Gameplay Screenshot" }],
      },
    },
    {
      id: "panic-titanic",
      title: "Panic Titanic",
      role: "Programming Lead",
      engine: "Unity",
      year: "Live",
      hue: 218,
      cover: null,
      tags: "Unity • Programming Lead • Live Project",
      summary: "Programming lead on Panic Titanic.",
      links: [{ label: "Play Store", url: null }],
      detail: {
        intro: "",
        highlights: [],
        media: [{ type: "video", src: null, caption: "Gameplay Video" }],
      },
    },
  ],

  research: [
    {
      id: "ieee-serious-games",
      title: "IEEE Research Paper on Serious Games",
      role: "Author",
      engine: "Research",
      year: "Published",
      hue: 178,
      cover: null,
      tags: "Research • IEEE • Serious Games",
      summary: "Published IEEE research paper on serious games.",
      links: [{ label: "Paper", url: null }],
      detail: {
        intro:
          "Published IEEE research paper on serious games. Summary, methodology and findings to be added.",
        highlights: [],
        media: [{ type: "image", src: null, caption: "Paper Figure" }],
      },
    },
  ],

  esports: [
    {
      id: "national-qualifiers",
      title: "National Qualifiers",
      role: "Host",
      engine: "Esports",
      year: "Hosted",
      hue: 220,
      cover: null,
      tags: "Esports • Tournament • National",
      summary: "Hosted 2 national qualifiers.",
      links: [],
      detail: { intro: "", highlights: [], media: [] },
    },
    {
      id: "international-events",
      title: "International Event Participation",
      role: "Organiser",
      engine: "Esports",
      year: "National Team",
      hue: 228,
      cover: null,
      tags: "Esports • International • National Team",
      summary: "Organised national team participation in international events.",
      links: [],
      detail: { intro: "", highlights: [], media: [] },
    },
  ],
};
