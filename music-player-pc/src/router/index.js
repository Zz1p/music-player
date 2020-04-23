import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store/index.js'

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/user/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/user/Register.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// router.beforeEach((to, from , next) => {
//   if (to.name !== 'Login' && !store.state.isAuthenticated) next({ name: 'Login' })
//   else next()
// });

export default router
