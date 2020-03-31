import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
Vue.prototype.$axios = function(options) {
	return uni.request({
		url: options.url,
		method: options.method,
		data: options.data || '',
		header: {
			Authorization: uni.getStorageSync('token').length ? uni.getStorageSync('token') : ''
		}
	})
}
