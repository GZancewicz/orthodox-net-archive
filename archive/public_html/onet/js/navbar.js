document.addEventListener('DOMContentLoaded', function () {
    var icon = document.querySelector('.icon');
    icon.addEventListener('click', mobileMenu);

    // Update the visibility of the links when the window is resized
    window.addEventListener('resize', function () {
        var navbar = document.getElementById("mainNavBar");
        var links = navbar.getElementsByClassName("nav-link");
        if (window.innerWidth > 700) {
            navbar.className = "navBar";
            for (var i = 0; i < links.length; i++) {
                links[i].style.display = "";
            }
        }
    });
});

function mobileMenu(event) {
    event.preventDefault();
    var navbar = document.getElementById("mainNavBar");
    if (navbar.className === "navBar") {
        navbar.className += " responsive";
    } else {
        navbar.className = "navBar";
    }
    var links = navbar.getElementsByClassName("nav-link");
    for (var i = 0; i < links.length; i++) {
        if (window.innerWidth <= 700) {
            if (links[i].style.display === "block") {
                links[i].style.display = "none";
            } else {
                links[i].style.display = "block";
            }
        } else {
            links[i].style.display = "";
        }
    }
}



// // Debounce function
// function debounce(func, wait = 20, immediate = true) {
//     var timeout;
//     return function () {
//         var context = this, args = arguments;
//         var later = function () {
//             timeout = null;
//             if (!immediate) func.apply(context, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(context, args);
//     };
// };

// // Function to check if nav links fit in the screen
// function checkNav() {
//     var navbar = document.getElementById('navbar');
//     var navBarContainer = document.getElementById('mainNavBar');

//     if (navBarContainer.getBoundingClientRect().width > window.innerWidth) {
//         console.log('Links don\'t fit in the screen.');
//         navbar.style.display = 'none';
//     } else {
//         console.log('Links fit in the screen.');
//         navbar.style.display = 'block';  // replace 'block' with the original display type of the navbar
//     }
// }

// window.addEventListener('resize', debounce(checkNav));
// document.addEventListener('DOMContentLoaded', checkNav);




// document.addEventListener('DOMContentLoaded', (event) => {
//     var navbar = document.getElementById('navbar');
//     if (navbar) {
//         var sticky = navbar.offsetTop;

//         function checkScreenSize() {
//             console.log('Checking screen size...');
//             // console.log(navbar);
//             if (window.innerWidth <= 600) {
//                 console.log('Screen width is 600px or less.');
//                 // navbar.style.display = 'none';
//                 navbar.style.cssText = 'display: none !important;';
//             } else {
//                 console.log('Screen width is more than 600px.');
//                 // navbar.style.display = 'block';
//                 navbar.style.cssText = 'display: block !important;';  // replace 'block' with the original display type of the navbar
//             }
//         }

//         window.onscroll = function () {
//             if (window.pageYOffset >= sticky) {
//                 navbar.classList.add("sticky")
//             } else {
//                 navbar.classList.remove("sticky");
//             }
//         };

//         window.onresize = checkScreenSize;
//         checkScreenSize();  // Call function at run time
//     }
// });



