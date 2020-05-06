import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

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
  component: () => import('../views/User/Login.vue'),

}, {
  path: '/register',
  name: 'Register',
  component: () => import('../views/User/Register.vue'),
}, {
  path: '/song',
  name: 'Song',
  component: () => import('../views/Song/Song.vue'),
  meta: {auth: true}
}, {
  path: '/Playlist',
  name: 'Playlist',
  component: () => import('../views/Playlist/Playlist.vue'),
  meta: {auth: true}
}, {
  path: '/poster',
  name: 'Poster',
  component: () => import('../views/Poster/Poster.vue'),
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
  console.log(result);
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
