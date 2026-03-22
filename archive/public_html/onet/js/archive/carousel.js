// Get the carousel container and the arrow buttons
const carouselContainer = document.querySelector('.carousel-container');
const scrollLeft = document.getElementById('scroll-left');
const scrollRight = document.getElementById('scroll-right');

// Index to track the current video being displayed
let currentVideoIndex = 0;

// Load videos into the carousel
function formatDuration(duration) {
    const minutesMatch = duration.match(/(\d+)M/);
    const secondsMatch = duration.match(/(\d+)S/);
    const minutes = minutesMatch ? minutesMatch[1] : "0";
    const seconds = secondsMatch ? secondsMatch[1].padStart(2, '0') : "00";
    return `${minutes}:${seconds}`;
}

function loadCarouselVideos(videos) {
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const videoDiv = document.getElementById(`carousel-video-${i + 1}`);
        // Assuming your video divs have a similar structure as #video-one, #video-two, etc.
        videoDiv.innerHTML = `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${(video.url.match(/https:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9_-]+)/) || [null, 'undefined'])[1]}" frameborder="0"></iframe>
                <div class="video-info">${video.title}</div>
            </div>
        `;
    }
}

// Event listener for the left arrow button
scrollLeft.addEventListener('click', () => {
    if (currentVideoIndex > 0) {
        currentVideoIndex -= 1;
        carouselContainer.style.transform = `translateX(-${currentVideoIndex * 50}%)`;
    }
});

// Event listener for the right arrow button
scrollRight.addEventListener('click', () => {
    if (currentVideoIndex < 9) {
        currentVideoIndex += 1;
        carouselContainer.style.transform = `translateX(-${currentVideoIndex * 50}%)`;
    }
});

// Load the videos when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('videos.json')
        .then(response => response.json())
        .then(data => {
            const sortedVideos = data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
            return sortedVideos.slice(0, 10);
        })
        .then(videos => {
            loadCarouselVideos(videos);
        });
});
