<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;


#[Route('/user')]
class UserController extends AbstractController
{
    private $userRepository;
    private $entityManager;

    public function __construct(UserRepository $userRepository, EntityManagerInterface $entityManager)
    {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('', name: 'app_user_list', methods: ['GET'])]
    public function listUsers(): JsonResponse
    {
        if (!$this->getUser()) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }
        // Récupérer la liste des utilisateurs
        $users = $this->userRepository->findAll();

        $elements = [];
        foreach ($users as $user) {
            $elements[] = [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
            ];
        }

        // Retourner la liste complète des utilisateurs pour les administrateurs
        return $this->json($elements, 200);
    }

    #[Route('/{id}', name: 'app_user_details', methods: ['GET'])]
    public function getUserDetails($id): JsonResponse
    {
        // Récupérer l'utilisateur par son ID
        $user = $this->userRepository->find($id);

        // Vérifier si l'utilisateur existe
        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        $userDetails = [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'role' => $user->getRole(),
        ];

        // Retourner les détails complets de l'utilisateur pour les administrateurs
        return $this->json($userDetails, 200);
    }

    #[Route('/{id}', name: 'app_user_update', methods: ['PUT'])]
    public function updateUser(Request $request, $id): JsonResponse
    {
        // Récupérer l'utilisateur à mettre à jour
        $user = $this->userRepository->find($id);

        // Vérifier si l'utilisateur existe
        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }

        // Vérifier si l'utilisateur actuel est autorisé à mettre à jour cet utilisateur
        if ($this->isGranted('ROLE_USER') && $user !== $this->getUser()) {
            // $this->denyAccessUnlessGranted('ROLE_ADMIN');
            return $this->json(['message' => 'Access denied'], 403);
        }

        // Récupérer les données envoyées dans la requête
        $data = json_decode($request->getContent(), true);

        // Mettre à jour les données de l'utilisateur
        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }
        if (isset($data['role'])) {
            $user->setRole($data['role']);
        }

        // Enregistrer les modifications dans la base de données
        $this->entityManager->flush();

        return $this->json(['message' => 'User updated successfully']);
    }
    #[Route('/{id}', name: 'app_user_delete', methods: ['DELETE'])]
    public function deleteUser($id): JsonResponse
    {
        // Récupérer l'utilisateur à supprimer
        $user = $this->userRepository->find($id);
    
        // Vérifier si l'utilisateur existe
        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }
    
        // Vérifier si l'utilisateur actuel est autorisé à supprimer cet utilisateur (si c'est son profil ou s'il est administrateur)
        if ($this->getUser() !== $user && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Access denied'], 403);
        }
    
        // Récupérer les adresses associées à l'utilisateur
        $addresses = $user->getAddresses();
    
        // Supprimer chaque adresse associée
        foreach ($addresses as $address) {
            $this->entityManager->remove($address);
        }
    
        // Supprimer l'utilisateur de la base de données
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    
        return $this->json(['message' => 'User deleted successfully']);
    }

    // Récupérer les adresses associées à un utilisateur
    #[Route('/{id}/address', name: 'app_user_addresses', methods: ['GET'])]
    public function getUserAddresses($id): JsonResponse
    {
        // Récupérer l'utilisateur par son ID
        $user = $this->userRepository->find($id);
    
        // Vérifier si l'utilisateur existe
        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }
    
        // Vérifier si l'utilisateur actuel est soit le propriétaire de l'utilisateur, soit un administrateur
        if ($this->getUser() !== $user && !$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['message' => 'Access denied'], 403);
        }

    
        // Récupérer les adresses associées à l'utilisateur
        $addresses = $user->getAddresses();
    
        $elements = [];
        foreach ($addresses as $address) {
            $elements[] = [
                'id' => $address->getId(),
                'street' => $address->getStreet(),
                'postalCode' => $address->getPostalCode(),
                'city' => $address->getCity(),
                'country' => $address->getCountry(),
            ];
        }
    
        return $this->json($elements, 200);
    }
}
    