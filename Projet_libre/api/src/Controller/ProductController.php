<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Product;
use Symfony\Component\HttpFoundation\Request;

#[Route('/product')]
class ProductController extends AbstractController
{
    private $productRepository;
    private $entityManager;

    public function __construct(ProductRepository $productRepository, EntityManagerInterface $entityManager)
    {
        $this->productRepository = $productRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/', name: 'app_product_list', methods: ['GET'])]
    public function listProducts(): JsonResponse
    {
        // Récupérer la liste des produits
        $products = $this->productRepository->findAll();

        $elements = [];
        foreach ($products as $product) {
            $elements[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'description' => $product->getDescription(),
                'quantity' => $product->getStock(),
            ];
        }

        return $this->json($elements, 200);
    }

    #[Route('/{id}', name: 'app_product_details', methods: ['GET'])]
    public function getProductDetails($id): JsonResponse
    {
        // Récupérer le produit par son ID
        $product = $this->productRepository->find($id);

        // Vérifier si le produit existe
        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        $productDetails = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'price' => $product->getPrice(),
            'quantity' => $product->getStock(),
            'description' => $product->getDescription(),
        ];

        return $this->json($productDetails, 200);
    }
}
