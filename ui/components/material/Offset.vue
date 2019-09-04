<!--
  This component is adapted from https://github.com/creativetimofficial/vuetify-material-dashboard
-->

<template>
  <div
    :style="styles"
    :class="classes"
    class="v-offset"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({})
export default class Offset extends Vue {
    @Prop({type: Boolean, default: false}) public readonly fullWidth!: number;
    @Prop({type: [Number, String], default: 0}) public readonly offset!: number | string;

    public get classes (): {[key: string]: number} {
        return {
            'v-offset--full-width': this.fullWidth,
        };
    }

    public get styles (): {marginBottom: string; top: string} {
      return {
        marginBottom: `-${this.offset}px`,
        top: `-${this.offset}px`,
      };
    }
}
</script>

<style>
  .v-offset {
    margin: 0 auto;
    max-width: calc(100% - 32px);
    position: relative;
    z-index: 1;
  }
  .v-offset--full-width {
    max-width: 100%;
  }
</style>
