// Get the containers
const articleContainer = document.querySelector('#article-content');
const titleContainer = document.querySelector('#article-title');

// Get the tag filters container
const tagFilters = document.querySelector('#tag-filters');

// Track selected tags
let selectedTags = new Set();

// Function to fetch and display tags as pills
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

    // Clear container
    tagFilters.innerHTML = '';

    // "Clear" pill (hidden initially)
    const clearPill = document.createElement('span');
    clearPill.className = 'tag-pill clear-btn';
    clearPill.textContent = 'Clear All';
    clearPill.style.display = 'none';
    clearPill.addEventListener('click', () => {
        selectedTags.clear();
        updatePillStyles();
        filterArticlesBySelectedTags(articles);
    });
    tagFilters.appendChild(clearPill);

    // "Untagged" pill
    if (untaggedCount > 0) {
        const pill = document.createElement('span');
        pill.className = 'tag-pill';
        pill.dataset.tag = 'untagged';
        pill.textContent = `Untagged (${untaggedCount})`;
        pill.addEventListener('click', () => toggleTag('untagged', articles));
        tagFilters.appendChild(pill);
    }

    // Tag pills
    sortedTags.forEach(([tag, count]) => {
        const pill = document.createElement('span');
        pill.className = 'tag-pill';
        pill.dataset.tag = tag;

        // Capitalize single-word tags
        const displayTag = tag.includes(' ') ? tag : tag.charAt(0).toUpperCase() + tag.slice(1);
        pill.textContent = `${displayTag} (${count})`;

        pill.addEventListener('click', () => toggleTag(tag, articles));
        tagFilters.appendChild(pill);
    });
};

// Toggle tag selection
const toggleTag = (tag, articles) => {
    if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
    } else {
        selectedTags.add(tag);
    }
    updatePillStyles();
    filterArticlesBySelectedTags(articles);
};

// Update pill active states and clear button visibility
const updatePillStyles = () => {
    const pills = tagFilters.querySelectorAll('.tag-pill');
    const clearBtn = tagFilters.querySelector('.clear-btn');

    pills.forEach(pill => {
        if (pill.classList.contains('clear-btn')) return;
        if (selectedTags.has(pill.dataset.tag)) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });

    // Show/hide clear button
    if (clearBtn) {
        clearBtn.style.display = selectedTags.size > 0 ? 'inline-block' : 'none';
    }
};

// Function to filter articles by selected tags
const filterArticlesBySelectedTags = (articles) => {
    // If no tags are selected, display all articles with pagination
    if (selectedTags.size === 0) {
        displayArticlesWithPagination(articles);
        return;
    }

    const filteredArticles = articles.filter(article => {
        if (selectedTags.has('untagged') && (article.tags.length === 0 || (article.tags.length === 1 && article.tags.includes('orthodox_net')))) {
            return true;
        }
        return [...selectedTags].some(tag => article.tags.includes(tag));
    });

    // Display filtered articles with pagination
    displayArticlesWithPagination(filteredArticles);
};

// Function to display articles with pagination
const displayArticlesWithPagination = (articles, currentPage = 1, articlesPerPage = 15) => {
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const articlesToDisplay = articles.slice(start, end);

    // Create a table to hold the titles and dates
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    articlesToDisplay.forEach(article => {
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
        // link.href = `/post.html?${link_url}&id=${article.id}`;
        link.href = `/posts/${link_url}`;
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

    // Create pagination controls only if there is more than one page
    if (totalPages > 1) {
        const paginationControls = document.createElement('div');
        paginationControls.style.textAlign = 'center';
        paginationControls.style.marginTop = '20px';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.style.margin = '0 5px';
            pageButton.disabled = i === currentPage;

            // Highlight the current page button
            if (i === currentPage) {
                pageButton.style.backgroundColor = '#1c5880'; // Example highlight color
                pageButton.style.color = '#fff';
            }

            pageButton.addEventListener('click', () => displayArticlesWithPagination(articles, i, articlesPerPage));
            paginationControls.appendChild(pageButton);
        }

        articleContainer.appendChild(paginationControls);
    }
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
    fetch(`${CONFIG.FLASK_BACKEND_URL}/onet_article_data`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            // Filter out posts with the tag 'parish_life' and 'motd'
            const filteredArticles = response.filter(article =>
                !article.tags.includes('parish_life') && !article.tags.includes('motd')
            );
            // Process the filtered articles
            fetchAndDisplayTags(filteredArticles);
            displayArticlesWithPagination(filteredArticles);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});