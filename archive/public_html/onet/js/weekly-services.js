// Function to attempt fetching the schedule based on the date, decrementing days until found or limit reached
function fetchLatestSchedule(daysBack = 0) {
    const today = new Date();
    today.setDate(today.getDate() - daysBack);

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const dd = String(today.getDate()).padStart(2, '0');

    // Modified part: Fetching from the new API endpoint
    const apiUrl = `${CONFIG.FLASK_BACKEND_URL}/schedule`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data) {
                displayServices(data);
            }
        })
        .catch(error => {
            console.error("Error fetching the schedule:", error);
        });
}

// Format date from "Tue - Dec 2" to "Tue<br>Dec 2"
function formatDate(dateStr) {
    const match = dateStr.match(/(\w{3})\s*[-–]\s*(\w{3})\s+(\d+)/);
    if (match) {
        return `${match[1]}<br>${match[2]} ${match[3]}`;
    }
    return dateStr;
}

// Function to display the fetched weekly services
function displayServices(data) {
    let servicesHtml = `
        <table>
            <tbody>
    `;

    let currentDateStr = '';

    data.forEach((service, index) => {
        // Track the current date - if service.date is not empty, update it
        if (service.date && service.date.trim() !== '') {
            currentDateStr = service.date;
        }

        // Check if next service has a new date (non-empty date field)
        const nextService = (index < data.length - 1) ? data[index + 1] : null;
        const isLastOfDay = (nextService === null || (nextService.date && nextService.date.trim() !== ''));

        // Show date only if this service has a non-empty date
        const showDate = (service.date && service.date.trim() !== '');

        // First event of day: align time/description at bottom; subsequent events: align at top
        const timeAlign = showDate ? 'bottom' : 'top';

        servicesHtml += `
            <tr>
                <td style="vertical-align:middle;white-space:nowrap;text-align:center;">${showDate ? formatDate(service.date) : ''}</td>
                <td style="vertical-align:${timeAlign};">${service.time}</td>
                <td style="vertical-align:${timeAlign};">${service.service.includes("signup") ? service.service.replace("signup", '<a href="https://signup.com/go/GmQhOMA">signup</a>') : service.service}</td>
            </tr>
        `;

        // Add blank row after the last event of each day
        if (isLastOfDay) {
            servicesHtml += `
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            `;
        }
    });

    servicesHtml += `
            </tbody>
        </table>
    `;

    // Injecting the services into the #weekly-services div
    document.getElementById('weekly-services').innerHTML = servicesHtml;
}

function displayWeeklyServices() {
    fetchLatestSchedule();
}

// Add the event listener to trigger the function when the window loads
window.addEventListener('load', displayWeeklyServices);
