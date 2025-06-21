
/*--------------- Navigation Menu ----------------- */
(() => {
    const hamburgerBtn = document.querySelector(".hamburger-btn"),
        navMenu = document.querySelector(".nav-menu"),
        closeNavBtn = navMenu.querySelector(".close-nav-menu");

    const showNavMenu = () => {
        navMenu.classList.toggle("open");
        fadeOutEffect();
    };

    const hideNavMenu = () => {
        navMenu.classList.remove("open");
        fadeOutEffect();
        toggleBodyScrolling();
    };

    const fadeOutEffect = () => {
        const fadeEffect = document.querySelector(".fade-out-effect");
        fadeEffect.classList.add("active");
        toggleBodyScrolling();
        setTimeout(() => {
            fadeEffect.classList.remove("active");
        }, 300);
    };

    /* Event Listeners */
    hamburgerBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("link-item") && event.target.hash !== "") {
            event.preventDefault();
            const hash = event.target.hash;

            // Update active navigation link
            const activeNavItem = navMenu.querySelector(".active");
            activeNavItem.classList.add("outer-shadow", "hover-in-shadow");
            activeNavItem.classList.remove("active", "inner-shadow");

            if (navMenu.classList.contains("open")) {
                event.target.classList.add("active", "inner-shadow");
                event.target.classList.remove("outer-shadow", "hover-in-shadow");
                hideNavMenu();
            } else {
                navMenu.querySelectorAll(".link-item").forEach((item) => {
                    if (hash === item.hash) {
                        item.classList.add("active", "inner-shadow");
                        item.classList.remove("outer-shadow", "hover-in-shadow");
                    }
                });
                fadeOutEffect();
            }

            // Update URL hash
            window.location.hash = hash;
        }
    });
})();


/*--------------- Portfolio Filter and Popup ----------------- */
(() => {
    // Check if popup exists before querying
    const popup = document.querySelector(".portfolio-popup");
    if (!popup) {
        console.error("Portfolio popup element not found");
        return;
    }

    const filterContainer = document.querySelector(".portfolio-filter"),
        portfolioItemsContainer = document.querySelector(".portfolio-items"),
        portfolioItems = document.querySelectorAll(".portfolio-item"),
        preBtn = popup.querySelector(".pp-pre"),
        nextBtn = popup.querySelector(".pp-next"),
        closeBtn = popup.querySelector(".pp-close"),
        projectDetailsContainer = popup.querySelector(".pp-details"),
        projectDetails = popup.querySelector(".pp-project-details"),
        projectDetailsBtn = popup.querySelector(".pp-project-details-btn");

    let itemIndex, slideIndex, screenshots;

    const togglePopup = () => {
        popup.classList.toggle("open");
        toggleBodyScrolling();
    };

    const updateSlideshow = () => {
        const src = screenshots[slideIndex].trim();
        const popupImg = popup.querySelector(".pp-img");
        const loader = popup.querySelector(".pp-loader");
        let videoContainer = popup.querySelector(".pp-video-container"); // Changed to let
        const popupCounter = popup.querySelector(".pp-counter");

        // Clear previous content
        if (popupImg) popupImg.style.display = "none";
        if (videoContainer) {
            videoContainer.innerHTML = "";
            videoContainer.style.display = "none";
        }

        loader.classList.add("active");

        if (src.startsWith("video:")) {
            const videoUrl = src.replace("video:", "");
            if (!videoContainer) {
                videoContainer = document.createElement("div");
                videoContainer.className = "pp-video-container";
                popup.querySelector(".pp-main-inner").insertBefore(videoContainer, popupImg);
            }
            videoContainer.style.display = "block";
            videoContainer.innerHTML = `
                <iframe
                    src="${videoUrl}"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            `;
            if (popupImg) popupImg.style.display = "none";
            loader.classList.remove("active");
        } else {
            if (popupImg) {
                popupImg.style.display = "block";
                popupImg.src = src;
                popupImg.onload = () => {
                    loader.classList.remove("active");
                };
            }
        }

        popupCounter.textContent = `${slideIndex + 1} of ${screenshots.length}`;
    };

    const updatePopupDetails = () => {
        const itemDetails = portfolioItems[itemIndex].querySelector(".portfolio-item-details");
        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").textContent;
        const category = portfolioItems[itemIndex].getAttribute("data-category").split("-").join(" ");

        if (!itemDetails) {
            projectDetailsBtn.style.display = "none";
            projectDetailsContainer.style.maxHeight = "0px";
            projectDetailsContainer.classList.remove("active");
            return;
        }

        projectDetails.innerHTML = itemDetails.innerHTML;
        popup.querySelector(".pp-title h2").textContent = title;
        popup.querySelector(".pp-project-category").textContent = category;
        projectDetailsBtn.style.display = "block";
    };

    const togglePopupDetails = () => {
        if (projectDetailsContainer.classList.contains("active")) {
            projectDetailsBtn.querySelector("i").classList.replace("fa-minus", "fa-plus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = "0px";
        } else {
            projectDetailsBtn.querySelector("i").classList.replace("fa-plus", "fa-minus");
            projectDetailsContainer.style.maxHeight = `${projectDetailsContainer.scrollHeight}px`;
            projectDetailsContainer.classList.add("active");
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }
    };

    /* Event Listeners */
    if (filterContainer) {
        filterContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("filter-item") && !event.target.classList.contains("active")) {
                filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
                event.target.classList.add("outer-shadow", "active");

                const target = event.target.getAttribute("data-target");
                portfolioItems.forEach((item) => {
                    if (target === item.getAttribute("data-category") || target === "all") {
                        item.classList.remove("hide");
                        item.classList.add("show");
                    } else {
                        item.classList.remove("show");
                        item.classList.add("hide");
                    }
                });
            }
        });
    }

    if (portfolioItemsContainer) {
        portfolioItemsContainer.addEventListener("click", (event) => {
            const portfolioItem = event.target.closest(".portfolio-item-inner")?.parentElement;
            if (portfolioItem) {
                itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
                
                const imgElement = portfolioItems[itemIndex].querySelector(".portfolio-item-image img");
                if (!imgElement) return;
                
                screenshots = imgElement.getAttribute("data-screenshots")
                    .split(",")
                    .map(item => item.trim());

                slideIndex = 0;
                togglePopup();
                updateSlideshow();
                updatePopupDetails();

                if (preBtn) preBtn.style.display = screenshots.length > 1 ? "block" : "none";
                if (nextBtn) nextBtn.style.display = screenshots.length > 1 ? "block" : "none";
            }
        });
    }

    if (closeBtn) closeBtn.addEventListener("click", () => {
        togglePopup();
        if (projectDetailsContainer.classList.contains("active")) {
            togglePopupDetails();
        }
    });

    if (preBtn) preBtn.addEventListener("click", () => {
        slideIndex = slideIndex === 0 ? screenshots.length - 1 : slideIndex - 1;
        updateSlideshow();
    });

    if (nextBtn) nextBtn.addEventListener("click", () => {
        slideIndex = slideIndex === screenshots.length - 1 ? 0 : slideIndex + 1;
        updateSlideshow();
    });

    if (projectDetailsBtn) projectDetailsBtn.addEventListener("click", togglePopupDetails);
})();


/*--------------- Utility Functions ----------------- */
function toggleBodyScrolling() {
    document.body.classList.toggle("stop-scrolling");
}

/*--------------- Page Preloader ----------------- */
window.addEventListener("load", () => {
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(() => {
        document.querySelector(".preloader").style.display = "none";
    }, 600);
});