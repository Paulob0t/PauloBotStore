<?php

define('INCLUDED_FROM_PROCESAR_VENTA', true);

session_start();
ob_start();

include "./admin/dist/db_config_dual.php";
include "./enviar_arduino.php"; // Incluir funciones de Arduino
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_clean();
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Obtener datos del POST
$input = json_decode(file_get_contents('php://input'), true);

// Log para debugging
error_log("=== INICIO PROCESAR_VENTA ===");
error_log("Input recibido: " . print_r($input, true));
error_log("POST: " . print_r($_POST, true));
error_log("GET: " . print_r($_GET, true));

if (!$input) {
    ob_clean();
    error_log("ERROR: JSON decode failed");
    echo json_encode([
        'error' => true,
        'success' => false,
        'mensaje' => 'Datos inválidos - JSON decode failed',
        'debug' => [
            'raw_input' => file_get_contents('php://input'),
            'json_error' => json_last_error_msg()
        ]
    ]);
    exit;
}

$cart = $input['cart'] ?? [];
$metodo_pago = $input['metodo_pago'] ?? '';
$tipo_pago = $input['tipo_pago'] ?? 0; 
$tipo_tarjeta = $input['tipo_tarjeta'] ?? 0; 

error_log("Cart count: " . count($cart));
error_log("Metodo pago: " . $metodo_pago);
error_log("Tipo pago: " . $tipo_pago);

if (empty($cart) || empty($metodo_pago)) {
    ob_clean();
    error_log("ERROR: Datos faltantes - Cart: " . json_encode($cart) . ", Metodo: $metodo_pago");
    echo json_encode([
        'error' => true,
        'success' => false,
        'mensaje' => 'Faltan datos requeridos: ' . (empty($cart) ? 'carrito vacío' : 'método de pago vacío'),
        'debug' => [
            'cart_count' => count($cart),
            'metodo' => $metodo_pago,
            'tipo_pago' => $tipo_pago
        ]
    ]);
    exit;
}

if (!is_array($cart)) {
    ob_clean();
    error_log("ERROR: Cart no es un array: " . gettype($cart));
    echo json_encode([
        'error' => true,
        'success' => false,
        'mensaje' => 'El carrito debe ser un array, recibido: ' . gettype($cart)
    ]);
    exit;
}

if (!$conn) {
    ob_clean();
    error_log("ERROR: Sin conexión a BD: " . mysqli_connect_error());
    echo json_encode([
        'error' => true,
        'success' => false,
        'mensaje' => 'Error de conexión a la base de datos',
        'debug' => mysqli_connect_error()
    ]);
    exit;
}

// 🏢 OBTENER DATOS DE LA EMPRESA PARA EL TICKET
$empresa_data = [
    'nombre_empresa' => 'VENDING BOX',
    'direccion' => '',
    'ciudad' => '',
    'estado' => '',
    'telefono' => '',
    'rfc' => '',
    'website' => 'www.vendigbox.com'
];

try {
    $sql_empresa = "SELECT nombre_empresa, direccion, ciudad, estado, telefono, rfc, website 
                    FROM configuracion_empresa WHERE activo = 1 LIMIT 1";
    $result_empresa = mysqli_query($conn, $sql_empresa);
    
    if ($result_empresa && mysqli_num_rows($result_empresa) > 0) {
        $empresa_data = mysqli_fetch_assoc($result_empresa);
        mysqli_free_result($result_empresa);
    }
} catch (Exception $e) {
    error_log("⚠️ Error al obtener datos de empresa: " . $e->getMessage());
    // Continuar con datos por defecto
}

