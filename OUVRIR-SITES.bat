@echo off
chcp 65001 >nul
title LUXURY MAGIQUE - Lanceur de Sites
color 0E

cls
echo.
echo ============================================
echo    🚀 LUXURY MAGIQUE - LANCEMENT RAPIDE
echo ============================================
echo.
echo 📱 Chargement des sites...
echo.

:: Vérifier si Chrome existe
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else (
    set CHROME=chrome
)

:: Obtenir le chemin du dossier
set "SITE_PATH=%~dp0"
set "SITE_PATH=%SITE_PATH:\=/%"

:: Créer les URLs file://
set "CLIENT_URL=file:///%SITE_PATH%index.html"
set "ADMIN_URL=file:///%SITE_PATH%admin.html"

echo ✅ Sites trouvés !
echo.
echo 📱 OUVERTURE DU SITE CLIENT...
%CHROME% --new-window "%CLIENT_URL%"

timeout /t 2 /nobreak >nul

echo ⚙️  OUVERTURE DU DASHBOARD ADMIN...
%CHROME% --new-window "%ADMIN_URL%"

echo.
echo ============================================
echo 🎉 LES DEUX SITES SONT OUVERTS !
echo ============================================
echo.
echo 📱 Site Client: %CLIENT_URL%
echo ⚙️  Dashboard: %ADMIN_URL%
echo.
echo 💡 Si les sites ne s'ouvrent pas automatiquement:
echo    1. Allez dans: %~dp0
echo    2. Double-cliquez sur index.html
echo    3. Double-cliquez sur admin.html
echo.
pause