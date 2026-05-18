# 手动部署脚本
# 请在 PowerShell 中运行

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "手动部署到 GitHub Pages" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$projectPath = "D:\dakaAgentProject\物流声音游戏"

# 切换到项目目录
Set-Location $projectPath

# 保存当前分支
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "当前分支: $currentBranch" -ForegroundColor Yellow

# 切换到 main 分支
Write-Host "`n[1/6] 切换到 main 分支..." -ForegroundColor Yellow
git checkout main

# 构建前端
Write-Host "`n[2/6] 构建前端..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build
Set-Location ..

# 切换到 gh-pages 分支
Write-Host "`n[3/6] 切换到 gh-pages 分支..." -ForegroundColor Yellow
git checkout gh-pages

# 清空当前内容
Write-Host "`n[4/6] 清空 gh-pages 内容..." -ForegroundColor Yellow
Get-ChildItem -Exclude ".git" | Remove-Item -Recurse -Force

# 复制构建产物
Write-Host "`n[5/6] 复制构建产物..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "frontend\dist\*" .
Copy-Item -Recurse -Force "backend\public\sounds" .

# 提交并推送
Write-Host "`n[6/6] 提交并推送..." -ForegroundColor Yellow
git add .
git commit -m "deploy: manual deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin gh-pages

# 切回原分支
Write-Host "`n切回原分支: $currentBranch" -ForegroundColor Yellow
git checkout $currentBranch

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "部署完成！" -ForegroundColor Green
Write-Host "访问: https://daka-agent.github.io/logistics-sound-game/" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
