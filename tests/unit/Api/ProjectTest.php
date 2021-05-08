<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Tests\Api;

use App\Entity\Project;
use App\Test\ApiTestCase;

class ProjectTest extends ApiTestCase
{
  /**
   * Throws errors when data is invalid.
   */
  public function testThrowErrorsWhenDataIsInvalid(): void
  {
    $data = ['name' => ''];

    $response = $this->request('POST', '/api/projects', $data);
    $json = json_decode($response->getContent(), true);

    $this->assertEquals(422, $response->getStatusCode());
    $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

    $this->assertArrayHasKey('violations', $json);
    $this->assertCount(1, $json['violations']);

    $this->assertArrayHasKey('propertyPath', $json['violations'][0]);
    $this->assertEquals('name', $json['violations'][0]['propertyPath']);
  }

  public function getResourceClass(): string
  {
    return Project::class;
  }

  public function getFields(): array
  {
    return [
      'name' => $this->faker->sentence(4),
      'description' => $this->faker->text(),
      'color' => $this->faker->hexColor,
    ];
  }
}
