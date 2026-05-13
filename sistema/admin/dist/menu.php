<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['login']) || $_SESSION['login'] === false) {
    header('Location: login.php');
    exit();
}else{
    $nombre_usuario = $_SESSION['nombre_usuario'];
    $uid = $_SESSION['uid'];
    $tipo_usuario = $_SESSION['tipo_usuario'];

}
?>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

<style>
.sidebar {
  position: fixed;
  top: 70px; /* Ajusta este valor según la altura real de tu navbar */
  left: 0;
  height: calc(100vh - 70px); /* Altura total menos la altura del navbar */
  width: 240px;
  z-index: 100;
  overflow-y: auto;
}

.main-panel {
  margin-left: 240px;
}

/* Asegurar que el navbar esté por encima */
.navbar {
  z-index: 1000;
}

.menu-icon, .fa-cart-plus, .fa-tag, .fa-tags, .fa-bar-chart, .fa-building, .fa-coins {
  margin-right: 10px;
}
</style>
<nav class="sidebar sidebar-offcanvas" id="sidebar">
  <ul class="nav">
    <li class="nav-item">
      <a class="nav-link" href="index.php">
        <i class="icon-grid menu-icon"></i>
        <span class="menu-title">Dashboard</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="formulario_producto.php">
<i class="fa-solid fa-cart-plus"></i>        
<span class="menu-title">Agregar Producto</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="tabla_productos.php">
<i class="fa-solid fa-tag"></i>
<span class="menu-title">Consulta Producto</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="tabla_categorias.php">
        <i class="fa-solid fa-tags"></i>
        <span class="menu-title">Lista Categorias</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="tabla_subcategorias.php">
        <i class="fa-solid fa-tags"></i>
        <span class="menu-title">Lista Subategorias</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="movimientos.php">
        <i class="fa fa-bar-chart"></i>
        <span class="menu-title">Consulta Movimientos</span>
      </a>
    </li>


    <li class="nav-item">
      <a class="nav-link" href="cortes_caja.php">
        <i class="fa fa-bar-chart"></i>
        <span class="menu-title">Cortes de Caja</span>
      </a>
    </li>

    <li class="nav-item">
      <a class="nav-link" href="configurar_empresa.php">
        <i class="fa-solid fa-building"> </i>
        <span class="menu-title">Configurar Empresa</span>
      </a>
    </li>

    <li class="nav-item">
      <a class="nav-link" href="control_monedero.php">
        <i class="fa-solid fa-coins"></i>
        <span class="menu-title">Control Monedero</span>
      </a>
    </li>
    
    
      <!-- 
    
   ///////
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
        <i class="icon-layout menu-icon"></i>
        <span class="menu-title">UI Elements</span>
        <i class="menu-arrow"></i>
      </a>
      <div class="collapse" id="ui-basic">
        <ul class="nav flex-column sub-menu">
          <li class="nav-item"> <a class="nav-link" href="pages/ui-features/buttons.html">Buttons</a></li>
          <li class="nav-item"> <a class="nav-link" href="pages/ui-features/dropdowns.html">Dropdowns</a></li>
          <li class="nav-item"> <a class="nav-link" href="pages/ui-features/typography.html">Typography</a></li>
        </ul>
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="collapse" href="#form-elements" aria-expanded="false" aria-controls="form-elements">
        <i class="icon-columns menu-icon"></i>
        <span class="menu-title">Form elements</span>
        <i class="menu-arrow"></i>
      </a>
      <div class="collapse" id="form-elements">
        <ul class="nav flex-column sub-menu">
          <li class="nav-item"><a class="nav-link" href="pages/forms/basic_elements.html">Basic Elements</a></li>
        </ul>
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="collapse" href="#charts" aria-expanded="false" aria-controls="charts">
        <i class="icon-bar-graph menu-icon"></i>
        <span class="menu-title">Charts</span>
        <i class="menu-arrow"></i>
      </a>
      <div class="collapse" id="charts">
        <ul class="nav flex-column sub-menu">
          <li class="nav-item"> <a class="nav-link" href="pages/charts/chartjs.html">ChartJs</a></li>
        </ul>
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="collapse" href="#tables" aria-expanded="false" aria-controls="tables">
        <i class="icon-grid-2 menu-icon"></i>
        <span class="menu-title">Tables</span>
        <i class="menu-arrow"></i>
      </a>
      <div class="collapse" id="tables">
        <ul class="nav flex-column sub-menu">
          <li class="nav-item"> <a class="nav-link" href="pages/tables/basic-table.html">Basic table</a></li>
        </ul>
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="collapse" href="#icons" aria-expanded="false" aria-controls="icons">
        <i class="icon-contract menu-icon"></i>
        <span class="menu-title">Icons</span>
        <i class="menu-arrow"></i>
      </a>
      <div class="collapse" id="icons">
        <ul class="nav flex-column sub-menu">
          <li class="nav-item"> <a class="nav-link" href="pages/icons/mdi.html">Mdi icons</a></li>
        </ul>
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
        <i class="icon-head menu-icon"></i>
        <span class="menu-title">User Pages</span>
        <i class="menu-arrow"></i>
      </a>
      <div class="collapse" id="auth">
        <ul class="nav flex-column sub-menu">
          <li class="nav-item"> <a class="nav-link" href="pages/samples/login.html"> Login </a></li>
          <li class="nav-item"> <a class="nav-link" href="pages/samples/register.html"> Register </a></li>
        </ul>
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="collapse" href="#error" aria-expanded="false" aria-controls="error">
        <i class="icon-ban menu-icon"></i>
        <span class="menu-title">Error pages</span>
        <i class="menu-arrow"></i>
      </a>
      <div class="collapse" id="error">
        <ul class="nav flex-column sub-menu">
          <li class="nav-item"> <a class="nav-link" href="pages/samples/error-404.html"> 404 </a></li>
          <li class="nav-item"> <a class="nav-link" href="pages/samples/error-500.html"> 500 </a></li>
        </ul>
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="../../../docs/documentation.html">
        <i class="icon-paper menu-icon"></i>
        <span class="menu-title">Documentation</span>
      </a>
    </li>
  </ul>
  
  
  
   inject:js -->
 </nav>
