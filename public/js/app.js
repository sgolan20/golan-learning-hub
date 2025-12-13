// אפליקציה ראשית
document.addEventListener('DOMContentLoaded', function() {
    // אלמנטים
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const topicsNav = document.getElementById('topicsNav');
    const contentArea = document.getElementById('contentArea');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchInput = document.getElementById('searchInput');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const showQrBtn = document.getElementById('showQrBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const printPageBtn = document.getElementById('printPageBtn');
    const qrModal = document.getElementById('qrModal');
    const closeQrModal = document.getElementById('closeQrModal');
    const qrCodeEl = document.getElementById('qrCode');
    const qrUrlEl = document.getElementById('qrUrl');
    const printPreviewModal = document.getElementById('printPreviewModal');
    const closePrintPreviewModal = document.getElementById('closePrintPreviewModal');
    const printPreviewFrame = document.getElementById('printPreviewFrame');
    const cancelPrintBtn = document.getElementById('cancelPrintBtn');
    const confirmPrintBtn = document.getElementById('confirmPrintBtn');
    const toast = document.getElementById('toast');
    const totalTopicsEl = document.getElementById('totalTopics');
    const totalPagesEl = document.getElementById('totalPages');
    const sidebarTitle = document.querySelector('.sidebar-header h1');
    const editModeBtn = document.getElementById('editModeBtn');

    // מודלים לעריכה
    const editCourseModal = document.getElementById('editCourseModal');
    const editTopicModal = document.getElementById('editTopicModal');
    const editPageModal = document.getElementById('editPageModal');
    const dataManagementModal = document.getElementById('dataManagementModal');

    // משתנים גלובליים
    let currentCourseId = null;
    let currentPageId = null;
    let currentPageUrl = null;
    let qrCode = null;
    let isEditMode = false;

    // אתחול
    init();

    function init() {
        updateStats();
        setupEventListeners();
        setupEditModeListeners();
        handleUrlHash();
        
        // בדיקה שהכפתור נמצא
        if (!editModeBtn) {
            console.error('❌ editModeBtn לא נמצא! בדוק את ה-HTML');
        } else {
            console.log('✅ editModeBtn נמצא:', editModeBtn);
        }
    }

    // === מצב עריכה ===
    
    function toggleEditMode() {
        console.log('toggleEditMode called, current state:', isEditMode);
        isEditMode = !isEditMode;
        document.body.classList.toggle('edit-mode', isEditMode);
        
        if (editModeBtn) {
            editModeBtn.classList.toggle('active', isEditMode);
            const textEl = editModeBtn.querySelector('.text');
            if (textEl) {
                textEl.textContent = isEditMode ? 'סיום עריכה' : 'מצב עריכה';
            }
        }
        
        // רענון התצוגה
        if (currentCourseId) {
            renderTopics(currentCourseId);
            navigateToCourse(currentCourseId);
        } else {
            renderCoursesList();
            showCoursesWelcome();
        }
        
        showToast(isEditMode ? 'מצב עריכה פעיל' : 'מצב עריכה כבוי');
    }

    function setupEditModeListeners() {
        // כפתור מצב עריכה
        if (!editModeBtn) {
            console.error('❌ editModeBtn not found! בדוק את ה-HTML');
            return;
        }
        
        console.log('✅ מחבר אירוע לכפתור מצב עריכה');
        editModeBtn.addEventListener('click', function(e) {
            console.log('🖱️ לחיצה על כפתור מצב עריכה!', e);
            e.preventDefault();
            e.stopPropagation();
            toggleEditMode();
        });
        
        // בדיקה שהאירוע מחובר
        console.log('✅ אירוע מחובר לכפתור מצב עריכה');

        // === מודל קורס ===
        document.getElementById('closeEditCourseModal').addEventListener('click', () => {
            editCourseModal.classList.remove('active');
        });
        document.getElementById('cancelEditCourse').addEventListener('click', () => {
            editCourseModal.classList.remove('active');
        });
        document.getElementById('saveCourseBtn').addEventListener('click', saveCourse);
        document.getElementById('deleteCourseBtn').addEventListener('click', confirmDeleteCourse);

        // === מודל נושא ===
        document.getElementById('closeEditTopicModal').addEventListener('click', () => {
            editTopicModal.classList.remove('active');
        });
        document.getElementById('cancelEditTopic').addEventListener('click', () => {
            editTopicModal.classList.remove('active');
        });
        document.getElementById('saveTopicBtn').addEventListener('click', saveTopic);
        document.getElementById('deleteTopicBtn').addEventListener('click', confirmDeleteTopic);

        // === מודל שיעור ===
        document.getElementById('closeEditPageModal').addEventListener('click', () => {
            editPageModal.classList.remove('active');
        });
        document.getElementById('cancelEditPage').addEventListener('click', () => {
            editPageModal.classList.remove('active');
        });
        document.getElementById('savePageBtn').addEventListener('click', savePage);
        document.getElementById('deletePageBtn').addEventListener('click', confirmDeletePage);

        // === מודל ניהול נתונים ===
        document.getElementById('closeDataModal').addEventListener('click', () => {
            dataManagementModal.classList.remove('active');
        });
        document.getElementById('exportDataBtn').addEventListener('click', () => {
            exportData();
            showToast('הנתונים יוצאו בהצלחה');
        });
        document.getElementById('importDataBtn').addEventListener('click', () => {
            document.getElementById('importFileInput').click();
        });
        document.getElementById('importFileInput').addEventListener('change', handleImportFile);
        document.getElementById('resetDataBtn').addEventListener('click', confirmResetData);

        // סגירת מודלים בלחיצה מחוץ
        [editCourseModal, editTopicModal, editPageModal, dataManagementModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        });
    }

    // === עורך HTML ויזואלי ===

    function initVisualEditor() {
        const toolbar = document.getElementById('visualEditorToolbar');
        const editor = document.getElementById('pageContent');
        
        if (!toolbar || !editor) return;

        // איפוס event listeners קודמים
        const newToolbar = toolbar.cloneNode(true);
        toolbar.parentNode.replaceChild(newToolbar, toolbar);

        // הוספת event listeners לכפתורי toolbar
        newToolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                const value = btn.dataset.value;
                
                editor.focus();
                
                if (command === 'createLink') {
                    createLink(editor);
                } else if (command === 'insertImage') {
                    insertImage(editor);
                } else if (command === 'code') {
                    insertCode(editor);
                } else if (value) {
                    document.execCommand(command, false, value);
                } else {
                    document.execCommand(command, false, null);
                }
                
                updateToolbarState(newToolbar, editor);
            });
        });

        // עדכון מצב toolbar לפי בחירה
        editor.addEventListener('keyup', () => updateToolbarState(newToolbar, editor));
        editor.addEventListener('mouseup', () => updateToolbarState(newToolbar, editor));
    }

    function updateToolbarState(toolbar, editor) {
        toolbar.querySelectorAll('.toolbar-btn').forEach(btn => {
            const command = btn.dataset.command;
            try {
                if (document.queryCommandState(command)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            } catch (e) {
                // ignore
            }
        });
    }

    function createLink(editor) {
        const url = prompt('הכנס כתובת קישור:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    function insertImage(editor) {
        const url = prompt('הכנס כתובת תמונה:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    }

    function insertCode(editor) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const codeElement = document.createElement('code');
            codeElement.textContent = selection.toString() || 'קוד כאן';
            range.deleteContents();
            range.insertNode(codeElement);
        }
    }

    // === פתיחת מודלים לעריכה ===

    function openCourseEditor(courseId = null) {
        const isNew = !courseId;
        const course = courseId ? findCourseById(courseId) : null;

        document.getElementById('editCourseTitle').textContent = isNew ? 'הוספת קורס' : 'עריכת קורס';
        document.getElementById('editCourseId').value = courseId || '';
        document.getElementById('courseName').value = course?.name || '';
        document.getElementById('courseIcon').value = course?.icon || '📚';
        document.getElementById('courseDescription').value = course?.description || '';
        document.getElementById('courseColor').value = course?.color || '#3b82f6';
        document.getElementById('deleteCourseBtn').style.display = isNew ? 'none' : 'block';

        editCourseModal.classList.add('active');
    }

    function openTopicEditor(courseId, topicId = null) {
        const isNew = !topicId;
        const topic = topicId ? findTopicById(courseId, topicId) : null;

        document.getElementById('editTopicTitle').textContent = isNew ? 'הוספת נושא' : 'עריכת נושא';
        document.getElementById('editTopicId').value = topicId || '';
        document.getElementById('editTopicCourseId').value = courseId;
        document.getElementById('topicName').value = topic?.name || '';
        document.getElementById('topicIcon').value = topic?.icon || '📖';
        document.getElementById('deleteTopicBtn').style.display = isNew ? 'none' : 'block';

        editTopicModal.classList.add('active');
    }

    function openPageEditor(courseId, topicId, pageId = null) {
        const isNew = !pageId;
        const topic = findTopicById(courseId, topicId);
        const page = pageId ? topic?.pages.find(p => p.id === pageId) : null;

        document.getElementById('editPageTitle').textContent = isNew ? 'הוספת שיעור' : 'עריכת שיעור';
        document.getElementById('editPageId').value = pageId || '';
        document.getElementById('editPageCourseId').value = courseId;
        document.getElementById('editPageTopicId').value = topicId;
        document.getElementById('pageTitle').value = page?.title || '';
        document.getElementById('pageFile').value = page?.file || '';
        
        // טעינת תוכן לעורך הויזואלי
        const visualEditor = document.getElementById('pageContent');
        if (page?.content) {
            visualEditor.innerHTML = page.content;
        } else {
            visualEditor.innerHTML = '';
        }
        
        document.getElementById('deletePageBtn').style.display = isNew ? 'none' : 'block';

        // אתחול toolbar
        initVisualEditor();

        editPageModal.classList.add('active');
    }

    function openDataManagement() {
        dataManagementModal.classList.add('active');
    }

    // === שמירת פריטים ===

    function saveCourse() {
        const courseId = document.getElementById('editCourseId').value;
        const courseData = {
            name: document.getElementById('courseName').value,
            icon: document.getElementById('courseIcon').value || '📚',
            description: document.getElementById('courseDescription').value,
            color: document.getElementById('courseColor').value
        };

        if (courseId) {
            updateCourse(courseId, courseData);
            showToast('הקורס עודכן בהצלחה');
        } else {
            addCourse(courseData);
            showToast('הקורס נוסף בהצלחה');
        }

        editCourseModal.classList.remove('active');
        refreshCurrentView();
    }

    function saveTopic() {
        const topicId = document.getElementById('editTopicId').value;
        const courseId = document.getElementById('editTopicCourseId').value;
        const topicData = {
            name: document.getElementById('topicName').value,
            icon: document.getElementById('topicIcon').value || '📖'
        };

        if (topicId) {
            updateTopic(courseId, topicId, topicData);
            showToast('הנושא עודכן בהצלחה');
        } else {
            addTopic(courseId, topicData);
            showToast('הנושא נוסף בהצלחה');
        }

        editTopicModal.classList.remove('active');
        refreshCurrentView();
    }

    function savePage() {
        const pageId = document.getElementById('editPageId').value;
        const courseId = document.getElementById('editPageCourseId').value;
        const topicId = document.getElementById('editPageTopicId').value;
        const visualEditor = document.getElementById('pageContent');
        
        const pageData = {
            title: document.getElementById('pageTitle').value,
            file: document.getElementById('pageFile').value,
            content: visualEditor.innerHTML || visualEditor.innerText
        };

        if (pageId) {
            updatePage(courseId, topicId, pageId, pageData);
            showToast('השיעור עודכן בהצלחה');
        } else {
            addPage(courseId, topicId, pageData);
            showToast('השיעור נוסף בהצלחה');
        }

        editPageModal.classList.remove('active');
        refreshCurrentView();
    }

    // === מחיקת פריטים ===

    function confirmDeleteCourse() {
        const courseId = document.getElementById('editCourseId').value;
        if (confirm('האם אתה בטוח שברצונך למחוק את הקורס? כל הנושאים והשיעורים יימחקו!')) {
            deleteCourse(courseId);
            editCourseModal.classList.remove('active');
            goToCoursesView();
            showToast('הקורס נמחק בהצלחה');
        }
    }

    function confirmDeleteTopic() {
        const topicId = document.getElementById('editTopicId').value;
        const courseId = document.getElementById('editTopicCourseId').value;
        if (confirm('האם אתה בטוח שברצונך למחוק את הנושא? כל השיעורים יימחקו!')) {
            deleteTopic(courseId, topicId);
            editTopicModal.classList.remove('active');
            refreshCurrentView();
            showToast('הנושא נמחק בהצלחה');
        }
    }

    function confirmDeletePage() {
        const pageId = document.getElementById('editPageId').value;
        const courseId = document.getElementById('editPageCourseId').value;
        const topicId = document.getElementById('editPageTopicId').value;
        if (confirm('האם אתה בטוח שברצונך למחוק את השיעור?')) {
            deletePage(courseId, topicId, pageId);
            editPageModal.classList.remove('active');
            refreshCurrentView();
            showToast('השיעור נמחק בהצלחה');
        }
    }

    // === ייבוא/ייצוא ===

    function handleImportFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (importData(event.target.result)) {
                dataManagementModal.classList.remove('active');
                refreshCurrentView();
                showToast('הנתונים יובאו בהצלחה');
            } else {
                showToast('שגיאה בייבוא הנתונים');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    function confirmResetData() {
        if (confirm('האם אתה בטוח שברצונך לאפס את כל הנתונים? כל השינויים יאבדו!')) {
            resetToDefault();
            dataManagementModal.classList.remove('active');
            goToCoursesView();
            showToast('הנתונים אופסו בהצלחה');
        }
    }

    // === רענון תצוגה ===

    function refreshCurrentView() {
        updateStats();
        if (currentCourseId) {
            renderTopics(currentCourseId);
            if (currentPageId) {
                navigateToPage(currentPageId);
            } else {
                navigateToCourse(currentCourseId);
            }
        } else {
            renderCoursesList();
            showCoursesWelcome();
        }
    }

    // רינדור רשימת קורסים בסרגל הצד
    function renderCoursesList() {
        topicsNav.innerHTML = '';
        sidebarTitle.textContent = 'מרכז הלמידה';

        siteData.courses.forEach(course => {
            const courseEl = document.createElement('div');
            courseEl.className = 'course-item';
            courseEl.dataset.courseId = course.id;

            courseEl.innerHTML = `
                <div class="course-header">
                    <span class="course-icon">${course.icon}</span>
                    <span class="course-name">${course.name}</span>
                    <span class="course-arrow">←</span>
                    ${isEditMode ? `<button class="edit-btn edit-course-btn" data-course-id="${course.id}" title="ערוך קורס">✏️</button>` : ''}
                </div>
            `;

            const header = courseEl.querySelector('.course-header');
            header.addEventListener('click', (e) => {
                if (!e.target.classList.contains('edit-btn')) {
                    navigateToCourse(course.id);
                }
            });

            topicsNav.appendChild(courseEl);
        });

        // כפתור הוספת קורס במצב עריכה
        if (isEditMode) {
            const addBtn = document.createElement('button');
            addBtn.className = 'add-item-btn add-course-btn';
            addBtn.innerHTML = '<span class="icon">➕</span> הוסף קורס';
            addBtn.addEventListener('click', () => openCourseEditor());
            topicsNav.appendChild(addBtn);

            // כפתור ניהול נתונים
            const dataBtn = document.createElement('button');
            dataBtn.className = 'add-item-btn data-management-btn';
            dataBtn.innerHTML = '<span class="icon">⚙️</span> ניהול נתונים';
            dataBtn.addEventListener('click', openDataManagement);
            topicsNav.appendChild(dataBtn);
        }

        // הוספת מאזינים לכפתורי עריכה
        topicsNav.querySelectorAll('.edit-course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openCourseEditor(btn.dataset.courseId);
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });
    }

    // רינדור נושאים של קורס ספציפי
    function renderTopics(courseId, filterText = '') {
        const course = findCourseById(courseId);
        if (!course) return;

        topicsNav.innerHTML = '';
        sidebarTitle.textContent = course.name;

        // כפתור חזרה לרשימת הקורסים
        const backBtn = document.createElement('div');
        backBtn.className = 'back-to-courses';
        backBtn.innerHTML = `
            <span class="back-arrow">→</span>
            <span>חזרה לקורסים</span>
        `;
        backBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToCoursesView();
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
        topicsNav.appendChild(backBtn);

        // כפתור עריכת קורס במצב עריכה
        if (isEditMode) {
            const editCourseBtn = document.createElement('button');
            editCourseBtn.className = 'add-item-btn';
            editCourseBtn.innerHTML = '<span class="icon">✏️</span> ערוך קורס';
            editCourseBtn.addEventListener('click', () => openCourseEditor(courseId));
            topicsNav.appendChild(editCourseBtn);
        }

        course.topics.forEach(topic => {
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
                ${isEditMode ? `<button class="edit-btn edit-topic-btn" data-topic-id="${topic.id}" title="ערוך נושא">✏️</button>` : ''}
            `;

            // רשימת דפים
            const pagesList = document.createElement('div');
            pagesList.className = 'pages-list';

            const pagesToShow = filterText ? filteredPages : topic.pages;
            pagesToShow.forEach(page => {
                const pageItem = document.createElement('div');
                pageItem.className = 'page-item';
                pageItem.innerHTML = `
                    <a href="#${courseId}/${page.id}" class="page-link" data-page-id="${page.id}">${page.title}</a>
                    ${isEditMode ? `<button class="edit-btn edit-page-btn" data-page-id="${page.id}" data-topic-id="${topic.id}" title="ערוך שיעור">✏️</button>` : ''}
                `;
                pagesList.appendChild(pageItem);
            });

            // כפתור הוספת שיעור במצב עריכה
            if (isEditMode) {
                const addPageBtn = document.createElement('button');
                addPageBtn.className = 'add-item-btn add-page-btn';
                addPageBtn.innerHTML = '<span class="icon">➕</span> הוסף שיעור';
                addPageBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openPageEditor(courseId, topic.id);
                });
                pagesList.appendChild(addPageBtn);
            }

            topicEl.appendChild(header);
            topicEl.appendChild(pagesList);
            topicsNav.appendChild(topicEl);

            // פתיחה אוטומטית אם יש חיפוש
            if (filterText) {
                topicEl.classList.add('expanded');
            }
        });

        // כפתור הוספת נושא במצב עריכה
        if (isEditMode) {
            const addTopicBtn = document.createElement('button');
            addTopicBtn.className = 'add-item-btn add-topic-btn';
            addTopicBtn.innerHTML = '<span class="icon">➕</span> הוסף נושא';
            addTopicBtn.addEventListener('click', () => openTopicEditor(courseId));
            topicsNav.appendChild(addTopicBtn);
        }

        // הוספת מאזינים לכפתורי עריכה
        topicsNav.querySelectorAll('.edit-topic-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openTopicEditor(courseId, btn.dataset.topicId);
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });

        topicsNav.querySelectorAll('.edit-page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openPageEditor(courseId, btn.dataset.topicId, btn.dataset.pageId);
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
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
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });

        // כפתור המבורגר למובייל
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // סגירת תפריט מובייל בלחיצה על overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeMobileMenu);
        }

        // סגירת תפריט מובייל בלחיצה על קישור
        topicsNav.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (e.target.closest('.page-link') || 
                    e.target.closest('.course-item') || 
                    e.target.closest('.back-to-courses')) {
                    closeMobileMenu();
                }
            }
        });

        // לחיצה על נושא
        topicsNav.addEventListener('click', (e) => {
            const header = e.target.closest('.topic-header');
            if (header && !e.target.classList.contains('edit-btn')) {
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
            if (currentCourseId) {
                renderTopics(currentCourseId, e.target.value);
            }
        });

        // QR Code
        showQrBtn.addEventListener('click', showQrCode);
        closeQrModal.addEventListener('click', () => qrModal.classList.remove('active'));
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) qrModal.classList.remove('active');
        });

        // העתקת קישור
        copyLinkBtn.addEventListener('click', copyCurrentLink);

        // הדפסת דף - תצוגה מקדימה
        printPageBtn.addEventListener('click', showPrintPreview);
        
        // סגירת תצוגה מקדימה
        closePrintPreviewModal.addEventListener('click', () => printPreviewModal.classList.remove('active'));
        cancelPrintBtn.addEventListener('click', () => printPreviewModal.classList.remove('active'));
        printPreviewModal.addEventListener('click', (e) => {
            if (e.target === printPreviewModal) printPreviewModal.classList.remove('active');
        });
        
        // אישור הדפסה
        confirmPrintBtn.addEventListener('click', executePrint);

        // שינוי ב-hash
        window.addEventListener('hashchange', handleUrlHash);

        // לחיצה על breadcrumb
        breadcrumb.addEventListener('click', (e) => {
            if (e.target.dataset.home === 'true') {
                goHome();
            }
            if (e.target.dataset.courses === 'true') {
                goToCoursesView();
            }
            if (e.target.dataset.courseId) {
                navigateToCourse(e.target.dataset.courseId);
            }
        });
    }

    // חזרה לתצוגת הקורסים
    function goToCoursesView() {
        currentCourseId = null;
        currentPageId = null;
        currentPageUrl = null;
        window.location.hash = '';
        searchInput.value = '';
        
        renderCoursesList();
        showCoursesWelcome();
        
        breadcrumb.innerHTML = '<span>בית</span>';
    }

    // הצגת מסך קורסים
    function showCoursesWelcome() {
        const coursesHtml = siteData.courses.map(course => {
            const stats = getCourseStats(course.id);
            return `
                <div class="course-card" data-course-id="${course.id}" style="--course-color: ${course.color}">
                    ${isEditMode ? `<button class="card-edit-btn" data-course-id="${course.id}">✏️</button>` : ''}
                    <div class="course-card-icon">${course.icon}</div>
                    <h3 class="course-card-title">${course.name}</h3>
                    <p class="course-card-desc">${course.description}</p>
                    <div class="course-card-stats">
                        <span>${stats.topics} נושאים</span>
                        <span>•</span>
                        <span>${stats.pages} שיעורים</span>
                    </div>
                    <button class="course-card-btn">התחל ללמוד</button>
                </div>
            `;
        }).join('');

        // כפתור הוספת קורס במצב עריכה
        const addCourseCard = isEditMode ? `
            <div class="course-card add-course-card" onclick="document.querySelector('.add-course-btn')?.click()">
                <div class="course-card-icon">➕</div>
                <h3 class="course-card-title">הוסף קורס חדש</h3>
            </div>
        ` : '';

        contentArea.innerHTML = `
            <div class="courses-welcome">
                <h2>ברוכים הבאים למרכז הלמידה</h2>
                <p>בחרו קורס כדי להתחיל</p>
                <div class="courses-grid">
                    ${coursesHtml}
                    ${addCourseCard}
                </div>
            </div>
        `;

        // הוספת אירועים לכרטיסי הקורסים
        contentArea.querySelectorAll('.course-card:not(.add-course-card)').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('card-edit-btn')) {
                    const courseId = card.dataset.courseId;
                    navigateToCourse(courseId);
                    if (window.innerWidth <= 768) {
                        closeMobileMenu();
                    }
                }
            });
        });

        // אירועים לכפתורי עריכה בכרטיסים
        contentArea.querySelectorAll('.card-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openCourseEditor(btn.dataset.courseId);
            });
        });
    }

    // ניווט לקורס
    function navigateToCourse(courseId) {
        const course = findCourseById(courseId);
        if (!course) return;

        currentCourseId = courseId;
        currentPageId = null;
        currentPageUrl = null;
        window.location.hash = courseId;
        searchInput.value = '';

        renderTopics(courseId);
        
        breadcrumb.innerHTML = `
            <span class="breadcrumb-link" data-courses="true">בית</span>
            <span>${course.name}</span>
        `;

        // הצגת מסך הקורס
        const stats = getCourseStats(courseId);
        contentArea.innerHTML = `
            <div class="course-welcome">
                <div class="course-welcome-header" style="--course-color: ${course.color}">
                    ${isEditMode ? `<button class="header-edit-btn" onclick="document.querySelector('.edit-course-btn[data-course-id=\\'${courseId}\\']')?.click() || openCourseEditor('${courseId}')">✏️ ערוך קורס</button>` : ''}
                    <span class="course-welcome-icon">${course.icon}</span>
                    <h2>${course.name}</h2>
                    <p>${course.description}</p>
                </div>
                <div class="course-stats">
                    <div class="stat">
                        <span class="stat-number">${stats.topics}</span>
                        <span class="stat-label">נושאים</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${stats.pages}</span>
                        <span class="stat-label">שיעורים</span>
                    </div>
                </div>
                <p class="course-start-hint">בחרו נושא מהתפריט כדי להתחיל</p>
            </div>
        `;

        // הוספת מאזין לכפתור עריכה בהדר
        const headerEditBtn = contentArea.querySelector('.header-edit-btn');
        if (headerEditBtn) {
            headerEditBtn.addEventListener('click', () => openCourseEditor(courseId));
        }
    }

    // חזרה לדף הבית
    function goHome() {
        goToCoursesView();
    }

    // ניווט לדף
    function navigateToPage(pageId) {
        const result = findPageById(pageId, currentCourseId);
        if (!result) return;

        currentCourseId = result.course.id;
        currentPageId = pageId;
        currentPageUrl = siteData.baseUrl + result.page.file;

        // עדכון hash
        window.location.hash = `${currentCourseId}/${pageId}`;

        // עדכון breadcrumb
        breadcrumb.innerHTML = `
            <span class="breadcrumb-link" data-courses="true">בית</span>
            <span class="breadcrumb-link" data-course-id="${result.course.id}">${result.course.name}</span>
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
        if (result.page.file) {
            loadPage(result.page.file);
        } else if (result.page.content) {
            loadInlineContent(result.page);
        } else {
            contentArea.innerHTML = `
                <div class="empty-page">
                    <h2>${result.page.title}</h2>
                    <p>אין תוכן לשיעור זה עדיין.</p>
                    ${isEditMode ? `<button class="btn btn-primary" onclick="openPageEditor('${currentCourseId}', '${result.topic.id}', '${pageId}')">✏️ ערוך שיעור</button>` : ''}
                </div>
            `;
        }
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

    // טעינת תוכן מובנה
    function loadInlineContent(page) {
        // המרת line breaks ל-HTML
        const formattedContent = page.content 
            ? page.content.replace(/\n/g, '<br>')
            : '';
        
        contentArea.innerHTML = `
            <div class="inline-content worksheet">
                <h1>${page.title}</h1>
                <div class="content-body">${formattedContent}</div>
                ${isEditMode ? `<button class="btn btn-primary edit-content-btn" style="margin-top: 20px;">✏️ ערוך תוכן</button>` : ''}
            </div>
        `;

        const editBtn = contentArea.querySelector('.edit-content-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const result = findPageById(currentPageId, currentCourseId);
                if (result) {
                    openPageEditor(currentCourseId, result.topic.id, currentPageId);
                }
            });
        }
    }

    // טיפול ב-hash בכתובת
    function handleUrlHash() {
        const hash = window.location.hash.slice(1);
        
        if (!hash) {
            goToCoursesView();
            return;
        }

        // בדיקה אם יש / ב-hash (courseId/pageId)
        if (hash.includes('/')) {
            const [courseId, pageId] = hash.split('/');
            currentCourseId = courseId;
            renderTopics(courseId);
            navigateToPage(pageId);
        } else {
            // רק courseId
            navigateToCourse(hash);
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

    // הצגת תצוגה מקדימה להדפסה
    function showPrintPreview() {
        if (!currentPageId) {
            showToast('בחר דף קודם');
            return;
        }

        if (!printPreviewModal || !printPreviewFrame) {
            console.error('Print preview elements not found');
            showToast('שגיאה בטעינת תצוגה מקדימה');
            return;
        }

        const iframe = contentArea.querySelector('iframe');
        if (!iframe) {
            showToast('אין דף להדפסה');
            return;
        }

        const src = iframe.getAttribute('src');
        if (!src) {
            showToast('שגיאה בטעינת הדף');
            return;
        }

        // טעינת הדף בתצוגה המקדימה
        printPreviewFrame.src = src;
        printPreviewModal.classList.add('active');
    }

    // ביצוע הדפסה מתצוגה מקדימה
    function executePrint() {
        const iframe = printPreviewFrame;
        if (!iframe || !iframe.contentWindow) {
            showToast('שגיאה בהדפסה');
            return;
        }

        try {
            // סגירת המודל
            printPreviewModal.classList.remove('active');
            
            // המתנה קצרה ואז הדפסה
            setTimeout(() => {
                try {
                    iframe.contentWindow.print();
                } catch (err) {
                    // אם יש בעיה עם iframe, ננסה פתיחה בחלון חדש
                    const src = iframe.getAttribute('src');
                    if (src) {
                        const printWin = window.open(src, '_blank');
                        if (printWin) {
                            printWin.addEventListener('load', () => {
                                setTimeout(() => {
                                    printWin.print();
                                }, 500);
                            });
                        } else {
                            showToast('אנא אפשר חלונות קופצים להדפסה');
                        }
                    }
                }
            }, 300);
        } catch (err) {
            showToast('שגיאה בהדפסה');
        }
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // === פונקציות מובייל ===

    function toggleMobileMenu() {
        const isOpen = sidebar.classList.contains('mobile-open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        sidebar.classList.add('mobile-open');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.add('active');
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden'; // מונע גלילה ברקע
    }

    function closeMobileMenu() {
        sidebar.classList.remove('mobile-open');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
        document.body.style.overflow = ''; // מחזיר גלילה
    }

    // סגירת תפריט מובייל כשמשנים גודל חלון
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
            sidebar.classList.remove('collapsed');
        }
    });

    // חשיפת פונקציות גלובליות לשימוש ב-HTML
    window.openCourseEditor = openCourseEditor;
    window.openTopicEditor = openTopicEditor;
    window.openPageEditor = openPageEditor;
});
