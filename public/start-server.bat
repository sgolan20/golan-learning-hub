@echo off
echo Starting local server...
echo.
echo The app will open at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npx -y http-server -p 3000 -o
pause
