document.addEventListener('DOMContentLoaded', function () {
    // Select all links ending in ".html"
    const articleLinks = document.querySelectorAll('a[href$=".html"]');

    articleLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Stop default link navigation

            const filename = this.getAttribute('href').replace('.html', '');
            const url = `${CONFIG.FLASK_BACKEND_URL}/legacy_article?filename=${filename}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.body) {
                        // Store the article content in sessionStorage
                        sessionStorage.setItem('articleContent', data.body);

                        // Navigate to article.html
                        window.location.href = 'article.html';
                    } else {
                        alert('Failed to load article content.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching article:', error);
                    alert('Error loading article.');
                });
        });
    });
});
