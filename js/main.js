// Image Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product-slider').forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const images = container.querySelectorAll('img');
        const background = slider.querySelector('.slider-background');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        let currentIndex = 0;
        let isTransitioning = false;
        const transitionDuration = 850; // match with CSS transition duration

        // Create dots container
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        slider.appendChild(dotsContainer);

        // Create dots for each image
        images.forEach((img, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (!isTransitioning && index !== currentIndex) {
                    currentIndex = index;
                    showImage(currentIndex);
                }
            });
            dotsContainer.appendChild(dot);
        });

        // Set initial background
        const activeSrc = images[currentIndex].src;
        background.style.backgroundImage = `url(${activeSrc})`;
        images[currentIndex].classList.add('active');
        images[currentIndex].style.opacity = '1';
        images[currentIndex].style.transform = 'scale(1)';

        function showImage(index) {
            if (isTransitioning) return;
            isTransitioning = true;
            
            // Update dots
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Get the new image source
            const newSrc = images[index].src;
            
            // Create a temporary div for crossfade effect
            const tempBg = document.createElement('div');
            tempBg.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url(${newSrc});
                background-size: cover;
                background-position: center;
                filter: blur(12px);
                opacity: 0;
                transform: scale(1.1);
                z-index: 0;
                transition: opacity ${transitionDuration}ms ease;
                border-radius: 20px 20px 0 0;
            `;
            
            slider.insertBefore(tempBg, background);
            
            // Batch all DOM operations together for better performance
            requestAnimationFrame(() => {
                // Start the image and background transitions simultaneously
                
                // 1. Fade out current image
                images.forEach(img => {
                    img.classList.remove('active');
                    img.style.transform = 'scale(0.95)';
                    img.style.opacity = '0';
                });
                
                // 2. Fade in new background
                tempBg.style.opacity = '0.6';
                
                // 3. Fade in new image
                images[index].classList.add('active');
                images[index].style.transform = 'scale(1)';
                images[index].style.opacity = '1';
                
                // After transition completes, update the real background and remove temp
                setTimeout(() => {
                    background.style.backgroundImage = `url(${newSrc})`;
                    if (slider.contains(tempBg)) {
                        slider.removeChild(tempBg);
                    }
                    isTransitioning = false;
                }, transitionDuration + 50);
            });
        }

        prevBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });

        // Auto-rotate images every 5 seconds
        let autoRotateInterval = setInterval(() => {
            if (!isTransitioning && !slider.matches(':hover')) {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            }
        }, 5000);
        
        // Pause auto-rotation when hovering over the slider
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            autoRotateInterval = setInterval(() => {
                if (!isTransitioning) {
                    currentIndex = (currentIndex + 1) % images.length;
                    showImage(currentIndex);
                }
            }, 5000);
        });
    });

    // Scroll Animation
    function checkFadeElements() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Run on page load
    checkFadeElements();
    
    // Run on scroll
    window.addEventListener('scroll', checkFadeElements);
}); 