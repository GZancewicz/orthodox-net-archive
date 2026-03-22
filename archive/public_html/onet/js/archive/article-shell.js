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