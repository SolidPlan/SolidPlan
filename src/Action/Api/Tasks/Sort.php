<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Action\Api\Tasks;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Symfony\Component\HttpFoundation\Request;

final class Sort
{
    /**
     * @param Task $data
     * @param Task $previous_data
     *
     * @return Task
     */
    public function __invoke($data, $previous_data, Request $request, TaskRepository $taskRepository)
    {
        $order = (int) $data->getOrder();

        return $taskRepository->sortTask($data->setOrder($previous_data->getOrder()), $order);
    }
}
