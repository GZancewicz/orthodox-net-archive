
function calendarFirstDateTime() {
    const today = new Date();
    // return today.toISOString();
    return today;
}

function calendarLastDateTime() {
    const lastDateTime = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    // return lastDateTime.toISOString();
    return lastDateTime;
}

function calendarUrl() {
    let url = "https://www.googleapis.com/calendar/v3/calendars/s37s3qvlf9nobhplqp0umlcafs@group.calendar.google.com/events?key=AIzaSyCaji-TZ8z0AqNdKGMHrz4gufRgnweO3c8&orderBy=startTime&singleEvents=true&timeZone=America/Chicago";
    // url += "&timeMin=" + new Date().toISOString();
    // url += "&timeMax=" + new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    url += "&timeMin=" + calendarFirstDateTime().toISOString();
    url += "&timeMax=" + calendarLastDateTime().toISOString();
    return url;
}

function differenceInDays(startDate, endDate) {
    const diffInMs = Math.abs(endDate - startDate);
    return diffInMs / (1000 * 60 * 60 * 24);
}

function calendarMonthDay(date) {
    return new Date(date).toLocaleString('en-US', { month: 'long', day: 'numeric' });
}

function calendarDateRange(startDatestr, endDatestr) {
    // return new Date(datestr).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const startDate = new Date(startDatestr);
    const endDate = new Date(endDatestr);
    // const start = startDate.toLocaleString('en-US', { month: 'long', day: 'numeric' });
    // const end = endDate.toLocaleString('en-US', { month: 'long', day: 'numeric' });
    start = calendarMonthDay(startDate);
    end = calendarMonthDay(endDate);
    if (differenceInDays(startDate, endDate) > 1) {
        return start + " to " + end;
    } else {
        return start;
    }
    // const datestr = start + " to " + end;
    // return datestr;
}

function calendarItemDate(item) {
    let date;
    if (item['start']['date']) {
        startDatestr = item['start']['date'];
        endDatestr = item['end']['date'];
        date = calendarDateRange(startDatestr, endDatestr);
    } else {
        datestr = item['start']['dateTime'];
        date = calendarMonthDay(datestr);
    }
    // let datestr = date.substring(0, 10);
    return date;
}

function calendarItemTime(item) {
    let datestr = item['start']['dateTime'];
    if (datestr) {
        // return date;
        const date = new Date(datestr);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else {
        return "&nbsp;";
    }
    // let datestr = date.substring(0, 10);
    // return date;
}

function signupUrl(str) {
    // Detect signup.com URL from Google calendar event description
    const textLinks = str.split("https://");
    // console.log(textLinks);
    let urlstr = textLinks[textLinks.length - 1];
    urlstr = "https://" + urlstr.split("</a>")[0];
    // url = url.replace(".", "");
    let signupList = urlstr.split("/go/")[1]
    signupList = signupList.replace(".", "");
    let url = "http://signup.com/go/" + signupList;
    // console.log("URL: " + url);
    return url
}

function confessionDescription(item) {
    const url = signupUrl(item['description']);
    let summary = item['summary'];
    summary = summary.replace("please signup", "<a href='" + url + "'>signup here</a>");
    return summary;
}

function getItemSummary(item) {
    let summary = item['summary'];
    if (summary.includes("Confession")) {
        return confessionDescription(item);
    } else {
        return summary;
    }
}

function eraseCalendar() {
    document.getElementById("calendar").innerHTML = "";
}

function getCalendarEvents() {
    // var calendar = CalendarApp.getCalendarById("CALENDAR_ID");
    fetch(calendarUrl())
        .then((response) => response.json())
        .then((data) => {
            const items = data['items'];
            // console.log(items);
            document.getElementById("calendar").innerHTML =
                "<section id='calendar-section' class='section section-main'></section>";
            let rowstr = "<div class='container'>";
            rowstr += "<div class='row'>";
            rowstr += "<div class='eight columns'>";
            rowstr += "<h5>Parish Calendar</h5>";
            let lastDate = "";
            let nextDate = "";
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                // let infstr = item['summary'];
                let infstr = getItemSummary(item);
                let desc = "<div class='row event-description'>"

                desc += "<div class='four columns'>";
                // desc += item['start']['dateTime'];
                nextDate = calendarItemDate(item);
                if (lastDate != nextDate) {
                    desc += nextDate;
                } else {
                    desc += "&nbsp;";
                }
                lastDate = nextDate;
                // desc += calendarItemDate(item);
                desc += "</div>" // end columns

                desc += "<div class='two columns'>";
                // desc += item['start']['dateTime'];
                desc += calendarItemTime(item);
                desc += "</div>" // end columns

                desc += "<div class='four columns'>"

                desc += infstr;

                desc += "</div>" // end columns
                desc += "</div>"; // end row
                rowstr += desc;
            }
            // rowstr += "</div>"; // end row
            rowstr += "</div>"; // end calendar columns
            rowstr += "<div class='four columns'>";
            // rowstr += "<h5>Latest Homily</h5>";
            rowstr += "<div id='latest-homily' class='row'></div>";
            rowstr += "<a class='button' href='#' onClick='latestHomilies()'>More Homilies</a>"
            rowstr += "<p></p>";
            rowstr += "<div id='latest-childrens' class='row'></div>";
            rowstr += "<a class='button' href='#' onClick='latestChildrensSermons()'>More Childrens Homilies</a>"
            rowstr += "<p></p>";
            rowstr += "<div id='latest-catechesis' class='row'></div>";
            rowstr += "<a class='button' href='#' onClick='latestCatechesis()'>More Catechesis Homilies</a>"
            rowstr += "</div>"; // end homily columns
            rowstr += "<div class='four columns'><div id='latest-news' class='row'></div></div>";
            rowstr += "</div>"; // end row
            rowstr += "</div>"; // end container
            document.getElementById("calendar-section").innerHTML = rowstr
            getLatestHomily();
            getLatestChildrens();
            getLatestCatechesis();
            // console.log(items);
        });
}

