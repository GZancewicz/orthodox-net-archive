document.addEventListener('DOMContentLoaded', function() {
    // Parse URL for filename (supports both query params and path-based URLs)
    const urlParams = new URLSearchParams(window.location.search);
    let fileName = urlParams.get('file');
    
    if (!fileName) {
        const pathMatch = window.location.pathname.match(/\/fathers\/(.+\.html)$/);
        if (pathMatch) {
            fileName = pathMatch[1];
        }
    }
    
    if (fileName) {
        // Fetch content via PHP fetcher
        fetch(`/fathers_fetcher.php?file=${encodeURIComponent(fileName)}`)
            .then(response => response.text())
            .then(html => {
                // Debug: Log raw HTML to check for malformation
                if (html.includes('src="" ..=""')) {
                    console.log('Malformed image detected in raw response');
                    const malformedMatch = html.match(/<img[^>]*src=""\s*\.\.=""[^>]*>/i);
                    if (malformedMatch) {
                        console.log('Malformed image tag:', malformedMatch[0]);
                    }
                }
                
                // Process and clean HTML
                html = cleanLegacyHTML(html);
                
                // Insert into placeholder
                document.getElementById('fathers-placeholder').innerHTML = html;
                
                // Update page title if found
                updatePageTitle();
                
                // Handle anchor navigation after content loads
                if (window.location.hash) {
                    // Small delay to ensure DOM is fully updated
                    setTimeout(function() {
                        const hash = window.location.hash;
                        console.log('Hash value:', hash);
                        
                        // Debug: List all anchors in the content
                        const allAnchors = document.querySelectorAll('[name], [id]');
                        console.log('Total anchors found:', allAnchors.length);
                        allAnchors.forEach(function(anchor) {
                            if (anchor.hasAttribute('name')) {
                                console.log('Anchor name:', anchor.getAttribute('name'));
                            }
                            if (anchor.hasAttribute('id')) {
                                console.log('Anchor id:', anchor.id);
                            }
                        });
                        
                        // Try multiple methods to find the anchor
                        let element = null;
                        const anchorName = hash.substring(1); // Remove the #
                        
                        // Method 1: Try as ID selector
                        element = document.querySelector(hash);
                        if (element) {
                            console.log('Found element using hash as ID selector');
                        }
                        
                        // Method 2: Try finding by name attribute (now that we convert to lowercase)
                        if (!element) {
                            element = document.querySelector('[name="' + anchorName + '"]');
                            if (element) {
                                console.log('Found element by name attribute');
                            }
                        }
                        
                        // Method 3: Try finding A tags with NAME attribute (in case conversion failed)
                        if (!element) {
                            const anchors = document.getElementsByTagName('A');
                            for (let i = 0; i < anchors.length; i++) {
                                if (anchors[i].getAttribute('NAME') === anchorName) {
                                    element = anchors[i];
                                    console.log('Found uppercase A NAME element');
                                    break;
                                }
                            }
                        }
                        
                        if (element) {
                            console.log('Scrolling to element:', element);
                            element.scrollIntoView();
                        } else {
                            console.log('No element found for hash:', hash);
                        }
                    }, 100);
                }
            })
            .catch(error => {
                document.getElementById('fathers-placeholder').innerHTML = 
                    '<p>Error loading content. Please try again later.</p>';
            });
    }
});

