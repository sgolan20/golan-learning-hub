# הוראות לפרויקט - Golan Learning Hub

## כללים חשובים

### Commit אוטומטי
לאחר כל תשובה על שאלה שכוללת שינויים בקבצים:
1. בצע `git add .` להוספת כל השינויים
2. בצע `git commit` עם הודעה מתאימה
3. **אסור לבצע `git push`** - השינויים נשארים מקומיים בלבד

### פורמט הודעות Commit
```
[Learning] <נושא>

<תיאור השינויים>

🤖 Generated with Claude Code

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### שפת הפרויקט
- הערות בקוד: עברית
- הודעות commit: עברית או אנגלית
- תיעוד: עברית

### מבנה הפרויקט
```
golan-learning-hub/
├── index.html          # דף הבית
├── css/
│   └── style.css       # עיצוב
├── js/
│   ├── app.js          # לוגיקה ראשית
│   └── data.js         # נתונים
├── pages/
│   └── js-basics.html  # דפי תוכן
└── .claude/
    └── commands/
        └── learn.md    # SKILL ללמידה
```

## זרימת עבודה
1. המשתמש שואל שאלה
2. Claude עונה ומבצע שינויים בקבצים אם נדרש
3. Claude מבצע commit אוטומטי
4. **לא מבצע push** - המשתמש יחליט מתי לפרסם
