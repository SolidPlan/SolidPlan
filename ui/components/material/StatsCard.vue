<!--
  This component is adapted from https://github.com/creativetimofficial/vuetify-material-dashboard
-->

<template>
  <material-card
    class="v-card--material-stats"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-card
      slot="offset"
      :class="`elevation-${elevation}`"
      :color="color"
      class="pa-4"
      dark
    >
      <v-icon size="40">
        {{ icon }}
      </v-icon>
    </v-card>

    <div class="text-right">
      <p
        class="body-2 grey--text font-weight-light mb-0"
        v-text="title"
      ></p>
      <h3 class="headline font-weight-light text--primary">
        {{ value }} <small>{{ smallValue }}</small>
      </h3>
    </div>

    <v-divider />

    <template slot="actions">
      <v-icon
        :color="subIconColor"
        size="20"
        class="mx-2"
      >
        {{ subIcon }}
      </v-icon>

      <span
        :class="subTextColor"
        class="caption font-weight-light"
        v-text="subText"
      ></span>
    </template>
  </material-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import MaterialCard from './Card.vue';

@Component({
  components: {
    MaterialCard,
  },
})
export default class StatsCard extends Vue {
    @Prop({type: String, default: 'secondary'}) public readonly color!: string;
    @Prop({type: [Number, String], default: 10}) public readonly elevation!: number | string;
    @Prop({type: Boolean, default: false}) public readonly inline!: string;
    @Prop({type: Boolean, default: false}) public readonly fullWidth!: string;
    @Prop({type: Number, default: 5}) public readonly offset!: number;
    @Prop({type: String, default: undefined}) public readonly title!: string;
    @Prop({type: String, default: undefined}) public readonly text!: string;
    @Prop({type: String, required: true}) public readonly icon!: string;
    @Prop({type: String, default: undefined}) public readonly subIcon!: string;
    @Prop({type: String, default: undefined}) public readonly subIconColor!: string;
    @Prop({type: String, default: undefined}) public readonly subTextColor!: string;
    @Prop({type: String, default: undefined}) public readonly subText!: string;
    @Prop({type: [Number, String], default: undefined}) public readonly value!: number | string;
    @Prop({type: String, default: undefined}) public readonly smallValue!: string;
}
</script>

<style lang="scss">
  .v-card--material-stats {
    display: flex;
    flex-wrap: wrap;
    position: relative;

    .v-offset {
      display: inline-block;
      flex: 0 1;
      margin-top: 0;
      margin-left: 0;
      margin-right: auto;
      margin-bottom: 0 !important;
      max-width: auto;
      padding: 0 16px 0;
    }

    .v-card {
      border-radius: 4px;
      flex: 0 1 auto;
    }

    .v-card__text {
      display: inline-block;
      flex: 1 0 calc(100% - 120px);
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
    }

    .v-card__actions {
      flex: 1 0 100%;
    }
  }
</style>
