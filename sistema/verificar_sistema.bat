@echo off
cls
echo ========================================
echo  VERIFICADOR DE ESTADO
echo ========================================
echo.

echo [1/5] Verificando puerto COM5...
mode COM5: 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Puerto COM5 existe
) else (
    echo [ERROR] Puerto COM5 no encontrado
    echo.
    echo Puertos disponibles:
    powershell "Get-WMIObject Win32_SerialPort | Select-Object DeviceID, Name"
    goto :end
)

echo.
echo [2/5] Verificando PHP...
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] PHP encontrado
    php -v | findstr PHP
) else (
    echo [ERROR] PHP no encontrado
    echo Intentando con XAMPP...
    if exist "C:\xampp\php\php.exe" (
        echo [OK] PHP de XAMPP encontrado
    ) else (
        echo [ERROR] No se encuentra PHP
    )
)

echo.
echo [3/5] Verificando archivos...
if exist "monedero_listener.php" (
    echo [OK] monedero_listener.php existe
) else (
    echo [ERROR] monedero_listener.php NO existe
)

if exist "monedero_api.php" (
    echo [OK] monedero_api.php existe
) else (
    echo [ERROR] monedero_api.php NO existe
)

if exist "cart.php" (
    echo [OK] cart.php existe
) else (
    echo [ERROR] cart.php NO existe
)

echo.
echo [4/5] Verificando logs...
if exist "admin\dist\logs\saldo_actual.json" (
    echo [OK] Archivo de saldo existe
    type admin\dist\logs\saldo_actual.json
) else (
    echo [INFO] No hay saldo registrado aun
)

echo.
echo [5/5] Probando API...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost/vendigbox.c-onlineweb.net/monedero_api.php?action=get_saldo' -UseBasicParsing; Write-Host '[OK] API funciona'; Write-Host $response.Content } catch { Write-Host '[ERROR] API no responde:' $_; }"

:end
echo.
echo ========================================
echo  Diagnostico completado
echo ========================================
echo.
pause
