
// Function to fetch and display the weekly services
function displayWeeklyServices() {
    // Fetching the data from schedule.json
    // fetch('/bulletin/schedule.json')
    fetch('/bulletin/schedule.json?_=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            let servicesHtml = '';
            servicesHtml += `
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
        })
        .catch(error => {
            console.error("Error fetching or displaying the weekly services:", error);
        });
}

// Calling the function to display the services on page load
// window.onload = displayWeeklyServices;
window.addEventListener('load', displayWeeklyServices);

