# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

מרכז למידה אישי למרצה - אתר HTML סטטי לניהול דפי עבודה ותרגולים עם יצירת QR Code לכל דף. האתר בעברית עם RTL מלא.

## Architecture

### Core Files
- `index.html` - דף ראשי עם sidebar קומפקטי ואזור תוכן
- `js/data.js` - **קובץ הנתונים הראשי** - כאן מגדירים נושאים ודפים
- `js/app.js` - לוגיקת האפליקציה (ניווט, QR, חיפוש)
- `css/style.css` - עיצוב עם CSS variables

### Data Structure (js/data.js)
```javascript
siteData.topics = [
    {
        id: "topic-id",
        name: "שם הנושא",
        icon: "emoji",
        pages: [
            { id: "page-id", title: "כותרת", file: "pages/filename.html" }
        ]
    }
]
```

### Page Content (pages/*.html)
דפי תוכן עצמאיים עם class `.worksheet` לעיצוב אחיד. כל דף נטען ב-iframe.

## Development

### Running Locally
פתח את `index.html` בדפדפן. אין צורך ב-build או server.

### Adding New Content
1. צור קובץ HTML חדש בתיקיית `pages/`
2. הוסף entry ל-`siteData.topics` ב-`js/data.js`

## יצירת דף תרגול חדש

### תבנית
השתמש בקובץ `pages/template-practice.html` כבסיס לכל דף תרגול חדש.

### מבנה חובה לדף תרגול
```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <!-- פונט Heebo מ-Google Fonts -->
    <!-- CSS מלא בתוך הקובץ (לא קובץ חיצוני) -->
</head>
<body>
    <!-- לוגו - מחוץ ל-container, position: fixed -->
    <img src="../logo-shahar.png" class="brand-logo">

    <div class="container">
        <header class="header">...</header>
        <div class="intro-box">...</div>
        <article class="exercise">...</article>
        <section class="summary">...</section>
        <div class="cta">...</div>
    </div>

    <!-- כפתור הדפסה - מחוץ ל-container, position: fixed -->
    <button class="print-button">🖨️</button>
</body>
</html>
```

### אלמנטים קבועים
| אלמנט | מיקום | CSS |
|-------|-------|-----|
| `.brand-logo` | פינה שמאלית עליונה | `position: fixed; top: 20px; left: 20px;` |
| `.print-button` | פינה ימנית תחתונה | `position: fixed; bottom: 30px; right: 30px;` |

### CSS חובה
1. **Responsive** - `@media (max-width: 768px)` לגדלים קטנים יותר במובייל
2. **Print** - `@media print` עם:
   - `page-break-inside: avoid` לכרטיסי תרגיל
   - `print-color-adjust: exact` לשמירת צבעים
   - הסתרת כפתור הדפסה
   - לוגו נשאר בפינה

### צבעי קורסים קיימים
| קורס | צבע ראשי | HEX |
|------|----------|-----|
| בניית אתר ב-AI | סגול | `#667eea` → `#764ba2` |
| AI לרואי חשבון | כחול כהה | `#1a365d` → `#2c5282` |

### רכיבי תרגיל
- `.prep-box` - הכנה לתרגיל (צהוב)
- `.steps` - רשימה ממוספרת עם עיגולים צבעוניים
- `.questions-box` - שאלות/פרומפטים לדוגמה (סגול)
- `.result-box` - תוצאה צפויה (ירוק)

## Git Workflow

### Commit Policy
בסיום כל תשובה עם שינויים בקבצים:
```bash
git add .
git commit -m "[Learning] <נושא>"
```

**חשוב: אסור לבצע `git push`** - המשתמש מחליט מתי לפרסם.

### Commit Message Format
```
[Learning] <נושא>

<תיאור השינויים>

🤖 Generated with Claude Code

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## Language

- קוד והערות: עברית
- תיעוד: עברית
- כל התוכן RTL