// function getLatestHomily() {
//     const url = "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyCaji-TZ8z0AqNdKGMHrz4gufRgnweO3c8&playlistId=PL34BF84D60CF33D5D&maxResults=1&part=snippet";
//     fetch(url)
//         .then((response) => response.json())
//         .then((data) => {
//             const item = data['items'][0];
//             let infstr = item['snippet']['title'];
//             infstr = infstr.split(".")[0];
//             let imageUrl = item['snippet']['thumbnails']['default']['url'];
//             let videoId = item['snippet']['resourceId']['videoId'];
//             console.log(imageUrl);
//             console.log(videoId);
//             // let rowstr = "<h5>Latest Homily</h5>";
//             let rowstr = "<div class='video-container'>";
//             rowstr += "<iframe "
//             rowstr += "class='video' ";
//             rowstr += "frameborder='0' ";
//             rowstr += "allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' ";
//             rowstr += "allowfullscreen ";
//             rowstr += "src='https://www.youtube.com/embed/" + videoId + "'";
//             rowstr += ">";
//             rowstr += "</iframe>";
//             rowstr += "</div>"; // end video-container
//             rowstr += "<p></p>";
//             rowstr += "<h6><em>" + infstr + "</em></h6>";
//             document.getElementById("latest-homily").innerHTML = rowstr;
//         });
// }

function getLatestHomily() {
    getPlaylistVideo("PL34BF84D60CF33D5D", "latest-homily", "Latest Homily");
}

function getLatestChildrens() {
    getPlaylistVideo("PLEh2brXYUf7nIigGqPthPFw4ApKiIu9zW", "latest-childrens", "Latest Children's Homily");
}

function getLatestCatechesis() {
    getPlaylistVideo("PLEh2brXYUf7k06I4K0dgAJC11A3TlgpFK", "latest-catechesis", "Latest Catechesis");
}

function getPlaylistVideo(playlistId, divId, subtitle = "") {
    const url = "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyCaji-TZ8z0AqNdKGMHrz4gufRgnweO3c8&playlistId=" + playlistId + "&maxResults=1&part=snippet";
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const item = data['items'][0];
            let infstr = item['snippet']['title'];
            infstr = infstr.split(".")[0];
            let imageUrl = item['snippet']['thumbnails']['default']['url'];
            let videoId = item['snippet']['resourceId']['videoId'];
            console.log(imageUrl);
            console.log(videoId);
            // let rowstr = "<h5>Latest Homily</h5>";
            let rowstr = "<div class='video-container'>";
            rowstr += "<iframe "
            rowstr += "class='video' ";
            rowstr += "frameborder='0' ";
            rowstr += "allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' ";
            rowstr += "allowfullscreen ";
            rowstr += "src='https://www.youtube.com/embed/" + videoId + "'";
            rowstr += ">";
            rowstr += "</iframe>";
            rowstr += "</div>"; // end video-container
            rowstr += "<p></p>";
            rowstr += "<h6><em>" + infstr + "</em>"
            if (subtitle != "") {
                rowstr += " (" + subtitle + ")";
            }
            rowstr += "</h6>";
            document.getElementById(divId).innerHTML = rowstr;
        });
}