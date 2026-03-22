window.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.href;
    const newUrl = currentUrl.replace('.html', '').split('/&id')[0];
    console.log(newUrl);
    history.pushState(null, '', newUrl);
});