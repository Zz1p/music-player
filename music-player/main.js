import Vue from 'vue'
import App from './App'
import store from './store'
import axios from './plugins/axios.js'


Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$axios = axios


App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()