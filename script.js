// Splash Screen
document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const splashBtn = document.querySelector('.splash-btn');
    
    // Detect backdrop-filter support
    detectBackdropFilterSupport();
    
    // Ensure logo text visibility
    ensureLogoVisibility();
    
    // Create particles
    createParticles();
    
    // Clean up any existing audio elements
    const existingAudio = document.querySelectorAll('audio');
    existingAudio.forEach(audio => {
        audio.pause();
        audio.remove();
    });
    
    // Hide splash screen when button is clicked
    splashBtn.addEventListener('click', function() {
        splashScreen.classList.add('hidden');
        // Initialize music player only after splash screen is hidden
        setTimeout(initMusicPlayer, 500);
    });
    
    // Auto-hide splash screen after 8 seconds
    setTimeout(function() {
        splashScreen.classList.add('hidden');
        // Initialize music player only after splash screen is hidden
        setTimeout(initMusicPlayer, 500);
    }, 8000);
});

// Detect backdrop-filter browser support
function detectBackdropFilterSupport() {
    const testElement = document.createElement('div');
    const hasBackdropFilter = 'backdropFilter' in testElement.style || 
                             'webkitBackdropFilter' in testElement.style;
    
    if (!hasBackdropFilter) {
        document.body.classList.add('no-backdrop-filter');
    }
}

// Create floating particles
function createParticles() {
    const particleContainer = document.querySelector('.particle-container');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 6 + 2;
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + Math.random() * 100;
        const duration = Math.random() * 4 + 6;
        const delay = Math.random() * 5;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        particleContainer.appendChild(particle);
    }
}

// Music Player
let isMusicPlaying = false;
let currentTrack = 0;
let audioPlayer = null; // Single audio instance
let isShuffleOn = true; // Enable shuffle by default
let isPlayerMinimized = true; // Track player state

const tracks = ['ngaongo.mp3', 'music3.mp3', 'nuocmatcasau.mp3'];
const trackInfo = [
    { title: 'ngáo Ngơ', artist: 'Nguyễn Cảnh Điền' },
    { title: 'Music 3', artist: 'Nguyễn Cảnh Điền' },
    { title: 'Nước Mắt Cá Sấu', artist: 'Nguyễn Cảnh Điền' }
];

