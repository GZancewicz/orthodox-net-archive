// Get the carousel container
const articleContainer = document.querySelector('#article-content');
const titleContainer = document.querySelector('#article-title');

// Load the videos when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch(`${CONFIG.FLASK_BACKEND_URL}/test_article`)
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
