/**
 * Yuri Hlebanja Resume Website - Main JavaScript File
 * 
 * This file contains all the interactive functionality for the resume website including:
 * - Timeline animations and progress tracking
 * - Social media analytics integration
 * - Image lazy loading for performance
 * - Smooth scrolling and navigation
 * - Email copying functionality
 * - Performance monitoring
 * - Future: Chess.com API integration for puzzle ratings
 * - Future: Dynamic certification badge management
 */

// Wait for DOM to be fully loaded before initializing functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FACEBOOK PIXEL INTEGRATION =====
    // Initialize Facebook Pixel for tracking user interactions and conversions
    // Facebook Pixel initialization script (minified for performance)
    // This creates the fbq function and loads the Facebook Pixel SDK asynchronously
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
    
    // Initialize Facebook Pixel with tracking ID and track initial page view
    if (typeof fbq !== 'undefined') {
        fbq('init', '4826335367381214'); // Replace with your Facebook Pixel ID
        fbq('track', 'PageView'); // Track initial page visit
    }
    
    // ===== DEVICE DETECTION =====
    // Detect touch devices and add appropriate CSS class for touch-specific styling
    if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
        document.documentElement.className += ' w-mod-touch';
    }
    
    // ===== TIMELINE ANIMATION SYSTEM =====
    // Handles the interactive timeline that shows work experience
    // Animates timeline items as they come into view and updates progress bar
    function animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline_item'); // All timeline entries
        const progressBar = document.querySelector('.timeline_progress-bar'); // Progress indicator
        
        // Use Intersection Observer API for efficient scroll-based animations
        // This provides better performance than scroll event listeners
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class to trigger CSS animations
                    entry.target.classList.add('is-visible');
                    
                    // Calculate and update progress bar height based on scroll position
                    const rect = entry.target.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const progress = Math.min((windowHeight - rect.top) / windowHeight * 100, 100);
                    
                    if (progressBar) {
                        progressBar.style.height = `${progress}%`;
                    }
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -100px 0px' // Start animation 100px before element enters viewport
        });
        
        // Start observing all timeline items for intersection changes
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    // ===== SMOOTH SCROLLING NAVIGATION =====
    // Provides smooth scrolling behavior for internal anchor links
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]'); // Find all internal links
        
        // Add smooth scroll behavior to each internal link
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default jump behavior
                const targetId = this.getAttribute('href').substring(1); // Remove # from href
                const targetElement = document.getElementById(targetId);
                
                // Smoothly scroll to target element if it exists
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth', // Enable smooth scrolling animation
                        block: 'start' // Align to top of viewport
                    });
                }
            });
        });
    }
    
    // ===== IMAGE LAZY LOADING =====
    // Optimizes page load performance by loading images only when needed
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]'); // Find all lazy-load images
        
        // Use Intersection Observer for efficient lazy loading (if supported by browser)
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Load image from data-src attribute if it exists
                        if (img.dataset.src) {
                            img.src = img.dataset.src; // Set actual image source
                            img.classList.remove('lazy'); // Remove lazy loading class
                            observer.unobserve(img); // Stop observing this image
                        }
                    }
                });
            });
            
            // Start observing all lazy-load images
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // ===== ANALYTICS & TRACKING =====
    // Tracks user interactions with external links for analytics purposes
    function trackExternalLinks() {
        const externalLinks = document.querySelectorAll('a[target="_blank"]'); // Find all external links
        
        // Track clicks on all external links (LinkedIn, GitHub, Calendly, etc.)
        externalLinks.forEach(link => {
            link.addEventListener('click', function() {
                const href = this.href;
                
                // Track with Facebook Pixel if available (for conversion tracking)
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'External Link Click',
                        content_category: 'Social Media',
                        value: href
                    });
                }
                
                // Log for debugging and potential Google Analytics integration
                console.log('External link clicked:', href);
            });
        });
    }
    
    // ===== TESTIMONIAL SLIDER ENHANCEMENTS =====
    // Adds keyboard navigation and accessibility to the testimonial slider
    function enhanceTestimonialSlider() {
        const slider = document.querySelector('.testimonial-slider');
        if (!slider) return; // Exit if no testimonial slider found
        
        // Add keyboard navigation for accessibility
        slider.addEventListener('keydown', function(e) {
            const leftArrow = slider.querySelector('.testimonial-slider-left');
            const rightArrow = slider.querySelector('.testimonial-slider-right');
            
            // Allow arrow keys to control slider navigation
            if (e.key === 'ArrowLeft' && leftArrow) {
                leftArrow.click(); // Simulate click on left arrow
            } else if (e.key === 'ArrowRight' && rightArrow) {
                rightArrow.click(); // Simulate click on right arrow
            }
        });
        
        // Make slider focusable for keyboard users (accessibility requirement)
        slider.setAttribute('tabindex', '0');
    }
    
    // ===== EMAIL COPYING FUNCTIONALITY =====
    // Allows users to click on email address to copy it to clipboard
    function initEmailCopy() {
        const emailElement = document.querySelector('#contact-email'); // Updated to use ID instead of text content
        if (emailElement) {
            emailElement.style.cursor = 'pointer'; // Show pointer cursor on hover
            emailElement.title = 'Click to copy email'; // Tooltip for user guidance
            
            emailElement.addEventListener('click', function() {
                // Use modern clipboard API to copy email address
                navigator.clipboard.writeText('yurihlebanja@gmail.com').then(function() {
                    // Provide visual feedback that email was copied
                    const originalText = emailElement.textContent;
                    emailElement.textContent = 'Email copied!';
                    
                    // Restore original text after 2 seconds
                    setTimeout(() => {
                        emailElement.textContent = originalText;
                    }, 2000);
                }).catch(function(err) {
                    // Fallback for browsers that don't support clipboard API
                    console.error('Could not copy email: ', err);
                });
            });
        }
    }
    
    // ===== PERFORMANCE MONITORING =====
    // Tracks page load performance for optimization purposes
    function initPerformanceMonitoring() {
        window.addEventListener('load', function() {
            // Check if Performance API is available
            if ('performance' in window) {
                const perfData = window.performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                // Log load time for debugging and optimization analysis
                console.log('Page load time:', loadTime + 'ms');
                
                // Track load time with analytics if needed
                if (typeof fbq !== 'undefined' && loadTime > 5000) {
                    // Track slow page loads for optimization insights
                    fbq('trackCustom', 'SlowPageLoad', {
                        load_time: loadTime,
                        page_url: window.location.href
                    });
                }
            }
        });
    }
    
    // ===== CHESS.COM INTEGRATION =====
    // Live Chess.com puzzle rating display for user Yuri_Tal
    function initChessRating() {
        const chessCard = document.getElementById('chess-rating-card');
        if (!chessCard) return;
        
        console.log('🚀 Initializing Chess.com integration for Yuri_Tal');
        
        const username = 'Yuri_Tal';
        let previousRating = localStorage.getItem('chess-previous-rating') || 0;
        
        // Fetch current puzzle rating from Chess.com API
        async function fetchChessRating() {
            try {
                console.log('Fetching Chess.com stats...');
                const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Chess.com data received:', data);
                
                // Get puzzle rating from tactics section
                if (data.tactics && data.tactics.highest) {
                    const currentRating = data.tactics.highest.rating;
                    const ratingChange = previousRating ? (currentRating - parseInt(previousRating)) : 0;
                    
                    updateRatingDisplay(currentRating, ratingChange);
                    
                    // Store current rating for next comparison
                    localStorage.setItem('chess-previous-rating', currentRating.toString());
                    
                    // Show the card
                    chessCard.style.display = 'block';
                    
                    console.log(`✅ Chess rating updated: ${currentRating} (${ratingChange >= 0 ? '+' : ''}${ratingChange})`);
                } else {
                    console.warn('No tactics data found in Chess.com response');
                }
                
            } catch (error) {
                console.error('Error fetching chess rating:', error);
                // Show error state in card and navigation button
                const ratingElement = document.getElementById('chess-rating');
                const navButtonText = document.getElementById('chess-nav-text');
                
                if (ratingElement) {
                    ratingElement.textContent = 'Unavailable';
                    chessCard.style.display = 'block';
                }
                
                if (navButtonText) {
                    navButtonText.textContent = 'Chess.com Puzzle Rating: Unavailable';
                }
            }
        }
        
        // Update the rating display with animation
        function updateRatingDisplay(rating, change) {
            const ratingElement = document.getElementById('chess-rating');
            const changeElement = document.getElementById('chess-rating-change');
            const navButtonText = document.getElementById('chess-nav-text');
            
            if (ratingElement) {
                // Animate number counting up to current rating
                animateNumber(ratingElement, rating);
            }
            
            // Update navigation button text with live rating
            if (navButtonText) {
                navButtonText.textContent = `Chess.com Puzzle Rating: ${rating.toLocaleString()}`;
            }
            
            if (changeElement && change !== 0) {
                // Show rating change with appropriate color
                if (change > 0) {
                    changeElement.textContent = `+${change}`;
                    changeElement.className = 'rating-change positive';
                } else if (change < 0) {
                    changeElement.textContent = change;
                    changeElement.className = 'rating-change negative';
                } else {
                    changeElement.textContent = '';
                    changeElement.className = 'rating-change';
                }
            }
        }
        
        // Animate number counting effect
        function animateNumber(element, targetNumber) {
            const startNumber = parseInt(element.textContent) || 0;
            const duration = 1500; // 1.5 seconds
            const startTime = performance.now();
            
            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentNumber = Math.round(startNumber + (targetNumber - startNumber) * easeOut);
                
                element.textContent = currentNumber.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }
            
            requestAnimationFrame(updateNumber);
        }
        
        // Initial fetch
        fetchChessRating();
        
        // Update every 10 minutes (Chess.com API rate limit friendly)
        setInterval(fetchChessRating, 10 * 60 * 1000);
    }
    
    // ===== CERTIFICATION MANAGEMENT =====
    // Dynamic management of certification badges
    function initCertificationManager() {
        const certContainer = document.getElementById('certifications-container');
        if (!certContainer) return;
        
        console.log('Certification management system ready');
        
        // Future implementation for adding certifications dynamically
        // This will be used when new certifications are earned
        
        // Function to add a new certification badge
        /*
        function addCertification(cert) {
            const badge = document.createElement('img');
            badge.src = cert.imageUrl;
            badge.alt = cert.name;
            badge.width = 70;
            badge.height = 70;
            badge.className = 'certification-badge';
            badge.title = `${cert.name} - Earned ${cert.date}`;
            
            // Add click handler for verification
            badge.addEventListener('click', () => {
                if (cert.verificationUrl) {
                    window.open(cert.verificationUrl, '_blank');
                }
            });
            
            certContainer.appendChild(badge);
            
            // Animate the new badge in
            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'scale(1)';
            }, 100);
        }
        
        // Example certification objects:
        const certifications = [
            {
                name: 'Google Cloud Professional Cloud Architect',
                imageUrl: 'path/to/gcp-cert.png',
                date: '2024-12-15',
                verificationUrl: 'https://cloud.google.com/certification/verify/...'
            },
            {
                name: 'HashiCorp Terraform Associate',
                imageUrl: 'path/to/terraform-cert.png',
                date: '2024-11-20',
                verificationUrl: 'https://www.credly.com/badges/...'
            }
        ];
        
        // Load existing certifications
        certifications.forEach(cert => addCertification(cert));
        */
        
        // For now, keep the container hidden until certifications are added
        if (certContainer.children.length === 0) {
            certContainer.style.display = 'none';
        }
    }
    
    // ===== INITIALIZATION =====
    // Initialize all website functionality in the correct order
    console.log('🚀 Initializing Yuri Hlebanja Resume Website');
    
    // Core functionality
    animateTimeline();
    initSmoothScroll();
    initLazyLoading();
    trackExternalLinks();
    enhanceTestimonialSlider();
    initEmailCopy();
    initPerformanceMonitoring();
    
    // Future features
    initChessRating();
    initCertificationManager();
    
    console.log('✅ Website initialization complete');
    
    // ===== ERROR HANDLING =====
    // Global error handler for debugging and user experience
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        
        // Track JavaScript errors with analytics (optional)
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'JavaScriptError', {
                error_message: e.error ? e.error.message : 'Unknown error',
                error_file: e.filename,
                error_line: e.lineno
            });
        }
    });
    
});

