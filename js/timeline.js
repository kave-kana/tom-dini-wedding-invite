// Timeline Navigation
document.addEventListener('DOMContentLoaded', function () {
    const timelineButtons = document.querySelectorAll('.timeline button');
    const timelineLabels = document.querySelectorAll('.timeline-labels span');
    const track = document.querySelector('.events-track');
    const slides = document.querySelectorAll('.event-slide');

    // Initialize first slide
    let currentSlide = 0;

    // Function to update active state
    function updateActiveState(index) {
        // Update buttons
        timelineButtons.forEach(btn => btn.classList.remove('active'));
        timelineButtons[index].classList.add('active');

        // Update labels
        timelineLabels.forEach((label, i) => {
            if (i === index) {
                label.style.color = '#8B7355';
                label.style.fontWeight = '600';
            } else {
                label.style.color = '';
                label.style.fontWeight = '';
            }
        });

        // Update slide position
        track.style.transform = `translateX(-${index * 100}%)`;
        currentSlide = index;
    }

    // Add click events to timeline buttons
    timelineButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            updateActiveState(index);

            // Add click animation
            button.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                button.style.animation = '';
            }, 500);
        });
    });

    // Add click events to timeline labels
    timelineLabels.forEach((label, index) => {
        label.addEventListener('click', () => {
            updateActiveState(index);
        });
    });

    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(() => {
        let nextSlide = (currentSlide + 1) % slides.length;
        updateActiveState(nextSlide);
    }, 5000);

    // Pause auto-advance on hover
    const sliderContainer = document.querySelector('.schedule-container');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % slides.length;
            updateActiveState(nextSlide);
        }, 5000);
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            let prevSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateActiveState(prevSlide);
        } else if (e.key === 'ArrowRight') {
            let nextSlide = (currentSlide + 1) % slides.length;
            updateActiveState(nextSlide);
        }
    });

    // Add swipe functionality for touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            let nextSlide = (currentSlide + 1) % slides.length;
            updateActiveState(nextSlide);
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            let prevSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateActiveState(prevSlide);
        }
    }
});