@echo off
setlocal
cd /d "%~dp0"

echo Starting MotsoM-Dev portfolio...
echo.

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Node.js / npm was not found. Install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Dependencies are missing.
  echo Run this first: npm.cmd install
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 2; if ($r.Content -match 'Kgomotso|MotsoM|__next') { exit 0 } else { exit 2 } } catch { exit 1 }" >nul 2>nul
if "%errorlevel%"=="0" (
  echo The portfolio is already running.
  echo Open this URL in your browser:
  echo http://127.0.0.1:3000
  echo.
  pause
  exit /b 0
)

echo Next.js will print the exact local URL below.
echo Open that URL in your browser, usually http://127.0.0.1:3000
echo.
echo Press Ctrl+C in this window to stop the server.
echo.
call npm.cmd run dev
pause