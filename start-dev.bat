@echo off
title Darth Seldon's QR Forge — Dev Launcher
echo.
echo  ======================================
echo   Darth Seldon's QR Forge — Dev Mode
echo  ======================================
echo.

:: Start backend in a new window
echo  [1/2] Launching backend on http://localhost:5218 ...
start "QR Forge — Backend" cmd /k "cd /d %~dp0src && set ASPNETCORE_ENVIRONMENT=Development && dotnet run"

:: Give the backend a moment to start restoring packages / compiling
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
echo  [2/2] Launching frontend on http://localhost:3000 ...
start "QR Forge — Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo  Both servers are starting in separate windows.
echo.
echo    Backend  : http://localhost:5218
echo    Frontend : http://localhost:3000
echo.
echo  Press any key to close this launcher (servers keep running).
pause >nul