try {
    mysqli_begin_transaction($conn);
    $subtotal = 0;
    $total_descuento = 0;
    $total = 0;
    
    foreach ($cart as $item) {
        if (!isset($item['id_producto']) || !isset($item['quantity'])) {
            throw new Exception("Estructura de carrito inválida: faltan id_producto o quantity");
        }
        $id_producto = intval($item['id_producto']);
        $quantity = intval($item['quantity']);
        if ($id_producto <= 0 || $quantity <= 0) {
            throw new Exception("Valores inválidos: id_producto=$id_producto, quantity=$quantity");
        }
        
        $sql = "SELECT precio, descuento FROM productos WHERE id_producto = ? AND activo = 1";
        $stmt = mysqli_prepare($conn, $sql);
        
        if (!$stmt) {
            throw new Exception("Error al preparar consulta de producto: " . mysqli_error($conn));
        }
        
        mysqli_stmt_bind_param($stmt, "i", $id_producto);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $producto = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);
        
        if (!$producto) {
            throw new Exception("Producto no encontrado o inactivo: " . $id_producto);
        }
        
        $precio_unitario = floatval($producto['precio']);
        $descuento_producto = floatval($producto['descuento'] ?? 0);
        
        $precio_con_descuento = $precio_unitario;
        if ($descuento_producto > 0) {
            $precio_con_descuento = $precio_unitario * (1 - $descuento_producto / 100);
        }
        
        $subtotal += $precio_unitario * $quantity;
        $total_descuento += ($precio_unitario - $precio_con_descuento) * $quantity;
        $total += $precio_con_descuento * $quantity;
    }
    
    $folio = 'VENTA-' . date('Ymd-His') . '-' . rand(1000, 9999);
    $iva = $total * 0.16;
    $total_con_iva = $total + $iva;
    $subtotal_rounded = round($subtotal);
    $iva_rounded = round($iva);
    $total_descuento_rounded = round($total_descuento);
    $total_con_iva_rounded = round($total_con_iva);
    $sql_venta = "INSERT INTO ventas_comanda (
        folio, 
        id_usuario, 
        id_cliente, 
        fecha_venta, 
        subtotal, 
        iva, 
        descuento_global, 
        total, 
        metodo_pago, 
        estatus, 
        notas, 
        fecha_creacion, 
        fecha_actualizacion, 
        id_pago, 
        tipo_pago, 
        tipo_tarjeta
    ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)";
    
    $stmt_venta = mysqli_prepare($conn, $sql_venta);
    
    if (!$stmt_venta) {
        throw new Exception("Error al preparar la consulta: " . mysqli_error($conn));
    }
    $id_usuario = 1; 
    $id_cliente = 1; 
    $estatus = 1; 
    $notas = "Venta realizada desde el carrito web";
    $id_pago = ($tipo_pago == 1) ? 'CARD-' . uniqid() : 'CASH-' . uniqid();
    
    mysqli_stmt_bind_param($stmt_venta, "siiddddsissii", 
        $folio,                    // s - string
        $id_usuario,               // i - integer
        $id_cliente,               // i - integer
        $subtotal_rounded,         // d - decimal
        $iva_rounded,              // d - decimal
        $total_descuento_rounded,  // d - decimal
        $total_con_iva_rounded,    // d - decimal
        $metodo_pago,              // s - string
        $estatus,                  // i - integer
        $notas,                    // s - string
        $id_pago,                  // s - string (corregido de 'i' a 's')
        $tipo_pago,                // i - integer
        $tipo_tarjeta              // i - integer
    );
    
    if (!mysqli_stmt_execute($stmt_venta)) {
        throw new Exception("Error al insertar la venta: " . mysqli_error($conn));
    }
    
    $id_comanda = mysqli_insert_id($conn);
    mysqli_stmt_close($stmt_venta);
    
    // 🔥 REGISTRAR LA COMANDA EN EL CORTE ACTIVO
    try {
        require_once "./admin/dist/CorteCaja.class.php";
        $corteCaja = new CorteCaja($conn);
        if ($corteCaja->hayCajaActiva()) {
            $corteCaja->registrarComandaEnCorte($id_comanda);
            error_log("✅ Comanda #{$id_comanda} registrada en el corte activo");
        }
    } catch (Exception $e) {
        error_log("⚠️ Error al registrar comanda en corte: " . $e->getMessage());
    }
    
    $sql_detalle = "INSERT INTO ventas_detalle (
        id_comandC, 
        id_producto, 
        cantidad, 
        precio_unitario, 
        descuento_unitario, 
        subtotal, 
        iva_unitario, 
        total, 
        notas
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt_detalle = mysqli_prepare($conn, $sql_detalle);
    
    if (!$stmt_detalle) {
        throw new Exception("Error al preparar consulta de detalle: " . mysqli_error($conn));
    }
    
    foreach ($cart as $item) {
        $id_producto = intval($item['id_producto']);
        $quantity = intval($item['quantity']);
        $sql_producto = "SELECT precio, descuento FROM productos WHERE id_producto = ? AND activo = 1";
        $stmt_producto = mysqli_prepare($conn, $sql_producto);
        mysqli_stmt_bind_param($stmt_producto, "i", $id_producto);
        mysqli_stmt_execute($stmt_producto);
        $result_producto = mysqli_stmt_get_result($stmt_producto);
        $producto = mysqli_fetch_assoc($result_producto);
        mysqli_stmt_close($stmt_producto);
        
        if (!$producto) {
            throw new Exception("Producto no encontrado en detalle: " . $id_producto);
        }
        
        $precio_unitario = floatval($producto['precio']);
        $descuento_producto = floatval($producto['descuento'] ?? 0);
        
        $precio_con_descuento = $precio_unitario;
        $descuento_unitario = 0;
        
        if ($descuento_producto > 0) {
            $precio_con_descuento = $precio_unitario * (1 - $descuento_producto / 100);
            $descuento_unitario = $precio_unitario - $precio_con_descuento;
        }
        
        $subtotal_item = $precio_con_descuento * $quantity;
        $iva_unitario = $precio_con_descuento * 0.16; 
        $total_item = ($precio_con_descuento + $iva_unitario) * $quantity;
        $precio_unitario_rounded = round($precio_unitario);
        $descuento_unitario_rounded = round($descuento_unitario);
        $subtotal_item_rounded = round($subtotal_item);
        $iva_unitario_rounded = round($iva_unitario);
        $total_item_rounded = round($total_item);
        
        $notas_detalle = "Producto: " . $id_producto . " - Cantidad: " . $quantity;
        
        mysqli_stmt_bind_param($stmt_detalle, "iiiddddds",
            $id_comanda,                    // i - integer
            $id_producto,                   // i - integer  
            $quantity,                      // i - integer
            $precio_unitario_rounded,       // d - decimal
            $descuento_unitario_rounded,    // d - decimal
            $subtotal_item_rounded,         // d - decimal
            $iva_unitario_rounded,          // d - decimal
            $total_item_rounded,            // d - decimal
            $notas_detalle                  // s - string
        );
        
        if (!mysqli_stmt_execute($stmt_detalle)) {
            throw new Exception("Error al insertar detalle de venta: " . mysqli_error($conn));
        }
    }
    mysqli_stmt_close($stmt_detalle);
    
    // ============================================================
    // REGISTRAR DESPACHOS PARA ARDUINO
    // ============================================================
    $sql_despacho = "INSERT INTO despachos_arduino (
        id_comanda, 
        id_producto, 
        sku, 
        cantidad, 
        ubicacion, 
        id_pago, 
        estatus_despacho,
        fecha_registro,
        notas
    ) VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), ?)";
    
    $stmt_despacho = mysqli_prepare($conn, $sql_despacho);
    
    if (!$stmt_despacho) {
        throw new Exception("Error al preparar consulta de despacho: " . mysqli_error($conn));
    }
    
    $despachos_registrados = [];
    $despachos_arduino = []; // Array para enviar al Arduino
    
    foreach ($cart as $item) {
        $id_producto = intval($item['id_producto']);
        $quantity = intval($item['quantity']);
        
        // Obtener SKU y ubicación del producto
        $sql_producto_info = "SELECT sku, ubicacion, nombre_producto FROM productos WHERE id_producto = ?";
        $stmt_producto_info = mysqli_prepare($conn, $sql_producto_info);
        mysqli_stmt_bind_param($stmt_producto_info, "i", $id_producto);
        mysqli_stmt_execute($stmt_producto_info);
        $result_producto_info = mysqli_stmt_get_result($stmt_producto_info);
        $producto_info = mysqli_fetch_assoc($result_producto_info);
        mysqli_stmt_close($stmt_producto_info);
        
        if (!$producto_info) {
            throw new Exception("No se encontró información del producto: " . $id_producto);
        }
        
        $sku = $producto_info['sku'] ?? 'SKU-' . $id_producto;
        $ubicacion = $producto_info['ubicacion'];
        $nombre_producto = $producto_info['nombre_producto'];
        
        // Validar que el producto tenga ubicación asignada
        if (empty($ubicacion)) {
            throw new Exception("El producto '$nombre_producto' no tiene ubicación asignada en la máquina expendedora");
        }
        
        $notas_despacho = "Producto: $nombre_producto - Ubicación: $ubicacion";
        
        // Insertar registro de despacho en la BD
        mysqli_stmt_bind_param($stmt_despacho, "isissss",
            $id_comanda,        // i - integer
            $id_producto,       // i - integer
            $sku,              // s - string
            $quantity,         // i - integer
            $ubicacion,        // s - string
            $id_pago,          // s - string
            $notas_despacho    // s - string
        );
        
        if (!mysqli_stmt_execute($stmt_despacho)) {
            throw new Exception("Error al registrar despacho: " . mysqli_error($conn));
        }
        
        $id_despacho = mysqli_insert_id($conn);
        
        // Preparar datos para enviar al Arduino
        $despachos_arduino[] = [
            'id_despacho' => $id_despacho,
            'ubicacion' => $ubicacion,
            'cantidad' => $quantity,
            'sku' => $sku,
            'id_pago' => $id_pago,
            'id_producto' => $id_producto
        ];
        
        $despachos_registrados[] = [
            'id_despacho' => $id_despacho,
            'producto' => $nombre_producto,
            'ubicacion' => $ubicacion,
            'cantidad' => $quantity,
            'sku' => $sku
        ];
    }
    mysqli_stmt_close($stmt_despacho);
    
    // Commit de la transacción principal
    mysqli_commit($conn);
    
    // ============================================================
    // REGISTRAR VENTA EN CORTE DE CAJA (SI HAY CAJA ACTIVA)
    // ============================================================
    try {
        require_once './admin/dist/CorteCaja.class.php';
        $corteCaja = new CorteCaja($conn);
        
        // Solo registrar si hay caja activa
        if ($corteCaja->hayCajaActiva()) {
            $config = $corteCaja->getConfig();
            $id_corte_actual = $config['id_corte_actual'];
            
            // Determinar método de pago para el registro
            $metodo_pago_caja = null;
            if ($tipo_pago == 1) { // Tarjeta
                $metodo_pago_caja = 'tarjeta';
            } elseif ($metodo_pago === 'Efectivo' || $metodo_pago === 'efectivo') {
                $metodo_pago_caja = 'efectivo';
            }
            
            // Registrar el movimiento en la caja
            $corteCaja->registrarMovimiento(
                $id_corte_actual,
                'ingreso',
                'Venta Folio: ' . $folio,
                $total_con_iva_rounded,
                $metodo_pago_caja,
                null, // referencia_venta
                $id_comanda, // id_venta
                $id_usuario,
                'Venta automática - ' . count($cart) . ' productos'
            );
            
            error_log("✅ Venta registrada en corte de caja #" . $id_corte_actual);
        } else {
            error_log("⚠️ No hay caja activa - venta no registrada en corte");
        }
    } catch (Exception $e) {
        // No fallar la venta si hay error en el registro de caja
        error_log("⚠️ Error al registrar venta en corte de caja: " . $e->getMessage());
    }
    
    // ============================================================
    // ENVIAR COMANDOS AL ARDUINO
    // ============================================================
    $despachos_exitosos = [];
    $despachos_fallidos = [];
    
    foreach ($despachos_arduino as $despacho) {
        try {
            // Enviar al Arduino
            $resultado_arduino = enviarAlArduino($despacho);
            
            // Actualizar estado del despacho
            $nuevo_estatus = $resultado_arduino['success'] ? 1 : 3; // 1=Enviado, 3=Error
            $respuesta_json = json_encode($resultado_arduino['respuesta_arduino'] ?? []);
            
            $sql_update = "UPDATE despachos_arduino 
                          SET estatus_despacho = ?, 
                              fecha_enviado = NOW(), 
                              respuesta_arduino = ?,
                              intentos_envio = intentos_envio + 1
                          WHERE id_despacho = ?";
            
            $stmt_update = mysqli_prepare($conn, $sql_update);
            mysqli_stmt_bind_param($stmt_update, "isi", 
                $nuevo_estatus, 
                $respuesta_json, 
                $despacho['id_despacho']
            );
            mysqli_stmt_execute($stmt_update);
            mysqli_stmt_close($stmt_update);
            
            if ($resultado_arduino['success']) {
                $despachos_exitosos[] = $despacho['ubicacion'];
            } else {
                $despachos_fallidos[] = [
                    'ubicacion' => $despacho['ubicacion'],
                    'error' => $resultado_arduino['mensaje']
                ];
            }
            
        } catch (Exception $e) {
            error_log("Error al enviar despacho al Arduino: " . $e->getMessage());
            $despachos_fallidos[] = [
                'ubicacion' => $despacho['ubicacion'],
                'error' => $e->getMessage()
            ];
        }
    }
    
    error_log("Venta procesada exitosamente - Folio: $folio, Total: $total_con_iva_rounded");
    error_log("Despachos enviados al Arduino: " . count($despachos_exitosos) . " exitosos, " . count($despachos_fallidos) . " fallidos");
    
    // 🖨️ Preparar datos del ticket para impresión
    $productos_ticket = [];
    foreach ($cart as $item) {
        $id_producto = intval($item['id_producto']);
        $quantity = intval($item['quantity']);
        
        $sql_prod = "SELECT nombre_producto, precio, descuento FROM productos WHERE id_producto = ?";
        $stmt_prod = mysqli_prepare($conn, $sql_prod);
        mysqli_stmt_bind_param($stmt_prod, "i", $id_producto);
        mysqli_stmt_execute($stmt_prod);
        $result_prod = mysqli_stmt_get_result($stmt_prod);
        $prod_data = mysqli_fetch_assoc($result_prod);
        mysqli_stmt_close($stmt_prod);
        
        if ($prod_data) {
            $productos_ticket[] = [
                'nombre' => $prod_data['nombre_producto'],
                'cantidad' => $quantity,
                'precio' => floatval($prod_data['precio']),
                'descuento' => floatval($prod_data['descuento'] ?? 0)
            ];
        }
    }
    
    // Guardar datos en sesión para la página de confirmación
    $_SESSION['ultimo_folio'] = $folio;
    $_SESSION['ultimo_total'] = $total_con_iva_rounded;
    $_SESSION['ultimo_metodo'] = $metodo_pago;
    $_SESSION['ultimos_despachos'] = $despachos_registrados;
    
    ob_clean();
    echo json_encode([
        'success' => true,
        'mensaje' => 'Venta procesada exitosamente',
        'folio' => $folio,
        'id_comanda' => $id_comanda,
        'total' => $total_con_iva_rounded,
        'metodo_pago' => $metodo_pago,
        'redirect' => 'pago_aprobado.php',
        'despachos' => [
            'registrados' => $despachos_registrados,
            'enviados_arduino' => count($despachos_exitosos),
            'fallidos' => count($despachos_fallidos),
            'detalles_fallidos' => $despachos_fallidos
        ],
        // 🖨️ Datos para el ticket
        'ticket_data' => [
            'folio' => $folio,
            'fecha' => date('d/m/Y H:i:s'),
            'cajero' => 'Sistema',
            'productos' => $productos_ticket,
            'subtotal' => $subtotal_rounded,
            'descuento' => $total_descuento_rounded,
            'iva' => $iva_rounded,
            'total' => $total_con_iva_rounded,
            'metodo_pago' => $metodo_pago,
            // 🏢 Datos de la empresa
            'empresa' => [
                'nombre' => $empresa_data['nombre_empresa'],
                'direccion' => $empresa_data['direccion'],
                'ciudad' => $empresa_data['ciudad'],
                'estado' => $empresa_data['estado'],
                'telefono' => $empresa_data['telefono'],
                'rfc' => $empresa_data['rfc'],
                'website' => $empresa_data['website']
            ]
        ]
    ]);
    
} catch (Exception $e) {
    mysqli_rollback($conn);
    ob_clean();
    
    // Guardar error en sesión para la página de rechazo
    $_SESSION['error_pago'] = $e->getMessage();
    $_SESSION['metodo_pago_fallido'] = $metodo_pago ?? 'N/A';
    
    echo json_encode([
        'error' => true,
        'success' => false,
        'mensaje' => $e->getMessage(),
        'redirect' => 'pago_rechazado.php',
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]
    ]);
} catch (Error $e) {
    ob_clean();
    
    // Guardar error en sesión para la página de rechazo
    $_SESSION['error_pago'] = 'Error fatal: ' . $e->getMessage();
    $_SESSION['metodo_pago_fallido'] = $metodo_pago ?? 'N/A';
    
    echo json_encode([
        'error' => true,
        'success' => false,
        'mensaje' => 'Error fatal: ' . $e->getMessage(),
        'redirect' => 'pago_rechazado.php',
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}

mysqli_close($conn);
?>

