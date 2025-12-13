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
            id: "lovable-course",
            name: "קורס בניית אתר עם Lovable",
            icon: "💜",
            pages: [
                { id: "lovable-prompts", title: "כתיבת פרומפט בצורה נכונה", file: "pages/lovable-prompts.html" },
                { id: "lovable-visual-edits", title: "Visual Edits - עריכה ויזואלית", file: "pages/lovable-visual-edits.html" },
                { id: "lovable-themes", title: "Themes - עיצוב ומותג", file: "pages/lovable-themes.html" }
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
