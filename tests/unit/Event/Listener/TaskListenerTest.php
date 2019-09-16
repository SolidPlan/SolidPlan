<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Tests\unit\Event\Listener;

use App\Entity\Task;
use App\Event\Listener\TaskListener;
use App\Repository\TaskRepository;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class TaskListenerTest extends KernelTestCase
{
  use RefreshDatabaseTrait;

  public function testPrePersist()
  {
    static::bootKernel();

    $task = new Task();

    $objectManager = self::$container->get('doctrine')->getManagerForClass(Task::class);

    $event = new LifecycleEventArgs($task, $objectManager);

    $taskListener = new TaskListener();

    $taskListener->prePersist($event);

    $this->assertSame(11, $task->getOrder());
  }

  public function testPrePersistWithInvalidObject()
  {
    $task = new \stdClass();
    $objectManager = $this->createMock(ObjectManager::class);
    $objectManager->expects($this->never())
      ->method('getRepository');

    $event = new LifecycleEventArgs($task, $objectManager);

    $taskListener = new TaskListener();

    $taskListener->prePersist($event);
  }

  public function testPostRemove()
  {
    $task = new Task();

    $repository = $this->createMock(TaskRepository::class);
    $objectManager = $this->createMock(ObjectManager::class);
    $objectManager->expects($this->once())
      ->method('getRepository')
      ->with(Task::class)
      ->willReturn($repository);

    $repository->expects($this->once())
      ->method('sortTask')
      ->with($task, 0);

    $event = new LifecycleEventArgs($task, $objectManager);

    $taskListener = new TaskListener();

    $taskListener->postRemove($event);
  }

  public function testPostRemoveWithInvalidObject()
  {
    $task = new \stdClass();
    $objectManager = $this->createMock(ObjectManager::class);
    $objectManager->expects($this->never())
      ->method('getRepository');

    $event = new LifecycleEventArgs($task, $objectManager);

    $taskListener = new TaskListener();

    $taskListener->postRemove($event);
  }
}
