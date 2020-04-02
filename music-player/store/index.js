import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user: {
			userId: '',
			username: '',
			collect: ''
		},
		hasLogin: undefined,
	},
	mutations: {
		login(state, payload) {
			state.user = payload || '新用户';
			state.hasLogin = true;
			uni.setStorage({
				key: 'token',
				data: 'Bearer ' + payload.token
			})
		},
		logout(state) {
			for (let i of Object.keys(state.user)) {
				state.user[i] = ''
			}
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
				url: '/login',
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
				url: '/auth',
				method: 'GET',
				}).then(res => {
					const data = res[1].data;
					if (data.validUser === true) {
						commit('login', data.userInfo);
					} else {
						commit('logout')
					}
				}).catch(err => {
					console.log(err);
					commit('logout')
				})  
		}
	}
})

export default store
 