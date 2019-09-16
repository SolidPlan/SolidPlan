<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Tests\Api;

use App\Entity\Label;
use App\Entity\Project;
use App\Entity\Task;
use App\Entity\User;
use App\Test\ApiTestCase;

class TaskTest extends ApiTestCase
{
  public function getResourceClass(): string
  {
    return Task::class;
  }

  public function getFields(): array
  {
    return [
      'name' => $this->faker->sentence(4),
      'description' => $this->faker->text(),
      'status' => $this->faker->randomElement(['open', 'closed'])
    ];
  }

  public function testAssignTaskToProject()
  {
    $task = $this->findOneIriBy(['project' => null]);

    $project = $this->findOneIriBy(['id' => 1], Project::class);
    $response = $this->request('PUT', $task, ['project' => $project]);
    $json = json_decode($response->getContent(), true);

    $this->assertEquals(200, $response->getStatusCode());
    $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

    $this->assertArrayHasKey('project', $json);
    $this->assertSame($project, $json['project']);
  }

  public function testRemoveTaskFromProject()
  {
    $task = $this->findOneIriBy(['id' => 2]);

    $response = $this->request('PUT', $task, ['project' => null]);
    $json = json_decode($response->getContent(), true);

    $this->assertEquals(200, $response->getStatusCode());
    $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

    $this->assertArrayHasKey('project', $json);
    $this->assertSame(null, $json['project']);
  }

  public function testAssignTaskToUser()
  {
    $task = $this->findOneIriBy(['assigned' => null]);

    $user = $this->findOneIriBy(['id' => 1], User::class);
    $response = $this->request('PUT', $task, ['assigned' => $user]);
    $json = json_decode($response->getContent(), true);

    $this->assertEquals(200, $response->getStatusCode());
    $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

    $this->assertArrayHasKey('assigned', $json);
    $this->assertSame($user, $json['assigned']);
  }

  public function testRemoveUserFromProject()
  {
    $task = $this->findOneIriBy(['id' => 2]);

    $response = $this->request('PUT', $task, ['assigned' => null]);
    $json = json_decode($response->getContent(), true);

    $this->assertEquals(200, $response->getStatusCode());
    $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

    $this->assertArrayHasKey('assigned', $json);
    $this->assertSame(null, $json['assigned']);
  }

  public function testAssignLabelsToProject()
  {
    $task = $this->findOneIriBy(['id' => 4]);

    $label = $this->findOneIriBy(['id' => 6], Label::class);
    $response = $this->request('PUT', $task, ['labels' => [$label]]);
    $json = json_decode($response->getContent(), true);

    $this->assertEquals(200, $response->getStatusCode());
    $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

    $this->assertArrayHasKey('labels', $json);
    $this->assertSame([$label], $json['labels']);
  }

  public function testSort()
  {
    $task = $this->findOneIriBy(['order' => 8]);

    $response = $this->request('PUT', $task.'/sort', ['order' => 3]);
    $json = json_decode($response->getContent(), true);

    $this->assertEquals(200, $response->getStatusCode());
    $this->assertEquals('application/ld+json; charset=utf-8', $response->headers->get('Content-Type'));

    $this->assertArrayHasKey('order', $json);
    $this->assertSame(3, $json['order']);
  }

  public function testStats()
  {
    $response = $this->request('GET', '/api/tasks/stats');
    $json = json_decode($response->getContent(), true);

    $this->assertEquals(200, $response->getStatusCode());
    $this->assertEquals('application/json', $response->headers->get('Content-Type'));

    $this->assertArrayHasKey('open', $json);
    $this->assertTrue(is_numeric($json['open']));
    $this->assertArrayHasKey('closed', $json);
    $this->assertTrue(is_numeric($json['closed']));
    $this->assertArrayHasKey('assigned', $json);
    $this->assertTrue(is_numeric($json['assigned']));
  }
}
