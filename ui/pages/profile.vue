<template>
  <v-container grid-list-xl>
    <v-layout justify-center align-center row wrap>
      <v-flex xs8>
        <v-card>
          <v-card-title>
            <h3>Profile</h3>
          </v-card-title>
          <v-card-text>
            <v-alert type="success" :value="success">
              Profile successfully updated
            </v-alert>
            <v-form ref="form">
              <v-text-field v-model="user.firstName" label="First name" :rules="nameRules" />
              <v-text-field v-model="user.lastName" label="Last name" />
              <v-text-field
                v-model="user.email"
                label="Email"
                persistent-hint
                hint="Note: If you change your email address, you will be logged out and have to log back in"
                :rules="emailRules"
              />
              <v-text-field v-model="password" label="Change Password" type="password" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="update">
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { User } from '~/types';

@Component({})
export default class Profile extends Vue {

  public success: boolean = false;
  public password: string = '';

  public get nameRules (): Array<(value: any) => boolean | string> {
      return [
          (value: string | null): boolean | string => !!value || 'Name is Required.',
      ];
  }

  public get emailRules (): Array<(value: any) => boolean | string> {
    return [
        (value: string | null): boolean | string => !!value || 'E-mail is Required.',
        (value: string | null): boolean | string => {
            const pattern: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return pattern.test(value || '') || 'Invalid E-mail.';
        },
    ];
  }

  public user: User = {...this.$auth.$state.user};

  public async update (): Promise<void> {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const data: {email: string; firstName: string; lastName: string; password?: string} = {email: this.user.email, firstName: this.user.firstName, lastName: this.user.lastName };

      if (this.password !== '') {
        data.password = this.password;
      }

      await this.$axios.$put(`/api/users/${this.user.id}`, data);
      if (this.$auth.$state.user.email !== this.user.email) {
        await this.$auth.logout();
      } else {
        await this.$auth.fetchUser();
        this.user.password = null;
        this.password = '';
        this.success = true;
      }
    }
  }
}
</script>
