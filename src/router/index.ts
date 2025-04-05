import { createMemoryHistory, createRouter } from 'vue-router'
import BasicLayout from '../layouts/BasicLayout.vue'
import GoalManagement from '../views/GoalManagement.vue'

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
        path: '/goal-management/:id',
        name: 'GoalManagement',
        component: GoalManagement
      },
      {
        path: '/goal-management/:id/information:goalId',
        name: 'GoalInformation',
        component: () => import('../views/GoalInfoShow.vue')
      }
    ]
  },

]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router