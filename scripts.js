document.addEventListener('DOMContentLoaded', () => {
    [
        initParticles,
        initScrollAnimations,
        initCardHover,
        initNavbar,
        initSmoothScroll,
        initTerminalTyping,
        initMobileMenu,
        initArchitectureDiagram
    ].forEach(fn => fn());
});

function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#6875F5" },
            shape: {
                type: "circle",
                stroke: { width: 0 }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                anim: { enable: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#6875F5",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: false },
                onclick: { enable: false },
                resize: true
            }
        },
        retina_detect: true
    });
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const createScrollAnimation = (selector, stagger = 0) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : index * stagger;
            
            gsap.fromTo(el, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    delay: delay,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    };
    
    createScrollAnimation('.feature-card', 0.2);
    createScrollAnimation('.demo-title');
    createScrollAnimation('.resources-title');
    createScrollAnimation('.resources-links');
    createScrollAnimation('.download-section');
}

function initCardHover() {
    document.querySelectorAll('.card-3d').forEach(card => {
        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
        
            const midCardWidth = rect.width / 2;
            const midCardHeight = rect.height / 2;
            
            const angleY = -(((x - midCardWidth) / midCardWidth) * 10);
            const angleX = ((y - midCardHeight) / midCardHeight) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        };
        
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}


function initSmoothScroll() {
    const smoothScrollTo = (target, duration = 300) => {
        const start = window.pageYOffset;
        const distance = target - start;
        const startTime = performance.now();
        
        const easeOutQuad = t => t * (2 - t);
        
        const animation = currentTime => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            window.scrollTo(0, start + distance * easeOutQuad(progress));
            if (progress < 1) requestAnimationFrame(animation);
        };
        requestAnimationFrame(animation);
    };

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100');
            } else {
                backToTopBtn.classList.remove('opacity-100');
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            smoothScrollTo(0);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu.classList.contains('block')) {
                mobileMenu.classList.replace('block', 'hidden');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                smoothScrollTo(offsetTop);
            }
        });
    });
}

function initTerminalTyping() {
    const terminalText = document.getElementById('terminal-text');
    if (!terminalText) return;
    
    const text = terminalText.textContent;
    terminalText.textContent = '';
    
    let i = 0;
    let isTagOpen = false;
    
    function typeWriter() {
        if (i < text.length) {
            const char = text.charAt(i);
            
            if (char === '<') isTagOpen = true;
            if (char === '>') isTagOpen = false;
            
            if (isTagOpen) {
                while (i < text.length && text.charAt(i) !== '>') {
                    terminalText.innerHTML += text.charAt(i);
                    i++;
                }
                if (i < text.length) {
                    terminalText.innerHTML += text.charAt(i);
                    i++;
                }
                requestAnimationFrame(typeWriter);
            } else {
                terminalText.innerHTML += char;
                i++;
                
                let speed = 20;
                if (char === '#' || char === '$' || char === '\n') {
                    speed = 100 + Math.random() * 100;
                } else {
                    speed = 10 + Math.random() * 30;
                }
                
                setTimeout(typeWriter, speed);
            }
        }
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(terminalText.parentElement.parentElement);
}

function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        mobileMenu.addEventListener('click', (event) => {
            if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON') {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

function initArchitectureDiagram() {
    const diagram = document.querySelector('.architecture-diagram');
    if (!diagram) return;
    
    drawConnectionLines();
    
    window.addEventListener('resize', debounce(drawConnectionLines, 250));
}

function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}

function drawConnectionLines() {
    const connectionLinesContainer = document.getElementById('connection-lines');
    if (!connectionLinesContainer) return;
    
    connectionLinesContainer.innerHTML = '';
    
    const masterTopNode = document.querySelector('.arch-layer[data-node-type="master-top"]');
    const masterBottomNode = document.querySelector('.arch-layer[data-node-type="master-bottom"]');
    
    if (!masterTopNode || !masterBottomNode) return;
    

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    
    const containerRect = connectionLinesContainer.getBoundingClientRect();
    
    const getElementRect = (element) => {
        const rect = element.getBoundingClientRect();
        return {
            left: rect.left - containerRect.left,
            right: rect.right - containerRect.left,
            top: rect.top - containerRect.top,
            bottom: rect.bottom - containerRect.top,
            width: rect.width,
            height: rect.height
        };
    };
    

    const createPath = (startX, startY, endX, endY, offset, color, isDashed) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midY = (startY + endY) / 2;
        
        path.setAttribute('d', `M${startX + offset},${startY} 
                            C${startX + offset},${midY} 
                            ${endX + offset},${midY} 
                            ${endX + offset},${endY}`);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        
        if (isDashed) {
            path.setAttribute('stroke-dasharray', '4,4');
            
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animate.setAttribute('attributeName', 'stroke-dashoffset');
            animate.setAttribute('from', '0');
            animate.setAttribute('to', '16');
            animate.setAttribute('dur', '1s');
            animate.setAttribute('repeatCount', 'indefinite');
            path.appendChild(animate);
        }
        
        return path;
    };
    
    const topServerElement = masterTopNode.querySelector('.bg-indigo-900');
    const topClientElement = masterTopNode.querySelector('.bg-green-900');
    const bottomServerElement = masterBottomNode.querySelector('.bg-indigo-900');
    const bottomClientElement = masterBottomNode.querySelector('.bg-green-900');
    
    if (!topServerElement || !topClientElement || !bottomServerElement || !bottomClientElement) return;
    
    const topServerRect = getElementRect(topServerElement);
    const topClientRect = getElementRect(topClientElement);
    const bottomServerRect = getElementRect(bottomServerElement);
    const bottomClientRect = getElementRect(bottomClientElement);
    
    const topServerBottom = {
        x: topServerRect.left + topServerRect.width / 2,
        y: topServerRect.bottom
    };
    
    const topClientBottom = {
        x: topClientRect.left + topClientRect.width / 2,
        y: topClientRect.bottom
    };
    
    const bottomServerTop = {
        x: bottomServerRect.left + bottomServerRect.width / 2,
        y: bottomServerRect.top
    };
    
    const bottomClientTop = {
        x: bottomClientRect.left + bottomClientRect.width / 2,
        y: bottomClientRect.top
    };
    
    const offset = 15;
    
    svg.appendChild(createPath(
        topServerBottom.x, topServerBottom.y,
        bottomClientTop.x, bottomClientTop.y,
        -offset, '#3B82F6', true
    ));
    
    svg.appendChild(createPath(
        topServerBottom.x, topServerBottom.y,
        bottomClientTop.x, bottomClientTop.y,
        offset, '#10B981', true
    ));
    
    svg.appendChild(createPath(
        topClientBottom.x, topClientBottom.y,
        bottomServerTop.x, bottomServerTop.y,
        -offset, '#3B82F6', true
    ));
    
    svg.appendChild(createPath(
        topClientBottom.x, topClientBottom.y,
        bottomServerTop.x, bottomServerTop.y,
        offset, '#10B981', true
    ));
    
    connectionLinesContainer.appendChild(svg);
}