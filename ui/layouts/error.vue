<template>
  <v-app>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </v-app>
</template>

<script lang="ts">
import { NuxtError } from '@nuxt/types/app';
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class ErrorLayout extends Vue {
  @Prop({type: Object as PropType<NuxtError>, default: null}) public error!: NuxtError;

  public layout: string = 'empty';
  public pageNotFound: string = '404 Not Found';
  public otherError: string = 'An error occurred';

  public head (): {title: string} {
    const pageNotFoundErrorCode: number = 404;
    const title: string = this.error.statusCode === pageNotFoundErrorCode ? this.pageNotFound : this.otherError;

    return {
      title,
    };
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
