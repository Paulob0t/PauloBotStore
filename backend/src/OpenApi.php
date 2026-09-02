<?php

namespace App;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "PauloBot Store REST API",
    description: "API REST moderna para la plataforma de vending y comercio automatizado PauloBot Store. Migración desacoplada con arquitectura SPA.",
    contact: new OA\Contact(name: "PauloBot Store Team", email: "admin@paulobot.com")
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Servidor de Desarrollo Local (FrankenPHP)"
)]
#[OA\Tag(
    name: "Autenticación",
    description: "Endpoints de inicio de sesión, registro, sesión activa y cierre de sesión"
)]
#[OA\Tag(
    name: "Dashboard",
    description: "Endpoints de métricas, estadísticas e información operativa en tiempo real"
)]
#[OA\Tag(
    name: "Productos",
    description: "Endpoints de gestión de catálogo, creación, consulta e inventario de productos"
)]
#[OA\Tag(
    name: "Categorías",
    description: "Endpoints de consulta de categorías y subcategorías"
)]
#[OA\Tag(
    name: "Documentación",
    description: "Endpoints de especificación Swagger y OpenAPI"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Introduce el token JWT para acceder a los endpoints protegidos"
)]
class OpenApi
{
}
