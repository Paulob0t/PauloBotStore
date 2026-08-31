<?php

namespace App\Core;

use mysqli;

class Database
{
    private static ?mysqli $instance = null;

    public static function getConnection(): mysqli
    {
        if (self::$instance === null) {
            // Cargar .env si existe en la raíz
            $envPath = __DIR__ . '/../../.env';
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

            $configPath = __DIR__ . '/../../admin/db_config_dual.php';
            if (file_exists($configPath)) {
                require_once $configPath;
                /** @var mysqli $conn */
                if (isset($conn) && $conn instanceof mysqli && !$conn->connect_error) {
                    self::$instance = $conn;
                    return self::$instance;
                }
            }

            // Fallback manual connection si no existe db_config_dual.php
            $host = getenv('DB_HOST') ?: 'localhost';
            $user = getenv('DB_USER') ?: 'root';
            $pass = getenv('DB_PASS') ?: '';
            $name = getenv('DB_NAME') ?: 'paulobot_vending';
            $port = (int)(getenv('DB_PORT') ?: 3306);

            $conn = @new mysqli($host, $user, $pass, $name, $port);
            if ($conn->connect_error) {
                $remoteHost = getenv('DB_NUBE_HOST') ?: 'localhost';
                $conn = new mysqli($remoteHost, $user, $pass, $name, $port);
            }
            self::$instance = $conn;
        }

        return self::$instance;
    }
}
