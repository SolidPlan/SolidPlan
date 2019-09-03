<template>
  <v-footer fixed app>
    <span v-once>&copy; {{ title }} {{ year }}</span>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class Footer extends Vue {
  public get title (): string {
    return 'SolidPlan';
  }

  public get year (): number {
    return (new Date()).getFullYear();
  }
}
</script>
