<template>
  <v-app>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer fixed app>
      <span v-once>&copy; {{ year }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      year: (new Date()).getFullYear()
    }
  }
}
</script>

<style scoped>
  #app {
    background: url('/login.jpg');
    background-size: cover;
    overflow:hidden;
  }
</style>
