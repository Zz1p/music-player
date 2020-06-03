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
			collection: [],
			role: '',
			token: '',
		},
		hasLogin: undefined,
		// 当前播放的歌的id，存到localStorage里去, playlist也要存进去
		currentSongId: uni.getStorageSync('currentSongId') || undefined,
		playlist: uni.getStorageSync('playlist') || []
	},
	mutations: {
		login(state, payload) {
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
			state.currentSongId = payload
			uni.setStorageSync('currentSongId', payload)
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
		updateCurrentPlaylist(state, payload) {
			if (payload.t === 1) {
				const temp = state.playlist.concat(payload.songId)
				state.playlist = [...new Set(temp)];
			} else {
				let temp = new Set(state.playlist);
				if (Object.prototype.toString.call(payload.songId) === "[object Array]") {
					for (let i of payload.songId) {
						payload.songId.delete(i);
					}
				} else {
					temp.delete(payload.songId);
				}
				state.playlist = [...temp];
			}
			uni.setStorageSync('playlist', state.playlist)
		},
		unshiftSong2Playlist(state) {
			if (!state.currentSongId) return;
			state.playlist.unshift(state.currentSongId);
			uni.setStorageSync('playlist', state.playlist)
		},
		updateCurrentSongId(state, payload) {
			const playlist = state.playlist
			const index = playlist.indexOf(state.currentSongId)
			if (index === -1) {
				this.commit('setCurrentSong', playlist[0])
				return [];
			}
			if (payload === 1) {
				if (index !== playlist.length - 1) {
					this.commit('setCurrentSong', playlist[index + 1])
				} else {
					this.commit('setCurrentSong', playlist[0])
				}
			} else if (payload === -1){
				if (index !== 0) {
					this.commit('setCurrentSong', playlist[index - 1])
				} else {
					this.commit('setCurrentSong', playlist[playlist.length - 1])
				}
			} else {
				let songId = playlist[parseInt(Math.random() * playlist.length)]
				while (songId === state.currentSongId) {
					songId = playlist[parseInt(Math.random() * playlist.length)]
				}
				this.commit('setCurrentSong', playlist[parseInt(Math.random() * playlist.length)])
			}
		}
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
		getSongsById({commit,state}, id) {
			id = Object.prototype.toString.call(id) === "[object Array]" ? id.join() : id.toString();
			if (!id.length) {
				return [];
			}
			return axios({
					url: 'getSongsById',
					method: 'GET',
					data: {
						id
					}
				}).then(res => res[1].data)
				.catch(err => console.log(err))
		},
		updateCollection({
			commit,
			state
		}, params) {
			return axios({
				url: 'updateUserCollection',
				method: 'POST',
				data: {
					id: state.userInfo.id,
					t: params.t,
					songId: params.songId
				}
			}).then(res => {
				if (res[1].data.affectedRows === 1) {
					commit('updateUserCollection', params);
					return 'ok';
				}
				return 'error';
			}).catch(err => console.log(err))
		},
	}
})

export default store
