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
            // Helper function to extract the onet_n value from the tags
            const getOnetTagValue = (tags) => {
                for (let tag of tags) {
                    const match = tag.match(/^onet_(\d+)$/);
                    if (match) {
                        return parseInt(match[1], 10);
                    }
                }
                return null;
            };

            // Sort the response
            response.sort((a, b) => {
                const aOnetValue = getOnetTagValue(a.tags);
                const bOnetValue = getOnetTagValue(b.tags);

                if (aOnetValue !== null && bOnetValue !== null) {
                    return bOnetValue - aOnetValue; // Descending order for onet_n tags
                } else if (aOnetValue !== null) {
                    return -1;
                } else if (bOnetValue !== null) {
                    return 1;
                } else {
                    return new Date(b.posted_at) - new Date(a.posted_at); // Descending order for posted_at
                }
            });

            // Slice the response to get only the first 10 articles
            const topArticles = response.slice(0, 10);

            // Create a container to hold the articles
            const articlesContainer = document.createElement('div');

            topArticles.forEach(article => {
                // Create a div for each article
                const articleDiv = document.createElement('div');
                articleDiv.style.marginBottom = '20px';

                // Create and append the title
                const titleElement = document.createElement('h5');
                titleElement.textContent = article.title;
                articleDiv.appendChild(titleElement);

                // Create and append the author
                const authorElement = document.createElement('p');
                authorElement.textContent = `${article.authors.join(', ')}`;
                articleDiv.appendChild(authorElement);

                // Create and append the date
                const dateElement = document.createElement('p');
                dateElement.textContent = `Published ${new Date(article.posted_at).toLocaleDateString()}`;
                articleDiv.appendChild(dateElement);

                // Create and append the excerpt
                const excerptElement = document.createElement('p');
                excerptElement.textContent = `${article.excerpt || 'No excerpt available.'}`;
                articleDiv.appendChild(excerptElement);

                // Append the article div to the container
                articlesContainer.appendChild(articleDiv);

                // Create and append a horizontal line as a separator
                const hrElement = document.createElement('hr');
                articlesContainer.appendChild(hrElement);
            });

            // Clear any previous content and add the new list of articles
            titleContainer.innerHTML = 'Available Articles:';
            articleContainer.innerHTML = '';
            articleContainer.appendChild(articlesContainer);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});
