// Custom Cursor
document.addEventListener('DOMContentLoaded', function() {
    // Only create custom cursor for desktop devices
    if (window.matchMedia('(hover: hover)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        // Smooth cursor movement
        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        }
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Start animation
        updateCursor();
        
        // Add hover effects
        const hoverElements = document.querySelectorAll(
            'button, a, .cta-btn, .gift-btn, .comment-btn, .map-btn, .share-btn, .close-btn, .copy-btn, .timeline button'
        );
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
        
        // Add click effect
        document.addEventListener('mousedown', () => cursor.classList.add('click'));
        document.addEventListener('mouseup', () => cursor.classList.remove('click'));
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
        
        // Initialize cursor position
        cursor.style.left = window.innerWidth / 2 + 'px';
        cursor.style.top = window.innerHeight / 2 + 'px';
        cursorX = window.innerWidth / 2;
        cursorY = window.innerHeight / 2;
    } else {
        // For touch devices, show default cursor
        document.body.classList.add('has-cursor');
    }
});