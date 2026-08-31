<?php
/**
 * Configuración BD para proyecto NUBE / Local (vendingbox.online)
 */

ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);
date_default_timezone_set('America/Mexico_City');

// Cargar variables de entorno desde .env si existe en la raíz del proyecto
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $envVars = parse_ini_file($envPath, false, INI_SCANNER_RAW);
    if (is_array($envVars)) {
        foreach ($envVars as $key => $value) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}

// Credenciales desde variables de entorno con fallback
$DB_USER = getenv('DB_USER') ?: (getenv('DB_NUBE_USER') ?: 'root');
$DB_PASS = getenv('DB_PASS') ?: (getenv('DB_NUBE_PASS') ?: '');
$DB_NAME = getenv('DB_NAME') ?: (getenv('DB_NUBE_NAME') ?: 'paulobot_vending');
$DB_PORT = (int)(getenv('DB_PORT') ?: 3306);
$DB_NUBE_HOST = getenv('DB_NUBE_HOST') ?: 'localhost';

function isCloudServerRuntime(): bool
{
    if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
        return true;
    }

    $host = strtolower($_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? '');
    if ($host !== '' && strpos($host, 'vendingbox.online') !== false) {
        return true;
    }

    return false;
}

$isOnServer = isCloudServerRuntime();
$dbHost = $isOnServer ? (getenv('DB_HOST') ?: 'localhost') : $DB_NUBE_HOST;

try {
    $conn = @new mysqli($dbHost, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);

    if ($conn->connect_error) {
        // Fallback a host remoto si falló localhost
        $fallbackHost = $DB_NUBE_HOST;
        $conn = @new mysqli($fallbackHost, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);
        if ($conn->connect_error) {
            error_log("ERROR BD NUBE ($fallbackHost): " . $conn->connect_error);
            die(json_encode([
                'error'   => 'Error de conexión a base de datos',
                'details' => 'No se pudo conectar a la base de datos.',
                'host'    => $fallbackHost,
            ]));
        }
    }

    $conn->set_charset('utf8mb4');
} catch (Exception $e) {
    try {
        $fallbackHost = $DB_NUBE_HOST;
        $conn = new mysqli($fallbackHost, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);
        $conn->set_charset('utf8mb4');
    } catch (Exception $e2) {
        error_log("ERROR BD: " . $e2->getMessage());
        die(json_encode([
            'error'   => 'Error de conexión a base de datos',
            'details' => $e2->getMessage(),
            'host'    => $DB_NUBE_HOST,
        ]));
    }
}
