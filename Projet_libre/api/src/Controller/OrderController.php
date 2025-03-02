<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserOrderRepository;
use App\Entity\UserOrder;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\ProductRepository;
use App\Entity\UserOrderProduct;
use App\Repository\UserOrderProductRepository;
use App\Repository\UserOrderStatusRepository;
use App\Entity\UserOrderStatus;

#[Route('/order')]
class OrderController extends AbstractController
{
    private $orderRepository;
    private $entityManager;
    private $productRepository;
    private $userOrderProductRepository;
    private $userOrderStatusRepository;

    public function __construct(UserOrderRepository $orderRepository, EntityManagerInterface $entityManager, ProductRepository $productRepository, UserOrderProductRepository $userOrderProductRepository, UserOrderStatusRepository $userOrderStatusRepository)
    {
        $this->orderRepository = $orderRepository;
        $this->entityManager = $entityManager;
        $this->productRepository = $productRepository;
        $this->userOrderProductRepository = $userOrderProductRepository;
        $this->userOrderStatusRepository = $userOrderStatusRepository;
    }

    #[Route('/', name: 'app_order_list', methods: ['GET'])]
    public function listOrders(): JsonResponse
    {   
        // get all orders of user connect or all orders if user is admin
        if ($this->isGranted('ROLE_ADMIN')) {
            $orders = $this->orderRepository->findAll();
        } else {
            $orders = $this->orderRepository->findBy(['user' => $this->getUser()]);
        }

        // get products of each order :
        $products = [];
        foreach ($orders as $order) {
            $userOrderProducts = $order->getUserOrderProducts();
        }

        // get products of each order :
        $products = [];
        foreach ($userOrderProducts as $userOrderProduct) {
            $products[] = [
                'id' => $userOrderProduct->getProductId()->getId(),
                'name' => $userOrderProduct->getProductId()->getName(),
                'price' => $userOrderProduct->getProductId()->getPrice(),
                'quantity' => $userOrderProduct->getQuantity(),
            ];
        }


        $elements = [];
        foreach ($orders as $order) {
            $elements[] = [
                'id' => $order->getId(),
                'user_id' => $order->getUserId()->getId(),
                'status' => $order->getStatusId()->getStatus(),
                'total_price' => $order->getTotalPrice(),
                'products' => $products,
            ];
        }

        return $this->json($elements, 200);
    }

    #[Route('/{id}', name: 'app_order_details', methods: ['GET'])]
    public function getOrderDetails($id): JsonResponse
    {
        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        // get products
        $products = $order->getUserOrderProducts();

        $elements = [];
        foreach ($products as $product) {
            $elements[] = [
                'id' => $product->getId(),
                'order_id' => $product->getOrderId()->getId(),
                'product_id' => $product->getProductId()->getId(),
                'quantity' => $product->getQuantity(),
                'price' => $product->getPrice(),
            ];
        }


        $orderDetails = [
            'id' => $order->getId(),
            'user_id' => $order->getUserId()->getId(),
            'status_id' => $order->getStatusId()->getStatus(),
            'total_price' => $order->getTotalPrice(),
            'products' => $elements,
        ];

        return $this->json($orderDetails, 200);
    }

    #[Route('/{id}', name: 'app_order_delete', methods: ['DELETE'])]
    public function deleteOrder($id): JsonResponse
    {
        // Seulement s'il est administrateur
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Access denied'], 403);
        }

        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        $this->entityManager->remove($order);
        $this->entityManager->flush();

