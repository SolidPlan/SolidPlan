<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Tests\unit\Command;

use App\Entity\User;
use App\Test\Traits\FakerTrait;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Hautelook\AliceBundle\PhpUnit\ReloadDatabaseTrait;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Exception\RuntimeException;
use Symfony\Component\Console\Tester\CommandTester;

class UserCreateCommandTest extends KernelTestCase
{
  use RefreshDatabaseTrait, FakerTrait;

  public function testExecute()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [
      '--email' => $this->faker->email,
      '--password' => $this->faker->password,
      '--firstName' => $this->faker->firstName,
      '--lastName' => $this->faker->lastName,
    ];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->execute(array_merge(['command' => $command->getName()], $data));

    $output = $commandTester->getDisplay();
    $this->assertContains('User created successfully', $output);

    $userRepository = static::$container->get('doctrine')->getManagerForClass(User::class)->getRepository(User::class);

    /** @var User|null $user */
    $user = $userRepository->findOneBy(['email' => $data['--email']]);

    $this->assertInstanceOf(User::class, $user);
    $this->assertTrue(password_verify($data['--password'], $user->getPassword()));
    $this->assertSame($data['--firstName'], $user->getFirstName());
    $this->assertSame($data['--lastName'], $user->getLastName());
  }

  public function testExecuteWithMissingFields()
  {
    putenv('COLUMNS=80'); // Work around issue with CI environments terminal width
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [
      '--email' => $this->faker->email,
      '--password' => $this->faker->password
    ];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);

    $commandTester->execute(array_merge(['command' => $command->getName()], $data), ['interactive' => 0]);

    $output = $commandTester->getDisplay();
    $this->assertContains("[ERROR] Unable to create user. Some required fields are missing: firstName,    \n         lastName", $output);
    $this->assertSame(1, $commandTester->getStatusCode());
  }

  public function testExecuteWithInvalidData()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [
      '--email' => 'foobar',
      '--password' => $this->faker->password,
      '--firstName' => $this->faker->firstName,
      '--lastName' => $this->faker->lastName,
    ];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);

    $commandTester->execute(array_merge(['command' => $command->getName()], $data), ['interactive' => 0]);

    $output = $commandTester->getDisplay();
    $this->assertContains('[ERROR] email: This value is not a valid email address', $output);
    $this->assertSame(1, $commandTester->getStatusCode());
  }

  public function testExecuteWithInteraction()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [
      'email' => $this->faker->email,
      'password' => $this->faker->password,
      'firstName' => $this->faker->firstName,
      'lastName' => $this->faker->lastName,
    ];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->setInputs($data);
    $commandTester->execute(['command' => $command->getName()]);

    $output = $commandTester->getDisplay();
    $this->assertContains('User created successfully', $output);

    $userRepository = static::$container->get('doctrine')->getManagerForClass(User::class)->getRepository(User::class);

    /** @var User|null $user */
    $user = $userRepository->findOneBy(['email' => $data['email']]);

    $this->assertInstanceOf(User::class, $user);
    $this->assertTrue(password_verify($data['password'], $user->getPassword()));
    $this->assertSame($data['firstName'], $user->getFirstName());
    $this->assertSame($data['lastName'], $user->getLastName());
  }

  public function testExecuteWithEmptyEmail()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [''];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->setInputs($data);
    try {
      $commandTester->execute(['command' => $command->getName()]);
    } catch (RuntimeException $e) {

    }

    $output = $commandTester->getDisplay();
    $this->assertContains('[ERROR] The email cannot be blank', $output);
  }

  public function testExecuteWithInvalidEmail()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = ['foobar'];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->setInputs($data);
    try {
      $commandTester->execute(['command' => $command->getName()]);
    } catch (RuntimeException $e) {

    }

    $output = $commandTester->getDisplay();
    $this->assertContains('[ERROR] This value is not a valid email address', $output);
  }

  public function testExecuteWithEmptyPassword()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [$this->faker->email, ''];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->setInputs($data);
    try {
      $commandTester->execute(['command' => $command->getName()]);
    } catch (RuntimeException $e) {

    }

    $output = $commandTester->getDisplay();
    $this->assertContains('[ERROR] The password cannot be blank', $output);
  }

  public function testExecuteWithShortPassword()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [$this->faker->email, 'ab'];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->setInputs($data);
    try {
      $commandTester->execute(['command' => $command->getName()]);
    } catch (RuntimeException $e) {

    }

    $output = $commandTester->getDisplay();
    $this->assertContains('[ERROR] This value is too short. It should have 6 characters or more', $output);
  }

  public function testExecuteWithEmptyFirstName()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [$this->faker->email, $this->faker->password, ''];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->setInputs($data);
    try {
      $commandTester->execute(['command' => $command->getName()]);
    } catch (RuntimeException $e) {

    }

    $output = $commandTester->getDisplay();
    $this->assertContains('[ERROR] The firstName cannot be blank', $output);
  }

  public function testExecuteWithShortFirstName()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [$this->faker->email, $this->faker->password, 'a'];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->setInputs($data);
    try {
      $commandTester->execute(['command' => $command->getName()]);
    } catch (RuntimeException $e) {

    }

    $output = $commandTester->getDisplay();
    $this->assertContains('[ERROR] This value is too short. It should have 3 characters or more', $output);
  }

  public function testExecuteWithEmptyLastName()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [$this->faker->email, $this->faker->password, $this->faker->firstName, ''];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->setInputs($data);
    try {
      $commandTester->execute(['command' => $command->getName()]);
    } catch (RuntimeException $e) {

    }

    $output = $commandTester->getDisplay();
    $this->assertContains('[ERROR] The lastName cannot be blank', $output);
  }

  public function testExecuteWithShortLastName()
  {
    $kernel = static::bootKernel();
    $application = new Application($kernel);

    $data = [$this->faker->email, $this->faker->password, $this->faker->firstName, 'a'];

    $command = $application->find('user:create');
    $commandTester = new CommandTester($command);
    $commandTester->setInputs($data);
    try {
      $commandTester->execute(['command' => $command->getName()]);
    } catch (RuntimeException $e) {

    }

    $output = $commandTester->getDisplay();
    $this->assertContains('[ERROR] This value is too short. It should have 3 characters or more', $output);
  }
}
