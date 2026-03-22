# Converting Legacy Folders to New Format

This document outlines the complete workflow for converting legacy LAMP site folders to the new onet-v2 format. The conversion allows legacy content to be served through a modern template while maintaining backwards compatibility. The process involves both manual steps (performed by humans) and automated steps (performed by Claude).

## Overview

The conversion process creates a wrapper system that fetches legacy content on-demand, processes it for modern display, and serves it within the new site template. All new pages use `util/template.html` as their base, with content inserted into the `<div id="placeholder">` element. This approach allows progressive migration without modifying original legacy files.

## Reference Prototypes

Working prototypes from the pascha folder conversion are available in `util/conversion-prototypes/`:
- `prototype_shell.html` - HTML shell template
- `prototype-shell.js` - JavaScript handler with all fixes
- `prototype_fetcher.php` - PHP fetcher with encoding detection
- `README.md` - Detailed documentation

Use these as starting points for new conversions.

## Prerequisites

1. Legacy folder exists at production path: `/public_html/[folder-name]/`
2. Local testing setup simulates production structure: `../../[folder-name]/`
3. Legacy HTML files contain content markers: `<!--BEGIN-CONTENT-->` and `<!--END-CONTENT-->`
4. Access to `util/template.html` base template
5. **Important**: Only HTML files are converted. All other file types (doc, docx, pdf, mp3, etc.) remain on the production server and will be fetched directly from there via absolute URLs

## Complete Conversion Workflow

### Phase 1: Manual Setup (Human)

#### Step 1: Login to Production Server
**Location**: PRODUCTION SERVER
- Login via cPanel and start terminal app
- Terminal app will land one level above public_html by default

#### Step 2: Copy Production .htaccess to Repository
**Location**: PRODUCTION SERVER
```bash
cp public_html/.htaccess public_html/new/onet-v2/.htaccess.production
```
**Why**: The `.htaccess.production` file in the repository must stay in sync with the production server's `.htaccess`. This step ensures Claude has the current version before adding new rewrite rules.

#### Step 3: Navigate to Legacy Directory
**Location**: PRODUCTION SERVER
```bash
cd public_html/new/onet-v2/legacy
```

#### Step 4: Create Legacy Folder
**Location**: PRODUCTION SERVER
```bash
mkdir [folder-name]
```

#### Step 5: Copy Legacy HTML Files
**Location**: PRODUCTION SERVER
```bash
cp ../../../[folder-name]/*.html [folder-name]/
```
Note: This copies from `public_html/[folder-name]/*.html` into `onet-v2/legacy/[folder-name]`

#### Step 6: Stage Legacy Files (Optional)
**Location**: PRODUCTION SERVER
```bash
cd ..
git add legacy/[folder-name]
```

#### Step 7: Commit Legacy Files (Optional)
**Location**: PRODUCTION SERVER
```bash
git commit -m "Copy legacy HTML files"
```

#### Step 8: Push to Repository (Optional)
**Location**: PRODUCTION SERVER
```bash
git push
```

#### Step 9: Pull Changes Locally (If Committed)
**Location**: LOCAL IDE
```bash
git pull
```

#### Step 10: Copy to Local Testing Location
**Location**: LOCAL IDE
```bash
cp -r legacy/[folder-name] ../../[folder-name]
```
**Why**: The PHP fetcher uses the path `__DIR__ . '/../../../../public_html/[folder-name]/'` to find legacy files. This path navigates from `content/` up 4 levels to the home directory, then into `public_html/[folder-name]/`. For local testing to work, you must have the legacy folder at `../../[folder-name]/` relative to the `onet-v2` directory (which simulates the production `public_html/[folder-name]/` location).

#### Step 11: Remove Legacy Folder from Project (If Used)
**Location**: LOCAL IDE
```bash
rm -rf legacy/[folder-name]
```

#### Step 12: Commit Removal (If Applicable)
**Location**: LOCAL IDE
```bash
git add -u
git commit -m "Remove temporary legacy folder"
git push
```

### Phase 2: Automated Conversion (Claude)

At this point, the legacy HTML files are in place at `../../[folder-name]/` and Claude can perform the following automated steps:

#### Step 2-1: Create Directory Structure
**Automated by Claude**
```bash
mkdir -p content/[folder-name]/new
```

#### Step 2-2: Preserve Legacy Index
**Automated by Claude**
```bash
cp ../../[folder-name]/index.html content/[folder-name]/_index.html
```

#### Step 2-3: Create New Index Page
**Automated by Claude**
1. Copy `util/template.html` to `content/[folder-name]/index.html`
2. Update the `<title>` tag appropriately
3. Add content within the `<div id="placeholder">` element based on legacy `_index.html`
4. Create proper navigation links to all content pages
5. **Important**: Check for cross-folder references (links starting with `../`) in the legacy index
   - Links to `../sermons/` should become `/sermons/`
   - Links to `../questions/` should become `/questions/`
   - Links to `../ustav/` should become `/ustav/`
   - Any cross-folder reference should use absolute paths starting with `/`

