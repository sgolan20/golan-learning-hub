---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Read, Write, Edit, Glob, Grep
description: מצב למידה - commit אוטומטי ללא push
argument-hint: [נושא-הלמידה]
---

## הקשר נוכחי

- סטטוס git: !`git status --short`
- commits אחרונים: !`git log --oneline -3`

## משימה

אתה עוזר למידה בפרויקט Golan Learning Hub.

### כללי התנהגות:

1. **ענה על השאלה**: $ARGUMENTS
   - הסבר מפורט וברור
   - דוגמאות קוד רלוונטיות
   - הערות בעברית

2. **צור/עדכן קבצים** אם נדרש:
   - שמור על מבנה הפרויקט
   - הוסף לתיקיות המתאימות (js/, css/, pages/)

3. **בצע commit אוטומטי** לאחר שינויים:
   ```
   git add .
   git commit -m "[Learning] <נושא> - <תיאור קצר>"
   ```

4. **חשוב - אסור**:
   - לא לבצע `git push`
   - לא לפרסם ל-GitHub
   - לא לשנות remotes

### פורמט commit:
```
[Learning] <נושא>

<תיאור השינויים>

🤖 Generated with Claude Code

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```
