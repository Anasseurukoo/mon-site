@echo off
setlocal
cd /d "%~dp0"
title BuiltByAnas - Full Pre-Git Check

echo.
echo ================================================
echo   BuiltByAnas - FULL PRE-GIT CHECK

echo ================================================
echo.

echo [1/4] Installing / syncing dependencies...
call npm install --no-audit --no-fund
if errorlevel 1 goto :fail

echo.
echo [2/4] TypeScript...
call npm run typecheck
if errorlevel 1 goto :fail

echo.
echo [3/4] ESLint...
call npm run lint
if errorlevel 1 goto :fail

echo.
echo [4/4] Production build / static export...
call npm run build
if errorlevel 1 goto :fail

echo.
echo ================================================
echo   PASS - READY FOR GIT REVIEW

echo   Static site output: .\out\
echo ================================================
echo.
pause
exit /b 0

:fail
echo.
echo ================================================
echo   CHECK FAILED - DO NOT PUSH YET

echo ================================================
echo.
pause
exit /b 1
