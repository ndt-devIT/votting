<template>
  <div class="about-page">
    
    <section class="hero-about position-relative d-flex align-items-center text-white">
      <div class="overlay"></div>
      <div class="container position-relative z-2 text-center">
        <span class="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wide" data-aos="fade-down">
          Về chúng tôi
        </span>
        <h1 class="display-3 fw-bold mb-4" data-aos="fade-up" data-aos-delay="100">
          Kiến tạo Tương lai của <br/> 
          <span class="text-gradient-primary">BÌNH CHỌN TRỰC TUYẾN</span>
        </h1>
        <p class="lead text-white-50 mx-auto" style="max-width: 700px;" data-aos="fade-up" data-aos-delay="200">
          Chúng tôi tin rằng sự minh bạch là nền tảng của niềm tin. Voting Platform mang đến giải pháp bỏ phiếu an toàn, không thể thay đổi, được bảo chứng bởi công nghệ Blockchain.
        </p>
      </div>
    </section>

    <section class="py-5 my-5">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6" data-aos="fade-right">
            <div class="position-relative">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop" 
                   class="img-fluid rounded-4 shadow-lg" alt="Team working">
              <div class="floating-card bg-white p-3 rounded-3 shadow position-absolute bottom-0 end-0 m-4 d-none d-md-block">
                <div class="d-flex align-items-center">
                  <div class="icon-box bg-success-subtle text-success rounded-circle me-3">
                    <i class="bi bi-shield-check fs-4"></i>
                  </div>
                  <div>
                    <div class="fw-bold text-dark">100% Bảo mật</div>
                    <div class="small text-muted">Xác thực đa lớp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <h6 class="text-primary fw-bold text-uppercase ls-1">Câu chuyện của chúng tôi</h6>
            <h2 class="fw-bold display-6 mb-4">Tại sao chúng tôi xây dựng nền tảng này?</h2>
            <p class="text-muted mb-4">
              Trong kỷ nguyên số, niềm tin vào các cuộc bình chọn truyền thống đang dần bị xói mòn bởi sự thiếu minh bạch và các rủi ro gian lận.
            </p>
            <p class="text-muted mb-4">
              Chúng tôi, đội ngũ <strong>ndtdev-ct</strong>, đã quyết định thay đổi điều đó. Bằng cách kết hợp sức mạnh của <strong>Blockchain Ethereum</strong> với trải nghiệm người dùng đơn giản, chúng tôi trao quyền kiểm soát lại cho cộng đồng. Mỗi lá phiếu là một giao dịch không thể đảo ngược.
            </p>
            
            <div class="row g-4 mt-2">
              <div class="col-sm-6">
                <div class="d-flex">
                  <i class="bi bi-check-circle-fill text-primary fs-4 me-3"></i>
                  <div>
                    <h6 class="fw-bold">Minh bạch tuyệt đối</h6>
                    <p class="small text-muted">Dữ liệu công khai on-chain.</p>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="d-flex">
                  <i class="bi bi-check-circle-fill text-primary fs-4 me-3"></i>
                  <div>
                    <h6 class="fw-bold">Không thể thao túng</h6>
                    <p class="small text-muted">Smart Contract tự động hóa.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-primary py-5 text-white stats-section">
      <div class="container py-4">
        <div class="row text-center g-4">
          <div class="col-md-3 col-6" v-for="(stat, index) in stats" :key="index" data-aos="fade-up" :data-aos-delay="index * 100">
            <div class="display-4 fw-bold mb-2">{{ stat.value }}</div>
            <div class="text-white-50 text-uppercase small ls-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 my-5 bg-light">
      <div class="container">
        <div class="text-center mb-5 mx-auto" style="max-width: 600px;">
          <h6 class="text-primary fw-bold text-uppercase">Đội ngũ nòng cốt</h6>
          <h2 class="fw-bold">Gặp gỡ những người kiến tạo</h2>
          <p class="text-muted">Những con người đầy nhiệt huyết đứng sau sự thành công của hệ thống.</p>
        </div>

        <div class="row g-4 justify-content-center">
          <div class="col-md-6 col-lg-3" v-for="member in team" :key="member.name" data-aos="fade-up">
            <div class="card h-100 border-0 shadow-sm text-center team-card">
              <div class="card-body p-4">
                <div class="avatar-wrapper mb-3 mx-auto">
                  <img :src="member.image" class="img-fluid rounded-circle team-img" :alt="member.name">
                </div>
                <h5 class="fw-bold mb-1">{{ member.name }}</h5>
                <p class="text-primary small mb-3">{{ member.role }}</p>
                <p class="text-muted small fst-italic">"{{ member.quote }}"</p>
                <div class="social-links mt-3">
                  <a href="#" class="mx-2 text-muted"><i class="bi bi-facebook"></i></a>
                  <a href="#" class="mx-2 text-muted"><i class="bi bi-linkedin"></i></a>
                  <a href="#" class="mx-2 text-muted"><i class="bi bi-github"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <h2 class="fw-bold text-center mb-5">Câu hỏi thường gặp</h2>
            <div class="accordion" id="accordionAbout">
              <div class="accordion-item border-0 shadow-sm mb-3" v-for="(faq, i) in faqs" :key="i">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" :data-bs-target="'#faq'+i">
                    {{ faq.question }}
                  </button>
                </h2>
                <div :id="'faq'+i" class="accordion-collapse collapse" data-bs-parent="#accordionAbout">
                  <div class="accordion-body text-muted">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta py-5 bg-dark text-white text-center">
      <div class="container py-4">
        <h2 class="fw-bold mb-3">Sẵn sàng tổ chức cuộc thi của bạn?</h2>
        <p class="text-white-50 mb-4">Tham gia ngay hôm nay để trải nghiệm sự khác biệt.</p>
        <router-link to="/contact" class="btn btn-primary btn-lg px-5 rounded-pill shadow-lg hover-scale">
          Liên hệ hợp tác
        </router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dữ liệu Thống kê
