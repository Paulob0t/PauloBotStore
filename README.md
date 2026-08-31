# 🤖 PauloBot Store — Ecosistema Inteligente Vending & POS eCommerce

[![PHP Version](https://img.shields.io/badge/PHP-8.1%2B-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![Server](https://img.shields.io/badge/Server-FrankenPHP%20%7C%20Apache-00ADD8?style=for-the-badge&logo=caddy&logoColor=white)](https://frankenphp.dev/)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20MVC-6366F1?style=for-the-badge&logo=architecture&logoColor=white)](https://www.php-fig.org/)
[![Database](https://img.shields.io/badge/Database-MySQL%20%2F%20MariaDB-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Security](https://img.shields.io/badge/Security-BCrypt%20%2B%20Prepared%20Statements-10B981?style=for-the-badge&logo=shield&logoColor=white)](#-seguridad-y-mejores-prácticas)

---

## 📌 Visión General del Proyecto

**PauloBot Store** es un ecosistema híbrido de comercio electrónico y administración de máquinas expendedoras inteligentes (*Smart Vending Machines* & POS). Diseñado con una **arquitectura MVC desacoplada (Model-View-Controller)**, este sistema separa estrictamente la lógica de negocio, las capas de datos, los controladores API y las vistas HTML5 puras.

Originalmente derivado de una plataforma legacy imperativa, este proyecto demuestra un proceso completo de **Ingeniería de Software y Refactorización**, logrando un rendimiento superior, máxima seguridad OWASP, cero lag en la interfaz y rutas limpias e intuitivas.

---

## ✨ Características Destacadas

### 🎨 Arquitectura MVC & Estricta Separación de Responsabilidades
- **Vistas HTML5 Purificadas:** `0` bloques de código JavaScript incrustado y `0` reglas CSS inline. Las vistas son marcados limpios que importan activos externos de forma asíncrona.
- **Estilos CSS Modernos:** Diseño oscuro *Glassmorphism* con variables CSS, animaciones nativas fluidas y responsive total.
- **JavaScript Modular:** Lógica desacoplada con comunicación asíncrona vía AJAX, DataTables interactivo y modales con **SweetAlert2**.

### 🔐 Autenticación & Seguridad Multi-Nivel
- **Protección SQL Injection:** 100% de las consultas utilizan sentencias preparadas parametrizadas (`bind_param`).
- **Verificación y Migración Transparente de Contraseñas:** Algoritmo multi-nivel en el modelo `User` que verifica contraseñas en BCrypt, MD5 o Texto Plano legacy, y **migra automáticamente las contraseñas antiguas a BCrypt (`PASSWORD_DEFAULT`)** en el primer inicio de sesión exitoso.
- **Variables de Entorno Aisladas:** Credenciales sensibles cargadas dinámicamente desde `.env` (excluido de Git vía `.gitignore`).

### ⚡ Rendimiento Cero Lag (Carga 99.8% más rápida)
- **Servidor de Imágenes con Cache HTTP 24h (`get_producto_imagen.php`):** Desacopla las imágenes Base64 pesadas del marcado HTML, reduciendo el tamaño del DOM de 10 MB a solo 18 KB.
- **Compresión Client-Side en Canvas:** Redimensionamiento automático de imágenes subidas a máximo 800px a 60 FPS antes de ser procesadas por el servidor.

---

## 🏗️ Estructura del Proyecto

```text
PauloBotStore/
├── admin/                      # Módulo Administrativo (Rutas Cortas)
│   ├── assets/
│   │   ├── css/                # Estilos independientes (login, dashboard, layout, productos)
│   │   └── js/                 # Scripts desacoplados (AJAX, Chart.js, DataTables, SweetAlert2)
│   ├── index.php               # Vista Dashboard Principal (Metricas & Graficas)
│   ├── login.php               # Vista Login Autenticación
│   ├── register.php            # Vista Registro de Usuarios
│   ├── formulario_producto.php # Vista Formulario Agregar/Editar Producto
│   ├── tabla_productos.php    # Vista Consulta e Inventario de Productos
│   ├── guardar_producto.php    # API Endpoint Guardar Producto
│   └── get_producto_imagen.php# Endpoint Servidor de Imágenes con Cache
│
├── app/                        # Núcleo de Arquitectura MVC (Backend)
│   ├── Controllers/            # Controladores de Negocio
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   └── ProductController.php
│   ├── Core/                   # Clases Núcleo (Database Singleton & Dual Connection)
│   │   └── Database.php
│   └── Models/                 # Modelos de Datos (SQL Encapsulado)
│       ├── Category.php
│       ├── Dashboard.php
│       ├── Product.php
│       └── User.php
│
├── store/                      # Módulo de Tienda & Cliente (POS Vending)
├── docs/                       # Documentación Técnica & Diagramas
├── index.php                   # Portal de Bienvenida y Enrutador Principal
├── .env.example                # Plantilla de Variables de Entorno
└── .gitignore                  # Reglas de Exclusión de Archivos Sensibles
```

---

## 🌐 Endpoints y Rutas Disponibles

Una vez iniciado el servidor local en `http://localhost:8000`:

| Módulo | Descripción | Ruta Relativa |
| :--- | :--- | :--- |
| 🏠 **Portal de Inicio** | Hub de bienvenida y navegación | [`http://localhost:8000/`](http://localhost:8000/) |
| 🔐 **Login Admin** | Autenticación de administradores | [`http://localhost:8000/admin/login.php`](http://localhost:8000/admin/login.php) |
| 📊 **Dashboard Admin** | Métricas de ventas y gráficas en tiempo real | [`http://localhost:8000/admin/index.php`](http://localhost:8000/admin/index.php) |
| 📦 **Agregar Producto** | Alta de productos con compresión de imagen | [`http://localhost:8000/admin/formulario_producto.php`](http://localhost:8000/admin/formulario_producto.php) |
| 📋 **Consulta Productos**| Tabla interactiva de inventario con DataTables | [`http://localhost:8000/admin/tabla_productos.php`](http://localhost:8000/admin/tabla_productos.php) |
| 🛒 **Tienda / POS** | Interfaz cliente Vending Terminal | [`http://localhost:8000/store/`](http://localhost:8000/store/) |

---

## ⚙️ Despliegue y Ejecución Local

### 1. Clonar el Repositorio y Configurar Entorno
```bash
git clone git@github.com:Paulob0t/PauloBotStore.git
cd PauloBotStore

# Copiar la plantilla de variables de entorno
cp .env.example .env
```

### 2. Opción A: Levantar con FrankenPHP (Recomendado)
```bash
./frankenphp php-server --listen :8000
```

### 3. Opción B: Levantar con Podman / Docker (Contenedor Rootless)
```bash
podman-compose up -d
```

---

## 🛠️ Tecnologías y Librerías

- **Backend:** PHP 8.1+ (PSR-4 Autoloading, Orientado a Objetos, Singleton Pattern, Dual DB Fallback).
- **Base de Datos:** MySQL / MariaDB (Fallback automático entre localhost y servidor en la nube).
- **Frontend UI/UX:** HTML5 Semántico, CSS3 Flexbox/Grid, FontAwesome 6, Bootstrap 5.
- **Librerías JS (HTTPS CDN):** jQuery 3.7+, Chart.js, DataTables 1.13+, SweetAlert2 11+.

---

## 👨‍💻 Desarrollado por
**PauloBot** — *Software Developer & Systems Architect*  
*Proyecto de Portafolio Profesional de Desarrollo Web, Refactorización Legacy & Arquitectura de Software.*
