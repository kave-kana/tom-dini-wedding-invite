document.addEventListener("DOMContentLoaded", function () {

    const openBtn = document.getElementById("open-rsvp-popup");

    const attendForm = document.getElementById("rsvp-attend-form");
    const declineForm = document.getElementById("rsvp-decline-form");

    // Open popup
    openBtn.addEventListener("click", function (e) {
        e.preventDefault();
        popupManager.openPopup("popup-rsvp-choice");
    });

    // Handle choice
    document.querySelectorAll(".rsvp-card-option").forEach(option => {

        option.addEventListener("click", function (e) {
            e.preventDefault();

            const choice = this.getAttribute("data-choice");

            popupManager.closePopup();

            attendForm.classList.add("hidden");
            declineForm.classList.add("hidden");

            if (choice === "attend") {
                attendForm.classList.remove("hidden");
            }

            if (choice === "decline") {
                declineForm.classList.remove("hidden");
            }

            // Scroll to the forms container
            setTimeout(() => {
                document.querySelector(".rsvp-forms")
                    .scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);

        });

    });

});
