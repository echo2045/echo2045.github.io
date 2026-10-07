# Project content

Everything the Featured Projects folder shows lives here. You never need to
touch code to add a project, change its text, or add media.

```
project-details/
├─ games/
│  ├─ bangladesh-bus-simulator/
│  │  ├─ project.txt      ← your text
│  │  └─ media files      ← anything you drop here shows up
│  ├─ endless-dhaka/
│  ├─ truck-simulator-bangladesh/
│  ├─ purrfect-collars/
│  └─ panic-titanic/
├─ Research Projects/
│  └─ Stinger/
└─ esports/
   ├─ national-qualifiers/
   └─ international-events/
```

The three top-level folders are the tabs on screen — the folder name is the
tab name. One folder inside a tab = one project. **Adding a project is just
making a new folder** — the site picks it up on the next `npm run dev` /
`npm run build`.

You can name folders however you like (`Stinger` reads better than
`ieee-serious-games`); the name only matters in that it must not clash with
another folder in the same tab.

---

## Adding a project

1. Make a folder: `project-details/games/my-new-game/`
2. Copy `project-details/games/purrfect-collars/project.txt` into it.
3. Fill it in. Drop screenshots or videos in beside it.
4. Reload the page.

Use lowercase-with-dashes for the folder name — it becomes the project's
internal id, so `my-new-game` keeps its URL stable forever.

---

## project.txt

A plain text file. One setting per line, `key: value`. Lines starting with `#`
are comments.

### Settings

| Key | What it does |
|---|---|
| `title` | Name shown on the card and the opened project |
| `summary` | One line shown on the card |
| `intro` | Paragraph at the top of the opened project |
| `responsibilities` | Your contribution list (see Lists below) |
| `order` | Position in the tab, lowest number first. Optional. |
| `role` | Your job on the project |
| `engine` | Unity / Research / Esports… |
| `year` | Live / Released / Published… |
| `tags` | Free text, e.g. `Unity • Mobile • Racing` |
| `cover` | Filename of the card art. Optional. |
| `links` | External buttons (see Lists below) |
| `media` | Images, videos and YouTube videos (see Lists below) |

Sections are started by their name. Anything else on a line after a section
name is treated as an item, which is why a link can be labelled `PDF:` without
the file thinking it is a setting.

Everything except `title` and `summary` is optional. Leave a value blank and
that section is simply not rendered.

`cover` is optional — without it the card shows generated artwork in the same
blue family, which looks fine and costs nothing.

### Writing a paragraph

Start `intro:` with nothing after the colon, then type normally. Line breaks
are joined into one paragraph.

```
intro:
A live mobile bus simulator serving 10M+ downloads. Contributions span
optimization, bug fixing and traffic system improvements.
```

### Lists

Write the section name, then one item per line. A leading `-` is optional.

```
responsibilities:
- Update and maintain the live build end to end.
- Content delivery rework using Addressables.
- Traffic system improvements.
```

### Links

Each line is `Button Text: url`. Leave the url empty and it renders as a
greyed-out "coming soon" button.

```
links:
Play Store: https://play.google.com/store/apps/details?id=com.example.game
Website:
```

### Media

Each line is `Caption: value`. The value is a YouTube link, a link to a file
hosted elsewhere, or the filename of a file in this same folder.

```
media:
Gameplay Trailer: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Traffic System Demo: traffic-demo.mp4
Main Menu: gameplay-01.png
```

| value | meaning |
|---|---|
| a YouTube link | embedded, nothing to upload |
| a link ending `.mp4` / `.webm` / `.mov` | played as a video |
| any other link | shown as an image |
| a bare filename | a file sitting in this folder |

Add ` | full` at the end to make an item span the full width, or ` | half` for
two columns. Useful for a trailer so it leads the page.

```
Gameplay Trailer: https://youtu.be/abcdefghijk | full
```

The older form still works, if you prefer it:

```
- youtube | https://youtu.be/abcdefghijk | Gameplay Trailer | full
- image | gameplay-01.png | Main Menu
```

### YouTube

Paste any form of link — all of these work:

```
https://www.youtube.com/watch?v=abcdefghijk
https://youtu.be/abcdefghijk
https://www.youtube.com/shorts/abcdefghijk
https://www.youtube.com/live/abcdefghijk
```

A link with a timestamp (`?t=90`) starts playing at 1:30. Videos load only
after the page opens, and are embedded without cookies.

### Media files don't have to be listed

Anything you drop in the folder shows up even if you never mention it in
`media:`. The caption comes from the filename — `traffic-system-demo.png`
becomes "Traffic System Demo". Use `media:` only when you want a specific
caption or a specific order.

---

## A warning about video file size

You publish with `gh-pages`, which commits `dist/` to git. **Every video you
add stays in the site's history forever**, even if you delete it later — and
slows down every clone and deploy.

- **Under ~5 MB per clip** — fine, drop it straight in.
- **Anything bigger** — put it on YouTube and write `Caption: <link>`.

Same rule for images: keep them under a couple of MB. Large PNGs of game
screenshots are the usual culprit; dropping the resolution to 1600px wide is
usually indistinguishable on screen and many times smaller.

---

## Full example

```
# project-details/games/bangladesh-bus-simulator/project.txt

title: Bangladesh Bus Simulator
order: 1
role: Gameplay Programmer
engine: Unity
year: Live
tags: Unity • Mobile • Live Project • Simulation

summary: Live mobile simulation game with 10M+ downloads.

intro:
A live mobile bus simulator serving 10M+ downloads. Contributions span
optimization, bug fixing, Addressables and traffic system improvements.

responsibilities:
- Update and maintain the live build end to end.
- Content delivery rework using Addressables.
- Traffic system and simulation improvements.

links:
Play Store: https://play.google.com/store/apps/details?id=com.example.game
Source:

media:
Gameplay Trailer: https://www.youtube.com/watch?v=abcdefghijk | full
Main Menu: gameplay-01.png
Traffic System: traffic-system.png
```
