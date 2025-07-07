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
    // ★★★ 스와이프 기능을 위해 탭 순서 저장 ★★★
    const tabOrder = Array.from(tabs).map(tab => tab.dataset.tab);

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

        // 페이지 인덱스 순환 (이 기능은 스와이프로 탭 전환 시에는 사용되지 않음)
        // if (index < 0) index = pages.length - 1;
        // if (index >= pages.length) index = 0;
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

        showPage(activeTab, 0); // 탭 전환 시 항상 첫 페이지를 보여줌
    }

    arrowLeft.addEventListener('click', () => {
        // 현재 탭의 첫 페이지일 경우 이전 탭으로 이동
        if (currentPageIndex === 0) {
            const currentTabIndex = tabOrder.indexOf(activeTab);
            const prevTabIndex = (currentTabIndex - 1 + tabOrder.length) % tabOrder.length;
            showTab(tabOrder[prevTabIndex]);
        } else {
            showPage(activeTab, currentPageIndex - 1);
        }
    });

    arrowRight.addEventListener('click', () => {
        const pages = getPages(activeTab);
        // 현재 탭의 마지막 페이지일 경우 다음 탭으로 이동
        if (currentPageIndex === pages.length - 1) {
            const currentTabIndex = tabOrder.indexOf(activeTab);
            const nextTabIndex = (currentTabIndex + 1) % tabOrder.length;
            showTab(tabOrder[nextTabIndex]);
        } else {
            showPage(activeTab, currentPageIndex + 1);
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            showTab(tab.dataset.tab);
        });
    });

    // ★★★ 3. 포트폴리오 스와이프 기능 추가 ★★★
    let touchstartX = 0;
    let touchendX = 0;

    function handleSwipe() {
        const swiped = touchstartX - touchendX;
        const pages = getPages(activeTab);

        if (swiped > 50) { // 스와이프 왼쪽 (다음)
            if (pages.length > 1 && currentPageIndex < pages.length - 1) {
                // 현재 탭에 다음 페이지가 있으면 페이지 넘김
                showPage(activeTab, currentPageIndex + 1);
            } else {
                // 현재 탭의 마지막 페이지면 다음 탭으로 이동
                const currentTabIndex = tabOrder.indexOf(activeTab);
                const nextTabIndex = (currentTabIndex + 1) % tabOrder.length;
                showTab(tabOrder[nextTabIndex]);
            }
        } else if (swiped < -50) { // 스와이프 오른쪽 (이전)
            if (pages.length > 1 && currentPageIndex > 0) {
                // 현재 탭에 이전 페이지가 있으면 페이지 넘김
                showPage(activeTab, currentPageIndex - 1);
            } else {
                // 현재 탭의 첫 페이지면 이전 탭으로 이동
                const currentTabIndex = tabOrder.indexOf(activeTab);
                const prevTabIndex = (currentTabIndex - 1 + tabOrder.length) % tabOrder.length;
                showTab(tabOrder[prevTabIndex]);
            }
        }
    }

    portfolioContainer.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    portfolioContainer.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    // 초기화
    showTab(activeTab);
});