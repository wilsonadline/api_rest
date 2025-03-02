<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Entity\User;
use App\Entity\Address;

class ControllerTest extends WebTestCase
{
    private static ?string $token = null;
    protected $client;

    // set up
    protected function setUp(): void
{
    // Créer un client
    $this->client = static::createClient();
}

    public function testAuthenticate(): string
    {
        $client = $this->client;
        $container = static::getContainer();

        // Vérifier si l'utilisateur existe déjà
        $userRepository = $container->get('doctrine')->getRepository(User::class);
        $existingUser = $userRepository->findOneBy(['username' => 'testuser']);
        if ($existingUser !== null) {
            // Si l'utilisateur existe, supprimer l'utilisateur
            $entityManager = $container->get('doctrine')->getManager();
            $entityManager->remove($existingUser);
            $entityManager->flush();
        }

        // Créer un nouvel utilisateur
        $client->request('POST', '/register', [], [], [], json_encode(['username' => 'testuser', 'password' => 'testpassword']));
        $this->assertSame(201, $client->getResponse()->getStatusCode());

        // Tester la route /authenticate
        $client->request('POST', '/authenticate', [], [], [], json_encode(['username' => 'testuser', 'password' => 'testpassword']));
        $this->assertSame(200, $client->getResponse()->getStatusCode());
        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $responseData); // Vérifie la présence de la clé 'token'
        
        // Stocker le token pour une utilisation ultérieure
        self::$token = $responseData['token'];

        // Tester la route /me avec un token Bearer valide
        $client->setServerParameter('HTTP_Authorization', 'Bearer ' . self::$token);
        $client->request('GET', '/me');
        $this->assertSame(200, $client->getResponse()->getStatusCode()); 
        
        return $responseData['token'];
    }
    
    /**
     * @depends testAuthenticate
     */
    public function testUser(
        $token
    ): void
    {

        
        $client = $this->client;

        // Test de la route /user sans token Bearer
        $client->request('GET', '/user');
        $this->assertSame(401, $client->getResponse()->getStatusCode());

        // Test de la route /user avec token Bearer valide
        $client->setServerParameter('HTTP_Authorization', 'Bearer ' . $token);
        $client->request('GET', '/user');
        $this->assertSame(200, $client->getResponse()->getStatusCode());

        // Test de l'ajout d'un utilisateur avec ROLE_USER
        $client->request('POST', '/register', [], [], [], json_encode(['username' => 'testuser2', 'password' => 'testpassword2']));
        // get id of the user
        $userRepository = self::getContainer()->get('doctrine')->getRepository(User::class);
        $user = $userRepository->findOneBy(['username' => 'testuser2']);
        $this->assertSame(201, $client->getResponse()->getStatusCode());
        // Test de la suppression avec ROLE_USER
        $client->request('DELETE', '/user/' . $user->getId());
        $this->assertSame(403, $client->getResponse()->getStatusCode());

        // Update user to admin
        $userRepository = self::getContainer()->get('doctrine')->getRepository(User::class);
        $user_admin = $userRepository->findOneBy(['username' => 'testuser']);
        $user_admin->setRole('ROLE_ADMIN');
        $entityManager = self::getContainer()->get('doctrine')->getManager();
        $entityManager->persist($user_admin);
        $entityManager->flush();
        // Auth with new user admin
        $client->request('POST', '/authenticate', [], [], [], json_encode(['username' => 'testuser', 'password' => 'testpassword']));
        $this->assertSame(200, $client->getResponse()->getStatusCode());
        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $responseData); // Vérifie la présence de la clé 'token'
        self::$token = $responseData['token'];

        // Test de la suppression avec ROLE_ADMIN
        $client->setServerParameter('HTTP_Authorization', 'Bearer ' . self::$token);
        $client->request('DELETE', '/user/' . $user->getId());
        $this->assertSame(200, $client->getResponse()->getStatusCode());

    }

    public function testAddress(): void
    {
        $client = $this->client;

        // Test de la route /address/ avec token Bearer valide
        $client->setServerParameter('HTTP_Authorization', 'Bearer ' . self::$token);
        $client->request('GET', '/address/');
        $this->assertSame(200, $client->getResponse()->getStatusCode());

        // Test de l'ajout d'une adresse avec token Bearer valide
        $client->request('POST', '/address', [], [], [], json_encode(['street' => '123 Main St', 'postalCode' => '12345', 'city' => 'Springfield', 'country' => 'USA']));
        $this->assertSame(201, $client->getResponse()->getStatusCode());
        $address = json_decode($client->getResponse()->getContent(), true);
        // get id of the address
        $addressRepository = self::getContainer()->get('doctrine')->getRepository(Address::class);
        $address = $addressRepository->findOneBy(['street' => '123 Main St']);
        


        // Create new user
        $client->request('POST', '/register', [], [], [], json_encode(['username' => 'testuser3', 'password' => 'testpassword3']));
        $this->assertSame(201, $client->getResponse()->getStatusCode());
        $client->request('POST', '/authenticate', [], [], [], json_encode(['username' => 'testuser3', 'password' => 'testpassword3']));
        $this->assertSame(200, $client->getResponse()->getStatusCode());
        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $responseData); // Vérifie la présence de la clé 'token'
        $client->setServerParameter('HTTP_Authorization', 'Bearer ' . $responseData['token']);

        // Test de la suppression d'une adresse qui n'est pas la sienne avec ROLE_USER
        $client->request('DELETE', '/address/' . $address->getId());
        $this->assertSame(403, $client->getResponse()->getStatusCode());

        // Update user to admin
        $userRepository = self::getContainer()->get('doctrine')->getRepository(User::class);
        $user_admin = $userRepository->findOneBy(['username' => 'testuser']);
        $user_admin->setRole('ROLE_ADMIN');
        $entityManager = self::getContainer()->get('doctrine')->getManager();
        $entityManager->persist($user_admin);
        $entityManager->flush();
        // Auth with new user admin
        $client->request('POST', '/authenticate', [], [], [], json_encode(['username' => 'testuser', 'password' => 'testpassword']));
        $this->assertSame(200, $client->getResponse()->getStatusCode());
        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $responseData); // Vérifie la présence de la clé 'token'
        self::$token = $responseData['token'];

        // Test de la suppression d'une adresse qui n'est pas la sienne avec ROLE_ADMIN
        $client->setServerParameter('HTTP_Authorization', 'Bearer ' . self::$token);
        $client->request('DELETE', '/address/'. $address->getId());
        $this->assertSame(200, $client->getResponse()->getStatusCode());

        // $entityManager = self::getContainer()->get('doctrine')->getManager();
        // $connection = $entityManager->getConnection();
        // $platform = $connection->getDatabasePlatform();
        // $connection->executeStatement($platform->getTruncateTableSQL('user', true));
        // $connection->executeStatement($platform->getTruncateTableSQL('address', true));
    }
}
