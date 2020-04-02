import Vue from 'vue'
import App from './App'
import store from './store'

Vue.prototype.baseURL = 'http://172.29.10.73:3000/api',
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$axios = function(options) {
	return uni.request({
		url: this.baseURL + options.url || '',
		method: options.method || 'GET',
		data: options.data || '',
		header: {
			Authorization: uni.getStorageSync('token').length ? uni.getStorageSync('token') : ''
		}
	})
}
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()