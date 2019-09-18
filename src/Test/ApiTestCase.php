<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Test;

use ApiPlatform\Core\Api\OperationType;
use ApiPlatform\Core\Bridge\Symfony\Routing\RouteNameGenerator;
use App\Entity\User;
use App\Test\Traits\FakerTrait;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

/**
 * @codeCoverageIgnore
 */
abstract class ApiTestCase extends WebTestCase
{
    use RefreshDatabaseTrait;
    use FakerTrait;

    /**
     * @var KernelBrowser
     */
    protected $client;

    private static $jwt;

    protected function setUp()
    {
        parent::setUp();

        $this->client = static::createClient();
    }

    /**
     * @param string|array|null $content
     */
    protected function request(string $method, string $uri, $content = null, array $headers = []): Response
    {
        $server = ['CONTENT_TYPE' => 'application/ld+json', 'HTTP_ACCEPT' => 'application/ld+json'];
        foreach ($headers as $key => $value) {
            if ('content-type' === strtolower($key)) {
                $server['CONTENT_TYPE'] = $value;

                continue;
            }

            $server['HTTP_'.strtoupper(str_replace('-', '_', $key))] = $value;
        }

        if (!self::$jwt) {
            self::$jwt = static::$container->get('lexik_jwt_authentication.jwt_manager')->create(static::$container->get('doctrine')->getRepository(User::class)->find(1));
        }

        $server['HTTP_AUTHORIZATION'] = 'Bearer '.self::$jwt;

        if (is_array($content) && false !== preg_match('#^application/(?:.+\+)?json$#', $server['CONTENT_TYPE'])) {
            $content = json_encode($content);
        }

        $this->client->request($method, $uri, [], [], $server, $content);

        return $this->client->getResponse();
    }

    protected function findOneIriBy(array $criteria, string $resourceClass = ''): string
    {
        $resource = static::$container->get('doctrine')->getRepository($resourceClass ?: $this->getResourceClass())->findOneBy($criteria);

        return static::$container->get('api_platform.iri_converter')->getIriFromitem($resource);
    }

    abstract public function getResourceClass(): string;

    abstract public function getFields(): array;

    public function testResourceCollectionTest(): void
    {
        $resourceMetadata = static::$container->get('api_platform.metadata.resource.metadata_factory')->create($this->getResourceClass());
        $router = static::$container->get('router');

        foreach ($resourceMetadata->getCollectionOperations() as $name => $operation) {
            $path = $router->generate(RouteNameGenerator::generate($name, $resourceMetadata->getShortName(), OperationType::COLLECTION));

            switch ($name) {
        case 'get':
          $response = $this->request($operation['method'], $path);
          $json = json_decode($response->getContent(), true);

          $this->assertEquals(200, $response->getStatusCode());
          $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

          $this->assertArrayHasKey('hydra:totalItems', $json);
          $this->assertEquals(10, $json['hydra:totalItems']);

          $this->assertArrayHasKey('hydra:member', $json);
          $this->assertCount(10, $json['hydra:member']);
          break;

        case 'post':
          $data = $this->getFields();

          $response = $this->request('POST', $path, $data);
          $json = json_decode($response->getContent(), true);

          if (500 === $response->getStatusCode()) {
              echo $response->getContent();
          }

          $this->assertEquals(201, $response->getStatusCode());
          $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

          foreach ($data as $key => $value) {
              if ('password' === $key) {
                  continue;
              }

              $this->assertArrayHasKey($key, $json);
              $this->assertSame($value, $json[$key]);
          }
          break;
      }
        }
    }

    public function testResourceItemTest(): void
    {
        $resourceMetadata = static::$container->get('api_platform.metadata.resource.metadata_factory')->create($this->getResourceClass());

        foreach ($resourceMetadata->getItemOperations() as $name => $operation) {
            switch ($name) {
        case 'put':
          $data = $this->getFields();

          do {
              $field = $this->faker->randomKey($data);
          } while ('password' === $field);

          $response = $this->request('PUT', $this->findOneIriBy(['id' => 1]), [$field => '1234']);
          $json = json_decode($response->getContent(), true);

          $this->assertEquals(200, $response->getStatusCode());
          $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

          $this->assertArrayHasKey($field, $json);
          $this->assertSame('1234', $json[$field]);
          break;

        case 'delete':
          $response = $this->request('DELETE', $this->findOneIriBy(['id' => 4]));

          $this->assertEquals(204, $response->getStatusCode());

          $this->assertEmpty($response->getContent());
          break;
      }
        }
    }
}
