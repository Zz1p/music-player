import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false
  },
  mutations: {},
  actions: {
    login({commit}, account) {
      this.$axios.post({
        url: '',
        data: account
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
  },
  modules: {}
})
