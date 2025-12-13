@echo off
chcp 65001 >nul
echo ====================================
echo העלאת הפרויקט ל-Firebase Hosting
echo ====================================
echo.

echo שלב 1: בדיקת התחברות...
firebase login:list
echo.

echo שלב 2: הגדרת הפרויקט ai-course-hub...
firebase use ai-course-hub
echo.

echo שלב 3: בדיקת מבנה הקבצים...
echo.
echo תוכן תיקיית public:
dir /b public
echo.
echo קובץ firebase.json:
type firebase.json
echo.

echo שלב 4: העלאת הפרויקט...
echo.
firebase deploy --only hosting --project ai-course-hub --debug
echo.

echo ====================================
echo סיום
echo ====================================
pause

