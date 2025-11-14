<template>
  <nav class="navbar navbar-expand navbar-light bg-white shadow-sm px-3 py-2 topbar">
    <button class="btn btn-link d-md-none rounded-circle me-3 toggle-btn" type="button"
      @click="$emit('toggle-sidebar')">
      <i class="bi bi-list fs-5"></i>
    </button>

    <div class="ms-auto d-flex align-items-center">
      <div class="dropdown">
        <a class="d-flex align-items-center text-decoration-none user-link" href="#" data-bs-toggle="dropdown">
          <span class="me-2 fw-semibold text-dark d-none d-md-inline">{{ auth.user?.hoTen || "Admin" }}</span>
          <img class="img-profile rounded-circle shadow-sm"
            :src="auth.user?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=0d6efd&color=fff'" width="36"
            height="36" alt="user" />
        </a>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm animate-dropdown">
          <li><button class="dropdown-item" @click="goToProfile"><i class="bi bi-person me-2"></i> Hồ sơ</button></li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li><button class="dropdown-item text-danger" @click="handleLogout"><i class="bi bi-box-arrow-right me-2"></i>
              Đăng xuất</button></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

function handleLogout() { auth.logout(); router.push("/login"); }
function goToProfile() { router.push("/admin/profile"); }
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 1055;
  /* bên dưới sidebar overlay */
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.img-profile {
  object-fit: cover;
  transition: transform 0.2s;
}

.img-profile:hover {
  transform: scale(1.05);
}
</style>
