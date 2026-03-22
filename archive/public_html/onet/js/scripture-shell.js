window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    let fileName = urlParams.get('file');

    // If no ?file= param, try to extract from the path (e.g. /scripture/personal-savior.html)
    if (!fileName) {
        const match = window.location.pathname.match(/\/scripture\/([^\/]+\.html)$/);
        if (match) {
            fileName = match[1];
        }
    }

    const placeholder = document.getElementById('scripture-placeholder');

    if (fileName) {
        placeholder.innerHTML = `<h1>Loading scripture: ${fileName}</h1>`;

        // Debug: log the fetch URL
        const articlePath = '/scripture_fetcher.php?file=' + encodeURIComponent(fileName);
        console.log('Fetching:', articlePath);

        fetch(articlePath)
            .then(response => {
                console.log('Fetch response:', response);
                if (!response.ok) throw new Error('File not found');
                return response.text();
            })
            .then(html => {
                let processedHtml = html;

                // Replace multiple consecutive &nbsp;s and whitespace with a single space.
                processedHtml = processedHtml.replace(/(?:&nbsp;|\s){2,}/g, ' ');

                // Remove [U*] artifacts
                processedHtml = processedHtml.replace(/\[U\d+\]/g, '');

                console.log('Fetch result:', processedHtml);
                // Replace all <h1>-<h6> tags with <h4> tags
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = processedHtml;

                // Unwrap deprecated <font> tags to remove their formatting
                tempDiv.querySelectorAll('font').forEach(font => {
                    const parent = font.parentNode;
                    // Move all children of the <font> tag to be siblings before it
                    while (font.firstChild) {
                        parent.insertBefore(font.firstChild, font);
                    }
                    // Remove the now-empty <font> tag
                    parent.removeChild(font);
                });

                // Remove MS Office comment blocks
                tempDiv.querySelectorAll('div[onmouseover*="msoCommentShow"]').forEach(div => {
                    div.remove();
                });

                // Find paragraphs containing broken scripture URLs and fix them
                tempDiv.querySelectorAll('p.MsoBodyText[align="center"]').forEach(p => {
                    const text = (p.textContent || p.innerText);
                    // Regex to find the pattern of the broken URLs. It finds the base URL and then the first valid filename part.
                    const urlPattern = /https?:\/\/www\.orthodox\.net\/\/scripture\/.*(pentecost-[\w;+.-]+\.(?:html|rtf|pdf))/i;
                    const match = text.match(urlPattern);

                    if (match) {
                        // match[1] will have the correct filename part, e.g., "pentecost-tuesday-23..."
                        const finalUrl = `https://www.orthodox.net/scripture/${match[1]}`;
                        const a = document.createElement('a');
                        a.href = finalUrl;
                        a.textContent = finalUrl;
                        p.innerHTML = ''; // Clear the old content (the spans with the broken text)
                        p.appendChild(a);
                    }
                });

                // Also fix any other stray double slashes in existing hrefs.
                tempDiv.querySelectorAll('a').forEach(a => {
                    if (a.href) {
                        a.href = a.href.replace(/(https?:\/\/www\.orthodox\.net)\/\//, '$1/');
                        a.href = a.href.replace(/(www)\/\./g, '$1.');
                    }
                    if (a.textContent) {
                        a.textContent = a.textContent.replace(/(www)\/\./g, '$1.');
                    }
                });

                // Fix typo in image src URLs: change "orthodx.net" to "orthodox.net"
                tempDiv.querySelectorAll('img').forEach(img => {
                    if (img.src) {
                        img.src = img.src.replace(/orthodx\.net/g, 'orthodox.net');
                    }
                });
                
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
                                img.src = 'https://www.orthodox.net/scripture/' + originalSrc;
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
                                a.href = 'https://www.orthodox.net/scripture/' + a.href.split('/').pop();
                            }
                        }
                    }
                });

                // Remove all empty p tags
                tempDiv.querySelectorAll('p').forEach(p => {
                    if (p.innerHTML.trim() === '' || p.innerHTML.trim() === '&nbsp;') {
                        p.remove();
                    }
                });

                let contentContainer = tempDiv.querySelector('.WordSection1, .Section1, .natrow2, #row2');
                if (!contentContainer) {
                    contentContainer = tempDiv;
                }

                // Convert the first two paragraphs into headings
                const paragraphs = contentContainer.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    const h3 = document.createElement('h3');
                    h3.innerHTML = paragraphs[0].innerHTML;
                    // Clean up formatting tags
                    h3.querySelectorAll('b, u, i, span').forEach(tag => {
                        if (tag.closest('sup')) return;
                        const parent = tag.parentNode;
                        while (tag.firstChild) parent.insertBefore(tag.firstChild, tag);
                        parent.removeChild(tag);
                    });
                    paragraphs[0].replaceWith(h3);
                }
                if (paragraphs.length > 1) {
                    const h4 = document.createElement('h4');
                    h4.innerHTML = paragraphs[1].innerHTML;
                    // Clean up formatting tags
                    h4.querySelectorAll('b, u, i, span').forEach(tag => {
                        if (tag.closest('sup')) return;
                        const parent = tag.parentNode;
                        while (tag.firstChild) parent.insertBefore(tag.firstChild, tag);
                        parent.removeChild(tag);
                    });
                    paragraphs[1].replaceWith(h4);
                }

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

                // Convert heading tags according to new mapping: h1→h3, h2→h4, h3 and lower→h5
                for (let n = 1; n <= 6; n++) {
                    tempDiv.querySelectorAll('h' + n).forEach(h => {
                        // Do not convert the h5 and h6 elements we just created from MsoHeader
                        if (h.style.textAlign !== 'center') {
                            let newTag;
                            if (n === 1) {
                                newTag = 'h3';
                            } else if (n === 2) {
                                newTag = 'h4';
                            } else {
                                newTag = 'h5';
                            }

                            const newHeading = document.createElement(newTag);
                            // Copy attributes
                            for (const attr of h.attributes) {
                                newHeading.setAttribute(attr.name, attr.value);
                            }
                            newHeading.innerHTML = h.innerHTML;
                            h.replaceWith(newHeading);
                        }
                    });
                }

                // Center all headings
                tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
                    h.style.textAlign = 'center';
                });

                // Format OpenOffice/LibreOffice footnotes
                const footnoteAnchors = tempDiv.querySelectorAll('a[name^="sdfootnote"][name$="anc"]');
                if (footnoteAnchors.length > 0) {
                    // Superscript the in-text references
                    footnoteAnchors.forEach(anchor => {
                        if (anchor.parentNode) {
                            const sup = document.createElement('sup');
                            anchor.parentNode.insertBefore(sup, anchor);
                            sup.appendChild(anchor);
                        }
                    });

                    // Add a horizontal line before the footnotes section
                    const firstFootnote = tempDiv.querySelector('div[id^="sdfootnote"]');
                    if (firstFootnote) {
                        const hr = document.createElement('hr');
                        firstFootnote.parentNode.insertBefore(hr, firstFootnote);
                    }

                    // Add a space after the footnote number in the definition list
                    tempDiv.querySelectorAll('a[name^="sdfootnote"][name$="sym"]').forEach(anchor => {
                        const space = document.createTextNode(' ');
                        anchor.parentNode.insertBefore(space, anchor.nextSibling);
                    });
                }

                // Final cleanup: remove all font-family specifications to ensure consistency
                tempDiv.querySelectorAll('[style]').forEach(el => {
                    el.style.fontFamily = '';
                });

                placeholder.innerHTML = tempDiv.innerHTML;
            })
            .catch(err => {
                console.error('Fetch error:', err);
                placeholder.innerHTML = `<h2>Error loading scripture: ${err.message}</h2>`;
            });
    } else {
        placeholder.innerHTML = "<h2>No scripture specified.</h2>";
    }
}; 