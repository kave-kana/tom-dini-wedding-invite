// Gift Popup Functionality
function openGiftPopup() {
    const popup = document.getElementById('giftPopup');
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Add subtle animation to QR code
    const qrCode = document.querySelector('.qrcode-img');
    if (qrCode) {
        qrCode.style.animation = 'pulse 2s ease-in-out';
        setTimeout(() => {
            qrCode.style.animation = '';
        }, 2000);
    }

    // Track gift popup opens
    const giftOpens = parseInt(localStorage.getItem('giftOpens') || '0');
    localStorage.setItem('giftOpens', (giftOpens + 1).toString());
}

function closeGiftPopup() {
    const popup = document.getElementById('giftPopup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Copy bank details to clipboard
function copyBankDetails() {
    const bankDetails = `Account Name: Tomasz & Dinesha Wedding
Bank: Maybank
Account Number: 1234 5678 9012
Reference: Your Name`;

    navigator.clipboard.writeText(bankDetails)
        .then(() => {
            // Show success feedback
            const copyBtn = document.querySelector('.copy-btn');
            if (!copyBtn) return;

            const originalText = copyBtn.innerHTML;
            const originalBackground = copyBtn.style.background;
            const originalBorderColor = copyBtn.style.borderColor;
            const originalColor = copyBtn.style.color;

            copyBtn.innerHTML = `
                <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                Copied!
            `;
            copyBtn.style.background = 'rgba(76, 175, 80, 0.1)';
            copyBtn.style.borderColor = 'rgba(76, 175, 80, 0.3)';
            copyBtn.style.color = '#4CAF50';
            copyBtn.disabled = true;

            // Show notification
            showNotification('Bank details copied to clipboard!', 'success');

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = originalBackground;
                copyBtn.style.borderColor = originalBorderColor;
                copyBtn.style.color = originalColor;
                copyBtn.disabled = false;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy. Please copy manually.', 'error');
        });
}

// Close popup when clicking outside the content
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('giftPopup');
    if (popup) {
        popup.addEventListener('click', function (e) {
            if (e.target === this) {
                closeGiftPopup();
            }
        });
    }
});

// Close popup with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeGiftPopup();
    }
});

// Add QR code animation styles
const giftStyles = document.createElement('style');
giftStyles.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .copy-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(giftStyles);