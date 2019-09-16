<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Tests\Api;

use App\Entity\User;
use App\Test\ApiTestCase;

class UserTest extends ApiTestCase
{
  public function getResourceClass(): string
  {
    return User::class;
  }

  public function getFields(): array
  {
    $this->faker->seed(100);
    return [
      'email' => $this->faker->email,
      'password' => $this->faker->password,
      'firstName' => $this->faker->firstName,
      'lastName' => $this->faker->lastName,
    ];
  }

  public function testGetMe()
  {
    $response = $this->request('GET', '/api/me');

    $this->assertEquals(200, $response->getStatusCode());
    $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

    $this->assertJsonStringEqualsJsonString(
      json_encode([
        "@context" => "/api/contexts/User",
        "@id" => "/api/users/1",
        "@type" => "User",
        "id" => 1,
        "email" => "test@test.com",
        "roles" => ["ROLE_USER"],
        "firstName" => "Test",
        "lastName" => "Test"
      ]),
      $response->getContent());
  }
}
