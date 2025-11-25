<template>
  <div class="login-container container-fluid p-0">
    <div class="row g-0 min-vh-100">

      <div class="col-lg-7 d-none d-lg-block banner-side position-relative">
        <Particles id="tsparticles" :options="particlesOptions" class="position-absolute w-100 h-100 top-0 left-0" />

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

      <div class="col-lg-5 col-12 d-flex justify-content-center align-items-center form-side">
        <div ref="loginCardRef" class="card p-4 p-sm-5 login-card animate__animated animate__fadeInLeft">

          <div v-if="step === 'form'">
            <h3 class="text-center mb-2 fw-bold text-primary">
              {{ isRegister ? "ĐĂNG KÝ TÀI KHOẢN" : "HỆ THỐNG BÌNH CHỌN TRỰC TUYẾN!" }}
            </h3>
            <p class="text-center text-muted mb-4">
              {{ isRegister ? "Tạo tài khoản mới để tham gia" : "Đăng nhập để tiếp tục" }}
            </p>

            <div v-if="error" class="alert alert-danger animate__animated animate__shakeX">{{ error }}</div>

            <form @submit.prevent="isRegister ? handleRegister() : handleLogin()">

              <div v-if="isRegister" class="mb-3">
                <label for="nameInput" class="form-label">Họ tên</label>
                <input type="text" id="nameInput" v-model="name" class="form-control" placeholder="Nhập họ tên" required
                  :disabled="inputsDisabled" />
              </div>

              <div class="mb-3">
                <label for="emailInput" class="form-label">Email</label>
                <input type="email" id="emailInput" v-model="email" class="form-control" placeholder="Nhập email"
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

              <div v-if="isRegister" class="mb-3">
                <label for="confirmPasswordInput" class="form-label">Nhập lại mật khẩu</label>
                <div class="position-relative">
                  <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPasswordInput"
                    v-model="confirmPassword" class="form-control pe-5" placeholder="Nhập lại mật khẩu" required
                    :disabled="inputsDisabled" />
                  <button type="button"
                    class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-dark"
                    @click="toggleConfirmPassword" :disabled="inputsDisabled">
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <small v-if="isRegister && confirmPassword.length > 0 && password !== confirmPassword"
                  class="text-danger d-block mt-1">
                  Mật khẩu không khớp.
                </small>
              </div>

              <div v-if="isRegister && password.length > 0" class="password-criteria mb-3">
                <small :class="{ 'text-success': passwordCriteria.minLength }">
                  <i :class="passwordCriteria.minLength ? 'bi bi-check-circle-fill' : 'bi bi-x-circle'"></i> Ít nhất 8
                  ký
                  tự
                </small><br>
                <small :class="{ 'text-success': passwordCriteria.lowercase }">
                  <i :class="passwordCriteria.lowercase ? 'bi bi-check-circle-fill' : 'bi bi-x-circle'"></i> Một chữ
                  thường (a-z)
                </small><br>
                <small :class="{ 'text-success': passwordCriteria.uppercase }">
                  <i :class="passwordCriteria.uppercase ? 'bi bi-check-circle-fill' : 'bi bi-x-circle'"></i> Một chữ IN
                  HOA (A-Z)
                </small><br>
                <small :class="{ 'text-success': passwordCriteria.number }">
                  <i :class="passwordCriteria.number ? 'bi bi-check-circle-fill' : 'bi bi-x-circle'"></i> Một con số
                  (0-9)
                </small><br>
                <small :class="{ 'text-success': passwordCriteria.special }">
                  <i :class="passwordCriteria.special ? 'bi bi-check-circle-fill' : 'bi bi-x-circle'"></i> Một ký tự đặc
                  biệt (!@#...)
                </small>
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="inputsDisabled">
                {{ isRegister ? "Đăng ký" : "Đăng nhập" }}
              </button>

              <div v-if="!isRegister" class="text-center mb-3">
                <p class="mb-2 text-muted">Hoặc đăng nhập bằng</p>
                <div id="googleSignInDiv" class="position-relative">
                  <button v-if="googleLoading" class="btn btn-primary w-100" disabled>
                    <span class="spinner-border spinner-border-sm me-2"></span>Đang đăng nhập...
                  </button>
                </div>
              </div>

              <div class="text-center">
                <button type="button" class="btn btn-link p-0 text-decoration-none transition-ease" @click="toggleForm">
                  {{ isRegister ? "Đã có tài khoản? Đăng nhập" : "Trở thành người tổ chức? Đăng ký ngay!!!" }}
                </button>
              </div>
            </form>
          </div>
          <div v-else-if="step === 'otp'" class="animate__animated animate__fadeIn">
            <h3 class="text-center mb-2 fw-bold text-primary">
              XÁC THỰC TÀI KHOẢN
            </h3>
            <p class="text-center text-muted mb-4">
              Một mã 6 số đã được gửi đến <strong>{{ email }}</strong>.
            </p>

            <div v-if="error" class="alert alert-danger animate__animated animate__shakeX">{{ error }}</div>

            <form @submit.prevent="handleVerifyOtp">
              <div class="mb-3">
                <label for="otpInput" class="form-label">Mã OTP</label>
                <input type="tel" id="otpInput" v-model="otp" class="form-control" placeholder="Nhập 6 số" required
                  :disabled="inputsDisabled" autocomplete="one-time-code" maxlength="6" />
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="inputsDisabled">
                Xác thực & Đăng nhập
              </button>

              <div class="text-center">
                <button type="button" class="btn btn-link p-0 text-decoration-none transition-ease"
                  @click="goBackToForm">
                  <i class="bi bi-arrow-left"></i> Quay lại
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import axiosClient from "@/api/axiosClient";
import Swal from "sweetalert2";

const router = useRouter();
const auth = useAuthStore();

// State quản lý giao diện
const step = ref('form'); // 'form' hoặc 'otp'
const otp = ref('');      // Ref cho ô input OTP

// State cho form
const isRegister = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const inputsDisabled = ref(false);

// State cho UI/UX
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const googleLoading = ref(false);
const loginCardRef = ref(null);

// Cấu hình tsParticles
const particlesOptions = {
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" },
      onHover: { enable: true, mode: "repulse" },
    },
    modes: {
      push: { quantity: 4 },
      repulse: { distance: 100, duration: 0.4 },
    },
  },
  particles: {
    color: { value: "#ffffff" },
    links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.5, width: 1 },
    move: { direction: "none", enable: true, outModes: "bounce", random: false, speed: 2, straight: false },
    number: { density: { enable: true, area: 800 }, value: 80 },
    opacity: { value: 0.5 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 5 } },
  },
  detectRetina: true,
};

