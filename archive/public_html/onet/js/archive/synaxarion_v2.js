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
            const modifiedData = doc.body.innerHTML;
            // const pdataheaderText = doc.querySelector('.pdataheader').textContent;

            // Setting the extracted text to your target element.
            // document.getElementById('synaxarion').innerHTML = pdataheaderText;
            document.getElementById('synaxarion').innerHTML = modifiedData;
        })
        .catch(error => {
            console.error('Error fetching and parsing the file:', error);
        });


}

// window.onload = fetchSynaxarion;
window.addEventListener('load', fetchSynaxarion);
