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

### Approach: PHP scripts over HTTP

Download legacy content using PHP scripts deployed via the onet-v2 repo. No SSH needed — scripts run on the server and serve content over HTTP. Download is done in manageable chunks, one category at a time.

### Server inventory (completed 2026-03-22)

The `list_legacy_files.php` script found **140+ directories** in `/public_html/` with far more content than the 25 categories in the `.htaccess`. Full inventory:

#### Skip (not legacy content)
| Directory | Files | Size | Reason |
|-----------|-------|------|--------|
| `new/` | 8,295 | 388 MB | This is onet-v2 itself, already on GitHub |
| `.well-known/` | 0 | 0 MB | SSL certificate validation |
| `cgi-bin/` | 21 | 0.1 MB | Server scripts |
| `dev/`, `exercise/`, `haiti/`, `pentecostarion/`, `seraphim/`, `html5up-editorial/` | 0 | 0 MB | Empty directories |
| `wpt/`, `wpt-j/`, `wpt-w/` | 3 | 0 MB | WordPress test artifacts |

#### Repo 1: `orthodox-net-archive` (this repo) — HTML, documents, images (~1.5 GB)

**Batch 1 — Large content sections (>40 MB each)**
| Directory | Files | Size |
|-----------|-------|------|
| `sermons/` | 2,052 | 305 MB |
| `journal/` | 420 | 272 MB |
| `redeemingthetime/` | 3,434 | 125 MB |
| `ikons/` | 617 | 93 MB |
| `prison-ministry/` | 350 | 87 MB |
| `services/` | 370 | 73 MB |
| `akathists/` | 48 | 64 MB |
| `trebnic/` | 369 | 55 MB |
| `full-voice/` | 312 | 50 MB |
| `daniel/` | 81 | 48 MB |
| `aboutus/` | 127 | 47 MB |
| `catechism/` | 210 | 42 MB |

**Batch 2 — Medium content sections (1–40 MB)**
| Directory | Files | Size |
|-----------|-------|------|
| `wpt-3/` | 3,434 | 132 MB |
| `confess/` | 65 | 20 MB |
| `private_/` | 1 | 20 MB |
| `greatlent/` | 163 | 16 MB |
| `images/` | 138 | 15 MB |
| `articles/` | 295 | 14 MB |
| `onet/` | 889 | 14 MB |
| `stnicholas/` | 245 | 10 MB |
| `scripture/` | 188 | 9 MB |
| `calendar/` | 91 | 8 MB |
| `prologue/` | 802 | 7 MB |
| `questions/` | 473 | 7 MB |
| `russiannm/` | 260 | 6 MB |
| `letters/` | 39 | 4 MB |
| `redeeming/` | 99 | 4 MB |
| `announcements/` | 39 | 4 MB |
| `slides-slidesjs-3/` | 66 | 3 MB |
| `whatsnew/` | 29 | 3 MB |
| `data/` | 49 | 3 MB |
| `scripture-memory/` | 111 | 3 MB |
| `pascha/` | 114 | 3 MB |
| `menaion/` | 766 | 4 MB |
| `menaion-september/` | 318 | 3 MB |
| `menaion-november/` | 253 | 2 MB |
| `menaion-july/` | 222 | 2 MB |
| `menaion-january/` | 213 | 2 MB |
| `menaion-december/` | 212 | 2 MB |
| `menaion-october/` | 216 | 2 MB |
| `menaion-august/` | 214 | 2 MB |
| `menaion-june/` | 215 | 2 MB |
| `menaion-march/` | 190 | 2 MB |
| `menaion-may/` | 203 | 2 MB |
| `menaion-april/` | 200 | 2 MB |
| `menaion-february/` | 183 | 1 MB |
| `quiz/` | 275 | 2 MB |
| `questions2/` | 104 | 2 MB |
| `ministries/` | 37 | 2 MB |
| `a-little-bit/` | 16 | 2 MB |
| `podcasts/` | 129 | 2 MB |
| `ustav/` | 117 | 2 MB |
| `dailylent/` | 69 | 1 MB |
| `music/` | 54 | 1 MB |
| `news/` | 35 | 1 MB |
| `sermon-notes/` | 44 | 1 MB |
| `docs/` | 28 | 1 MB |
| `nativity/` | 69 | 1 MB |
| `rubrics/` | 68 | 1 MB |
| `osb/` | 49 | 1 MB |

