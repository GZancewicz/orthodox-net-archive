// Links shell JavaScript handler
document.addEventListener('DOMContentLoaded', function() {
    // Parse the URL to get the requested page
    const urlParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    
    // Extract the filename from the path
    // For URLs like /links/rocor.html, extract rocor.html
    const pathParts = currentPath.split('/');
    const filename = pathParts[pathParts.length - 1];
    
    // Skip if we're on the index page
    if (filename === 'index.html' || filename === '' || currentPath.endsWith('/')) {
        return;
    }
    
    // Show loading message
    document.getElementById('loading-message').style.display = 'block';
    document.getElementById('legacy-content').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    
    // Fetch the legacy content
    fetch('/links_fetcher.php?file=' + encodeURIComponent(filename))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading message
            document.getElementById('loading-message').style.display = 'none';
            
            // Update the page title
            if (data.title) {
                document.title = data.title;
            }
            
            // Clean and display the content
            const cleanedContent = cleanContent(data.content);
            document.getElementById('legacy-content').innerHTML = cleanedContent;
            document.getElementById('legacy-content').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching content:', error);
            document.getElementById('loading-message').style.display = 'none';
            document.getElementById('error-message').style.display = 'block';
        });
});

function cleanContent(html) {
    // Create a temporary div to work with the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove script tags
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Fix image paths
    // Handle unquoted attributes first
    tempDiv.innerHTML = tempDiv.innerHTML.replace(/src=([^"'\s>]+)/gi, 'src="$1"');
    
    // Now fix all image sources
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
        let src = img.getAttribute('src');
        if (src) {
            // Convert relative paths to absolute URLs
            if (src.startsWith('../')) {
                // Remove ../ and point to production server
                src = 'https://www.orthodox.net/' + src.substring(3);
            } else if (!src.startsWith('http') && !src.startsWith('//')) {
                // Relative to current folder
                src = 'https://www.orthodox.net/links/' + src;
            }
            img.setAttribute('src', src);
        }
    });
    
    // Fix link paths
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
        let href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
            // Handle cross-folder references
            if (href.startsWith('../')) {
                // Convert to absolute path
                href = '/' + href.substring(3);
            } else if (href.includes('.pdf') || href.includes('.doc') || href.includes('.docx') || 
                       href.includes('.mp3') || href.includes('.wav') || href.includes('.rtf')) {
                // Media files stay on production server
                if (!href.startsWith('http') && !href.startsWith('//')) {
                    href = 'https://www.orthodox.net/links/' + href;
                }
            } else if (href.includes('.html') && !href.startsWith('http') && !href.startsWith('//')) {
                // HTML files use new routing
                href = '/links/' + href;
            }
            link.setAttribute('href', href);
        }
    });
    
    // Fix background attributes
    const elementsWithBg = tempDiv.querySelectorAll('[background]');
    elementsWithBg.forEach(elem => {
        let bg = elem.getAttribute('background');
        if (bg) {
            if (bg.startsWith('../')) {
                bg = 'https://www.orthodox.net/' + bg.substring(3);
            } else if (!bg.startsWith('http') && !bg.startsWith('//')) {
                bg = 'https://www.orthodox.net/links/' + bg;
            }
            elem.style.backgroundImage = 'url(' + bg + ')';
            elem.removeAttribute('background');
        }
    });
    
    // Remove outdated HTML attributes
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(elem => {
        elem.removeAttribute('bgcolor');
        elem.removeAttribute('text');
        elem.removeAttribute('link');
        elem.removeAttribute('vlink');
        elem.removeAttribute('alink');
    });
    
    // Clean up empty paragraphs and divs
    const emptyElements = tempDiv.querySelectorAll('p:empty, div:empty');
    emptyElements.forEach(elem => {
        if (!elem.querySelector('*')) {
            elem.remove();
        }
    });
    
    return tempDiv.innerHTML;
}