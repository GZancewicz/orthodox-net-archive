window.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.href;
    const newUrl = currentUrl.replace('blog_post.html?/', '').split('/&id')[0];
    history.pushState(null, '', newUrl);
});