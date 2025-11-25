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
import LichSuVote from "@/views/LichSuVote.vue";
import XacNhanPhieuBau from "@/views/XacNhanPhieuBau.vue";
import GioiThieu from "@/views/GioiThieu.vue";
import LienHe from "@/views/LienHe.vue";


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
import DoiSoat from "@/views/admin/DoiSoat.vue";

import adCuocThi from "@/views/ad/CuocThi.vue";
import adHangMuc from "@/views/ad/HangMuc.vue";
import adUngVIen from "@/views/ad/UngVien.vue";
import adBinhChon from "@/views/ad/BinhChon.vue";
import adThongKe from "@/views/ad/ThongKe.vue";
import path from "path";


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
      { path: "doisoat", component: DoiSoat },
    ],
    meta: { requiresSuperadmin: true },
  },
  {
    path: "/ad",
    component: DefaultLayout,
    children: [
      { path: "cuocthi", component: adCuocThi },
      { path: "hangmuc", component: adHangMuc },
      { path: "ungvien", component: adUngVIen },
      { path: "binhchon", component: adBinhChon },
      { path: "thongke", component: adThongKe },
    ],
    meta: { requiresAdmin: true },
  },
  {
    path: "/lichsuvote",
    component: DefaultLayout,
    children: [{ path: "", component: LichSuVote }],
  },
  {
    path: "/caccuocthi",
    component: DefaultLayout,
    children: [{ path: "", component: ContestListView }],
  },
  {
    path: "/gioithieu",
    component: DefaultLayout,
    children: [{ path: "", component: GioiThieu }],
  },
  {
    path: "/lienhe",
    component: DefaultLayout,
    children: [{ path: "", component: LienHe }],
  },
  {
    path: "/xac-nhan/:txHash",
    component: DefaultLayout,
    children: [{ path: "", component: XacNhanPhieuBau }],
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
  const auth = useAuthStore();
  const userRole = auth.user?.role; // Lấy role 1 lần cho sạch

  // 1. Kiểm tra các route CHỈ DÀNH CHO SUPERADMIN
  if (to.meta.requiresSuperadmin && userRole !== 'superadmin') {
    // Nếu route yêu cầu superadmin, mà user không phải superadmin -> về login
    return next('/login');
  }

  // 2. Kiểm tra các route DÀNH CHO ADMIN (Superadmin cũng có thể vào)
  if (to.meta.requiresAdmin && userRole !== 'admin' && userRole !== 'superadmin') {
    // Nếu route yêu cầu admin, mà user không phải admin VÀ cũng không phải superadmin -> về login
    return next('/login');
  }

  // Nếu không vướng 2 trường hợp trên, cho phép đi tiếp
  next();
});

export default router;
