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
