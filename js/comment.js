// Enhanced Comment System
let messages = JSON.parse(localStorage.getItem('weddingMessages')) || [];

function addMessage() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');

    if (!nameInput.value.trim() || !messageInput.value.trim()) {
        showNotification('Please enter both name and message', 'error');
        return;
    }

    if (messageInput.value.length > 280) {
        showNotification('Message must be 280 characters or less', 'error');
        return;
    }

    const newMessage = {
        id: Date.now(),
        name: nameInput.value.trim(),
        message: messageInput.value.trim(),
        time: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameInput.value.trim())}&background=8B7355&color=fff&bold=true`
    };

    messages.unshift(newMessage);
    localStorage.setItem('weddingMessages', JSON.stringify(messages));

    displayMessages();

    // Clear inputs
    nameInput.value = '';
    messageInput.value = '';
    updateCharCounter();

    // Show success notification
    showNotification('Message sent successfully!', 'success');

    // Update attendee counter
    updateAttendeeCounter();
}

function displayMessages() {
    const messageList = document.getElementById('messageList');

    if (messages.length === 0) {
        messageList.innerHTML = `
            <div class="no-messages">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/>
                </svg>
                <p>No messages yet. Be the first to send your blessings!</p>
            </div>
        `;
        return;
    }

    messageList.innerHTML = messages.map((msg, index) => `
        <div class="message-item" style="animation-delay: ${index * 0.1}s">
            <div class="message-header">
                <div class="message-meta">
                    <div class="message-avatar">
                        <img src="${msg.avatar}" alt="${msg.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%228B7355%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2250%22>${msg.name.charAt(0).toUpperCase()}</text></svg>'">
                    </div>
                    <span class="message-name">${msg.name}</span>
                </div>
                <span class="message-time">${msg.time}</span>
            </div>
            <div class="message-content">${msg.message}</div>
        </div>
    `).join('');
}

function showNotification(text, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' ?
            '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>' :
            '<path d="M12 8v4M12 16h.01"/><circle cx="12" cy="12" r="10"/>'
        }
        </svg>
        <span>${text}</span>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function updateCharCounter() {
    const textarea = document.getElementById('guestMessage');
    let counter = textarea.nextElementSibling?.classList?.contains('char-counter')
        ? textarea.nextElementSibling
        : null;

    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'char-counter';
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
    }

    const remaining = 280 - textarea.value.length;
    counter.textContent = `${remaining} characters remaining`;

    if (remaining < 50) {
        counter.style.color = remaining < 20 ? '#f44336' : '#ff9800';
        counter.style.fontWeight = 'bold';
    } else {
        counter.style.color = 'var(--muted)';
        counter.style.fontWeight = 'normal';
    }
}

function updateAttendeeCounter() {
    const attendeeCount = document.getElementById('attendeeCount');
    const currentCount = parseInt(attendeeCount.textContent);

    // Simulate random attendee updates
    if (Math.random() > 0.7 && currentCount < 150) {
        const newCount = currentCount + 1;
        attendeeCount.textContent = newCount.toString().padStart(2, '0');

        // Add animation
        attendeeCount.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            attendeeCount.style.animation = '';
        }, 500);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    displayMessages();

    const messageInput = document.getElementById('guestMessage');
    if (messageInput) {
        messageInput.addEventListener('input', updateCharCounter);
        updateCharCounter();
    }

    // Add enter key support for sending message
    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            addMessage();
        }
    });

    // Add focus styles
    const nameInput = document.getElementById('guestName');
    [nameInput, messageInput].forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement?.classList?.add('focused');
        });
        input.addEventListener('blur', function () {
            this.parentElement?.classList?.remove('focused');
        });
    });

    // Load initial attendee count
    const storedCount = localStorage.getItem('attendeeCount');
    if (storedCount) {
        document.getElementById('attendeeCount').textContent = storedCount.padStart(2, '0');
    }
});

// Add CSS for no messages state
const commentStyles = document.createElement('style');
commentStyles.textContent = `
    .no-messages {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--muted);
    }
    
    .no-messages svg {
        width: 60px;
        height: 60px;
        margin: 0 auto 1rem;
        opacity: 0.3;
    }
    
    .no-messages p {
        font-size: 1rem;
        font-style: italic;
    }
`;
document.head.appendChild(commentStyles);