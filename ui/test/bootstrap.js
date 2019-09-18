import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuex from 'vuex';

Vue.use(Vuetify);
Vue.use(Vuex);

const event = {};

event.install = function (vm) {
  vm.prototype.$event = new Vue()
};

Vue.use(event);
