document.addEventListener("DOMContentLoaded", function () {

    const footer = document.querySelector("footer");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add("visible");
            } else {
                footer.classList.remove("visible");
            }
        });
    }, {
        threshold: 0.4
    });

    observer.observe(footer);

});
