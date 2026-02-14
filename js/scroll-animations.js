// Scroll Animations
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animations for children
                const children = entry.target.querySelectorAll('.scroll-child');
                children.forEach((child, index) => {
                    child.style.setProperty('--i', index);
                    child.classList.add('animate-in');
                });
            }
        });
    }, observerOptions);

    // Observe all sections with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(section => {
        observer.observe(section);
    });

    // Parallax effect for hero background
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const heroBg = document.querySelector('.hero-hero .bg');
                if (heroBg) {
                    const yPos = -(scrolled * 0.5);
                    heroBg.style.transform = `translateY(${yPos}px)`;
                }
                
                // Fade in/out header based on scroll
                const header = document.querySelector('header.hero-hero');
                if (header) {
                    const opacity = 1 - (scrolled / 500);
                    header.style.opacity = Math.max(opacity, 0.3);
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // Add scroll-based animations for elements
    function checkScrollAnimations() {
        const elements = document.querySelectorAll('[data-animate]');
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;

        elements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;

            // Check if element is in viewport
            if (elementBottom >= windowTop && elementTop <= windowBottom) {
                const animationType = element.getAttribute('data-animate');
                element.style.animation = `${animationType} 0.8s ease forwards`;
            }
        });
    }

    // Initial check
    checkScrollAnimations();
    window.addEventListener('scroll', checkScrollAnimations);

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = `
        <div class="progress-bar"></div>
    `;
    document.body.appendChild(progressBar);

    // Update progress bar
    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    }

    window.addEventListener('scroll', updateScrollProgress);
});

// Add scroll progress styles
const scrollStyles = document.createElement('style');
scrollStyles.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: transparent;
        z-index: 1000;
    }
    
    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--gold), #A1887F);
        width: 0%;
        transition: width 0.1s ease;
    }
    
    .scroll-child {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .scroll-child.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Animation keyframes */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(scrollStyles);