@echo off
title LuxuryStay Hospitality - Server Launcher
echo =======================================================
echo   LuxuryStay Hospitality MERN - Starting Services
echo =======================================================
echo.
echo [1/2] Launching Backend API Server (Port 5001)...
start "LuxuryStay Backend (:5001)" cmd /k "npm run server"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Frontend React App (Port 3000)...
start "LuxuryStay Frontend (:3000)" cmd /k "npm run client"

echo.
echo =======================================================
echo  Servers successfully initiated!
echo  - Backend API:  http://localhost:5001/api/health
echo  - Frontend Web: http://localhost:3000
echo =======================================================

