// Get the containers
const articleContainer = document.querySelector('#article-content');
const titleContainer = document.querySelector('#article-title');

// Get the tag sidebar container
const tagSidebar = document.querySelector('#tag-sidebar');

// Function to fetch and display tags with checkboxes
const fetchAndDisplayTags = (articles) => {
    const tagCounts = {};
    let untaggedCount = 0;

    articles.forEach(article => {
        if (article.tags.length === 0 || (article.tags.length === 1 && article.tags.includes('orthodox_net'))) {
            untaggedCount++;
        } else {
            article.tags.forEach(tag => {
                // Exclude tags starting with "onet_" or "Onet_"
                if (!tag.toLowerCase().startsWith('onet_') && tag !== 'orthodox_net') {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                }
            });
        }
    });

    // Convert the tagCounts object to an array and sort it by count in descending order
    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

    // Create a list of checkboxes for tags
    const tagList = document.createElement('ul');

    // "Select All" checkbox
    const selectAllItem = document.createElement('li');
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'select-all';
    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = tagList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        filterArticlesBySelectedTags(articles);
    });
    selectAllItem.appendChild(selectAllCheckbox);
    selectAllItem.appendChild(document.createTextNode('Select All'));
    tagList.appendChild(selectAllItem);

    // "Untagged" checkbox with count
    const untaggedItem = document.createElement('li');
    const untaggedCheckbox = document.createElement('input');
    untaggedCheckbox.type = 'checkbox';
    untaggedCheckbox.value = 'untagged';
    untaggedCheckbox.addEventListener('change', () => filterArticlesBySelectedTags(articles));
    untaggedItem.appendChild(untaggedCheckbox);
    untaggedItem.appendChild(document.createTextNode(`Untagged (${untaggedCount})`));
    tagList.appendChild(untaggedItem);

    sortedTags.forEach(([tag, count]) => {
        const listItem = document.createElement('li');
        const tagCheckbox = document.createElement('input');
        tagCheckbox.type = 'checkbox';
        tagCheckbox.value = tag;
        tagCheckbox.addEventListener('change', () => filterArticlesBySelectedTags(articles));

        // Capitalize single-word tags
        const displayTag = tag.includes(' ') ? tag : tag.charAt(0).toUpperCase() + tag.slice(1);

        listItem.appendChild(tagCheckbox);
        listItem.appendChild(document.createTextNode(`${displayTag} (${count})`));
        tagList.appendChild(listItem);
    });

    // Clear any previous content and add the new list of tags
    tagSidebar.innerHTML = '';
    tagSidebar.appendChild(tagList);
};

// Function to filter articles by selected tags
const filterArticlesBySelectedTags = (articles) => {
    const selectedTags = Array.from(tagSidebar.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    // If no tags are selected, display all articles
    if (selectedTags.length === 0) {
        displayArticles(articles);
        return;
    }

    const filteredArticles = articles.filter(article => {
        if (selectedTags.includes('untagged') && (article.tags.length === 0 || (article.tags.length === 1 && article.tags.includes('orthodox_net')))) {
            return true;
        }
        return selectedTags.some(tag => article.tags.includes(tag));
    });

    displayArticles(filteredArticles);
};

// Function to display articles
const displayArticles = (articles) => {
    // Create a table to hold the titles and dates
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    articles.forEach(article => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(article.posted_at).toLocaleDateString();
        dateCell.style.padding = '8px';
        dateCell.style.textAlign = 'left';

        const titleCell = document.createElement('td');
        const link = document.createElement('a');
        link.textContent = article.title;

        // Format the link URL
        let link_url = article.url.replace('https://orthodox-net.ghost.io', '');
        link_url = link_url.replace(/^\/|\/$/g, ''); // Remove leading and trailing slashes

        // Set the href attribute
        link.href = `/post.html?${link_url}&id=${article.id}`;
        link.style.textDecoration = 'none';

        titleCell.appendChild(link);
        titleCell.style.padding = '8px';
        titleCell.style.textAlign = 'left';

        row.appendChild(dateCell);
        row.appendChild(titleCell);
        table.appendChild(row);
    });

    titleContainer.innerHTML = '';
    articleContainer.innerHTML = '';
    articleContainer.appendChild(table);
};

// Function to create links for articles
const createArticleLinks = (articles) => {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    articles.forEach(article => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(article.posted_at).toLocaleDateString();
        dateCell.style.padding = '8px';
        dateCell.style.textAlign = 'left';

        const titleCell = document.createElement('td');
        const link = document.createElement('a');
        link.textContent = article.title;

        // Format the link URL
        let link_url = article.url.replace('https://orthodox-net.ghost.io', '');
        link_url = link_url.replace(/^\/|\/$/g, ''); // Remove leading and trailing slashes

        // Set the href attribute
        link.href = `/post.html?${link_url}&id=${article.id}`;
        link.style.textDecoration = 'none';

        titleCell.appendChild(link);
        titleCell.style.padding = '8px';
        titleCell.style.textAlign = 'left';

        row.appendChild(dateCell);
        row.appendChild(titleCell);
        table.appendChild(row);
    });

    // Clear previous content and append the new table
    const articleContainer = document.querySelector('#article-content');
    articleContainer.innerHTML = '';
    articleContainer.appendChild(table);
};

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
            console.log(response);
            fetchAndDisplayTags(response);
            createArticleLinks(response);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});