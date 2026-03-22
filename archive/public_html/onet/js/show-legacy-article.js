document.addEventListener('DOMContentLoaded', function () {
    const articleDiv = document.getElementById('legacy-article');
    const urlParams = new URLSearchParams(window.location.search);
    const filename = urlParams.keys().next().value;

    console.log('Filename:', filename);

    if (filename) {
        const url = `${CONFIG.FLASK_BACKEND_URL}/legacy_article?filename=${filename}`;
        console.log('Fetching URL:', url);

        fetch(url)
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Failed to fetch article, status code: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                if (data.body) {
                    const updatedContent = data.body.replace(/<h1>/g, '<h2>').replace(/<\/h1>/g, '</h2>');
                    articleDiv.innerHTML = updatedContent;
                } else {
                    articleDiv.innerHTML = '<p>Error: Unable to load content.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching the article:', error);
                articleDiv.innerHTML = '<p>Error: Unable to load content.</p>';
            });
    } else {
        articleDiv.innerHTML = '<p>Error: No article specified.</p>';
    }
});