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
use App\Test\ApiTestCase;

class LabelTest extends ApiTestCase
{
  public function getResourceClass(): string
  {
    return Label::class;
  }

  public function getFields(): array
  {
    return [
      'name' => $this->faker->sentence(4),
      'color' => $this->faker->hexColor,
    ];
  }
}
