// Bottom Navigation Menu Handler
document.addEventListener('DOMContentLoaded', () => {
    const menuItemSelected = document.querySelector(
        ".menu-bar-container .menu-item-selected"
    );
    const menuItems = document.querySelectorAll(".menu-bar-container .menu-item");

    // Set initial position of floating indicator to heart (home) - 3rd menu item
    const setMenuItemSelectedPosition = () => {
        let menuItem = menuItems[2].getBoundingClientRect();
        let xCenter = (menuItem.left + menuItem.right) / 2;
        menuItemSelected.style.left = xCenter + "px";
        menuItemSelected.innerHTML = menuItems[2].innerHTML;
    };

    // Handle menu item clicks
    menuItems.forEach((menuItem) => {
        menuItem.addEventListener("click", () => {
            const target = menuItem.getAttribute("data-target");

            // Update floating indicator
            menuItemSelected.innerHTML = menuItem.innerHTML;
            let menuItemRect = menuItem.getBoundingClientRect();
            let xCenter = (menuItemRect.left + menuItemRect.right) / 2;
            menuItemSelected.style.left = xCenter + "px";

            // Handle navigation
            handleNavigation(target);
        });
    });

    // Initial positioning
    setMenuItemSelectedPosition();

    // Re-position on window resize
    window.addEventListener("resize", setMenuItemSelectedPosition);
});

function handleNavigation(target) {
    switch (target) {
        case 'contact':
            if (typeof popupManager !== 'undefined') {
                popupManager.openPopup('popup-contact');
            }
            break;
        case 'venue':
            if (typeof popupManager !== 'undefined') {
                popupManager.openPopup('popup-venue');
            }
            break;
        case 'gifts':
            if (typeof popupManager !== 'undefined') {
                popupManager.openPopup('popup-gift');
            }
            break;
        case 'home':
            // Close any open popups and scroll to top
            if (typeof popupManager !== 'undefined') {
                popupManager.closePopup();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'rsvp':
            if (typeof popupManager !== 'undefined') {
                popupManager.openPopup('popup-rsvp-choice');
            }
            break;
        default:
            console.warn(`Unknown navigation target: ${target}`);
    }
}
