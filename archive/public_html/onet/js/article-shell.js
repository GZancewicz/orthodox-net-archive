window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    let fileName = urlParams.get('file');

    // If no ?file= param, try to extract from the path (e.g. /articles/personal-savior.html)
    if (!fileName) {
        const match = window.location.pathname.match(/\/articles\/([^\/]+\.html)$/);
        if (match) {
            fileName = match[1];
        }
    }

    const placeholder = document.getElementById('article-placeholder');

    if (fileName) {
        placeholder.innerHTML = `<h1>Loading article: ${fileName}</h1>`;

        // Debug: log the fetch URL
        const articlePath = '/article_fetcher.php?file=' + encodeURIComponent(fileName);
        console.log('Fetching:', articlePath);

        fetch(articlePath)
            .then(response => {
                console.log('Fetch response:', response);
                if (!response.ok) throw new Error('File not found');
                return response.text();
            })
            .then(html => {
                console.log('Fetch result:', html);
                // Replace all <h1>-<h6> tags with <h4> tags
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                for (let n = 1; n <= 6; n++) {
                    tempDiv.querySelectorAll('h' + n).forEach(h => {
                        const h4 = document.createElement('h4');
                        // Copy attributes
                        for (const attr of h.attributes) {
                            h4.setAttribute(attr.name, attr.value);
                        }
                        h4.innerHTML = h.innerHTML;
                        h.replaceWith(h4);
                    });
                }
                
                // Convert relative media links to absolute URLs
                // Handle images with relative paths
                tempDiv.querySelectorAll('img').forEach(img => {
                    if (img.src) {
                        // Get the original src attribute (before browser processing)
                        const originalSrc = img.getAttribute('src');
                        if (originalSrc) {
                            // Handle ../ relative paths
                            if (originalSrc.startsWith('../')) {
                                const relativePath = originalSrc.substring(3); // Remove ../
                                img.src = 'https://www.orthodox.net/' + relativePath;
                            }
                            // Handle local files with no path (e.g., "averky_ab.jpg")
                            else if (!originalSrc.includes('/') && !originalSrc.startsWith('http')) {
                                img.src = 'https://www.orthodox.net/articles/' + originalSrc;
                            }
                        }
                    }
                });
                
                // Convert relative links to media files
                tempDiv.querySelectorAll('a').forEach(a => {
                    if (a.href) {
                        const mediaExtensions = /\.(jpg|jpeg|png|gif|webp|mp3|wav|pdf|doc|docx|rtf|txt|zip)$/i;
                        if (mediaExtensions.test(a.href)) {
                            // Handle ../ relative paths
                            if (a.href.includes('../')) {
                                const relativePath = a.href.split('../').pop();
                                a.href = 'https://www.orthodox.net/' + relativePath;
                            }
                            // Handle local relative paths (no ../ or http)
                            else if (!a.href.startsWith('http') && !a.href.startsWith('/')) {
                                a.href = 'https://www.orthodox.net/articles/' + a.href.split('/').pop();
                            }
                        }
                    }
                });
                
                placeholder.innerHTML = tempDiv.innerHTML;
            })
            .catch(err => {
                console.error('Fetch error:', err);
                placeholder.innerHTML = `<h2>Error loading article: ${err.message}</h2>`;
            });
    } else {
        placeholder.innerHTML = "<h2>No article specified.</h2>";
    }
};