document.addEventListener('DOMContentLoaded', function() {
    // Parse URL for filename (supports both query params and path-based URLs)
    const urlParams = new URLSearchParams(window.location.search);
    let fileName = urlParams.get('file');
    
    if (!fileName) {
        const pathMatch = window.location.pathname.match(/\/saints\/(.+\.html)$/);
        if (pathMatch) {
            fileName = pathMatch[1];
        }
    }
    
    if (fileName) {
        // Fetch content via PHP fetcher
        fetch(`/saints_fetcher.php?file=${encodeURIComponent(fileName)}`)
            .then(response => response.text())
            .then(html => {
                // First, fix multi-line img tags before any other processing
                // This prevents browser parsing issues
                html = html.replace(/<img\s+([^>]+)>/gis, function(match) {
                    // Convert multi-line img tag to single line
                    return match.replace(/\s+/g, ' ');
                });
                
                // Process and clean HTML
                html = cleanLegacyHTML(html);
                
                // Insert into placeholder
                document.getElementById('saints-placeholder').innerHTML = html;
                
                // Fix broken images after DOM insertion
                if (window.location.pathname.includes('miracle-of-saint-nicholas-kiev-1920s')) {
                    // Wait a moment for DOM to settle
                    setTimeout(() => {
                        const placeholder = document.getElementById('saints-placeholder');
                        // Find all images
                        const allImages = placeholder.querySelectorAll('img');
                        allImages.forEach(img => {
                            // Check if this is the broken image - it will have corrupted attributes
                            if (img.hasAttribute('https:') || img.hasAttribute('www.orthodox.net') || 
                                img.hasAttribute('saintnicholas.jpg') || img.outerHTML.includes('saintnicholas.jpg')) {
                                // Create a new image element
                                const newImg = document.createElement('img');
                                newImg.src = 'https://www.orthodox.net/saintnicholas.jpg';
                                newImg.width = 353;
                                newImg.height = 491;
                                newImg.style.cssText = 'float: left; margin: 0 15px 15px 0;';
                                newImg.alt = 'St Nicholas the Wonderworker';
                                
                                // Replace the broken image
                                img.parentNode.replaceChild(newImg, img);
                            }
                        });
                    }, 100);
                }
                
                // Update page title if found
                updatePageTitle();
            })
            .catch(error => {
                document.getElementById('saints-placeholder').innerHTML = 
                    '<p>Error loading content. Please try again later.</p>';
            });
    }
});