#### Step 2-4: Create Shell Template
**Automated by Claude**
1. Copy `util/template.html` to `content/[folder-name]/new/[folder-name]_shell.html`
2. Replace the `<div id="placeholder"></div>` with dynamic loading placeholder
3. Add JavaScript reference before closing `</body>` tag
4. Update the `<title>` tag

#### Step 2-5: Create PHP Fetcher
**Automated by Claude**
- Create `content/[folder-name]_fetcher.php` (IMPORTANT: in content folder, NOT in subfolder)
- Implement content extraction logic
- Handle character encoding conversion
- Extract content between markers

#### Step 2-6: Create JavaScript Handler
**Automated by Claude**
- Create `content/js/[folder-name]-shell.js`
- Implement URL parsing logic
- Add content cleaning functions
- Handle dynamic title updates
- Convert relative paths (`../filename`) to absolute URLs:
  - Image sources: `src="../image.gif"` → `src="https://www.orthodox.net/image.gif"`
  - Links to parent directory: `href="../file.html"` → `href="https://www.orthodox.net/file.html"`
  - Media files stay in folder: `href="file.pdf"` → `href="https://www.orthodox.net/[folder-name]/file.pdf"`

#### Step 2-7: Update Apache Rewrite Rules
**Automated by Claude**
- Add rewrite rule to `content/.htaccess`
- Configure routing for individual pages to shell template

#### Step 2-8: Update Production .htaccess File
**Automated by Claude**
- Modify `.htaccess.production` file to include the new rewrite rules
- This file mirrors the production server's .htaccess which lives in `/public_html/` (not in the content folder)
- Add the new folder's rewrite rules after the existing folder rules, maintaining the same format
- **Important**: The Apache server behavior differs between local development and production, so production uses a modified .htaccess in the public_html folder rather than the content/.htaccess approach

### Phase 3: Testing and Deployment (Human)

After Claude completes the automated conversion, the following manual steps are required:

#### Step 1: Commit All Changes
**Location**: LOCAL IDE
```bash
git add .
git commit -m "Convert [folder-name] to new format"
git push
```

#### Step 2: Pull Changes on Production Server
**Location**: PRODUCTION SERVER
```bash
cd public_html/new/onet-v2
git pull origin newbranch
```

#### Step 3: Copy .htaccess Rules (CRITICAL)
**Location**: PRODUCTION SERVER
- Copy the updated `.htaccess.production` file from the repository
- Replace the `/public_html/.htaccess` file on the production server
- **Note**: The production .htaccess is in `/public_html/` (not in the content folder)
- This is critical for the routing to work correctly

#### Step 4: Test the Conversion
**Location**: BROWSER
- Test that the new folder index page works
- Test that individual pages load correctly through the shell
- Verify all links and media files work

#### Step 5: Create Pull Request
**Location**: GITHUB
- Once testing confirms everything works
- Create a Pull Request from `newbranch` to `main`
- Review all changes
- Merge when approved

#### Step 6: Deploy to Production
**Location**: PRODUCTION SERVER
```bash
cd public_html/new/onet-v2
git checkout main
git pull
```

## Summary of Responsibilities

### Human Tasks (Phase 1 - Setup):
1. Login to production server via cPanel
2. Create legacy folder in onet-v2/legacy
3. Copy HTML files from public_html/[folder-name] to legacy folder
4. (Optional) Commit and push legacy files from production server
5. Pull changes to local IDE (if committed)
6. Copy legacy files to ../../[folder-name] for testing
7. Remove temporary legacy folder (if used)

### Claude Tasks (Phase 2 - Automated Conversion):
1. Create directory structure: content/[folder-name]/new
2. Preserve legacy index as _index.html
3. Create new index.html from template
4. Create shell template for individual pages
5. Create PHP fetcher script (in content/ folder)
6. Create JavaScript handler
7. Update .htaccess with rewrite rules
8. Update .htaccess.production file with new folder rules

### Human Tasks (Phase 3 - Deployment):
1. Commit and push all Claude's changes
2. Pull changes to production server on newbranch
3. **CRITICAL**: Copy .htaccess.production to /public_html/.htaccess on production server
4. Test the conversion thoroughly
5. Create and merge pull request
6. Deploy to production by pulling main branch

## Testing Checklist

Before deployment, verify:
- [ ] Legacy files are accessible at `../../[folder-name]/`
- [ ] New index page loads correctly
- [ ] Individual pages load through shell template
- [ ] All media links point to production server
- [ ] Character encoding displays correctly
- [ ] JavaScript console shows no errors
- [ ] .htaccess rules work on production

## Folder-Specific Considerations

Different legacy folders may require additional processing:

