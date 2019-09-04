<template>
  <v-container fluid fill-height class="mt-5">
    <v-layout flex align-center justify-center>
      <v-flex xs12 lg6 elevation-6>
        <v-toolbar color="primary">
          <v-toolbar-title class="white--text">
            <h4>
              Login
            </h4>
          </v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-text class="pt-4">
              <v-alert v-if="$auth.$state.redirect" :value="true" type="warning">
                You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong>
              </v-alert>
              <v-alert
                :value="error != null"
                type="error"
              >
                {{ error + '' }}
              </v-alert>
              <v-flex>
                <v-container style="position: relative;top: 13%;" class="text-xs-center">

                  <v-text-field
                    v-model="email"
                    type="email"
                    prepend-icon="mdi-account"
                    name="email"
                    label=""
                    placeholder="Email"
                    required
                    value=""
                    :rules="usernameRules"
                    @keydown.enter="login"
                  />
                  <v-text-field
                    v-model="password"
                    prepend-icon="mdi-shield-lock"
                    name="_password"
                    label=""
                    type="password"
                    placeholder="Password"
                    required
                    min="5"
                    append-icon="mdi-eye"
                    counter
                    :rules="passwordRules"
                    @keydown.enter="login"
                  />
                </v-container>
              </v-flex>
            </v-card-text>
            <v-card-actions>
              <v-btn
                primary
                large
                block
                :class=" { 'primary' : valid, 'disabled': !valid }"
                :disbled="!valid"
                @click="login"
              >
                <v-icon>mdi-shield-lock</v-icon>&nbsp;Login
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
    <a style="position: absolute; right: 0; bottom: 0; background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@tlisbin?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Tommy Lisbin"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" /></svg></span><span style="display:inline-block;padding:2px 3px">Tommy Lisbin</span></a>
  </v-container>
</template>

<script lang="ts">
import { NuxtApp } from '@nuxt/types/app';
import { AxiosError } from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';
import { VuetifyRuleValidations } from 'vuetify/src/mixins/validatable/index';
import { Action } from 'vuex-class';
import { User } from '~/types';

@Component({
  layout: 'login',
})
export default class Login extends Vue {
  public valid: boolean = false;
  public error: string | null = null;
  public email: string | null = null;
  public password: string | null = null;
  public usernameRules: VuetifyRuleValidations = [
    (value: string | null): boolean | string => !!value || 'E-mail is Required.',
    (value: string | null): boolean | string => {
      const pattern: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return pattern.test(value || '') || 'Invalid E-mail.';
    },
  ];

  public passwordRules: VuetifyRuleValidations = [
    (value: string | null): boolean | string => !!value || 'Password is Required.',
    (value: string | null): boolean | string => (value || '').length >= 5 || 'Password is too short.',
  ];

  @Action('init') public init!: (context: NuxtApp) => Promise<void>;

  public login (): Promise<void> | void {
    this.error = null;

    if ((this.$refs.form as HTMLFormElement).validate()) {
      return this.$auth
        .loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          } as User,
        })
        .then(async () => {
          await this.init(this.$nuxt);
        })
        .catch((e: AxiosError) => {
          this.error = e.response ? e.response.data.message : 'An error occurred';
        });
    }
  }
}
</script>