// ===== UTILITY FUNCTIONS =====
// Reusable helper functions for various website functionality
const utils = {
    /**
     * Debounce function - Limits the rate at which a function can fire
     * Useful for performance optimization on scroll/resize events
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Whether to execute immediately
     */
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
    
    /**
     * Check if an element is currently visible in the viewport
     * Useful for triggering animations or lazy loading
     * @param {Element} element - DOM element to check
     * @returns {boolean} - True if element is in viewport
     */
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    /**
     * Future utility: Format Chess.com rating with proper styling
     * @param {number} rating - Chess puzzle rating
     * @param {number} change - Rating change (+/-)
     * @returns {string} - Formatted rating HTML
     */
    formatChessRating: function(rating, change) {
        const changeClass = change >= 0 ? 'positive' : 'negative';
        const changeSymbol = change >= 0 ? '+' : '';
        return `<strong>${rating}</strong> <span class="${changeClass}">${changeSymbol}${change}</span>`;
    }
};

// ===== GLOBAL EXPORTS =====
// Make utilities available globally for potential use in other scripts or modules
window.ResumeUtils = utils;

// Also make main functions available for external control if needed
window.YuriResume = {
    utils: utils,
    reinitializeTimeline: animateTimeline,
    // Add other functions here as needed for external access
};

// Log completion
console.log('📄 Yuri Hlebanja Resume Website - Scripts loaded successfully');