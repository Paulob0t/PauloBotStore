<?php

declare(strict_types=1);

// Manejo global para garantizar SIEMPRE respuestas JSON (Cero HTML)
set_exception_handler(function (\Throwable $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
});

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\DocsController;
use App\Core\Response;
use App\Core\Router;

// Aplicar cabeceras CORS
Response::applyCorsHeaders();

$router = new Router();

// Rutas de Documentación Swagger / OpenAPI
$router->get('/api/v1/openapi.json', [DocsController::class, 'openApiJson']);
$router->get('/api/docs', [DocsController::class, 'swaggerUi']);
$router->get('/api/docs/swagger.json', [DocsController::class, 'openApiJson']);

// Rutas de Autenticación
$router->post('/api/v1/auth/login', [AuthController::class, 'login']);
$router->post('/api/v1/auth/register', [AuthController::class, 'register']);
$router->get('/api/v1/auth/me', [AuthController::class, 'me']);
$router->post('/api/v1/auth/logout', [AuthController::class, 'logout']);

// Rutas del Dashboard
$router->get('/api/v1/dashboard', [DashboardController::class, 'getMetrics']);

// Dispatch de la solicitud
$router->dispatch();
