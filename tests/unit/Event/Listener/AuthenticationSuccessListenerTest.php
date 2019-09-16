<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Tests\unit\Event\Listener;

use App\Entity\User;
use App\Event\Listener\AuthenticationSuccessListener;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class AuthenticationSuccessListenerTest extends TestCase
{
  public function testSubscribedEvents()
  {
    $this->assertSame(KernelEvents::REQUEST, key(AuthenticationSuccessListener::getSubscribedEvents()));
  }

  public function testOnlyMeRoute()
  {
    $tokenStorage = $this->createMock(TokenStorageInterface::class);

    $tokenStorage->expects($this->never())
      ->method('getToken');

    $listener = new AuthenticationSuccessListener($tokenStorage);

    $listener->onAuthenticationSuccessEvent(new RequestEvent($this->createMock(HttpKernelInterface::class), new Request(), HttpKernelInterface::MASTER_REQUEST));
  }

  public function testHasId()
  {
    $tokenStorage = $this->createMock(TokenStorageInterface::class);

    $tokenStorage->expects($this->never())
      ->method('getToken');

    $listener = new AuthenticationSuccessListener($tokenStorage);

    $request = new Request();
    $request->attributes->set('_route', 'api_users_me_item');
    $request->attributes->set('id', 10);

    $listener->onAuthenticationSuccessEvent(new RequestEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MASTER_REQUEST));
  }

  public function testInvalidUser()
  {
    $tokenStorage = $this->createMock(TokenStorageInterface::class);

    $token = $this->createMock(TokenInterface::class);
    $token->expects($this->once())
      ->method('getUser')
      ->willReturn('anon.');

    $tokenStorage->expects($this->once())
      ->method('getToken')
      ->willReturn($token);

    $listener = new AuthenticationSuccessListener($tokenStorage);

    $request = new Request();
    $request->attributes->set('_route', 'api_users_me_item');

    $listener->onAuthenticationSuccessEvent(new RequestEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MASTER_REQUEST));

    $this->assertNull($request->attributes->get('id'));
  }

  public function testSetUserId()
  {
    $tokenStorage = $this->createMock(TokenStorageInterface::class);

    $user = $this->createMock(User::class);
    $user->expects($this->once())
      ->method('getId')
      ->willReturn(15);

    $token = $this->createMock(TokenInterface::class);
    $token->expects($this->once())
      ->method('getUser')
      ->willReturn($user);

    $tokenStorage->expects($this->once())
      ->method('getToken')
      ->willReturn($token);

    $listener = new AuthenticationSuccessListener($tokenStorage);

    $request = new Request();
    $request->attributes->set('_route', 'api_users_me_item');

    $listener->onAuthenticationSuccessEvent(new RequestEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MASTER_REQUEST));

    $this->assertSame(15, $request->attributes->get('id'));
  }
}