// Validation mật khẩu
const passwordCriteria = ref({
  lowercase: false,
  uppercase: false,
  number: false,
  special: false,
  minLength: false,
});
const allPasswordCriteriaMet = computed(() => {
  return Object.values(passwordCriteria.value).every(val => val === true);
});
watch(password, (newValue) => {
  if (isRegister.value) {
    passwordCriteria.value.lowercase = /[a-z]/.test(newValue);
    passwordCriteria.value.uppercase = /[A-Z]/.test(newValue);
    passwordCriteria.value.number = /[0-9]/.test(newValue);
    passwordCriteria.value.special = /[\W_]/.test(newValue);
    passwordCriteria.value.minLength = newValue.length >= 8;
  }
});

// Chuyển đổi giữa Đăng nhập / Đăng ký
function toggleForm() {
  step.value = 'form'; // Luôn reset về form chính
  isRegister.value = !isRegister.value;
  error.value = "";
  name.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  otp.value = ""; // Reset OTP

  // Kích hoạt animation lật
  if (loginCardRef.value) {
    loginCardRef.value.classList.remove('animate__fadeInLeft', 'animate__fadeInRight', 'animate__flipInY');
    void loginCardRef.value.offsetWidth;
    loginCardRef.value.classList.add('animate__flipInY');
  }
}

// Quay lại form chính từ bước OTP
function goBackToForm() {
  step.value = 'form';
  error.value = '';
  otp.value = '';
}

// Các hàm toggle password
function togglePassword() {
  showPassword.value = !showPassword.value;
}
function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

