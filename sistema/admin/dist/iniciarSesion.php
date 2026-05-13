<?php
session_start();
include "db_config_dual.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = trim($_POST['correo'] ?? '');
    $contrasena = $_POST['contrasena'] ?? '';

    if ($correo === '' || $contrasena === '') {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
        exit;
    }

    $stmt = $conn->prepare('SELECT id, contrasena, tipo_usuario, nombre FROM usuarios WHERE correo = ?');
    $stmt->bind_param('s', $correo);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 1) {
       $stmt->bind_result($id, $hash, $tipo_usuario, $nombre); 
        $stmt->fetch();
        if (password_verify($contrasena, $hash)) {
            $_SESSION['uid'] = $id;
            $_SESSION['login'] = true;
            $_SESSION['tipo_usuario'] = $tipo_usuario;
            $_SESSION['nombre_usuario'] = $nombre;
            echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'El correo no está registrado.']);
    }
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
