<?php

namespace App\Controllers;

use App\Core\Response;
use App\DTOs\ApiResponse;
use App\DTOs\CategoryDto;
use App\Models\Category;
use OpenApi\Attributes as OA;

class CategoryController
{
    private Category $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new Category();
    }

    #[OA\Get(
        path: "/api/v1/categories",
        operationId: "getCategories",
        summary: "Obtener listado de categorías con sus subcategorías",
        description: "Retorna todas las categorías registradas con sus subcategorías anidadas para selectors y filtros.",
        tags: ["Categorías"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Listado de categorías",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/CategoryDto")
                )
            ),
            new OA\Response(
                response: 500,
                description: "Error al consultar categorías",
                content: new OA\JsonContent(ref: "#/components/schemas/ApiResponse")
            )
        ]
    )]
    public function getCategories(): void
    {
        try {
            $categories = $this->categoryModel->getCategoriesWithSubcategories();
            Response::json($categories, 200);
        } catch (\Throwable $e) {
            Response::error('Error al obtener categorías: ' . $e->getMessage(), null, 500);
        }
    }
}
