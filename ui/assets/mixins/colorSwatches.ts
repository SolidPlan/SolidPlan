/*
 * This file is part of the SolidPlan project.
 *
 * @author     pierre
 * @copyright  Copyright (c) 2019
 */

import { chunk, filter, map } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import colors from 'vuetify/lib/util/colors';

@Component({})
export default class ColorSwatches extends Vue {
  public get swatches (): string[][] {
    const chunkSize: number = 4;

    return chunk<string>(filter<string>(map<any>(colors, 'base')
      .concat([colors.shades.black])), chunkSize);
  }
}
