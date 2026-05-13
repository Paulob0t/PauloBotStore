<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
require_once "db_config_dual.php";

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos inválidos');
    }
    
    $nombre_empresa = mysqli_real_escape_string($conn, $input['nombre_empresa']);
    $direccion = mysqli_real_escape_string($conn, $input['direccion'] ?? '');
    $ciudad = mysqli_real_escape_string($conn, $input['ciudad'] ?? '');
    $estado = mysqli_real_escape_string($conn, $input['estado'] ?? '');
    $telefono = mysqli_real_escape_string($conn, $input['telefono'] ?? '');
    $rfc = mysqli_real_escape_string($conn, $input['rfc'] ?? '');
    $website = mysqli_real_escape_string($conn, $input['website'] ?? 'www.vendigbox.com');
    
    $sql = "UPDATE configuracion_empresa 
            SET nombre_empresa = '$nombre_empresa',
                direccion = '$direccion',
                ciudad = '$ciudad',
                estado = '$estado',
                telefono = '$telefono',
                rfc = '$rfc',
                website = '$website',
                fecha_actualizacion = NOW()
            WHERE id = 1";
    
    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) === 0) {
            $sql = "INSERT INTO configuracion_empresa 
                    (id, nombre_empresa, direccion, ciudad, estado, telefono, rfc, website) 
                    VALUES 
                    (1, '$nombre_empresa', '$direccion', '$ciudad', '$estado', '$telefono', '$rfc', '$website')";
            mysqli_query($conn, $sql);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Configuración guardada correctamente'
        ]);
    } else {
        throw new Exception('Error al guardar: ' . mysqli_error($conn));
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

mysqli_close($conn);
?>
