// 全屏滾動控制變數
let currentSection = 0;
const totalSections = 5;
let isScrolling = false;
let touchStartY = 0;

// 切換到指定區段
function goToSection(sectionIndex) {
    if (sectionIndex < 0 || sectionIndex >= totalSections || isScrolling) return;

    isScrolling = true;
    currentSection = sectionIndex;

    // 更新位置
    const wrapper = document.getElementById('sectionsWrapper');
    wrapper.style.transform = `translateY(-${currentSection * 100}vh)`;

    // 更新活動狀態
    document.querySelectorAll('.section').forEach((section, index) => {
        section.classList.toggle('active', index === currentSection);
    });

    // 更新導航
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentSection);
    });

    // 更新滾動指示器
    document.querySelectorAll('.scroll-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSection);
    });

    // 重置滾動鎖定
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}

// 作品集輪播功能
function initCarousel() {
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel-track");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    if (!carousel || !track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let autoSlideInterval;

    // 載入JSON資料
    fetch("./projects.json")
        .then((res) => res.json())
        .then((projects) => {
            projects.forEach((proj) => {
                const slide = document.createElement("div");
                slide.className = "slide";
                slide.innerHTML = `
                    <img src="${proj.img}" alt="${proj.title}" />
                    <h3>${proj.title}</h3>
                    <p>${proj.desc}</p>
                    <div class="tags">${proj.tags.map(tag => `<span>${tag}</span>`).join(" ")}</div>
                `;
                track.appendChild(slide);
            });

            // 等作品載入完再抓 .slide
            const slides = document.querySelectorAll(".slide");

            function updateSlide() {
                const offset = -currentIndex * 100;
                track.style.transform = `translateX(${offset}%)`;
            }

            function showNextSlide() {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlide();
            }

            function startAutoSlide() {
                autoSlideInterval = setInterval(showNextSlide, 4000);
            }

            function stopAutoSlide() {
                clearInterval(autoSlideInterval);
            }

            prevBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // 防止觸發全屏滾動
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSlide();
            });

            nextBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // 防止觸發全屏滾動
                showNextSlide();
            });

            carousel.addEventListener("mouseover", stopAutoSlide);
            carousel.addEventListener("mouseout", startAutoSlide);

            updateSlide();
            startAutoSlide();
        })
        .catch(error => {
            console.log("無法載入 projects.json，可能是檔案不存在");
            // 如果沒有 JSON 檔案，可以添加一些範例內容
            const exampleSlide = document.createElement("div");
            exampleSlide.className = "slide";
            exampleSlide.innerHTML = `
                <div style="width: 80%; height: 250px; background: #f0f0f0; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #666;">
                    範例作品圖片
                </div>
                <h3>範例程式作品</h3>
                <p>這是一個範例作品描述，您可以在 projects.json 中添加實際的專案資料。</p>
                <div class="tags"><span>JavaScript</span><span>CSS</span><span>HTML</span></div>
            `;
            track.appendChild(exampleSlide);
        });
}

