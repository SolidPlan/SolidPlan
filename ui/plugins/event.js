import Vue from 'vue'

const event = {};

event.install = function (vm) {
  vm.prototype.$event = new Vue()
};

Vue.use(event);
