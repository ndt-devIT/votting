<template>
  <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="top-bar d-flex justify-content-between align-items-center px-2 px-md-4">

      <div class="d-flex align-items-center">
        <router-link to="/" class="d-flex align-items-center text-decoration-none logo-wrapper">
          <img src="@/assets/img/logo.png" alt="Logo" height="35" class="me-2" />
          <h5 class="mb-0 fw-bold logo-text-gradient" style="font-size: 1rem;">Voting Platform</h5>
        </router-link>

        <nav v-if="auth.user?.role !== 'superadmin'" class="main-navigation d-none d-lg-flex ms-5">
          <ul class="navbar-nav flex-row">
            <li class="nav-item" v-for="item in mainNav" :key="item.path">
              <router-link :to="item.path" class="nav-link main-nav-link px-2 mx-2">
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </nav>
        </div>

      <div class="d-flex align-items-center right-nav-group">
        <span v-if="auth.isLoggedIn" class="me-3 d-none d-md-block"> <strong>{{ auth.user.hoTen }}</strong>
        </span>

        <router-link v-if="!auth.isLoggedIn" to="/login" class="btn btn-primary btn-sm me-1"> Đăng nhập
        </router-link>

        <router-link v-if="auth.isLoggedIn" to="/lichsuvote"
          class="btn btn-outline-info btn-sm me-2 d-flex align-items-center" title="Lịch sử bình chọn">
          Tra cứu
        </router-link>

        <div v-if="auth.isLoggedIn && auth.user?.role === 'admin'" class="dropdown me-2">
          <button class="btn btn-outline-success btn-sm d-flex align-items-center dropdown-toggle" type="button"
            id="adminMenuDropdown" data-bs-toggle="dropdown" aria-expanded="false" title="Khu vực tổ chức">
            Tổ chức
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="adminMenuDropdown">
            <li v-for="item in adminNav" :key="item.path">
              <router-link :to="item.path" class="dropdown-item">{{ item.label }}</router-link>
            </li>
          </ul>
        </div>
        <router-link v-if="auth.isLoggedIn && auth.user?.role === 'superadmin'" to="/admin/dashboard"
          class="btn btn-warning btn-sm me-2 d-flex align-items-center" title="Bảng điều khiển quản trị viên"> Quản trị
          viên
        </router-link>

        <button v-if="auth.isLoggedIn"
          class="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center p-1"
          @click="handleLogout" title="Đăng xuất">
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>

  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));

function handleLogout() {
  auth.logout();
  router.push("/login");
}

function goToAdmin() {
  router.push("/admin/dashboard");
}

// Nav cho người dùng thường
const mainNav = ref([
  { label: "Trang chủ", path: "/" },
  { label: "Giới thiệu", path: "/gioithieu" },
  { label: "Các cuộc thi", path: "/caccuocthi" },
  { label: "Liên hệ", path: "/lienhe" },
]);

// Mảng này BÂY GIỜ được dùng cho Dropdown
const adminNav = [
  { label: "Cuộc thi", path: "/ad/cuocthi" },
  { label: "Hạng mục", path: "/ad/hangmuc" },
  { label: "Ứng viên", path: "/ad/ungvien" },
  { label: "Bình chọn", path: "/ad/binhchon" },
  { label: "Thống kê", path: "/ad/thongke" }
];
</script>

<style scoped>
/* (Toàn bộ CSS cũ của bạn) */
.main-header {
  position: sticky;
  top: 0;
  z-index: 1100;
  width: 100%;
  background-color: #fff;
  transition: all 0.3s ease;
}

.main-header.header-scrolled {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.top-bar .logo-wrapper img {
  transition: transform 0.3s ease;
}

.top-bar .logo-wrapper:hover img {
  transform: scale(1.05);
}

.top-bar .btn {
  transition: all 0.3s ease;
}

.top-bar .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.main-nav-link {
  color: #333;
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
}

.main-nav-link:hover {
  color: #0d6efd;
}

.main-nav-link::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #0d6efd;
  transition: width 0.3s ease-in-out;
}

.main-nav-link:hover::after,
.main-nav-link.router-link-exact-active::after {
  width: 70%;
}

.main-nav-link.router-link-exact-active {
  color: #0d6efd;
  font-weight: 600;
}

/* XÓA BỎ CSS CỦA THANH NAV ADMIN (VÌ NÓ KHÔNG CÒN) */
/* .admin-nav-bar ... (toàn bộ CSS cho thanh màu xanh đã được xóa) */

.logo-text-gradient {
  background: linear-gradient(90deg, #0d6efd, #0a58ca);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  user-select: none;
}

.logo-text-font {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .top-bar {
    padding: 0.25rem 0.5rem;
  }

  .logo-wrapper img {
    height: 30px;
  }

  .logo-wrapper h5 {
    font-size: 0.9rem;
  }

  .top-bar .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}

@media (min-width: 992px) {
  .main-header .top-bar {
    padding: 0.75rem 2rem;
    height: 70px;
  }

  .logo-wrapper img {
    height: 45px;
  }

  .logo-wrapper h5 {
    font-size: 1.25rem;
  }

  .top-bar .btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
  }
}

.right-nav-group {
  flex-shrink: 0;
  flex-wrap: nowrap;
  white-space: nowrap;
}

/* BỔ SUNG: Style cho các item trong dropdown mới */
.dropdown-menu .dropdown-item {
  font-size: 0.9rem;
  /* Làm cho item nhỏ gọn */
}

.dropdown-menu .dropdown-item:active {
  /* Đảm bảo có màu nền khi active */
  background-color: var(--bs-primary);
  color: #fff;
}
</style>