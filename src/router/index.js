import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue')
    },
    {
      path: '/schedule/register',
      name: 'makeSchedule',
      component: () => import('@/views/ScheduleRegisterView.vue')
    },
    {
      path: '/schedule/registerform',
      name: 'makeScheduleForm',
      component: () => import('@/views/ScheduleRegisterFormView.vue')
    },
    {
      path: '/schedule/getalls',
      name: 'getAllSchedule',
      component: () => import('@/views/getAllScheduleView.vue')
    },
    
  ]
})

export default router
