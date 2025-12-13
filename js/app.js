// אפליקציה ראשית
document.addEventListener('DOMContentLoaded', function() {
    // אלמנטים
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const topicsNav = document.getElementById('topicsNav');
    const contentArea = document.getElementById('contentArea');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchInput = document.getElementById('searchInput');
    const showQrBtn = document.getElementById('showQrBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const qrModal = document.getElementById('qrModal');
    const closeQrModal = document.getElementById('closeQrModal');
    const qrCodeEl = document.getElementById('qrCode');
    const qrUrlEl = document.getElementById('qrUrl');
    const toast = document.getElementById('toast');
    const totalTopicsEl = document.getElementById('totalTopics');
    const totalPagesEl = document.getElementById('totalPages');

    // משתנים גלובליים
    let currentPageId = null;
    let currentPageUrl = null;
    let qrCode = null;

    // אתחול
    init();

    function init() {
        renderTopics();
        updateStats();
        setupEventListeners();
        handleUrlHash();
    }

    // רינדור נושאים
    function renderTopics(filterText = '') {
        topicsNav.innerHTML = '';

        siteData.topics.forEach(topic => {
            // סינון לפי חיפוש
            const filteredPages = topic.pages.filter(page =>
                page.title.includes(filterText) || topic.name.includes(filterText)
            );

            if (filterText && filteredPages.length === 0) return;

            const topicEl = document.createElement('div');
            topicEl.className = 'topic-item';
            topicEl.dataset.topicId = topic.id;

            // כותרת נושא
            const header = document.createElement('div');
            header.className = 'topic-header';
            header.innerHTML = `
                <span class="topic-icon">${topic.icon}</span>
                <span class="topic-name">${topic.name}</span>
                <span class="topic-toggle">◀</span>
            `;

            // רשימת דפים
            const pagesList = document.createElement('div');
            pagesList.className = 'pages-list';

            const pagesToShow = filterText ? filteredPages : topic.pages;
            pagesToShow.forEach(page => {
                const pageLink = document.createElement('a');
                pageLink.href = `#${page.id}`;
                pageLink.className = 'page-link';
                pageLink.textContent = page.title;
                pageLink.dataset.pageId = page.id;
                pagesList.appendChild(pageLink);
            });

            topicEl.appendChild(header);
            topicEl.appendChild(pagesList);
            topicsNav.appendChild(topicEl);

            // פתיחה אוטומטית אם יש חיפוש
            if (filterText) {
                topicEl.classList.add('expanded');
            }
        });
    }

    // עדכון סטטיסטיקות
    function updateStats() {
        totalTopicsEl.textContent = getTotalTopics();
        totalPagesEl.textContent = getTotalPages();
    }

    // אירועים
    function setupEventListeners() {
        // פתיחה/סגירה סרגל צד
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        // לחיצה על נושא
        topicsNav.addEventListener('click', (e) => {
            const header = e.target.closest('.topic-header');
            if (header) {
                const topicItem = header.closest('.topic-item');
                topicItem.classList.toggle('expanded');
            }

            const pageLink = e.target.closest('.page-link');
            if (pageLink) {
                e.preventDefault();
                const pageId = pageLink.dataset.pageId;
                navigateToPage(pageId);
            }
        });

        // חיפוש
        searchInput.addEventListener('input', (e) => {
            renderTopics(e.target.value);
        });

        // QR Code
        showQrBtn.addEventListener('click', showQrCode);
        closeQrModal.addEventListener('click', () => qrModal.classList.remove('active'));
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) qrModal.classList.remove('active');
        });

        // העתקת קישור
        copyLinkBtn.addEventListener('click', copyCurrentLink);

        // שינוי ב-hash
        window.addEventListener('hashchange', handleUrlHash);

        // לחיצה על breadcrumb
        breadcrumb.addEventListener('click', (e) => {
            if (e.target.dataset.home === 'true') {
                goHome();
            }
        });
    }

    // חזרה לדף הבית
    function goHome() {
        currentPageId = null;
        currentPageUrl = null;
        window.location.hash = '';

        breadcrumb.innerHTML = '<span>בית</span>';

        // הסרת סימון דף פעיל
        document.querySelectorAll('.page-link').forEach(link => {
            link.classList.remove('active');
        });

        // הצגת מסך פתיחה
        contentArea.innerHTML = `
            <div class="welcome-screen">
                <h2>ברוכים הבאים למרכז הלמידה</h2>
                <p>בחר נושא מהתפריט כדי להתחיל</p>
                <div class="stats">
                    <div class="stat">
                        <span class="stat-number">${getTotalTopics()}</span>
                        <span class="stat-label">נושאים</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${getTotalPages()}</span>
                        <span class="stat-label">דפים</span>
                    </div>
                </div>
            </div>
        `;
    }

    // ניווט לדף
    function navigateToPage(pageId) {
        const result = findPageById(pageId);
        if (!result) return;

        currentPageId = pageId;
        currentPageUrl = siteData.baseUrl + result.page.file;

        // עדכון hash
        window.location.hash = pageId;

        // עדכון breadcrumb
        breadcrumb.innerHTML = `
            <span class="breadcrumb-link" data-home="true">בית</span>
            <span>${result.topic.name}</span>
            <span>${result.page.title}</span>
        `;

        // סימון דף פעיל
        document.querySelectorAll('.page-link').forEach(link => {
            link.classList.toggle('active', link.dataset.pageId === pageId);
        });

        // פתיחת הנושא הרלוונטי
        document.querySelectorAll('.topic-item').forEach(item => {
            if (item.dataset.topicId === result.topic.id) {
                item.classList.add('expanded');
            }
        });

        // טעינת התוכן
        loadPage(result.page.file);
    }

    // טעינת דף
    function loadPage(file) {
        contentArea.innerHTML = `
            <iframe
                class="page-iframe"
                src="${file}"
                title="תוכן הדף"
            ></iframe>
        `;
    }

    // טיפול ב-hash בכתובת
    function handleUrlHash() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            navigateToPage(hash);
        }
    }

    // הצגת QR Code
    function showQrCode() {
        if (!currentPageUrl) {
            showToast('בחר דף קודם');
            return;
        }

        qrModal.classList.add('active');
        qrUrlEl.textContent = currentPageUrl;

        // ניקוי QR קודם
        qrCodeEl.innerHTML = '';

        // יצירת QR חדש
        qrCode = new QRCode(qrCodeEl, {
            text: currentPageUrl,
            width: 200,
            height: 200,
            colorDark: '#1e293b',
            colorLight: '#ffffff'
        });
    }

    // העתקת קישור
    function copyCurrentLink() {
        if (!currentPageUrl) {
            showToast('בחר דף קודם');
            return;
        }

        navigator.clipboard.writeText(currentPageUrl).then(() => {
            showToast('הקישור הועתק!');
        }).catch(() => {
            showToast('שגיאה בהעתקה');
        });
    }

    // הודעה קופצת
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
});
