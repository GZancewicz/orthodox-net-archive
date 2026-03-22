// Get the containers
const articleContainer = document.querySelector('#article-content');
const titleContainer = document.querySelector('#article-title');

// Function to extract and center images from Ghost API content
function extractAndCenterImages(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const figures = tempDiv.querySelectorAll('figure.kg-image-card, figure.kg-gallery-card, div.kg-card');

    figures.forEach(figure => {
        if (figure.classList.contains('kg-image-card') || figure.classList.contains('kg-gallery-card')) {
            const images = figure.querySelectorAll('img');
            images.forEach(img => {
                const newImage = document.createElement('img');
                newImage.src = img.src;
                newImage.alt = img.alt || 'Image';
                newImage.classList.add('responsive-image'); // Add a specific class for styling

                const row = document.createElement('div');
                row.classList.add('row');

                const column = document.createElement('div');
                column.classList.add('twelve', 'columns', 'image-container'); // Add image-container class
                column.style.display = 'flex';
                column.style.justifyContent = 'center'; // Center the image

                // Check if the figure has a figcaption with a URL
                const figcaption = figure.querySelector('figcaption');
                if (figcaption && figcaption.textContent.trim().startsWith('https://')) {
                    const link = document.createElement('a');
                    link.href = figcaption.textContent.trim();
                    link.appendChild(newImage);
                    column.appendChild(link);
                } else {
                    column.appendChild(newImage);
                    // If no URL, append the caption below the image
                    if (figcaption) {
                        const captionText = document.createElement('div');
                        captionText.textContent = figcaption.textContent;
                        captionText.classList.add('image-caption'); // Add a class for styling captions
                        column.appendChild(captionText);
                    }
                }

                row.appendChild(column);
                figure.parentNode.insertBefore(row, figure);
            });

            // Remove the original figure after processing all images
            figure.remove();
        } else if (figure.classList.contains('kg-file-card')) {
            // Remove the icon div
            const iconDiv = figure.querySelector('.kg-file-card-icon');
            if (iconDiv) {
                iconDiv.remove();
            }

            const fileTitle = figure.querySelector('.kg-file-card-title');
            const fileLink = figure.querySelector('a');

            if (fileTitle && fileLink) {
                const link = document.createElement('a');
                link.href = fileLink.href;
                link.textContent = fileTitle.textContent;
                link.classList.add('file-download-link');

                figure.parentNode.replaceChild(link, figure);
            }
        }
    });

    return tempDiv.innerHTML;
}

// Load the article when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    if (!articleId) {
        console.error('Could not find article_id in the URL');
        return;
    }

    fetch(`${CONFIG.FLASK_BACKEND_URL}/onet_article?article_id=${articleId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            console.log(`Fetching article ${articleId}`);
            console.log(response);

            // Log the featured image URL
            console.log('Featured Image URL:', response.featured_image);

            // Create a container for the image
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            // Create an image element for the featured image
            const featuredImage = document.createElement('img');
            featuredImage.src = response.featured_image;
            featuredImage.alt = 'Featured Image';
            featuredImage.classList.add('centered-image');

            // Append the image to the container
            imageContainer.appendChild(featuredImage);

            // Handle image loading errors
            featuredImage.onerror = () => {
                console.error('Failed to load featured image');
                featuredImage.style.display = 'none';
            };

            // Insert the image container above the title
            titleContainer.parentNode.insertBefore(imageContainer, titleContainer);

            // Update the page with the fetched title and content
            titleContainer.textContent = response.title;
            articleContainer.innerHTML = extractAndCenterImages(response.content);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});
