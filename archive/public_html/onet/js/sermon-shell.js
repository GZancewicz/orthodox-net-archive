window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    let fileName = urlParams.get('file');

    // If no ?file= param, try to extract from the path (e.g. /sermons/personal-savior.html)
    if (!fileName) {
        const match = window.location.pathname.match(/\/sermons\/([^\/]+\.html)$/);
        if (match) {
            fileName = match[1];
        }
    }

    const placeholder = document.getElementById('sermon-placeholder');

    if (fileName) {
        placeholder.innerHTML = `<h1>Loading article: ${fileName}</h1>`;

        // Debug: log the fetch URL
        const articlePath = '/sermon_fetcher.php?file=' + encodeURIComponent(fileName);
        console.log('Fetching:', articlePath);

        fetch(articlePath)
            .then(response => {
                console.log('Fetch response:', response);
                if (!response.ok) throw new Error('File not found');
                return response.text();
            })
            .then(html => {
                let processedHtml = html;

                // Remove content between MsoBodyText and MsoFootnoteText
                const startRegex = /<[a-z]+[^>]*class\s*=\s*["']?[^"'>]*MsoBodyText[^"'>]*["']?[^>]*>/i;
                const endRegex = /<p[^>]*class\s*=\s*["']?[^"'>]*MsoFootnoteText[^"'>]*["']?[^>]*>/i;

                const startIndex = processedHtml.search(startRegex);
                const endIndex = processedHtml.search(endRegex);

                if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                    // Keep the content before the start, and the content from the end onwards.
                    processedHtml = processedHtml.substring(0, startIndex) + processedHtml.substring(endIndex);
                } else if (startIndex !== -1) {
                    // If there's a start but no end (no footnotes), just truncate from that point.
                    processedHtml = processedHtml.substring(0, startIndex);
                }

                console.log('Fetch result:', processedHtml);
                // Replace all <h1>-<h6> tags with <h4> tags
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = processedHtml;

                // Remove all <style> tags
                tempDiv.querySelectorAll('style').forEach(style => {
                    style.remove();
                });

                // Remove all style attributes from elements
                tempDiv.querySelectorAll('*').forEach(element => {
                    if (element.hasAttribute('style')) {
                        element.removeAttribute('style');
                    }
                });

                // Convert <p class=MsoHeader> to <h5> tags (first one) and <h6> tags (subsequent ones)
                const msoHeaders = tempDiv.querySelectorAll('p.MsoHeader');
                msoHeaders.forEach((p, index) => {
                    const isFirst = index === 0;
                    const heading = document.createElement(isFirst ? 'h5' : 'h6');
                    heading.style.textAlign = 'center';
                    if (!isFirst) {
                        heading.style.fontStyle = 'italic';
                        heading.style.fontSize = '1.8rem';
                    }
                    heading.innerHTML = p.innerHTML;
                    p.replaceWith(heading);
                });

                // Remove all other class attributes
                tempDiv.querySelectorAll('[class]').forEach(element => {
                    element.removeAttribute('class');
                });

                for (let n = 1; n <= 6; n++) {
                    tempDiv.querySelectorAll('h' + n).forEach(h => {
                        // Do not convert the h5 and h6 elements we just created
                        if (h.style.textAlign !== 'center') {
                            const h4 = document.createElement('h4');
                            // Copy attributes
                            for (const attr of h.attributes) {
                                h4.setAttribute(attr.name, attr.value);
                            }
                            h4.innerHTML = h.innerHTML;
                            h.replaceWith(h4);
                        }
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
                                img.src = 'https://www.orthodox.net/sermons/' + originalSrc;
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
                                a.href = 'https://www.orthodox.net/sermons/' + a.href.split('/').pop();
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