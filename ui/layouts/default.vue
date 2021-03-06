<template>
  <v-app>
    <v-navigation-drawer
      v-model="detailViewActive"
      clipped
      right
      app
      temporary
      width="50%"
    >
      <component :is="detailViewComponent.component" v-if="detailViewActive" v-bind="detailViewComponent.props" />
    </v-navigation-drawer>
    <v-app-bar clipped-left clipped-right fixed app dark color="grey darken-3">
      <v-toolbar-title v-text="title" />
      <v-spacer />

      <v-menu
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            text
            v-on="on"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img :src="`https://www.gravatar.com/avatar/${emailHash}?d=mp`">
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ $auth.$state.user.email }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider />
          <v-card-actions>
            <v-btn
              color="primary"
              text
              :to="{ name: 'profile' }"
            >
              <v-icon left>
                mdi-account
              </v-icon>
              Profile
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="logout"
            >
              <v-icon left>
                mdi-logout
              </v-icon>
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      src="/login.jpg"
      color="grey darken-2"
      clipped
      app
      dark
      floating
      persistent
    >
      <template v-slot:img="attrs">
        <v-img
          v-bind="attrs"
          gradient="to top, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)"
        />
      </template>
      <v-list nav>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.to"
          exact
          nuxt
          active-class="primary white--text"
        >
          <v-list-item-action>
            <v-icon v-once v-text="item.icon" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-once v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-group
          v-if="projects.length > 0"
          prepend-icon="mdi-account-circle"
          :value="true"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-title>Project List</v-list-item-title>
          </template>

          <v-list-item
            v-for="project in projects"
            :key="project.id"
            :to="{'name': 'projects-id', 'params': {'id': project.id}}"
            link
          >
            <v-list-item-title v-text="project.name" />
            <v-list-item-action>
              <v-chip pill :color="project.color" class="white--text">
                {{ project.tasks.length }}
              </v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
        <v-divider />
        <v-list-item active-class="primary white--text" @click="toggleLabelsDialog">
          <v-list-item-action>
            <v-icon>mdi-label</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-once>
              Manage Labels
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item nuxt exact active-class="primary white--text" to="/users">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-title>
            Manage Users
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-title>
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div :class="{'d-flex justify-space-between': !miniVariant}">
          <span class="pa-2">
            <v-btn icon @click.stop="switchTheme">
              <v-icon>{{ `mdi-theme-light-dark` }}</v-icon>
            </v-btn>
          </span>
          <span class="pa-2">
            <v-btn icon @click.stop="miniVariant = !miniVariant">
              <v-icon>{{ `mdi-chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
            </v-btn>
          </span>
        </div>
      </template>
    </v-navigation-drawer>
    <v-content :class="{'grey lighten-3': !theme}">
      <v-fade-transition mode="out-in">
        <nuxt />
      </v-fade-transition>
    </v-content>
    <Footer />
    <Labels />
  </v-app>
</template>

<script lang="ts">
import { NuxtApp } from '@nuxt/types/app';
import md5 from 'md5';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Action, namespace, State } from 'vuex-class';
import { BindingHelpers } from 'vuex-class/lib/bindings';
import Footer from '~/components/Footer.vue';
import Labels from '~/components/labels/Labels.vue';
import { Label, Project } from '~/types';
import { DetailComponent } from '~/types/state';

const projectsStore: BindingHelpers = namespace('projects');
const labelsStore: BindingHelpers = namespace('labels');

interface MenuItem {
  icon: string;
  title: string;
  to: string;
}

@Component({
  components: {
    Footer,
    Labels,
  },
})
export default class DefaultLayout extends Vue {
    @projectsStore.State('projects') public readonly projects!: Project[];
    @labelsStore.State('labels') public readonly labels!: Label[];
    @State('detailViewActive') public readonly isDetailViewActive!: boolean;
    @State('detailViewComponent') public readonly detailViewComponent!: DetailComponent;
    @State('theme') public readonly theme!: boolean;

    @Action('hideDetailView') public readonly hideDetailView!: () => void;
    @Action('toggleTheme') public readonly toggleTheme!: (context: NuxtApp) => void;
    @Action('toggleLabelsDialog') public readonly toggleLabelsDialog!: () => void;

    public miniVariant: boolean = false;

    public get title (): string {
      return 'SolidPlan';
    }

    public get menuItems (): MenuItem[] {
      return [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/',
        },
        {
          icon: 'mdi-folder-multiple-outline',
          title: 'Projects',
          to: '/projects',
        },
        {
          icon: 'mdi-playlist-check',
          title: 'All Tasks',
          to: '/tasks',
        },
      ];
    }

    public get detailViewActive (): boolean {
      return this.isDetailViewActive;
    }

    public set detailViewActive (value: boolean) {
      if (!value) {
          this.hideDetailView();
      }
    }

    public get emailHash (): string {
      return this.$auth.$state.isLoggedIn ? md5(this.$auth.$state.user.email) : '';
    }

    public logout (): void {
      this.$auth.logout();
    }

    public switchTheme (): void {
      this.toggleTheme(this.$nuxt);
    }
}
</script>