**Batch 3 — Small content sections (<1 MB each)**
| Directory | Files | Size |
|-----------|-------|------|
| `10things/` | 40 | 0.8 MB |
| `slicebox/` | 68 | 0.9 MB |
| `tothinkabout/` | 73 | 0.9 MB |
| `links/` | 76 | 0.8 MB |
| `directory/` | 112 | 0.8 MB |
| `exact/` | 25 | 0.8 MB |
| `misc/` | 51 | 0.7 MB |
| `church-school/` | 9 | 0.7 MB |
| `fathers/` | 29 | 0.7 MB |
| `recipes/` | 65 | 0.6 MB |
| `forms/` | 7 | 0.6 MB |
| `western-saints/` | 40 | 0.6 MB |
| `faq/` | 39 | 0.6 MB |
| `september-11-2001/` | 35 | 0.5 MB |
| `roca/` | 32 | 0.5 MB |
| `topics/` | 30 | 0.4 MB |
| `troparia/` | 28 | 0.4 MB |
| `theophany/` | 31 | 0.4 MB |
| `russia/` | 35 | 0.4 MB |
| `txt/` | 1 | 0.4 MB |
| `sermons-index/` | 25 | 0.4 MB |
| `roc/` | 30 | 0.4 MB |
| `ecumenism/` | 40 | 0.4 MB |
| `synaxarion/` | 25 | 0.4 MB |
| `talks/` | 19 | 0.3 MB |
| `tidy/` | 19 | 0.4 MB |
| `search/` | 25 | 0.3 MB |
| `menu/` | 42 | 0.3 MB |
| `holiness-happens/` | 30 | 0.3 MB |
| `referenc/` | 24 | 0.3 MB |
| `newsletter/` | 26 | 0.3 MB |
| `moleben/` | 20 | 0.3 MB |
| `poetry/` | 29 | 0.3 MB |
| `prayers/` | 26 | 0.3 MB |
| `microbiology/` | 24 | 0.3 MB |
| `holyweek/` | 31 | 0.3 MB |
| `pilot/` | 24 | 0.3 MB |
| `cotc/` | 69 | 0.3 MB |
| `pastoral-commentary-on-the-psalms/` | 19 | 0.3 MB |
| `monastic-stories/` | 25 | 0.3 MB |
| `graphics/` | 27 | 0.3 MB |
| `documents/` | 22 | 0.3 MB |
| `menaion-thoughts/` | 23 | 0.2 MB |
| `js/` | 44 | 0.3 MB |
| `memorization/` | 26 | 0.2 MB |
| `falbum/` | 29 | 0.2 MB |
| `includes/` | 25 | 0.2 MB |
| `dyptichs/` | 28 | 0.2 MB |
| `banners/` | 29 | 0.2 MB |
| `last-upload.all/` | 19 | 0.2 MB |
| `hm/` | 21 | 0.2 MB |
| `guestbook/` | 25 | 0.2 MB |
| `apostol/` | 28 | 0.2 MB |
| `conversions/` | 27 | 0.2 MB |
| `churchyear/` | 24 | 0.1 MB |
| `charities/` | 24 | 0.1 MB |
| `appeals/` | 27 | 0.1 MB |
| `a-fathers-letters/` | 24 | 0.1 MB |
| `doyouhaveaminute/` | 8 | 0.1 MB |
| `redeemingthetime.backup/` | 19 | 0.3 MB |
| `bak/` | 19 | 0.1 MB |
| `bulletin/` | 22 | 0.1 MB |
| `a-word-from-the-pastor/` | 23 | 0.1 MB |
| `6minutesorlessorthodoxvideos/` | 22 | 0.1 MB |
| `goodtoknow/` | 2 | 0.1 MB |
| `templates/` | 8 | 0.0 MB |
| `prisonministry/` | 4 | 0.0 MB |
| `legacy.orthodox.net/` | 1 | 0.0 MB |

#### Repo 2: `orthodox-net-archive-media` (new repo) — Audio/video (~20.5 GB)
| Directory | Files | Size |
|-----------|-------|------|
| `local-media/` | 1,798 | 20,527 MB |

#### Possibly duplicate directories (same file count and size)
- `sermons/`, `homilies/`, `audio/` — all 2,052 files, 305 MB each. May be symlinks or copies. Investigate before downloading all three.

#### Repo 3: `orthodox-net-archive-photos` (new repo, optional) — Photos (~317 MB)
| Directory | Files | Size |
|-----------|-------|------|
| `photos/` | 516 | 317 MB |

### Download order

Download one batch at a time using PHP archiver scripts, committing after each batch:

