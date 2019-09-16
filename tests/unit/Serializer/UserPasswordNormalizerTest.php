<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Tests\unit\Serializer;

use App\Entity\User;
use App\Serializer\UserPasswordNormalizer;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class UserPasswordNormalizerTest extends TestCase
{
  public function testNormalizerMustImplementDenormalizer()
  {
    $this->expectException(\InvalidArgumentException::class);
    $this->expectExceptionMessage('The decorated normalizer must implement the Symfony\Component\Serializer\Normalizer\DenormalizerInterface');
    $serializer = $this->createMock(NormalizerInterface::class);
    $passwordEncoder = $this->createMock(UserPasswordEncoderInterface::class);
    new UserPasswordNormalizer($serializer, $passwordEncoder);
  }

  public function testNormalize()
  {
    $serializer = $this->getMockBuilder([NormalizerInterface::class, DenormalizerInterface::class])->getMock();
    $passwordEncoder = $this->createMock(UserPasswordEncoderInterface::class);
    $normalizer = new UserPasswordNormalizer($serializer, $passwordEncoder);

    $serializer->expects($this->once())
      ->method('normalize')
      ->with('a', 'b')
      ->willReturn('foo');

    $this->assertEquals('foo', $normalizer->normalize('a', 'b'));
  }

  public function testDenormalize()
  {
    $serializer = $this->getMockBuilder([NormalizerInterface::class, DenormalizerInterface::class])->getMock();
    $passwordEncoder = $this->createMock(UserPasswordEncoderInterface::class);
    $normalizer = new UserPasswordNormalizer($serializer, $passwordEncoder);

    $user = new User();
    $user->setPassword('foobar');

    $passwordEncoder->expects($this->once())
      ->method('encodePassword')
      ->with($user, 'foobar')
      ->willReturn(password_hash('foobar', PASSWORD_DEFAULT));

    $serializer->expects($this->once())
      ->method('denormalize')
      ->with(['password' => 'foobar'], User::class, [])
      ->willReturn($user);

    $data = $normalizer->denormalize(['password' => 'foobar'], User::class, []);

    $this->assertInstanceOf(User::class, $data);
    $this->assertTrue(password_verify('foobar', $data->getPassword()));
  }

  public function testSupportsDenormalization()
  {
    $serializer = $this->getMockBuilder([NormalizerInterface::class, DenormalizerInterface::class])->getMock();
    $passwordEncoder = $this->createMock(UserPasswordEncoderInterface::class);
    $normalizer = new UserPasswordNormalizer($serializer, $passwordEncoder);

    $serializer->expects($this->once())
      ->method('supportsDenormalization')
      ->with('a', User::class)
      ->willReturn(true);

    $this->assertTrue($normalizer->supportsDenormalization('a', User::class));
    $this->assertFalse($normalizer->supportsDenormalization('a', 'FooBar'));
  }

  public function testSupportsNormalization()
  {
    $serializer = $this->getMockBuilder([NormalizerInterface::class, DenormalizerInterface::class])->getMock();
    $passwordEncoder = $this->createMock(UserPasswordEncoderInterface::class);
    $normalizer = new UserPasswordNormalizer($serializer, $passwordEncoder);

    $serializer->expects($this->once())
      ->method('supportsNormalization')
      ->with('a', 'json')
      ->willReturn(true);

    $this->assertTrue($normalizer->supportsNormalization('a', 'json'));
  }
}
