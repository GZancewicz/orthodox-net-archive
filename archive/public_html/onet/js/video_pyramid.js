// Video Pyramid - fetches 10 videos and displays in 5 rows of 2
(function() {
    function loadVideoPyramid(videos) {
        console.log('Loading video pyramid with', videos.length, 'videos');
        var rows = [
            { id: 'pyramid-row-1', count: 2, start: 0 },
            { id: 'pyramid-row-2', count: 2, start: 2 },
            { id: 'pyramid-row-3', count: 2, start: 4 },
            { id: 'pyramid-row-4', count: 2, start: 6 },
            { id: 'pyramid-row-5', count: 2, start: 8 }
        ];

        rows.forEach(function(row) {
            var container = document.getElementById(row.id);
            if (!container) return;

            var html = '';
            for (var i = row.start; i < row.start + row.count && i < videos.length; i++) {
                var video = videos[i];
                var match = video.url.match(/v=([a-zA-Z0-9_-]+)/);
                var videoId = match ? match[1] : '';
                var thumbnail = 'https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg';
                var watchUrl = 'https://www.youtube.com/watch?v=' + videoId;

                html += '<div class="video-thumb">' +
                    '<a href="' + watchUrl + '" target="_blank" rel="noopener">' +
                    '<img src="' + thumbnail + '" alt="' + video.title + '" loading="lazy">' +
                    '</a>' +
                    '<p>' + video.title + '</p>' +
                    '</div>';
            }
            container.innerHTML = html;
        });
    }

    // Wait for DOM to be ready, then fetch videos
    document.addEventListener('DOMContentLoaded', function() {
        // Check if pyramid container exists (only on index page)
        if (!document.getElementById('pyramid-row-1')) return;

        console.log('Video pyramid script loaded, fetching from:', CONFIG.FLASK_BACKEND_URL);
        fetch(CONFIG.FLASK_BACKEND_URL + '/latest_videos')
            .then(function(response) {
                console.log('Video API response status:', response.status);
                return response.json();
            })
            .then(function(data) {
                console.log('Video data received:', data.length, 'videos');
                var sortedVideos = data.sort(function(a, b) {
                    return new Date(b.published_at) - new Date(a.published_at);
                });
                return sortedVideos.slice(0, 10);
            })
            .then(function(videos) {
                loadVideoPyramid(videos);
            })
            .catch(function(error) {
                console.error('Error loading videos:', error);
            });
    });
})();