1. **Batch 3 first** (small sections) — quick wins, ~15 MB total
2. **Batch 2** (medium sections) — ~280 MB total
3. **Batch 1** (large sections) — ~1.2 GB total, may need to split further
4. **Photos** — 317 MB, separate repo if needed
5. **Media** — 20 GB, definitely separate repo, may need Git LFS or multiple repos

### Download approach

For each batch, a PHP script on the server creates a zip of the requested directories. The zip is downloaded via browser, extracted locally, and committed to this repo. Scripts are deployed via the onet-v2 repo (`git pull` on the server).

## Current status (2026-03-22)

### Completed
- Deployed `list_legacy_files.php` inventory script via onet-v2 repo
- Completed full server inventory: 140+ directories, ~22,600 files, ~22 GB total
- Identified repo split strategy based on inventory
- Identified likely duplicate directories (sermons/homilies/audio)

### Next steps
1. Investigate whether `sermons/`, `homilies/`, and `audio/` are duplicates
2. Write a PHP zip-and-download script for batch downloads
3. Start with Batch 3 (small sections) as a test run
4. Work through remaining batches

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/inventory.sh` | SSH into server, report content sizes and file counts |
| `scripts/download.sh` | rsync-based download with mode flags |
| `scripts/config.env.example` | Template for SSH connection details |
| `scripts/config.env` | Actual credentials (gitignored, never committed) |

## ONET v3 — WordPress Blueprint

The next generation of orthodox.net will be a WordPress site that parish volunteers can maintain. WordPress was chosen because:
- Parish volunteers with WordPress experience have stepped forward to help
- WordPress skills are common — if a volunteer leaves, finding another is easy
- Full design control via themes — the site can look however we want
- Huge plugin ecosystem for calendars, YouTube embeds, donations, etc.
- The legacy content archive (this repo) will be linked from the new site

### Security considerations

The Inoa hosting admin raised valid concerns about WordPress security. Mitigations:
- **Use managed WordPress hosting** (SiteGround, WP Engine, Flywheel) that handles core updates, backups, and malware scanning automatically
- **Minimize plugins** — only use well-maintained, widely-adopted plugins
- **Keep WordPress core, themes, and plugins updated** (managed hosting does this)
- **Use strong passwords and limit admin accounts**
- **Install Wordfence or Sucuri** (free security plugin) for firewall and login protection

### Recommended hosting

| Host | Cost | Why |
|------|------|-----|
| SiteGround | ~$3-15/month | Popular with churches, good support, auto-updates, free SSL |
| Bluehost | ~$3-10/month | Official WordPress.org recommended host |
| WP Engine | ~$20-25/month | Premium managed hosting, best security and performance |

### Recommended themes

Look for church-specific or nonprofit WordPress themes:
- Search "Orthodox church" or "church" in the WordPress theme directory
- Preferred qualities: clean design, responsive/mobile-friendly, easy customization via the WordPress Customizer (no code needed), sermon/event support built in
- Paid theme marketplaces (ThemeForest, Flavor themes) have dedicated church themes with sermon managers, event calendars, and donation integrations built in

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
│   ├── Latest Homilies (embedded YouTube playlist or sermon plugin)
│   └── Sermon Archive (link to legacy archive)
├── Teaching
│   ├── Articles (WordPress posts, categorized)
│   ├── Catechesis
│   ├── Questions & Answers
│   └── Daily Scripture Readings
├── Church Life
│   ├── Seasons of the Church
│   │   ├── Great Lent
│   │   ├── Pascha
│   │   ├── Nativity
│   │   └── Theophany
│   ├── Parish Life & Updates (WordPress blog posts)
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
- **Banner/Header**: St. Nicholas icon + "St Nicholas Orthodox Church" + "McKinney, Texas (Dallas Area)"
- **Contact bar**: Address (708 South Chestnut Street, McKinney, TX 75069), phone (972-658-5433), email (seraphim@orthodox.net)
- **Quick links**: Monthly Calendar, Signup for Confession, Donate to Mitey Mites, Contact Info
- **Services widget**: Embed Google Calendar showing upcoming services
- **Latest content**: Embed 2-3 recent YouTube videos from @orthodoxnet (use a YouTube feed plugin)
- **Parish update**: Latest blog post or announcement (automatic via WordPress)
- **Footer**: Links to all major content sections, acknowledgement of Orthodox Internet Services, copyright notice

#### About Us
- WordPress "Page" with parish description: "We are in McKinney Texas, about 20 miles north of Dallas. We are a diverse community of Orthodox Christians from all parts of the globe..."
- Church photo
- Google Maps embed (use a maps plugin or simple iframe)
- Clergy contact information
- Testimony sub-page

#### Services & Schedule
- Embedded Google Calendar (full month view): `https://calendar.google.com/calendar/embed?src=s37s3qvlf9nobhplqp0umlcafs@group.calendar.google.com&ctz=America/Chicago`
- Link to confession signup: `https://signup.com/go/GmQhOMA`
- Regular service times listed as text (for quick reference)
- Plugin option: "The Events Calendar" (free) for managing services natively in WordPress

