Set-Location D:\dakaAgentProject\物流声音游戏\backend
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location D:\dakaAgentProject\物流声音游戏\backend; Write-Host "Backend Server - Port 3000" -ForegroundColor Green; npm run dev'
Start-Sleep 3
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location D:\dakaAgentProject\物流声音游戏\frontend; Write-Host "Frontend Server - Port 5173" -ForegroundColor Green; npm run dev'
Write-Host "Servers started!" -ForegroundColor Green
Write-Host "Please visit: http://localhost:5173" -ForegroundColor Cyan
