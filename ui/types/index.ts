interface Entity {
  '@id': string;
  id: number
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
  name: string,
  color: string
  tasks: string[],
}

export interface Project extends Entity {
  name: string,
  description: string,
  color: string
  tasks: string[],
}

export interface User extends Entity {
  firstName: string,
  lastName: string,
  tasks: string[],
}
