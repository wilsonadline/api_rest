<?php

namespace App\Controller;

use App\Entity\Address;
use App\Repository\AddressRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/address')]
class AddressController extends AbstractController
{
    private $addressRepository;
    private $entityManager;

    public function __construct(AddressRepository $addressRepository, EntityManagerInterface $entityManager)
    {
        $this->addressRepository = $addressRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/', name: 'address_list', methods: ['GET'])]
    public function listAddresses(): JsonResponse
    {   
        $roles = $this->getUser()->getRoles();
        if (!in_array('ROLE_ADMIN', $roles, true)) {
            $addresses = $this->addressRepository->findBy(['user' => $this->getUser()]);
            $elements = [];
        
            foreach ($addresses as $address) {
            $userdata = [
                'id' => $address->getUser()->getId(),
                'username' => $address->getUser()->getUsername(),
            ];
                $elements[] = [
                    'id' => $address->getId(),
                    'street' => $address->getStreet(),
                    'postalCode' => $address->getPostalCode(),
                    'city' => $address->getCity(),
                    'country' => $address->getCountry(),
                    'user' => $userdata,
                ];
            }
        
            return $this->json($elements, 200, [], ['groups' => 'address']);
        }

        // Récupérer toutes les adresses
        $addresses = $this->addressRepository->findAll();
        $elements = [];
    
        foreach ($addresses as $address) {
            $userdata = [
                'id' => $address->getUser()->getId(),
                'username' => $address->getUser()->getUsername(),
            ];
            $elements[] = [
                'id' => $address->getId(),
                'street' => $address->getStreet(),
                'postalCode' => $address->getPostalCode(),
                'city' => $address->getCity(),
                'country' => $address->getCountry(),
                'user' => $userdata,
            ];
        }
    
        return $this->json($elements, 200, [], ['groups' => 'address']);
    }
    
    #[Route('/{id}', name: 'address_show', methods: ['GET'])]
    public function showAddress($id): JsonResponse
    {
        // Récupérer l'adresse par son ID
        $address = $this->addressRepository->find($id);
    
        if (!$address) {
            return $this->json(['message' => 'Address not found'], 404);
        }
        
        // Vérifier si l'utilisateur est administrateur ou si l'adresse lui appartient
        if (!in_array('ROLE_ADMIN', $this->getUser()->getRoles(), true) && $address->getUser() !== $this->getUser()) {
            return $this->json(['message' => 'You are not allowed to view this address'], 403);
        }
        
        // Construire la réponse avec les détails de l'adresse
        $addressDetails = [
            'id' => $address->getId(),
            'street' => $address->getStreet(),
            'postalCode' => $address->getPostalCode(),
            'city' => $address->getCity(),
            'country' => $address->getCountry(),
        ];
    
        return $this->json($addressDetails, 200, [], ['groups' => 'address']);
    }
    
    #[Route('', name: 'address_create', methods: ['POST'])]
    public function createAddress(Request $request): JsonResponse
    {
        // Créer une nouvelle adresse à partir des données JSON envoyées dans la requête
        $data = json_decode($request->getContent(), true);
        $address = new Address();

        // Get user
        $user = $this->getUser();
        $address->setUser($user);

        $address->setStreet($data['street']);
        $address->setPostalCode($data['postalCode']);
        $address->setCity($data['city']);
        $address->setCountry($data['country']);

        // Persist the entity
        $this->entityManager->persist($address);
        $this->entityManager->flush();

        $elements = [
            'id' => $address->getId(),
            'street' => $address->getStreet(),
            'postalCode' => $address->getPostalCode(),
            'city' => $address->getCity(),
            'country' => $address->getCountry(),
        ];

        return $this->json($elements, 201, [], ['groups' => 'address']);
    }

    #[Route('/{id}', name: 'address_update', methods: ['PUT'])]
    public function updateAddress(Request $request, $id): JsonResponse
    {
        // Récupérer l'adresse à mettre à jour
        $address = $this->addressRepository->find($id);
        // Vérifier si l'adresse existe
        if (!$address) {
            return $this->json(['message' => 'Address not found'], 404);
        }
    
        // Vérifier si l'utilisateur est administrateur
        if (!in_array('ROLE_ADMIN', $this->getUser()->getRoles(), true)) {
            // Vérifier si l'utilisateur est le propriétaire de l'adresse
            if ($address->getUser() !== $this->getUser()) {
                return $this->json(['message' => 'You are not allowed to update this address'], 403);
            }
        }
    
        // Récupérer les données de la requête
        $data = json_decode($request->getContent(), true);
    
        // Mettre à jour les champs uniquement s'ils sont envoyés dans la requête
        if (isset($data['street'])) {
            $address->setStreet($data['street']);
        }
        if (isset($data['postalCode'])) {
            $address->setPostalCode($data['postalCode']);
        }
        if (isset($data['city'])) {
            $address->setCity($data['city']);
        }
        if (isset($data['country'])) {
            $address->setCountry($data['country']);
        }
    
        // Enregistrer les modifications dans la base de données
        $this->entityManager->flush();
    
        $address = [
            'id' => $address->getId(),
            'street' => $address->getStreet(),
            'postalCode' => $address->getPostalCode(),
            'city' => $address->getCity(),
            'country' => $address->getCountry(),
        ];

        // Retourner la réponse avec les données mises à jour
        return $this->json($address, 200, [], ['groups' => 'address']);
    }    

    #[Route('/{id}', name: 'address_delete', methods: ['DELETE'])]
    public function deleteAddress($id): JsonResponse
    {
        // Récupérer l'adresse à supprimer
        $address = $this->addressRepository->find($id);
    
        if (!$address) {
            return $this->json(['message' => 'Address not found'], 404);
        }
    
        // Vérifier si l'utilisateur est administrateur
        if (in_array('ROLE_ADMIN', $this->getUser()->getRoles(), true)) {
            // Si l'utilisateur est administrateur, supprimer directement l'adresse
            $this->entityManager->remove($address);
            $this->entityManager->flush();
    
            return $this->json(['success' => true], 200);
        }
    
        // Si l'utilisateur n'est pas administrateur, vérifier s'il est le propriétaire de l'adresse
        if ($address->getUser() !== $this->getUser()) {
            return $this->json(['success' => false], 403);
        }
    
        // Si l'utilisateur est le propriétaire de l'adresse, supprimer l'adresse
        $this->entityManager->remove($address);
        $this->entityManager->flush();
    
        return $this->json(['success' => true], 200);
    }
    
}
