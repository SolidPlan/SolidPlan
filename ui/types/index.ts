/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

interface Entity {
  '@id': string;
  id: number;
}

export interface Task extends Entity {
  name: string;
  description: string;
  status: string;
  project: string | null;
  labels: string[];
  assigned: string | null;
  order: number;
}

export interface Label extends Entity {
  name: string;
  color: string;
  tasks: string[];
}

export interface Project extends Entity {
  name: string;
  description: string;
  color: string;
  tasks: string[];
}

export interface User extends Entity {
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  tasks: string[];
}

export interface Collection<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
}

export interface Filter {
  'project.id'?: number;
  'assigned.id'?: number;
  limit?: number;
  page?: number;
  status?: string;
  'order[status]'?: string;
}

export type validator = (value: any) => string | boolean;
