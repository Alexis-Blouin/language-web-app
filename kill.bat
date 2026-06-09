@echo off

echo Stopping servers...

:: Kill frontend Node process (port 3000)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    tasklist /fi "pid eq %%a" /fi "imagename eq node.exe" 2>nul | findstr node.exe >nul
    if not errorlevel 1 taskkill /f /pid %%a >nul 2>&1
)

:: Kill backend Node process (port 8081)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
    tasklist /fi "pid eq %%a" /fi "imagename eq node.exe" 2>nul | findstr node.exe >nul
    if not errorlevel 1 taskkill /f /pid %%a >nul 2>&1
)

echo Servers stopped.
pause