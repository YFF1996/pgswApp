import Vue from 'vue'
import App from './App'
import store from './store/index'
import md5 from 'js-md5'
import jutils from 'jutils-src'

Vue.prototype.$store = store
Vue.prototype.$md5 = md5
Vue.prototype.$jutils = jutils

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
