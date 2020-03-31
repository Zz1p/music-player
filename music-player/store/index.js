import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		baseURL: 'http://172.29.10.73:3000/api',
		user: {
			username: ''
		},
		hasLogin: false,
	},
	mutations: {
		login(state, payload) {
			state.user.username = payload.username || '新用户';
			state.hasLogin = true;
		},
		logout(state) {
			state.user.username = "";
			state.hasLogin = false;
		}
	},
	actions: {
		login({commit,state}, account) {
			return this._vm.$axios({
				url: state.baseURL + '/login',
				method: 'POST',
				data: account,
			}).then(res => {
				const data = res[1].data;
				if (data.validUser === true) {
					commit('login', data);
				}
				return data;
			}).catch(err => {
				alert(err);
				console.log(err);
			});
		},
		authentication({commit,state}) {
			return this._vm.$axios({
				url: state.baseURL + '/auth',
				method: 'GET',
				}).then(res => {
					console.log(res);
				}).catch(err => {
					console.log(err);
				})  
		}
	}
})

export default store
 