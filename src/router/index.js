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
      path: '/schedule/:scheduleId/update',
      name: 'updateSchedule',
      component: () => import('@/views/ScheduleRegisterView.vue')
    },
    {
      path: '/schedule/detalls',
      name: 'getAllSchedule',
      component: () => import('@/views/ScheduleListView.vue')
    },
    {
      path: '/my/favorite',
      name: 'myFavorite',
      component: () => import('@/views/ScheduleListView.vue')
    },
    // Sidebar 메뉴
    {
      path: '/my/scedule',
      name: 'mySchedules',
      component: () => import('@/views/MySchedulesView.vue')
    },
    {
      path: '/my/interests',
      name: 'myInterests',
      component: () => import('@/views/MyInterestsView.vue')
    },
    {
      path: '/popular',
      name: 'popularSchedules',
      component: () => import('@/views/PopularView.vue')
    },
    {
      path: '/my/dashboard',
      name: 'myDashboard',
      component: () => import('@/views/MyDashboardView.vue')
    },
    
  ]
})

export default router
