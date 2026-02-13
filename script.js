// ===== Global Variables =====
let currentSection = 0;
const totalSections = 5;
let isScrolling = false;
let musicPlaying = false;
let countdownTimer = null;
let hasSaidYes = false;
let siteUnlocked = false;

// ===== Image mapping for gallery =====
const photoImages = {
    '1': 'Captured-1.jpeg',
    '2': 'Captured-2.jpeg',
    '3': 'Captured-3.jpeg',
    '4': 'Captured-4.jpeg',
    '5': 'Captured-5.jpeg',
    '6': 'Captured-6.jpeg',
    '7': 'Captured-7.jpeg',
    '8': 'Captured-8.jpeg',
    '9': 'Captured-9.jpeg'
};

// ===== Memory text for each photo =====
const photoMemories = {
    '1': "4 April - My first time 'first day' with you. I remember falling asleep in your arms in the movie theatre. Then attending the mass with you in the Cathedral, only to get caught Mimi's closest friend. Then finally making a reel in CP's McDonalds.",
    '2': "28 May - Our first time spending a night together. OMG I WILL NEVER FORGET THIS EVER. The 6am cuddle is in the top 3 moments of our relationship.",
    '3': "12 July - Marrying each other for the first time! Call me husband now baby girl ;)",
    '4': "26 September - Mimi Dedda were in Bangalore and no one knew I was with you. I remember sleeping next to you and Mumma. The first time I felt like your family and also going to a carnival for the first time in my life and hahahahaah 'JHUUUUTTAA'",
    '5': "4 October - Boating date!! I remember how excited I was to experience boating with you. Peak husband wife activity",
    '6': '29 November - This has to the best day. YOU CAME TO PICK ME UP. YOU GOT DRESSED SPECIALLY FOR ME. Jesus also blessed up with a goated photographer haha and we also FINALLY went to Jama Masjid. "Lekhakh Sahabh khush hue hahaha"',
    '7': "8 December - Our ONE YEAR Anniversary and the MOST AWAITED date. Finally went to an amusement park. That woman's stare still haunts me hahaha. But nevertheless I finally got to do a friend's activity with you and I loved it because I did it with my BEST FRIEND",
    '8': "3 January - 'Embassy Bingo ✅. I loved the drive with my favourite yap partner and the love of my life. Also, I ate something NEW for the first time in my life. Also, who gives Popcorn with Coffee?'",
    '9': "24 January - This was the second most date ever after Amusement park. On some days I might rate it ever higher. I LOVE RENDEZVOUS WITH MY BSF. Haha finding the tomb was a hassle, only I had listened to my Wife. Haha the guard was a vibe and finally KFC HIT SO HARD THAT DAY."
};

// ===== DOM Elements =====
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.dot');
const audioBtn = document.getElementById('audioToggle');
const bgMusic = document.getElementById('bgMusic');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    setupEventListeners();
    showSection(0);
    setupIntersectionObserver();
    document.body.classList.add('locked');
});

function lockScroll() {
    document.body.style.overflow = 'hidden';
}

function unlockScroll() {
    document.body.style.overflow = '';
}

lockScroll();
// ===== Particle Background =====
function initParticles() {
    const particlesContainer = document.getElementById('particles-background');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 3 + 2}s infinite;
        `;
        particlesContainer.appendChild(particle);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
        }
    `;
    document.head.appendChild(style);
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Start Journey Button
    document.getElementById('startJourney').addEventListener('click', function () {
        if (!siteUnlocked) {
            showToast('Turn the music on first 🎵');
            return;
        }
        scrollToSection(1);
    });

    // Navigation Buttons
    document.getElementById('toGallery')?.addEventListener('click', () => scrollToSection(2));
    document.getElementById('toReasons')?.addEventListener('click', () => scrollToSection(3));
    document.getElementById('toQuestion')?.addEventListener('click', () => scrollToSection(4));
    
    // Nav Dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => scrollToSection(index));
    });
    
    // Audio Toggle
    audioBtn.addEventListener('click', toggleMusic);
    
    // Choice Buttons
    document.getElementById('yesChoice').addEventListener('click', handleYesClick);
    document.getElementById('noChoice').addEventListener('click', handleNoClick);
    
    // Countdown Button
    document.getElementById('countdownBtn').addEventListener('click', function () {
        if (!hasSaidYes) {
            showToast('You need to say Yes first 💕');
            return;
        }
        openCountdown();
    });
    
    // Modal Closes
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
        });
    });
    
    document.getElementById('closeSuccess').addEventListener('click', function() {
        document.getElementById('successModal').classList.remove('show');
    });
    
    // Gallery Cards
    document.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', function() {
            openPhotoModal(this.dataset.photo);
        });
    });
    
    // Scroll Event
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateCurrentSection();
            }, 100);
        }
    });
    
    // Keyboard Navigation
    document.getElementById('startJourney').addEventListener('click', function () {
    if (!siteUnlocked) {
        showToast('Turn the music on first 🎵');
        return;
    }
    scrollToSection(1);
    });
    window.addEventListener('wheel', function(e) {
        if (!siteUnlocked) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
        });
    });
}

