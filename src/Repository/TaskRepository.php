<?php

namespace App\Repository;

use App\Entity\Task;
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
}