function initMusicPlayer() {
    // Check if already initialized to prevent duplicate
    if (audioPlayer) {
        console.log('Music player already initialized');
        return;
    }
    
    const musicPlayerRectangle = document.getElementById('musicPlayerRectangle');
    const musicPlayerCircle = document.getElementById('musicPlayerCircle');
    const playerContainer = document.getElementById('playerContainer');
    const circlePlayBtn = document.getElementById('circlePlayBtn');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const progressFill = document.querySelector('.progress-fill');
    const progressBar = document.querySelector('.progress-bar');
    
    // Create single audio element
    audioPlayer = new Audio();
    audioPlayer.preload = 'metadata'; // Only load metadata, not the full audio
    
    // Set initial volume
    audioPlayer.volume = 0.7;
    
    // Start with circle mode (minimized)
    isPlayerMinimized = true;
    if (musicPlayerCircle) musicPlayerCircle.style.display = 'flex';
    if (playerContainer) playerContainer.style.display = 'none';
    
    // Remove existing event listeners to prevent duplicates
    if (playBtn) playBtn.replaceWith(playBtn.cloneNode(true));
    if (prevBtn) prevBtn.replaceWith(prevBtn.cloneNode(true));
    if (nextBtn) nextBtn.replaceWith(nextBtn.cloneNode(true));
    if (progressBar) progressBar.replaceWith(progressBar.cloneNode(true));
    if (circlePlayBtn) circlePlayBtn.replaceWith(circlePlayBtn.cloneNode(true));
    if (volumeBtn) volumeBtn.replaceWith(volumeBtn.cloneNode(true));
    if (volumeSlider) volumeSlider.replaceWith(volumeSlider.cloneNode(true));
    if (shuffleBtn) shuffleBtn.replaceWith(shuffleBtn.cloneNode(true));
    
    // Get fresh references
    const freshPlayBtn = document.getElementById('playBtn');
    const freshPrevBtn = document.getElementById('prevBtn');
    const freshNextBtn = document.getElementById('nextBtn');
    const freshVolumeBtn = document.getElementById('volumeBtn');
    const freshVolumeSlider = document.getElementById('volumeSlider');
    const freshShuffleBtn = document.getElementById('shuffleBtn');
    const freshProgressBar = document.querySelector('.progress-bar');
    const freshCirclePlayBtn = document.getElementById('circlePlayBtn');
    
    // Circle play button - toggle music only
    if (freshCirclePlayBtn) {
        freshCirclePlayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMusic();
        });
    }
    
    // Click circle to toggle size (1 click)
    if (musicPlayerCircle) {
        musicPlayerCircle.addEventListener('click', function(e) {
            console.log('Circle clicked, target:', e.target);
            // Only toggle size if not clicking the play button
            if (!e.target.closest('.circle-play-btn')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Toggling player size from circle');
                togglePlayerSize();
            }
        });
    }
    
    // Click empty area in rectangle to minimize
    if (playerContainer) {
        playerContainer.addEventListener('click', function(e) {
            console.log('Container clicked, target:', e.target);
            // Only minimize if clicking empty area, not controls
            if (!e.target.closest('button') && 
                !e.target.closest('.progress-bar') && 
                !e.target.closest('.player-controls') &&
                !e.target.closest('.volume-control')) {
                console.log('Toggling player size from container');
                togglePlayerSize();
            }
        });
    }
    
    // Play/Pause functionality
    if (freshPlayBtn) {
        freshPlayBtn.addEventListener('click', function() {
            toggleMusic();
        });
    }
    
    // Previous track
    if (freshPrevBtn) {
        freshPrevBtn.addEventListener('click', function() {
            playPreviousTrack();
        });
    }
    
    // Next track
    if (freshNextBtn) {
        freshNextBtn.addEventListener('click', function() {
            playNextTrack();
        });
    }
    
    // Volume control
    if (freshVolumeSlider) {
        freshVolumeSlider.addEventListener('input', function() {
            const volume = this.value / 100;
            if (audioPlayer) {
                audioPlayer.volume = volume;
            }
            updateVolumeIcon(volume);
        });
    }
    
    // Volume button click (mute/unmute)
    if (freshVolumeBtn) {
        freshVolumeBtn.addEventListener('click', function() {
            if (audioPlayer) {
                if (audioPlayer.volume > 0) {
                    audioPlayer.dataset.previousVolume = audioPlayer.volume;
                    audioPlayer.volume = 0;
                    freshVolumeSlider.value = 0;
                } else {
                    const previousVolume = parseFloat(audioPlayer.dataset.previousVolume) || 0.7;
                    audioPlayer.volume = previousVolume;
                    freshVolumeSlider.value = previousVolume * 100;
                }
                updateVolumeIcon(audioPlayer.volume);
            }
        });
    }
    
    // Progress bar click
    freshProgressBar.addEventListener('click', function(e) {
        const rect = freshProgressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        
        if (audioPlayer.duration) {
            audioPlayer.currentTime = audioPlayer.duration * percentage;
        }
    });
    
    // Update progress
    audioPlayer.addEventListener('timeupdate', function() {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = progress + '%';
            updateTimeDisplay();
        }
    });
    
    // Track ended
    audioPlayer.addEventListener('ended', function() {
        console.log('Track ended, playing next track');
        playNextTrack();
    });
    
    // Track error handling
    audioPlayer.addEventListener('error', function(e) {
        console.error('Audio error:', e);
        console.log('Failed to load track:', tracks[currentTrack]);
        // Try to play next track if current one fails
        setTimeout(() => {
            playNextTrack();
        }, 1000);
    });
    
    // Initialize first track
    updateTrackInfo();
    
    // Set initial volume icon
    updateVolumeIcon(0.7);
    
    // Set initial shuffle button state
    if (freshShuffleBtn) {
        freshShuffleBtn.classList.add('active');
        freshShuffleBtn.innerHTML = '<i class="fas fa-random"></i>';
    }
    
    // Shuffle button functionality
    if (freshShuffleBtn) {
        freshShuffleBtn.addEventListener('click', function() {
            isShuffleOn = !isShuffleOn;
            this.classList.toggle('active');
            console.log('Shuffle mode:', isShuffleOn ? 'ON' : 'OFF');
        });
    }
    
    // Auto-start random music after user interaction
    // We'll try to auto-play but handle the case where browsers block it
    setTimeout(() => {
        // Select a random track to start with
        currentTrack = Math.floor(Math.random() * tracks.length);
        
        // Load the track first
        if (audioPlayer) {
            audioPlayer.src = tracks[currentTrack];
            audioPlayer.load();
            updateTrackInfo();
            
            // Try to play, but if it fails, we'll wait for user interaction
            audioPlayer.play().then(() => {
                isMusicPlaying = true;
                if (freshPlayBtn) freshPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                if (freshCirclePlayBtn) freshCirclePlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                console.log('Auto-play successful:', tracks[currentTrack]);
            }).catch(error => {
                console.log('Auto-play blocked, waiting for user interaction:', error);
                isMusicPlaying = false;
                if (freshPlayBtn) freshPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                if (freshCirclePlayBtn) freshCirclePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                
                // Add a visual indicator that user needs to click
                if (freshCirclePlayBtn) {
                    freshCirclePlayBtn.style.animation = 'pulse 2s ease-in-out infinite';
                }
            });
        }
    }, 1500);
}

