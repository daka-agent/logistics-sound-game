@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ========================================
echo Logistics Sound Game - Admin Mode
echo ========================================
echo.

echo [1/6] Cleaning npm cache...
call npm cache clean --force

echo.
echo [2/6] Entering backend directory...
cd /d "%~dp0backend"

echo.
echo [3/6] Installing backend dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed!
    pause
    exit /b 1
)

echo.
echo [4/6] Initializing data...
call npm run init-db

echo.
echo [5/6] Installing frontend dependencies...
cd /d "%~dp0frontend"
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    pause
    exit /b 1
)

echo.
echo [6/6] Starting services...
echo.
echo ========================================
echo Service URLs:
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo ========================================
echo.

start "Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 3 >nul
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Done! Please visit http://localhost:5173
echo.
pause
