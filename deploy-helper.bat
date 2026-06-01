@echo off
chcp 65001 >nul
echo ==========================================
echo   拼豆豆工坊 - GitHub自动部署配置助手
echo ==========================================
echo.
echo 这个脚本将帮助您配置GitHub自动部署
echo.

REM 检查是否安装了git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到Git，请先安装Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/4] 正在检查Git配置...
git config --global user.name >nul 2>nul
if %errorlevel% neq 0 (
    echo 请输入您的Git用户名:
    set /p gitname=
    git config --global user.name "%gitname%"
)

git config --global user.email >nul 2>nul
if %errorlevel% neq 0 (
    echo 请输入您的Git邮箱:
    set /p gitemail=
    git config --global user.email "%gitemail%"
)

echo.
echo [2/4] 正在提交代码到GitHub...
cd /d "%~dp0"
git add .
git commit -m "更新网站配置 - 准备自动部署"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo [错误] 推送到GitHub失败
    echo 请检查网络连接和GitHub仓库权限
    pause
    exit /b 1
)

echo.
echo [3/4] 代码已成功推送到GitHub！
echo.

echo ==========================================
echo   下一步：配置Cloudflare API Token
echo ==========================================
echo.
echo 请按以下步骤操作：
echo.
echo 1. 访问 Cloudflare API Token 页面：
echo    https://dash.cloudflare.com/profile/api-tokens
echo.
echo 2. 点击"创建令牌" ^-^> "开始使用"
echo.
echo 3. 填写以下信息：
echo    - 令牌名称: GitHub Actions Deploy
echo    - 资源: 帐户
echo    - 权限: Cloudflare Pages:Edit, Account:Read
echo.
echo 4. 点击"继续" ^-^> "创建令牌"
echo.
echo 5. 复制生成的Token（重要！只显示一次）
echo.
echo ==========================================
echo   下一步：配置GitHub Secrets
echo ==========================================
echo.
echo 6. 访问GitHub仓库设置页面：
echo    https://github.com/您的用户名/perler-beads-workshop/settings/secrets/actions
echo.
echo 7. 点击"New repository secret"，添加：
echo    - Name: CLOUDFLARE_API_TOKEN
echo      Value: [刚才复制的Token]
echo    - Name: CLOUDFLARE_ACCOUNT_ID
echo      Value: 243a88b11027802a7ca7e78830726236
echo.
echo ==========================================
echo   完成！
echo ==========================================
echo.
echo 配置完成后，每次推送代码到GitHub，
echo 网站将自动部署到: https://perler-beads-workshop.pages.dev
echo.
echo 按任意键打开配置页面...
pause >nul

start https://dash.cloudflare.com/profile/api-tokens
start https://github.com

echo.
echo 浏览器已打开配置页面，请按上述步骤操作。
pause
