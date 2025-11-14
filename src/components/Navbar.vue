<template>
  <header class="main-header" :class="{ 'header-scrolled': isScrolled }">
    <!-- Top bar -->
    <div class="top-bar d-flex justify-content-between align-items-center px-2 px-md-4">
      <!-- Logo -->
      <router-link to="/" class="d-flex align-items-center text-decoration-none logo-wrapper">
        <img src="@/assets/img/logo.png" alt="Logo" height="35" class="me-2" />
        <h5 class="mb-0 fw-bold logo-text-gradient" style="font-size: 1rem;">Voting Platform</h5>
      </router-link>

      <!-- Auth buttons -->
      <div class="d-flex align-items-center">
        <span v-if="auth.isLoggedIn" class="me-2">
          <strong>{{ auth.user.hoTen }}</strong>
        </span>

        <!-- Nút đăng nhập -->
        <router-link v-if="!auth.isLoggedIn" to="/login" class="btn btn-outline-primary btn-sm me-1">
          Đăng nhập
        </router-link>

        <!-- Nút Quản trị viên cho superadmin -->
        <router-link v-if="auth.isLoggedIn && auth.user?.role === 'superadmin'" to="/admin/dashboard"
          class="btn btn-warning btn-sm me-2 d-flex align-items-center" title="Bảng điều khiển quản trị viên"> Quản trị viên
        </router-link>

        <!-- Nút đăng xuất -->
        <button v-if="auth.isLoggedIn"
          class="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center p-1"
          @click="handleLogout" title="Đăng xuất">
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>

    </div>

    <!-- Admin navbar -->
    <nav v-if="auth.user?.role === 'admin'" class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm main-nav">
      <div class="container px-2 px-md-4">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="navbarMenu">
          <ul class="navbar-nav flex-column flex-md-row text-center w-100">
            <li class="nav-item" v-for="item in adminNav" :key="item.path">
              <router-link :to="item.path" class="nav-link py-2 py-md-1" exact>{{ item.label }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
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

const adminNav = [
  { label: "Cuộc thi", path: "/cuoc-thi" },
  { label: "Hạng mục", path: "/hang-muc" },
  { label: "Ứng viên", path: "/ung-vien" },
  { label: "Bình chọn", path: "/binh-chon" }
];
</script>

<style scoped>

/* Sticky header */
.main-header {
  position: sticky;
  top: 0;
  z-index: 1100;
  width: 100%;
  background-color: #fff;
  transition: all 0.3s ease;
}

.main-header.header-scrolled {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Top bar */
.top-bar .logo-wrapper img {
  transition: transform 0.3s ease;
}

.top-bar .logo-wrapper:hover img {
  transform: scale(1.05);
}

.auth-area .btn,
.user-area .btn {
  transition: all 0.2s ease;
}

.auth-area .btn:hover,
.user-area .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Navbar hover underline effect */
.navbar-nav .nav-link {
  position: relative;
  padding: 0.5rem 0.75rem;
  transition: color 0.3s ease;
}

.navbar-nav .nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: #ffffff;
  transition: width 0.3s ease-in-out;
}

.navbar-nav .nav-link:hover::after,
.navbar-nav .nav-link.router-link-exact-active::after {
  width: 70%;
}

/* Active link */
.navbar-nav .nav-link.router-link-exact-active {
  font-weight: 600;
}

/* Navbar mobile collapse */
@media (max-width: 768px) {
  .main-nav .navbar-collapse {
    background-color: #0d6efd;
  }

  .navbar-nav .nav-link {
    text-align: center;
    padding: 0.75rem 1rem;
  }
}

/* Thêm vào cuối file <style scoped> */
.logo-text-gradient {
  /* Tạo màu gradient */
  background: linear-gradient(90deg, #0d6efd, #0a58ca);

  /* Các thuộc tính quan trọng để "cắt" gradient theo hình dạng của chữ: */

  /* 1. Cần tiền tố '-webkit-' cho Chrome, Safari, Edge (và cả Firefox) */
  -webkit-background-clip: text;

  /* 2. Dùng tiền tố '-webkit-' cho thuộc tính fill-color */
  -webkit-text-fill-color: transparent;

  /* 3. Thuộc tính chuẩn (không tiền tố) cho nền */
  background-clip: text;

  /* Bỏ thuộc tính 'text-fill-color: transparent;' không tiền tố */

  /* Để hiệu ứng đẹp hơn, chúng ta nên ngăn không cho text-gradient
     bị bôi đen khi người dùng bôi đen văn bản.
   */
  user-select: none;
}

/* Thêm vào cuối file <style scoped> */
.logo-text-font {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  /* Đảm bảo font luôn đậm */
  letter-spacing: 0.5px;
  /* Tăng khoảng cách chữ một chút */
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
    /* nhỏ hơn desktop */
  }

  .auth-area .btn,
  .user-area .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}

/* Tăng header cho laptop (>=992px) */
@media (min-width: 992px) {
  .main-header .top-bar {
    padding: 0.75rem 2rem;
    height: 60px;
    /* hoặc tuỳ chỉnh */
  }

  .logo-wrapper img {
    height: 45px;
    /* logo to hơn */
  }

  .logo-wrapper h5 {
    font-size: 1.25rem;
    /* chữ to hơn */
  }

  .top-bar .btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.9rem;
  }
}

/* Navbar admin */
@media (min-width: 992px) {
  .main-nav .nav-link {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
}

</style>
