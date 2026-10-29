@echo off
title LuxuryStay Hospitality - Server Launcher
echo =====================================================================
echo           LuxuryStay Hospitality MERN Management System
echo =====================================================================
echo.
echo [1/2] Starting Backend Server (Port 5001)...
start "LuxuryStay Backend (Port 5001)" cmd /k "cd /d %~dp0backend && npm start"

echo [2/2] Starting Frontend Website (Port 3000)...
start "LuxuryStay Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo =====================================================================
echo   Both services are now launching in separate windows!
echo.
echo   * Website URL:     http://localhost:3000
echo   * Restaurant URL:  http://localhost:3000/restaurant
echo   * Admin Dashboard: http://localhost:3000/login
echo.
echo   Admin Credentials:
echo   - Email:    admin@hotel.com
echo   - Password: admin123
echo =====================================================================
timeout /t 5 >nul

