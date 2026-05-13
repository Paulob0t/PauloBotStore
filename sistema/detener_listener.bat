@echo off
cls
echo ========================================
echo  DETENER LISTENER DEL MONEDERO
echo ========================================
echo.

echo Buscando procesos PHP del listener...
echo.

REM Buscar y matar todos los procesos PHP relacionados con monedero
tasklist /FI "IMAGENAME eq php.exe" 2>nul | find /I "php.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo Procesos PHP encontrados:
    tasklist /FI "IMAGENAME eq php.exe"
    echo.
    echo Deteniendo listener...
    taskkill /F /IM php.exe /T >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Listener detenido exitosamente
    ) else (
        echo [INFO] No se pudo detener o no habia listener corriendo
    )
) else (
    echo [INFO] No hay procesos PHP corriendo
)

echo.
echo ========================================
pause
