<template>
  <v-row>
    <v-col :sm="2" class="px-3 py-0">
      <v-select
        class="my-0"
        :items="statusFilters"
        label="Status: None"
        item-color="primary"
        hide-details
        bottom
        dense
        v-model="selectedFilters.status"
      >
      </v-select>
    </v-col>
    <v-col :sm="project || assigned ? 4 : 3" class="px-3 py-0">
      <v-select
        class="my-0"
        :items="labels"
        label="Label: None"
        item-text="name"
        item-value="id"
        item-color="primary"
        clearable
        hide-details
        bottom
        multiple
        small-chips
        dense
        deletable-chips
        chips
        v-model="selectedFilters.labels"
      >
      </v-select>
    </v-col>

    <v-col :sm="project || assigned ? 4 : 3" class="px-3 py-0" v-if="!assigned">
      <v-select
        class="my-0"
        :items="users"
        label="Assigned: None"
        :item-text="fullName"
        item-value="id"
        item-color="primary"
        clearable
        hide-details
        bottom
        dense
        v-model="selectedFilters.assigned"
      ></v-select>
    </v-col>

    <v-col :sm="project || assigned ? 4 : 3" class="px-3 py-0" v-if="!project">
      <v-select
        class="my-0"
        :items="projects"
        label="Project: None"
        item-text="name"
        item-value="id"
        item-color="primary"
        clearable
        hide-details
        bottom
        multiple
        small-chips
        dense
        deletable-chips
        chips
        v-model="selectedFilters.project"
      >
      </v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { remove } from 'lodash';
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import { Filter, Label, Project, User } from '~/types';

const labelStore: BindingHelpers = namespace('labels');
const userStore: BindingHelpers = namespace('users');
const projectStore: BindingHelpers = namespace('projects');

@Component({})
export default class Filters extends Vue {
  @Prop({type: Object as PropType<Project>, required: false, default: null}) public readonly project!: Project;
  @Prop({type: Object as PropType<User>, required: false, default: null}) public readonly assigned!: User;
  @Prop({type: Object as PropType<Filter>, required: false, default: null}) public readonly filter!: Filter;

  @labelStore.State('labels') public readonly labels!: Label[];
  @userStore.State('users') public readonly allUsers!: User[];
  @projectStore.State('projects') public readonly projects!: Project[];

  public selectedFilters: {labels: number[]; assigned: number; project: number; status: string} = {labels: [], assigned: 0, project: 0, status: 'open'};

  @Watch('selectedFilters', {deep: true, immediate: true})
  public setFilter (filter: {labels: number[]; assigned: number; project: number; status: string}): void {
    const filters: Filter = {};

    if (filter.labels.length > 0) {
      filters['labels.id'] = filter.labels;
    } else {
      delete filters['labels.id'];
    }

    if (filter.assigned) {
        filters['assigned.id'] = filter.assigned;
    } else if (!this.assigned) {
      delete filters['assigned.id'];
    }

    if (filter.project) {
        filters['project.id'] = filter.project;
    } else if (!this.project) {
      delete filters['project.id'];
    }

    if (filter.status !== 'all') {
        filters.status = filter.status;
    } else {
      delete this.filter.status;
      filters['order[status]'] = 'desc';
    }

    this.$emit('update:filter', filters);
  }

  public get statusFilters (): string[] {
    return ['all', 'open', 'closed'];
  }

  public get users (): User[] {
    const users: User[] & Array<{divider: boolean}> = JSON.parse(JSON.stringify(this.allUsers));
    remove(users, {id: this.$auth.user.id});
    users.unshift({divider: true});
    users.unshift(this.$auth.user as User);

    return users;
  }

  public fullName (user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
</script>
