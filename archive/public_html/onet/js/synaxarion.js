function fetchSynaxarion() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so +1
    const day = today.getDate().toString().padStart(2, '0');

    const fileName = `${year}-${month}-${day}.html`;
    const filePath = `/calendar/data/${fileName}`;

    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const troparionHeader = doc.querySelector('.ptroparionheader');
            if (troparionHeader) {
                while (troparionHeader.nextSibling) {
                    troparionHeader.nextSibling.remove();
                }
                troparionHeader.remove();
            }
            let modifiedData = doc.body.innerHTML;

            // Added code to modify <img> elements to include alt=""
            const dom = new DOMParser().parseFromString(modifiedData, "text/html");
            const images = dom.querySelectorAll('img');
            images.forEach(img => {
                if (img.src.includes("jcal_img")) {
                    img.setAttribute("alt", "");
                }
            });
            modifiedData = new XMLSerializer().serializeToString(dom);

            // Substitute "http://" with "https://"
            modifiedData = modifiedData.replace(/http:\/\//g, 'https://');

            // Setting the extracted text to your target element.
            document.getElementById('synaxarion').innerHTML = modifiedData;

            // Add click handlers for saint links to open in modal
            setupSynaxarionModal();
        })
        .catch(error => {
            console.error('Error fetching and parsing the file:', error);
        });
}

function setupSynaxarionModal() {
    // Add click handlers to all links in synaxarion - open in new tab
    const synaxarion = document.getElementById('synaxarion');
    const links = synaxarion.querySelectorAll('a[href*="holytrinityorthodox.com"]');

    links.forEach(link => {
        const url = link.href.replace('http://', 'https://');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener';
    });
}

window.addEventListener('load', fetchSynaxarion);
