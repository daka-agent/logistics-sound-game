@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ========================================
echo GitHub Pages Deployment
echo ========================================
echo.

cd /d "%~dp0frontend"

echo [1/5] Installing dependencies...
call npm install

echo.
echo [2/5] Installing gh-pages...
call npm install --save-dev gh-pages

echo.
echo [3/5] Building project...
call npm run build

echo.
echo [4/5] Deploying to GitHub Pages...
call npx gh-pages -d dist

echo.
echo [5/5] Done!
echo.
echo ========================================
echo Deployment Complete!
echo.
echo Your game is now available at:
echo https://daka-agent.github.io/logistics-sound-game/
echo ========================================
echo.

pause
