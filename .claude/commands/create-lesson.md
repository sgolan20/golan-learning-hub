---
description: יצירת דף תרגול/שיעור חדש עם העיצוב הנכון, לוגו וכפתור הדפסה
allowed-tools: Read, Write, Edit, Bash, Glob
---

# יצירת דף תרגול חדש

אתה יוצר דף תרגול/שיעור חדש למרכז הלמידה. **חובה** לעקוב אחרי ההנחיות הבאות בדיוק.

## פרמטרים מהמשתמש
$ARGUMENTS

## שלבי העבודה

### 1. קריאת התבנית
קרא את הקובץ `pages/template-practice.html` כבסיס.

### 2. התאמת צבעים לקורס
בדוק את הקורס ב-`js/data.js` והתאם את הצבעים:

| קורס | gradient ראשי | צבע בודד |
|------|---------------|----------|
| בניית אתר ב-AI | `#667eea` → `#764ba2` | `#667eea` |
| AI לרואי חשבון | `#1a365d` → `#2c5282` → `#2b6cb0` | `#2c5282` |

אם זה קורס חדש - בחר צבע מתאים ועדכן את CLAUDE.md.

### 3. מבנה HTML חובה

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>דף תרגול - [שם הנושא]</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap');
        /* כל ה-CSS בתוך הקובץ */
    </style>
</head>
<body>
    <!-- לוגו - חובה מחוץ ל-container -->
    <img src="../logo-shahar.png" alt="שחר גולן" class="brand-logo">

    <div class="container">
        <header class="header">
            <h1>📋 דף תרגול</h1>
            <h2>[שם הנושא]</h2>
        </header>

        <div class="intro-box">...</div>
        <article class="exercise">...</article>
        <section class="summary">...</section>
        <div class="cta">...</div>
    </div>

    <!-- כפתור הדפסה - חובה מחוץ ל-container -->
    <button onclick="window.print()" class="print-button" title="הדפס דף">
        <span class="print-button-tooltip">הדפס דף</span>
        🖨️
    </button>
</body>
</html>
```

### 4. CSS חובה - אלמנטים קבועים

#### לוגו (פינה שמאלית עליונה)
```css
.brand-logo {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 80px;
    height: auto;
    z-index: 1001;
    opacity: 0.9;
    transition: opacity 0.3s ease;
    background: white;
    padding: 8px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.brand-logo:hover {
    opacity: 1;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
```

#### כפתור הדפסה (פינה ימנית תחתונה)
```css
.print-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, [צבע1] 0%, [צבע2] 100%);
    color: white;
    border: none;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 20px rgba([rgb], 0.4);
    cursor: pointer;
    font-size: 1.8em;
    transition: all 0.3s ease;
    z-index: 1000;
}

.print-button:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 30px rgba([rgb], 0.6);
}

.print-button-tooltip {
    position: absolute;
    left: 70px;
    background: #333;
    color: white;
    padding: 8px 15px;
    border-radius: 8px;
    white-space: nowrap;
    font-size: 0.5em;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.print-button:hover .print-button-tooltip {
    opacity: 1;
}
```

### 5. CSS חובה - Responsive
```css
@media (max-width: 768px) {
    body { padding: 20px 10px; }
    .container { padding: 20px 15px; }
    .header { padding: 30px 20px; margin-bottom: 30px; }
    .header h1 { font-size: 1.8rem; }
    .header h2 { font-size: 1.1rem; }
    .exercise-header { flex-direction: column; text-align: center; padding: 15px 20px; }
    .exercise-content { padding: 20px; }
    .print-button { width: 50px; height: 50px; bottom: 15px; right: 15px; font-size: 1.5em; }
    .print-button-tooltip { display: none; }
    .brand-logo { width: 60px; top: 12px; left: 12px; padding: 5px; }
}
```

### 6. CSS חובה - Print
```css
@media print {
    @page { size: A4; margin: 1cm; }
    body { background: white !important; padding: 0 !important; margin: 0 !important; }
    .print-button { display: none !important; }
    .container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }

    .header {
        background: [צבע-הקורס] !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        padding: 15px 20px !important;
        margin-bottom: 15px !important;
        border-radius: 0 !important;
    }

    .brand-logo {
        position: fixed !important;
        top: 10px !important;
        left: 10px !important;
        width: 60px !important;
        display: block !important;
        background: white !important;
        padding: 6px !important;
        border-radius: 8px !important;
    }

    .exercise, .prep-box, .questions-box, .result-box, .summary, .cta {
        page-break-inside: avoid;
        break-inside: avoid;
    }

    .exercise-header, .summary-header {
        background: [צבע-הקורס] !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
```

### 7. רכיבי תרגיל

| רכיב | שימוש | צבע רקע |
|------|-------|---------|
| `.prep-box` | הכנה לתרגיל, רקע | צהוב `#fffbeb` → `#fef3c7`, border `#d69e2e` |
| `.steps` | שלבי ביצוע ממוספרים | אפור `#f7fafc`, עיגולים בצבע הקורס |
| `.questions-box` | שאלות/פרומפטים לדוגמה | לבן עם border סגול `#805ad5` |
| `.result-box` | תוצאה צפויה | ירוק `#f0fff4` → `#c6f6d5`, border `#38a169` |
| `.summary-section.tools` | כלים שתרגלנו | כחול בהיר |
| `.summary-section.benefits` | יתרונות | כתום בהיר |
| `.summary-section.warnings` | אזהרות | אדום בהיר |

### 8. לאחר היצירה
1. עדכן את `js/data.js` עם הדף החדש
2. בצע commit:
```bash
git add .
git commit -m "[Learning] הוספת דף תרגול: [שם הדף]"
```

## חשוב!
- **אל תשנה** את מיקום הלוגו וכפתור ההדפסה
- **אל תשכח** את ה-responsive וה-print styles
- **שמור** על אותו מבנה HTML כמו בתבנית
- התוכן יהיה לפי מה שהמשתמש נותן, העיצוב לפי ההנחיות כאן
