<template>
  <div class="login-container container-fluid p-0">
    <div class="row g-0 min-vh-100">

      <div class="col-lg-7 d-none d-lg-block banner-side">
        <div id="loginCarousel" class="carousel slide h-100" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="0" class="active"
              aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div class="carousel-inner h-100">
            <div class="carousel-item active">
              <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop"
                class="d-block w-100" alt="Banner 1">
              <div class="carousel-caption d-none d-md-block">
                <h5>Quản lý sự kiện chuyên nghiệp</h5>
                <p>Tổ chức và theo dõi mọi sự kiện một cách dễ dàng.</p>
              </div>
            </div>
            <div class="carousel-item">
              <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
                class="d-block w-100" alt="Banner 2">
              <div class="carousel-caption d-none d-md-block">
                <h5>Kết nối cộng đồng</h5>
                <p>Mang mọi người đến gần nhau hơn qua những trải nghiệm đáng nhớ.</p>
              </div>
            </div>
            <div class="carousel-item">
              <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop"
                class="d-block w-100" alt="Banner 3">
              <div class="carousel-caption d-none d-md-block">
                <h5>Phân tích và báo cáo</h5>
                <p>Nhận dữ liệu chi tiết để cải thiện cho các sự kiện trong tương lai.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form side -->
      <div class="col-lg-5 col-12 d-flex justify-content-center align-items-center form-side">
        <div class="card p-4 p-sm-5 login-card">
          <h3 class="text-center mb-2 fw-bold text-primary">HỆ THỐNG BÌNH CHỌN TRỰC TUYẾN!</h3>
          <p class="text-center text-muted mb-4">Đăng nhập để tiếp tục</p>
      
          <div v-if="error" class="alert alert-danger">{{ error }}</div>
      
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="emailInput" class="form-label">Email</label>
              <input type="email" id="emailInput" v-model="email" class="form-control" placeholder="Nhập email của bạn"
                required :disabled="inputsDisabled" />
            </div>
      
            <div class="mb-3">
              <label for="passwordInput" class="form-label">Mật khẩu</label>
              <div class="position-relative">
                <input :type="showPassword ? 'text' : 'password'" id="passwordInput" v-model="password"
                  class="form-control pe-5" placeholder="Nhập mật khẩu" required :disabled="inputsDisabled" />
                <button type="button"
                  class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-dark"
                  @click="togglePassword" :disabled="inputsDisabled">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>
      
            <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="inputsDisabled">
              Đăng nhập
            </button>
      
            <div class="text-center mb-3">
              <p class="mb-2 text-muted">Hoặc đăng nhập bằng</p>
              <div id="googleSignInDiv" class="position-relative">
                <button v-if="googleLoading" class="btn btn-primary w-100" disabled>
                  <span class="spinner-border spinner-border-sm me-2"></span>Đang đăng nhập...
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import axiosClient from "@/api/axiosClient";
import Swal from "sweetalert2";

const router = useRouter();
const auth = useAuthStore();
const email = ref("");
const password = ref("");
const error = ref("");
const inputsDisabled = ref(false);
const showPassword = ref(false);
const googleLoading = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleLogin() {
  try {
    inputsDisabled.value = true;
    // Hiển thị hiệu ứng loading
    Swal.fire({
      title: "Đang đăng nhập...",
      html: "Vui lòng đợi trong giây lát",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Gửi yêu cầu đăng nhập
    await auth.login({ email: email.value, password: password.value });

    // Đăng nhập thành công
    Swal.fire({
      icon: "success",
      title: "Đăng nhập thành công!",
      showConfirmButton: false,
      timer: 1500,
    });

    router.push("/");
  } catch (err) {
    Swal.close(); // Đóng loading nếu có lỗi
    error.value = err.message || "Sai email hoặc mật khẩu";

    Swal.fire({
      icon: "error",
      title: "Đăng nhập thất bại",
      text: "Vui lòng kiểm tra lại hoặc thử đăng nhập bằng Google!",
      showConfirmButton: true,
    });
  } finally {
    inputsDisabled.value = false;
  }
}


onMounted(() => {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large", width: "100%" }
    );
  }
});

async function handleGoogleLogin(response) {
  googleLoading.value = true; // Bắt đầu hiển thị spinner
  inputsDisabled.value = true;

  try {
    const res = await axiosClient.post("/api/auth/google-login", {
      id_token: response.credential,
    });

    auth.user = res.data.user;
    auth.token = res.data.token;
    localStorage.setItem("user", JSON.stringify(auth.user));
    localStorage.setItem("token", auth.token);

    // redirect sau khi login thành công
    router.push("/");
  } catch (err) {
    console.error("Google login error:", err);
    error.value = "Đăng nhập Google thất bại. Vui lòng thử lại.";
  } finally {
    googleLoading.value = false; // Ẩn spinner
    inputsDisabled.value = false;
  }
}

</script>

<style scoped>
/* Container */
.login-container {
  overflow-x: hidden;
}

/* Banner */
.banner-side {
  position: relative;
  background-color: #343a40;
}

.carousel-item img {
  height: 100vh;
  object-fit: cover;
  opacity: 0.6;
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0.5rem;
  padding: 1rem;
  bottom: 3rem;
}

/* Form Side */
.form-side {
  background-color: #f4f7fc;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.form-control {
  padding: 0.85rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  padding: 0.85rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
}

#googleSignInDiv {
  display: flex;
  justify-content: center;
}

/* Căn chỉnh icon mắt trong input mật khẩu */
.position-relative .btn {
  z-index: 2;
  /* Đảm bảo nút nằm trên input */
  line-height: 1;
  /* Căn chỉnh icon với chiều cao của nút */
  font-size: 1.25rem;
  /* Kích thước icon */
  color: #6c757d;
  /* Màu icon xám nhạt */
}

.position-relative .btn:hover {
  color: #343a40;
  /* Đổi màu khi hover */
}

/* Đảm bảo text không bị che bởi icon */
.form-control.pe-5 {
  padding-right: 3rem !important;
  /* Tạo khoảng trống đủ cho icon */
}

/* Responsive for mobile */
@media (max-width: 991.98px) {
  .form-side {
    min-height: 100vh;
  }

  .login-card {
    box-shadow: none;
    max-width: none;
    width: 90%;
  }
}
</style>