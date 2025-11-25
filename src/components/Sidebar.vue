<template>
  <div v-if="isOpen" class="sidebar-overlay d-lg-none" @click="closeSidebar"></div>

  <nav :class="['sidebar', { 'open': isOpen }]">
    <div class="sidebar-header d-flex align-items-center px-4 py-4">
      <div class="brand-icon-wrapper me-3">
        <i class="bi bi-speedometer2 fs-4 text-white"></i>
      </div>
      <div>
        <h5 class="m-0 fw-bold text-white tracking-wide">Admin<span class="text-primary-light">Panel</span></h5>
        <small class="text-white-50" style="font-size: 0.75rem;">Quản lý hệ thống</small>
      </div>
    </div>

    <div class="sidebar-body px-3 flex-grow-1">
      <p class="text-uppercase text-white-50 fw-bold mb-2 ms-2" style="font-size: 0.7rem; letter-spacing: 1px;">Menu
      </p>
      <ul class="nav flex-column">
        <li class="nav-item mb-2" v-for="item in navItems" :key="item.path">
          <router-link :to="item.path" class="nav-link d-flex align-items-center" @click="closeSidebarOnMobile">
            <span class="icon-wrapper d-flex align-items-center justify-content-center me-3">
              <i :class="['bi', item.icon]"></i>
            </span>
            <span class="link-text">{{ item.label }}</span>
            <i class="bi bi-chevron-right ms-auto arrow-icon"></i>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="sidebar-footer p-3 m-3 rounded-3">
      <div class="d-flex align-items-center mb-3">
        <div class="avatar me-2 bg-white text-primary fw-bold d-flex align-items-center justify-content-center">
          {{ auth.user?.hoTen?.charAt(0) || 'A' }}
        </div>
        <div class="overflow-hidden">
          <div class="text-white fw-bold text-truncate">{{ auth.user?.hoTen || 'Admin' }}</div>
          <div class="text-white-50 small">Super Admin</div>
        </div>
      </div>
      <button class="btn btn-danger w-100 d-flex align-items-center justify-content-center py-2"
        @click="handleLogout">
        <i class="bi bi-box-arrow-right me-2"></i>
        <span>Đăng xuất</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const auth = useAuthStore();

const isOpen = ref(false);

const navItems = [
  // Dashboard: Giữ nguyên hoặc dùng 'bi-grid-1x2-fill' cho hiện đại
  { label: "Bảng điều khiển", path: "/admin/dashboard", icon: "bi-speedometer2" },
  
  // Người dùng: Dùng icon nhóm người (đậm)
  { label: "Người dùng", path: "/admin/users", icon: "bi-people-fill" },
  
  // Cuộc thi: Dùng icon Cúp vàng (Trophy) - Rất hợp ngữ cảnh
  { label: "Cuộc thi", path: "/admin/groups", icon: "bi-trophy-fill" },
  
  // Hạng mục: Dùng icon Thẻ (Tags) hoặc Lớp (Layers) để biểu thị phân loại
  { label: "Hạng mục", path: "/admin/categorys", icon: "bi-tags-fill" },
  
  // Sự kiện: Dùng icon Lịch (Calendar)
  { label: "Ứng viên", path: "/admin/events", icon: "bi-calendar-event-fill" },
  
  // Bình chọn: Dùng icon Ngón tay cái (Like/Vote) hoặc Lá phiếu
  { label: "Bình chọn", path: "/admin/vote", icon: "bi-hand-thumbs-up-fill" },

  // Đối soát: Dùng icon Khiên (Shield) để biểu thị bảo mật và kiểm tra
  { label: "Đối soát", path: "/admin/doisoat", icon: "bi-shield-check" },
];

// Các hàm điều khiển
function openSidebar() { isOpen.value = true; }
function closeSidebar() { isOpen.value = false; }
function toggleSidebar() { isOpen.value = !isOpen.value; }

function closeSidebarOnMobile() {
  if (window.innerWidth < 992) {
    isOpen.value = false;
  }
}

function handleLogout() {
  auth.logout();
  router.push("/login");
}

// Expose ra ngoài để AdminLayout sử dụng
defineExpose({
  openSidebar,
  closeSidebar,
  toggleSidebar
});
</script>

<style scoped>
/* --- 1. Cấu trúc chính & Màu nền (Màu tối hiện đại) --- */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  /* Gradient màu tối (Midnight Blue) */
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  z-index: 1070;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
  transform: translateX(-100%);
}

.sidebar.open {
  transform: translateX(0);
}

/* Desktop: Luôn hiện */
@media (min-width: 992px) {
  .sidebar {
    transform: translateX(0);
  }
}

/* --- 2. Brand Area --- */
.brand-icon-wrapper {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.text-primary-light {
  color: #60a5fa;
}

/* --- 3. Navigation Links (Card Style) --- */
.nav-link {
  color: #94a3b8; /* Màu chữ xám xanh */
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 4px;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

/* Icon wrapper */
.icon-wrapper {
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* --- 4. Trạng thái Active (Router Link Active) --- */
.nav-link.router-link-active {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); /* Xanh nổi bật */
  color: #fff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.nav-link.router-link-active .icon-wrapper {
  background-color: rgba(255, 255, 255, 0.2);
}

.arrow-icon {
  font-size: 0.8rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.nav-link.router-link-active .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

/* --- 5. Footer & User Profile --- */
.sidebar-footer {
  background-color: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.2rem;
}

/* --- 6. Overlay (Mobile) --- */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1065;
}
</style>