
function getLatestBlogs() {
    const url = "https://orthodox-net.ghost.io/ghost/api/content/posts?key=92d9fba0166f18286270a8b43b&limit=10";
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const items = data['posts']
            // console.log(items);
            document.getElementById("blogs").innerHTML =
                "<section id='blog-list' class='section section-main'></section>";
            let rowstr = "<div class='container'>";
            rowstr += "<div class='row'>";
            rowstr += "<h5>Texts</h5>";
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                // console.log(item['excerpt']);
                // rowstr += "<p><a href='#' onClick='changeToBlogPost()'>" + item['title'] + "</a></p>";
                rowstr += "<p><a href='#' onClick='changeToBlogPost(&quot;" + item['id'] + "&quot;)'>" + item['title'] + "</a></p>";
            }
            rowstr += "<a class='button' href='#'>More</a>"
            rowstr += "</div>"; // end row
            rowstr += "</div>"; // end container
            rowstr += "</section>"; // end section
            document.getElementById("blog-list").innerHTML = rowstr;
        });
}

function blogContent(blogId) {
    const url = "https://orthodox-net.ghost.io/ghost/api/content/posts/" + blogId + "?key=92d9fba0166f18286270a8b43b";
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const item = data['posts'][0]
            const html = item['html'];
            console.log(item);
            let htmlstr = "<h5>" + item['title'] + "</h5>";
            htmlstr += "<p>Published " + blogDate(item) + "</p>";
            htmlstr += html;
            document.getElementById("post-content").innerHTML = htmlstr;
            const kgcards = document.getElementsByClassName("kg-card");
            if (kgcards.length > 0) {
                const kgcard = kgcards[0];
                const player = kgcard.getElementsByClassName("kg-audio-player-container")[0].childNodes[0]
                audioSource = player.getAttribute("src");
                audioStr = "<audio controls><source src='" + audioSource + "' type='audio/mpeg'></audio>";
                audioStr += "<p></p>";
                document.getElementsByClassName("kg-card")[0].innerHTML = audioStr;
            }
        });
}

function blogDate(item) {
    const date = new Date(item['published_at'])
    const datestr = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    return datestr;
}

function eraseBlogs() {
    document.getElementById("blogs").innerHTML = "";
}


