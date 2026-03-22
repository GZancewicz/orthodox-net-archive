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

## Server connection details

- **Host**: `hikina.inoatech.com`
- **User**: `nicholas`
- **SSH Key**: `~/.ssh/id_rsa_orthodox`
- **Port**: 22 (may need to be updated — check cPanel)
- **Remote path**: `/home/nicholas/public_html`