const stats = ref([
  { value: '1000+', label: 'Người dùng' },
  { value: '100+', label: 'Cuộc thi' },
  { value: '10T+', label: 'Lượt bình chọn' },
  { value: '99.9%', label: 'Uptime' },
]);

// Dữ liệu Team
const team = ref([
  {
    name: 'Ngô Đức Thắng',
    role: 'Founder & Lead Developer',
    image: 'https://ui-avatars.com/api/?name=Ngo+Duc+Thang&background=0D8ABC&color=fff&size=150',
    quote: 'Công nghệ sinh ra để phục vụ sự công bằng.'
  },
  {
    name: 'Võ Thị Ngọc Hân',
    role: 'Frontend Developer',
    image: 'https://ui-avatars.com/api/?name=Tran+Van+A&background=28a745&color=fff&size=150',
    quote: 'Smart Contract không biết nói dối.'
  },
  {
    name: 'Nguyễn Thị Ngọc Lựa',
    role: 'Forntend Developer',
    image: 'https://ui-avatars.com/api/?name=Le+Thi+B&background=ffc107&color=fff&size=150',
    quote: 'Trải nghiệm người dùng là ưu tiên số 1.'
  },
]);

// Dữ liệu FAQ
const faqs = ref([
  {
    question: "Nền tảng này có thực sự miễn phí không?",
    answer: "Chúng tôi cung cấp gói miễn phí cho các cuộc thi quy mô nhỏ và phi lợi nhuận. Các tổ chức lớn có thể liên hệ để sử dụng gói Enterprise."
  },
  {
    question: "Làm thế nào để đảm bảo không có gian lận?",
    answer: "Mỗi lá phiếu được ký số và ghi vào Blockchain. Không ai, kể cả quản trị viên, có thể sửa đổi hoặc xóa lá phiếu sau khi đã ghi nhận."
  },
  {
    question: "Tôi có cần ví Crypto để bình chọn không?",
    answer: "Không bắt buộc. Chúng tôi hỗ trợ cả chế độ đăng nhập thường và chế độ Web3 (Metamask) tùy theo cấu hình của cuộc thi."
  }
]);
</script>

<style scoped>
/* 1. Hero Section */
.hero-about {
  height: 60vh;
  min-height: 400px;
  background: url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop') no-repeat center center/cover;
  background-attachment: fixed; /* Hiệu ứng Parallax */
}

.overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9));
}

.text-gradient-primary {
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 2. Typography & Helper */
.ls-1 { letter-spacing: 1px; }
.tracking-wide { letter-spacing: 2px; }

/* 3. Floating Card in Mission */
.floating-card {
  max-width: 200px;
  animation: float 6s ease-in-out infinite;
}
.icon-box {
  width: 50px; height: 50px;
  display: flex; align-items: center; justify-content: center;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

/* 4. Team Card */
.team-card {
  transition: all 0.3s ease;
}
.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
}
.team-img {
  width: 120px; height: 120px;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.team-card:hover .team-img {
  transform: scale(1.1);
  border-color: var(--bs-primary);
}
.social-links a:hover {
  color: var(--bs-primary) !important;
}

/* 5. Accordion (FAQ) */
.accordion-button:not(.collapsed) {
  background-color: rgba(13, 110, 253, 0.05);
  color: var(--bs-primary);
}
.accordion-button:focus {
  box-shadow: none;
  border-color: rgba(13, 110, 253, 0.1);
}

/* 6. CTA Button */
.hover-scale {
  transition: transform 0.2s;
}
.hover-scale:hover {
  transform: scale(1.05);
}
</style>