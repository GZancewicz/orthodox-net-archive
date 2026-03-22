fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        let sectionNames = new Set(data.map(item => item.topic));

        let sections = [...sectionNames].map(name => {
            let sectionData = data.find(item => item.topic === name);
            let subtopicNames = sectionData.subtopics.map(subtopic => subtopic.name);

            let subtopicElements = subtopicNames.map(subtopicName => {
                let subtopicData = sectionData.subtopics.find(subtopic => subtopic.name === subtopicName);
                let subtopicItems = subtopicData.items || [];
                let subtopicLinks = subtopicItems.map(item => {
                    return `<p><a href="${item.url}" style="margin-right: 10px;">${item.name}</a></p>`;
                }).join('');

                return `
                    <p style="font-size: 2rem; margin-top: 10px;">${subtopicName}</p>
                    ${subtopicLinks}
                `;
            }).join('');

            let sectionItems = sectionData.items || [];
            let sectionLinks = sectionItems.map(item => {
                return `<p><a href="${item.url}" style="margin-right: 10px;">${item.name}</p></a>`;
            }).join('');

            return `
                <section class="section section-main">
                    <a name="${sectionData.sectionid}"></a>
                    <div class="container">
                        <div class="row">
                            <h5>${name}</h5>
                            ${sectionLinks}
                            ${subtopicElements}
                      </div>
                    </div>
                </section>
            `;
        }).join('');

        // Prepending the section with <h4> Catechesis Questions and Answers </h4> to the generated sections
        let headerSection = `
            <section class="section section-main">
                <div class="container">
                    <div class="row">
                        <h4>Catechesis Questions and Answers</h4>
                        <div id="section-list"></div>
                    </div>
                </div>
            </section>
        `;



        document.getElementById('sections').innerHTML = headerSection + sections;
    });


fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        // Generate an unordered list with each topic as a list item and set the href attribute to the sectionid
        let topicsListHTML = `<ul>${data.map(item => `<li style="font-size:1.8rem;"><a href="#${item.sectionid}">${item.topic}</a></li>`).join('')}</ul>`;

        // Append this list to the #section-list div
        document.querySelector('#section-list').innerHTML = topicsListHTML;
    });
