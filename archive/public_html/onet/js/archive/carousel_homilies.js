// Get the carousel container and the arrow buttons
const homiliesCarouselContainer = document.querySelector('#videos-homilies');
const homiliesScrollLeft = document.getElementById('homilies-scroll-left');
const homiliesScrollRight = document.getElementById('homilies-scroll-right');

// Index to track the current video being displayed
let currentHomiliesVideoIndex = 0;

// Load videos into the carousel
// Not clear that this is needed
function formatHomiliesDuration(duration) {
    const minutesMatch = duration.match(/(\d+)M/);
    const secondsMatch = duration.match(/(\d+)S/);
    const minutes = minutesMatch ? minutesMatch[1] : "0";
    const seconds = secondsMatch ? secondsMatch[1].padStart(2, '0') : "00";
    return `${minutes}:${seconds}`;
}

function loadHomiliesCarouselVideos(videos) {
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const videoDiv = document.getElementById(`carousel-homilies-video-${i + 1}`);
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
homiliesScrollLeft.addEventListener('click', () => {
    if (currentHomiliesVideoIndex > 0) {
        currentHomiliesVideoIndex -= 1;
    } else {
        currentHomiliesVideoIndex = 9;
    }
    homiliesCarouselContainer.style.transform = `translateX(-${currentHomiliesVideoIndex * 50}%)`;
}
);

// Event listener for the right arrow button
homiliesScrollRight.addEventListener('click', () => {
    if (currentHomiliesVideoIndex < 9) {
        currentHomiliesVideoIndex += 1;
    } else {
        currentHomiliesVideoIndex = 0;
    }
    homiliesCarouselContainer.style.transform = `translateX(-${currentHomiliesVideoIndex * 50}%)`;
}
);

// Load the videos when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // fetch('videos.json')
    fetch('https://onet-flask-backend-1f4c6a3f01c8.herokuapp.com/homilies_videos')
        .then(response => response.json())
        .then(data => {
            const sortedVideos = data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
            return sortedVideos.slice(0, 10);
        })
        .then(videos => {
            loadHomiliesCarouselVideos(videos);
        });
});
