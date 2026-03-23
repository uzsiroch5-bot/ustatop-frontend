const fs = require('fs');
const path = require('path');

const categoryMap = {
    'santexnik': 'santexnik',
    'elektrik': 'elektrik',
    'quruvchi': 'quruvchi',
    'remont': 'remont',
    'mebel': 'mebel',
    'texnika': 'texnika',
    'avto': 'avto',
    'konditsioner': 'konditsioner',
    'payvandchi': 'payvandchi',
    'dizayner': 'dizayner'
};

const updateUI = (filePath, filterType, filterValue) => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Identify start of dynamic section
    const startSectionMarkers = [
        '<div class="ustalar-grid" id="ustalarGrid">',
        '<div class="ustalar-grid">'
    ];
    let gridStart = -1;
    for (const m of startSectionMarkers) {
        gridStart = content.indexOf(m);
        if (gridStart !== -1) break;
    }

    const modalSearchStr = '<!-- Usta Showcase Modal -->';
    const modalStart = content.indexOf(modalSearchStr);
    
    if (gridStart !== -1 && modalStart !== -1) {
        const newSectionContent = `
            <div class="ustalar-grid" id="ustalarGrid">
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p style="margin-top:10px;">Ustalar yuklanmoqda...</p>
                </div>
            </div>
        </div>
    </section>

    `;
        content = content.substring(0, gridStart) + newSectionContent + content.substring(modalStart);
    }

    // Replace the script entirely to ensure latest logic (including _id for chat)
    const finalScriptEnd = content.lastIndexOf('</body>');
    const startOfOldScript = content.lastIndexOf('<script>');
    
    if (startOfOldScript !== -1 && finalScriptEnd !== -1) {
        const apiUrl = filterType === 'category' 
            ? `http://localhost:5000/api/users/workers?category=${encodeURIComponent(filterValue)}`
            : `http://localhost:5000/api/users/workers?location=${encodeURIComponent(filterValue)}`;

        const fullScript = `
    <script>
        // Account Avatar Logic
        (function() {
            const user = JSON.parse(localStorage.getItem('ustatop_user') || 'null');
            const avatar = document.getElementById('accountAvatar');
            const loginLink = document.getElementById('loginMenuLink');
            if (user && avatar) {
                avatar.textContent = user.name.charAt(0).toUpperCase();
                avatar.style.display = 'flex';
                if (loginLink) loginLink.style.display = 'none';
            }
        })();

        // Menu Logic
        const menuBtn = document.getElementById('menuBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const hududlarBtn = document.getElementById('hududlarBtn');
        const ustalarBtn = document.getElementById('ustalarBtn');
        const subMenuHudud = document.getElementById('subMenuHudud');
        const subMenuUsta = document.getElementById('subMenuUsta');
        const backBtnHudud = document.getElementById('backBtnHudud');
        const backBtnUsta = document.getElementById('backBtnUsta');

        menuBtn.onclick = (e) => {
            e.stopPropagation();
            if (subMenuHudud.classList.contains('active') || subMenuUsta.classList.contains('active')) {
                subMenuHudud.classList.remove('active');
                subMenuUsta.classList.remove('active');
            } else {
                dropdownMenu.classList.toggle('active');
            }
        };
        hududlarBtn.onclick = (e) => { e.stopPropagation(); dropdownMenu.classList.remove('active'); subMenuHudud.classList.add('active'); };
        ustalarBtn.onclick = (e) => { e.stopPropagation(); dropdownMenu.classList.remove('active'); subMenuUsta.classList.add('active'); };
        backBtnHudud.onclick = (e) => { e.stopPropagation(); subMenuHudud.classList.remove('active'); dropdownMenu.classList.add('active'); };
        backBtnUsta.onclick = (e) => { e.stopPropagation(); subMenuUsta.classList.remove('active'); dropdownMenu.classList.add('active'); };
        window.onclick = (e) => { if(!e.target.closest('.menu-container')) { dropdownMenu.classList.remove('active'); subMenuHudud.classList.remove('active'); subMenuUsta.classList.remove('active'); } };

        // Modal Logic
        const modal = document.getElementById('ustaModal');
        const modalTrack = document.getElementById('modalTrack');
        const modalIndicators = document.getElementById('modalIndicators');
        let currentSlide = 0;
        let totalSlides = 0;
        let currentPhone = '';
        let currentUstaId = '';

        window.openModal = function(name, job, location, rating, reviews, phone, tgLink, images, ustaId) {
            document.getElementById('modalName').textContent = name;
            document.getElementById('modalJob').innerHTML = \`<i class="fas fa-briefcase"></i> \${job} | <i class="fas fa-map-marker-alt"></i> \${location}\`;
            document.getElementById('modalRatingContent').innerHTML = \`<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-stroke"></i> <span>\${rating} (\${reviews})</span>\`;
            currentPhone = phone; currentUstaId = ustaId;
            document.getElementById('phoneBtn').innerHTML = \`<i class="fas fa-phone-alt"></i> Telefon raqamni ko'rish\`;
            document.getElementById('phoneBtn').classList.remove('reveal');
            document.getElementById('tgBtn').href = "https://" + tgLink;
            
            // Fix Chat Link in Modal
            const modalChatBtn = document.querySelector('.btn-chat');
            if (modalChatBtn) modalChatBtn.href = \`../chat system.html?userId=\${ustaId}\`;

            modalTrack.innerHTML = ''; modalIndicators.innerHTML = ''; totalSlides = images.length; currentSlide = 0;
            images.forEach((src, index) => {
                const slide = document.createElement('div'); slide.className = 'carousel-slide';
                const img = document.createElement('img'); img.src = src; slide.appendChild(img); modalTrack.appendChild(slide);
                const dot = document.createElement('div'); dot.className = \`indicator \${index === 0 ? 'active' : ''}\`;
                dot.onclick = () => goToSlide(index); modalIndicators.appendChild(dot);
            });
            updateCarouselPos(); modal.classList.add('active'); document.body.style.overflow = 'hidden';
        };

        window.revealPhone = function() {
            const btn = document.getElementById('phoneBtn');
            if(!btn.classList.contains('reveal')) {
                btn.classList.add('reveal'); btn.innerHTML = \`<i class="fas fa-phone-alt"></i> \${currentPhone}\`; btn.href = \`tel:\${currentPhone}\`;
            }
        };

        document.getElementById('closeModal').onclick = () => { modal.classList.remove('active'); document.body.style.overflow = ''; };
        function goToSlide(i) { currentSlide = i; updateCarouselPos(); }
        function updateCarouselPos() { 
            modalTrack.style.transform = \`translateX(-\${currentSlide * 100}%)\`;
            Array.from(modalIndicators.children).forEach((dot, idx) => dot.classList.toggle('active', idx === currentSlide));
        }
        document.getElementById('prevSlide').onclick = () => goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        document.getElementById('nextSlide').onclick = () => goToSlide((currentSlide + 1) % totalSlides);

        // Dynamic Load Workers
        async function loadWorkers() {
            const grid = document.getElementById('ustalarGrid');
            try {
                const response = await fetch('${apiUrl}');
                const workers = await response.json();
                if (workers.length === 0) {
                    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">Hozircha shu yo\\'nalishda usta topilmadi.</div>';
                    return;
                }
                grid.innerHTML = '';
                workers.forEach(w => {
                    const portfolio = w.portfolio && w.portfolio.length > 0 
                        ? w.portfolio.map(url => url.startsWith('http') ? url : \`http://localhost:5000\${url}\`)
                        : ['https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=1000&q=80'];
                    const card = document.createElement('div'); card.className = 'usta-card';
                    card.onclick = () => openModal(w.name, w.category || 'Usta', w.location || 'Oʻzbekiston', '5.0', '0', w.phone, 't.me/ustatop', portfolio, w._id);
                    card.innerHTML = \`
                        <div class="usta-img"><img src="\${portfolio[0]}" alt="\${w.name}"></div>
                        <div class="usta-info">
                            <h3>\${w.name}</h3>
                            <div class="usta-rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><span>5.0 (0)</span></div>
                            <p class="usta-job"><i class="fas fa-briefcase"></i> \${w.category || 'Mutaxassis'}</p>
                            <p class="usta-location"><i class="fas fa-map-marker-alt"></i> \${w.location || 'Oʻzbekiston'}</p>
                            <a href="../chat system.html?userId=\${w._id}" class="card-chat-btn" onclick="event.stopPropagation()"><i class="fas fa-comment-dots"></i></a>
                        </div>\`;
                    grid.appendChild(card);
                });
            } catch (e) { grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">Yuklashda xatolik yuz berdi.</div>'; }
        }
        loadWorkers();
    </script>
        `;
        content = content.substring(0, startOfOldScript) + fullScript + content.substring(finalScriptEnd + 7);
    }

    fs.writeFileSync(filePath, content);
};

// Update Ustalar
const ustalarDir = 'c:/Users/isomiddin/Desktop/UstaTop/ustalar';
fs.readdirSync(ustalarDir).forEach(file => {
    if (file.endsWith('.html')) {
        const slug = file.replace('.html', '');
        const category = categoryMap[slug];
        if (category) {
            console.log(`Updating category: ${category}`);
            updateUI(path.join(ustalarDir, file), 'category', category);
        }
    }
});

// Update Hududlar
const hududlarDir = 'c:/Users/isomiddin/Desktop/UstaTop/hududlar';
fs.readdirSync(hududlarDir).forEach(file => {
    if (file.endsWith('.html')) {
        const region = file.replace('.html', '');
        console.log(`Updating region: ${region}`);
        updateUI(path.join(hududlarDir, file), 'location', region);
    }
});
