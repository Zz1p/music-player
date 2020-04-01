import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		baseURL: 'http://172.29.10.73:3000/api',
		user: {
			userId: '',
			username: '',
			collect: 1
		},
		hasLogin: false,
	},
	mutations: {
		login(state, payload) {
			state.user.username = payload.username || '新用户';
			state.hasLogin = true;
			uni.setStorage({
				key: 'token',
				data: 'Bearer ' + payload.token
			})
		},
		logout(state) {
			state.user.username = "";
			state.hasLogin = false;
			uni.setStorage({
				key: 'token',
				data: ''
			});
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
					commit('login', data.userInfo);
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
					const data = res[1].data;
					console.log(res);
					if (data.validUser === true) {
						commit('login', data.userInfo);
					}
				}).catch(err => {
					console.log(err);
				})  
		}
	}
})

export default store
 