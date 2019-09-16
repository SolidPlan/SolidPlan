<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Tests\unit\Repository;

use App\Entity\Task;
use App\Entity\User;
use App\Repository\TaskRepository;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class TaskRepositoryTest extends KernelTestCase
{
  use RefreshDatabaseTrait;

  protected function setUp(): void
  {
    static::bootKernel();

    parent::setUp();
  }

  public function testGetTotalTasksAssignedToUser()
  {
    $repository = $this->getRepository();

    $user = $this->getUser(4);

    $this->assertGreaterThanOrEqual(0, $repository->getTotalTasksAssignedToUser($user));
  }

  public function testGetTotalTasksByStatus()
  {
    $repository = $this->getRepository();

    $this->assertGreaterThan(0, $repository->getTotalTasksByStatus('closed'));
  }

  public function testGetTaskStats()
  {
    $repository = $this->getRepository();

    $user = $this->getUser();

    $stats = $repository->getTaskStats($user);

    $this->assertArrayHasKey('open', $stats);
    $this->assertArrayHasKey('closed', $stats);
    $this->assertArrayHasKey('assigned', $stats);

    $this->assertGreaterThan(0, $stats['open']);
    $this->assertGreaterThan(0, $stats['closed']);
    $this->assertSame(0, $stats['assigned']);
  }

  public function testGetMaxOrder()
  {
    $repository = $this->getRepository();

    $this->assertSame(10, $repository->getMaxOrder());
  }

  public function testSortDescTask()
  {
    $repository = $this->getRepository();

    $task = $this->getTask(6);
    $this->assertSame(6, $task->getOrder());

    $repository->sortTask($task, 3);

    self::$container->get('doctrine')->getManager()->flush();
    self::$container->get('doctrine')->getManager()->getUnitOfWork()->clear();

    $task1 = $this->getTask(1);
    $task2 = $this->getTask(2);
    $task3 = $this->getTask(3);
    $task4 = $this->getTask(4);
    $task5 = $this->getTask(5);
    $task6 = $this->getTask(6);
    $task7 = $this->getTask(7);
    $task8 = $this->getTask(8);
    $task9 = $this->getTask(9);
    $task10 = $this->getTask(10);

    $this->assertSame(1, $task1->getOrder());
    $this->assertSame(2, $task2->getOrder());
    $this->assertSame(3, $task6->getOrder());
    $this->assertSame(4, $task3->getOrder());
    $this->assertSame(5, $task4->getOrder());
    $this->assertSame(6, $task5->getOrder());
    $this->assertSame(7, $task7->getOrder());
    $this->assertSame(8, $task8->getOrder());
    $this->assertSame(9, $task9->getOrder());
    $this->assertSame(10, $task10->getOrder());
  }


  public function testSortAscTask()
  {
    $repository = $this->getRepository();

    $task = $this->getTask(3);
    $this->assertSame(3, $task->getOrder());

    $repository->sortTask($task, 6);

    self::$container->get('doctrine')->getManager()->flush();
    self::$container->get('doctrine')->getManager()->getUnitOfWork()->clear();

    $task1 = $this->getTask(1);
    $task2 = $this->getTask(2);
    $task3 = $this->getTask(3);
    $task4 = $this->getTask(4);
    $task5 = $this->getTask(5);
    $task6 = $this->getTask(6);
    $task7 = $this->getTask(7);
    $task8 = $this->getTask(8);
    $task9 = $this->getTask(9);
    $task10 = $this->getTask(10);

    $this->assertSame(1, $task1->getOrder());
    $this->assertSame(2, $task2->getOrder());
    $this->assertSame(3, $task4->getOrder());
    $this->assertSame(4, $task5->getOrder());
    $this->assertSame(5, $task6->getOrder());
    $this->assertSame(6, $task3->getOrder());
    $this->assertSame(7, $task7->getOrder());
    $this->assertSame(8, $task8->getOrder());
    $this->assertSame(9, $task9->getOrder());
    $this->assertSame(10, $task10->getOrder());
  }

  private function getRepository(): TaskRepository
  {
    return static::$container->get('doctrine')->getManagerForClass(Task::class)->getRepository(Task::class);
  }

  private function getUser(int $id = 1): User
  {
    return static::$container->get('doctrine')->getManagerForClass(User::class)->getRepository(User::class)->find($id);
  }

  private function getTask(int $id = 1): Task
  {
    return static::$container->get('doctrine')->getManagerForClass(Task::class)->getRepository(Task::class)->find($id);
  }
}
