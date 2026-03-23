document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("page-loader");
    const envelope = document.getElementById("envelope");
    const enterBtn = document.getElementById("enter-btn");
    const invitation = document.getElementById("invitation");
    const music = document.getElementById("bg-music");
    const toggleBtn = document.getElementById("music-toggle");
    const menuBar = document.querySelector(".menu-bar-container");
    const footer = document.querySelector("footer");
    const loaderRing = document.querySelector(".loader-ring");
    const loaderMessage = document.getElementById("loader-message");
    const burstSparkles = document.getElementById("burst-sparkles");

    // Lock scroll and hide other elements while loading
    document.body.style.overflow = "hidden";
    if (toggleBtn) toggleBtn.style.display = "none";
    if (menuBar) menuBar.style.display = "none";
    if (footer) footer.style.display = "none";

    // After 5 seconds, fade out loading elements and fade in button
    setTimeout(function () {
        loaderRing.classList.add("fade-out");
        loaderMessage.classList.add("fade-out");
        
        // After fade completes, hide loader and show button
        setTimeout(function () {
            loaderRing.style.display = "none";
            loaderMessage.style.display = "none";
            loader.style.pointerEvents = "none";
            loader.style.backgroundColor = "transparent";
            enterBtn.classList.remove("hidden");
            setTimeout(function() {
                enterBtn.classList.add("fade-in");
                // Trigger magical burst effect
                burstSparkles.style.display = "block";
            }, 50);
        }, 600);
    }, 5000);

    // When button is clicked
    enterBtn.addEventListener("click", function () {
        // Fade out button
        enterBtn.classList.add("fade-out");
        
        // Play music
        if (music) {
            music.play().catch(() => { });
        }

        // After fade animation completes, remove loader and show invitation
        setTimeout(function () {
            enterBtn.classList.add("hidden");
            loader.remove();
            document.body.style.overflow = "auto";
            
            // Show other elements again
            if (toggleBtn) toggleBtn.style.display = "flex";
            if (menuBar) menuBar.style.display = "flex";
            if (footer) footer.style.display = "block";

            // Fade invitation in
            invitation.classList.add("visible");
            
            // Trigger home menu navigation to highlight heart
            const homeMenuItem = document.querySelector('.menu-item[data-target="home"]');
            if (homeMenuItem) {
                homeMenuItem.click();
            }
        }, 600);
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