#### Homilies & Sermons
- Use a sermon manager plugin (e.g., "Starter starter Starter starter" or church theme built-in) or simply embed YouTube playlists
- Link to the full YouTube channel: `https://www.youtube.com/@orthodoxnet/videos`
- Link to the legacy sermon archive for older content

#### Teaching
- **Articles**: Use WordPress Posts with a "Teaching" or "Articles" category. Editors write new articles using the standard WordPress block editor (Gutenberg).
- **Catechesis**: Same approach — WordPress posts categorized under "Catechesis"
- **Questions & Answers**: WordPress page or categorized posts
- **Daily Scripture Readings**: Could embed or link to the calendar data, or use a plugin

#### Church Life
- WordPress pages for each liturgical season with relevant content
- Parish life updates — any editor can publish a new blog post
- Photo gallery using WordPress gallery blocks or a gallery plugin

#### Library
- A WordPress page with organized links to the legacy content archive
- Each section has a brief description and links to the archived content
- This preserves access to the 20+ content sections and thousands of pages without migrating them all into WordPress

#### Donate
- PayPal donate button (use PayPal's button generator or a donations plugin like GiveWP)
- Link to Mitey Mites PayPal: `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FHWE4PALUPG7U`

### Recommended plugins (keep this list minimal)

| Plugin | Purpose | Free? |
|--------|---------|-------|
| Wordfence or Sucuri | Security, firewall, login protection | Yes |
| UpdraftPlus | Automated backups | Yes |
| The Events Calendar | Service schedule management | Yes |
| Embed Plus for YouTube | YouTube video/playlist embedding | Yes |
| GiveWP or PayPal button | Donation processing | Yes |
| Contact Form 7 or WPForms | Contact forms | Yes |
| Yoast SEO | Search engine optimization | Yes |
| WP Super Cache | Performance/caching | Yes |

### User roles for parish volunteers

WordPress has built-in roles that control what each person can do:

| Role | Can do | Good for |
|------|--------|----------|
| Administrator | Everything — settings, plugins, themes, users | Greg (initial setup only) |
| Editor | Create, edit, publish any post/page | Trusted parish volunteers |
| Author | Create and publish their own posts | Regular contributors |
| Contributor | Write drafts, cannot publish | New volunteers (posts require approval) |

### Setup steps

1. **Choose and sign up for managed WordPress hosting** (SiteGround recommended)
2. **Install WordPress** (one-click install on most managed hosts)
3. **Choose and install a church theme**
4. **Install essential plugins** (security, backup, calendar, YouTube — see table above)
5. **Create the page structure** matching the site map above
6. **Set up the home page** as a static front page (Settings → Reading → Static page)
7. **Configure navigation menus** (Appearance → Menus) matching the site map
8. **Add parish volunteers as users** with appropriate roles
9. **Migrate key content** from the current site (About Us, contact info, service times)
10. **Link the Library section** to the legacy content archive
11. **Point the orthodox.net domain** to the new WordPress host (DNS change)
12. **Decommission the Inoa hosting** once everything is migrated and verified

### What parish editors can do (no developer needed)
- Write and publish new articles, sermons, announcements
- Edit any existing page content
- Upload photos and create galleries
- Update service times and contact info
- Add new pages or sub-pages
- Manage comments
- Embed YouTube videos in any post or page

### What needs initial developer setup (Greg + volunteers)
- Hosting account and WordPress installation
- Theme selection and customization
- Plugin installation and configuration
- Navigation menu structure
- User accounts and roles
- Domain DNS migration
- Hosting the legacy content archive (GitHub Pages or similar)

## Server connection details

- **Host**: `hikina.inoatech.com`
- **User**: `nicholas`
- **SSH Key**: `~/.ssh/id_rsa_orthodox`
- **Port**: 22 (may need to be updated — check cPanel)
- **Remote path**: `/home/nicholas/public_html`
