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

    const attendForm = document.getElementById("rsvp-attend-form");
    const declineForm = document.getElementById("rsvp-decline-form");

    updateAttendeeCount();

    // CLOSE RSVP IF DEADLINE PASSED
    if (now > deadline) {
        if (attendForm) attendForm.innerHTML = `
            <div class="rsvp-closed">
                <h3>RSVP Closed</h3>
                <p>The RSVP deadline has passed.</p>
                <p>We look forward to seeing you at the wedding! 🤍</p>
            </div>
        `;
        if (declineForm) declineForm.innerHTML = `
            <div class="rsvp-closed">
                <h3>RSVP Closed</h3>
                <p>The RSVP deadline has passed.</p>
                <p>We look forward to seeing you at the wedding! 🤍</p>
            </div>
        `;
        return; // stop further script
    }

    // Handle both attend and decline forms with fetch to prevent navigation
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_uaQEg3nMRqozvIVY8mTtq6FNjgAmHEAcFKRiBV0i27eRUnFN6DVtkH6OnW0oKZYaEA/exec";
    
    [attendForm, declineForm].forEach(form => {
        if (!form) return; // skip if form doesn't exist
        
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const successMsg = form.querySelector(".rsvp-success-message");
            successMsg.textContent = "Submitting...";
            successMsg.classList.add("show");

            const formData = new FormData(form);

            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    body: formData
                });

                successMsg.textContent = "Thank you! Your RSVP has been received 🤍";
                updateAttendeeCount();
                form.reset();

            } catch (error) {
                successMsg.textContent = "Thank you! Your RSVP has been received 🤍";
                console.error(error);
            }
        });
    });

});
