import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		baseURL: 'http://localhost:3000/api',
		user: {
			username: ''
		},
		hasLogin: false,
		userName: ""
	},
	mutations: {
		login(state, payload) {
			state.userName = payload || '新用户';
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		}
	},
	actions: {
		login({commit,state}, account) {
			return uni.request({
				url: state.baseURL + '/login',
				method: 'POST',
				data: account
			}).then(res => {
				if (res[1].data.validUser === true) {
					commit('login', account.username);
				}
				return res[1].data;
			}).catch(err => {
				console.log(err);
			});
		}
	}
})

export default store
 