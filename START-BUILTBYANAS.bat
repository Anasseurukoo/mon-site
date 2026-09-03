@echo off
setlocal
cd /d "%~dp0"
title BuiltByAnas V2 - Pre-Git Test 1.8

echo.
echo ================================================
echo   BuiltByAnas V2 - Pre-Git Test 1.8
echo ================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 20+ first.
  pause
  exit /b 1
)

echo Syncing dependencies and security patch...
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo Install failed. Check your internet connection, then run this file again.
  pause
  exit /b 1
)

start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:3000/?intro=1"
call npm run dev
pause
