import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import bsxUi from '@/components/bsx/index.js'
import '@/components/bsx/theme/index.scss'
import element from '@/plugins'
Vue.use(bsxUi)
Vue.use(element)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
