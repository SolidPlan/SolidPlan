<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\QuestionHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserCreateCommand extends Command
{
    /**
     * @var ValidatorInterface
     */
    private $validator;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;

    /**
     * @var UserRepository
     */
    private $userRepository;

    public function __construct(ValidatorInterface $validator, UserPasswordEncoderInterface $passwordEncoder, UserRepository $userRepository)
    {
        parent::__construct('user:create');
        $this->validator = $validator;
        $this->passwordEncoder = $passwordEncoder;
        $this->userRepository = $userRepository;
    }

    protected function configure()
    {
        $this
      ->addOption('email', 'u', InputOption::VALUE_REQUIRED, 'The email address of the user to create')
      ->addOption('password', 'p', InputOption::VALUE_REQUIRED, 'The password of the user')
      ->addOption('firstName', 'f', InputOption::VALUE_REQUIRED, 'The first name of the user')
      ->addOption('lastName', 'l', InputOption::VALUE_REQUIRED, 'The last name of the user to create');
    }

    protected function interact(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);
        $helper = new QuestionHelper();

        foreach (static::getFields() as $field) {
            $fieldName = $field['name'];
            while (null === $input->getOption($fieldName)) {
                $q = new Question("Enter the $fieldName of the user: ");
                $q->setHidden($field['hidden'] ?? false);
                $value = $helper->ask($input, $output, $q);

                if (null === $value) {
                    $io->error("The $fieldName cannot be blank");
                    continue;
                }

                $violations = $this->validator->validate($value, $field['constraints']);

                if (count($violations) > 0) {
                    /** @var \Symfony\Component\Validator\ConstraintViolation $violation */
                    foreach ($violations as $violation) {
                        $io->error($violation->getMessage());
                    }

                    continue;
                }

                $input->setOption($fieldName, $value);
            }
        }
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $user = new User();
        $io = new SymfonyStyle($input, $output);

        $missingFields = [];
        $error = false;
        foreach (static::getFields() as $field) {
            $name = $field['name'];

            /** @var string|null $option */
            $option = $input->getOption($name);

            if (null === $option) {
                $missingFields[] = $name;

                continue;
            }

            $violations = $this->validator->validate($option, $field['constraints']);

            if (count($violations) > 0) {
                /** @var \Symfony\Component\Validator\ConstraintViolation $violation */
                foreach ($violations as $violation) {
                    $io->error($name.': '.$violation->getMessage());
                }

                $error = true;

                continue;
            }

            $method = 'set'.ucfirst($name);

            $user->$method($field['hidden'] ?? false ? $this->passwordEncoder->encodePassword($user, $option) : $option);
        }

        if ([] !== $missingFields) {
            $io->error('Unable to create user. Some required fields are missing: '.implode(', ', $missingFields));

            return 1;
        }

        if ($error) {
            return 1;
        }

        $user->setRoles(['ROLE_USER']);

        $this->userRepository->save($user);

        $io->success('User created successfully');
    }

    private static function getFields(): array
    {
        return [
      [
        'name' => 'email',
        'constraints' => [new Email()],
      ],
      [
        'name' => 'password',
        'constraints' => [new Length(['min' => 6])],
        'hidden' => true,
      ],
      [
        'name' => 'firstName',
        'constraints' => [new Length(['min' => 3])],
      ],
      [
        'name' => 'lastName',
        'constraints' => [new Length(['min' => 3])],
      ],
    ];
    }
}