// ===== Section Navigation =====
function scrollToSection(index) {
    if (index < 0 || index >= totalSections) return;
    
    isScrolling = true;
    currentSection = index;
    
    sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    updateNavDots();
    
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

function showSection(index) {
    sections.forEach((section, i) => {
        if (i === index) {
            section.classList.add('active');
        }
    });
    updateNavDots();
}

function updateCurrentSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = index;
        }
    });
    
    updateNavDots();
}

function updateNavDots() {
    navDots.forEach((dot, index) => {
        if (index === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ===== Intersection Observer =====
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate timeline items
                if (entry.target.id === 'timeline') {
                    animateTimeline();
                }
                
                // Animate gallery cards
                if (entry.target.id === 'gallery') {
                    animateGallery();
                }
                
                // Animate reason cards
                if (entry.target.id === 'reasons') {
                    animateReasons();
                }
                
                // Trigger heart rain
                if (entry.target.id === 'question') {
                    startHeartRain();
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ===== Animations =====
function animateTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
        }, index * 200);
    });
}

function animateGallery() {
    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('show');
        }, index * 100);
    });
}

window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.gallery-card').forEach(card => {
            card.classList.add('show');
        });
    }, 1200);
});

function animateReasons() {
    const cards = document.querySelectorAll('.reason-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('show');
        }, index * 150);
    });
}

function startHeartRain() {
    const heartRain = document.querySelector('.heart-rain');
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    
    setInterval(() => {
        if (document.getElementById('question').classList.contains('visible')) {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: ${Math.random() * 20 + 20}px;
                animation: fallDown ${Math.random() * 3 + 3}s linear;
                pointer-events: none;
            `;
            heartRain.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 6000);
        }
    }, 500);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fallDown {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}


function unlockExperience() {
    document.body.classList.remove('locked', 'scroll-locked');
    document.body.classList.add('unlocked');

    // Small delay before auto scroll hint
    setTimeout(() => {
        document.querySelector('.scroll-indicator')?.classList.add('visible');
    }, 1500);
}

// ===== Music Control =====
function toggleMusic() {
    if (musicPlaying) {
        // PAUSE
        bgMusic.pause();
        audioBtn.innerHTML = '<span class="audio-icon">🔇</span>';
        audioBtn.classList.remove('playing');
        musicPlaying = false;

        // Freeze site again
        siteUnlocked = false;
        document.body.classList.remove('unlocked');
        document.body.classList.add('locked');
        lockScroll();
    } else {
        // PLAY
        bgMusic.play().then(() => {
            audioBtn.innerHTML = '<span class="audio-icon">🔊</span>';
            audioBtn.classList.add('playing');
            musicPlaying = true;

            // Unlock site
            siteUnlocked = true;
            document.body.classList.remove('locked');
            document.body.classList.add('unlocked');
            unlockScroll();
        }).catch(err => {
            console.log('Audio play failed:', err);
            showToast('Tap again to wake the page ✨');
        });
    }
}

// ===== Choice Handlers =====
function handleYesClick() {
    hasSaidYes = true;

    // Unlock the surprise button
    const surpriseBtn = document.getElementById('countdownBtn');
    surpriseBtn.disabled = false;
    surpriseBtn.classList.remove('locked');
    surpriseBtn.innerHTML = '<span>✨ Special Surprise ✨</span>';

    createFireworks();
    openSuccessModal();
    createConfetti();
}

function handleNoClick() {
    const noBtn = document.getElementById('noChoice');
    const yesBtn = document.getElementById('yesChoice');
    
    // Make no button jump away
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 200;
    
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    setTimeout(() => {
        noBtn.style.transform = '';
    }, 300);
    
    // Make yes button bigger
    const currentScale = parseFloat(getComputedStyle(yesBtn).transform.match(/matrix\(([^,]+)/)?.[1] || '1');
    yesBtn.style.transform = `scale(${Math.min(currentScale * 1.15, 2)})`;
    
    showToast('Are you sure? 🥺');
}

// ===== Photo Modal ===== FIXED VERSION
function openPhotoModal(photoId) {
    const modal = document.getElementById('photoModal');
    const photoDisplay = document.querySelector('.photo-display');
    
    // Clear previous content
    photoDisplay.innerHTML = '';
    
    // Get the image source from the mapping
    const imageSrc = photoImages[photoId];
    
    if (imageSrc) {
        // Create and display the actual image
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Memory #${photoId}`;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 15px;
        `;
        photoDisplay.appendChild(img);
        
        // Update title and description
        document.getElementById('photoTitle').textContent = `Memory #${photoId}`;
        document.getElementById('photoDescription').textContent = photoMemories[photoId] || 'One of those moments I never want to forget.';
    } else {
        // Fallback if image not found
        photoDisplay.innerHTML = '<span class="photo-placeholder">📸</span>';
        document.getElementById('photoTitle').textContent = 'Memory';
        document.getElementById('photoDescription').textContent = 'Image not found';
    }
    
    modal.classList.add('show');
}

// ===== Countdown Modal =====
function openCountdown() {
    const modal = document.getElementById('countdownModal');
    modal.classList.add('show');
    startCountdown();
}

function startCountdown() {
    const valentineDay = new Date('February 13, 2026 23:08:00').getTime();
    
    countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = valentineDay - now;
        
        if (distance < 0) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            showValentineLink();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('cDays').textContent = String(days).padStart(2, '0');
        document.getElementById('cHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cSeconds').textContent = String(seconds).padStart(2, '0');
    }, 1000);
}

