// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

// 📦 Views
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ContestListView from "@/views/ContestListView.vue";
import VoteView from "@/views/VoteView.vue";
import AdminDashboardView from "@/views/AdminDashboardView.vue";
import AuthCallback from "@/views/AuthCallback.vue"; // 🟢 thêm mới

// 📦 Layouts
import DefaultLayout from "@/views/layouts/DefaultLayout.vue";
import AuthLayout from "@/views/layouts/AuthLayout.vue";

import AdminLayout from "@/views/layouts/AdminLayout.vue";
import Dashboard from "@/views/admin/Dashboard.vue";
import Users from "@/views/admin/Users.vue";
import HangMuc from "@/views/admin/HangMuc.vue";
import CuocThi from "@/views/admin/CuocThi.vue";
import Events from "@/views/admin/Events.vue";
import Vote from "@/views/admin/Vote.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", component: ContestListView },
      { path: "contest/:id/vote", component: VoteView },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "users", component: Users },
      { path: "categorys", component: HangMuc },
      { path: "groups", component: CuocThi },
      { path: "events", component: Events },
      { path: "vote", component: Vote },
    ],
    meta: { requiresSuperadmin: true },
  },
  {
    path: "/login",
    component: AuthLayout,
    children: [{ path: "", component: LoginView }],
  },
  {
    path: "/register",
    component: AuthLayout,
    children: [{ path: "", component: RegisterView }],
  },
  {
    path: "/auth/callback",
    component: AuthCallback, // 🟢 nhận token + user sau khi Google redirect về
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/", // 🚫 Nếu path sai => về trang chủ
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🧩 Middleware bảo vệ route yêu cầu đăng nhập
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // 🟢 Nếu route cần đăng nhập mà chưa có token
  if (to.meta.requiresAuth && !auth.token) {
    next("/login");
  } else {
    next();
  }
});

// ✅ Route Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresSuperadmin && auth.user?.role !== 'superadmin') {
    return next('/login')
  }
  next()
})

export default router;
