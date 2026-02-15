/* =========================================
   SCROLL ANIMATIONS
   Fade-in effect when sections scroll into view
========================================= */

document.addEventListener('DOMContentLoaded', function() {
  
  // Create Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // When section comes into view
        setTimeout(() => {
          entry.target.classList.add('fade-in-visible');
        }, 50);
      } else {
        // When section leaves view, remove class so animation can trigger again
        entry.target.classList.remove('fade-in-visible');
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px'
  });

  // Observe all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });

});
