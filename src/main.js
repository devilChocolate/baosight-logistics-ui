import Vue from 'vue'
import App from './App.vue'
import bsxUi from '@com/index.js'
Vue.use(bsxUi)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
