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
  },
  modules: {}
})
