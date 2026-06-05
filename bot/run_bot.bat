@echo off
title ЛАЗЗАТ БЕШ БАРМАК БОТ
echo 🏔 ЛАЗЗАТ БЕШ БАРМАК БОТУ ИШКЕ КИРҮҮДӨ...
echo ------------------------------------------------
cd /d "%~dp0"
if not exist node_modules (
    echo ⏳ Модулдар табылган жок. npm install аткарылууда...
    call npm install
)
:loop
echo 🚀 Бот ишке кирди: %date% %time%
node bot.js
echo ⚠️ Бот токтоп калды. 5 секунддан кийин кайра күйөт...
timeout /t 5
goto loop
