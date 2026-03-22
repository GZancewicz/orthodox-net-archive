# orthodox.net Archive

Complete filesystem-level archive of the orthodox.net legacy website, hosted on a LAMP stack at Inoa/Orthodox Internet Services (inoatech.com).

## Why this archive exists

The orthodox.net website for St. Nicholas Orthodox Church (McKinney, TX) has been running since the mid-1990s. A modernized version (onet-v2) is progressively replacing legacy pages, but thousands of original pages — sermons, articles, scripture readings, catechism materials, saints' lives, music, and more — still exist only on the Inoa server. This archive preserves that content in Git before it's potentially lost.

## What's on the server

The legacy site lives in `/home/nicholas/public_html` on `hikina.inoatech.com`. Based on the GitHub mirror at [orthodox-net-2023](https://github.com/GZancewicz/orthodox-net-2023) (21,499 files), the site contains content organized into sections including:

- **sermons/** — Gospel and Epistle homilies, other sermons (HTML, DOC, PDF, MP3)
- **articles/** — Religious articles
- **scripture/** — Daily readings and reflections
- **catechism/** — Catechesis talks and essays
- **questions/** — Orthodoxy Q&A
- **greatlent/**, **pascha/**, **nativity/**, **theophany/** — Seasonal content
- **confess/** — Confession-related materials
- **fathers/** — Patristic texts (including Exact Exposition of the Orthodox Faith)
- **gleanings/** — 5700+ texts from the Holy Fathers
- **saints/**, **western-saints/** — Lives of saints
- **monastic-stories/** — Monastic stories
- **ustav/** — Typicon information
- **services/**, **trebnic/** — Liturgical services and prayers
- **music/** — Church music
- **menaion-thoughts/** — Meditations on the saints
- **poetry/** — Poetry
- **journal/** — Journal entries
- And more

Media files (MP3, WAV, WMA) are served via a CDN at `media.orthodox.net` per the Apache configuration, so they may or may not be present in `public_html`.

## Related repositories

- [onet-v2](https://github.com/GZancewicz/onet-v2) — The modernized website (new pages progressively replacing legacy)
- [onet-flask-backend](https://github.com/GZancewicz/onet-flask-backend) — Flask API backend aggregating content from Ghost CMS, YouTube, Google Calendar
- [orthodox-net-2023](https://github.com/GZancewicz/orthodox-net-2023) — Earlier snapshot of legacy content (21,499 files, may be incomplete or outdated)

## Archive plan

### Approach: SSH + rsync

Download the entire `public_html` directory from the Inoa server via rsync over SSH. This preserves the exact filesystem structure and can be re-run incrementally.

### Step 1 — Run inventory (not yet completed)

```bash
cd scripts
./inventory.sh
```

This SSHs into the server and produces a report of directory sizes, file counts by extension, and files over 100MB. The report determines how to split the archive across repos.

### Step 2 — Plan the repo split

Based on inventory results, the archive will likely be split:

| Repo | Content |
|------|---------|
| `orthodox-net-archive` (this repo) | HTML, CSS, JS, images, PDFs, documents |
| `orthodox-net-archive-audio` (new repo) | MP3 and WAV sermon recordings (if present on server) |

### Step 3 — Download

```bash
cd scripts
./download.sh            # HTML, images, PDFs, docs (no audio/video)
./download.sh --all      # Everything
./download.sh --audio-only  # Audio files only (for separate repo)
./download.sh --dry-run  # Preview what would transfer
```

### Step 4 — Commit and push

Review downloaded content, set up Git LFS for any files over 100MB, and commit.

## Current status (2026-03-22)

### Completed
- Created archive scripts (`inventory.sh`, `download.sh`, `config.env`)
- Generated SSH key pair on the Inoa server via cPanel
- Downloaded private key to local machine (`~/.ssh/id_rsa_orthodox`)
- Authorized public key on the server
- Added key to local SSH agent
- Identified server details: `hikina.inoatech.com`, user `nicholas`

### Blocked
- **Server is currently down.** The Inoa server (`hikina.inoatech.com`) became unreachable during setup on 2026-03-22. Both the website (www.orthodox.net) and SSH are unresponsive. This is a server-side outage unrelated to any actions taken here.
- Contact Inoa support to report the outage.

### When the server is back up
1. Verify SSH connectivity: `ssh -i ~/.ssh/id_rsa_orthodox nicholas@hikina.inoatech.com "whoami"`
   - If port 22 doesn't work, check cPanel for the correct SSH port and update `scripts/config.env`
2. Run the inventory: `./scripts/inventory.sh`
3. Review the inventory report and decide on repo split
4. Run the download: `./scripts/download.sh`
5. Commit and push the archived content

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/inventory.sh` | SSH into server, report content sizes and file counts |
| `scripts/download.sh` | rsync-based download with mode flags |
| `scripts/config.env.example` | Template for SSH connection details |
| `scripts/config.env` | Actual credentials (gitignored, never committed) |

## ONET v3 — Google Sites Blueprint

The next generation of orthodox.net will be a Google Site that parish members can edit without developer assistance. The legacy content archive (this repo) will be linked from the new site.

### Site map

```
St Nicholas Orthodox Church (Home)
├── About Us
│   ├── Our Parish
│   ├── Clergy & Staff
│   ├── Directions & Map
│   ├── Contact
│   └── Testimony
├── Services & Schedule
│   ├── Weekly Schedule (embedded Google Calendar)
│   ├── Signup for Confession
│   └── Monthly Calendar
├── Homilies & Sermons
│   ├── Latest Homilies (embedded YouTube playlist)
│   └── Sermon Archive (link to legacy archive)
├── Teaching
│   ├── Articles
│   ├── Catechesis
│   ├── Questions & Answers
│   └── Daily Scripture Readings
├── Church Life
│   ├── Seasons of the Church
│   │   ├── Great Lent
│   │   ├── Pascha
│   │   ├── Nativity
│   │   └── Theophany
│   ├── Parish Life & Updates (from Ghost CMS or manual)
│   └── Photo Gallery
├── Library
│   ├── Holy Fathers & Gleanings (link to legacy archive)
│   ├── Lives of Saints (link to legacy archive)
│   ├── Western Saints (link to legacy archive)
│   ├── Monastic Stories (link to legacy archive)
│   ├── Poetry (link to legacy archive)
│   ├── Music (link to legacy archive)
│   ├── Typicon / Ustav (link to legacy archive)
│   └── Services & Prayers (link to legacy archive)
├── Videos
│   └── YouTube Channel (link to @orthodoxnet)
├── Donate
│   ├── PayPal Donation
│   └── Mitey Mites
├── Shop
│   └── Link to shoporthodox.net
└── Legacy Site Archive
    └── Link to archived orthodox.net content
```

### Page-by-page guide

#### Home page
- **Banner**: St. Nicholas icon + "St Nicholas Orthodox Church" + "McKinney, Texas (Dallas Area)"
- **Left column**: Address (708 South Chestnut Street, McKinney, TX 75069), phone (972-658-5433), email (seraphim@orthodox.net)
- **Right column**: Links to Monthly Calendar, Signup for Confession, Donate to Mitey Mites, Contact Info
- **Services section**: Embed Google Calendar showing next 10 days of services
- **Latest content**: Embed 2-3 recent YouTube videos from @orthodoxnet
- **Parish update**: A manually editable text area for announcements
- **Footer**: Links to all major content sections, acknowledgement of Orthodox Internet Services, copyright notice

#### About Us
- Parish description: "We are in McKinney Texas, about 20 miles north of Dallas. We are a diverse community of Orthodox Christians from all parts of the globe..."
- Church photo
- Google Maps embed
- Clergy contact information
- Testimony page (from current `/aboutus/testimony.html`)

#### Services & Schedule
- Embedded Google Calendar (full month view): `https://calendar.google.com/calendar/embed?src=s37s3qvlf9nobhplqp0umlcafs@group.calendar.google.com&ctz=America/Chicago`
- Link to confession signup: `https://signup.com/go/GmQhOMA`
- Regular service times listed as text (for quick reference)

#### Homilies & Sermons
- Embed latest YouTube videos from the @orthodoxnet channel
- Link to the full YouTube channel: `https://www.youtube.com/@orthodoxnet/videos`
- Link to the legacy sermon archive (this repo or hosted static archive)

#### Teaching
- **Articles**: New articles can be written directly in Google Sites. Link to legacy articles archive for older content.
- **Catechesis**: Same approach — new content in Google Sites, legacy content linked.
- **Questions & Answers**: Existing Q&A content linked from archive.
- **Daily Scripture Readings**: Could embed or link to the calendar data that's currently generated by `fetch_calendar.py`.

#### Church Life
- Sub-pages for each liturgical season with relevant content
- Parish life updates — any editor can add announcements, event recaps, photos
- Photo gallery using Google Sites' built-in image carousel

#### Library
- This section primarily links out to the legacy content archive
- Each sub-page has a brief description and a link to the archived section
- This preserves access to the 20+ content sections and thousands of pages without migrating them into Google Sites

#### Donate
- Embedded PayPal donate button
- Link to Mitey Mites PayPal: `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FHWE4PALUPG7U`

### How to build it in Google Sites

1. Go to [sites.google.com](https://sites.google.com) and click "+" to create a new site
2. Set the site name to "St Nicholas Orthodox Church"
3. Upload the St. Nicholas icon for the banner/logo
4. Create pages matching the site map above (use the Pages panel on the right)
   - To create sub-pages, drag a page under a parent page
5. For each page, add content using Google Sites' drag-and-drop blocks:
   - **Text blocks** for descriptions and announcements
   - **Image blocks** for photos and icons
   - **Embed blocks** (`<>`) for Google Calendar, YouTube videos, PayPal buttons
   - **Link blocks** for connections to the legacy archive
6. Set the theme/colors:
   - Choose a warm, traditional-looking theme
   - The "Aristotle" or "Diplomat" themes may work well as a starting point
7. Share editing access with parish members via their Google accounts
8. When ready, publish at a custom URL

### What parish editors can do (no developer needed)
- Add/edit announcements on the home page
- Post new articles or teaching content
- Upload photos to the gallery
- Update service times and contact info
- Add new sub-pages for events or programs

### What still needs a developer (or Greg)
- Hosting the legacy content archive as a static site (GitHub Pages or similar)
- Setting up a custom domain (orthodox.net → Google Sites)
- Initial site structure and theme setup
- Any integrations beyond simple embeds

## Server connection details

- **Host**: `hikina.inoatech.com`
- **User**: `nicholas`
- **SSH Key**: `~/.ssh/id_rsa_orthodox`
- **Port**: 22 (may need to be updated — check cPanel)
- **Remote path**: `/home/nicholas/public_html`
