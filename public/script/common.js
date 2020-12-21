// Get header by fetch
(() => {
    fetch('./partials/header.html')
        .then(res => res.text())
        .then(html =>
            document.getElementsByTagName('header')[0].innerHTML = html
        ).catch(err => console.log(err));
})();


// Get footer by fetch
(() => {
    fetch('./partials/footer.html')
        .then(res => res.text())
        .then(html =>
            document.getElementsByTagName('footer')[0].innerHTML = html
        ).catch(err => console.log(err));
})();
