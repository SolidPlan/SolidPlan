<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Action\Api\Tasks;

use App\Entity\User;
use App\Repository\TaskRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

final class Stats
{
  public function __invoke(TaskRepository $taskRepository, TokenStorageInterface $tokenStorage): JsonResponse
  {
    return new JsonResponse($taskRepository->getTaskStats($this->getUser($tokenStorage)));
  }

  private function getUser(TokenStorageInterface $tokenStorage): ?User
  {
    if (null === $token = $tokenStorage->getToken()) {
      return null;
    }

    if (!\is_object($user = $token->getUser())) {
      return null;
    }

    if (!$user instanceof User) {
      return null;
    }
    
    return $user;
  }
}
