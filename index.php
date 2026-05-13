<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>VendingBox | Máquinas Expendedoras Inteligentes - Cotiza tu Negocio Automatizado</title>
    <meta name="description" content="Genera ingresos pasivos 24/7 con VendingBox. Máquinas expendedoras inteligentes de snacks, bebidas y productos personalizados. Cotiza tu solución hoy.">
    <meta name="keywords" content="vending box, máquinas expendedoras, negocio automatizado, ingresos pasivos, venta por cotización">
    <meta name="author" content="VendingBox">
    <link rel="icon" type="image/png" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23F7941D'/%3E%3Ctext x='50' y='67' font-size='50' text-anchor='middle' fill='white' font-weight='bold'%3EVB%3C/text%3E%3C/svg%3E">
    
    <!-- Preconnect y fuentes optimizadas -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #1e2a3e;
            line-height: 1.5;
            scroll-behavior: smooth;
        }

        h1, h2, h3, h4, .btn, .nav-link {
            font-family: 'Poppins', sans-serif;
        }

        /* Sin subrayados en enlaces */
        a {
            text-decoration: none !important;
        }

        /* Variables elegantes */
        :root {
            --primary: #F7941D;
            --primary-dark: #e07c0f;
            --secondary: #1e2a3e;
            --gray-light: #f8fafc;
            --gray-border: #e2e8f0;
            --shadow-sm: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            --shadow-md: 0 20px 25px -12px rgba(0, 0, 0, 0.08);
            --shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
        }

        /* Header sticky */
        .header {
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.05);
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(0px);
            background: rgba(255,255,255,0.98);
        }
        .header-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            flex-wrap: wrap;
            gap: 16px;
        }
        .logo {
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, var(--primary) 0%, #ffb347 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            letter-spacing: -0.5px;
        }
        .logo span {
            color: var(--secondary);
            background: none;
            -webkit-background-clip: unset;
            background-clip: unset;
        }
        .nav {
            display: flex;
            gap: 32px;
            align-items: center;
            flex-wrap: wrap;
        }
        .nav a {
            font-weight: 500;
            color: #334155;
            transition: color 0.2s;
        }
        .nav a:hover, .nav a.active {
            color: var(--primary);
        }
        /* Botón Admin */
        .btn-admin {
            background: transparent;
            border: 1.5px solid var(--primary);
            color: var(--primary);
            padding: 8px 20px;
            border-radius: 40px;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.25s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn-admin:hover {
            background: var(--primary);
            color: white;
            transform: translateY(-2px);
        }
        .btn-primary {
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px 28px;
            border-radius: 40px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.25s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 5px rgba(247,148,29,0.2);
        }
        .btn-primary:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(247,148,29,0.4);
        }
        .btn-outline {
            background: transparent;
            border: 2px solid var(--primary);
            color: var(--primary);
            padding: 10px 24px;
            border-radius: 40px;
            font-weight: 600;
            transition: 0.2s;
        }
        .btn-outline:hover {
            background: var(--primary);
            color: white;
        }
        
        /* Hero Section - con imagen profesional */
        .hero {
            padding: 80px 0 80px;
            background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
        }
        .hero-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            align-items: center;
        }
        .hero-content h1 {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 24px;
            color: #0f172a;
        }
        .hero-content h1 span {
            color: var(--primary);
        }
        .hero-content p {
            font-size: 1.2rem;
            color: #475569;
            margin-bottom: 32px;
            max-width: 90%;
        }
        .hero-stats {
            display: flex;
            gap: 32px;
            margin-top: 40px;
        }
        .stat-item h3 {
            font-size: 2rem;
            font-weight: 800;
            color: var(--primary);
        }
        /* Imagen profesional - máquina vending moderna */
        .hero-image {
            background: linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 100%);
            border-radius: 32px;
            padding: 20px;
            text-align: center;
            box-shadow: var(--shadow-lg);
            min-height: 380px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .hero-image::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 40%, rgba(247,148,29,0.08) 0%, transparent 70%);
        }
        .vending-mockup {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 320px;
            background: #1e293b;
            border-radius: 28px;
            padding: 20px 16px;
            box-shadow: 0 30px 40px -20px rgba(0,0,0,0.3);
            margin: 0 auto;
        }
        .vending-screen {
            background: #0f172a;
            border-radius: 20px;
            padding: 20px 12px;
            text-align: center;
            color: white;
        }
        .vending-screen i {
            font-size: 48px;
            color: var(--primary);
            margin-bottom: 12px;
            display: block;
        }
        .vending-screen p {
            font-size: 12px;
            color: #94a3b8;
            margin: 0;
        }
        .vending-products {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 20px;
        }
        .product-slot {
            background: #334155;
            width: 50px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        .vending-panel {
            background: #f1f5f9;
            border-radius: 16px;
            margin-top: 20px;
            padding: 12px;
            display: flex;
            justify-content: space-between;
        }
        .vending-panel span {
            background: #cbd5e1;
            width: 35px;
            height: 8px;
            border-radius: 10px;
        }
        /* Secciones */
        .section {
            padding: 80px 0;
            border-bottom: 1px solid var(--gray-border);
        }
        .section-title {
            text-align: center;
            margin-bottom: 56px;
        }
        .section-title h2 {
            font-size: 2.3rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 16px;
        }
        .section-title p {
            font-size: 1.1rem;
            color: #475569;
            max-width: 680px;
            margin: 0 auto;
        }
        .badge {
            background: #fff0e0;
            color: var(--primary);
            display: inline-block;
            padding: 6px 14px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 0.8rem;
            margin-bottom: 16px;
        }
        /* Beneficios grid */
        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 32px;
        }
        .benefit-card {
            background: white;
            padding: 32px 24px;
            border-radius: 28px;
            box-shadow: var(--shadow-sm);
            transition: all 0.3s;
            border: 1px solid var(--gray-border);
            text-align: center;
        }
        .benefit-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--shadow-md);
            border-color: var(--primary);
        }
        .benefit-icon {
            background: #fff3e6;
            width: 70px;
            height: 70px;
            line-height: 70px;
            text-align: center;
            border-radius: 50%;
            margin: 0 auto 24px;
            font-size: 32px;
            color: var(--primary);
        }
        .benefit-card h3 {
            font-size: 1.5rem;
            margin-bottom: 12px;
        }
        /* Cómo funciona */
        .steps {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 32px;
            margin-top: 20px;
        }
        .step {
            flex: 1;
            min-width: 200px;
            background: var(--gray-light);
            border-radius: 32px;
            padding: 32px 24px;
            text-align: center;
            position: relative;
            transition: all 0.3s;
        }
        .step:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-sm);
        }
        .step-number {
            background: var(--primary);
            width: 48px;
            height: 48px;
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 60px;
            margin: 0 auto 20px;
        }
        /* lugares */
        .locations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 24px;
            text-align: center;
        }
        .location-item {
            background: white;
            padding: 20px;
            border-radius: 28px;
            box-shadow: var(--shadow-sm);
            font-weight: 500;
            transition: all 0.2s;
            border: 1px solid var(--gray-border);
        }
        .location-item:hover {
            border-color: var(--primary);
            transform: translateY(-3px);
        }
        /* CTA final */
        .cta-section {
            background: linear-gradient(110deg, #0f172a 0%, #1e293b 100%);
            color: white;
            border-radius: 48px;
            padding: 64px 48px;
            text-align: center;
            margin: 40px auto;
        }
        .cta-section h2 {
            font-size: 2rem;
            margin-bottom: 20px;
        }
        .cta-section .btn-primary {
            background: white;
            color: var(--primary);
            box-shadow: none;
            margin-top: 20px;
        }
        .cta-section .btn-primary:hover {
            background: var(--primary);
            color: white;
            transform: scale(1.02);
        }
        /* Formulario cotización */
        .quote-form {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 36px;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--gray-border);
        }
        .form-group {
            margin-bottom: 24px;
        }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 14px 20px;
            border-radius: 60px;
            border: 1px solid var(--gray-border);
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
            transition: 0.2s;
        }
        .form-group textarea {
            border-radius: 24px;
            resize: vertical;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(247,148,29,0.2);
        }
        .footer {
            background: #0f172a;
            color: #cbd5e1;
            padding: 48px 0 32px;
            margin-top: 40px;
        }
        .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 40px;
        }
        .footer a {
            color: #94a3b8;
            transition: color 0.2s;
        }
        .footer a:hover {
            color: var(--primary);
        }
        .copyright {
            text-align: center;
            padding-top: 40px;
            border-top: 1px solid #1e293b;
            margin-top: 40px;
            font-size: 0.85rem;
        }
        @media (max-width: 768px) {
            .hero-grid {
                grid-template-columns: 1fr;
                text-align: center;
            }
            .hero-content p {
                max-width: 100%;
            }
            .hero-stats {
                justify-content: center;
            }
            .header-inner {
                flex-direction: column;
            }
            .nav {
                justify-content: center;
            }
            .section-title h2 {
                font-size: 1.8rem;
            }
            .cta-section {
                padding: 40px 24px;
            }
            .quote-form {
                padding: 24px;
            }
        }
        .floating-wa {
            position: fixed;
            bottom: 28px;
            right: 28px;
            background: #25D366;
            color: white;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 99;
            transition: 0.2s;
        }
        .floating-wa:hover {
            transform: scale(1.08);
            background: #128C7E;
        }
        .alert-toast {
            position: fixed;
            bottom: 100px;
            right: 28px;
            background: #1e2a3e;
            color: white;
            padding: 12px 24px;
            border-radius: 60px;
            z-index: 1000;
            font-weight: 500;
            box-shadow: var(--shadow-md);
        }
        hr {
            border: none;
            border-top: 1px solid var(--gray-border);
        }
    </style>
