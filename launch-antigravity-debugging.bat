@echo off
echo Closing any running instances of Antigravity IDE...
taskkill /f /im "Antigravity IDE.exe" 2>nul
timeout /t 2 /nobreak >nul

echo Starting Antigravity IDE with remote debugging enabled on port 9000...
start "" "C:\Users\HaTeM\AppData\Local\Programs\Antigravity IDE\Antigravity IDE.exe" --remote-debugging-port=9000
echo Done!
pause
