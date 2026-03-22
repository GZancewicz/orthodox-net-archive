// Get the containers
const articleContainer = document.querySelector('#article-content');
const titleContainer = document.querySelector('#article-title');

// Load the articles when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://onet-flask-backend-1f4c6a3f01c8.herokuapp.com/onet_article_data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            // Create a list to hold the titles
            const titlesList = document.createElement('ul');

            response.forEach(article => {
                // Create a list item for each title
                const listItem = document.createElement('li');
                listItem.textContent = article.title;
                titlesList.appendChild(listItem);
            });

            // Clear any previous content and add the new list of titles
            titleContainer.innerHTML = 'Latest Posts:';
            articleContainer.innerHTML = '';
            articleContainer.appendChild(titlesList);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});
