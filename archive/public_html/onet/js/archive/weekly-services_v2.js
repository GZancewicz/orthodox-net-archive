// Function to attempt fetching the schedule based on the date, decrementing days until found or limit reached
function fetchLatestSchedule(daysBack = 0) {
    const today = new Date();
    today.setDate(today.getDate() - daysBack);

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const dd = String(today.getDate()).padStart(2, '0');

    const filename = `/bulletin/json/schedule_${yyyy}-${mm}-${dd}.json`;

    fetch(filename)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                // If not found and we've tried for less than 7 days, try the previous day
                if (daysBack < 7) {
                    fetchLatestSchedule(daysBack + 1);
                } else {
                    console.error("No schedule file found in the past week.");
                }
            }
        })
        .then(data => {
            if (data) {
                displayServices(data);
            }
        })
        .catch(error => {
            console.error("Error fetching the schedule:", error);
        });
}

// Function to display the fetched weekly services
function displayServices(data) {
    let servicesHtml = `
        <table>
            <tbody>
    `;

    data.forEach(service => {
        servicesHtml += `
            <tr>
                <td>${service.date}</td>
                <td>${service.time}</td>
                <td>${service.service.includes("signup") ? service.service.replace("signup", '<a href="https://signup.com/go/GmQhOMA">signup</a>') : service.service}</td>
            </tr>
        `;
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
