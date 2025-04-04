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
      }
    ]
  },

]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router