- **Articles**: May need article metadata extraction
- **Sermons**: Often include audio links that need special handling
- **Scripture**: May contain special formatting for Bible verses
- **Questions**: Q&A format may need specific styling
- **Cross-folder references**: Many folders contain links to content in other folders (e.g., pascha linking to sermons). Always convert relative paths (`../folder/`) to absolute paths (`/folder/`) in the new index.html
- **Character Encoding**: 
  - Most legacy files use Windows-1252 encoding
  - Cyrillic/Slavonic files (often with `-r` in filename) use Windows-1251 encoding
  - The PHP fetcher should detect and handle both encodings

Adjust the JavaScript cleaning function as needed for each folder's content patterns.

### Handling Cross-Folder Links

Legacy index pages often contain cross-references to files in other folders. When creating the new index.html:

1. Look for links starting with `../` in the legacy `_index.html`
2. Convert these to absolute paths starting with `/`
3. Common patterns:
   - `../sermons/filename.html` → `/sermons/filename.html`
   - `../questions/filename.html` → `/questions/filename.html`
   - `../articles/filename.html` → `/articles/filename.html`
   - `../ustav/filename.html` → `/ustav/filename.html`

This ensures links work correctly regardless of the current folder context.

## Completed Conversions

The following folders have been successfully converted using this methodology:
- `/articles/`
- `/sermons/`
- `/scripture/`
- `/full-voice/`
- `/questions/`
- `/greatlent/`
- `/pascha/` - See prototypes in `util/conversion-prototypes/`
- `/theophany/`
- `/confess/`

Each follows the same pattern with folder-specific naming conventions.

## Maintenance Notes

- PHP fetchers are located in `/content/` folder (e.g., `/content/pascha_fetcher.php`)
- JavaScript files are shared in `/content/js/`
- Shell templates isolate each folder's content
- Original legacy files remain untouched
- All processing happens client-side for performance
- When updating `util/template.html`, run `python3 util/update_template.py` to propagate changes to all pages using the template

This approach ensures smooth progressive migration while maintaining full backwards compatibility with existing URLs and content.

## Lessons Learned from Pascha Conversion

### 1. Image Attribute Handling
Legacy HTML often uses unquoted attributes: `src=image.gif` instead of `src="image.gif"`
- Solution: Normalize unquoted attributes to quoted first, then process
- Handle both `../` paths and bare filenames
- Convert all to absolute production URLs
- See `prototype-shell.js` for working implementation

### 2. Character Encoding Challenges
- Legacy files may have incorrect charset declarations
- Files with Cyrillic text often declare Windows-1252 but actually use Windows-1251
- Mixed language files (English + Cyrillic + Greek) need special handling
- Solution: Maintain explicit list of known problematic files in the fetcher
- See `prototype_fetcher.php` for encoding detection logic

### 3. Cross-Folder References
- Always check the legacy index for links to other folders
- Convert `../folder/file.html` to `/folder/file.html`
- Document files (PDF, DOC) stay on production server
- Test all cross-folder links after conversion

### 4. Local Development Issues
- Ensure Apache DocumentRoot points to content directory
- Check that AllowOverride is enabled for .htaccess
- Browser caching can mask JavaScript updates - always hard refresh
- Test PHP fetcher directly when debugging: `/[folder]_fetcher.php?file=filename.html`

### 5. Content Structure Variations
- Not all files use consistent HTML structure
- Some use tables for layout, others use divs
- Heading hierarchies vary widely
- Solution: Make JavaScript cleaning rules flexible and forgiving

### 6. Testing Strategy
- Test the index page first
- Test a few individual pages with different content types
- Check pages with Cyrillic or special characters
- Verify all image paths load correctly
- Test cross-folder links work properly

### 7. Static HTML Encoding Issues
When creating new static HTML files (like index.html), be aware of potential encoding issues on production:
- Git or server configuration may cause UTF-8 characters to display incorrectly
- Cyrillic text like "Христос Воскресе" may appear as "РҐСЂРёСЃС‚РѕСЃ Р'РѕСЃРєСЂРµСЃРµ"
- Solution: Convert all non-ASCII characters to HTML entities in static files:
  - Cyrillic: "Христос" → `&#1061;&#1088;&#1080;&#1089;&#1090;&#1086;&#1089;`
  - Greek: "Χριστός" → `&#935;&#961;&#953;&#963;&#964;&#972;&#962;`
- This ensures proper display regardless of server encoding settings
- Note: This is different from the PHP fetcher encoding issues - static files need HTML entities

### 8. Common File Location Mistakes
- **PHP Fetcher**: Must be placed in `content/[folder-name]_fetcher.php`, NOT in `content/[folder-name]/[folder-name]_fetcher.php`
- **JavaScript Handler**: Must reference the fetcher as `/[folder-name]_fetcher.php`
- **Shell HTML**: Must reference JavaScript as `/js/[folder-name]-shell.js`
- All other converted folders follow this exact pattern - check them if unsure

### 9. File Permissions
- After creating new files, verify they have 644 permissions (`-rw-r--r--`)
- Files with 600 permissions will cause "Forbidden" errors in Apache
- Fix with: `chmod 644 [filename]`
- Check permissions with: `ls -la [filename]`