document.addEventListener('DOMContentLoaded', function() {
    // Parse URL for filename (supports both query params and path-based URLs)
    const urlParams = new URLSearchParams(window.location.search);
    let fileName = urlParams.get('file');
    
    if (!fileName) {
        const pathMatch = window.location.pathname.match(/\/services\/(.+\.html)$/);
        if (pathMatch) {
            fileName = pathMatch[1];
        }
    }
    
    if (fileName) {
        // Fetch content via PHP fetcher
        fetch(`/services_fetcher.php?file=${encodeURIComponent(fileName)}`)
            .then(response => response.text())
            .then(html => {
                // Process and clean HTML
                html = cleanLegacyHTML(html);
                
                // Insert into placeholder
                document.getElementById('services-placeholder').innerHTML = html;
                
                // Update page title if found
                updatePageTitle();
                
                // Handle anchor navigation after content loads
                setTimeout(function() {
                    if (window.location.hash) {
                        const element = document.querySelector(window.location.hash);
                        if (element) {
                            element.scrollIntoView();
                        }
                    }
                }, 100);
            })
            .catch(error => {
                document.getElementById('services-placeholder').innerHTML = 
                    '<p>Error loading content. Please try again later.</p>';
            });
    }
});

function cleanLegacyHTML(html) {
    // Remove consecutive spaces and nbsp
    html = html.replace(/(&nbsp;|\s)+/g, ' ');
    
    // Remove [U*] artifacts
    html = html.replace(/\[U\*\]/g, '');
    
    // Unwrap font tags
    html = html.replace(/<font[^>]*>(.*?)<\/font>/gi, '$1');
    
    // Fix broken URLs
    html = html.replace(/http:\/\/www\.orthodox\.net\/\//g, '/');
    html = html.replace(/\/\//g, '/');
    
    // Convert relative media links to absolute production URLs
    html = html.replace(/href="([^"]*\.(mp3|pdf|doc|docx|rtf))"/gi, 
        'href="https://www.orthodox.net/services/$1"');
    
    // Fix relative links to other sections
    html = html.replace(/href="\.\.\/sermons\//gi, 'href="/sermons/');
    html = html.replace(/href="\.\.\/questions\//gi, 'href="/questions/');
    html = html.replace(/href="\.\.\/ustav\//gi, 'href="/ustav/');
    html = html.replace(/href="\.\.\/aboutus\//gi, 'href="/aboutus/');
    html = html.replace(/href="\.\.\/greatlent\//gi, 'href="/greatlent/');
    
    // Fix image sources - handle both quoted and unquoted attributes
    
    // Fix any malformed image tags if needed
    // Example pattern for malformed tags: src="" ..="" folder="" filename""=""
    // html = html.replace(/src=""\s+\.\.=""\s+(\w+)=""\s+([^"]+)""=""/gi, 
    //     'src="https://www.orthodox.net/$1/$2"');
    
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
            return 'src="https://www.orthodox.net/' + url + '"';
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
    
    // Remove all style tags and inline styles (except centering and float)
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    html = html.replace(/style="[^"]*"/gi, function(match) {
        if (match.includes('text-align: center') || match.includes('float:')) {
            return match;
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
    
    // Normalize single quotes in href attributes to double quotes
    html = html.replace(/href='([^']*)'/gi, 'href="$1"');
    
    return html;
}

function updatePageTitle() {
    const h3 = document.querySelector('#services-placeholder h3');
    if (h3) {
        document.title = h3.textContent + ' - St. Nicholas Orthodox Church';
    }
}