async function updateAttendeeCount() {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycby_uaQEg3nMRqozvIVY8mTtq6FNjgAmHEAcFKRiBV0i27eRUnFN6DVtkH6OnW0oKZYaEA/exec");
        const data = await response.json();

        let total = 0;

        data.forEach(entry => {
            if (entry["Attending"] === "I am attending") {
                if (entry["Guests"] === "Myself and 1 Guest") {
                    total += 2;
                } else {
                    total += 1;
                }
            }
        });

        document.querySelector(".attend-number").textContent = total;

    } catch (error) {
        console.error("Error fetching attendee count:", error);
    }
}


document.addEventListener("DOMContentLoaded", function () {

    const deadline = new Date("2026-07-01T23:59:59+08:00");
    const now = new Date();

    const form = document.querySelector(".rsvp-grid");
    const success = document.getElementById("rsvp-success");

    updateAttendeeCount();

    const attendingSelect = document.getElementById("attending-select");
    const guestsWrapper = document.getElementById("guests-wrapper");
    const guestsSelect = document.getElementById("guests-select");

    function toggleGuestsField() {
        if (attendingSelect.value === "I am attending") {
            guestsWrapper.style.display = "block";
            guestsSelect.setAttribute("required", "required");
        } else {
            guestsWrapper.style.display = "none";
            guestsSelect.removeAttribute("required");
            guestsSelect.value = "";
        }
    }

    attendingSelect.addEventListener("change", toggleGuestsField);

    // Run once on load
    toggleGuestsField();



    // CLOSE RSVP IF DEADLINE PASSED
    if (now > deadline) {

        form.innerHTML = `
            <div class="rsvp-closed">
                <h3>RSVP Closed</h3>
                <p>The RSVP deadline has passed.</p>
                <p>We look forward to seeing you at the wedding! 🤍</p>
            </div>
        `;

        return; // stop further script
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        success.textContent = "Submitting...";
        success.classList.add("show");

        const formData = new FormData(form);

        try {
            await fetch(form.action, {
                method: "POST",
                body: formData
            });

            success.textContent = "Thank you! Your RSVP has been received 🤍";
            updateAttendeeCount();
            form.reset();

        } catch (error) {
            success.textContent = "Something went wrong. Please try again.";
            console.error(error);
        }
    });

}); 
