document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("page-loader");
    const enterBtn = document.getElementById("enter-btn");
    const invitation = document.getElementById("invitation");
    const music = document.getElementById("bg-music");
    const toggleBtn = document.getElementById("music-toggle");

    // Lock scroll while loader is visible
    document.body.style.overflow = "hidden";

    enterBtn.addEventListener("click", function () {

        // Play music safely
        if (music) {
            music.play().catch(() => { });
        }

        // Start fading loader
        loader.classList.add("hidden");

    });

    // Wait for fade animation to finish
    loader.addEventListener("transitionend", function (event) {

        // Make sure we only respond to opacity transition
        if (event.propertyName === "opacity") {

            loader.remove();
            document.body.style.overflow = "auto";

            // Fade invitation in
            invitation.classList.add("visible");
        }

    });

    // Music toggle button
    toggleBtn.addEventListener("click", function () {

        if (music.paused) {
            music.play();
            toggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            music.pause();
            toggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }


    });

});
