<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Event\Listener;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;

class TaskListener implements EventSubscriber
{
    /**
     * Returns an array of events this subscriber wants to listen to.
     *
     * @return string[]
     */
    public function getSubscribedEvents()
    {
        return [
        Events::prePersist,
        Events::postRemove,
    ];
    }

    public function prePersist(LifecycleEventArgs $event)
    {
        /** @var Task $task */
        if (!($task = $event->getObject()) instanceof Task) {
            return;
        }

        /** @var TaskRepository $repository */
        $em = $event->getEntityManager();
        /** @var TaskRepository $repository */
        $repository = $em->getRepository(Task::class);

        $scheduledEntityInsertions = array_values(array_filter($em->getUnitOfWork()->getScheduledEntityInsertions(), function($entity) { return $entity instanceof Task; }));

        if (0 === count($scheduledEntityInsertions)) {
            $task->setOrder($repository->getMaxOrder() + 1);

            return;
        }

        $maxOrder = 0;

        foreach ($scheduledEntityInsertions as $entity) {
            if (($order = $entity->getOrder()) > $maxOrder) {
                $maxOrder = $order;
            }
        }

        $task->setOrder($maxOrder + 1);
    }

    public function postRemove(LifecycleEventArgs $event)
    {
        /** @var Task $task */
        if (!($task = $event->getObject()) instanceof Task) {
            return;
        }

        /** @var TaskRepository $repository */
        $repository = $event->getEntityManager()->getRepository(Task::class);

        $repository->sortTask($task, 0);
    }
}
