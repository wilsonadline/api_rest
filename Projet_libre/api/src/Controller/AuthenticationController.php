<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthenticationController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }



    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request)
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        $email = $data['email'] ?? null;
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return $this->json($data, 400, ['Content-Type' => 'application/json']);
        }

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $username]);
        if ($existingUser) {
            return $this->json(['error' => 'User with this username already exists'], 409, ['Content-Type' => 'application/json']);
        }

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return $this->json(['error' => 'User with this email already exists'], 409, ['Content-Type' => 'application/json']);
        }

        try {
            $user = new User();
            $user->setEmail($email);
            $user->setUsername($username);
            // Sécuriser le mot de passe avant l'enregistrement en base de données
            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $password
            );
            $user->setPassword($hashedPassword);
            $user->setRole('ROLE_USER');
        
            // Enregistrer l'utilisateur en base de données
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        
            // Créer une réponse avec les détails de l'utilisateur enregistré
            $userDetails = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'role' => $user->getRole(),
            ];
        
            return $this->json($userDetails, 201, ['Content-Type' => 'application/json']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500, ['Content-Type' => 'application/json']);
        }   
    }

    #[Route('/authenticate', name: 'app_authenticate', methods: ['POST', 'OPTIONS'])]
    public function authenticate(Request $request, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager)
    {
        // Récupérer les données de la requête
        $content = json_decode($request->getContent(), true);
        $email = $content['email'] ?? null;
        $password = $content['password'] ?? null;

        // Vérifier si l'email et le mot de passe sont fournis
        if (!$email || !$password) {
            return $this->json(['error' => 'Email and password are required'], 401, ['Content-Type' => 'application/json']);
        }

        // Convertir l'email en minuscules
        $email = strtolower($email);

        // Rechercher l'email dans la base de données (en ignorant la casse)
        $userRepository = $this->entityManager->getRepository(User::class);
        $user = $userRepository->createQueryBuilder('u')
            ->where('LOWER(u.email) = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();

        // Vérifier si l'email existe
        if (!$user) {
            return $this->json(['error' => 'Invalid email or password'], 401, ['Content-Type' => 'application/json']);
        }

        if (!$passwordHasher->isPasswordValid($user, $password)) {
            return $this->json(['error' => 'Invalid email or password'], 401, ['Content-Type' => 'application/json']);
        }

        // Générer un token JWT
        $token = $jwtManager->create($user);
        return $this->json(['token' => $token, 'user' => 
            ['id' => $user->getId(), 'email' => $user->getEmail(), 'role' => $user->getRole()]
    ], 200, ['Content-Type' => 'application/json']);
    }

    #[Route('/me', name: 'app_me', methods: ['GET'])]
    public function getAuthenticatedUser()
    {
        // Récupérer l'utilisateur actuellement authentifié
        $user = $this->getUser();

        // Vérifier si l'utilisateur est authentifié
        if (!$user) {
            return $this->json(['error' => 'User is not authenticated'], 401, ['Content-Type' => 'application/json']);
        }
        
        // Retourner les détails de l'utilisateur
        $userDetails = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'role' => $user->getRole()
        ];

        return $this->json($userDetails, 200, ['Content-Type' => 'application/json']);
    }

}
