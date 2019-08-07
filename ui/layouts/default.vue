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
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
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
        <v-spacer />
      <v-toolbar-title v-text="title" />
      <v-spacer />
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
        }
      ],
      title: 'SolidTask'
    }
  }
}
</script>
