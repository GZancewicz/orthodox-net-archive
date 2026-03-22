document.addEventListener('DOMContentLoaded', function() {
    console.log('Great Lent shell script loaded');
    
    // Extract filename from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let filename = urlParams.get('file');
    
    // Also check for path-based URLs
    if (!filename) {
        const path = window.location.pathname;
        const match = path.match(/\/greatlent\/([^\/]+\.html)$/);
        if (match) {
            filename = match[1];
        }
    }
    
    console.log('Filename:', filename);
    
    if (filename) {
        // Fetch the content
        fetch('/greatlent_fetcher.php?file=' + encodeURIComponent(filename))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(content => {
                console.log('Content fetched successfully');
                
                // Clean up the content
                let cleanedContent = content;
                
                // Remove any remaining style tags and their content
                cleanedContent = cleanedContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
                
                // Remove all style attributes
                cleanedContent = cleanedContent.replace(/\sstyle\s*=\s*["'][^"']*["']/gi, '');
                
                // Remove font tags
                cleanedContent = cleanedContent.replace(/<\/?font[^>]*>/gi, '');
                
                // Remove align attributes
                cleanedContent = cleanedContent.replace(/\salign\s*=\s*["'][^"']*["']/gi, '');
                
                // Remove bgcolor attributes
                cleanedContent = cleanedContent.replace(/\sbgcolor\s*=\s*["'][^"']*["']/gi, '');
                
                // Remove width/height attributes from non-image elements
                cleanedContent = cleanedContent.replace(/<(?!img)([^>]+)\s(width|height)\s*=\s*["'][^"']*["']/gi, '<$1');
                
                // Fix common encoding issues
                cleanedContent = cleanedContent.replace(/â€™/g, "'");
                cleanedContent = cleanedContent.replace(/â€œ/g, '"');
                cleanedContent = cleanedContent.replace(/â€/g, '"');
                cleanedContent = cleanedContent.replace(/â€"/g, '—');
                cleanedContent = cleanedContent.replace(/â€"/g, '–');
                cleanedContent = cleanedContent.replace(/Â /g, ' ');
                
                // Convert old-style headings to semantic HTML
                cleanedContent = cleanedContent.replace(/<p[^>]*>\s*<b>([^<]+)<\/b>\s*<\/p>/gi, '<h4>$1</h4>');
                cleanedContent = cleanedContent.replace(/<div[^>]*>\s*<b>([^<]+)<\/b>\s*<\/div>/gi, '<h4>$1</h4>');
                
                // Fix broken links
                cleanedContent = cleanedContent.replace(/href="(?!http|https|\/|#)([^"]+)"/gi, 'href="$1"');
                
                // Convert relative media links to absolute URLs
                // Handle src attributes for images and other media
                // First handle ../ relative paths
                cleanedContent = cleanedContent.replace(/src="\.\.\/([^"]+\.(jpg|jpeg|png|gif|webp|mp3|wav|pdf|doc|docx))"/gi, 'src="https://www.orthodox.net/$1"');
                // Then handle local files with no path (e.g., src="filename.jpg")
                cleanedContent = cleanedContent.replace(/src="([^"\/]+\.(jpg|jpeg|png|gif|webp|mp3|wav|pdf|doc|docx))"/gi, 'src="https://www.orthodox.net/greatlent/$1"');
                
                // Handle href attributes for downloadable files
                // First handle ../ relative paths
                cleanedContent = cleanedContent.replace(/href="\.\.\/([^"]+\.(jpg|jpeg|png|gif|webp|mp3|wav|pdf|doc|docx|rtf|txt|zip))"/gi, 'href="https://www.orthodox.net/$1"');
                // Then handle local files with no path
                cleanedContent = cleanedContent.replace(/href="(?!http|https|\/|#|\.\.|\/)([^"]+\.(jpg|jpeg|png|gif|webp|mp3|wav|pdf|doc|docx|rtf|txt|zip))"/gi, 'href="https://www.orthodox.net/greatlent/$1"');
                
                // Update the placeholder
                const placeholder = document.getElementById('greatlent-placeholder');
                if (placeholder) {
                    placeholder.innerHTML = cleanedContent;
                    
                    // Update page title if we can extract it
                    const h1 = placeholder.querySelector('h1');
                    if (h1) {
                        document.title = h1.textContent + ' - St Nicholas Orthodox Church';
                    }
                } else {
                    console.error('Placeholder element not found');
                }
            })
            .catch(error => {
                console.error('Error fetching content:', error);
                const placeholder = document.getElementById('greatlent-placeholder');
                if (placeholder) {
                    placeholder.innerHTML = '<h3>Error loading content</h3><p>Sorry, we couldn\'t load the requested Great Lent content. Please try again later or contact support.</p>';
                }
            });
    } else {
        console.error('No filename provided');
        const placeholder = document.getElementById('greatlent-placeholder');
        if (placeholder) {
            placeholder.innerHTML = '<h3>No content specified</h3><p>Please select a Great Lent resource from the index page.</p>';
        }
    }
});