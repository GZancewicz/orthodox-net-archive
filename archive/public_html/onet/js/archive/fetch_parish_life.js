document.addEventListener('DOMContentLoaded', () => {
    fetch('https://onet-flask-backend-1f4c6a3f01c8.herokuapp.com/parish_life')
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
                newSection.id = 'parish-life';

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

                // Insert the new section at the beginning of the page content
                if (pageContent) {
                    pageContent.insertBefore(newSection, pageContent.firstChild);
                    console.log('Section inserted successfully.');
                } else {
                    console.log('Page content div not found.');
                }
            } else {
                console.log('No valid data received.');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});