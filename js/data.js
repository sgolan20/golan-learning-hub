// קובץ נתונים - כאן תנהל את כל הנושאים והדפים
// ערוך קובץ זה כדי להוסיף תוכן חדש

const siteData = {
    // כותרת האתר
    title: "מרכז הלמידה",

    // כתובת בסיס (שנה לכתובת האמיתית כשתעלה לשרת)
    baseUrl: window.location.origin + window.location.pathname.replace('index.html', ''),

    // רשימת נושאים
    topics: [
        {
            id: "javascript",
            name: "JavaScript",
            icon: "📜",
            pages: [
                { id: "js-basics", title: "יסודות JavaScript", file: "pages/js-basics.html" },
                { id: "js-functions", title: "פונקציות", file: "pages/js-functions.html" },
                { id: "js-arrays", title: "מערכים", file: "pages/js-arrays.html" }
            ]
        },
        {
            id: "html",
            name: "HTML",
            icon: "🌐",
            pages: [
                { id: "html-basics", title: "יסודות HTML", file: "pages/html-basics.html" },
                { id: "html-forms", title: "טפסים", file: "pages/html-forms.html" }
            ]
        },
        {
            id: "css",
            name: "CSS",
            icon: "🎨",
            pages: [
                { id: "css-basics", title: "יסודות CSS", file: "pages/css-basics.html" },
                { id: "css-flexbox", title: "Flexbox", file: "pages/css-flexbox.html" }
            ]
        }
    ]
};

// פונקציות עזר לניהול הנתונים
function getTotalTopics() {
    return siteData.topics.length;
}

function getTotalPages() {
    return siteData.topics.reduce((total, topic) => total + topic.pages.length, 0);
}

function findPageById(pageId) {
    for (const topic of siteData.topics) {
        const page = topic.pages.find(p => p.id === pageId);
        if (page) {
            return { topic, page };
        }
    }
    return null;
}

function getPageUrl(pageId) {
    const result = findPageById(pageId);
    if (result) {
        return siteData.baseUrl + result.page.file;
    }
    return null;
}