// 藝術作品載入功能
function initArtGallery() {
    fetch("./artworks.json")
        .then(res => res.json())
        .then(artworks => {
            const container = document.querySelector(".artworks");

            if (!container) return;

            artworks.forEach(art => {
                const card = document.createElement("a");
                card.href = art.pixivUrl;
                card.target = "_blank";
                card.className = "art-card";

                const img = document.createElement("img");
                img.src = art.img;
                img.alt = art.title;
                img.style.width = art.width || "200px";
                img.style.height = "auto";

                card.appendChild(img);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.log("無法載入 artworks.json，可能是檔案不存在");
            // 如果沒有 JSON 檔案，可以添加一些範例內容
            const container = document.querySelector(".artworks");
            if (container) {
                for (let i = 1; i <= 6; i++) {
                    const card = document.createElement("div");
                    card.className = "art-card";
                    card.style.cursor = "pointer";
                    card.innerHTML = `
                        <div style="width: 200px; height: 250px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #666;">
                            範例藝術作品 ${i}
                        </div>
                    `;
                    container.appendChild(card);
                }
            }
        });
}

// 全屏滾動事件處理
function initFullscreenScroll() {
    // 滾輪事件
    let scrollTimeout;
    document.addEventListener('wheel', function (e) {
        e.preventDefault();

        if (isScrolling) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 0 && currentSection < totalSections - 1) {
                // 向下滾動
                goToSection(currentSection + 1);
            } else if (e.deltaY < 0 && currentSection > 0) {
                // 向上滾動
                goToSection(currentSection - 1);
            }
        }, 50);
    }, { passive: false });

    // 鍵盤導航
    document.addEventListener('keydown', function (e) {
        if (isScrolling) return;

        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                if (currentSection < totalSections - 1) {
                    goToSection(currentSection + 1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (currentSection > 0) {
                    goToSection(currentSection - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                goToSection(0);
                break;
            case 'End':
                e.preventDefault();
                goToSection(totalSections - 1);
                break;
        }
    });

    // 觸摸事件（手機）
    document.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        if (isScrolling) return;

        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSection < totalSections - 1) {
                // 向上滑動（下一頁）
                goToSection(currentSection + 1);
            } else if (diff < 0 && currentSection > 0) {
                // 向下滑動（上一頁）
                goToSection(currentSection - 1);
            }
        }
    }, { passive: true });

    // 導航點擊事件
    document.querySelectorAll('.nav-item, .scroll-dot').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionIndex = parseInt(this.dataset.section);
            goToSection(sectionIndex);
        });
    });
}

// Blog 按鈕功能
function initBlogFunctions() {
    const blogButton = document.querySelector('.blog-button');
    if (blogButton) {
        blogButton.addEventListener('click', function () {
            alert('Blog功能開發中，敬請期待！');
        });
    }
}

// 聯絡按鈕增強功能
function initContactEnhancements() {
    const contactButtons = document.querySelectorAll('.contact-button');
    contactButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // 添加點擊動畫效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// 視差滾動效果（可選）
function initParallaxEffects() {
    const sections = document.querySelectorAll('.section');

    // 為每個區段添加不同的視差效果
    sections.forEach((section, index) => {
        const content = section.querySelector('.section-content');
        if (content) {
            // 根據當前活動區段添加微妙的動畫效果
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(content);
        }
    });
}

// 性能優化：防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 載入進度提示
function showLoadingProgress() {
    const sections = document.querySelectorAll('.section-content');
    let loadedCount = 0;

    sections.forEach(section => {
        // 模擬內容載入
        setTimeout(() => {
            loadedCount++;
            section.style.opacity = '0.3';
            if (loadedCount === sections.length) {
                // 所有內容載入完成
                setTimeout(() => {
                    goToSection(0); // 初始化到第一頁
                }, 500);
            }
        }, 100 * loadedCount);
    });
}

// 主要初始化函數
document.addEventListener("DOMContentLoaded", function () {
    console.log("個人網站初始化中...");

    // 顯示載入進度
    showLoadingProgress();

    // 初始化各個功能模組
    setTimeout(() => {
        initFullscreenScroll();
        initCarousel();
        initArtGallery();
        initBlogFunctions();
        initContactEnhancements();
        initParallaxEffects();

        console.log("個人網站載入完成！");
    }, 1000);
});

// 窗口大小改變時的響應式處理
window.addEventListener('resize', debounce(function () {
    // 重新計算位置，確保當前區段正確顯示
    const wrapper = document.getElementById('sectionsWrapper');
    if (wrapper) {
        wrapper.style.transform = `translateY(-${currentSection * 100}vh)`;
    }
}, 250));

// 頁面可見性變化處理（當用戶切換分頁時暫停動畫）
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // 頁面被隱藏時，停止所有動畫
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.dispatchEvent(new Event('mouseenter'));
        }
    } else {
        // 頁面重新可見時，恢復動畫
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.dispatchEvent(new Event('mouseleave'));
        }
    }
});

// 錯誤處理
window.addEventListener('error', function (e) {
    console.error('網站運行時錯誤:', e.error);
});

// 導出主要函數供外部使用（如果需要）
window.personalWebsite = {
    goToSection,
    currentSection: () => currentSection,
    totalSections
};