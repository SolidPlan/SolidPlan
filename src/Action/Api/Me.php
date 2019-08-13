<?php

declare(strict_types=1);

/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

namespace App\Action\Api;

final class Me
{
    public function __invoke($data)
    {
        return $data;
    }
}