function showValentineLink() {
    document.getElementById('valentineLink').style.display = 'block';
    document.querySelector('.countdown-message').textContent = 'Happy Valentine\'s Day! 💝';
}

// ===== Success Modal =====
function openSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    animateHeartBurst();
}

function animateHeartBurst() {
    const hearts = document.querySelectorAll('.heart-burst span');
    const positions = [
        { x: 0, y: -100 },
        { x: 100, y: -50 },
        { x: 100, y: 50 },
        { x: 0, y: 100 },
        { x: -100, y: 0 }
    ];
    
    hearts.forEach((heart, index) => {
        if (positions[index]) {
            heart.style.setProperty('--x', positions[index].x + 'px');
            heart.style.setProperty('--y', positions[index].y + 'px');
        }
    });
}

// ===== Effects =====
function createFireworks() {
    const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffc0cb', '#ff91a4'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 50}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(firework);
            
            for (let j = 0; j < 20; j++) {
                const spark = document.createElement('div');
                spark.style.cssText = `
                    position: fixed;
                    left: ${firework.style.left};
                    top: ${firework.style.top};
                    width: 5px;
                    height: 5px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                `;
                document.body.appendChild(spark);
                
                const angle = (Math.PI * 2 * j) / 20;
                const velocity = 2 + Math.random() * 3;
                
                let posX = 0;
                let posY = 0;
                const sparkAnimation = setInterval(() => {
                    posX += Math.cos(angle) * velocity;
                    posY += Math.sin(angle) * velocity;
                    spark.style.transform = `translate(${posX}px, ${posY}px)`;
                    spark.style.opacity = 1 - Math.abs(posX + posY) / 300;
                    
                    if (Math.abs(posX) > 200 || Math.abs(posY) > 200) {
                        clearInterval(sparkAnimation);
                        spark.remove();
                    }
                }, 20);
            }
            
            setTimeout(() => firework.remove(), 2000);
        }, i * 300);
    }
}

function createConfetti() {
    const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ADD8E6', '#87ceeb', '#ffd700'];
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: -20px;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 9999;
                animation: confettiFall ${Math.random() * 3 + 3}s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 6000);
        }, i * 20);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    if (!document.getElementById('confetti-style')) {
        style.id = 'confetti-style';
        document.head.appendChild(style);
    }
}

function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(255, 64, 129, 0.5);
        animation: toastSlide 0.5s ease;
    `;
    document.body.appendChild(toast);
    
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        @keyframes toastSlide {
            from {
                transform: translateX(-50%) translateY(-100px);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
    `;
    if (!document.getElementById('toast-style')) {
        toastStyle.id = 'toast-style';
        document.head.appendChild(toastStyle);
    }
    
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.5s ease reverse';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ===== Console Easter Egg =====
console.log('%c💖 Welcome to Our Love Story! 💖', 'color: #ff1493; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(255,20,147,0.5);');
console.log('%c✨ Made with love and code ✨', 'color: #ff69b4; font-size: 16px;');
console.log('%cTip: Use arrow keys or Page Up/Down to navigate!', 'color: #ADD8E6; font-size: 12px;');
