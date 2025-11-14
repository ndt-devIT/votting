<template>
  <nav id="sidebar" :class="['sidebar', { 'open': isOpen }]" @click.self="closeSidebar">
    <!-- Brand -->
    <router-link to="/admin/dashboard"
      class="sidebar-brand d-flex align-items-center justify-content-center py-3 text-decoration-none">
      <div class="sidebar-brand-icon rotate-n-15 me-2">
        <i class="bi bi-speedometer2 fs-4"></i>
      </div>
      <div class="sidebar-brand-text fs-5 fw-bold text-white">Admin Panel</div>
    </router-link>

    <hr class="sidebar-divider my-2 border-light opacity-25" />

    <!-- Navigation -->
    <ul class="nav flex-column px-2">
      <li class="nav-item mb-1" v-for="item in navItems" :key="item.path">
        <router-link :to="item.path" class="nav-link d-flex align-items-center text-white rounded py-2 px-3">
          <i :class="['bi', item.icon, 'me-2 fs-5']"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <hr class="sidebar-divider my-3 border-light opacity-25" />

    <!-- Logout -->
    <div class="px-2 mt-auto mb-3">
      <button class="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
        @click="handleLogout">
        <i class="bi bi-box-arrow-right me-2 fs-5"></i>
        <span>Đăng xuất</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const auth = useAuthStore();

const isOpen = ref(false);

const navItems = [
  { label: "Bảng điều khiển", path: "/admin/dashboard", icon: "bi-speedometer2" },
  { label: "Người dùng", path: "/admin/users", icon: "bi-people" },
  { label: "Cuộc thi", path: "/admin/groups", icon: "bi-diagram-3" },
  { label: "Hạng mục", path: "/admin/categorys", icon: "bi-calendar-event" },
  { label: "Sự kiện", path: "/admin/events", icon: "bi-calendar-event" },
  { label: "Bình chọn", path: "/admin/vote", icon: "bi-calendar-event" },
];

function openSidebar() { isOpen.value = true; }
function closeSidebar() { isOpen.value = false; }
function handleLogout() {
  auth.logout();
  router.push("/login");
}

</script>

<style scoped>
/* Sidebar overlay on top */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: linear-gradient(180deg, #0d6efd, #0b5ed7);
  z-index: 1070;
  /* luôn trên topbar */
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar.open {
  transform: translateX(0);
}

/* Overlay behind sidebar */
body.sidebar-open::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1065;
}

/* Nav link hover */
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Brand */
.sidebar-brand-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive: auto close sidebar on desktop click outside */
@media(min-width: 992px) {
  .sidebar {
    transform: translateX(0);
    position: fixed;
  }

  body.sidebar-open::before {
    display: none;
  }
}
</style>
