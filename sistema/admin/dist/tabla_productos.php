<?php

include "db_config_dual.php";
// Registrar errores en un archivo de log
ini_set("log_errors", 1);
ini_set("error_log", "php_errors.log");


$sql = "SELECT p.*, c.nombre_categoria, s.nombre_subcategoria FROM productos p
        LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        LEFT JOIN subcategorias s ON p.id_subcategoria = s.id_subcategoria";
$result = $conn->query($sql);
$productos = [];
if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
  }
}
// Obtener categorías
$categorias = [];
$resCat = $conn->query("SELECT * FROM categorias");
if ($resCat && $resCat->num_rows > 0) {
  while ($row = $resCat->fetch_assoc()) {
    $categorias[] = $row;
  }
}
// Obtener subcategorías
$subcategorias = [];
$resSub = $conn->query("SELECT * FROM subcategorias");
if ($resSub && $resSub->num_rows > 0) {
  while ($row = $resSub->fetch_assoc()) {
    $subcategorias[] = $row;
  }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Tabla Producto</title>
  <!-- plugins:css -->
  <link rel="stylesheet" href="assets/vendors/feather/feather.css">
  <link rel="stylesheet" href="assets/vendors/ti-icons/css/themify-icons.css">
  <link rel="stylesheet" href="assets/vendors/css/vendor.bundle.base.css">
  <link rel="stylesheet" href="assets/vendors/font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="assets/vendors/mdi/css/materialdesignicons.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
  
  <!-- DataTables CSS desde CDN -->
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- endinject -->
  <!-- inject:css -->
  <link rel="stylesheet" href="assets/css/style.css">
  <!-- endinject -->
  <link rel="shortcut icon" href="assets/images/favicon.png" />
  
  <style>
    .card-header {
      font-weight: bold;
      font-size: 1.1rem;
    }
    
    .metric-value {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .metric-label {
      color: #666;
      font-size: 0.9rem;
    }

    /* Estilos para DataTables - limpiar bordes duplicados */
    .dataTables_wrapper .dataTables_paginate {
      float: right;
      text-align: right;
      padding-top: 0.25em;
    }

    

    .dataTables_wrapper .dataTables_length,
    .dataTables_wrapper .dataTables_filter,
    .dataTables_wrapper .dataTables_info,
    .dataTables_wrapper .dataTables_paginate {
      color: #333;
    }

    /* Quitar borde de la tabla responsive */
    .table-responsive {
      min-height: 400px;
      border: none !important;
    }

    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 8px;
      border: 0px solid #ddd;
    }

    .stock-badge {
      font-weight: bold;
    }

    .price-display {
      font-weight: bold;
      color: #28a745;
    }

    .discount-price {
      color: #dc3545;
      text-decoration: line-through;
      font-size: 0.9em;
    }
  </style>
</head>

<body>
  <div class="container-scroller">
    <?php include "navbar.php"; ?>
    <div class="container-fluid page-body-wrapper">
      <?php include "menu.php"; ?>
      <div class="main-panel">
        <div class="content-wrapper">
          
          <!-- Resumen de Productos -->
          <div class="row">
            <div class="col-md-3 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <p class="card-title">Total Productos</p>
                    <i class="mdi mdi-package-variant icon-lg" style="color: #3498db;"></i>
                  </div>
                  <p class="font-weight-500"><?php echo count($productos); ?></p>
                </div>
              </div>
            </div>
            <div class="col-md-3 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <p class="card-title">Stock Total</p>
                    <i class="mdi mdi-warehouse icon-lg" style="color: #27ae60;"></i>
                  </div>
                  <p class="font-weight-500"><?php 
                    $totalStock = array_sum(array_column($productos, 'stock'));
                    echo number_format($totalStock); 
                  ?></p>
                </div>
              </div>
            </div>
            <div class="col-md-3 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <p class="card-title">Productos Activos</p>
                    <i class="mdi mdi-check-circle-outline icon-lg" style="color: #f39c12;"></i>
                  </div>
                  <p class="font-weight-500"><?php 
                    $productosActivos = array_filter($productos, function($p) { return $p['activo'] == 1; });
                    echo count($productosActivos);
                  ?></p>
                </div>
              </div>
            </div>
            <div class="col-md-3 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <p class="card-title">Categorías</p>
                    <i class="mdi mdi-tag-multiple-outline icon-lg" style="color: #9b59b6;"></i>
                  </div>
                  <p class="font-weight-500"><?php echo count($categorias); ?></p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Tabla de Productos -->
          <div class="row">
            <div class="col-md-12 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <p class="card-title mb-0">Gestión de Productos</p>
                    <div>
                      <small class="text-muted"><?php echo count($productos); ?> productos registrados</small>
                      <a href="formulario_producto.php" class="btn btn-primary btn-sm ms-2">
                        <i class="mdi mdi-plus"></i> Nuevo Producto
                      </a>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-striped table-borderless" id="productosTable">
                      <thead>
                        <tr>
                          <th>Imagen</th>
                          <th>Producto</th>
                          <th>Categoría</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Ubicación</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <?php if (empty($productos)): ?>
                          <tr>
                            <td colspan="8" class="text-center">No hay productos registrados</td>
                          </tr>
                        <?php else: ?>
                          <?php foreach ($productos as $producto): ?>
                            <tr data-producto='<?php echo json_encode($producto, JSON_HEX_APOS | JSON_HEX_QUOT); ?>'>
                              <td>
                                <?php if (!empty($producto['imagen_principal'])): ?>
                                  <img src="<?php echo htmlspecialchars($producto['imagen_principal']); ?>" 
                                       alt="<?php echo htmlspecialchars($producto['nombre_producto']); ?>" 
                                       class="product-image">
                                <?php else: ?>
                                  <div class="product-image d-flex align-items-center justify-content-center bg-light">
                                    <i class="mdi mdi-image-outline text-muted"></i>
                                  </div>
                                <?php endif; ?>
                              </td>
                              <td>
                                <div>
                                  <strong><?php echo htmlspecialchars($producto['nombre_producto'] ?? ''); ?></strong>
                                  <?php if (!empty($producto['sku'])): ?>
                                    <br><small class="text-muted">SKU: <?php echo htmlspecialchars($producto['sku']); ?></small>
                                  <?php endif; ?>
                                </div>
                              </td>
                              <td>
                                <span class="badge badge-info">
                                  <?php echo htmlspecialchars($producto['nombre_categoria'] ?? 'Sin categoría'); ?>
                                </span>
                                <?php if (!empty($producto['nombre_subcategoria'])): ?>
                                  <br><small class="text-muted"><?php echo htmlspecialchars($producto['nombre_subcategoria']); ?></small>
                                <?php endif; ?>
                              </td>
                              <td>
                                <div class="price-display">
                                  $<?php echo number_format($producto['precio'] ?? 0, 2); ?>
                                </div>
                                <?php if (!empty($producto['descuento']) && $producto['descuento'] > 0): ?>
                                  <small class="discount-price">
                                    <?php echo $producto['descuento']; ?>% desc.
                                  </small>
                                <?php endif; ?>
                              </td>
                              <td>
                                <?php 
                                $stock = $producto['stock'] ?? 0;
                                $badgeClass = $stock > 10 ? 'success' : ($stock > 0 ? 'warning' : 'danger');
                                ?>
                                <span class="badge badge-<?php echo $badgeClass; ?> stock-badge">
                                  <?php echo $stock; ?> unidades
                                </span>
                              </td>
                              <td>
                                <?php if (!empty($producto['ubicacion'])): ?>
                                  <span class="badge badge-primary" style="font-size: 1rem; font-weight: bold; letter-spacing: 1px; padding: 0.5rem 0.8rem;">
                                    <i class="mdi mdi-map-marker"></i> <?php echo htmlspecialchars($producto['ubicacion']); ?>
                                  </span>
                                <?php else: ?>
                                  <span class="badge badge-secondary">
                                    <i class="mdi mdi-map-marker-off"></i> Sin ubicación
                                  </span>
                                <?php endif; ?>
                              </td>
                              <td>
                                <?php if ($producto['activo'] == 1): ?>
                                  <span class="badge badge-success">Activo</span>
                                <?php else: ?>
                                  <span class="badge badge-secondary">Inactivo</span>
                                <?php endif; ?>
                                
                                <?php if ($producto['destacado'] == 1): ?>
                                  <br><span class="badge badge-warning">Destacado</span>
                                <?php endif; ?>
                              </td>
                              <td>
                                <button class="btn btn-sm btn-outline-primary btn-editar" data-id="<?php echo $producto['id_producto']; ?>">
                                  <i class="mdi mdi-pencil-outline"></i> Editar
                                </button>
                              </td>
                            </tr>
                          <?php endforeach; ?>
                        <?php endif; ?>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        <!-- Modal Editar Producto (Bootstrap Modal) -->
        <div class="modal fade" id="modalEditarProducto" tabindex="-1" aria-labelledby="modalEditarProductoLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="modalEditarProductoLabel">
                  <i class="mdi mdi-pencil-outline"></i> Editar Producto
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="formEditarProducto" enctype="multipart/form-data">
                  <input type="hidden" name="id_producto" id="edit_id_producto">
                  
                  <div class="row">
                    <!-- Columna de Imágenes -->
                    <div class="col-md-6">
                      <h6 class="mb-3" style="color: var(--primary-color);"><i class="mdi mdi-image-multiple-outline"></i> Imágenes del Producto</h6>
                      
                      <div class="mb-3">
                        <label class="form-label">Imagen Principal</label>
                        <div class="image-preview-container">
                          <img id="edit_imagen_principal_actual" src="" alt="Imagen principal" 
                               class="img-preview" style="display: none;">
                          <div class="no-image-placeholder" id="edit_no_image_principal">
                            <i class="mdi mdi-image-outline"></i>
                            <span>Sin imagen</span>
                          </div>
                        </div>
                        <input type="file" class="form-control mt-2" name="imagen_principal" id="edit_imagen_principal" accept="image/*">
                      </div>
                      
                      <div class="mb-3">
                        <label class="form-label">Imagen Secundaria 1</label>
                        <div class="image-preview-container">
                          <img id="edit_imagen_secundaria_1_actual" src="" alt="Imagen secundaria 1" 
                               class="img-preview" style="display: none;">
                          <div class="no-image-placeholder" id="edit_no_image_secundaria_1">
                            <i class="mdi mdi-image-outline"></i>
                            <span>Sin imagen</span>
                          </div>
                        </div>
                        <input type="file" class="form-control mt-2" name="imagen_secundaria_1" id="edit_imagen_secundaria_1" accept="image/*">
                      </div>
                      
                      <div class="mb-3">
                        <label class="form-label">Imagen Secundaria 2</label>
                        <div class="image-preview-container">
                          <img id="edit_imagen_secundaria_2_actual" src="" alt="Imagen secundaria 2" 
                               class="img-preview" style="display: none;">
                          <div class="no-image-placeholder" id="edit_no_image_secundaria_2">
                            <i class="mdi mdi-image-outline"></i>
                            <span>Sin imagen</span>
                          </div>
                        </div>
                        <input type="file" class="form-control mt-2" name="imagen_secundaria_2" id="edit_imagen_secundaria_2" accept="image/*">
                      </div>
                      
                      <div class="mb-3">
                        <label class="form-label">Imagen Secundaria 3</label>
                        <div class="image-preview-container">
                          <img id="edit_imagen_secundaria_3_actual" src="" alt="Imagen secundaria 3" 
                               class="img-preview" style="display: none;">
                          <div class="no-image-placeholder" id="edit_no_image_secundaria_3">
                            <i class="mdi mdi-image-outline"></i>
                            <span>Sin imagen</span>
                          </div>
                        </div>
                        <input type="file" class="form-control mt-2" name="imagen_secundaria_3" id="edit_imagen_secundaria_3" accept="image/*">
                      </div>
                    </div>
                    
                    <!-- Columna de Datos -->
                    <div class="col-md-6">
                      <h6 class="mb-3" style="color: var(--primary-color);"><i class="mdi mdi-information-outline"></i> Información del Producto</h6>
                      
                      <div class="mb-3">
                        <label class="form-label">Nombre del Producto</label>
                        <input type="text" class="form-control" name="nombre_producto" id="edit_nombre_producto" required>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">Categoría</label>
                            <select class="form-control" name="id_categoria" id="edit_id_categoria" required>
                              <option value="">Selecciona una categoría</option>
                              <?php foreach ($categorias as $cat): ?>
                                <option value="<?php echo $cat['id_categoria']; ?>">
                                  <?php echo htmlspecialchars($cat['nombre_categoria']); ?>
                                </option>
                              <?php endforeach; ?>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">Subcategoría</label>
                            <select class="form-control" name="id_subcategoria" id="edit_id_subcategoria">
                              <option value="">Selecciona una subcategoría</option>
                              <?php foreach ($subcategorias as $sub): ?>
                                <option value="<?php echo $sub['id_subcategoria']; ?>" data-categoria="<?php echo $sub['id_categoria']; ?>">
                                  <?php echo htmlspecialchars($sub['nombre_subcategoria']); ?>
                                </option>
                              <?php endforeach; ?>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">Precio</label>
                            <div class="input-group">
                              <span class="input-group-text">$</span>
                              <input type="number" class="form-control" name="precio" id="edit_precio" step="0.01" min="0" required>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">Descuento (%)</label>
                            <input type="number" class="form-control" name="descuento" id="edit_descuento" step="0.01" min="0" max="100">
                          </div>
                        </div>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">SKU</label>
                            <input type="text" class="form-control" name="sku" id="edit_sku">
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">Stock</label>
                            <input type="number" class="form-control" name="stock" id="edit_stock" min="0" required>
                          </div>
                        </div>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label class="form-label">
                              <i class="mdi mdi-map-marker"></i> Ubicación en Máquina <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control text-uppercase" name="ubicacion" id="edit_ubicacion" 
                                   placeholder="Ej: A1, B2, C3" maxlength="2" pattern="[A-Za-z][0-9]" 
                                   style="font-weight: bold; font-size: 1.1rem; text-align: center; letter-spacing: 2px;" required>
                            <small class="form-text text-muted">
                              <i class="mdi mdi-information-outline"></i> Formato: Letra + Número (A1, B2, etc.)
                            </small>
                          </div>
                        </div>
                      </div>
                      
                      <div class="mb-3">
                        <label class="form-label">Descripción</label>
                        <textarea class="form-control" name="descripcion" id="edit_descripcion" rows="4"></textarea>
                      </div>
                      
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" name="activo" id="edit_activo" value="1">
                              <label class="form-check-label" for="edit_activo">
                                Producto Activo
                              </label>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" name="destacado" id="edit_destacado" value="1">
                              <label class="form-check-label" for="edit_destacado">
                                Producto Destacado
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="mb-3" id="edit_grupoOrdenDestacado" style="display: none;">
                        <label class="form-label">Orden de destacado <span class="text-danger">*</span></label>
                        <input type="number" class="form-control" name="orden_destacado" id="edit_orden_destacado"
                          placeholder="Número de orden (1, 2, 3...)" min="1" step="1" style="max-width: 150px;">
                        <small class="form-text text-muted">
                          <i class="mdi mdi-information-outline"></i> Define la posición en la que aparecerá este producto destacado
                        </small>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  <i class="mdi mdi-close"></i> Cancelar
                </button>
                <button type="submit" form="formEditarProducto" class="btn btn-success">
                  <i class="mdi mdi-content-save-outline"></i> Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- plugins:js -->
  <script src="assets/vendors/js/vendor.bundle.base.js"></script>
  <!-- endinject -->
  <!-- inject:js -->
  <script src="assets/js/off-canvas.js"></script>
  <script src="assets/js/template.js"></script>
  <script src="assets/js/settings.js"></script>
  <script src="assets/js/todolist.js"></script>
  <!-- endinject -->
  <!-- Custom js for this page-->
  <script src="assets/js/file-upload.js"></script>
  <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  
  <!-- Script principal de tabla de productos -->
  <script>
    // Variable global con datos de productos
    const productos = <?php echo json_encode($productos, JSON_UNESCAPED_UNICODE); ?>;
  </script>
  <script src="modulos_JS/tabla_productos.js"></script>
  
  <!-- CSS personalizado para diseño profesional minimalista -->
  <style>
    /* Paleta de colores profesional */
    :root {
      --primary-color: #2c3e50;
      --secondary-color: #34495e;
      --accent-color: #3498db;
      --success-color: #27ae60;
      --warning-color: #f39c12;
      --danger-color: #e74c3c;
      --light-gray: #ecf0f1;
      --medium-gray: #95a5a6;
      --dark-gray: #7f8c8d;
      --text-primary: #2c3e50;
      --text-secondary: #7f8c8d;
    }

    /* Estilos para tarjetas de resumen */
    .card {
      border: 1px solid #e8ecef;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      border-radius: 4px;
      background: white;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .icon-lg {
      font-size: 1.8rem;
      /* Color se define inline para cada icono */
    }
    
    .font-weight-500 {
      font-weight: 600;
      font-size: 1.4rem;
      margin-bottom: 0;
      color: var(--text-primary);
    }
    
    .card-title {
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
  
    /* Estilos para imágenes de productos */
    .product-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
      border: 0px solid #e8ecef;
    }
    
    .product-image.bg-light {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--light-gray) !important;
      color: var(--medium-gray);
    }
      
    /* Estilos para precios */
    .price-display {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1rem;
    }
    
    .discount-price {
      color: var(--danger-color);
      font-weight: 500;
      font-size: 0.8rem;
    }
    
    .stock-badge {
      font-weight: 500;
    }
    
    /* Estilos para botones */
    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      border-radius: 3px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .btn-outline-primary {
      border-color: var(--accent-color);
      color: var(--accent-color);
      background: transparent;
    }
    
    .btn-outline-primary:hover {
      background-color: var(--accent-color);
      border-color: var(--accent-color);
      color: white;
    }
    
    .btn-primary {
      background-color: var(--accent-color);
      border-color: var(--accent-color);
      color: white;
    }
    
    .btn-primary:hover {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
    
    /* Estilos para el modal */
    .modal-xl {
      max-width: 1200px;
    }
    
    .modal-content {
      border: none;
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .modal-header {
      background-color: var(--light-gray);
      border-bottom: 1px solid #dee2e6;
      padding: 1.2rem 1.5rem;
    }
    
    .modal-title {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .modal-footer {
      background-color: #fafbfc;
      border-top: 1px solid #dee2e6;
      padding: 1rem 1.5rem;
    }
    
    .image-preview-container {
      position: relative;
      width: 100%;
      height: 450px;
      border: 2px dashed #dee2e6;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fafbfc;
      overflow: hidden;
    }
    
    .img-preview {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 3px;
      display: block;
    }
    
    .no-image-placeholder {
      text-align: center;
      color: var(--medium-gray);
    }
    
    .no-image-placeholder i {
      font-size: 1.8rem;
      display: block;
      margin-bottom: 0.5rem;
    }
    
    /* Formularios */
    .form-label {
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 0.5rem;
    }
    
    .form-control {
      border: 1px solid #dee2e6;
      border-radius: 3px;
      padding: 0.6rem 0.8rem;
      font-size: 0.9rem;
      color: var(--text-primary);
    }
    
    .form-control:focus {
      border-color: var(--accent-color);
      box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.15);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .table-responsive {
        font-size: 0.8rem;
      }
      
      .product-image {
        width: 50px;
        height: 50px;
      }
      
      .btn-sm {
        padding: 0.3rem 0.6rem;
        font-size: 0.7rem;
      }
    }
    
   
  </style>


</body>

</html>
