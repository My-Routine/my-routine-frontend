import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated  } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
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
      component: () => import('@/views/ScheduleRegisterView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/schedule/:scheduleId/update',
      name: 'updateSchedule',
      component: () => import('@/views/ScheduleRegisterView.vue')
    },
    {
      path: '/schedule/registerform',
      name: 'makeScheduleForm',
      component: () => import('@/views/ScheduleRegisterFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/schedule/detalls',
      name: 'getAllSchedule',
      component: () => import('@/views/getAllScheduleView.vue'),
      meta: { requiresAuth: true }
    },
    // Sidebar 메뉴
    {
      path: '/my/schedule',
      name: 'mySchedules',
      component: () => import('@/views/MySchedulesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my/interests',
      name: 'myInterests',
      component: () => import('@/views/MyInterestsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/popular',
      name: 'popularSchedules',
      component: () => import('@/views/PopularView.vue')
    },
    {
      path: '/my/dashboard',
      name: 'myDashboard',
      component: () => import('@/views/MyDashboardView.vue'),
      meta: { requiresAuth: true }
    }, 
  ]
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!isAuthenticated()) {
      next({ name : 'login' });
    }else {
      next();
    }
  }else {
    next();
  }
});

export default router
