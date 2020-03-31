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
			state.userName = payload.username || '新用户';
			state.hasLogin = true;
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
		}
	},
	actions: {
		login({commit,state}, account) {
			console.log(this);
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
				console.log(err);
			});
		}
	}
})

export default store
 