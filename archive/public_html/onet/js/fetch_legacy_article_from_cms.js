// Get the carousel container
const articleContainer = document.querySelector('#article-content');
const titleContainer = document.querySelector('#article-title');

// Load the videos when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Extract the article_id from the element with class 'article-id' inside the '#article-content' div
    const articleIdElement = articleContainer.querySelector('.article-id');
    const articleId = articleIdElement ? articleIdElement.getAttribute('data-id') : null;

    if (!articleId) {
        console.error('Could not find article_id');
        return;
    }

    fetch(`${CONFIG.FLASK_BACKEND_URL}/onet_article?article_id=${articleId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            titleContainer.innerHTML = response["title"];
            articleContainer.innerHTML = response["content"];
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});
