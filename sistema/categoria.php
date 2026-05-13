<?php
// 🎯 PLANTILLA DE CATEGORÍA/SUBCATEGORÍA
// Carga rápida y optimizada para mostrar productos

// Obtener parámetros
$categoria_id = isset($_GET['id']) ? $_GET['id'] : null;
$subcategoria_id = isset($_GET['sub']) ? intval($_GET['sub']) : null;

// Validar que no estén vacíos (permitir 'all' como string)
if (empty($categoria_id) && empty($subcategoria_id)) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VendingBox - Productos</title>
    <link rel="icon" type="image/png" href="images/favicon.png">
    
    <!-- Preconnect a dominios externos -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
    
    <!-- Preload CSS críticos -->
    <link rel="preload" href="css/categoria.css?v=4.6" as="style">
    <link rel="preload" href="./css/cart-premium.css?v=2.4" as="style">
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap">
    
    <!-- CSS rápido desde CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="./css/cart-premium.css?v=2.4">
    <link rel="stylesheet" href="css/categoria.css?v=4.6">
    <link rel="stylesheet" href="css/monedero.css">
    
    <!-- Fonts con font-display: swap -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- SweetAlert2 - Carga diferida -->
    <link rel="preload" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"></noscript>
    
    <script>
        // Configuración de carga
        window.loadConfig = {
            categoriaId: <?php 
                if ($categoria_id === null) {
                    echo 'null';
                } elseif ($categoria_id === 'all') {
                    echo "'all'";
                } else {
                    echo intval($categoria_id);
                }
            ?>,
            subcategoriaId: <?php echo $subcategoria_id ? intval($subcategoria_id) : 'null'; ?>
        };
    </script>
    
    <style>
        /* CSS Crítico inline para evitar FOUC */
        body {
            margin: 0;
            padding: 0;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            opacity: 0;
            animation: fadeIn 0.2s ease-in-out forwards;
        }
        
        .middle-inner {
            background: linear-gradient(135deg, #F6DA01 0%, #ffe44d 100%);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .logo-text {
            color: #0a0a0a;
            font-size: 2.2rem;
            font-weight: 900;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 20px;
        }
        
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    </style>
</head>

<body class="js">
    <!-- Header -->
    <div class="middle-inner">
        <div class="header-container">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center py-1">
                        <div class="logo">
                            <a href="index.php">
                                <span class="logo-text">VendingBox</span>
                            </a>
                        </div>
                        <div class="sinlge-bar shopping">
                            <a href="#" class="single-icon">
                                <i class="bi bi-cart"></i>
                                <span class="total-count">
                                    <span id="cart-count-inner">0</span>
                                </span>
                            </a>
                            <div class="shopping-item">
                                <div class="dropdown-cart-header">
                                    <span>0 Productos</span>
                                    <a href="cart.php"><i class="fa fa-shopping-cart"></i> Ver carrito</a>
                                </div>
                                <ul class="shopping-list"></ul>
                                <div class="bottom">
                                    <div class="total">
                                        <span>Total</span>
                                        <span class="total-amount">$0.00</span>
                                    </div>
                                    <a href="cart.php" class="btn animate">
                                        <i class="fa fa-credit-card"></i>
                                        Pagar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Contenedor de Subcategorías -->
    <section class="subcategories-section" id="subcategories-section" style="display: none;">
        <div class="featured-header">
            <h2 id="subcategories-header">Subcategorías</h2>
        </div>
        <div id="subcategories-container" class="featured-products-grid">
            <!-- Subcategorías se cargan aquí -->
        </div>
    </section>

    <!-- Contenedor de Productos -->
    <section class="products-section" id="products-display-section">
        <div class="featured-header">
            <h2 id="products-header">Productos</h2>
        </div>
        <div id="products-container" class="featured-products-grid">
            <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 40px; color: #F6DA01; width: 100%;">
                <i class="fa fa-spinner fa-spin" style="font-size: 3rem;"></i>
                <p style="margin-top: 15px; font-size: 1.2rem; font-weight: 600;">Cargando productos...</p>
            </div>
        </div>
    </section>

    <!-- Botón Regresar -->
    <button class="back-button" id="back-button" title="Regresar" onclick="smoothNavigate('index.php')">
        <i class="fa fa-arrow-left"></i>
        <span>Regresar</span>
    </button>

    <!-- Templates -->
    <template id="subcategory-template">
        <div class="subcategory-card">
            <img class="subcategory-image" src="" alt="" loading="lazy" decoding="async">
            <div class="no-image-placeholder">
                <i class="bi bi-collection"></i>
            </div>
            <div class="subcategory-overlay">
                <h3 class="subcategory-title"></h3>
                <button class="subcategory-button">
                    <i class="bi bi-arrow-right"></i> VER PRODUCTOS
                </button>
            </div>
        </div>
    </template>

    <template id="product-template">
        <div class="product-card">
            <div class="product-img-wrapper">
                <img class="product-img" src="" alt="" loading="lazy" decoding="async">
            </div>
            <div class="product-content">
                <h3 class="product-title"></h3>
                <div class="price-container">
                    <span class="product-price"></span>
                    <span class="product-original-price"></span>
                    <span class="product-discount"></span>
                </div>
                <button class="add-to-cart">
                    <i class="bi bi-cart-plus"></i>
                    Agregar al carrito
                </button>
            </div>
        </div>
    </template>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
    
    <script src="js/modulos/carrito.js" defer></script>
    <script src="js/monedero-integration.js"></script>

    <script>
        // 🎨 Navegación suave entre páginas
        function smoothNavigate(url) {
            document.body.style.transition = 'opacity 0.3s ease-in-out';
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        }
        
        // Inicializar carrito
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof Cart !== 'undefined') {
                Cart.init();
            }
            // MonederoIntegration se auto-inicializa al final de su propio script
        });

        // ⚡ CARGA RÁPIDA DE DATOS
        // Variable para evitar múltiples cargas
        let isLoading = false;
        let hasLoaded = false;

        async function loadData() {
            // Evitar cargas múltiples
            if (isLoading || hasLoaded) {
                console.log('⚠️ loadData() ya ejecutado o en progreso, saltando...');
                return;
            }
            
            isLoading = true;
            const { categoriaId, subcategoriaId } = window.loadConfig;
            
            console.log('🔥 loadData() iniciado', { categoriaId, subcategoriaId });

            try {
                // CASO 1: Cargar subcategoría específica
                if (subcategoriaId) {
                    console.log('📦 Cargando subcategoría:', subcategoriaId);
                    await loadProductsBySubcategory(subcategoriaId);
                    return;
                }

                // CASO 2: Cargar TODOS los productos (categoría especial 'all')
                if (categoriaId === 'all') {
                    console.log('🛒 Cargando TODOS los productos');
                    document.getElementById('products-header').textContent = 'Todos los Productos';
                    await loadAllProducts();
                    return;
                }

                // CASO 3: Cargar categoría específica
                if (categoriaId) {
                    console.log('📂 Cargando categoría:', categoriaId);
                    // Obtener info de la categoría
                    const response = await fetch('get_categories.php');
                    const categories = await response.json();
                    console.log('✅ Categorías obtenidas:', categories.length);
                    
                    const category = categories.find(c => c.id_categoria == categoriaId);
                    console.log('📁 Categoría encontrada:', category);

                    if (!category) {
                        console.error('❌ Categoría no encontrada! Redirigiendo...');
                        smoothNavigate('index.php');
                        return;
                    }

                    // Actualizar título
                    document.getElementById('products-header').textContent = category.nombre_categoria;

                    // Si tiene subcategorías, mostrarlas
                    if (category.subcategorias && category.subcategorias.length > 0) {
                        console.log('📋 Tiene subcategorías:', category.subcategorias.length);
                        await loadSubcategories(category);
                    } else {
                        console.log('🎯 Sin subcategorías, cargando productos directamente');
                        // Cargar productos directamente
                        await loadProductsByCategory(categoriaId);
                    }
                }
                
                // Marcar como cargado exitosamente
                hasLoaded = true;
                isLoading = false;
                console.log('✅ loadData() completado exitosamente');
                
            } catch (error) {
                console.error('💥 ERROR en loadData():', error);
                isLoading = false;
                document.getElementById('products-container').innerHTML = 
                    '<div class="loading-state"><i class="fa fa-exclamation-circle" style="font-size: 3rem;"></i><p>Error al cargar productos</p></div>';
            }
        }

        // Cargar subcategorías
        async function loadSubcategories(category) {
            const subsSection = document.getElementById('subcategories-section');
            const prodsSection = document.getElementById('products-display-section');
            const subsContainer = document.getElementById('subcategories-container');
            const subsHeader = document.getElementById('subcategories-header');

            // Mostrar sección de subcategorías
            subsSection.style.display = 'block';
            prodsSection.style.display = 'none';

            // Actualizar header
            subsHeader.textContent = category.nombre_categoria;
            subsHeader.style.color = '#F6DA01';
            subsHeader.style.fontSize = '3.5rem';
            subsHeader.style.fontWeight = '900';

            // LIMPIAR COMPLETAMENTE el contenedor
            subsContainer.innerHTML = '';
            console.log('🧹 Contenedor de subcategorías limpiado');

            // Renderizar subcategorías
            const template = document.getElementById('subcategory-template');
            
            console.log('🎨 Renderizando', category.subcategorias.length, 'subcategorías...');

            category.subcategorias.forEach((sub, index) => {
                console.log(`  - Subcategoría ${index + 1}:`, sub.nombre_subcategoria);
                
                const clone = template.content.cloneNode(true);
                const card = clone.querySelector('.subcategory-card');
                const img = clone.querySelector('.subcategory-image');
                const title = clone.querySelector('.subcategory-title');
                const placeholder = clone.querySelector('.no-image-placeholder');

                if (sub.imagen_subcategoria) {
                    img.src = sub.imagen_subcategoria;
                    img.style.display = 'block';
                    placeholder.style.display = 'none';
                } else {
                    img.style.display = 'none';
                    placeholder.style.display = 'flex';
                }

                title.textContent = sub.nombre_subcategoria;

                // Click para cargar productos de subcategoría
                card.addEventListener('click', () => {
                    smoothNavigate(`categoria.php?sub=${sub.id_subcategoria}`);
                });

                subsContainer.appendChild(clone);
            });
            
            console.log('✅ Subcategorías renderizadas correctamente');

            // Cargar productos sin subcategoría en background
            loadProductsByCategory(category.id_categoria, true);
        }

        // Cargar productos por categoría
        async function loadProductsByCategory(categoryId, noSubOnly = false) {
            console.log('🔍 loadProductsByCategory:', { categoryId, noSubOnly });
            
            const url = noSubOnly 
                ? `get_products.php?categoria=${categoryId}&sin_subcategoria=1`
                : `get_products.php?categoria=${categoryId}`;
            
            console.log('🌐 Fetching:', url);
            const response = await fetch(url);
            const products = await response.json();
            console.log('📦 Productos recibidos:', products.length, products);

            if (noSubOnly && products.length > 0) {
                // Agregar productos sin subcategoría al contenedor de subcategorías
                prependNoSubProducts(products);
            } else {
                displayProducts(products);
            }
        }

        // Cargar productos por subcategoría
        async function loadProductsBySubcategory(subcategoryId) {
            const response = await fetch(`get_products.php?subcategoria=${subcategoryId}`);
            const products = await response.json();
            displayProducts(products);
        }

        // Cargar TODOS los productos (sin filtro)
        async function loadAllProducts() {
            const response = await fetch('get_products.php');
            const products = await response.json();
            displayProducts(products);
        }

        // Mostrar productos
        function displayProducts(products) {
            console.log('🎨 displayProducts() iniciado con', products.length, 'productos');
            
            const container = document.getElementById('products-container');
            const template = document.getElementById('product-template');
            const prodsSection = document.getElementById('products-display-section');

            // FORZAR visibilidad
            prodsSection.style.display = 'block';
            prodsSection.style.visibility = 'visible';
            prodsSection.style.opacity = '1';
            
            console.log('✅ Sección de productos visible');
            
            container.innerHTML = '';

            if (!products || products.length === 0) {
                console.warn('⚠️ No hay productos para mostrar');
                container.innerHTML = '<div class="loading-state"><i class="fa fa-box-open" style="font-size: 3rem;"></i><p>No hay productos disponibles</p></div>';
                return;
            }

            console.log('🔨 Renderizando', products.length, 'productos...');
            
            products.forEach((product, index) => {
                console.log(`  - Producto ${index + 1}:`, product.nombre_producto);
                
                const clone = template.content.cloneNode(true);
                const img = clone.querySelector('.product-img');
                const title = clone.querySelector('.product-title');
                const price = clone.querySelector('.product-price');
                const addToCartBtn = clone.querySelector('.add-to-cart');

                if (img) {
                    img.src = product.imagen_principal || 'images/no-image.png';
                    img.alt = product.nombre_producto;
                }

                if (title) title.textContent = product.nombre_producto;

                const productPrice = parseFloat(product.precio) || 0;
                const productDiscount = parseFloat(product.descuento) || 0;
                const finalPrice = productPrice - (productPrice * (productDiscount / 100));

                if (price) price.textContent = `$${finalPrice.toFixed(2)}`;

                if (addToCartBtn) {
                    addToCartBtn.addEventListener('click', () => {
                        if (typeof Cart !== 'undefined') {
                            Cart.addItem(product);
                            if (typeof Swal !== 'undefined') {
                                Swal.fire({
                                    icon: 'success',
                                    title: '¡Agregado!',
                                    html: `<strong>${product.nombre_producto}</strong> agregado al carrito 🛒`,
                                    timer: 3000,
                                    showConfirmButton: false,
                                    toast: true,
                                    position: 'top-end',
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        }
                    });
                }

                container.appendChild(clone);
            });
            
            console.log('✅ Productos renderizados exitosamente!');
        }

        // Agregar productos sin subcategoría
        function prependNoSubProducts(products) {
            const container = document.getElementById('subcategories-container');
            
            if (!products || products.length === 0) {
                console.log('ℹ️ No hay productos sin subcategoría');
                return;
            }
            
            console.log('📦 Agregando', products.length, 'productos sin subcategoría');

            // Verificar si ya se agregaron productos sin subcategoría
            if (container.querySelector('.no-sub-products-wrapper')) {
                console.log('⚠️ Productos sin subcategoría ya agregados, saltando...');
                return;
            }

            // Crear wrapper para productos sin subcategoría con su propio grid
            const productsWrapper = document.createElement('div');
            productsWrapper.className = 'no-sub-products-wrapper';

            const label = document.createElement('div');
            label.className = 'no-sub-label';
            label.textContent = 'Productos sin subcategoría';
            label.style.cssText = 'grid-column: 1 / -1; font-weight:700; margin: 20px 0 15px; color:#F6DA01; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;';

            const template = document.getElementById('product-template');
            
            products.forEach((product, index) => {
                console.log(`  - Producto ${index + 1}:`, product.nombre_producto);
                
                const clone = template.content.cloneNode(true);
                const img = clone.querySelector('.product-img');
                const title = clone.querySelector('.product-title');
                const price = clone.querySelector('.product-price');
                const originalPrice = clone.querySelector('.product-original-price');
                const discount = clone.querySelector('.product-discount');
                const addToCartBtn = clone.querySelector('.add-to-cart');

                // Configurar imagen
                if (img) {
                    img.src = product.imagen_principal || 'images/no-image.png';
                    img.alt = product.nombre_producto;
                }

                // Configurar título
                if (title) title.textContent = product.nombre_producto;

                // Calcular precio con descuento
                const productPrice = parseFloat(product.precio) || 0;
                const productDiscount = parseFloat(product.descuento) || 0;
                const finalPrice = productPrice - (productPrice * (productDiscount / 100));

                // Mostrar precio final
                if (price) price.textContent = `$${finalPrice.toFixed(2)}`;

                // Mostrar precio original y descuento si aplica
                if (productDiscount > 0) {
                    if (originalPrice) {
                        originalPrice.textContent = `$${productPrice.toFixed(2)}`;
                        originalPrice.style.display = 'inline';
                    }
                    if (discount) {
                        discount.textContent = `-${productDiscount}%`;
                        discount.style.display = 'inline';
                    }
                } else {
                    if (originalPrice) originalPrice.style.display = 'none';
                    if (discount) discount.style.display = 'none';
                }

                // Configurar botón de agregar al carrito
                if (addToCartBtn) {
                    addToCartBtn.addEventListener('click', () => {
                        if (typeof Cart !== 'undefined') {
                            Cart.addItem(product);
                            if (typeof Swal !== 'undefined') {
                                Swal.fire({
                                    icon: 'success',
                                    title: '¡Agregado!',
                                    html: `<strong>${product.nombre_producto}</strong> agregado al carrito 🛒`,
                                    timer: 3000,
                                    showConfirmButton: false,
                                    toast: true,
                                    position: 'top-end',
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                });
                            }
                        }
                    });
                }

                productsWrapper.appendChild(clone);
            });

            // Crear separador
            const sep = document.createElement('div');
            sep.className = 'no-sub-separator';
            sep.style.cssText = 'grid-column: 1 / -1; height: 1px; background: #eee; margin: 30px 0 20px;';

            // Crear label de Subcategorías
            const subLabel = document.createElement('div');
            subLabel.className = 'subcategories-label';
            subLabel.textContent = 'Subcategorías';
            subLabel.style.cssText = 'grid-column: 1 / -1; font-weight:700; margin: 20px 0 15px; color:#F6DA01; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;';

            // Insertar TODO al inicio del contenedor EN ORDEN
            // Las subcategorías ya están renderizadas, así que insertamos antes de ellas
            container.insertBefore(subLabel, container.firstChild);
            container.insertBefore(sep, container.firstChild);
            container.insertBefore(productsWrapper, container.firstChild);
            container.insertBefore(label, container.firstChild);
            
            console.log('✅ Productos sin subcategoría agregados correctamente');
        }

        // Iniciar carga
        document.addEventListener('DOMContentLoaded', () => {
            loadData();
        });
    </script>
</body>
</html>
