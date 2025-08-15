Yuri Hlebanja's Resume Website
This is a reorganized version of Yuri's professional resume website, originally built with Webflow.
File Structure
resume-website/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── scripts.js          # Custom JavaScript functionality
└── README.md          # This file
Features

Responsive Timeline Design: Interactive timeline showing work experience
Testimonials Slider: Rotating testimonials from colleagues
Social Media Integration: Links to LinkedIn, GitHub, and Calendly
Performance Optimized: Lazy loading images and smooth animations
Analytics Ready: Facebook Pixel integration included

Technologies Used

HTML5 semantic markup
CSS3 with Flexbox and Grid
Vanilla JavaScript (ES6+)
External Dependencies:

jQuery 3.5.1 (from Webflow)
Webflow's interaction scripts
Facebook Pixel for analytics



Key Sections

Hero Section: Professional photo, name, current role, and certifications
Experience Timeline: Detailed work history from 2016-present
Testimonials: Rotating quotes from former colleagues and managers
Contact Footer: Email and social media links

Setup Instructions

Download all files to your web server
Ensure the files maintain their relative paths
The site will work with the external Webflow CSS dependencies
For local development, you may want to download the external CSS files

External Dependencies
The site relies on these external resources:

Webflow CSS: https://cdn.prod.website-files.com/661a17fef51abcb8be9f5e33/css/kalyano.webflow.shared.9efada71a.css
jQuery: https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js
Webflow JS chunks: Various JavaScript files from Webflow's CDN
Images: All hosted on Webflow's CDN

Customization
Adding New Timeline Items
To add new work experience:

Copy an existing .timeline_item div in index.html
Update the dates, company name, role, and description
Add any testimonials or images as needed

Styling Changes

Modify styles.css for custom styles
The main styling comes from the external Webflow CSS
Use browser dev tools to inspect and override specific classes

JavaScript Enhancements

Add new functions to scripts.js
The existing code includes utilities for animations, tracking, and interactions

Performance Considerations

Images are lazy-loaded for better performance
Smooth scrolling is implemented for better UX
Analytics tracking is included for external link clicks
Error handling and performance monitoring included

Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge)
Mobile responsive design
Graceful degradation for older browsers

Contact Information

Email: yurihlebanja@gmail.com   
LinkedIn: https://www.linkedin.com/in/yurihlebanja/
GitHub: https://github.com/yurihtal
Calendly: https://calendly.com/yurihlebanja/quickchat

License
This is a personal resume website. Please respect the individual's professional information and use responsibly.