import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuex from 'vuex'
import store from './store'

const moment = require('moment')
require('moment/locale/es') 
Vue.use(require('vue-moment'), {
    moment
})


import { Timeline } from 'vue2vis'

/* import "vue2vis/dist/vue2vis.css"; */
import "./styles/full-style.css";

Vue.config.productionTip = false

Vue.use(Vuex)
/* Vue.use(require('vue-moment')); */
Vue.component('timeline', Timeline);



 
//console.log(Vue.moment().locale()) //es

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
