<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Product;
use Symfony\Component\HttpFoundation\Request;

#[Route('/productmanage')]
class ProductManageController extends AbstractController
{
    private $productRepository;
    private $entityManager;

    public function __construct(ProductRepository $productRepository, EntityManagerInterface $entityManager)
    {
        $this->productRepository = $productRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/{id}', name: 'app_product_delete', methods: ['DELETE'])]
    public function deleteProduct($id): JsonResponse
    {
        // Seulement s'il est administrateur
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Access denied'], 403);
        }

        // Récupérer le produit par son ID
        $product = $this->productRepository->find($id);

        // Vérifier si le produit existe
        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        $this->entityManager->remove($product);
        $this->entityManager->flush();

        return $this->json(['message' => 'Product deleted'], 200);
    }

    #[Route('', name: 'app_product_create', methods: ['POST'])]
    public function createProduct(Request $request): JsonResponse
    {
        // Seulement s'il est administrateur
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Access denied'], 403);
        }

        $data = json_decode($request->getContent(), true);

        // Check if name is already in use
        $existingProduct = $this->productRepository->findOneBy(['name' => $data['name']]);
        if ($existingProduct) {
            return $this->json(['message' => 'Name already in use'], 400);
        }

        $product = new Product();
        $product->setName($data['name']);
        $product->setPrice($data['price']);
        $product->setDescription($data['description']);
        $product->setStock($data['stock'] ?? 0);

        $this->entityManager->persist($product);
        $this->entityManager->flush();

        
        // Return info about the new product
        $productData = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'price' => $product->getPrice(),
            'description' => $product->getDescription(),
            'stock' => $product->getStock(),
        ];

        return $this->json($productData, 201);
    }

    #[Route('/{id}', name: 'app_product_update', methods: ['PUT'])]
    public function updateProduct(Request $request, $id): JsonResponse
    {
        // Seulement s'il est administrateur
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Access denied'], 403);
        }

        // Récupérer le produit à mettre à jour
        $product = $this->productRepository->find($id);

        // Vérifier si le produit existe
        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // check if name is already in use
        $existingProduct = $this->productRepository->findOneBy(['name' => $data['name']]);
        if ($existingProduct && $existingProduct->getId() !== $product->getId()) {
            return $this->json(['message' => 'Name already in use'], 400);
        }

        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        if (isset($data['price'])) {
            $product->setPrice($data['price']);
        }
        if (isset($data['description'])) {
            $product->setDescription($data['description']);
        }
        if (isset($data['stock'])) {
            $product->setStock($data['stock']);
        }

        $this->entityManager->flush();

        // Return info about the updated product
        $productData = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'price' => $product->getPrice(),
            'description' => $product->getDescription(),
            'stock' => $product->getStock(),
        ];

        return $this->json([
            'message' => 'Product updated successfully',
            'product' => $productData,
        ], 200);
    }
}
