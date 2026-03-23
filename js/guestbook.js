document.addEventListener("DOMContentLoaded", function () {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7bHzpTroJ3z-cBa6P2_eZ1d1shp4ry1vrb0CfglxRqI6s2JHN9TwLSSvxP_H_EMIYog/exec";

    const form = document.getElementById("guestbook-form");
    const nameInput = document.getElementById("guest-name");
    const messageInput = document.getElementById("guest-message");
    const messagesContainer = document.getElementById("guestbook-messages");
    const statusMessage = document.getElementById("guestbook-status");
    const submitButton = form.querySelector(".comment-submit-btn");

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showStatus(message, type = "success") {
        if (!statusMessage) return;
        statusMessage.textContent = message;
        statusMessage.className = `guestbook-status show ${type}`;
    }

    function clearStatus() {
        if (!statusMessage) return;
        statusMessage.textContent = "";
        statusMessage.className = "guestbook-status";
    }

    function renderMessages(data) {
        messagesContainer.innerHTML = "";

        if (!data || data.length === 0) {
            messagesContainer.innerHTML =
                '<p class="empty">No messages yet — be the first to leave your wishes!</p>';
            return;
        }

        data.slice().reverse().forEach(entry => {
            const el = document.createElement("article");
            el.className = "guest-message";

            el.innerHTML = `
                <div class="message-header">
                    <strong class="guest-name">${escapeHtml(entry.Name)}</strong>
                    <time class="message-time">
                        ${new Date(entry.Timestamp).toLocaleString()}
                    </time>
                </div>
                <div class="message-body">
                    ${escapeHtml(entry.Message).replace(/\n/g, "<br>")}
                </div>
            `;

            messagesContainer.appendChild(el);
        });
    }

    async function loadMessages() {
        try {
            const response = await fetch(SCRIPT_URL);
            const data = await response.json();
            renderMessages(data);
        } catch (err) {
            console.error("Error loading guestbook:", err);
        }
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        let message = messageInput.value.trim();

        if (!name || !message) return;

        if (message.length > 500) {
            message = message.substring(0, 500);
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("message", message);

        try {
            submitButton.disabled = true;
            submitButton.classList.add("is-loading");
            submitButton.textContent = "Sending...";
            showStatus("Saving your message...", "success");

            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to save guestbook message");
            }

            nameInput.value = "";
            messageInput.value = "";

            await loadMessages();

            submitButton.textContent = "Send Wishes";
            showStatus("Your message has been saved to the guestbook.", "success");

            setTimeout(() => {
                clearStatus();
            }, 3500);

        } catch (err) {
            console.error("Error submitting guestbook:", err);
            submitButton.textContent = "Send Wishes";
            showStatus("Sorry, your message could not be saved. Please try again.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.classList.remove("is-loading");
        }
    });

    loadMessages();
});