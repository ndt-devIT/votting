<template>
  <footer class="footer-modern mt-5 py-5 border-top bg-light text-dark">
    <div class="container">
      <div class="row">

        <div class="col-md-4 mb-4 mb-md-0">
          <a href="/" class="d-inline-block mb-3">
            <img src="@/assets/img/logo.png" alt="Voting Platform Logo" class="footer-logo">
          </a>
          <h5 class="mb-0 fw-bold logo-text-gradient">Voting Platform</h5>
          <p class="text-muted small">
            Nền tảng bỏ phiếu phi tập trung, đảm bảo tính minh bạch, bảo mật và toàn vẹn cho mọi cuộc bầu cử.
          </p>
        </div>

        <div class="col-6 col-md-2 mb-4 mb-md-0">
          <h6 class="fw-bold mb-3">Liên kết</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="#" class="text-decoration-none text-dark small-link">Trang chủ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none text-dark small-link">Các bình chọn</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none text-dark small-link">FAQ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none text-dark small-link">Thông báo</a></li>
          </ul>
        </div>

        <div class="col-6 col-md-2 mb-4 mb-md-0">
          <h6 class="fw-bold mb-3">Pháp lý</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="#" class="text-decoration-none text-dark small-link">Điều khoản dịch vụ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none text-dark small-link">Chính sách bảo mật</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none text-dark small-link">Liên hệ hỗ trợ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none text-dark small-link">Sơ đồ trang</a></li>
          </ul>
        </div>

        <div class="col-md-4">
          <h6 class="fw-bold mb-3">Theo dõi chúng tôi</h6>
          <div class="d-flex mb-3">
            <a href="#" class="text-dark me-3"><i class="fab fa-facebook-f fa-lg"></i></a>
            <a href="#" class="text-dark me-3"><i class="fab fa-twitter fa-lg"></i></a>
            <a href="#" class="text-dark me-3"><i class="fab fa-linkedin-in fa-lg"></i></a>
            <a href="#" class="text-dark me-3"><i class="fab fa-github fa-lg"></i></a>
          </div>
          <p class="text-muted small">
            Phát triển bởi <span class="fw-semibold">ndtdev-ct</span>
          </p>
        </div>

      </div>

      <div class="row mt-4 pt-3 border-top">
        <div class="col-12 text-center">
          <p class="mb-0 text-muted small">
            &copy; 2025 Voting Platform. Tất cả quyền được bảo lưu.
          </p>
          <p class="text-muted small">
            <i class="fas fa-lock"></i> Powered by ndtdev-ct & www.netlify.com.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
/* Đảm bảo footer không bị đẩy lên quá cao trên mobile */
.footer-modern {
  font-size: 0.95rem;
  /* Điều chỉnh kích thước font */
}

/* Hiệu ứng hover nhẹ cho các liên kết trong footer */
.small-link {
  color: #6c757d !important;
  /* Màu xám mờ */
  transition: color 0.3s ease;
}

.small-link:hover {
  color: #0d6efd !important;
  /* Màu xanh primary khi hover */
}

/* Định nghĩa màu Primary (giả định) */
.text-primary {
  color: #0d6efd !important;
  /* Thay thế bằng màu thương hiệu của bạn */
}

/* CSS cho logo trong footer */
.footer-logo {
  max-width: 100px;
  /* Điều chỉnh kích thước tối đa của logo */
  height: auto;
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
</style>