// Render nút Google
function renderGoogleButton() {
  if (window.google && window.google.accounts) {
    const googleButtonDiv = document.getElementById("googleSignInDiv");
    if (googleButtonDiv) {
      window.google.accounts.id.renderButton(
        googleButtonDiv,
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }
}

// Xử lý Đăng nhập
async function handleLogin() {
  try {
    inputsDisabled.value = true;
    Swal.fire({
      title: "Đang đăng nhập...",
      html: "Vui lòng đợi trong giây lát",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    await auth.login({ email: email.value, password: password.value });

    Swal.fire({
      icon: "success",
      title: "Đăng nhập thành công!",
      showConfirmButton: false,
      timer: 1500,
    });

    router.push("/");
  } catch (err) {
    Swal.close();
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

// Xử lý Đăng ký (Gửi OTP)
async function handleRegister() {
  // 1. Kiểm tra mật khẩu mạnh
  if (!allPasswordCriteriaMet.value) {
    error.value = "Mật khẩu không đủ mạnh. Vui lòng đáp ứng tất cả yêu cầu.";
    if (loginCardRef.value) {
      loginCardRef.value.classList.remove('animate__shakeX');
      void loginCardRef.value.offsetWidth;
      loginCardRef.value.classList.add('animate__shakeX');
    }
    return;
  }

  // 2. Kiểm tra mật khẩu khớp
  if (password.value !== confirmPassword.value) {
    error.value = "Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại.";
    if (loginCardRef.value) {
      loginCardRef.value.classList.remove('animate__shakeX');
      void loginCardRef.value.offsetWidth;
      loginCardRef.value.classList.add('animate__shakeX');
    }
    return;
  }

  error.value = "";
  try {
    inputsDisabled.value = true;
    Swal.fire({
      title: "Đang gửi OTP...",
      html: "Vui lòng đợi trong giây lát",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // Gọi hàm register (chỉ gửi email)
    const res = await auth.register(name.value, email.value, password.value);

    Swal.close();
    Swal.fire({
      icon: "success",
      title: "Đã gửi OTP!",
      text: res.message || `Một mã OTP đã được gửi đến ${email.value}.`,
      showConfirmButton: true,
    });

    step.value = 'otp'; // Chuyển sang bước nhập OTP

  } catch (err) {
    Swal.close();
    error.value = err.message || "Đăng ký thất bại";
    Swal.fire({
      icon: "error",
      title: "Đăng ký thất bại",
      text: error.value,
      showConfirmButton: true,
    });
  } finally {
    inputsDisabled.value = false;
  }
}

// Xử lý Xác thực OTP
async function handleVerifyOtp() {
  if (otp.value.length !== 6) {
    error.value = "Mã OTP phải là 6 chữ số.";
    return;
  }
  error.value = "";
  try {
    inputsDisabled.value = true;
    Swal.fire({
      title: "Đang xác thực...",
      html: "Vui lòng đợi...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // Gọi hàm verifyOtp từ store
    await auth.verifyOtp(email.value, otp.value);

    // Thành công!
    Swal.fire({
      icon: "success",
      title: "Đăng ký thành công!",
      text: "Đang chuyển đến trang chủ...",
      showConfirmButton: false,
      timer: 1500,
    });

    router.push("/"); // Chuyển trang

  } catch (err) {
    Swal.close();
    error.value = err.message || "Mã OTP không đúng hoặc đã hết hạn.";
  } finally {
    inputsDisabled.value = false;
  }
}

// Xử lý Đăng nhập Google
async function handleGoogleLogin(response) {
  googleLoading.value = true;
  inputsDisabled.value = true;
  try {
    const res = await axiosClient.post("/api/auth/google-login", {
      id_token: response.credential,
    });
    auth.user = res.data.user;
    auth.token = res.data.token;
    localStorage.setItem("user", JSON.stringify(auth.user));
    localStorage.setItem("token", auth.token);
    router.push("/");
  } catch (err) {
    console.error("Google login error:", err);
    error.value = "Đăng nhập Google thất bại. Vui lòng thử lại.";
  } finally {
    googleLoading.value = false;
    inputsDisabled.value = false;
  }
}

// Hooks
onMounted(() => {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });
    renderGoogleButton();
  }
});
watch(isRegister, (newValue) => {
  if (newValue === false && step.value === 'form') { // Chỉ render lại nếu đang ở form chính
    nextTick(() => {
      renderGoogleButton();
    });
  }
});
</script>

<style scoped>
.login-container {
  overflow: hidden;
}
#loginCarousel {
  position: relative;
  z-index: 1;
}

.carousel-item img {
  height: 100vh;
  object-fit: cover;
  opacity: 0.7;
  filter: brightness(0.8);
}

.carousel-caption {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.75rem;
  padding: 1.25rem;
  bottom: 4rem;
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
}

.carousel-caption h5 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.carousel-caption p {
  font-size: 1.1rem;
}

.form-side {
  background: linear-gradient(45deg, #f0f2f5, #e0e6ec);
}

.login-card {
  width: 100%;
  max-width: 480px;
  border: none;
  border-radius: 1rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  background: #fff;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.form-control {
  padding: 0.9rem 1.1rem;
  border-radius: 0.65rem;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease-in-out;
  background-color: #f8f9fa;
}

.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.2);
  background-color: #fff;
}

.btn-primary {
  padding: 0.95rem 1.2rem;
  border-radius: 0.65rem;
  font-weight: 700;
  transition: all 0.3s ease-in-out;
  background-image: linear-gradient(45deg, #0d6efd, #00d4ff);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(13, 110, 253, 0.4);
  background-image: linear-gradient(45deg, #0056b3, #00ace6);
}

.btn-link {
  color: var(--bs-primary);
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.btn-link:hover {
  color: #0056b3;
  text-decoration: underline !important;
}

#googleSignInDiv {
  display: flex;
  justify-content: center;
}

.position-relative .btn {
  z-index: 2;
  line-height: 1;
  font-size: 1.35rem;
  color: #6c757d;
  transition: color 0.2s ease-in-out;
}

.position-relative .btn:hover {
  color: #343a40;
}

.form-control.pe-5 {
  padding-right: 3.5rem !important;
}

.transition-ease {
  transition: all 0.3s ease-in-out;
}

.password-criteria small {
  color: #dc3545;
  transition: color 0.3s ease-in-out;
  display: inline-block;
  line-height: 1.5;
}

.password-criteria small.text-success {
  color: #198754 !important;
}

.password-criteria i {
  margin-right: 0.35rem;
  font-size: 0.85em;
  position: relative;
  top: -1px;
}

@media (max-width: 991.98px) {
  .form-side {
    min-height: 100vh;
  }

  .login-card {
    box-shadow: none;
    max-width: none;
    width: 90%;
    border-radius: 0.75rem;
  }

  .carousel-caption {
    bottom: 2rem;
    padding: 1rem;
  }

  .carousel-caption h5 {
    font-size: 1.4rem;
  }

  .carousel-caption p {
    font-size: 1rem;
  }
}
</style>