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
    <v-app-bar clipped-left clipped-right fixed app>
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
    <v-navigation-drawer :mini-variant="miniVariant" clipped fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.to"
          router
          exact
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
        <v-list-group
          prepend-icon="mdi-label"
          :value="true"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-title>Labels</v-list-item-title>
          </template>

          <v-list-item
            v-for="label in labels"
            :key="label.id"
          >
            <v-list-item-title>
              <v-icon :color="label.color">
                mdi-label
              </v-icon>
              {{ label.name }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item
            link
            @click="labelsDialog = true"
          >
            <v-list-item-title>
              <v-icon>
                mdi-plus
              </v-icon>
              Edit Labels
            </v-list-item-title>
          </v-list-item>
          <labels v-model="labelsDialog" />
        </v-list-group>
        <v-divider />
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
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer fixed app>
      <span v-once>&copy; {{ title }} {{ year }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import md5 from 'md5'
import Labels from '~/components/labels/Labels.vue'

export default {
  components: {
    Labels
  },
  data () {
    return {
      labelsDialog: false,
      year: (new Date()).getFullYear(),
      miniVariant: false,
      menuItems: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/'
        },
        {
          icon: 'mdi-folder-multiple-outline',
          title: 'Projects',
          to: '/projects'
        },
        {
          icon: 'mdi-playlist-check',
          title: 'All Tasks',
          to: '/tasks'
        }
      ],
      title: 'SolidPlan'
    }
  },

  computed: {
    ...mapState({
      projects: state => state.projects.list,
      labels: state => state.labels.list
    }),
    detailViewActive: {
      get () {
        return this.$store.state.detailViewActive
      },
      set (value) {
        if (value === false) {
          this.hideDetailView()
        }
      }
    },
    ...mapState(['detailViewComponent']),
    emailHash () {
      return this.$auth.$state.isLoggedIn ? md5(this.$auth.$state.user.email) : ''
    }
  },

  methods: {
    logout () {
      this.$auth.logout()
    },
    switchTheme () {
      this.$store.dispatch('toggleTheme', this.$nuxt)
    },
    ...mapActions(['hideDetailView'])
  }
}
</script>
