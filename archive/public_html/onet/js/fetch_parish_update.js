document.addEventListener('DOMContentLoaded', () => {
    // Fetch and insert Parish Life
    fetch(`${CONFIG.FLASK_BACKEND_URL}/parish_life`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Parish Life API Response:', data); // Log the parsed JSON response

            // Check if the response is valid
            if (data && Object.keys(data).length > 0) {
                console.log('Valid response received, creating Parish Life section.');

                // Check if the Parish Life section already exists
                if (!document.getElementById('parish-life')) {
                    // Create a new section element
                    const newSection = document.createElement('section');
                    newSection.className = 'section section-main';
                    newSection.id = 'parish-life';

                    // Create a container div
                    const container = document.createElement('div');
                    container.className = 'container';

                    // Add title
                    const titleElement = document.createElement('h4');
                    titleElement.textContent = data.title;
                    titleElement.style.textAlign = 'center';
                    titleElement.style.margin = '30px 0';
                    container.appendChild(titleElement);

                    // Add featured image if available
                    if (data.featured_image) {
                        const imageElement = document.createElement('img');
                        imageElement.src = data.featured_image;
                        imageElement.alt = 'Featured Image';
                        imageElement.classList.add('featured-image');
                        imageElement.style.width = '90%';
                        imageElement.style.maxWidth = '90%';
                        imageElement.style.height = 'auto';
                        imageElement.style.margin = '20px auto 30px auto';
                        imageElement.style.display = 'block';
                        container.appendChild(imageElement);
                    }

                    // Add content
                    const contentElement = document.createElement('div');
                    contentElement.innerHTML = data.content;

                    // Apply styles to Ghost CMS images
                    const ghostImages = contentElement.querySelectorAll('.kg-image');
                    ghostImages.forEach(img => {
                        img.style.width = '90%';
                        img.style.maxWidth = '90%';
                        img.style.height = 'auto';
                        img.style.display = 'block';
                        img.style.margin = '20px auto';
                    });

                    // Apply styles to Ghost CMS image cards
                    const ghostCards = contentElement.querySelectorAll('.kg-image-card');
                    ghostCards.forEach(card => {
                        card.style.width = '100%';
                        card.style.maxWidth = '90%';
                        card.style.margin = '20px auto';
                        card.style.textAlign = 'center';
                    });

                    container.appendChild(contentElement);

                    // Remove links for now
                    // const linksColumn = document.createElement('div');
                    // linksColumn.style.flex = '1';
                    // linksColumn.style.marginLeft = '20px';

                    // Append links column to the container
                    // container.appendChild(linksColumn);

                    // Append the container to the section
                    newSection.appendChild(container);

                    // Find the page content div
                    const pageContent = document.getElementById('page-content');

                    // Insert the new section at the top of the page content
                    if (pageContent) {
                        pageContent.insertBefore(newSection, pageContent.firstChild);
                        console.log('Parish Life section inserted successfully.');
                    } else {
                        console.log('Page content div not found.');
                    }
                } else {
                    console.log('Parish Life section already exists.');
                }
            } else {
                console.log('No valid data received for Parish Life.');
            }
        })
        .then(() => {
            // Now fetch and insert MOTD if present
            return fetch(`${CONFIG.FLASK_BACKEND_URL}/motd`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('MOTD API Response:', data); // Log the parsed JSON response

            // Check if the response is valid
            if (data && Object.keys(data).length > 0) {
                console.log('Valid response received, creating MOTD section.');

                // Check if the MOTD section already exists
                if (!document.getElementById('message-of-the-day')) {
                    // Create a new section element
                    const newSection = document.createElement('section');
                    newSection.className = 'section section-main';
                    newSection.id = 'message-of-the-day';

                    // Create a container div
                    const container = document.createElement('div');
                    container.className = 'container';

                    // Add title
                    const titleElement = document.createElement('h4');
                    titleElement.textContent = data.title;
                    titleElement.style.textAlign = 'center';
                    titleElement.style.margin = '30px 0';
                    container.appendChild(titleElement);

                    // Add featured image if available
                    if (data.featured_image) {
                        const imageElement = document.createElement('img');
                        imageElement.src = data.featured_image;
                        imageElement.alt = 'Featured Image';
                        imageElement.classList.add('featured-image');
                        imageElement.style.width = '90%';
                        imageElement.style.maxWidth = '90%';
                        imageElement.style.height = 'auto';
                        imageElement.style.margin = '20px auto 30px auto';
                        imageElement.style.display = 'block';
                        container.appendChild(imageElement);
                    }

                    // Add content
                    const contentElement = document.createElement('div');
                    contentElement.innerHTML = data.content;

                    // Apply styles to Ghost CMS images
                    const ghostImages = contentElement.querySelectorAll('.kg-image');
                    ghostImages.forEach(img => {
                        img.style.width = '90%';
                        img.style.maxWidth = '90%';
                        img.style.height = 'auto';
                        img.style.display = 'block';
                        img.style.margin = '20px auto';
                    });

                    // Apply styles to Ghost CMS image cards
                    const ghostCards = contentElement.querySelectorAll('.kg-image-card');
                    ghostCards.forEach(card => {
                        card.style.width = '100%';
                        card.style.maxWidth = '90%';
                        card.style.margin = '20px auto';
                        card.style.textAlign = 'center';
                    });

                    container.appendChild(contentElement);

                    // Append the container to the section
                    newSection.appendChild(container);

                    // Find the page content div
                    const pageContent = document.getElementById('page-content');

                    // Insert the new section after the Parish Life section
                    const parishLifeSection = document.getElementById('parish-life');
                    if (pageContent && parishLifeSection) {
                        pageContent.insertBefore(newSection, parishLifeSection.nextSibling);
                        console.log('MOTD section inserted successfully after Parish Life.');
                    } else {
                        console.log('Page content div or Parish Life section not found.');
                    }
                } else {
                    console.log('MOTD section already exists.');
                }
            } else {
                console.log('No valid data received for MOTD.');
            }
        })
        .then(() => {
            // Ensure Latest Posts is always rendered
            const latestPostsSection = document.getElementById('blog-listing');
            if (!latestPostsSection) {
                const newSection = document.createElement('section');
                newSection.className = 'section section-main';
                newSection.id = 'blog-listing';

                const container = document.createElement('div');
                container.className = 'container';

                const titleRow = document.createElement('div');
                titleRow.className = 'row';
                const title = document.createElement('h5');
                title.style.textAlign = 'center';
                title.textContent = 'Latest Posts';
                titleRow.appendChild(title);
                container.appendChild(titleRow);

                const articleTitle = document.createElement('div');
                articleTitle.id = 'article-title';
                articleTitle.style.textAlign = 'center';
                container.appendChild(articleTitle);

                const articleContent = document.createElement('div');
                articleContent.id = 'article-content';
                articleContent.style.textAlign = 'center';
                container.appendChild(articleContent);

                newSection.appendChild(container);

                const pageContent = document.getElementById('page-content');
                if (pageContent) {
                    pageContent.appendChild(newSection);
                    console.log('Latest Posts section inserted successfully.');
                }
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
}); 