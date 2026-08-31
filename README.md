# 🤖 PauloBot Store | Sistema de Vending & Ecommerce Automatizado

[![PHP Version](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=flat-square&logo=php&logoColor=white)](https://www.php.net/)
[![Server](https://img.shields.io/badge/Server-FrankenPHP-00ADD8?style=flat-square&logo=caddy&logoColor=white)](https://frankenphp.dev/)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20MVC-6366F1?style=flat-square)](https://www.php-fig.org/)
[![Status](https://img.shields.io/badge/Status-Active%20Refactoring-f59e0b?style=flat-square)](#-estado-del-proyecto--roadmap)

---

## 📌 Contexto del Proyecto

**PauloBot Store** nacio originalmente como una solución desarrollada en un entorno empresarial enfocado en la automatización de máquinas expendedoras inteligentes (*vending machines*), gestión de dispensadores, integración con monederos MDB/Serial y cortes de caja automáticos.

Actualmente, el proyecto se encuentra en una **fase integral de rediseño y refactorización** para transformar una base de código *legacy* en un ecosistema moderno, aplicando las mejores prácticas de ingeniería de software. 

### 🎯 Propósito del Rediseño (Portafolio Profesional)
Este proyecto forma parte de mi **portafolio profesional de desarrollo** y tiene como objetivos:
- **Demostrar capacidad de Refactorización Legacy:** Transformación de scripts imperativos en una arquitectura modular limpia (PSR-4, PSR-12, MVC / Repository Pattern).
- **Mejorar la Seguridad y el Rendimiento:** Implementación de consultas preparadas PDO (prevención OWASP SQLi), gestión segura de sesiones y respuestas estandarizadas.
- **Renovación Estética & UX:** Rediseño UI/UX moderno, fluido y accesible tanto para clientes como para administradores.

---

## 🚀 Características y Módulos Principales

El sistema está dividido estratégicamente en los siguientes módulos clave:

- 🛒 **Sistema de Clientes (Punto de Venta / Vending Terminal):** Interfaz para usuarios finales enfocada en selección de productos, carrito de compras y despacho automatizado.
- 🔐 **Panel de Administración (Dashboard & Control):** Gestión de inventario, catálogo, categorías, reportes de ventas y configuración general.
- 💰 **Control de Caja y Monedero:** Manejo de cortes de caja, auditoría de movimientos y comunicación con hardware monedero MDB.
- ☁️ **Sincronización Dual (Local / Nube):** Conexión híbrida resiliente que opera en entornos locales y se sincroniza automáticamente con servidores en la nube.

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** PHP 8+ (PSR-4 Autoloading, PDO, Tipado estricto `declare(strict_types=1)`).
- **Servidor Web & Runtime:** [FrankenPHP](https://frankenphp.dev/) / Caddy (Runtime portátil en Go) / Apache / Podman / Docker.
- **Base de Datos:** MySQL / MariaDB (Detección automática de ambiente local vs nube).
- **Frontend:** HTML5, CSS3 Moderno (Variables CSS, Flexbox/Grid, Glassmorphism), JavaScript ES6+, FontAwesome 6.

---

## ⚙️ Cómo Levantar el Proyecto Localmente

### Opción A: Usando el servidor portátil FrankenPHP (Recomendado)
No requiere instalar PHP globalmente en el sistema operativo:

```bash
cd ~/PauloBotStore

# Iniciar servidor local en el puerto 8000
./frankenphp php-server --listen :8000
```

### Opción B: Usando Podman / Docker
El proyecto cuenta con un `Containerfile` y `compose.yaml` listos para entorno rootless:

```bash
cd ~/PauloBotStore

# Levantar contenedor
podman-compose up -d
```

---

## 🌐 Endpoints y Rutas Disponibles

Una vez iniciado el servidor en `http://localhost:8000`:

| Sección | Descripción | Ruta |
| :--- | :--- | :--- |
| 🏠 **Portal Principal** | Bienvenida y accesos de navegación | [`http://localhost:8000`](http://localhost:8000) |
| 🛒 **Sistema de Clientes** | Tienda interactiva y terminal de compras | [`http://localhost:8000/sistema/`](http://localhost:8000/sistema/) |
| 🔐 **Panel Administrador** | Login y gestión administrativa | [`http://localhost:8000/sistema/admin/dist/login.php`](http://localhost:8000/sistema/admin/dist/login.php) |

---

## 🗺️ Estado del Proyecto & Roadmap de Refactorización

- [x] **Fase 0:** Rebrand del proyecto a **PauloBot Store** y rediseño completo de la portada [`index.php`](file:///home/paulobot/PauloBotStore/index.php).
- [x] **Fase 1:** Configuración de entorno portátil ejecutable (FrankenPHP & Podman/Containerfile).
- [ ] **Fase 2:** Infraestructura Core (`app/Core/Autoloader.php`, `Database.php`, `Session.php`, `Response.php`).
- [ ] **Fase 3:** Refactorización del Módulo de Autenticación y Administración.
- [ ] **Fase 4:** Refactorización del Módulo de Productos y Categorías.
- [ ] **Fase 5:** Refactorización del Módulo de Caja, Movimientos y Monedero.

---

### 👨‍💻 Desarrollado y Rediseñado por
**PauloBot** – Proyecto de Portafolio Profesional de Desarrollo Web & Software.
