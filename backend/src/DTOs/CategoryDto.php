<?php

namespace App\DTOs;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "CategoryDto",
    title: "Categoría con Subcategorías",
    required: ["id", "nombre", "subcategorias"]
)]
class CategoryDto
{
    #[OA\Property(property: "id", type: "integer", example: 1)]
    public int $id;

    #[OA\Property(property: "nombre", type: "string", example: "Bebidas")]
    public string $nombre;

    #[OA\Property(property: "imagen_categoria", type: "string", nullable: true, example: "data:image/jpeg;base64,...")]
    public ?string $imagen_categoria;

    #[OA\Property(
        property: "subcategorias",
        type: "array",
        items: new OA\Items(ref: "#/components/schemas/SubcategoryDto")
    )]
    public array $subcategorias;
}
