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

            // Create a list to hold the titles
            const titlesList = document.createElement('ul');
            titlesList.style.listStyleType = 'none';  // Remove bullet points
            titlesList.style.paddingLeft = '0';       // Remove left padding

            response.forEach(article => {
                // Create a list item for each title
                const listItem = document.createElement('li');

                // Create an anchor element for the title
                const link = document.createElement('a');
                link.textContent = article.title;
                link.href = `/blog_post.html?id=${article.id}`; // Assuming you want to pass the article ID as a query parameter
                link.style.textDecoration = 'none'; // Optional: Remove underline if needed

                // Append the link to the list item
                listItem.appendChild(link);

                // Append the list item to the titles list
                titlesList.appendChild(listItem);
            });


            // Clear any previous content and add the new list of titles
            titleContainer.innerHTML = '';
            articleContainer.innerHTML = '';
            articleContainer.appendChild(titlesList);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});
