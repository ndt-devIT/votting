<template>
  <div class="contact-page">
    
    <section class="hero-contact position-relative d-flex align-items-center text-white">
      <div class="overlay"></div>
      <div class="container position-relative z-2 text-center">
        <h1 class="display-3 fw-bold mb-3" data-aos="zoom-in">Liên hệ với chúng tôi</h1>
        <p class="lead text-white-50 mx-auto" style="max-width: 600px;" data-aos="fade-up" data-aos-delay="100">
          Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn. Đừng ngần ngại gửi câu hỏi hoặc yêu cầu hỗ trợ.
        </p>
      </div>
    </section>

    <section class="py-5 my-5">
      <div class="container">
        <div class="row g-5">
          
          <div class="col-lg-5" data-aos="fade-right">
            <div class="pe-lg-4">
              <h6 class="text-primary fw-bold text-uppercase ls-1 mb-3">Thông tin liên lạc</h6>
              <h2 class="fw-bold mb-4">Hãy kết nối với Voting Platform</h2>
              <p class="text-muted mb-5">
                Bạn cần hỗ trợ kỹ thuật, báo giá dịch vụ tổ chức cuộc thi, hay chỉ đơn giản là muốn tìm hiểu thêm? Chúng tôi ở đây để giúp bạn.
              </p>

              <div class="d-flex align-items-center mb-4 info-item">
                <div class="icon-box bg-primary text-white rounded-circle flex-shrink-0 me-3 shadow">
                  <i class="bi bi-geo-alt-fill fs-5"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">Địa chỉ</h6>
                  <p class="text-muted small mb-0">256 Nguyễn Văn Cừ, Phường Tân An, Thành phố Cần Thơ</p>
                </div>
              </div>

              <div class="d-flex align-items-center mb-4 info-item">
                <div class="icon-box bg-success text-white rounded-circle flex-shrink-0 me-3 shadow">
                  <i class="bi bi-envelope-fill fs-5"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">Email hỗ trợ</h6>
                  <p class="text-muted small mb-0">ndt.it.ct@gmail.com</p>
                </div>
              </div>

              <div class="d-flex align-items-center mb-4 info-item">
                <div class="icon-box bg-warning text-dark rounded-circle flex-shrink-0 me-3 shadow">
                  <i class="bi bi-telephone-fill fs-5"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">Hotline</h6>
                  <p class="text-muted small mb-0">+84 862 770 701</p>
                </div>
              </div>

              <div class="mt-5">
                <h6 class="fw-bold mb-3">Mạng xã hội</h6>
                <div class="d-flex gap-3">
                  <a href="#" class="social-btn"><i class="bi bi-facebook"></i></a>
                  <a href="#" class="social-btn"><i class="bi bi-twitter-x"></i></a>
                  <a href="#" class="social-btn"><i class="bi bi-linkedin"></i></a>
                  <a href="#" class="social-btn"><i class="bi bi-youtube"></i></a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-7" data-aos="fade-left">
            <div class="card border-0 shadow-lg p-4 p-md-5 bg-white rounded-4 position-relative overflow-hidden">
              <div class="shape-circle"></div>

              <div class="position-relative z-1">
                <h3 class="fw-bold mb-4">Gửi tin nhắn cho chúng tôi</h3>
                
                <form @submit.prevent="submitForm">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input type="text" class="form-control bg-light border-0" id="name" placeholder="Họ tên" v-model="form.name" required>
                        <label for="name">Họ và tên</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input type="email" class="form-control bg-light border-0" id="email" placeholder="Email" v-model="form.email" required>
                        <label for="email">Email của bạn</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating">
                        <input type="text" class="form-control bg-light border-0" id="subject" placeholder="Tiêu đề" v-model="form.subject" required>
                        <label for="subject">Tiêu đề</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating">
                        <textarea class="form-control bg-light border-0" placeholder="Nội dung" id="message" style="height: 150px" v-model="form.message" required></textarea>
                        <label for="message">Nội dung tin nhắn</label>
                      </div>
                    </div>
                    <div class="col-12 mt-4">
                      <button type="submit" class="btn btn-primary btn-lg w-100 rounded-pill shadow-sm" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        {{ isLoading ? 'Đang gửi...' : 'Gửi tin nhắn ngay' }} <i class="bi bi-send-fill ms-2" v-if="!isLoading"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="map-section" data-aos="fade-up">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d982.1592534389973!2d105.7674015696316!3d10.046782019918743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0880f08006ffb%3A0x9a745510330faf4e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBL4bu5IHRodeG6rXQgLSBDw7RuZyBuZ2jhu4cgQ-G6p24gVGjGoQ!5e0!3m2!1svi!2s!4v1763976257467!5m2!1svi!2s" 
        width="100%" 
        height="450" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </section>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Swal from 'sweetalert2';

const isLoading = ref(false);

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitForm = async () => {
  // Giả lập gửi form
  isLoading.value = true;
  
  try {
    // Giả lập delay mạng 2s
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success
    Swal.fire({
      icon: 'success',
      title: 'Đã gửi thành công!',
      text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.',
      confirmButtonColor: '#0d6efd'
    });

    // Reset form
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: 'Không thể gửi tin nhắn. Vui lòng thử lại sau.',
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 1. Hero Section */
.hero-contact {
  height: 50vh;
  min-height: 350px;
  background: url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop') no-repeat center center/cover;
  background-attachment: fixed;
}

.overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(13, 110, 253, 0.8));
}

/* 2. Typography */
.ls-1 { letter-spacing: 1px; }

/* 3. Icon Box */
.icon-box {
  width: 50px; height: 50px;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.3s ease;
}
.info-item:hover .icon-box {
  transform: scale(1.1) rotate(10deg);
}

/* 4. Social Buttons */
.social-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  background-color: #f8f9fa;
  color: #6c757d;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
}
.social-btn:hover {
  background-color: #0d6efd;
  color: #fff;
  transform: translateY(-3px);
}

/* 5. Form Style */
.form-control:focus {
  box-shadow: none;
  background-color: #fff;
  border: 1px solid #86b7fe !important; /* Hiện border khi focus */
}

/* Decorative Shape inside Card */
.shape-circle {
  position: absolute;
  top: -50px; right: -50px;
  width: 200px; height: 200px;
  background: rgba(13, 110, 253, 0.1);
  border-radius: 50%;
  z-index: 0;
}

/* 6. Map */
.map-section iframe {
  display: block; /* Loại bỏ khoảng trắng dưới iframe */
  filter: grayscale(20%); /* Làm màu bản đồ dịu đi một chút */
  transition: filter 0.3s;
}
.map-section:hover iframe {
  filter: grayscale(0%);
}
</style>