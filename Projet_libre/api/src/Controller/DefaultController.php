<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends AbstractController
{
    #[Route('/testSuccess', name: 'app_test_success')]
    public function testSuccess()
    {
        $response = new Response('success', Response::HTTP_OK);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    #[Route('/testNotFound', name: 'app_test_not_found')]
    public function testNotFound()
    {
        $response = new Response('not found', Response::HTTP_NOT_FOUND);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    #[Route('/testError', name: 'app_test_error')]
    public function testError()
    {
        $response = new Response('error', Response::HTTP_INTERNAL_SERVER_ERROR);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
    #[Route('/planée', name: 'app_test_error')]
    public function planée()
    {
        $response = new Response('error', Response::HTTP_INTERNAL_SERVER_ERROR);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
}
