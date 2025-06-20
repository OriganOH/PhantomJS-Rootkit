@echo off
:: PhantomJS Installer and Launcher - Batch Script
:: Version 1.0
:: Copyright (c) 2025 Origan

:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] This script must be run as administrator.
    pause
    exit /b 1
)

:: Set variables
set NODE_PATH="C:\Program Files\nodejs\node.exe"
set SCRIPT_PATH=%~dp0PhantomSetup.js
set LOG_FILE=%~dp0phantom_install.log

:: Check for Node.js installation
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    pause
    exit /b 1
)

:: Main menu
:menu
cls
echo ============================================
echo    PhantomJS Installer And Launcher
echo ============================================
echo 1. Install PhantomJS
echo 2. Launch PhantomJS
echo 3. Exit
echo ============================================
set /p choice="Choose an option (1-3): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto launch
if "%choice%"=="3" exit /b
echo Invalid choice, please try again.
pause
goto menu

:: Installation
:install
echo Starting PhantomJS installation...
%NODE_PATH% %SCRIPT_PATH% > %LOG_FILE% 2>&1
if %errorLevel% equ 0 (
    echo Installation completed successfully!
    echo Check %LOG_FILE% for details.
) else (
    echo [ERROR] Installation failed.
    echo Check %LOG_FILE% for more information.
)
pause
goto menu

:: Launch
:launch
echo Launching PhantomJS...
%NODE_PATH% %SCRIPT_PATH%
if %errorLevel% equ 0 (
    echo PhantomJS launched successfully!
) else (
    echo [ERROR] PhantomJS launch failed.
)
pause
goto menu