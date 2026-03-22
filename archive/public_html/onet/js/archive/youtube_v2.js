document.addEventListener("DOMContentLoaded", function () {
    fetch('videos.json')
        .then(response => response.json())
        .then(data => {
            const sortedVideos = data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
            const latestVideos = sortedVideos.slice(0, 3);

            function formatDuration(duration) {
                const minutesMatch = duration.match(/(\d+)M/);
                const secondsMatch = duration.match(/(\d+)S/);
                const minutes = minutesMatch ? minutesMatch[1] : "0";
                const seconds = secondsMatch ? secondsMatch[1].padStart(2, '0') : "00";
                return `${minutes}:${seconds}`;
            }

            for (let i = 0; i < latestVideos.length; i++) {
                const video = latestVideos[i];
                const divId = `video-${["one", "two", "three"][i]}`;
                const div = document.getElementById(divId);

                const date = new Date(video.published_at).toLocaleDateString();
                const formattedDuration = formatDuration(video.duration);

                // Extract video ID from the video URL
                const videoId = video.url.split('v=')[1];

                const html = `
                    <div class="video-entry">
                        <h5>${video.title}</h5>
                        <div class="video-container">
                            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?modestbranding=1&controls=0" frameborder="0" allowfullscreen></iframe>
                            <div class="video-info">${date} | ${formattedDuration}</div>
                        </div>
                        <div class="twelve columns">
                            ${video.description}
                        </div>
                    </div>
                `;

                div.innerHTML = html;
            }
        })
        .catch(error => {
            console.error('Error fetching the videos:', error);
        });
});
