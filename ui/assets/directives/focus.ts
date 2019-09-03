/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';

function focus (el: HTMLElement, {value}: DirectiveBinding, { context }: VNode): void {
  if (value && context) {
    context.$nextTick(() => (context.$refs.input as HTMLElement).focus());
  }
}

export default focus;