function cleanLegacyHTML(html) {
    // Debug: Check for malformed images at the start
    const malformedImages = html.match(/<img[^>]*src=""\s*\.\.=""[^>]*>/gi);
    if (malformedImages) {
        console.log('Found malformed images before cleaning:', malformedImages);
    }
    
    // Remove consecutive spaces and nbsp
    html = html.replace(/(&nbsp;|\s)+/g, ' ');
    
    // Remove [U*] artifacts
    html = html.replace(/\[U\*\]/g, '');
    
    // Unwrap font tags
    html = html.replace(/<font[^>]*>(.*?)<\/font>/gi, '$1');
    
    // Fix broken URLs
    html = html.replace(/http:\/\/www\.orthodox\.net\/\//g, '/');
    html = html.replace(/\/\//g, '/');
    
    // First, normalize single quotes to double quotes in href attributes
    html = html.replace(/href='([^']*)'/gi, 'href="$1"');
    
    // Convert relative media links to absolute production URLs
    html = html.replace(/href="([^"]*\.(mp3|pdf|doc|docx|rtf))"/gi, 
        'href="https://www.orthodox.net/fathers/$1"');
    
    // Fix relative links to other sections
    html = html.replace(/href="\.\.\/sermons\//gi, 'href="/sermons/');
    html = html.replace(/href="\.\.\/questions\//gi, 'href="/questions/');
    html = html.replace(/href="\.\.\/ustav\//gi, 'href="/ustav/');
    html = html.replace(/href="\.\.\/aboutus\//gi, 'href="/aboutus/');
    
    // Fix image sources - handle both quoted and unquoted attributes
    
    // FIRST: Fix the exact pattern you're seeing: src="" ..="" ikons="" john-of-damascus-01.jpg""=""
    html = html.replace(/src=""\s+\.\.=""\s+ikons=""\s+([^"]+)""=""/gi, 
        'src="https://www.orthodox.net/ikons/$1"');
    
    // Fix malformed image tags that might have broken attributes
    // This handles cases like: src="" ..="" ikons="" john-of-damascus-01.jpg""=""
    // First, let's fix the specific malformation pattern more aggressively
    html = html.replace(/<img([^>]*?)src=""\s*\.\.=""\s*([^"]+?)=""\s*([^"]+?)""=""([^>]*?)>/gi, 
        function(match, before, folder, filename, after) {
            console.log('Fixing malformed image - folder:', folder, 'filename:', filename);
            return '<img' + before + 'src="../' + folder + '/' + filename + '"' + after + '>';
        });
    
    // Also handle variation without the trailing =""
    html = html.replace(/<img([^>]*?)src=""\s*\.\.=""\s*([^"]+?)=""\s*([^"]+?)""([^>]*?)>/gi, 
        function(match, before, folder, filename, after) {
            console.log('Fixing malformed image (variant) - folder:', folder, 'filename:', filename);
            return '<img' + before + 'src="../' + folder + '/' + filename + '"' + after + '>';
        });
    
    // Debug: Check if we fixed any malformed images
    const stillMalformed = html.match(/<img[^>]*src=""\s*\.\.=""[^>]*>/gi);
    if (stillMalformed) {
        console.log('Still malformed after fix attempt:', stillMalformed);
    }
    
    // First, normalize ALL unquoted attributes to quoted ones (not just src)
    // This handles border=0, width=295, etc.
    html = html.replace(/(\s+)(\w+)=([^\s">]+)/gi, '$1$2="$3"');
    
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
            return 'src="https://www.orthodox.net/fathers/' + url + '"';
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
    
    // Remove old class attributes that might conflict (but preserve anchor names)
    html = html.replace(/class="[^"]*"/gi, '');
    
    // Fix character encoding issues
    html = html.replace(/â€™/g, "'");
    html = html.replace(/â€œ/g, '"');
    html = html.replace(/â€/g, '"');
    html = html.replace(/â€"/g, '—');
    html = html.replace(/â€¦/g, '...');
    
    // Ensure anchor tags are preserved - convert uppercase A NAME to lowercase for compatibility
    html = html.replace(/<A\s+NAME="([^"]+)"\s*><\/A>/gi, '<a name="$1"></a>');
    html = html.replace(/<A\s+NAME="([^"]+)"\s*>/gi, '<a name="$1">');
    
    // Debug: Check for any remaining uppercase anchors
    const upperAnchors = html.match(/<A\s+NAME=/gi);
    if (upperAnchors) {
        console.log('Remaining uppercase anchors after conversion:', upperAnchors.length);
    }
    
    return html;
}

function updatePageTitle() {
    const h3 = document.querySelector('#fathers-placeholder h3');
    if (h3) {
        document.title = h3.textContent + ' - St. Nicholas Orthodox Church';
    }
}