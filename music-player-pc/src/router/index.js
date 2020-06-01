import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Login from "../views/User/Login";
import Register from "../views/User/Register";
import Playlist from "../views/Playlist/Playlist";
import Poster from "../views/Poster/Poster";


const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function (location) {
  return originalReplace.call(this, location).catch(err => err)
};

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(VueRouter);

const routes = [{
  path: '',
  redirect: '/song'
}, {
  path: '/login',
  name: 'Login',
  component: Login

}, {
  path: '/register',
  name: 'Register',
  component: Register
}, {
  path: '/song',
  name: 'Song',
  component: () => import('../views/Song/Song.vue'),
  meta: {auth: true}
}, {
  path: '/Playlist',
  name: 'Playlist',
  component: Playlist,
  meta: {auth: true}
}, {
  path: '/poster',
  name: 'Poster',
  component: Poster,
  meta: {auth: true}
}, {
  path: '*',
  redirect: ''
}];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  const result = await store.dispatch('authentication');
  if (to.matched.some(m => m.meta.auth)) {
    if (result.validUser) {
      next()
    } else {
      next('/login')
    }
  } else if ((to.name === 'Login' || to.name === 'Register') && !result.validUser) {
    next()
  } else {
    next('')
  }
});


export default router
