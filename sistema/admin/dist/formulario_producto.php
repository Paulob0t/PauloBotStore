<?php

ini_set("log_errors", 1);
ini_set("error_log", "php_errors.log");
?>
<!DOCTYPE html>
<html lang="en">

<head>

  <!-- Custom CSS -->
  <link rel="stylesheet" href="styles_css/formulario_producto.css">
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Formulario Producto</title>
  <!-- plugins:css -->
  <link rel="stylesheet" href="assets/vendors/feather/feather.css">
  <link rel="stylesheet" href="assets/vendors/ti-icons/css/themify-icons.css">
  <link rel="stylesheet" href="assets/vendors/css/vendor.bundle.base.css">
  <link rel="stylesheet" href="assets/vendors/font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="assets/vendors/mdi/css/materialdesignicons.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- endinject -->
  <!-- inject:css -->
  <link rel="stylesheet" href="assets/css/style.css">
  <!-- endinject -->
  <link rel="shortcut icon" href="assets/images/favicon.png" />
  <!-- SweetAlert2 -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
  <div class="container-scroller">
    <?php include "navbar.php"; ?>
    <div class="container-fluid page-body-wrapper">
      <?php include "menu.php"; ?>
      <div class="main-panel">
        <div class="content-wrapper">
          <div class="row">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Formulario Producto</h4>
                <form class="forms-sample" method="post" enctype="multipart/form-data">
                  <input type="hidden" name="user_id" id="user_id" required />
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="nombreProducto">Nombre del producto <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="nombreProducto" name="nombre_producto"
                          placeholder="Nombre" required>
                      </div>
                      <div class="form-group">
                        <label for="descripcionProducto">Descripción del producto <span
                            class="text-danger">*</span></label>
                        <textarea class="form-control" id="descripcionProducto" name="descripcion" rows="3"
                          placeholder="Descripción" required></textarea>
                      </div>
                      <div class="form-group">
                        <label for="precioProducto">Precio <span class="text-danger">*</span></label>
                        <input type="number" class="form-control" id="precioProducto" name="precio" placeholder="Precio"
                          step="0.01" required>
                      </div>
                      <!-- Checkbox de descuento (columna izquierda) -->
                      <div id="checkDescuento-container" class="form-check-custom">
                        <input type="checkbox" class="form-check-input" id="checkDescuento" name="usa_descuento">
                        <label class="form-check-label" for="checkDescuento">¿Agregar precio de descuento?</label>
                      </div>


                      <div class="form-group" id="grupoPrecioDescuento" style="display: none;">
                        <label for="precioDescuento">Precio de descuento</label>
                        <input type="number" class="form-control" id="precioDescuento" name="precio_descuento"
                          placeholder="Precio con descuento" step="0.01">   
                      </div>
                      <div class="form-group">
                        <label for="stockDisponible">Stock disponible <span class="text-danger">*</span></label>
                        <input type="number" class="form-control" id="stockDisponible" name="stock"
                          placeholder="Unidades disponibles" required>
                      </div>
                      <div class="form-group">
                        <label for="sku">SKU (código interno)</label>
                        <input type="text" class="form-control" id="sku" name="sku" placeholder="SKU">
                      </div>
                      <div class="form-group">
                        <label for="ubicacion">Ubicación en máquina <span class="text-danger">*</span></label>
                        <input type="text" class="form-control text-uppercase" id="ubicacion" name="ubicacion" 
                          placeholder="Ej: A1, B2, C3" maxlength="2" pattern="[A-Za-z][0-9]" 
                          style="max-width: 120px;" required>
                        <small class="form-text text-muted">
                          <i class="fa fa-info-circle"></i> Formato: Letra seguida de número (A1, B2, etc.)
                        </small>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="categoriaProducto">Categoría <span class="text-danger">*</span></label>
                        <div class="d-flex align-items-center mb-2" style="gap: 10px;">
                          <select class="form-control me-2" id="categoriaProducto" name="id_categoria" required
                            style="max-width: 200px;">
                            <option value="" disabled selected>Selecciona una categoría</option>
                          </select>
                          <select class="form-control" id="subcategoriaProducto" name="id_subcategoria"
                            style="max-width: 200px; display:none;">
                            <option value="" disabled selected>Selecciona una subcategoría</option>
                          </select>
                          <button type="button" class="btn btn-success btn-sm" id="btnAddCategoria">Agregar
                            categoría</button>
                          <button type="button" class="btn btn-secondary btn-sm ms-2" id="btnAddSubcatModal"
                            style="display:none;">Agregar subcategoría</button>
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Imagen principal <span class="text-danger">*</span></label>
                        <input type="file" name="img[]" class="file-upload-default" id="imgInput" required
                          accept="image/*">
                        <div class="input-group col-xs-12 d-flex align-items-center">
                          <input type="text" class="form-control file-upload-info" disabled placeholder="Subir imagen">
                          <span class="input-group-append ms-2">
                            <button class="file-upload-browse btn btn-primary" type="button">Subir</button>
                          </span>
                        </div>
                        <div class="mt-2 text-center">
                          <img id="imgPreview" src="#" alt="Previsualización"
                            style="max-width: 220px; max-height: 220px; border: 1px solid #ddd; border-radius: 8px; display: none; margin: 0 auto;" />
                        </div>
                        <input type="hidden" name="imagen_principal" id="imgBase64">
                      </div>
                      <div class="form-group">
                        <label>Imagen secundaria 1</label>
                        <input type="file" name="img_secundaria_1" class="form-control" accept="image/*">
                        <input type="hidden" name="img_secundaria_1_base64" id="imgSecundaria1Base64">
                        <!-- Previsualización -->
                        <div class="mt-2 text-center">
                          <img id="imgSecundariaPreview1" src="#" alt="Previsualización secundaria 1"
                            style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; border-radius: 8px; display: none; margin: 0 auto;" />
                        </div>
                      </div>

                      <div class="form-group">
                        <label>Imagen secundaria 2</label>
                        <input type="file" name="img_secundaria_2" class="form-control" accept="image/*">
                        <input type="hidden" name="img_secundaria_2_base64" id="imgSecundaria2Base64">
                        <!-- Previsualización -->
                        <div class="mt-2 text-center">
                          <img id="imgSecundariaPreview2" src="#" alt="Previsualización secundaria 2"
                            style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; border-radius: 8px; display: none; margin: 0 auto;" />
                        </div>
                      </div>

                      <div class="form-group">
                        <label>Imagen secundaria 3</label>
                        <input type="file" name="img_secundaria_3" class="form-control" accept="image/*">
                        <input type="hidden" name="img_secundaria_3_base64" id="imgSecundaria3Base64">
                        <!-- Previsualización -->
                        <div class="mt-2 text-center">
                          <img id="imgSecundariaPreview3" src="#" alt="Previsualización secundaria 3"
                            style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; border-radius: 8px; display: none; margin: 0 auto;" />
                        </div>
                      </div>
                      <!-- Checkboxes de la columna derecha -->
                      <div class="form-check-custom">
                        <input type="checkbox" class="form-check-input" id="destacado" name="destacado">
                        <label class="form-check-label" for="destacado">¿Producto destacado?</label>
                      </div>

                      <div class="form-group" id="grupoOrdenDestacado" style="display: none;">
                        <label for="ordenDestacado">Orden de destacado <span class="text-danger">*</span></label>
                        <input type="number" class="form-control" id="ordenDestacado" name="orden_destacado"
                          placeholder="Número de orden (1, 2, 3...)" min="1" step="1" style="max-width: 150px;">
                        <small class="form-text text-muted">
                          <i class="fa fa-info-circle"></i> Define la posición en la que aparecerá este producto destacado
                        </small>
                      </div>

                      <div class="form-check-custom">
                        <input type="checkbox" class="form-check-input" id="activo" name="activo" checked>
                        <label class="form-check-label" for="activo">¿Producto activo?</label>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3">
                    <button type="submit" class="btn btn-primary me-2">Guardar producto</button>
                    <button class="btn btn-light" type="reset">Cancelar</button>
                  </div>
                </form>
                <div class="mt-4" id="seccionAgregarSubcat" style="display:none;">
                  <label for="selectCategoriaSubcat">Selecciona la categoría</label>
                  <select id="selectCategoriaSubcat" class="form-control mb-2" style="max-width: 250px;"></select>
                  <label for="inputSubcatNueva">Subcategoría</label>
                  <div class="d-flex mb-2">
                    <input type="text" id="inputSubcatNueva" class="form-control me-2"
                      placeholder="Nombre de subcategoría" style="max-width: 250px;">
                    <button type="button" class="btn btn-secondary btn-sm" id="btnAgregarSubcat">Agregar</button>
                  </div>
                  <ul id="listaSubcatsAgregadas" class="mt-2"></ul>
                </div>
              </div>
            </div>
          </div>
          <?php include "footer.php"; ?>
        </div>
      </div>
    </div>
    
    <!-- Modal Bootstrap para agregar categoría -->
    <div class="modal fade" id="modalCategoria" tabindex="-1" aria-labelledby="modalCategoriaLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCategoriaLabel">
              <i class="fa fa-plus-circle text-primary"></i> Agregar Categoría
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="inputNuevaCategoria" class="form-label">Nombre de la categoría <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="inputNuevaCategoria" placeholder="Ej: Bebidas, Snacks, etc." />
            </div>
            <div class="mb-3">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="checkSubcategorias" />
                <label class="form-check-label" for="checkSubcategorias">
                  ¿Agregar subcategoría inmediatamente?
                </label>
              </div>
            </div>
            <div class="mb-3" id="subcatInputSection" style="display:none;">
              <label for="inputNuevaSubcategoria" class="form-label">Subcategoría</label>
              <input type="text" class="form-control" id="inputNuevaSubcategoria" placeholder="Ej: Refrescos, Jugos, etc." />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fa fa-times"></i> Cancelar
            </button>
            <button type="button" class="btn btn-primary" id="btnGuardarCategoria">
              <i class="fa fa-save"></i> Guardar Categoría
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Bootstrap para agregar subcategoría a categoría existente -->
    <div class="modal fade" id="modalSubcat" tabindex="-1" aria-labelledby="modalSubcatLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalSubcatLabel">
              <i class="fa fa-list text-success"></i> Agregar Subcategoría
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Categoría seleccionada</label>
              <div class="alert alert-info py-2 px-3 mb-0" id="categoriaSeleccionadaInfo">
                <i class="fa fa-info-circle"></i>
                <strong id="nombreCategoriaSeleccionada"></strong>
              </div>
            </div>
            <div class="mb-3">
              <label for="inputSubcatModal" class="form-label">Nueva subcategoría <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="inputSubcatModal" placeholder="Nombre de la subcategoría" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fa fa-times"></i> Cancelar
            </button>
            <button type="button" class="btn btn-success" id="btnGuardarSubcatModal">
              <i class="fa fa-plus"></i> Agregar Subcategoría
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <script src="assets/vendors/js/vendor.bundle.base.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    <script src="assets/js/off-canvas.js"></script>
    <script src="assets/js/template.js"></script>
    <script src="assets/js/settings.js"></script>
    <script src="assets/js/todolist.js"></script>

  <script src="modulos_JS/formulario_producto.js"></script>
</body>

</html>
