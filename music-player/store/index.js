import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: {
			id: '',
			userId: '',
			username: '',
			collection: '',
			role: '',
			token: ''
		},
		hasLogin: undefined,
		// 当前播放的歌的id，存到localStorage里去, playlist也要存进去
		currentSong: '',
		playlist: ''
	},
	mutations: {
		login(state, payload) {
			// console.log(commit);
			state.userInfo = payload || '新用户';
			state.hasLogin = true;
			uni.setStorageSync('token','Bearer ' + payload.token)
		},
		logout(state) {
			for (let i of Object.keys(state.user)) {
				state.user[i] = ''
			}
			state.hasLogin = false;
			uni.setStorageSync('token', '');
		},
		setCurrentSong(state, payload) {
			state.currentSong = payload;
		}
	},
	actions: {
		login({
			commit,
			state
		}, account) {
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
				console.log(err);
			});
		},
		authentication({
			commit,
			state
		}) {
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