</head>
<body>

<div class="header">
    <div class="container">
        <div class="header-inner">
            <div class="logo">Vending<span>Box</span></div>
            <div class="nav">
                <a href="#inicio">Inicio</a>
                <a href="#beneficios">Beneficios</a>
                <a href="#modelo">Cómo funciona</a>
                <a href="#ubicaciones">Ubicaciones</a>
                <a href="https://vendingbox.online/sistema/admin/dist/login.php" class="btn-admin" target="_blank">
                    <i class="fas fa-user-shield"></i> Acceso Admin
                </a>
                <a href="#cotizar" class="btn-primary" style="padding: 8px 20px;">Cotizar ahora</a>
            </div>
        </div>
    </div>
</div>

<main>
    <!-- Hero con diseño profesional -->
    <section id="inicio" class="hero">
        <div class="container">
            <div class="hero-grid">
                <div class="hero-content">
                    <div class="badge"><i class="fas fa-charging-station"></i> 24/7 · Ingresos Automáticos</div>
                    <h1>Convierte cualquier espacio en <span>una máquina de dinero</span></h1>
                    <p>Genera ingresos pasivos las 24 horas con nuestras Vending Box inteligentes. Sin empleados, sin complejidad. Solo resultados.</p>
                    <a href="#cotizar" class="btn-primary"><i class="fas fa-calculator"></i> Solicita tu cotización</a>
                    <div class="hero-stats">
                        <div class="stat-item"><h3>24/7</h3><span>Operación continua</span></div>
                        <div class="stat-item"><h3>-70%</h3><span>Costos operativos</span></div>
                        <div class="stat-item"><h3>+40%</h3><span>ROI proyectado</span></div>
                    </div>
                </div>
                <div class="hero-image">
                    <div class="vending-mockup">
                        <div class="vending-screen">
                            <i class="fas fa-cash-register"></i>
                            <p>Touch & Pay</p>
                        </div>
                        <div class="vending-products">
                            <div class="product-slot"><i class="fas fa-cookie"></i></div>
                            <div class="product-slot"><i class="fas fa-bottle-water"></i></div>
                            <div class="product-slot"><i class="fas fa-mug-hot"></i></div>
                        </div>
                        <div class="vending-panel">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Beneficios -->
    <section id="beneficios" class="section">
        <div class="container">
            <div class="section-title">
                <h2>💡 Un negocio que trabaja por ti</h2>
                <p>Automatización total, bajo mantenimiento y crecimiento escalable</p>
            </div>
            <div class="benefits-grid">
                <div class="benefit-card"><div class="benefit-icon"><i class="fas fa-clock"></i></div><h3>Vende 24/7</h3><p>Sin horarios ni supervisión constante. Tu máquina trabaja incluso de madrugada.</p></div>
                <div class="benefit-card"><div class="benefit-icon"><i class="fas fa-users-slash"></i></div><h3>Sin empleados</h3><p>Operación 100% automática, olvídate de nóminas y gestión de personal.</p></div>
                <div class="benefit-card"><div class="benefit-icon"><i class="fas fa-chart-line"></i></div><h3>Escalable</h3><p>Empieza con 1 máquina y multiplica tu red fácilmente en distintos puntos.</p></div>
                <div class="benefit-card"><div class="benefit-icon"><i class="fas fa-dollar-sign"></i></div><h3>Alto margen</h3><p>Productos de alta rotación, márgenes atractivos desde el primer mes.</p></div>
            </div>
        </div>
    </section>

    <!-- Cómo funciona -->
    <section id="modelo" class="section" style="background: #fefcf8;">
        <div class="container">
            <div class="section-title">
                <h2>⚙️ ¿Cómo funciona tu Vending Box?</h2>
                <p>Sencillo, probado y efectivo</p>
            </div>
            <div class="steps">
                <div class="step"><div class="step-number">1</div><h3>Instalación</h3><p>Elegimos el punto estratégico (oficinas, escuela, hospital) y colocamos tu máquina.</p></div>
                <div class="step"><div class="step-number">2</div><h3>Autoventa</h3><p>Los clientes compran snacks/bebidas con monedero, tarjeta o efectivo. Todo automatizado.</p></div>
                <div class="step"><div class="step-number">3</div><h3>Recarga + ganancias</h3><p>Reabasteces cada cierto tiempo y recibes ingresos recurrentes sin estrés.</p></div>
            </div>
        </div>
    </section>

    <!-- Ubicaciones ideales -->
    <section id="ubicaciones" class="section">
        <div class="container">
            <div class="section-title">
                <h2>📍 Lugares con alto potencial</h2>
                <p>Más tráfico = más ventas. Estas ubicaciones maximizan tu retorno.</p>
            </div>
            <div class="locations-grid">
                <div class="location-item"><i class="fas fa-building"></i> Oficinas corporativas</div>
                <div class="location-item"><i class="fas fa-school"></i> Universidades</div>
                <div class="location-item"><i class="fas fa-hospital"></i> Hospitales</div>
                <div class="location-item"><i class="fas fa-dumbbell"></i> Gimnasios</div>
                <div class="location-item"><i class="fas fa-mall"></i> Centros comerciales</div>
                <div class="location-item"><i class="fas fa-train"></i> Estaciones de transporte</div>
            </div>
        </div>
    </section>

    <!-- Personalización -->
    <section class="section">
        <div class="container">
            <div class="benefits-grid" style="grid-template-columns: repeat(3,1fr);">
                <div class="benefit-card"><i class="fas fa-cookie-bite" style="font-size: 2rem; color: var(--primary); margin-bottom: 16px; display: block;"></i><h3>Snacks</h3><p>Máquinas de botanas, chocolates, galletas.</p></div>
                <div class="benefit-card"><i class="fas fa-wine-bottle" style="font-size: 2rem; color: var(--primary); margin-bottom: 16px; display: block;"></i><h3>Bebidas frías/calientes</h3><p>Refrescos, agua, café de especialidad.</p></div>
                <div class="benefit-card"><i class="fas fa-microchip" style="font-size: 2rem; color: var(--primary); margin-bottom: 16px; display: block;"></i><h3>Modelo personalizado</h3><p>Diseñamos la máquina según tu nicho y producto estrella.</p></div>
            </div>
        </div>
    </section>

    <!-- Formulario de Cotización -->
    <section id="cotizar" class="section">
        <div class="container">
            <div class="quote-form">
                <div style="text-align: center; margin-bottom: 24px;">
                    <i class="fas fa-file-invoice-dollar" style="font-size: 48px; color: var(--primary);"></i>
                    <h2 style="margin-top: 8px;">Solicita tu cotización</h2>
                    <p>Completa el formulario y un asesor te enviará precios, catálogo y plan de implementación.</p>
                </div>
                <form id="leadForm">
                    <div class="form-group"><input type="text" id="nombre" placeholder="Nombre completo *" required></div>
                    <div class="form-group"><input type="email" id="email" placeholder="Correo electrónico *" required></div>
                    <div class="form-group"><input type="tel" id="telefono" placeholder="Teléfono / WhatsApp"></div>
                    <div class="form-group"><select id="interes"><option value="">Selecciona tu interés</option><option>Máquina de snacks</option><option>Máquina de bebidas</option><option>Máquina combo</option><option>Quiero ser distribuidor</option></select></div>
                    <div class="form-group"><textarea rows="3" id="mensaje" placeholder="¿En qué ubicación planeas instalarla? (Opcional)"></textarea></div>
                    <button type="submit" class="btn-primary" style="width:100%; justify-content: center;"><i class="fas fa-paper-plane"></i> Enviar y recibir cotización</button>
                </form>
                <p style="font-size: 12px; text-align: center; margin-top: 20px; color: #666;">*Datos seguros. Recibirás información sin compromiso.</p>
            </div>
        </div>
    </section>

    <!-- CTA final -->
    <div class="container">
        <div class="cta-section">
            <h2>🚀 Empieza hoy tu negocio automatizado</h2>
            <p>No necesitas experiencia previa. Nosotros te guiamos desde la selección hasta la operación.</p>
            <a href="#cotizar" class="btn-primary" style="background: white; color: var(--primary);"><i class="fas fa-cart-plus"></i> ¡Quiero mi Vending Box!</a>
        </div>
    </div>
