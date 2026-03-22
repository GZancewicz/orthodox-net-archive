function includeHTML(includeAttribute) {
      var z, i, elmnt, file, xhttp;
      /*loop through a collection of all HTML elements:*/
      z = document.getElementsByTagName("*");
      for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain attribute:*/
        // file = elmnt.getAttribute("include-html");
        file = elmnt.getAttribute(includeAttribute);
        if (file) {
          /*make an HTTP request using the attribute value as the file name:*/
          xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
              if (this.status == 200) { elmnt.innerHTML = this.responseText; }
              if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
              /*remove the attribute, and call this function once more:*/
              // elmnt.removeAttribute("include-html");
              elmnt.removeAttribute(includeAttribute);
              includeHTML(includeAttribute);
            }
          }
          xhttp.open("GET", file, true);
          xhttp.send();
          /*exit the function:*/
          return;
        }
      }
};

function changeHTML(targetId,htmlFile) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById(targetId).innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", htmlFile, true);
  xhttp.send();
}
    
// function changeHTML(includeAttribute,newFile) {
//       var z, i, elmnt, file, xhttp;
//       /*loop through a collection of all HTML elements:*/
//       z = document.getElementsByTagName("*");
//       for (i = 0; i < z.length; i++) {
//         elmnt = z[i];
//         /*search for elements with a certain attribute:*/
//         // file = elmnt.getAttribute("include-html");
//         // file = elmnt.getAttribute(includeAttribute);
//         file = newFile;
//         if (file) {
//           /*make an HTTP request using the attribute value as the file name:*/
//           xhttp = new XMLHttpRequest();
//           xhttp.onreadystatechange = function () {
//             if (this.readyState == 4) {
//               if (this.status == 200) { elmnt.innerHTML = this.responseText; }
//               if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
//               /*remove the attribute, and call this function once more:*/
//               // elmnt.removeAttribute("include-html");
//               elmnt.removeAttribute(includeAttribute);
//               includeHTML(newFile);
//             }
//           }
//           xhttp.open("GET", file, true);
//           xhttp.send();
//           /*exit the function:*/
//           return;
//         }
//       }
//     };