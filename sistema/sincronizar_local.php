<?php
header('Content-Type: application/json');
include "./admin/dist/db_config_dual.php";

// Lista de tablas a sincronizar
$tablas = ["categorias",
"configuracion_empresa",
"config_caja",
"cortes",
"page_titles",
"productos",
"subcategorias"];

$data = [];
foreach ($tablas as $tabla) {
    $result = $conn->query("SELECT * FROM $tabla");
    $data[$tabla] = $result->fetch_all(MYSQLI_ASSOC);
}

echo json_encode($data);
?>