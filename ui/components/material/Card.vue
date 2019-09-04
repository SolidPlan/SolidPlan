<!--
  This component is adapted from https://github.com/creativetimofficial/vuetify-material-dashboard
-->

<template>
  <v-card
    :style="styles"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <helper-offset
      v-if="hasOffset"
      :inline="inline"
      :full-width="fullWidth"
      :offset="offset"
    >
      <v-card
        v-if="!$slots.offset"
        :color="color"
        :elevation="elevation"
        class="v-card--material__header d-flex align-center"
        dark
        min-height="80"
      >
        <slot
          v-if="!title && !text"
          name="header"
        />
        <div
          v-else
          class="px-3"
        >
          <h4
            class="title font-weight-light mb-2"
            v-text="title"
          />
          <p
            class="category font-weight-thin mb-0"
            v-text="text"
          />
        </div>
      </v-card>

      <slot
        v-else
        name="offset"
      />
    </helper-offset>

    <v-card-text>
      <slot />
    </v-card-text>

    <v-divider
      v-if="$slots.actions"
      class="mx-3"
    />

    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import HelperOffset from "./Offset.vue";

@Component({
  components: {
    HelperOffset,
  },
})
export default class Card extends Vue {
  @Prop({type: String, default: 'secondary'}) public readonly color!: string;
  @Prop({type: [Number, String], default: 10}) public readonly elevation!: string;
  @Prop({type: Boolean, default: false}) public readonly inline!: string;
  @Prop({type: Boolean, default: false}) public readonly fullWidth!: string;
  @Prop({type: Number, default: 24}) public readonly offset!: number;
  @Prop({type: String, default: undefined}) public readonly title!: string;
  @Prop({type: String, default: undefined}) public readonly text!: string;

  public get hasOffset (): boolean {
    return Boolean(this.$slots.header ||
      this.$slots.offset ||
      this.title ||
      this.text);
    }

    public get styles (): { marginBottom: string; marginTop: string } | null {
      if (!this.hasOffset) {
        return null;
      }

      return {
        marginBottom: `${this.offset}px`,
        marginTop: `${this.offset * 2}px`,
      };
    }
}
</script>
