function lastHomily() {
    const url = "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyCaji-TZ8z0AqNdKGMHrz4gufRgnweO3c8&playlistId=PL34BF84D60CF33D5D&maxResults=10&part=snippet";
    changeToHomilies();
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const items = data['items'];
            console.log(items);
            document.getElementById("last-homily").innerHTML =
                "<section id='latest-section' class='section section-main'>";
            let rowstr = "<div class='container'><h5>Latest Homilies</h5>";
            for (let i = 0; i < items.length; i++) {
                let infstr = items[i]['snippet']['title'];
                infstr = infstr.split(".")[0];
                let imageUrl = items[i]['snippet']['thumbnails']['default']['url'];
                let videoId = items[i]['snippet']['resourceId']['videoId'];
                let desc = "<div class='row homily-description'>"
                desc += "<div class='three columns'>"
                desc += "<img"
                desc += " class='u-max-full-width'"
                desc += " src='" + imageUrl + "'"
                desc += ">" // end img
                desc += "</div>" // end three columns
                desc += "<div class='nine columns'>"
                desc += "<a href='https://www.youtube.com/watch?v=" + videoId + "'>"
                desc += infstr;
                desc += "</a>" // end a
                desc += "</div>" // end nine columns
                desc += "</div>"; // end row
                rowstr += desc;
            }
            rowstr += "<div class='row'>";
            rowstr += "<a href='https://www.youtube.com/@orthodoxnet/videos' class='button'>View More</a>";
            rowstr += "</div>"; // end row
            rowstr += "</div>"; // end container
            rowstr += "</section>"; // end section
            document.getElementById("latest-section").innerHTML = rowstr
        });
}

