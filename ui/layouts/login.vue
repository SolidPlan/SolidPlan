<template>
  <v-app>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Footer from '~/components/Footer.vue';

@Component({
  components: {
    Footer,
  },
})
export default class LoginLayout extends Vue {
}
</script>

<style scoped>
  #app {
    background: url('/login.jpg');
    background-size: cover;
    overflow:hidden;
  }
</style>
