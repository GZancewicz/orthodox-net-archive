document.addEventListener('DOMContentLoaded', () => {
    // Fetch and insert MOTD
    fetch(`${CONFIG.FLASK_BACKEND_URL}/motd`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Log the parsed JSON response

            // Check if the response is valid
            if (data && Object.keys(data).length > 0) {
                console.log('Valid response received, creating section.');

                // Create a new section element
                const newSection = document.createElement('section');
                newSection.className = 'section section-main';
                newSection.id = 'message-of-the-day';

                // Create a container div
                const container = document.createElement('div');
                container.className = 'container';

                // Add title
                const titleElement = document.createElement('h5');
                titleElement.textContent = data.title;
                container.appendChild(titleElement);

                // Add featured image if available
                if (data.featured_image) {
                    const imageElement = document.createElement('img');
                    imageElement.src = data.featured_image;
                    imageElement.alt = 'Featured Image';
                    imageElement.classList.add('centered-image');
                    container.appendChild(imageElement);
                }

                // Add content
                const contentElement = document.createElement('div');
                contentElement.innerHTML = data.content;
                container.appendChild(contentElement);

                // Append the container to the section
                newSection.appendChild(container);

                // Find the page content div
                const pageContent = document.getElementById('page-content');

                // Insert the new section at the top of the page content
                if (pageContent) {
                    pageContent.insertBefore(newSection, pageContent.firstChild);
                    console.log('MOTD section inserted successfully at the top.');
                } else {
                    console.log('Page content div not found.');
                }
            } else {
                console.log('No valid data received.');
                throw new Error('No valid data for MOTD');
            }
        })
        .then(() => {
            // Now fetch the Parish Life section
            return fetch(`${CONFIG.FLASK_BACKEND_URL}/parish_life`);
        })
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
                    const titleElement = document.createElement('h5');
                    titleElement.textContent = data.title;
                    container.appendChild(titleElement);

                    // Add content
                    const contentElement = document.createElement('div');
                    contentElement.innerHTML = data.content;
                    container.appendChild(contentElement);

                    // Append the container to the section
                    newSection.appendChild(container);

                    // Find the page content div
                    const pageContent = document.getElementById('page-content');

                    // Insert the new section after the MOTD section
                    const motdSection = document.getElementById('message-of-the-day');
                    if (pageContent && motdSection) {
                        pageContent.insertBefore(newSection, motdSection.nextSibling);
                        console.log('Parish Life section inserted successfully after MOTD.');
                    } else {
                        console.log('Page content div or MOTD section not found.');
                    }
                } else {
                    console.log('Parish Life section already exists.');
                }
            } else {
                console.log('No valid data received for Parish Life.');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});