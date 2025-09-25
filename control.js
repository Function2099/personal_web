// 作品集輪播功能
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel-track");

    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    let currentIndex = 0;
    let autoSlideInterval;

    // 載入JSON資料
    fetch("./projects.json").then((res) => res.json()).then((projects) => {
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
            autoSlideInterval = setInterval(showNextSlide, 4200);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlide();
        });

        nextBtn.addEventListener("click", () => {
            showNextSlide();
        });

        carousel.addEventListener("mouseenter", stopAutoSlide);
        carousel.addEventListener("mouseleave", startAutoSlide);

        updateSlide();
        startAutoSlide();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    fetch("./artworks.json")
        .then(res => res.json())
        .then(artworks => {
            const container = document.querySelector(".artworks");

            artworks.forEach(art => {
                const card = document.createElement("a");
                card.href = art.pixivUrl;
                card.target = "_blank";
                card.className = "art-card";

                const img = document.createElement("img");
                img.src = art.img;
                img.alt = art.title;

                // ✅ 改用 width 控制大小
                img.style.width = art.width || "200px";
                img.style.height = "auto";

                // const title = document.createElement("h3");
                // title.textContent = art.title;

                card.appendChild(img);
                // card.appendChild(title);
                container.appendChild(card);
            });
        });
});