</main>

<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div><h4 style="color:white;">VendingBox</h4><p>Soluciones inteligentes de vending para generar ingresos pasivos 24/7.</p></div>
            <div><h4 style="color:white;">Enlaces</h4><p><a href="#inicio">Inicio</a><br><a href="#beneficios">Beneficios</a><br><a href="#cotizar">Cotizar</a></p></div>
            <div><h4 style="color:white;">Contacto</h4><p><i class="fas fa-envelope"></i> ventas@vendingbox.mx<br><i class="fab fa-whatsapp"></i> +52 55 1234 5678</p></div>
        </div>
        <div class="copyright">© 2025 VendingBox – Máquinas expendedoras inteligentes. Todos los derechos reservados.</div>
    </div>
</footer>

<a href="https://wa.me/525512345678?text=Hola%2C%20quiero%20cotizar%20una%20Vending%20Box" class="floating-wa" target="_blank"><i class="fab fa-whatsapp"></i></a>

<script>
    // Formulario de cotización
    const form = document.getElementById('leadForm');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            if(!nombre) {
                alert('Por favor ingresa tu nombre');
                return;
            }
            const toast = document.createElement('div');
            toast.className = 'alert-toast';
            toast.innerHTML = '<i class="fas fa-check-circle"></i> ¡Cotización enviada! Un asesor te contactará en breve.';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);
            form.reset();
        });
    }

    // Smooth scroll sin subrayados
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === "#" || targetId === "") return;
            const target = document.querySelector(targetId);
            if(target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
</script>
</body>
</html>