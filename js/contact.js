document.addEventListener('DOMContentLoaded', function() {
    function checkFontAwesome() {
        const testElement = document.createElement('i');
        testElement.className = 'fas fa-phone';
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.fontSize = '16px';
        document.body.appendChild(testElement);
        
        const iconWidth = testElement.offsetWidth;
        document.body.removeChild(testElement);
        
        if (iconWidth === 0 || iconWidth < 10) {
            document.body.classList.add('fontawesome-fallback');

        }
    }
    
    setTimeout(checkFontAwesome, 500);
    
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
        
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentNode;
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(contactForm);
                
                const name = formData.get('name')?.trim();
                const email = formData.get('email')?.trim();
                const phone = formData.get('phone')?.trim();
                const subject = formData.get('subject')?.trim();
                const message = formData.get('message')?.trim();
                
                if (!name || !email || !phone || !subject || !message) {
                    throw new Error('Please fill in all required fields.');
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error('Please enter a valid email address.');
                }
                
                // Phone validation 
                if (phone.length < 8) {
                    throw new Error('Please enter a valid phone number.');
                }
                
                // Submit form
                const response = await fetch('https://good-way.onrender.com/index.php', {
                    method: 'POST',
                    body: formData,
                    mode: 'cors',
                    credentials: 'omit'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.text();
                
                if (data.trim() === 'success') {
                    showFormMessage('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error(data || 'Unknown server response');
                }
            } catch (error) {
                showFormMessage(error.message || 'There was an error submitting your form. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    function showFormMessage(message, type) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    initParticles();
    
    initLazyLoading();
    
    initSecurityMeasures();
});

function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 50); // Limit to 50 particles max
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1; 
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        const opacity = Math.random() * 0.3 + 0.1; 
        
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${posX}%`,
            top: `${posY}%`,
            opacity: opacity,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            willChange: 'transform' 
        });
        
        particlesContainer.appendChild(particle);
        particles.push(particle);
    }
    
    let lastTime = 0;
    const animationFrame = (time) => {
        if (time - lastTime > 30) { 
            particles.forEach(particle => {
                const currentTop = parseFloat(particle.style.top);
                const newTop = currentTop > 100 ? -10 : currentTop + 0.05;
                particle.style.top = `${newTop}%`;
            });
            lastTime = time;
        }
        requestAnimationFrame(animationFrame);
    };
    
    requestAnimationFrame(animationFrame);
}

function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    lazyLoadObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px' 
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            lazyLoadObserver.observe(img);
        });
    }
}

function initSecurityMeasures() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        const blockedCombinations = [
            e.ctrlKey && e.key.toLowerCase() === 'u',
            e.ctrlKey && e.key.toLowerCase() === 's',
            e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i',
            e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j',
            e.ctrlKey && e.key.toLowerCase() === 'c',
            e.key === 'F12',
            e.altKey && e.metaKey && e.key.toLowerCase() === 'i'
        ];

        if (blockedCombinations.some(combination => combination)) {
            e.preventDefault();
             alert('This functionality is disabled.');
        }
    });
}
