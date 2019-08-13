<template>
  <v-app>
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
          value="true"
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
        <div class="pa-2" :class="{'text-center': miniVariant, 'text-right': !miniVariant}">
          <v-btn icon @click.stop="miniVariant = !miniVariant">
            <v-icon>{{ `mdi-chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
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
import { mapState } from 'vuex'
import md5 from 'md5'

export default {
  data () {
    return {
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
      projects: state => state.projects.list
    }),
    emailHash () {
      return this.$auth.$state.isLoggedIn ? md5(this.$auth.$state.user.email) : ''
    }
  },

  methods: {
    logout () {
      this.$auth.logout()
    }
  }
}
</script>
