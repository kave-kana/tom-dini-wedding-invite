// Main Application Script
document.addEventListener('DOMContentLoaded', function () {
    // Page Loader
    const pageLoader = document.querySelector('.page-loader');

    // Hide loader after 1.5 seconds minimum
    setTimeout(() => {
        pageLoader.classList.add('hidden');

        // Remove from DOM after animation completes
        setTimeout(() => {
            pageLoader.remove();
        }, 500);
    }, 1500);

    // Music Control with M4A support
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const volumeSlider = document.getElementById('volumeSlider');

    if (musicToggle && musicIcon) {
        let audio = null;
        let isPlaying = false;
        let hasInteracted = false;

        // Create audio element
        function createAudio() {
            audio = new Audio('../audio/wedding.m4a');
            audio.loop = true;
            audio.volume = 0.3; // Default volume 30%
            audio.preload = 'auto';

            // Audio event listeners
            audio.addEventListener('canplaythrough', () => {
                musicToggle.classList.remove('loading');
                console.log('Audio ready to play');
            });

            audio.addEventListener('waiting', () => {
                musicToggle.classList.add('loading');
                console.log('Audio loading...');
            });

            audio.addEventListener('playing', () => {
                musicToggle.classList.remove('loading');
                console.log('Audio playing');
            });

            audio.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                musicToggle.classList.remove('loading');
                musicToggle.classList.add('error');
                showNotification('Music could not be loaded', 'error');
            });

            audio.addEventListener('ended', () => {
                isPlaying = false;
                updateMusicIcon();
            });
        }

        // Update music icon based on state
        function updateMusicIcon() {
            if (isPlaying) {
                musicToggle.classList.add('playing');
                musicIcon.innerHTML = `
                    <path d="M6 9l6-6v12l-6-6zM16 4h2v16h-2z"/>
                `;
            } else {
                musicToggle.classList.remove('playing');
                musicIcon.innerHTML = `
                    <path d="M3 18v-6a9 9 0 0118 0v6"/>
                    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
                `;
            }
        }

        // Play music with user interaction
        function playMusic() {
            if (!audio) {
                createAudio();
            }

            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        isPlaying = true;
                        updateMusicIcon();
                        console.log('Music started playing');

                        // Store playback state
                        localStorage.setItem('musicPlaying', 'true');
                    })
                    .catch(error => {
                        console.error('Playback failed:', error);
                        if (error.name === 'NotAllowedError') {
                            showNotification('Please click the music button to start playback', 'error');
                            // Show instruction tooltip
                            musicToggle.setAttribute('title', 'Click to enable audio');
                        }
                    });
            }
        }

        // Pause music
        function pauseMusic() {
            if (audio) {
                audio.pause();
                isPlaying = false;
                updateMusicIcon();
                localStorage.setItem('musicPlaying', 'false');
            }
        }

        // Set volume
        function setVolume(value) {
            if (audio) {
                audio.volume = value / 100;
                localStorage.setItem('musicVolume', value);
            }
        }

        // Music toggle click handler
        musicToggle.addEventListener('click', function () {
            hasInteracted = true;

            if (!audio) {
                createAudio();
                musicToggle.classList.add('loading');
            }

            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }

            // Remove tooltip after first interaction
            musicToggle.removeAttribute('title');
        });

        // Volume slider handler
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function () {
                setVolume(this.value);
            });

            // Load saved volume
            const savedVolume = localStorage.getItem('musicVolume');
            if (savedVolume) {
                volumeSlider.value = savedVolume;
                setVolume(savedVolume);
            }
        }

        // Load saved playback state
        const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
        if (wasPlaying) {
            // Auto-play on page load if user previously had it playing
            // But only after user interaction (we'll wait for user to click)
            console.log('Music was playing previously');
        }

        // Initialize icon
        updateMusicIcon();

        // Handle page visibility changes
        document.addEventListener('visibilitychange', function () {
            if (document.hidden && audio && isPlaying) {
                // Store state when page is hidden
                localStorage.setItem('musicWasPlaying', 'true');
            } else if (!document.hidden && audio && !isPlaying) {
                // Restore if user had music playing before tab switch
                const wasPlaying = localStorage.getItem('musicWasPlaying') === 'true';
                if (wasPlaying && hasInteracted) {
                    playMusic();
                }
                localStorage.removeItem('musicWasPlaying');
            }
        });

        // Clean up on page unload
        window.addEventListener('beforeunload', function () {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }

    // Save the Date Calendar Download
    window.downloadCalendarEvent = function () {
        const weddingDate = new Date('2026-08-30T09:00:00');

        // Create iCalendar content
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Wedding//Invitation//EN',
            'BEGIN:VEVENT',
            'UID:' + Date.now() + '@wedding',
            'DTSTAMP:' + formatDate(new Date()),
            'DTSTART:' + formatDate(weddingDate),
            'DTEND:' + formatDate(new Date(weddingDate.getTime() + 8 * 60 * 60 * 1000)),
            'SUMMARY:Tomasz & Dinesha Wedding',
            'DESCRIPTION:Join us for our wedding celebration!\\n\\nVenue: Jasmine Banquet Hall\\nAddress: Global Business & Convention Centre, 8, Jalan 19/1, Seksyen 19, 46300 Petaling Jaya, Selangor, Malaysia',
            'LOCATION:Global Business & Convention Centre, Petaling Jaya, Malaysia',
            'BEGIN:VALARM',
            'TRIGGER:-PT24H',
            'ACTION:DISPLAY',
            'DESCRIPTION:Wedding Reminder',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        function formatDate(date) {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        }

        // Download .ics file
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Tomasz-Dinesha-Wedding.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Calendar event saved successfully!', 'success');
    };

    // RSVP Form Submission
    window.submitRSVP = function (event) {
        event.preventDefault();

        const name = document.getElementById('rsvpName').value;
        const attending = document.getElementById('rsvpAttendance').value;

        // Get existing RSVPs
        let rsvps = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');

        // Add new RSVP
        rsvps.push({
            name: name,
            email: document.getElementById('rsvpEmail').value,
            attending: attending,
            guests: document.getElementById('rsvpGuests').value,
            phone: document.getElementById('rsvpPhone').value,
            message: document.getElementById('rsvpMessage').value,
            timestamp: new Date().toISOString()
        });

        // Save to localStorage
        localStorage.setItem('weddingRSVPs', JSON.stringify(rsvps));

        // Update attendee counter
        if (attending === 'I am attending') {
            const attendeeCount = document.getElementById('attendeeCount');
            const currentCount = parseInt(attendeeCount.textContent);
            const newCount = currentCount + 1;
            attendeeCount.textContent = newCount.toString().padStart(2, '0');
            localStorage.setItem('attendeeCount', newCount.toString());

            // Animate counter
            attendeeCount.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                attendeeCount.style.animation = '';
            }, 500);
        }

        // Show success message
        const message = attending === 'I am attending'
            ? `Thank you ${name}! We look forward to celebrating with you!`
            : `Thank you for letting us know, ${name}. We'll miss you!`;

        showNotification(message, 'success');

        // Reset form
        event.target.reset();

        // Close any open popups
        closeGiftPopup();
    };

    // Social Sharing Functions
    window.shareOnFacebook = function () {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent("Join Tomasz & Dinesha's Wedding Celebration!");
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
        showNotification('Share dialog opened', 'success');
    };

    window.shareOnWhatsApp = function () {
        const text = encodeURIComponent("Join Tomasz & Dinesha's Wedding Celebration! " + window.location.href);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        showNotification('WhatsApp share opened', 'success');
    };

    window.copyInviteLink = function () {
        const inviteText = `You're invited to Tomasz & Dinesha's Wedding!\n\nDate: August 30, 2026\nVenue: Jasmine Banquet Hall, Petaling Jaya\n\nRSVP: ${window.location.href}#rsvp\n\nWe hope you can join us!`;

        navigator.clipboard.writeText(inviteText)
            .then(() => {
                showNotification('Invitation text copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Copy failed:', err);
                showNotification('Failed to copy. Please copy manually.', 'error');
            });
    };

    // Notification function (reusable)
    window.showNotification = function (text, type) {
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
    };

    // Add current year to footer if needed
    const footerYear = document.querySelector('footer .small');
    if (footerYear && !footerYear.textContent.includes('2026')) {
        footerYear.innerHTML = `Tomasz &amp; Dinesha • August 30, 2026`;
    }

    // Initialize any additional animations
    initAnimations();
});

// Additional animations
function initAnimations() {
    // Add hover effects to schedule images
    const eventImages = document.querySelectorAll('.event-image');
    eventImages.forEach(img => {
        img.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.5s ease';
        });
    });

    // Add click animations to buttons
    const buttons = document.querySelectorAll('button, .cta-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add confetti effect for special interactions
    function createConfetti() {
        const confettiCount = 30;
        const colors = ['#8B7355', '#A1887F', '#D7CCC8', '#BCAAA4'];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                top: -20px;
                left: ${Math.random() * 100}vw;
                opacity: 0.8;
                z-index: 10000;
                pointer-events: none;
            `;

            document.body.appendChild(confetti);

            // Animate confetti
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 20}px) rotate(${360 * Math.random()}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }
    }

    // Add confetti on RSVP submission and gift button click
    document.querySelector('#giftBtn')?.addEventListener('click', () => {
        setTimeout(createConfetti, 500);
    });

    document.querySelector('.rsvp-submit-btn')?.addEventListener('click', () => {
        setTimeout(createConfetti, 1000);
    });
}
