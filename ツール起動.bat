@echo off
chcp 932 > nul
title 単位変換ツール 起動ランチャー

echo ========================================================
echo   単位変換ツールの起動準備を行っています...
echo ========================================================
echo.

:: 1. 実行環境の確認 (Python または Node.js)
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Python 環境を検出しました。
    echo ブラウザで http://localhost:8000 を開きます...
    start "" "http://localhost:8000"
    echo サーバーを起動しています。(終了するには Ctrl+C を押してください)
    python -m http.server 8000
    exit /b 0
)

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js 環境を検出しました。
    echo ブラウザで http://localhost:8000 を開きます...
    start "" "http://localhost:8000"
    echo サーバーを起動しています。(終了するには Ctrl+C を押してください)
    call npx -y serve@14.2.4 . -l 8000
    exit /b 0
)

echo [エラー] Python または Node.js が見つかりません。
echo 単位変換ツールのローカル実行には Python または Node.js が必要です。
echo.
pause
exit /b 1