function cleanLegacyHTML(html) {
    // SPECIFIC FIX for miracle-of-saint-nicholas-kiev-1920s.html
    if (window.location.pathname.includes('miracle-of-saint-nicholas-kiev-1920s')) {
        // Fix the specific multi-line image tag with double slash
        // This matches the exact pattern in the source file
        html = html.replace(/<img\s+width="353"\s+height="491"\s+src="https:\/\/www\.orthodox\.net\/\/saintnicholas\.jpg"[^>]*>/gis, 
            '<img src="https://www.orthodox.net/saintnicholas.jpg" width="353" height="491" style="float: left; margin: 0 15px 15px 0;" alt="St Nicholas the Wonderworker">');
        
        // Also catch any already-corrupted versions or variations
        html = html.replace(/<img[^>]*saintnicholas\.jpg[^>]*>/gis, 
            '<img src="https://www.orthodox.net/saintnicholas.jpg" width="353" height="491" style="float: left; margin: 0 15px 15px 0;" alt="St Nicholas the Wonderworker">');
    }
    
    // Remove consecutive spaces and nbsp
    html = html.replace(/(&nbsp;|\s)+/g, ' ');
    
    // Remove [U*] artifacts
    html = html.replace(/\[U\*\]/g, '');
    
    // Unwrap font tags
    html = html.replace(/<font[^>]*>(.*?)<\/font>/gi, '$1');
    
    // Fix broken URLs
    html = html.replace(/http:\/\/www\.orthodox\.net\/\//g, '/');
    
    // Fix double slashes in orthodox.net URLs specifically
    html = html.replace(/orthodox\.net\/\//g, 'orthodox.net/');
    
    // Ensure image tags with orthodox.net are not corrupted
    // Match multi-line img tags with orthodox.net URLs
    html = html.replace(/<img\s+([^>]*?)src="https:\/\/www\.orthodox\.net\/([^"]+)"([^>]*?)>/gis, 
        function(match, before, path, after) {
            // Clean up any corruption and rebuild the tag
            return '<img ' + before + 'src="https://www.orthodox.net/' + path + '"' + after + '>';
        });
    
    // Convert relative media links to absolute production URLs
    html = html.replace(/href="([^"]*\.(mp3|pdf|doc|docx|rtf))"/gi, 
        'href="https://www.orthodox.net/saints/$1"');
    
    // Fix relative links to other sections
    html = html.replace(/href="\.\.\/sermons\//gi, 'href="/sermons/');
    html = html.replace(/href="\.\.\/questions\//gi, 'href="/questions/');
    html = html.replace(/href="\.\.\/ustav\//gi, 'href="/ustav/');
    html = html.replace(/href="\.\.\/aboutus\//gi, 'href="/aboutus/');
    
    // Fix image sources - handle both quoted and unquoted attributes
    
    // First, normalize all unquoted src attributes to quoted ones
    html = html.replace(/src=([^\s>]+)/gi, 'src="$1"');
    
    // Now fix all src attributes with ../
    html = html.replace(/src="\.\.\/([^"]+)"/gi, 'src="https://www.orthodox.net/$1"');
    
    // Fix src with just filename (no path) - but not if already absolute
    html = html.replace(/src="([^"]+)"/gi, function(match, url) {
        // Skip if already absolute or starts with /
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
            return match;
        }
        // Skip if it contains ../ (already handled above)
        if (url.includes('../')) {
            return match;
        }
        // Only convert if it's a simple filename with image extension
        if (url.match(/^[^\/]+\.(gif|jpg|jpeg|png|webp)$/i)) {
            return 'src="https://www.orthodox.net/saints/' + url + '"';
        }
        return match;
    });
    
    html = html.replace(/href="\.\.\/([^"]+)"/gi, function(match, path) {
        // Don't convert if it's already been converted to an absolute path
        if (path.startsWith('http')) {
            return match;
        }
        // Don't convert anchors
        if (path.startsWith('#')) {
            return match;
        }
        return 'href="https://www.orthodox.net/' + path + '"';
    });
    
    // Remove empty paragraphs
    html = html.replace(/<p[^>]*>[\s&nbsp;]*<\/p>/gi, '');
    
    // Remap heading hierarchy
    html = html.replace(/<h1/gi, '<h3');
    html = html.replace(/<\/h1>/gi, '</h3>');
    html = html.replace(/<h2/gi, '<h4');
    html = html.replace(/<\/h2>/gi, '</h4>');
    html = html.replace(/<h[3-6]/gi, '<h5');
    html = html.replace(/<\/h[3-6]>/gi, '</h5>');
    
    // Center all headings
    html = html.replace(/<h([3-5])/gi, '<h$1 style="text-align: center;"');
    
    // Remove all style tags and inline styles (except centering)
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    html = html.replace(/style="[^"]*"/gi, function(match) {
        if (match.includes('text-align: center')) {
            return 'style="text-align: center;"';
        }
        return '';
    });
    
    // Add proper styling to images that are aligned left or right
    html = html.replace(/<img([^>]*?)align="?left"?([^>]*?)>/gi, function(match, before, after) {
        // Remove any existing align attribute and add style
        var cleaned = (before + after).replace(/align="?left"?/gi, '');
        return '<img' + cleaned + ' style="float: left; margin: 0 15px 15px 0;">';
    });
    
    html = html.replace(/<img([^>]*?)align="?right"?([^>]*?)>/gi, function(match, before, after) {
        // Remove any existing align attribute and add style
        var cleaned = (before + after).replace(/align="?right"?/gi, '');
        return '<img' + cleaned + ' style="float: right; margin: 0 0 15px 15px;">';
    });
    
    // Remove old class attributes that might conflict
    html = html.replace(/class="[^"]*"/gi, '');
    
    // Fix character encoding issues
    html = html.replace(/â€™/g, "'");
    html = html.replace(/â€œ/g, '"');
    html = html.replace(/â€/g, '"');
    html = html.replace(/â€"/g, '—');
    html = html.replace(/â€¦/g, '...');
    
    return html;
}

function updatePageTitle() {
    const h3 = document.querySelector('#saints-placeholder h3');
    if (h3) {
        document.title = h3.textContent + ' - St. Nicholas Orthodox Church';
    }
}