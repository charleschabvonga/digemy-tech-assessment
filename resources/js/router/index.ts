import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../pages/auth/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../pages/auth/SignUp.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/invoices',
    component: () => import('../components/InvoiceLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Invoices',
        component: () => import('../pages/invoices/Index.vue'),
      },
      {
        path: 'create',
        name: 'CreateInvoice',
        component: () => import('../pages/invoices/Create.vue'),
      },
      {
        path: ':id',
        name: 'ShowInvoice',
        component: () => import('../pages/invoices/Show.vue'),
        props: route => ({ id: route.params.id as string }),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async to => {
  const { checkAuth, isAuthenticated } = useAuth()
  await checkAuth()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requiresAuth && !isAuthenticated.value) {
    const redirect = to.fullPath
    return { name: 'Login', query: { redirect } }
  }

  if (guestOnly && isAuthenticated.value) {
    const q = to.query || {}
    const candidate = typeof q.redirect === 'string' ? q.redirect : ''
    const target = candidate.startsWith('/') ? candidate : '/invoices'
    return target
  }

  return true
})

export default router


