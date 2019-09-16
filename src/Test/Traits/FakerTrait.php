<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Test\Traits;

use Faker\Factory;
use Faker\Generator;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * @codeCoverageIgnore
 */
trait FakerTrait
{
  /**
   * @var Generator
   */
  protected $faker;

  /**
   * @before
   */
  public function setFaker()
  {
    if ($this instanceof KernelTestCase) {
      static::bootKernel();
      $this->faker = static::$container->get('nelmio_alice.faker.generator');
    } else {
      $this->faker = Factory::create();
    }

    $this->faker->seed(200);
  }

  /**
   * @after
   */
  public function clearFaker()
  {
    // Reset the seed for the next run
    $this->faker->seed(1);
    mt_rand();
  }
}
