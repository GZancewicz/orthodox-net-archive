# Bible Verse Formatter Instructions

## Overview
The `format-bible-verses.js` script automatically formats Bible verse references in links from their filename format to a human-readable format.

## Examples of Formatting
- `1cronicles16.14` → `1 Chronicles 16:14`
- `matthew10_19` → `Matthew 10:19`
- `luke21:2` → `Luke 21:2`
- `genesis22.1_14` → `Genesis 22:1-14`

## How to Use

### Option 1: Add to Legacy HTML Files
Add this script tag before the closing `</body>` tag in any legacy HTML file that contains Bible verse links:

```html
<script src="/js/format-bible-verses.js"></script>
```

For the production server, the path would be:
```html
<script src="https://www.orthodox.net/js/format-bible-verses.js"></script>
```

### Option 2: Create a New Topics Page
Instead of modifying the legacy file, create a new version in the content directory that includes the script and loads the topic list dynamically.

### Option 3: Use with Iframe
If loading the legacy content in an iframe, you can inject the script into the iframe:

```javascript
// Wait for iframe to load
document.getElementById('legacy-iframe').addEventListener('load', function() {
    const iframeDoc = this.contentDocument || this.contentWindow.document;
    
    // Create and inject the script
    const script = iframeDoc.createElement('script');
    script.src = '/js/format-bible-verses.js';
    iframeDoc.body.appendChild(script);
});
```

## Testing
Use the `test-bible-formatter.html` file to verify the formatter is working correctly. Open the browser console to see detailed logs of what's being formatted.

## Supported Formats
The script recognizes these Bible verse patterns:
- `bookchapter.verse` (e.g., `john3.16`)
- `bookchapter_verse` (e.g., `john3_16`)
- `bookchapter,verse` (e.g., `john3,16`)
- `bookchapter:verse` (e.g., `john3:16`)
- `bookchapter.verse_verse` (e.g., `matthew5.1_12`)
- `bookchapter_verse_verse` (e.g., `matthew5_1_12`)

## Debug Mode
The script includes console logging for debugging. Open the browser console to see:
- Number of links found
- Each link being checked
- Successful formatting transformations
- Links that couldn't be formatted