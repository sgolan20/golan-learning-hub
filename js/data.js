// קובץ נתונים - כאן תנהל את כל הקורסים, הנושאים והדפים
// הנתונים נשמרים ב-localStorage

// נתוני ברירת מחדל
const defaultData = {
    courses: [
        {
            id: "ai-website-building",
            name: "בניית אתר ב-AI",
            icon: "🤖",
            description: "למדו לבנות אתרים באמצעות כלי AI כמו Cursor, Lovable ועוד",
            color: "#8b5cf6",
            topics: [
                {
                    id: "getting-started",
                    name: "איך מתחילים",
                    icon: "🚀",
                    pages: [
                        { id: "what-is-vibe-coding", title: "מה זה vibe coding?", file: "pages/what-is-vibe-coding.html" }
                    ]
                },
                {
                    id: "lovable-exercises",
                    name: "תרגולים ב-Lovable",
                    icon: "💪",
                    pages: [
                        { id: "task1", title: "עיצוב דף נחיתה בצבעים אישיים", file: "pages/lovable-tasks/task1.html" },
                        { id: "task2", title: "שיפור האלמנטים של דף נחיתה", file: "pages/lovable-tasks/task2.html" },
                        { id: "task3", title: "חיבור ל-Cloud וצפייה בנתונים", file: "pages/lovable-tasks/task3.html" },
                        { id: "task4", title: "פרסום דף נחיתה באינטרנט", file: "pages/lovable-tasks/task4.html" },
                        { id: "task5", title: "אבטחת דף נחיתה", file: "pages/lovable-tasks/task5.html" }
                    ]
                }
            ]
        }
    ]
};

// טעינת נתונים מ-localStorage או שימוש בברירת מחדל
function loadSiteData() {
    const saved = localStorage.getItem('learningHubData');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error loading saved data:', e);
            return { ...defaultData };
        }
    }
    return { ...defaultData };
}

// שמירת נתונים ל-localStorage
function saveSiteData() {
    localStorage.setItem('learningHubData', JSON.stringify(siteData));
}

// איפוס לברירת מחדל
function resetToDefault() {
    localStorage.removeItem('learningHubData');
    Object.assign(siteData, JSON.parse(JSON.stringify(defaultData)));
    saveSiteData();
}

// אתחול siteData
const siteData = {
    title: "מרכז הלמידה",
    baseUrl: window.location.origin + window.location.pathname.replace('index.html', ''),
    ...loadSiteData()
};

// פונקציות עזר לניהול הנתונים
function getTotalCourses() {
    return siteData.courses.length;
}

function getTotalTopics() {
    return siteData.courses.reduce((total, course) => total + course.topics.length, 0);
}

function getTotalPages() {
    return siteData.courses.reduce((total, course) => 
        total + course.topics.reduce((t, topic) => t + topic.pages.length, 0), 0);
}

function findCourseById(courseId) {
    return siteData.courses.find(c => c.id === courseId);
}

function findTopicById(courseId, topicId) {
    const course = findCourseById(courseId);
    if (!course) return null;
    return course.topics.find(t => t.id === topicId);
}

function findPageById(pageId, courseId = null) {
    const coursesToSearch = courseId 
        ? siteData.courses.filter(c => c.id === courseId)
        : siteData.courses;
    
    for (const course of coursesToSearch) {
        for (const topic of course.topics) {
            const page = topic.pages.find(p => p.id === pageId);
            if (page) {
                return { course, topic, page };
            }
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

function getCourseTopics(courseId) {
    const course = findCourseById(courseId);
    return course ? course.topics : [];
}

function getCourseStats(courseId) {
    const course = findCourseById(courseId);
    if (!course) return { topics: 0, pages: 0 };
    
    const topics = course.topics.length;
    const pages = course.topics.reduce((total, topic) => total + topic.pages.length, 0);
    return { topics, pages };
}

// יצירת מזהה ייחודי
function generateId(prefix = 'item') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// === פונקציות CRUD לקורסים ===

function addCourse(courseData) {
    const newCourse = {
        id: generateId('course'),
        name: courseData.name || 'קורס חדש',
        icon: courseData.icon || '📚',
        description: courseData.description || '',
        color: courseData.color || '#3b82f6',
        topics: []
    };
    siteData.courses.push(newCourse);
    saveSiteData();
    return newCourse;
}

function updateCourse(courseId, updates) {
    const course = findCourseById(courseId);
    if (course) {
        Object.assign(course, updates);
        saveSiteData();
        return course;
    }
    return null;
}

function deleteCourse(courseId) {
    const index = siteData.courses.findIndex(c => c.id === courseId);
    if (index !== -1) {
        siteData.courses.splice(index, 1);
        saveSiteData();
        return true;
    }
    return false;
}

// === פונקציות CRUD לנושאים ===

function addTopic(courseId, topicData) {
    const course = findCourseById(courseId);
    if (!course) return null;
    
    const newTopic = {
        id: generateId('topic'),
        name: topicData.name || 'נושא חדש',
        icon: topicData.icon || '📖',
        pages: []
    };
    course.topics.push(newTopic);
    saveSiteData();
    return newTopic;
}

function updateTopic(courseId, topicId, updates) {
    const topic = findTopicById(courseId, topicId);
    if (topic) {
        Object.assign(topic, updates);
        saveSiteData();
        return topic;
    }
    return null;
}

function deleteTopic(courseId, topicId) {
    const course = findCourseById(courseId);
    if (!course) return false;
    
    const index = course.topics.findIndex(t => t.id === topicId);
    if (index !== -1) {
        course.topics.splice(index, 1);
        saveSiteData();
        return true;
    }
    return false;
}

// === פונקציות CRUD לשיעורים ===

function addPage(courseId, topicId, pageData) {
    const topic = findTopicById(courseId, topicId);
    if (!topic) return null;
    
    const newPage = {
        id: generateId('page'),
        title: pageData.title || 'שיעור חדש',
        file: pageData.file || '',
        content: pageData.content || ''
    };
    topic.pages.push(newPage);
    saveSiteData();
    return newPage;
}

function updatePage(courseId, topicId, pageId, updates) {
    const topic = findTopicById(courseId, topicId);
    if (!topic) return null;
    
    const page = topic.pages.find(p => p.id === pageId);
    if (page) {
        Object.assign(page, updates);
        saveSiteData();
        return page;
    }
    return null;
}

function deletePage(courseId, topicId, pageId) {
    const topic = findTopicById(courseId, topicId);
    if (!topic) return false;
    
    const index = topic.pages.findIndex(p => p.id === pageId);
    if (index !== -1) {
        topic.pages.splice(index, 1);
        saveSiteData();
        return true;
    }
    return false;
}

// ייצוא נתונים כ-JSON
function exportData() {
    const dataStr = JSON.stringify(siteData.courses, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'learning-hub-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// ייבוא נתונים מ-JSON
function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        if (Array.isArray(data)) {
            siteData.courses = data;
            saveSiteData();
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error importing data:', e);
        return false;
    }
}
