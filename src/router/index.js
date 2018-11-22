import Vue from 'vue'
import Router from 'vue-router'
import Agents from '@/components/Agents'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    /* {
      path: '/agents',
      name: 'Agents',
      component: Agents,
      meta: {
        requiresAuth: true
      }
    }, */
    {
      path: '/agents/:idAgent?',
      name: 'Agents',
      component: Agents,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = Firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('login')
  } else if (!requiresAuth && currentUser) {
    next('hello')
  } else {
    next()
  }
})

export default router
