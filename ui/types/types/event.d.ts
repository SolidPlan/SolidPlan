/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import Vue from 'vue';

declare module 'vue/types/vue' {

  interface Vue {
    $event: Vue;
  }
}
