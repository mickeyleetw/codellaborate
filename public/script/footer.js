(() => {
    fetch('./partials/footer.html')
        .then(res => res.text())
        .then(html =>
            document.getElementById('pagefooter').innerHTML = html
        ).catch(err => console.log(err));
})();