document.addEventListener('DOMContentLoaded', () => {

    // ★★★ 1. 부드러운 스크롤 기능 추가 ★★★
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 점프 동작 막기
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // 섹션의 맨 위로 스크롤
                });
            }
        });
    });

    // ★★★ 2. 기존 포트폴리오 기능은 그대로 유지 ★★★
    const portfolioContainer = document.querySelector('.portfolio-container');
    if (!portfolioContainer) return;

    const tabs = document.querySelectorAll('.tab');
    const slides = document.querySelectorAll('.slide');
    const arrowLeft = document.querySelector('.arrow.left');
    const arrowRight = document.querySelector('.arrow.right');

    let activeTab = 'ebs';
    let currentPageIndex = 0;

    function updateContainerBackground(tabName) {
        portfolioContainer.classList.remove('ebs', 'tvchosun', 'etc');
        portfolioContainer.classList.add(tabName);
    }

    function getPages(tabName) {
        const activeSlide = document.querySelector(`.slide.${tabName}`);
        if (!activeSlide) return [];
        return Array.from(activeSlide.querySelectorAll('.page'));
    }

    function showPage(tabName, index) {
        const pages = getPages(tabName);
        if (pages.length === 0) {
            arrowLeft.style.display = 'none';
            arrowRight.style.display = 'none';
            return;
        }

        if (pages.length <= 1) {
            arrowLeft.style.display = 'none';
            arrowRight.style.display = 'none';
        } else {
            arrowLeft.style.display = 'flex';
            arrowRight.style.display = 'flex';
        }

        if (index < 0) index = pages.length - 1;
        if (index >= pages.length) index = 0;
        currentPageIndex = index;

        pages.forEach((page, i) => {
            page.style.display = (i === index) ? 'flex' : 'none';
        });
    }
    
    function showTab(tabName) {
        activeTab = tabName;
        updateContainerBackground(tabName);

        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        slides.forEach(slide => {
            slide.style.display = slide.classList.contains(tabName) ? 'flex' : 'none';
        });

        showPage(activeTab, 0);
    }

    arrowLeft.addEventListener('click', () => {
        showPage(activeTab, currentPageIndex - 1);
    });

    arrowRight.addEventListener('click', () => {
        showPage(activeTab, currentPageIndex + 1);
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            showTab(tab.dataset.tab);
        });
    });

    showTab(activeTab);
});