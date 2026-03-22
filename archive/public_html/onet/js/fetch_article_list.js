// Get the containers
const articleContainer = document.querySelector('#article-content');
const titleContainer = document.querySelector('#article-title');

// Load the articles when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch(`${CONFIG.FLASK_BACKEND_URL}/onet_article_data`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            // console.log(response);
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

            // Limit to 10 most recent posts
            const recentPosts = response.slice(0, 10);

            // Create a table to hold the titles and dates
            const table = document.createElement('table');
            table.style.width = '100%'; // Optional: Set table width
            table.style.borderCollapse = 'collapse'; // Optional: Remove space between table cells

            recentPosts.forEach(article => {
                // Create a table row for each article
                const row = document.createElement('tr');

                // Create a cell for the posted_at date
                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(article.posted_at).toLocaleDateString(); // Format the date as needed
                dateCell.style.padding = '8px'; // Optional: Add padding
                dateCell.style.textAlign = 'left'; // Left justify content

                // Create a cell for the title
                const titleCell = document.createElement('td');
                const link = document.createElement('a');
                link.textContent = article.title;
                // link.href = `/blog_post.html?id=${article.id}`; // Assuming you want to pass the article ID as a query parameter
                link_url = article.url.replace('https://orthodox-net.ghost.io', '');
                link.href = `/blog_post.html?${link_url}&id=${article.id}`; // Assuming you want to pass the article ID as a query parameter
                link.style.textDecoration = 'none'; // Optional: Remove underline if needed
                titleCell.appendChild(link);
                titleCell.style.padding = '8px'; // Optional: Add padding
                titleCell.style.textAlign = 'left'; // Left justify content

                // Append cells to the row
                row.appendChild(dateCell);
                row.appendChild(titleCell);

                // Append the row to the table
                table.appendChild(row);
            });

            // Add "All Posts ..." link
            const moreRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            const moreCell = document.createElement('td');
            const moreLink = document.createElement('a');
            moreLink.textContent = 'All Posts ...';
            moreLink.href = '/all_posts.html';
            moreLink.style.textDecoration = 'none'; // Optional: Remove underline if needed
            moreLink.style.fontSize = '120%'; // Increase font size by 20%
            moreCell.appendChild(moreLink);
            moreCell.style.padding = '8px'; // Optional: Add padding
            moreCell.style.textAlign = 'left'; // Left justify content

            moreRow.appendChild(emptyCell);
            moreRow.appendChild(moreCell);
            table.appendChild(moreRow);

            // Clear any previous content and add the new table of titles
            titleContainer.innerHTML = '';
            articleContainer.innerHTML = '';
            articleContainer.appendChild(table);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});
