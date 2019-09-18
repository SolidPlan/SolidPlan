<template>
  <v-container grid-list-xl>
    <v-layout justify-center align-center row wrap>
      <v-flex xs8>
        <v-card>
          <v-card-title>
            <h4>Manage Users</h4>
            <div class="flex-grow-1"></div>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="users"
              :items-per-page="5"
              class="elevation-1"
              :search="search"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-text-field
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    clearable
                  ></v-text-field>
                  <div class="flex-grow-1"></div>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" class="mb-2" v-on="on">
                        <v-icon>mdi-plus-circle-outline</v-icon> Create
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-form ref="form">
                            <v-text-field v-model="user.firstName" label="First name" :rules="nameRules" />
                            <v-text-field v-model="user.lastName" label="Last name" />
                            <v-text-field
                              v-model="user.email"
                              label="Email"
                              persistent-hint
                              :rules="emailRules"
                            />
                            <v-text-field v-if="editedIndex === -1" v-model="user.password" label="Set Password" type="password" />
                          </v-form>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      class="mr-2"
                      @click="$auth.user.id === item.id ? $router.push('/profile') : edit(item)"
                      v-on="on"
                    >
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Edit User</span>
                </v-tooltip>
                <v-tooltip bottom v-if="$auth.user.id !== item.id">
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      @click="deleteUser(item)"
                      v-on="on"
                    >
                      mdi-close-circle-outline
                    </v-icon>
                  </template>
                  <span>Delete User</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
          <!--<v-card-actions>
            <v-spacer/>
            <v-btn color="primary" @click="close">
              <v-icon>mdi-plus-circle-outline</v-icon>
              Create
            </v-btn>
          </v-card-actions>-->
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import { User } from '~/types';

const userStore: BindingHelpers = namespace('users');

@Component({})
export default class Profile extends Vue {
  @userStore.State('users') public readonly users!: User[];
  @userStore.Action('edit') public editUser!: (user: User) => Promise<void>;
  @userStore.Action('add') public addUser!: (user: User) => Promise<void>;
  @userStore.Action('remove') public removeUser!: (user: User | null) => Promise<void>;

  public headers: Array<{ text: string; value: string; align?: 'start' | 'center' | 'end'; sortable?: boolean }> = [
    { text: 'ID', value: 'id', align: 'start' },
    { text: 'First Name', value: 'firstName' },
    { text: 'Last Name', value: 'lastName'} ,
    { text: 'Email', value: 'email' },
    { text: 'Actions', value: 'action', sortable: false },
  ];

  public dialog: boolean = false;
  public search: string = '';
  public editedIndex: number = -1;
  public user: User = {
      email: '',
      firstName: '',
      lastName: '',
  } as User;

  public get emailRules (): Array<(value: any) => boolean | string> {
    return [
      (value: string | null): boolean | string => !!value || 'E-mail is Required.',
      (value: string | null): boolean | string => {
        const pattern: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return pattern.test(value || '') || 'Invalid E-mail.';
      },
    ];
  }

  public get nameRules (): Array<(value: any) => boolean | string> {
    return [
      (value: string | null): boolean | string => !!value || 'Name is Required.',
    ];
  }

  public get formTitle (): string {
    return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
  }

  @Watch('dialog')
  public watchDialog (val: boolean): void {
    if (!val) {
        this.close();
    }
  }

  public edit (user: User): void {
    this.editedIndex = 1;
    this.user = {...user};
    this.dialog = true;
  }

  public async deleteUser (user: User): Promise<void> {
    const result: boolean = await this.$dialog.confirm({
      text: 'Are you sure you want to delete this user?',
      title: 'Warning',
    });

    if (result) {
      await this.removeUser(user);
    }
  }

  public async save (): Promise<void> {
    if (this.editedIndex > -1) {
      await this.editUser(this.user);
    } else {
      await this.addUser(this.user);
    }

    this.close();
  }

  public close (): void {
    this.dialog = false;
    this.user = {
        email: '',
        firstName: '',
        lastName: '',
    } as User;

    this.editedIndex = -1;
  }
}
</script>
