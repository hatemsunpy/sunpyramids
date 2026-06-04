# Close any running instances of Antigravity IDE
Write-Host "Closing any running instances of Antigravity IDE..."
Stop-Process -Name "Antigravity IDE" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Antigravity IDE with remote debugging enabled on port 9000
Write-Host "Starting Antigravity IDE with remote debugging enabled on port 9000..."
Start-Process "C:\Users\HaTeM\AppData\Local\Programs\Antigravity IDE\Antigravity IDE.exe" -ArgumentList "--remote-debugging-port=9000"
Write-Host "Done!"
