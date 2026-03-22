fetch('../catechism/_files.json')
    .then(response => response.json())
    .then(data => {
        let sectionNames = new Set(data.map(item => item.section_name));

        let sections = [...sectionNames].map(name => {
            let topics = Array.from(new Set(data.filter(item => item.section_name === name).map(item => item.subtopic)));
            let topicDivs = topics.map(subtopic =>
                `<div class="row">
                    <div class="row" style="padding-bottom:5px;">
                    <div class="six columns" style="text-align:center;">${subtopic}</div>
                    <div class="six columns" style="text-align:center;">${generateLinks(data, name, subtopic)}</div>
                </div>`
            ).join('');

            return `
                <section class="section section-main">
                    <div class="container">
                        <div class="row">
                            <h5>${name}</h5>
                            ${topicDivs}
                        </div>
                    </div>
                </section>
            `;
        }).join('');

        document.getElementById('sections').innerHTML += sections;
    });

function generateLinks(data, sectionName, subtopicName) {
    let subtopicData = data.filter(item => item.subtopic === subtopicName && item.section_name === sectionName);
    let links = '';
    subtopicData.forEach(item => {
        item.formats.forEach(format => {
            let filePath;
            if (format === 'mp3') {
                filePath = "http://media.orthodox.net/catechism/" + item.file + '.' + format;
            } else {
                filePath = item.path + item.file + '.' + format;
            }
            links += `<a href="${filePath}"> ${format} </a>`;
        });
    });
    return links;
}
