import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../plugins/axios.js'

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
			payload.collection = payload.collection ? JSON.parse(payload.collection) : [];
			state.userInfo = payload || '新用户';
			state.hasLogin = true;
			uni.setStorageSync('token', 'Bearer ' + payload.token)
		},
		logout(state) {
			for (let i of Object.keys(state.userInfo)) {
				state.userInfo[i] = ''
			}
			state.hasLogin = false;
			uni.setStorageSync('token', '');
		},
		setCurrentSong(state, payload) {
			state.currentSong = payload;
		},
		updateUserCollection(state, payload) {
			if (payload.t === '1') {
				const temp = state.userInfo.collection.concat(payload.songId)
				state.userInfo.collection = [...new Set(temp)];
			} else {
				let temp = new Set(state.userInfo.collection);
				if (Object.prototype.toString.call(payload.songId) === "[object Array]") {
					for (let i of payload.songId) {
						payload.songId.delete(i);
					}
				} else {
					temp.delete(payload.songId);
				}
				state.userInfo.collection = [...temp];
			}
		},

	},
	actions: {
		login({
			commit,
			state
		}, params) {
			return axios({
				url: 'login',
				method: 'POST',
				data: params,
			}).then(res => {
				const data = res[1].data;
				if (data.validUser === true && data.userInfo.role === 'member') {
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
			return axios({
				url: 'auth',
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
		},
		register({
			commit,
			state
		}, params) {
			return axios({
				url: 'register',
				method: 'POST',
				data: params
			}).then(res => {
				return res[1].data;
			}).catch(err => console.log(err))
		},
		getCollection({
			commit,
			state
		}) {
			if (!state.userInfo.collection.length) {
				return [];
			}
			return axios({
				url: 'getSongsById',
				method: 'GET',
				data: {
					id: state.userInfo.collection
				}
			}).then(res => {
				return res[1].data;
			}).catch(err => console.log(err));
		},
		updateCollection({
			commit,
			state
		}, params) {
			axios({
				url: 'updateUserCollection',
				method: 'POST',
				data: {
					id: state.userInfo.id,
					t: params.t,
					songId: params.songId
				}
			}).then(res => {
				commit('updateUserCollection', params);
			}).catch(err => console.log(err))
		},
	}
})

export default store
