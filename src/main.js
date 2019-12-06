import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import VueLazyload from 'vue-lazyload'
import 'common/stylus/index.styl'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('common/image/default.png'),
  attempt: 1
})
Vue.config.productionTip = false
Vue.prototype.$http = Axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
