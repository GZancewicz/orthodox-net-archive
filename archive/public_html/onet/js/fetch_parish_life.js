document.addEventListener('DOMContentLoaded', () => {
    fetch(`${CONFIG.FLASK_BACKEND_URL}/parish_life`)
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
                container.className = 'container responsive-container'; // Add responsive class
                container.style.display = 'flex'; // Use flexbox for layout
                container.style.alignItems = 'center'; // Center items vertically

                // Create a content column
                const contentColumn = document.createElement('div');
                contentColumn.style.flex = '2'; // Adjust flex value as needed

                // Add title
                const titleElement = document.createElement('h5');
                titleElement.textContent = data.title;
                contentColumn.appendChild(titleElement);

                // Add featured image if available
                if (data.featured_image) {
                    const imageElement = document.createElement('img');
                    imageElement.src = data.featured_image;
                    imageElement.alt = 'Featured Image';
                    imageElement.classList.add('centered-image');
                    contentColumn.appendChild(imageElement);
                }

                // Add content
                const contentElement = document.createElement('div');
                contentElement.innerHTML = data.content;
                contentColumn.appendChild(contentElement);

                // Create a links column
                const linksColumn = document.createElement('div');
                linksColumn.style.flex = '1'; // Adjust flex value as needed
                linksColumn.style.marginLeft = '20px'; // Add some space between columns

                // Add link to the address section
                const linkElement = document.createElement('a');
                linkElement.href = '#address-section';
                linkElement.textContent = 'Parish Contact Information';
                linkElement.style.display = 'block';
                linkElement.style.marginTop = '10px';
                linksColumn.appendChild(linkElement);

                // Add link to the top section
                const upcomingServicesLink = document.createElement('a');
                upcomingServicesLink.href = '#top-section';
                upcomingServicesLink.textContent = 'Upcoming Services';
                upcomingServicesLink.style.display = 'block';
                upcomingServicesLink.style.marginTop = '10px';
                linksColumn.appendChild(upcomingServicesLink);

                // Add link to the blog listing section
                const latestPostsLink = document.createElement('a');
                latestPostsLink.href = '#blog-listing';
                latestPostsLink.textContent = 'Latest Posts';
                latestPostsLink.style.display = 'block';
                latestPostsLink.style.marginTop = '10px';
                linksColumn.appendChild(latestPostsLink);

                // Add link to the video carousel section
                const latestVideosLink = document.createElement('a');
                latestVideosLink.href = '#video-carousel';
                latestVideosLink.textContent = 'Latest Videos';
                latestVideosLink.style.display = 'block';
                latestVideosLink.style.marginTop = '10px';
                linksColumn.appendChild(latestVideosLink);

                // Append columns to the container
                container.appendChild(contentColumn);
                container.appendChild(linksColumn);

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