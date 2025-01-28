import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: '/notas',
          name: 'notas',
          component: () => import('@/views/Notas.vue')
        },
        {
          path: '/financas',
          name: 'financas',
          component: () => import('@/views/Financas.vue')
        },
        {
          path: '/perfil',
          name: 'perfil',
          component: () => import('@/views/Perfil.vue')
        }
      ]
    }
  ]
})

// Proteção das rotas
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('userToken')
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
