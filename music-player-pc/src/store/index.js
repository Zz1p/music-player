import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
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
    playlist: ''
  },
  mutations: {
    login(state, payload) {
      state.userInfo = payload || '新用户';
      state.hasLogin = true;
      localStorage.setItem('token', 'Bearer ' + payload.token);
    },
    logout(state) {
      for (let i of Object.keys(state.userInfo)) {
        state.userInfo[i] = '';
      }
      state.hasLogin = false;
      localStorage.setItem('token', '');
    },
  },
  actions: {
    login({commit}, account) {
      return axios.post('login', account)
          .then(res => {
            const data = res.data;
            if (data.validUser === true && data.userInfo.role === 'admin') {
              commit('login', data.userInfo);
            }
            return data;
          })
          .catch(err => {
            console.log(err);
          });
    },
    register({commit}, account) {
      return axios.post('register', account)
          .then(res => {
            console.log(res);
          })
          .catch(err => console.log(err));
    },
    authentication({commit}) {
      return axios.get('auth')
          .then(res => {
            const data = res.data;
            if (data.validUser === true) {
              commit('login', data.userInfo);
            }
            return data;
          })
          .catch(err => {
            console.log(err);
            commit('logout')
          })
    },
  },
  modules: {}
})
