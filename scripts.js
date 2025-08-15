document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Facebook Pixel
    !function(f,b,e,v,n,t,s) {
        if(f.fbq) return; 
        n = f.fbq = function() {
            n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
        }; 
        if(!f._fbq) f._fbq = n; 
        n.push = n; 
        n.loaded = !0; 
        n.version = '2.0'; 
        n.queue = []; 
        t = b.createElement(e); 
        t.async = !0; 
        t.src = v; 
        s = b.getElementsByTagName(e)[0]; 
        s.parentNode.insertBefore(t,s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    
    if (typeof fbq !== 'undefined') {
        fbq('init', '4826335367381214');
        fbq('track', 'PageView');
    }
    
    // Add touch class detection (from Webflow)
    if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
        document.documentElement.className += ' w-mod-touch';
    }
    
    // Timeline animation
    function animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline_item');
        const progressBar = document.querySelector('.timeline_progress-bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Update progress bar
                    const rect = entry.target.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const progress = Math.min((windowHeight - rect.top) / windowHeight * 100, 100);
                    
                    if (progressBar) {
                        progressBar.style.height = `${progress}%`;
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    // Smooth scroll for anchor links
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Lazy load images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Analytics tracking for external links
    function trackExternalLinks() {
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        
        externalLinks.forEach(link => {
            link.addEventListener('click', function() {
                const href = this.href;
                
                // Track with Facebook Pixel if available
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'External Link Click',
                        content_category: 'Social Media',
                        value: href
                    });
                }
                
                // You can add Google Analytics tracking here too
                console.log('External link clicked:', href);
            });
        });
    }
    
    // Testimonial slider enhancements
    function enhanceTestimonialSlider() {
        const slider = document.querySelector('.testimonial-slider');
        if (!slider) return;
        
        // Add keyboard navigation
        slider.addEventListener('keydown', function(e) {
            const leftArrow = slider.querySelector('.testimonial-slider-left');
            const rightArrow = slider.querySelector('.testimonial-slider-right');
            
            if (e.key === 'ArrowLeft' && leftArrow) {
                leftArrow.click();
            } else if (e.key === 'ArrowRight' && rightArrow) {
                rightArrow.click();
            }
        });
        
        // Make slider focusable for keyboard users
        slider.setAttribute('tabindex', '0');
    }
    
    // Copy email functionality
    function initEmailCopy() {
        const emailElement = document.querySelector('h4:contains("kalyano@pm.me")');
        if (emailElement) {
            emailElement.style.cursor = 'pointer';
            emailElement.title = 'Click to copy email';
            
            emailElement.addEventListener('click', function() {
                navigator.clipboard.writeText('kalyano@pm.me').then(function() {
                    // Show temporary feedback
                    const originalText = emailElement.textContent;
                    emailElement.textContent = 'Email copied!';
                    setTimeout(() => {
                        emailElement.textContent = originalText;
                    }, 2000);
                });
            });
        }
    }
    
    // Performance monitoring
    function initPerformanceMonitoring() {
        window.addEventListener('load', function() {
            if ('performance' in window) {
                const perfData = window.performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page load time:', loadTime + 'ms');
            }
        });
    }
    
    // Initialize all functions
    animateTimeline();
    initSmoothScroll();
    initLazyLoading();
    trackExternalLinks();
    enhanceTestimonialSlider();
    initEmailCopy();
    initPerformanceMonitoring();
    
    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });
    
});

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export for potential use in other scripts
window.ResumeUtils = utils;