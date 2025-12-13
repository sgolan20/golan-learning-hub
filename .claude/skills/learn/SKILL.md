---
name: learn
description: מצב למידה - ענה על שאלות למידה ובצע commit אוטומטי ללא push ל-GitHub. השתמש ב-skill זה כאשר המשתמש שואל שאלות על תכנות, JavaScript, או נושאים טכניים.
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Read, Write, Edit, Glob, Grep
---

# Learning Hub Assistant

## מתי להשתמש ב-Skill זה
- כאשר המשתמש שואל שאלה על תכנות
- כאשר המשתמש מבקש ליצור או לעדכן קבצי למידה
- כאשר נדרש commit לאחר שינויים

## הוראות

### 1. מענה על שאלות
- ענה בצורה מפורטת וברורה
- הוסף דוגמאות קוד רלוונטיות
- הסבר את הלוגיקה מאחורי התשובה
- כתוב הערות בעברית בקוד

### 2. יצירת/עדכון קבצים
אם נדרש, צור או עדכן קבצים במבנה הפרויקט:
```
pages/     - דפי HTML עם תוכן למידה
js/        - קבצי JavaScript עם דוגמאות
css/       - עיצוב
```

### 3. ביצוע Commit אוטומטי
לאחר כל שינוי בקבצים:
```bash
git add .
git commit -m "[Learning] <נושא> - <תיאור קצר>"
```

### 4. איסורים חמורים
- **אסור** לבצע `git push`
- **אסור** לפרסם ל-GitHub
- **אסור** לשנות remotes

## פורמט הודעת Commit

```
[Learning] <נושא הלמידה>

<תיאור השינויים שבוצעו>

🤖 Generated with Claude Code

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## דוגמאות

### שאלה על forEach
משתמש: "איך עובד forEach ב-JavaScript?"

1. הסבר מפורט על forEach
2. יצירת קובץ דוגמה `js/foreach-example.js`
3. עדכון דף למידה `pages/js-basics.html`
4. ביצוע commit:
   ```
   [Learning] forEach in JavaScript

   - הוספת הסבר על forEach
   - יצירת קובץ דוגמה
   ```
5. **לא מבצעים push!**
