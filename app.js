// Interactive Chef Portfolio JS - Giampaolo Marchioro
// Galerie organisée par thème avec navigation et lightbox

document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'fr'; // Default language
    
    // --- STICKY HEADER & ACTIVE LINKS ---
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // --- MOBILE MENU TOGGLE ---
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Toggle hamburger icon animation
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu on nav item click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // --- TIMELINE ACCORDION TOGGLE ---
    const accordions = document.querySelectorAll('.timeline-accordion');
    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            acc.classList.toggle('open');
        });
    });

    // --- GLOBAL BACKGROUND SLIDESHOW ---
    const slideshow = document.getElementById('global-slideshow');
    if (slideshow) {
        const slides = slideshow.querySelectorAll('.hero-slide');
        let currentSlide = 0;
        const slideInterval = 6000; // Change image every 6 seconds

        setInterval(() => {
            if (slides.length > 0) {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }
        }, slideInterval);
    }

    // --- MULTILINGUAL TRANSLATION SYSTEM ---
    const langButtons = document.querySelectorAll('.lang-selector button');

    const updateLanguage = (lang) => {
        currentLang = lang;
        
        // Update active class on buttons
        langButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Translate text contents
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
                el.innerHTML = TRANSLATIONS[lang][key];
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
                el.placeholder = TRANSLATIONS[lang][key];
            }
        });

        // Set HTML lang attribute
        document.documentElement.lang = lang;

        // Rebuild themed gallery with translated content
        buildThemedGallery();
    };

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            updateLanguage(lang);
        });
    });

    // --- SCROLL ANIMATIONS: TIMELINE & SKILL BARS ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    const skillSection = document.querySelector('#competences');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    let skillsAnimated = false;

    const scrollReveal = () => {
        // Timeline Reveal
        timelineItems.forEach(item => {
            const triggerPoint = window.innerHeight * 0.85;
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerPoint) {
                item.classList.add('visible');
            }
        });

        // Skills Animation
        if (skillSection && !skillsAnimated) {
            const triggerPoint = window.innerHeight * 0.85;
            const sectionTop = skillSection.getBoundingClientRect().top;
            if (sectionTop < triggerPoint) {
                skillBars.forEach(bar => {
                    const widthValue = bar.getAttribute('data-width');
                    bar.style.width = widthValue;
                });
                skillsAnimated = true;
            }
        }

        // Theme sections reveal
        document.querySelectorAll('.theme-block').forEach(block => {
            const triggerPoint = window.innerHeight * 0.9;
            const blockTop = block.getBoundingClientRect().top;
            if (blockTop < triggerPoint) {
                block.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', scrollReveal);
    scrollReveal(); // Run once in case items are already in view

    // --- THEMED PHOTO GALLERY ---
    const themeNav = document.getElementById('theme-nav');
    const themesContainer = document.getElementById('themes-container');

    // Track how many photos are shown per theme
    const photosPerTheme = {};
    const INITIAL_PHOTOS = 6;
    const LOAD_MORE_COUNT = 6;

    // Current active theme for lightbox navigation
    let activeThemePhotos = [];
    let activeThemeFolder = '';

    // Build the themed gallery
    const buildThemedGallery = () => {
        if (typeof PHOTO_THEMES === 'undefined' || !Array.isArray(PHOTO_THEMES)) {
            console.error("PHOTO_THEMES not found in photo-list.js");
            if (themesContainer) {
                themesContainer.innerHTML = `<p style="text-align: center; color: var(--color-text-muted);">Aucune photo trouvée.</p>`;
            }
            return;
        }

        // Build navigation tabs
        if (themeNav) {
            const activeTab = themeNav.querySelector('.theme-tab.active');
            const activeThemeId = activeTab ? activeTab.dataset.theme : 'all';

            let navHTML = `<button class="theme-tab ${activeThemeId === 'all' ? 'active' : ''}" data-theme="all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span data-i18n="gallery-tab-all">${(TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]["gallery-tab-all"]) || "Tout Voir"}</span>
            </button>`;

            PHOTO_THEMES.forEach(theme => {
                const titleKey = `theme-title-${theme.id}`;
                const titleText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][titleKey]) || theme.title;
                navHTML += `<button class="theme-tab ${activeThemeId === theme.id ? 'active' : ''}" data-theme="${theme.id}">
                    ${theme.icon}
                    <span>${titleText}</span>
                </button>`;
            });

            themeNav.innerHTML = navHTML;

            // Add click handlers to tabs
            themeNav.querySelectorAll('.theme-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    // Update active tab
                    themeNav.querySelectorAll('.theme-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    const selectedTheme = tab.dataset.theme;
                    filterThemes(selectedTheme);
                });
            });
        }

        // Build theme sections
        if (themesContainer) {
            let sectionsHTML = '';

            PHOTO_THEMES.forEach((theme, themeIndex) => {
                // Keep existing photo count if already loaded
                if (!photosPerTheme[theme.id]) {
                    photosPerTheme[theme.id] = INITIAL_PHOTOS;
                }
                const currentPhotoCount = photosPerTheme[theme.id];

                // Competence tags
                const tagsHTML = theme.competences.map(c => {
                    const tagKey = `tag-${c.toLowerCase().replace(/[\s&/]+/g, '-')}`;
                    const tagText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][tagKey]) || c;
                    return `<span class="competence-tag">${tagText}</span>`;
                }).join('');

                const titleKey = `theme-title-${theme.id}`;
                const descKey = `theme-desc-${theme.id}`;
                const titleText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][titleKey]) || theme.title;
                const descText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][descKey]) || theme.description;
                const photosText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]["gallery-photos"]) || "photos";
                const remainingText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]["gallery-remaining"]) || "restantes";
                const loadMoreText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]["gallery-load-more"]) || "Afficher plus";

                sectionsHTML += `
                <div class="theme-block" data-theme="${theme.id}" id="theme-${theme.id}">
                    <div class="theme-intro">
                        <div class="theme-intro-icon">${theme.icon}</div>
                        <div class="theme-intro-content">
                            <h3 class="theme-intro-title">${titleText}</h3>
                            <p class="theme-intro-description">${descText}</p>
                            <div class="competence-tags">${tagsHTML}</div>
                        </div>
                        <div class="theme-photo-count">
                            <span class="count-number">${theme.photos.length}</span>
                            <span class="count-label">${photosText}</span>
                        </div>
                    </div>
                    <div class="theme-gallery-grid" id="grid-${theme.id}">
                        ${buildPhotoCards(theme, currentPhotoCount)}
                    </div>
                    ${theme.photos.length > currentPhotoCount ? `
                    <div class="theme-gallery-actions">
                        <button class="btn btn-secondary btn-load-theme" data-theme-id="${theme.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            <span>${loadMoreText}</span> (${theme.photos.length - currentPhotoCount} ${remainingText})
                        </button>
                    </div>
                    ` : ''}
                </div>`;
            });

            themesContainer.innerHTML = sectionsHTML;

            // Add load more handlers
            themesContainer.querySelectorAll('.btn-load-theme').forEach(btn => {
                btn.addEventListener('click', () => {
                    const themeId = btn.dataset.themeId;
                    loadMoreForTheme(themeId, btn);
                });
            });

            // Add click handlers for all gallery cards (lightbox)
            attachCardClickHandlers();

            // Trigger scroll reveal for newly added elements
            setTimeout(scrollReveal, 100);
        }
    };

    // Build photo card HTML for a theme
    const buildPhotoCards = (theme, count) => {
        const photosToShow = theme.photos.slice(0, count);
        let html = '';

        photosToShow.forEach((filename, index) => {
            const photoPath = `photo/foto per tema/${theme.folder}/${filename}`;
            html += `
            <div class="gallery-card" data-theme-id="${theme.id}" data-photo-index="${index}">
                <img src="${photoPath}" alt="${theme.title} – Photo ${index + 1}" loading="lazy">
                <div class="gallery-card-overlay">
                    <span class="gallery-card-title">${theme.title}</span>
                </div>
            </div>`;
        });

        return html;
    };

    // Load more photos for a specific theme
    const loadMoreForTheme = (themeId, btn) => {
        const theme = PHOTO_THEMES.find(t => t.id === themeId);
        if (!theme) return;

        const currentCount = photosPerTheme[themeId];
        const newCount = Math.min(currentCount + LOAD_MORE_COUNT, theme.photos.length);
        photosPerTheme[themeId] = newCount;

        // Re-render grid
        const grid = document.getElementById(`grid-${themeId}`);
        if (grid) {
            grid.innerHTML = buildPhotoCards(theme, newCount);
            attachCardClickHandlers();
        }

        // Update or hide button
        const remaining = theme.photos.length - newCount;
        if (remaining <= 0) {
            btn.style.display = 'none';
        } else {
            const loadMoreText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]["gallery-load-more"]) || "Afficher plus";
            const remainingText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]["gallery-remaining"]) || "restantes";
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                <span>${loadMoreText}</span> (${remaining} ${remainingText})`;
        }
    };

    // Filter theme sections
    const filterThemes = (selectedTheme) => {
        const blocks = themesContainer.querySelectorAll('.theme-block');
        blocks.forEach(block => {
            if (selectedTheme === 'all' || block.dataset.theme === selectedTheme) {
                block.style.display = '';
                block.classList.remove('visible');
                // Re-trigger animation
                setTimeout(() => block.classList.add('visible'), 50);
            } else {
                block.style.display = 'none';
            }
        });

        // Smooth scroll to gallery if a specific theme is selected
        if (selectedTheme !== 'all') {
            const targetBlock = document.getElementById(`theme-${selectedTheme}`);
            if (targetBlock) {
                targetBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Attach click handlers for lightbox on gallery cards
    const attachCardClickHandlers = () => {
        themesContainer.querySelectorAll('.gallery-card').forEach(card => {
            card.addEventListener('click', () => {
                const themeId = card.dataset.themeId;
                const photoIndex = parseInt(card.dataset.photoIndex, 10);
                const theme = PHOTO_THEMES.find(t => t.id === themeId);
                if (!theme) return;

                // Set active theme for lightbox navigation
                activeThemePhotos = theme.photos.map(f => `photo/foto per tema/${theme.folder}/${f}`);
                activeThemeFolder = theme.folder;
                openLightbox(photoIndex, theme.title);
            });
        });
    };

    // Initialize themed gallery
    buildThemedGallery();

    // --- FULLSCREEN LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let activePhotoIndex = 0;
    let activeThemeTitle = '';

    const openLightbox = (index, themeTitle) => {
        if (!lightbox || !lightboxImg || !lightboxCaption) return;
        activePhotoIndex = index;
        activeThemeTitle = themeTitle || '';
        
        lightboxImg.src = activeThemePhotos[activePhotoIndex];
        lightboxCaption.textContent = `${activeThemeTitle} – ${activePhotoIndex + 1} / ${activeThemePhotos.length}`;
        
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // Restore scroll
    };

    const navigateLightbox = (direction) => {
        if (!activeThemePhotos.length) return;
        
        activePhotoIndex += direction;
        
        // Wrap around limits
        if (activePhotoIndex < 0) {
            activePhotoIndex = activeThemePhotos.length - 1;
        } else if (activePhotoIndex >= activeThemePhotos.length) {
            activePhotoIndex = 0;
        }
        
        lightboxImg.src = activeThemePhotos[activePhotoIndex];
        lightboxCaption.textContent = `${activeThemeTitle} – ${activePhotoIndex + 1} / ${activeThemePhotos.length}`;
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));
    
    // Close lightbox on click outside the image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    // Keyboard support for Lightbox
    window.addEventListener('keydown', (e) => {
        if (!lightbox || lightbox.style.display !== 'flex') return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });

    // --- CONTACT FORM HANDLER (with DB + Automated Formspree / Mailto fallback) ---
    // CONFIGURATION: If you want automatic email delivery without opening the user's email client,
    // create a free form at https://formspree.io/ and paste your Form ID here (e.g. "xvoejkyz")
    const FORMSPREE_ID = "xlgqjvpw"; 

    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Collect form values
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const subject = contactForm.querySelector('#subject').value.trim();
            const message = contactForm.querySelector('#message').value.trim();

            // Collect checked documents
            const checkedDocs = [];
            const checkboxes = contactForm.querySelectorAll('input[name="documents"]:checked');
            checkboxes.forEach(cb => {
                checkedDocs.push(cb.parentNode.textContent.trim());
            });

            // Submitting state
            submitBtn.disabled = true;
            submitBtn.textContent = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]['feedback-sending']) || 'Envoi en cours...';

            // --- Save to LocalStorage Database ---
            const entry = (window.GM_DB) ? window.GM_DB.saveSubmission({
                name, email, subject, message,
                documents: checkedDocs,
                lang: currentLang
            }) : null;

            const now = new Date();
            const dateStr = now.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Helper to trigger standard mailto fallback
            const triggerMailto = () => {
                const emailBody = [
                    '=== NOUVELLE DEMANDE DE CONTACT ===',
                    '',
                    'ID: ' + (entry ? entry.id : 'N/A'),
                    'Date: ' + dateStr + '  |  Heure: ' + timeStr,
                    '',
                    'NOM: ' + name,
                    'EMAIL: ' + email,
                    'OBJET: ' + subject,
                    '',
                    'MESSAGE:',
                    message,
                    '',
                    checkedDocs.length ? 'DOCUMENTS DEMANDÉS: ' + checkedDocs.join(', ') : '',
                    '',
                    '--- Envoyé depuis le site CV Marchioro ---'
                ].filter(l => l !== undefined).join('\n');

                const mailtoUrl = 'mailto:giampaolo@marchioro.org'
                    + '?subject=' + encodeURIComponent('[CV Site] Nouvelle demande: ' + subject + ' — ' + name)
                    + '&body=' + encodeURIComponent(emailBody);

                window.open(mailtoUrl, '_blank');
            };

            // Helper to show success feedback UI
            const showSuccessFeedback = () => {
                let feedbackText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]['feedback-success']) || "Merci pour votre message ! Giampaolo Marchioro vous recontactera rapidement.";
                if (checkedDocs.length > 0) {
                    let docsText = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]['feedback-docs-registered']) || "Votre demande pour : {docs} a bien été enregistrée.";
                    docsText = docsText.replace('{docs}', '[' + checkedDocs.join(', ') + ']');
                    feedbackText += ' ' + docsText;
                }

                formFeedback.textContent = feedbackText;
                formFeedback.className = 'form-feedback success';
                formFeedback.classList.remove('hidden');

                // Reset form
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang]['contact-btn-submit']) || 'Envoyer le message';

                // Hide feedback after 8 seconds
                setTimeout(() => {
                    formFeedback.classList.add('hidden');
                }, 8000);
            };

            // Execute submission
            if (FORMSPREE_ID && FORMSPREE_ID.trim() !== "") {
                // Submit to Formspree via AJAX
                fetch(`https://formspree.io/f/${FORMSPREE_ID.trim()}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: entry ? entry.id : 'N/A',
                        timestamp: `${dateStr} ${timeStr}`,
                        name: name,
                        email: email,
                        subject: subject,
                        message: message,
                        requested_documents: checkedDocs.join(', ')
                    })
                })
                .then(response => {
                    showSuccessFeedback();
                })
                .catch(error => {
                    console.warn('Formspree submission failed, falling back to mailto:', error);
                    triggerMailto();
                    showSuccessFeedback();
                });
            } else {
                // Default fallback: open local mail client
                setTimeout(() => {
                    triggerMailto();
                }, 300);
                setTimeout(() => {
                    showSuccessFeedback();
                }, 1200);
            }
        });
    }
});