        return $this->json(['message' => 'Order deleted'], 200);
    }

    #[Route('', name: 'app_order_create', methods: ['POST'])]
    public function createOrder(Request $request): JsonResponse
    {
        // Récupérer la liste des commandes de l'utilisateur et vérifier si l'une d'elles est en cours
        $orders = $this->orderRepository->findBy(['user' => $this->getUser()]);
        // get status each order of user : 
        $userOrderStatus = [];
        foreach ($orders as $order) {
            $userOrderStatus[] = $order->getStatusId()->getStatus();
        }
        // check if one of the order is pending and close for create a new order
        if (in_array('pending', $userOrderStatus)) {
            $this->deleteOrder($order->getId());
        }

        $data = json_decode($request->getContent(), true);

        $order = new UserOrder();
        $order->setUserId($this->getUser());

        // Create a UserOrderStatus
        $status = new UserOrderStatus();
        $status->setStatus('pending');
        $this->entityManager->persist($status);
        $this->entityManager->flush();

        $order->setStatusId($status);

        $order->setTotalPrice(0);

        $this->entityManager->persist($order);
        $this->entityManager->flush();

        // Return info about the new order
        $orderData = [
            'id' => $order->getId(),
            'user_id' => $order->getUserId()->getId(),
            'status' => $order->getStatusId()->getStatus(),
            'total_price' => $order->getTotalPrice(),
        ];

        return $this->json($orderData, 201);
    }

    #[Route('/{id}', name: 'app_order_update', methods: ['PUT'])]
    public function updateOrder(Request $request, $id): JsonResponse
    {
        // Seulement s'il est administrateur
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Access denied'], 403);
        }

        // Récupérer la commande à mettre à jour
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        // Récupérer les données envoyées dans la requête
        $data = json_decode($request->getContent(), true);

        // Mettre à jour les données de la commande
        if (isset($data['user_id'])) {
            $order->setUserId($data['user_id']);
        }
        if (isset($data['status_id'])) {
            $order->setStatusId($data['status_id']);
        }
        if (isset($data['total_price'])) {
            $order->setTotalPrice($data['total_price']);
        }

        // Enregistrer les modifications dans la base de données
        $this->entityManager->flush();

        return $this->json(['message' => 'Order updated successfully']);
    }

        //************ //
    //******************/ PRODUCTS ORDER /**************/
        //************ //

    #[Route('/{id}/products', name: 'app_order_products', methods: ['GET'])]
    public function getOrderProducts($id): JsonResponse
    {
        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        $products = $order->getUserOrderProducts();

        $elements = [];
        foreach ($products as $product) {
            $elements[] = [
                'id' => $product->getId(),
                'order_id' => $product->getOrderId()->getId(),
                'product_id' => $product->getProductId()->getId(),
                'quantity' => $product->getQuantity(),
                'price' => $product->getPrice(),
            ];
        }

        return $this->json($elements, 200);
    }

    #[Route('/{id}/products', name: 'app_order_add_product', methods: ['POST'])]
    public function addProductToOrder(Request $request, $id): JsonResponse
    {
        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Récupérer le produit par son ID
        $product = $this->productRepository->find($data['product_id']);

        // Vérifier si le produit existe
        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        // Vérifier si le produit est en stock
        if ($product->getStock() < $data['quantity']) {
            return $this->json(['message' => 'Product out of stock'], 400);
        }
        
        $userOrderProduct = new UserOrderProduct();
        $userOrderProduct->setOrderId($order);
        $userOrderProduct->setProductId($product);
        $userOrderProduct->setQuantity($data['quantity']);
        $userOrderProduct->setPrice($product->getPrice());

        $this->entityManager->persist($userOrderProduct);
        $this->entityManager->flush();

        // Mettre à jour le prix total de la commande
        $order->setTotalPrice($order->getTotalPrice() + $product->getPrice() * $data['quantity']);
        $this->entityManager->flush();

        // Enlever la quantité du stock
        $product->setStock($product->getStock() - $data['quantity']);
        $this->entityManager->flush();

        return $this->json(['message' => 'Product added to order'], 201);
    }

    #[Route('/{id}/products/{product_id}', name: 'app_order_remove_product', methods: ['DELETE'])]
    public function removeProductFromOrder($id, $product_id): JsonResponse
    {
        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        // Récupérer le produit par son ID
        $product = $this->productRepository->find($product_id);

        // Vérifier si le produit existe
        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        // Récupérer le produit de la commande
        $userOrderProduct = $this->userOrderProductRepository->findOneBy(['order' => $id, 'product' => $product_id]);

        // Vérifier si le produit est dans la commande
        if (!$userOrderProduct) {
            return $this->json(['message' => 'Product not in order'], 404);
        }

        // Mettre à jour le prix total de la commande
        $order->setTotalPrice($order->getTotalPrice() - $product->getPrice() * $userOrderProduct->getQuantity());
        $this->entityManager->flush();

        // Ajouter la quantité au stock
        $product->setStock($product->getStock() + $userOrderProduct->getQuantity());
        $this->entityManager->flush();

        $this->entityManager->remove($userOrderProduct);
        $this->entityManager->flush();

        // Check s'il y a un produit dans la commande
        $products = $order->getUserOrderProducts();
        if (count($products) === 0) {
            $this->entityManager->remove($order);
            $this->entityManager->flush();
        }

        return $this->json(['message' => 'Product removed from order'], 200);
    }

    // Add quantity to a product in an order
    #[Route('/{id}/products/{product_id}/quantity', name: 'app_order_add_product_quantity', methods: ['POST'])]
    public function addProductQuantityToOrder(Request $request, $id, $product_id): JsonResponse
    {
        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        // Récupérer le produit par son ID
        $product = $this->productRepository->find($product_id);

        // Vérifier si le produit existe
        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        // Récupérer le produit de la commande
        $userOrderProduct = $this->userOrderProductRepository->findOneBy(['order' => $id, 'product' => $product_id]);

        // Vérifier si le produit est dans la commande
        if (!$userOrderProduct) {
            return $this->json(['message' => 'Product not in order'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Vérifier si la quantité est valide
        if ($product->getStock() < $data['quantity']) {
            return $this->json(['message' => 'Product out of stock'], 400);
        }

        // Mettre à jour le prix total de la commande
        $order->setTotalPrice($order->getTotalPrice() + $product->getPrice() * $data['quantity']);
        $this->entityManager->flush();

        // Ajouter la quantité au stock
        $product->setStock($product->getStock() - $data['quantity']);
        $this->entityManager->flush();

        // Ajouter la quantité au produit de la commande
        $userOrderProduct->setQuantity($userOrderProduct->getQuantity() + $data['quantity']);
        $this->entityManager->flush();

        return $this->json(['message' => 'Product quantity added to order'], 200);
    }

    // Remove quantity from a product in an order
    #[Route('/{id}/products/{product_id}/quantity', name: 'app_order_remove_product_quantity', methods: ['DELETE'])]
    public function removeProductQuantityFromOrder(Request $request, $id, $product_id): JsonResponse
    {
        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        // Récupérer le produit par son ID
        $product = $this->productRepository->find($product_id);

        // Vérifier si le produit existe
        if (!$product) {
            return $this->json(['message' => 'Product not found'], 404);
        }

        // Récupérer le produit de la commande
        $userOrderProduct = $this->userOrderProductRepository->findOneBy(['order' => $id, 'product' => $product_id]);

        // Vérifier si le produit est dans la commande
        if (!$userOrderProduct) {
            return $this->json(['message' => 'Product not in order'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Vérifier si la quantité est valide
        if ($userOrderProduct->getQuantity() < $data['quantity']) {
            return $this->json(['message' => 'Invalid quantity'], 400);
        }

        // Mettre à jour le prix total de la commande
        $order->setTotalPrice($order->getTotalPrice() - $product->getPrice() * $data['quantity']);
        $this->entityManager->flush();

        // Ajouter la quantité au stock
        $product->setStock($product->getStock() + $data['quantity']);
        $this->entityManager->flush();

        // Ajouter la quantité au produit de la commande
        $userOrderProduct->setQuantity($userOrderProduct->getQuantity() - $data['quantity']);
        $this->entityManager->flush();

        return $this->json(['message' => 'Product quantity removed from order'], 200);
    }

        //************ //
    //******************/ STATUS ORDER /**************/
        //************ //
    #[Route('/{id}/status', name: 'app_order_update_status', methods: ['PUT'])]
    public function updateOrderStatus(Request $request, $id): JsonResponse
    {
        // Seulement s'il est administrateur
        // if (!$this->isGranted('ROLE_ADMIN')) {
        //     return $this->json(['message' => 'Access denied'], 403);
        // }

        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Récupérer le statut de la commande actuelle
        $status = $order->getStatusId();

        // Vérifier si le statut existe
        if (!$status) {
            return $this->json(['message' => 'Status not found'], 404);
        }

        // Mettre à jour le statut de la commande
        $status->setStatus($data['status']);
        $this->entityManager->flush();

        return $this->json(['message' => 'Order status updated'], 200);
    }

    #[Route('/{id}/status', name: 'app_order_delete_status', methods: ['DELETE'])]
    public function deleteOrderStatus($id): JsonResponse
    {
        // Seulement s'il est administrateur
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Access denied'], 403);
        }

        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        $order->setStatusId(null);

        $this->entityManager->flush();

        return $this->json(['message' => 'Order status deleted'], 200);
    }

    #[Route('/{id}/status', name: 'app_order_add_status', methods: ['POST'])]
    public function addOrderStatus(Request $request, $id): JsonResponse
    {
        // Seulement s'il est administrateur
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Access denied'], 403);
        }

        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Récupérer le statut par son ID
        $status = $this->userOrderStatusRepository->find($data['status']);

        // Vérifier si le statut existe
        if (!$status) {
            return $this->json(['message' => 'Status not found'], 404);
        }

        $order->setStatusId($status);

        $this->entityManager->flush();

        return $this->json(['message' => 'Order status added'], 201);
    }

    #[Route('/{id}/status', name: 'app_order_status', methods: ['GET'])]
    public function getOrderStatus($id): JsonResponse
    {
        // Récupérer la commande par son ID
        $order = $this->orderRepository->find($id);

        // Vérifier si la commande existe
        if (!$order) {
            return $this->json(['message' => 'Order not found'], 404);
        }

        $status = $order->getStatusId();

        if (!$status) {
            return $this->json(['message' => 'Status not found'], 404);
        }

        $statusData = [
            'id' => $status->getId(),
            'status' => $status->getStatus(),
        ];

        return $this->json($statusData, 200);
    }
}
