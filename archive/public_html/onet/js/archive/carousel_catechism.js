// Get the carousel container and the arrow buttons
const catechismCarouselContainer = document.querySelector('#videos-catechism');
const catechismScrollLeft = document.getElementById('catechism-scroll-left');
const catechismScrollRight = document.getElementById('catechism-scroll-right');

// Index to track the current video being displayed
let currentCatechismVideoIndex = 0;

// Load videos into the carousel
// Not clear that this is needed
function formatCatechismDuration(duration) {
    const minutesMatch = duration.match(/(\d+)M/);
    const secondsMatch = duration.match(/(\d+)S/);
    const minutes = minutesMatch ? minutesMatch[1] : "0";
    const seconds = secondsMatch ? secondsMatch[1].padStart(2, '0') : "00";
    return `${minutes}:${seconds}`;
}

function loadCatechismCarouselVideos(videos) {
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const videoDiv = document.getElementById(`carousel-catechism-video-${i + 1}`);
        // Assuming your video divs have a similar structure as #video-one, #video-two, etc.
        videoDiv.innerHTML = `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${(video.url.match(/https:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9_-]+)/) || [null, 'undefined'])[1]}" frameborder="0"></iframe>
            </div>
            <p>${video.title}</p>
            <hr class="small-only">
        `;
    }
}

// Event listener for the left arrow button
catechismScrollLeft.addEventListener('click', () => {
    if (currentCatechismVideoIndex > 0) {
        currentCatechismVideoIndex -= 1;
    } else {
        currentCatechismVideoIndex = 9;
    }
    catechismCarouselContainer.style.transform = `translateX(-${currentCatechismVideoIndex * 50}%)`;
}
);

// Event listener for the right arrow button
catechismScrollRight.addEventListener('click', () => {
    if (currentCatechismVideoIndex < 9) {
        currentCatechismVideoIndex += 1;
    } else {
        currentCatechismVideoIndex = 0;
    }
    catechismCarouselContainer.style.transform = `translateX(-${currentCatechismVideoIndex * 50}%)`;
}
);

// Load the videos when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // fetch('videos.json')
    fetch('https://onet-flask-backend-1f4c6a3f01c8.herokuapp.com/catechism_videos')
        .then(response => response.json())
        .then(data => {
            const sortedVideos = data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
            return sortedVideos.slice(0, 10);
        })
        .then(videos => {
            loadCatechismCarouselVideos(videos);
        });
});
