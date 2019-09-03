/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

declare module 'vuedraggable' {
  import Vue, { ComponentOptions } from 'vue';

  export interface DraggedContext<T> {
    index: number;
    futureIndex: number;
    element: T;
  }

  export interface DragOptions {
    animation: number;
    disabled: boolean;
    ghostClass: string;
    group: string;
  }

  export interface DropContext<T> {
    index: number;
    component: Vue;
    element: T;
  }

  export interface Rectangle {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  }

  export interface MoveEvent<T> {
    dragged: Element;
    draggedContext: DraggedContext<T>;
    draggedRect: Rectangle;
    from: Element;
    isTrusted: boolean;
    newIndex: number;
    oldIndex: number;
    originalEvent: DragEvent;
    related: Element;
    relatedContext: DropContext<T>;
    relatedRect: Rectangle;
    to: Element;
    willInsertAfter: boolean;
  }

  const draggableComponent: ComponentOptions<Vue>;

  export default draggableComponent;
}
