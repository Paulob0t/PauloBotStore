<?php
// ⚡ NO cargar datos aquí - dejar que JS lo haga con caché
// Esto ahorra ~200-500ms en el servidor
$productos = [];
$categorias = [];
$servicios = [];
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VendingBox - Tienda Online</title>
    <link rel="icon" type="image/png" href="images/favicon.png">
    
    <!-- Preconnect a dominios externos PRIMERO -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
    
    <!-- Preload CSS críticos para evitar FOUC -->
    <link rel="preload" href="./css/shop-carousel.css?v=2.4" as="style">
    <link rel="preload" href="./css/cart-premium.css?v=2.4" as="style">
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap">
    
    <!-- ⚡ CSS CRÍTICOS - Bootstrap desde CDN (mejor caché) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="./css/shop-carousel.css?v=2.4">
    <link rel="stylesheet" href="./css/cart-premium.css?v=2.4">
    <link rel="stylesheet" href="./css/monedero.css?v=1.3">
    
    <!-- ⚡ Fonts con font-display: swap para render rápido -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- SweetAlert2 - Carga diferida -->
    <link rel="preload" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"></noscript>
    
    <script>
        window.products = <?php echo !empty($productos) ? json_encode($productos, JSON_UNESCAPED_UNICODE) : '[]'; ?>;
        window.categories = <?php echo !empty($categorias) ? json_encode($categorias, JSON_UNESCAPED_UNICODE) : '[]'; ?>;
        window.servicios = [];
    </script>
    
    <script>
        !function(){
            const TTL=18e5; // 30 minutos
            try{
                const c=JSON.parse(localStorage.getItem('vb_all_data')||'null');
                if(c&&c.timestamp&&(Date.now()-c.timestamp)<TTL){
                    window.categories=c.categories||[];
                    window.products=c.products||[];
                    window.featuredProducts=c.featured||[];
                    window.cacheLoaded=true;
                }
            }catch(e){}
        }();
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
        
        /* Header básico inline */
        .middle-inner {
            background: linear-gradient(135deg, #F6DA01 0%, #ffe44d 100%);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .logo-text {
            color: #0a0a0a;
            font-size: 2.2rem;
            font-weight: 900;
        }
        
        /* Tarjetas de categorías - CRÍTICO para evitar FOUC */
        .category-card, 
        .subcategory-card {
            background: white !important;
            border-radius: 20px !important;
            overflow: hidden !important;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
            position: relative !important;
            cursor: pointer !important;
            height: 350px !important;
            width: 340px !important;
            flex-shrink: 0 !important;
            border-top: 5px solid #F6DA01 !important;
        }
        
        .category-image, 
        .subcategory-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(0.85);
        }
        
        .category-overlay, 
        .subcategory-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%);
            padding: 35px 25px 25px;
            color: white;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .category-title, 
        .subcategory-title {
            font-size: 1.8rem;
            font-weight: 900;
            margin: 0;
            text-transform: uppercase;
            line-height: 1.2;
            letter-spacing: 0.5px;
        }
        
        /* Animación suave */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Skeleton loader para productos */
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
        
        /* 💳 Asegurar que SweetAlert2 de pagos aparezca sobre modales de servicios (z-index: 99999) */
        .swal2-container {
            z-index: 100000 !important;
        }
        .payment-swal-container {
            z-index: 100001 !important;
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

    <!-- Sección de Productos Destacados (Carrusel) -->
    <section class="featured-products-section products-section">
        <div class="featured-header">
            <h2>Productos Destacados</h2>
        </div>
        <div id="featured-products-container">
            <!-- Los productos destacados se cargarán aquí dinámicamente -->
        </div>
    </section>

    <!-- Sección de Servicios (Carrusel) -->
    <section class="featured-products-section services-section">
        <div class="featured-header">
            <h2>Servicios</h2>
        </div>
        <div id="services-container">
            <!-- Los servicios se cargarán aquí dinámicamente -->
        </div>
    </section>

    <!-- Sección de Categorías -->
    <section class="categories-visual-section">
        <div class="featured-header">
            <h2 id="categories-header">Categorías</h2>
        </div>
        <div id="categories-container">
            <!-- Las categorías se cargarán aquí dinámicamente -->
        </div>
    </section>

    <!-- Contenedor para subcategorías (oculto por defecto) -->
    <section class="subcategories-section" id="subcategories-section" style="display: none;">
        <div class="featured-header" id="cats-subs-header">
            <h2 id="subcategories-header">Subcategorías</h2>
        </div>
        <div id="subcategories-container" class="featured-products-grid">
            <!-- Las subcategorías se cargarán aquí dinámicamente -->
        </div>
    </section>

    <!-- Contenedor para productos (oculto por defecto) -->
    <section class="products-section" id="products-display-section" style="display: none;">
        <div class="featured-header" id="products-header-section">
            <h2 id="products-header">Productos</h2>
        </div>
        <div id="products-container" class="featured-products-grid">
            <!-- Los productos se cargarán aquí dinámicamente -->
        </div>
    </section>

    <!-- Botón flotante para regresar -->
    <button class="back-button hidden" id="back-button" title="Regresar">
        <i class="fa fa-arrow-left"></i>
        <span>Regresar</span>
    </button>

    <!-- Templates -->
    <template id="category-template">
        <div class="category-card">
            <img class="category-image" src="" alt="" loading="lazy" decoding="async">
            <div class="no-image-placeholder">
                <i class="bi bi-grid"></i>
            </div>
            <div class="category-overlay">
                <h3 class="category-title"></h3>
            </div>
        </div>
    </template>

    <!-- Template para subcategorías -->
    <template id="subcategory-template">
        <div class="subcategory-card">
            <img class="subcategory-image" src="" alt="" loading="lazy" decoding="async">
            <div class="no-image-placeholder">
                <i class="bi bi-collection"></i>
            </div>
            <div class="subcategory-overlay">
                <h3 class="subcategory-title"></h3>
            </div>
        </div>
    </template>

    <!-- Template para productos -->
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

    <!-- Template para productos destacados (mismo diseño que product-template) -->
    <template id="featured-product-template">
        <div class="featured-product-card">
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

    <!-- Template para servicios -->
    <template id="service-template">
        <div class="service-card">
            <div class="service-img-wrapper">
                <img class="service-img" src="" alt="" decoding="async">
            </div>
            <div class="service-overlay">
                <h3 class="service-title"></h3>
                <button class="service-btn">
                    <i class="bi bi-arrow-right-circle"></i>
                    Ver más
                </button>
            </div>
        </div>
    </template>

    <!-- Shopping cart sidebar - OCULTO, se usa el dropdown premium -->
    <div class="shopping-cart-sidebar" id="cart-sidebar" style="display: none !important; visibility: hidden !important;">
        <div class="cart-header">
            <h3>Carrito</h3>
            <button onclick="document.getElementById('cart-sidebar').style.display='none'">×</button>
        </div>
        <div id="cart-items"></div>
        <div class="cart-footer">
            <div class="cart-total-row">
                <strong>Total:</strong>
                <span id="cart-total">$0.00</span>
            </div>
            <button class="btn" onclick="window.location.href='cart.php'">
                Ver Carrito
            </button>
        </div>
    </div>

    <!-- ⚡ Scripts esenciales optimizados -->
    
    <!-- ⚡ jQuery y Bootstrap - Desde CDN para mejor caché y performance -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js" integrity="sha384-fbbOQedDUMZZ5KreZpsbe1LCZPVmfTnH7ois6mU1QK+m14rQ1l2bGBq41eYeM/fS" crossorigin="anonymous" defer></script>
    
    <!-- SweetAlert2 - Cargar async, no es crítico para First Paint -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
    
    <!-- Scripts esenciales con defer (se cargan después del DOM) -->
    <script src="qz-tray.js" defer></script>
    <script src="js/modulos/print-ticket.js" defer></script>
    <script src="js/modulos/image-optimizer.js" defer></script>
    <script src="js/monedero-integration.js" defer></script>
    <script src="js/modulos/service-payment-handler.js" defer></script>
    <script src="js/modulos/service-cache.js" defer></script>
    <script src="js/modulos/netflix-services.js" type="module" defer></script>
    <script src="js/modulos/spotify-services.js" type="module" defer></script>
    <script src="js/modulos/telcel-services.js" type="module" defer></script>
    <script src="js/modulos/movistar-services.js" type="module" defer></script>
    <script src="js/modulos/carrito.js" defer></script>
    <script src="js/modulos/categories-display.js" defer></script>

    <!-- Inicializar el carrito -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof Cart !== 'undefined') {
                Cart.init();
                
                // Configurar eventos del mini-carrito (hover)
                if (typeof setupCartEvents === 'function') {
                    setupCartEvents();
                }
            }
        });
    </script>

    <!-- 🚀 CARGADOR OPTIMIZADO - Caché agresivo para BD en nube -->
    <script defer>
        (async function() {
            const CACHE_KEY = 'vb_all_data';
            const TTL = 30 * 60 * 1000; // 30 minutos (BD en nube es lenta)
            const BG_REFRESH_TIME = 20 * 60 * 1000; // Refrescar después de 20 min
            
            // 1️⃣ Si ya cargamos del caché inline, solo refrescar si es viejo
            if (window.cacheLoaded) {
                try {
                    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
                    const age = Date.now() - (cached?.timestamp || 0);
                    
                    // Solo refrescar si tiene más de 20 minutos
                    if (age > BG_REFRESH_TIME) {
                        fetchFreshData(true); // Background, sin bloquear UI
                    }
                } catch {}
                return; // Ya tenemos datos, no bloquear
            }
            
            // 2️⃣ No hay caché, cargar datos frescos (primera vez)
            fetchFreshData(false);
            
            async function fetchFreshData(isBackground = false) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
                    
                    const response = await fetch('get_all_data.php', {
                        headers: { 'Accept': 'application/json' },
                        signal: controller.signal,
                        priority: isBackground ? 'low' : 'high'
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) throw new Error('Network error');
                    
                    const result = await response.json();
                    
                    if (result.success && result.data) {
                        // Actualizar variables globales
                        window.categories = result.data.categories || [];
                        window.products = result.data.products || [];
                        window.featuredProducts = result.data.featured_products || [];

                        
                        // Guardar en caché con timestamp
                        try {
                            localStorage.setItem(CACHE_KEY, JSON.stringify({
                                timestamp: Date.now(),
                                categories: window.categories,
                                products: window.products,
                                featured: window.featuredProducts
                            }));
                        } catch (e) {
                            // Caché lleno, limpiar y reintentar
                            try {
                                localStorage.clear();
                                localStorage.setItem(CACHE_KEY, JSON.stringify({
                                    timestamp: Date.now(),
                                    categories: window.categories,
                                    products: window.products,
                                    featured: window.featuredProducts
                                }));
                            } catch {}
                        }
                        
                        // Siempre disparar evento para que los módulos se actualicen
                        window.dispatchEvent(new CustomEvent('dataLoaded', { 
                            detail: result.data 
                        }));
                    }
                } catch (error) {
                    // Si falla y NO hay caché, intentar fallback
                    if (!isBackground && (!window.products || window.products.length === 0)) {
                        // Intentar APIs individuales como último recurso
                        await Promise.allSettled([
                            fetch('get_products.php').then(r => r.json()).then(d => window.products = d),
                            fetch('get_categories.php').then(r => r.json()).then(d => window.categories = d)
                        ]);
                    }
                }
            }
        })();
    </script>

    <!-- 🎠 MÓDULO DE CARRUSELES - Productos Destacados, Servicios y Categorías -->
    <script defer>
        /**
         * Módulo unificado para gestionar carruseles
         * Soporta: Productos Destacados, Servicios y Categorías
         */
        const CarouselManager = {
            carousels: {},

            /**
             * Inicializa un carrusel
             */
            init(config) {
                const {
                    containerId,
                    dataSource, // función o array de datos
                    renderCard, // función para renderizar cada card
                    itemsPerSlideConfig, // configuración de items por slide según ancho de pantalla
                    autoSlide = true,
                    slideInterval = 5000
                } = config;

                const carousel = {
                    container: document.getElementById(containerId),
                    data: [],
                    currentSlide: 0,
                    autoSlideInterval: null,
                    itemsPerSlide: 3,
                    totalSlides: 0,
                    itemsPerSlideConfig: itemsPerSlideConfig || {
                        480: 1,
                        768: 2,
                        1200: 3,
                        default: 3
                    },
                    renderCard: renderCard,
                    autoSlide: autoSlide,
                    slideInterval: slideInterval
                };

                this.carousels[containerId] = carousel;
                this.updateItemsPerSlide(containerId);
                this.loadData(containerId, dataSource);

                window.addEventListener('resize', () => this.onResize(containerId));

                return carousel;
            },

            updateItemsPerSlide(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel) return;

                const width = window.innerWidth;
                const config = carousel.itemsPerSlideConfig;
                
                let items = config.default;
                if (width <= 480) items = config[480];
                else if (width <= 768) items = config[768];
                else if (width <= 1200) items = config[1200];

                carousel.itemsPerSlide = Math.max(1, items);
            },

            async loadData(containerId, dataSource) {
                const carousel = this.carousels[containerId];
                if (!carousel) return;

                try {
                    this.showLoading(containerId);

                    let data = [];
                    if (typeof dataSource === 'function') {
                        data = await dataSource();
                    } else if (Array.isArray(dataSource)) {
                        data = dataSource;
                    }

                    carousel.data = data;
                    this.render(containerId);
                } catch (error) {
                    this.showError(containerId);
                }
            },

            showLoading(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel || !carousel.container) return;
                
                carousel.container.innerHTML = `
                    <div class="featured-loading">
                        <i class="fa fa-spinner fa-spin"></i>
                        <p>Cargando...</p>
                    </div>
                `;
            },

            showError(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel || !carousel.container) return;
                
                carousel.container.innerHTML = `
                    <div class="featured-loading">
                        <i class="fa fa-exclamation-circle"></i>
                        <p>Error al cargar contenido</p>
                    </div>
                `;
            },

            render(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel || !carousel.container || !carousel.data || carousel.data.length === 0) {
                    console.warn(`No hay datos para renderizar en ${containerId}`, carousel?.data);
                    // Ocultar la sección si no hay datos
                    if (carousel?.container) {
                        const section = carousel.container.closest('section');
                        if (section) {
                            section.style.display = 'none';
                        }
                    }
                    return;
                }

                // Mostrar la sección
                const section = carousel.container.closest('section');
                if (section) {
                    section.style.display = 'block';
                }

                this.stopAutoSlide(containerId);
                this.updateItemsPerSlide(containerId);

                carousel.currentSlide = 0;
                const cardsHTML = carousel.data.map((item, index) => carousel.renderCard(item, index)).join('');

                carousel.container.innerHTML = `
                    <div class="featured-products-carousel-wrapper">
                        <button class="featured-carousel-btn prev" data-carousel="${containerId}">
                            <i class="fa fa-chevron-left"></i>
                        </button>
                        <div class="featured-products-grid">
                            <div class="featured-products-carousel" id="${containerId}-carousel">
                                ${cardsHTML}
                            </div>
                        </div>
                        <button class="featured-carousel-btn next" data-carousel="${containerId}">
                            <i class="fa fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="featured-carousel-dots" id="${containerId}-dots"></div>
                `;

                this.attachEventListeners(containerId);
                this.initCarousel(containerId);
            },

            attachEventListeners(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel) return;

                // Eventos de botones
                const prevBtn = carousel.container.querySelector('.featured-carousel-btn.prev');
                const nextBtn = carousel.container.querySelector('.featured-carousel-btn.next');

                if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide(containerId));
                if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide(containerId));

                // Eventos de hover para pausar auto-slide
                const carouselEl = document.getElementById(`${containerId}-carousel`);
                if (carouselEl && carousel.autoSlide) {
                    carouselEl.addEventListener('mouseenter', () => this.stopAutoSlide(containerId));
                    carouselEl.addEventListener('mouseleave', () => this.startAutoSlide(containerId));
                }
            },

            initCarousel(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel) return;

                const dotsContainer = document.getElementById(`${containerId}-dots`);
                const totalSlides = Math.ceil(carousel.data.length / carousel.itemsPerSlide);
                carousel.totalSlides = totalSlides;

                // Crear dots
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                    for (let i = 0; i < totalSlides; i++) {
                        const dot = document.createElement('button');
                        dot.className = `featured-carousel-dot ${i === 0 ? 'active' : ''}`;
                        dot.addEventListener('click', () => this.goToSlide(containerId, i));
                        dotsContainer.appendChild(dot);
                    }
                    dotsContainer.style.display = totalSlides > 1 ? 'flex' : 'none';
                }

                // Mostrar/ocultar botones
                const prevBtn = carousel.container.querySelector('.featured-carousel-btn.prev');
                const nextBtn = carousel.container.querySelector('.featured-carousel-btn.next');
                if (prevBtn) prevBtn.style.display = totalSlides > 1 ? 'flex' : 'none';
                if (nextBtn) nextBtn.style.display = totalSlides > 1 ? 'flex' : 'none';

                // Iniciar auto-slide
                if (carousel.autoSlide && totalSlides > 1) {
                    this.startAutoSlide(containerId);
                }

                requestAnimationFrame(() => this.goToSlide(containerId, 0));
            },

            goToSlide(containerId, slideIndex) {
                const carousel = this.carousels[containerId];
                if (!carousel) return;

                carousel.currentSlide = slideIndex;
                const carouselEl = document.getElementById(`${containerId}-carousel`);
                const dotsContainer = document.getElementById(`${containerId}-dots`);

                if (carouselEl) {
                    const cardWidth = carouselEl.children[0]?.offsetWidth || 320;
                    const gap = 30; // Gap actualizado a 30px
                    const offset = -(slideIndex * carousel.itemsPerSlide * (cardWidth + gap));
                    carouselEl.style.transform = `translateX(${offset}px)`;
                }

                // Actualizar dots
                if (dotsContainer) {
                    const dots = dotsContainer.querySelectorAll('.featured-carousel-dot');
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === slideIndex);
                    });
                }
            },

            nextSlide(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel) return;

                const nextSlide = (carousel.currentSlide + 1) % carousel.totalSlides;
                this.goToSlide(containerId, nextSlide);
            },

            prevSlide(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel) return;

                const prevSlide = (carousel.currentSlide - 1 + carousel.totalSlides) % carousel.totalSlides;
                this.goToSlide(containerId, prevSlide);
            },

            startAutoSlide(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel || !carousel.autoSlide) return;

                this.stopAutoSlide(containerId);
                carousel.autoSlideInterval = setInterval(() => {
                    this.nextSlide(containerId);
                }, carousel.slideInterval);
            },

            stopAutoSlide(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel) return;

                if (carousel.autoSlideInterval) {
                    clearInterval(carousel.autoSlideInterval);
                    carousel.autoSlideInterval = null;
                }
            },

            onResize(containerId) {
                const carousel = this.carousels[containerId];
                if (!carousel) return;

                const oldItemsPerSlide = carousel.itemsPerSlide;
                this.updateItemsPerSlide(containerId);

                if (oldItemsPerSlide !== carousel.itemsPerSlide) {
                    this.initCarousel(containerId);
                    this.goToSlide(containerId, 0);
                }
            }
        };

        // Inicializar carruseles cuando se carguen los datos
        document.addEventListener('DOMContentLoaded', () => {
            // Esperar a que se carguen los datos
            const initCarousels = () => {
                // Carrusel de Productos Destacados
                CarouselManager.init({
                    containerId: 'featured-products-container',
                    dataSource: async () => {
                        // Intentar desde caché primero
                        if (window.featuredProducts && window.featuredProducts.length > 0) {
                            // Ordenar por orden_destacado si existe
                            const sorted = [...window.featuredProducts].sort((a, b) => {
                                const orderA = parseInt(a.orden_destacado) || 999;
                                const orderB = parseInt(b.orden_destacado) || 999;
                                return orderA - orderB;
                            });
                            return sorted;
                        }

                        // Si no hay en caché, cargar desde servidor
                        try {
                            const response = await fetch('get_featured_products.php');
                            const data = await response.json();
                            if (data && data.length > 0) {
                                window.featuredProducts = data;
                                // Ya vienen ordenados del servidor, pero asegurar
                                const sorted = [...data].sort((a, b) => {
                                    const orderA = parseInt(a.orden_destacado) || 999;
                                    const orderB = parseInt(b.orden_destacado) || 999;
                                    return orderA - orderB;
                                });
                                return sorted;
                            }
                        } catch (error) {
                            // Silencioso
                        }

                        // Fallback: usar productos regulares si no hay destacados
                        if (window.products && window.products.length > 0) {
                            return window.products.slice(0, 8);
                        }
                        return [];
                    },
                    renderCard: (product) => {
                        const hasDiscount = product.descuento && parseFloat(product.descuento) > 0;
                        const discountPercent = hasDiscount ? parseFloat(product.descuento) : 0;
                        const price = parseFloat(product.precio) || 0;
                        const finalPrice = hasDiscount ? price * (1 - discountPercent / 100) : price;
                        const ordenDestacado = product.orden_destacado;

                        return `
                            <div class="featured-product-card" data-product-id="${product.id_producto}">
                                ${ordenDestacado ? `<div class="featured-badge">#${ordenDestacado}</div>` : '<div class="featured-badge">TOP</div>'}
                                <div class="product-img-wrapper">
                                    <img class="product-img" 
                                         src="${product.imagen_principal || 'images/default-product.png'}" 
                                         alt="${product.nombre_producto || 'Producto'}" 
                                         onerror="this.src='images/default-product.png'">
                                </div>
                                <div class="product-content">
                                    <h3 class="product-title">${product.nombre_producto || 'Producto sin nombre'}</h3>
                                    <div class="price-container">
                                        <span class="product-price">$${finalPrice.toFixed(2)}</span>
                                        ${hasDiscount ? `
                                            <span class="product-original-price">$${price.toFixed(2)}</span>
                                            <span class="product-discount">-${discountPercent}%</span>
                                        ` : ''}
                                    </div>
                                    <button class="add-to-cart" data-product-id="${product.id_producto}">
                                        <i class="bi bi-cart-plus"></i>
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        `;
                    },
                    autoSlide: true,
                    slideInterval: 5000
                });

                // Carrusel de Categorías
                CarouselManager.init({
                    containerId: 'categories-container',
                    dataSource: async () => {
                        let categories = [];
                        if (window.categories && window.categories.length > 0) {
                            categories = window.categories;
                        } else {
                            const response = await fetch('get_categories.php');
                            categories = await response.json();
                        }
                        
                        // Agregar categoría especial "Todos los productos" al inicio
                        const allProductsCategory = {
                            id_categoria: 'all',
                            nombre_categoria: 'Todos los Productos',
                            imagen_categoria: '',
                            isSpecial: true
                        };
                        
                        return [allProductsCategory, ...categories];
                    },
                    renderCard: (category) => {
                        const isAllProducts = category.id_categoria === 'all';
                        const hasImage = category.imagen_categoria && category.imagen_categoria !== '';
                        const clickHandler = isAllProducts ? 'openAllProducts()' : `openCategory(${category.id_categoria})`;
                        
                        return `
                            <div class="category-card ${isAllProducts ? 'all-products-card' : ''}" data-category-id="${category.id_categoria}" onclick="${clickHandler}">
                                ${hasImage ? `
                                    <img class="category-image" 
                                         src="${category.imagen_categoria}" 
                                         alt="${category.nombre_categoria || 'Categoría'}" 

                                         onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;background:linear-gradient(135deg,#F6DA01,#FFD700);display:flex;align-items:center;justify-content:center\\'><i class=\\'bi bi-grid\\' style=\\'font-size:4rem;color:#222\\'></i></div>'">
                                ` : `
                                    <div style="width:100%;height:100%;background:linear-gradient(135deg, ${isAllProducts ? '#00c8ff, #0066ff' : '#F6DA01, #FFD700'});display:flex;align-items:center;justify-content:center">
                                        <i class="${isAllProducts ? 'bi bi-grid-3x3-gap-fill' : 'bi bi-grid'}" style="font-size:4rem;color:#222"></i>
                                    </div>
                                `}
                                <div class="category-overlay">
                                    <h3 class="category-title">${category.nombre_categoria || 'Categoría'}</h3>
                                    <button class="category-btn">
                                        <i class="bi bi-arrow-right"></i>
                                        ${isAllProducts ? 'Ver Todos' : 'Ver Productos'}
                                    </button>
                                </div>
                            </div>
                        `;
                    },
                    autoSlide: true,
                    slideInterval: 6000
                });

                // Carrusel de Servicios
                CarouselManager.init({
                    containerId: 'services-container',
                    dataSource: () => {
                        // Servicios estáticos de ejemplo
                        return [
                            { id: 1, nombre: 'Netflix', imagen: 'images/services/netflix.png', tipo: 'streaming' },
                            { id: 2, nombre: 'Spotify', imagen: 'images/services/spotify.png', tipo: 'streaming' },
                            { id: 3, nombre: 'CFE', imagen: 'images/services/cfe.png', tipo: 'servicios' },
                            { id: 4, nombre: 'Megacable', imagen: 'images/services/megacable.png', tipo: 'servicios' },
                            { id: 5, nombre: 'Movistar', imagen: 'images/services/movistar.png', tipo: 'recargas' },
                            { id: 6, nombre: 'Telcel', imagen: 'images/services/telcel.png', tipo: 'recargas' }
                        ];
                    },
                    renderCard: (service) => {
                        const hasImage = service.imagen && service.imagen !== '';
                        return `
                            <div class="service-card" data-service-id="${service.id}" onclick="openService('${service.tipo}', ${service.id})">
                                <div class="service-img-wrapper">
                                    ${hasImage ? `
                                        <img class="service-img" 
                                             src="${service.imagen}" 
                                             alt="${service.nombre || 'Servicio'}" 

                                             onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;background:linear-gradient(135deg,#222,#444);display:flex;align-items:center;justify-content:center\\'><i class=\\'bi bi-gear-fill\\' style=\\'font-size:4rem;color:#F6DA01\\'></i></div>'">
                                    ` : `
                                        <div style="width:100%;height:100%;background:linear-gradient(135deg,#222,#444);display:flex;align-items:center;justify-content:center">
                                            <i class="bi bi-gear-fill" style="font-size:4rem;color:#F6DA01"></i>
                                        </div>
                                    `}
                                </div>
                                <div class="service-overlay">
                                    <h3 class="service-title">${service.nombre || 'Servicio'}</h3>
                                    <button class="service-btn">
                                        <i class="bi bi-arrow-right-circle"></i>
                                        Ver más
                                    </button>
                                </div>
                            </div>
                        `;
                    },
                    autoSlide: true,
                    slideInterval: 7000
                });
            };

            // Primero, registrar el listener para cuando se carguen los datos
            window.addEventListener('dataLoaded', (e) => {
                initCarousels();
            });

            // Si ya hay datos en caché, inicializar inmediatamente
            if (window.cacheLoaded || (window.products && window.products.length > 0)) {
                setTimeout(initCarousels, 100); // Small delay para asegurar que DOM está listo
            }

            // Fallback: Intentar inicializar después de 2 segundos si no se ha hecho
            setTimeout(() => {
                if (!document.querySelector('.featured-product-card')) {
                    initCarousels();
                }
            }, 2000);
        });

        // Funciones auxiliares para interacción
        function addToCart(productId) {
            if (typeof Cart !== 'undefined' && Cart.add) {
                const product = window.products?.find(p => p.id_producto == productId);
                if (product) {
                    Cart.add(product);
                    
                    // Mostrar notificación de éxito
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
            }
        }
        
        // Event delegation para botones de agregar al carrito
        document.addEventListener('click', function(e) {
            if (e.target.closest('.add-to-cart')) {
                const button = e.target.closest('.add-to-cart');
                const productId = button.dataset.productId;
                if (productId) {
                    addToCart(productId);
                }
            }
        });

        function openCategory(categoryId) {
            // 🚀 Transición suave antes de redireccionar
            document.body.style.transition = 'opacity 0.3s ease-in-out';
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = `categoria.php?id=${categoryId}`;
            }, 300);
        }

        function openAllProducts() {
            // 🚀 Transición suave antes de redireccionar
            document.body.style.transition = 'opacity 0.3s ease-in-out';
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = 'categoria.php?id=all';
            }, 300);
        }

        async function openService(type, serviceId) {
            console.log('Opening service:', type, serviceId);
            
            // Abrir servicio específico según el tipo
            if (type === 'streaming' && serviceId === 1) {
                // Netflix
                const { NetflixServices } = await import('./js/modulos/netflix-services.js');
                NetflixServices.init();
            } else if (type === 'streaming' && serviceId === 2) {
                // Spotify
                const { SpotifyServices } = await import('./js/modulos/spotify-services.js');
                SpotifyServices.init();
            } else if (type === 'servicios' && serviceId === 3) {
                // CFE
                Swal.fire({
                    title: 'CFE',
                    text: 'Próximamente disponible',
                    icon: 'info'
                });
            } else if (type === 'servicios' && serviceId === 4) {
                // Megacable
                Swal.fire({
                    title: 'Megacable',
                    text: 'Próximamente disponible',
                    icon: 'info'
                });
            } else if (type === 'recargas' && serviceId === 5) {
                // Movistar
                const { MovistarServices } = await import('./js/modulos/movistar-services.js');
                MovistarServices.init();
            } else if (type === 'recargas' && serviceId === 6) {
                // Telcel
                const { TelcelServices } = await import('./js/modulos/telcel-services.js');
                TelcelServices.init();
            } else {
                // Servicio no implementado
                Swal.fire({
                    title: 'Servicio no disponible',
                    text: 'Este servicio estará disponible próximamente',
                    icon: 'info'
                });
            }
        }
    </script>

</body>

</html>