// Toggle player size (minimize/maximize)
function togglePlayerSize() {
    const musicPlayerCircle = document.getElementById('musicPlayerCircle');
    const playerContainer = document.getElementById('playerContainer');
    
    console.log('Toggling player size, current state:', isPlayerMinimized);
    
    if (isPlayerMinimized) {
        // Expand to rectangle
        if (musicPlayerCircle) {
            musicPlayerCircle.style.display = 'none';
            console.log('Hiding circle mode');
        }
        if (playerContainer) {
            playerContainer.style.display = 'block';
            console.log('Showing rectangle mode');
        }
        isPlayerMinimized = false;
    } else {
        // Minimize to circle
        if (musicPlayerCircle) {
            musicPlayerCircle.style.display = 'flex';
            console.log('Showing circle mode');
        }
        if (playerContainer) {
            playerContainer.style.display = 'none';
            console.log('Hiding rectangle mode');
        }
        isPlayerMinimized = true;
    }
}

function toggleMusic() {
    if (!audioPlayer) {
        console.log('Audio player not initialized');
        return;
    }
    
    const playBtn = document.getElementById('playBtn');
    const circlePlayBtn = document.getElementById('circlePlayBtn');
    
    console.log('Toggle music called, current state:', isMusicPlaying);
    
    // Stop any other playing audio first
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => {
        if (audio !== audioPlayer) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    
    if (!audioPlayer.src) {
        console.log('Loading track:', tracks[currentTrack]);
        audioPlayer.src = tracks[currentTrack];
        audioPlayer.load();
        updateTrackInfo();
    }
    
    if (isMusicPlaying) {
        console.log('Pausing music');
        audioPlayer.pause();
        isMusicPlaying = false;
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (circlePlayBtn) circlePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        console.log('Playing music');
        audioPlayer.play().then(() => {
            isMusicPlaying = true;
            if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            if (circlePlayBtn) circlePlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            console.log('Music playing successfully:', tracks[currentTrack]);
            
            // Remove any pulse animation
            if (circlePlayBtn) {
                circlePlayBtn.style.animation = '';
            }
        }).catch(error => {
            console.log('Play failed:', error);
            isMusicPlaying = false;
            
            // Show visual feedback that user needs to interact
            if (circlePlayBtn) {
                circlePlayBtn.style.animation = 'pulse 1s ease-in-out 3';
                setTimeout(() => {
                    circlePlayBtn.style.animation = '';
                }, 3000);
            }
        });
    }
}

function playNextTrack() {
    if (isShuffleOn) {
        // Phát ngẫu nhiên
        let newTrack;
        do {
            newTrack = Math.floor(Math.random() * tracks.length);
        } while (newTrack === currentTrack && tracks.length > 1);
        currentTrack = newTrack;
    } else {
        // Phát theo thứ tự
        currentTrack = (currentTrack + 1) % tracks.length;
    }
    loadAndPlayTrack();
}

function playPreviousTrack() {
    if (isShuffleOn) {
        // Phát ngẫu nhiên cho previous cũng
        let newTrack;
        do {
            newTrack = Math.floor(Math.random() * tracks.length);
        } while (newTrack === currentTrack && tracks.length > 1);
        currentTrack = newTrack;
    } else {
        // Phát theo thứ tự
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    }
    loadAndPlayTrack();
}

function loadAndPlayTrack() {
    if (!audioPlayer) return;
    
    const playBtn = document.getElementById('playBtn');
    const circlePlayBtn = document.getElementById('circlePlayBtn');
    
    // Stop current playback
    audioPlayer.pause();
    
    // Load new track
    audioPlayer.src = tracks[currentTrack];
    audioPlayer.load();
    
    updateTrackInfo();
    
    // Try to play the track
    audioPlayer.play().then(() => {
        isMusicPlaying = true;
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (circlePlayBtn) circlePlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        console.log('Playing track:', tracks[currentTrack]);
    }).catch(error => {
        console.log('Auto-play prevented, trying to play after user interaction:', error);
        isMusicPlaying = false;
        if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (circlePlayBtn) circlePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // If auto-play is blocked, set up the player but don't play automatically
        // User will need to click play button manually
    });
}

function updateTrackInfo() {
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    
    if (trackTitle && trackArtist) {
        const track = trackInfo[currentTrack];
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
    }
}

function updateTimeDisplay() {
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    
    if (audioPlayer && currentTimeEl && totalTimeEl) {
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }
}

function updateVolumeIcon(volume) {
    const volumeBtn = document.getElementById('volumeBtn');
    if (!volumeBtn) return;
    
    let iconClass = 'fas fa-volume-';
    if (volume === 0) {
        iconClass += 'mute';
    } else if (volume < 0.3) {
        iconClass += 'off';
    } else if (volume < 0.7) {
        iconClass += 'down';
    } else {
        iconClass += 'up';
    }
    
    volumeBtn.innerHTML = `<i class="${iconClass}"></i>`;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Ensure logo text visibility in all scenarios
function ensureLogoVisibility() {
    const logoText = document.querySelector('.logo-text');
    if (!logoText) return;
    
    // Force visibility with inline styles as fallback
    const isDark = document.body.classList.contains('dark');
    
    // Check if the text is actually visible
    const computedStyle = window.getComputedStyle(logoText);
    const currentColor = computedStyle.color;
    
    // If the color is transparent or rgba(0,0,0,0), apply fallback
    if (currentColor === 'rgba(0, 0, 0, 0)' || currentColor === 'transparent') {
        logoText.style.color = isDark ? '#FFD700' : '#6366f1';
        logoText.style.webkitTextFillColor = 'initial';
        logoText.style.background = 'none';
        logoText.style.textShadow = isDark ? '0 0 20px rgba(255, 215, 0, 0.8)' : '0 0 15px rgba(99, 102, 241, 0.8)';
    }
    
    // Re-apply gradient if supported
    setTimeout(() => {
        if (supportsBackgroundClip()) {
            if (isDark) {
                logoText.style.background = 'linear-gradient(135deg, #FFD700, #FF6B35, #FF006E, #8338EC, #3A86FF, #06FFB4)';
                logoText.style.backgroundSize = '300% 300%';
                logoText.style.webkitBackgroundClip = 'text';
                logoText.style.backgroundClip = 'text';
                logoText.style.webkitTextFillColor = 'transparent';
                logoText.style.animation = 'logoGradientDark 6s ease infinite';
            } else {
                logoText.style.background = 'linear-gradient(135deg, #FF006E, #8338EC, #3A86FF, #06FFB4)';
                logoText.style.backgroundSize = '200% 200%';
                logoText.style.webkitBackgroundClip = 'text';
                logoText.style.backgroundClip = 'text';
                logoText.style.webkitTextFillColor = 'transparent';
                logoText.style.animation = 'logoGradient 4s ease infinite';
            }
        }
    }, 100);
}

// Test background-clip support
function supportsBackgroundClip() {
    const testElement = document.createElement('div');
    testElement.style.backgroundClip = 'text';
    testElement.style.webkitBackgroundClip = 'text';
    return testElement.style.backgroundClip === 'text' || testElement.style.webkitBackgroundClip === 'text';
}

// Add fallback animation for browsers without gradient support
const fallbackStyle = document.createElement('style');
fallbackStyle.textContent = `
    @keyframes logoColorShift {
        0%, 100% { color: #FF006E; }
        25% { color: #8338EC; }
        50% { color: #3A86FF; }
        75% { color: #06FFB4; }
    }
    
    .dark .logo-text {
        animation: logoColorShiftDark 4s ease infinite;
    }
    
    @keyframes logoColorShiftDark {
        0%, 100% { color: #FFD700; }
        16.66% { color: #FF6B35; }
        33.33% { color: #FF006E; }
        50% { color: #8338EC; }
        66.66% { color: #3A86FF; }
        83.33% { color: #06FFB4; }
    }
`;
document.head.appendChild(fallbackStyle);

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark');
} else if (currentTheme === 'light') {
    body.classList.remove('dark');
} else {
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark');
    }
}

themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark');
    
    // Save theme preference
    if (body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        // Update icon to sun
        themeToggle.innerHTML = `
            <svg class="theme-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591"/>
            </svg>
        `;
    } else {
        localStorage.setItem('theme', 'light');
        // Update icon to moon
        themeToggle.innerHTML = `
            <svg class="theme-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
            </svg>
        `;
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing Effect
const typingElement = document.getElementById('typing');
const phrases = [
    'Chào mừng đến với thế giới của tôi!',
    'Âm nhạc và Công nghệ cùng nhau!',
    'Tạo ra những trải nghiệm độc đáo...',
    'Khám phá, Sáng tạo, Truyền cảm hứng!'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before new phrase
    }
    
    setTimeout(typeWriter, typeSpeed);
}

// Start typing effect when page loads
setTimeout(typeWriter, 1000);

// Reveal Animation on Scroll
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
            
            // Special effect for profile name
            if (element.id === 'profileName') {
                element.style.animation = 'rainbowText 8s linear infinite';
            }
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Check on page load

// Avatar with Spinner Interactions
const avatarSpinnerContainer = document.querySelector('.avatar-spinner-container');
const centralAvatar = document.querySelector('.central-avatar');
const spinnerRings = document.querySelectorAll('.spinner-ring');
const planets = document.querySelectorAll('.planet');
let isAnimationPaused = false;

