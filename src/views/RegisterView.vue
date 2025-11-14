<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card shadow-sm p-4">
          <h4 class="text-center mb-3">Đăng ký</h4>

          <!-- Thông báo lỗi -->
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
          <!-- Thông báo thành công -->
          <div v-if="success" class="alert alert-success">{{ success }}</div>

          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label>Họ tên</label>
              <input v-model="name" type="text" class="form-control" placeholder="Nhập họ tên" required />
            </div>

            <div class="mb-3">
              <label>Email</label>
              <input v-model="email" type="email" class="form-control" placeholder="Nhập email" required />
            </div>

            <div class="mb-3">
              <label>Mật khẩu</label>
              <input v-model="password" type="password" class="form-control" placeholder="Nhập mật khẩu (>=6 ký tự)"
                required />
            </div>

            <button type="submit" class="btn btn-success w-100" :disabled="loading">
              {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
            </button>
          </form>

          <p class="text-center mt-3">
            Đã có tài khoản?
            <router-link to="/login">Đăng nhập</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function handleRegister() {
  error.value = '';
  success.value = '';

  if (!name.value || !email.value || !password.value) {
    error.value = 'Vui lòng điền đầy đủ thông tin.';
    return;
  }

  if (!validateEmail(email.value)) {
    error.value = 'Email không hợp lệ.';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Mật khẩu phải ít nhất 6 ký tự.';
    return;
  }

  loading.value = true;
  try {
    await auth.register(name.value, email.value, password.value);
    success.value = 'Đăng ký thành công! Chuyển sang đăng nhập...';
    setTimeout(() => router.push('/login'), 1500);
  } catch (err) {
    error.value = err.message || 'Đăng ký thất bại';
  } finally {
    loading.value = false;
  }
}
</script>
