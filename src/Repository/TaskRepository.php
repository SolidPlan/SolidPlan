<?php

namespace App\Repository;

use App\Entity\Task;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Task|null find($id, $lockMode = null, $lockVersion = null)
 * @method Task|null findOneBy(array $criteria, array $orderBy = null)
 * @method Task[]    findAll()
 * @method Task[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TaskRepository extends ServiceEntityRepository
{
  public function __construct(RegistryInterface $registry)
  {
    parent::__construct($registry, Task::class);
  }

  public function sortTask(Task $task, int $newOrder): Task
  {
    $initialOrder = $task->getOrder();

    $qb = $this->createQueryBuilder('t');

    if ($initialOrder > $newOrder) {
      // Task moved up in list (higher priority)
      $qb->update()
        ->set('t.order', 't.order + 1')
        ->where('t.order >= :order')
        ->andWhere('t.order < :initialOrder')
        ->setParameter('order', $newOrder)
        ->setParameter('initialOrder', $initialOrder)
        ->getQuery()
        ->execute();
    } else {
      // Task moved down in list (lower priority)
      $qb->update()
        ->set('t.order', 't.order - 1')
        ->where('t.order <= :order')
        ->andWhere('t.order > :initialOrder')
        ->setParameter('order', $newOrder)
        ->setParameter('initialOrder', $initialOrder)
        ->getQuery()
        ->execute();
    }

    $task->setOrder($newOrder);

    $this->getEntityManager()
      ->persist($task);

    return $task;
  }

  public function getMaxOrder(): int
  {
    return (int) $this->createQueryBuilder('t')
      ->select('MAX(t.order)')
      ->getQuery()
      ->getSingleScalarResult();
  }

  public function getTotalTasksByStatus(string $status): int
  {
    return $this->createQueryBuilder('t')
      ->select('COUNT(t)')
      ->where('t.status = :status')
      ->setParameter('status', $status)
      ->getQuery()
      ->getSingleScalarResult();
  }

  public function getTotalTasksAssignedToUser(User $user): int
  {
    return $this->createQueryBuilder('t')
      ->select('COUNT(t)')
      ->where('t.status = :status')
      ->andWhere('t.assigned = :user')
      ->setParameter('status', 'open')
      ->setParameter('user', $user)
      ->getQuery()
      ->getSingleScalarResult();
  }

  public function getTaskStats(?User $user)
  {
    return [
      'open' => $this->getTotalTasksByStatus('open'),
      'closed' => $this->getTotalTasksByStatus('closed'),
      'assigned' => $user ? $this->getTotalTasksAssignedToUser($user) : 0,
    ];
  }
}
