import { createWebHistory, createRouter } from 'vue-router'
import BasicLayout from '../layouts/BasicLayout.vue'
import GoalManagement from '../views/GoalManagement.vue'
// import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'
const routes = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/summary',
        name: 'Summary',
        component: () => import('../views/Summary.vue')
      },
      {
        path: '/task-management',
        name: 'TaskManagement',
        component: () => import('../views/TaskManagement.vue')
      },
      {
        path: '/goal-management/:id',
        name: 'GoalManagement',
        component: GoalManagement
      },
      {
        path: '/goal-management/:id/information:goalId',
        name: 'GoalInformation',
        component: () => import('../views/GoalInfoShow.vue')
      },
      {
        path: '/goal-management/:id/review:goalId',
        name: 'GoalReview',
        component: () => import('../views/GoalReview.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*' ,
    redirect: '/summary'
  }

]

const router = createRouter({
  history: createWebHistory(),
  // history: createMemoryHistory(),
  routes,
})

export default router