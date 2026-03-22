// Get the containers
const articleContainer = document.querySelector('#article-content');
const titleContainer = document.querySelector('#article-title');

// Load the article when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Extract the article_id from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    if (!articleId) {
        console.error('Could not find article_id in the URL');
        return;
    }

    // Fetch the article using the extracted article_id
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
                featuredImage.style.display = 'none'; // Hide the image if it fails to load
            };

            // Insert the image container above the title
            titleContainer.parentNode.insertBefore(imageContainer, titleContainer);

            // Update the page with the fetched title and content
            titleContainer.textContent = response.title;
            articleContainer.innerHTML = response.content;  // Assuming the content is HTML formatted
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
});
