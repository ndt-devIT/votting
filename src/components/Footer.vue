<template>
  <footer class="footer-modern mt-5 py-5 border-top bg-dark text-white">
    <div class="container">
      <div class="row">

        <div class="col-md-4 mb-4 mb-md-0">
          <a href="/" class="d-inline-block mb-3">
            <img src="@/assets/img/logo.png" alt="Voting Platform Logo" class="footer-logo">
          </a>
          <h5 class="mb-0 fw-bold logo-text-gradient">Voting Platform</h5>
          <p class="text-white-50 small"> Nền tảng bỏ phiếu phi tập trung, đảm bảo tính minh bạch, bảo mật và toàn vẹn
            cho mọi cuộc bầu cử.
          </p>
        </div>

        <div class="col-6 col-md-2 mb-4 mb-md-0">
          <h6 class="fw-bold mb-3 text-white">Liên kết</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="#" class="text-decoration-none small-link">Trang chủ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none small-link">Các bình chọn</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none small-link">FAQ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none small-link">Thông báo</a></li>
          </ul>
        </div>

        <div class="col-6 col-md-2 mb-4 mb-md-0">
          <h6 class="fw-bold mb-3 text-white">Pháp lý</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="#" class="text-decoration-none small-link">Điều khoản dịch vụ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none small-link">Chính sách bảo mật</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none small-link">Liên hệ hỗ trợ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none small-link">Sơ đồ trang</a></li>
          </ul>
        </div>

        <div class="col-md-4">
          <h6 class="fw-bold mb-3 text-white">Đăng ký nhận tin</h6>
          <p class="text-white-50 small">
            Nhận thông báo mới nhất về các cuộc thi và sự kiện.
          </p>
          <form @submit.prevent="handleNewsletterSignup">
            <label for="newsletter-email" class="visually-hidden">Email</label>
            <div class="input-group mb-3">
              <input id="newsletter-email" type="email" class="form-control" placeholder="Email của bạn..."
                aria-label="Email của bạn" v-model="newsletterEmail">
              <button class="btn btn-primary" type="submit" id="button-addon2">
                <i class="bi bi-send-fill"></i>
              </button>
            </div>
          </form>

          <h6 class="fw-bold mb-3 mt-4 text-white">Theo dõi chúng tôi</h6>
          <div class="d-flex mb-3 social-icons">
            <a href="#" class="me-3"><i class="fab fa-facebook-f fa-lg"></i></a>
            <a href="#" class="me-3"><i class="fab fa-twitter fa-lg"></i></a>
            <a href="#" class="me-3"><i class="fab fa-linkedin-in fa-lg"></i></a>
            <a href="#" class="me-3"><i class="fab fa-github fa-lg"></i></a>
          </div>
        </div>

      </div>

      <div class="row mt-4 pt-4 border-top border-secondary">
        <div class="col-12 text-center">
          <p class="mb-0 text-white-50 small">
            &copy; 2025 Voting Platform. Tất cả quyền được bảo lưu.
          </p>
          <p class="text-white-50 small">
            <i class="fas fa-lock"></i> Powered by ndtdev-ct & www.netlify.com.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const newsletterEmail = ref('');

// Bạn có thể thêm logic gửi email ở đây
const handleNewsletterSignup = () => {
  if (!newsletterEmail.value) {
    alert('Vui lòng nhập email');
    return;
  }
  console.log('Đăng ký email:', newsletterEmail.value);
  alert('Cảm ơn bạn đã đăng ký!');
  newsletterEmail.value = ''; // Xóa input
};
</script>

<style>
/* Đổi style chung cho nền tối */
.footer-modern {
  font-size: 0.95rem;
  /* ĐỔI: dùng biến CSS của Bootstrap cho màu nền */
  background-color: var(--bs-dark) !important;
}

/* THAY ĐỔI: Hiệu ứng cho link trên nền tối */
.small-link {
  color: var(--bs-gray-500) !important;
  /* Màu xám mờ (chuẩn Bootstrap) */
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.small-link:hover {
  color: var(--bs-white) !important;
  /* Đổi thành màu trắng sáng khi hover */
  transform: translateX(5px);
}

/* THAY ĐỔI: Hiệu ứng cho icon mạng xã hội */
.social-icons a {
  color: var(--bs-gray-500) !important;
  /* Màu xám mờ */
  transition: transform 0.3s ease, color 0.3s ease;
}

.social-icons a:hover {
  transform: scale(1.2) translateY(-3px);
  color: var(--bs-primary) !important;
  /* Đổi màu primary khi hover */
}

/* Logo (Giữ nguyên) */
.footer-logo {
  max-width: 100px;
  height: auto;
}

/* Gradient (Giữ nguyên) */
.logo-text-gradient {
  background: linear-gradient(90deg, #0d6efd, #0a58ca);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  user-select: none;
}
</style>