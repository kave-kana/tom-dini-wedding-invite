// Schedule/Timeline Functionality

document.addEventListener('DOMContentLoaded', function() {
    const timelineButtons = document.querySelectorAll('.timeline button');
    const eventsSlider = document.querySelector('.events-tracker');
    
    // Map event data-attributes to slide indices
    const eventIndex = {
        'arrival': 0,
        'ceremony': 1,
        'lunch': 2,
        'farewell': 3
    };

    // Add click handlers to timeline buttons
    timelineButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Get the event name from data-event attribute
            const eventName = this.getAttribute('data-event');
            const slideIndex = eventIndex[eventName];
            
            // Remove active class from all buttons
            timelineButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Scroll to the corresponding event card
            if (eventsSlider) {
                const eventCard = eventsSlider.children[slideIndex];
                if (eventCard) {
                    // Scroll smoothly to the event card
                    eventCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start'
                    });
                }
            }
        });
    });

    // Optional: Auto-advance timeline every 8 seconds
    // Uncomment below if you want auto-rotation through events
    /*
    let currentEventIndex = 0;
    const events = ['arrival', 'ceremony', 'lunch', 'farewell'];
    
    setInterval(function() {
        const button = document.querySelector(`[data-event="${events[currentEventIndex]}"]`);
        if (button) {
            button.click();
        }
        currentEventIndex = (currentEventIndex + 1) % events.length;
    }, 8000);
    */
});
