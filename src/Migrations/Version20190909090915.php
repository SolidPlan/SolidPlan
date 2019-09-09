<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190909090915 extends AbstractMigration
{
  public function isTransactional(): bool
  {
    return true;
  }

  public function up(Schema $schema): void
  {
    $userTable = $schema->createTable('user');
    $userTable->addColumn('id', 'integer', ['autoincrement' => true]);
    $userTable->addColumn('email', 'string', ['length' => 180, 'unique' => true]);
    $userTable->addColumn('roles', 'json');
    $userTable->addColumn('password', 'string', ['not_null' => true]);
    $userTable->addColumn('first_name', 'string', ['length' => 45]);
    $userTable->addColumn('last_name', 'string', ['length' => 45, 'notnull' => false]);
    $userTable->addUniqueIndex(['email']);
    $userTable->setPrimaryKey(['id']);

    $projectTable = $schema->createTable('project');
    $projectTable->addColumn('id', 'integer', ['autoincrement' => true]);
    $projectTable->addColumn('name', 'string', ['length' => 125]);
    $projectTable->addColumn('description', 'text', ['notnull' => false]);
    $projectTable->addColumn('color', 'string', ['length' => 15, 'notnull' => false]);
    $projectTable->setPrimaryKey(['id']);

    $taskTable = $schema->createTable('task');
    $taskTable->addColumn('id', 'integer', ['autoincrement' => true]);
    $taskTable->addColumn('project_id', 'integer', ['notnull' => false]);
    $taskTable->addColumn('assigned_id', 'integer', ['notnull' => false]);
    $taskTable->addColumn('name', 'string');
    $taskTable->addColumn('description', 'text', ['notnull' => false]);
    $taskTable->addColumn('status', 'string', ['length' => 45]);
    $taskTable->addColumn('`order`', 'integer', ['notnull' => false]);
    $taskTable->addIndex(['project_id']);
    $taskTable->addIndex(['assigned_id']);
    $taskTable->addForeignKeyConstraint($projectTable, ['project_id'], ['id']);
    $taskTable->addForeignKeyConstraint($userTable, ['assigned_id'], ['id']);
    $taskTable->setPrimaryKey(['id']);

    $labelTable = $schema->createTable('labels');
    $labelTable->addColumn('id', 'integer', ['autoincrement' => true]);
    $labelTable->addColumn('name', 'string', ['length' => 125]);
    $labelTable->addColumn('color', 'string', ['length' => 15, 'notnull' => false]);
    $labelTable->setPrimaryKey(['id']);

    $taskLabelsTable = $schema->createTable('task_label');
    $taskLabelsTable->addColumn('task_id', 'integer');
    $taskLabelsTable->addColumn('label_id', 'integer');
    $taskLabelsTable->addIndex(['task_id']);
    $taskLabelsTable->addIndex(['label_id']);
    $taskLabelsTable->setPrimaryKey(['task_id', 'label_id']);
    $taskLabelsTable->addForeignKeyConstraint($taskTable, ['task_id'], ['id'], ['onDelete' => 'CASCADE']);
    $taskLabelsTable->addForeignKeyConstraint($labelTable, ['label_id'], ['id'], ['onDelete' => 'CASCADE']);
  }

  public function down(Schema $schema): void
  {
    $tables = [
      'task',
      'task_label',
      'user',
      'labels',
      'project',
    ];

    foreach ($tables as $table) {
      $t = $schema->getTable($table);
      $fk = $t->getForeignKeys();
      foreach ($fk as $f => $_) {
        $t->removeForeignKey($f);
      }

      $schema->dropTable($table);
    }
  }

  public function postUp(Schema $schema): void
  {
    parent::postUp($schema);
    try {
      $this->connection->transactional(function (Connection $connection) {

        $labels = [
          ['name' => 'Feature', 'color' => '#4CAF50'],
          ['name' => 'Urgent', 'color' => '#f44336'],
          ['name' => 'On Hold', 'color' => '#ffc107'],
          ['name' => 'Bug', 'color' => '#F44336'],
        ];

        foreach ($labels as $label) {
          $connection->insert('labels', $label);
        }
      });
    } catch (\Throwable $e) {
      $this->write(sprintf('Unable to load data: %s. Rolling back migration', $e->getMessage()));
      try {
        $this->down($schema);
      } catch (\Throwable $e) {
        $this->write(sprintf('Unable to roll back migration: %s. ', $e->getMessage()));
      }
      $this->abortIf(true, $e->getMessage());
    }
  }
}
