// Get the containers
const articleContainer = document.querySelector('#article-content');
const titleContainer = document.querySelector('#article-title');

// Function to extract and center images from Ghost API content
function extractAndCenterImages(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const figures = tempDiv.querySelectorAll('figure.kg-image-card, div.kg-card');

    figures.forEach(figure => {
        if (figure.classList.contains('kg-image-card')) {
            const img = figure.querySelector('img');
            if (img) {
                const newImage = document.createElement('img');
                newImage.src = img.src;
                newImage.alt = img.alt || 'Image';
                newImage.classList.add('blog-image');

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                imageContainer.appendChild(newImage);

                figure.parentNode.replaceChild(imageContainer, figure);
            }
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

    fetch(`https://onet-flask-backend-1f4c6a3f01c8.herokuapp.com/onet_article?article_id=${articleId}`)
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