// Toggle animation on avatar click
centralAvatar.addEventListener('click', function() {
    isAnimationPaused = !isAnimationPaused;
    
    if (isAnimationPaused) {
        avatarSpinnerContainer.classList.add('paused');
        // Pause all animations
        spinnerRings.forEach(ring => {
            ring.style.animationPlayState = 'paused';
        });
        planets.forEach(planet => {
            planet.style.animationPlayState = 'paused';
        });
    } else {
        avatarSpinnerContainer.classList.remove('paused');
        // Resume all animations
        spinnerRings.forEach(ring => {
            ring.style.animationPlayState = 'running';
        });
        planets.forEach(planet => {
            planet.style.animationPlayState = 'running';
        });
    }
    
    // Visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// Add hover effect to spinner rings
spinnerRings.forEach((ring, index) => {
    ring.addEventListener('mouseenter', function() {
        this.style.opacity = '1';
        this.style.borderWidth = `${parseInt(getComputedStyle(this).borderWidth) + 1}px`;
    });
    
    ring.addEventListener('mouseleave', function() {
        this.style.opacity = '';
        this.style.borderWidth = '';
    });
});

// Add click interaction to spinner rings
spinnerRings.forEach((ring, index) => {
    ring.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Create a ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'spinner-ripple';
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${getComputedStyle(this).borderColor};
            top: ${e.offsetY - 10}px;
            left: ${e.offsetX - 10}px;
            pointer-events: none;
            animation: rippleEffect 0.8s ease-out;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Active Navigation Link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// Add hover effect for pills with tooltips
const pills = document.querySelectorAll('.pill');
pills.forEach(pill => {
    const tooltip = pill.getAttribute('data-tooltip');
    if (tooltip) {
        pill.addEventListener('mouseenter', function(e) {
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip';
            tooltipElement.textContent = tooltip;
            tooltipElement.style.cssText = `
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.875rem;
                white-space: nowrap;
                z-index: 1000;
                margin-bottom: 0.5rem;
            `;
            pill.style.position = 'relative';
            pill.appendChild(tooltipElement);
        });
        
        pill.addEventListener('mouseleave', function() {
            const tooltipElement = pill.querySelector('.tooltip');
            if (tooltipElement) {
                tooltipElement.remove();
            }
        });
    }
});

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Vui lòng nhập email hợp lệ!');
            return;
        }
        
        // Show success message (in a real app, you would send this to a server)
        alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');
        contactForm.reset();
    });
}