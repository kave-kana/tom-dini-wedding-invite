// Popup System
class PopupManager {
    constructor() {
        this.activePopup = null;
        this.init();
    }

    init() {
        // Setup event listeners once DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupPopupListeners();
            });
        } else {
            // DOM already loaded
            this.setupPopupListeners();
        }
    }

    setupPopupListeners() {
        // Close button listeners
        const closeButtons = document.querySelectorAll('.popup-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closePopup();
            });
        });

        // Overlay click to close
        const overlays = document.querySelectorAll('.popup-overlay');
        overlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closePopup();
                }
            });
        });

        // Prevent propagation on popup content
        const popupContents = document.querySelectorAll('.popup-content');
        popupContents.forEach(content => {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Keyboard escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activePopup) {
                this.closePopup();
            }
        });
    }


    openPopup(popupId) {
        // Close existing popup first if any
        if (this.activePopup) {
            this.closePopup();
        }

        const popup = document.getElementById(popupId);
        if (!popup) {
            console.warn(`Popup with id "${popupId}" not found`);
            return;
        }

        // Ensure popup doesn't have active class before adding it
        popup.classList.remove('active');
        
        // Force reflow to ensure CSS transition
        void popup.offsetWidth;
        
        // Add active class
        popup.classList.add('active');
        this.activePopup = popupId;

        // Prevent body scroll when popup is open
        document.body.style.overflow = 'hidden';

        // Re-setup helpers each time popup opens (for copy/QR buttons)
        this.setupPopupHelpers();
    }

    closePopup() {
        if (!this.activePopup) return;

        const popup = document.getElementById(this.activePopup);
        if (popup) {
            popup.classList.remove('active');
        }

        this.activePopup = null;

        // Re-enable body scroll
        document.body.style.overflow = '';
    }

    isPopupOpen(popupId) {
        return this.activePopup === popupId;
    }

    setupPopupHelpers() {
        // Copy-to-clipboard for elements with .copy-btn
        document.querySelectorAll('.copy-btn').forEach(btn => {
            // Avoid multiple listeners by using event delegation or marking
            if (btn._setupComplete) return;
            btn._setupComplete = true;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const value = btn.getAttribute('data-copy') || document.getElementById('gift-account')?.textContent || '';
                if (!value) return;
                
                navigator.clipboard.writeText(value.trim()).then(() => {
                    const original = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        btn.innerHTML = original;
                        btn._setupComplete = false; // Allow re-setup
                    }, 1500);
                }).catch(err => {
                    console.error('Copy failed', err);
                });
            });
        });

        // Make QR image open in a new tab when clicked
        document.querySelectorAll('.qr-image').forEach(img => {
            if (img._hasClick) return;
            img._hasClick = true;
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const src = img.getAttribute('src');
                if (src) window.open(src, '_blank');
            });
        });
    }
}

// Initialize popup manager
const popupManager = new PopupManager();

document.querySelectorAll("[data-popup]").forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        const popupId = this.getAttribute("data-popup");
        popupManager.openPopup(popupId);
    });
});
