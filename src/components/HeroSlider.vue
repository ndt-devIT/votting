<template>
  <section id="hero-slider" class="carousel slide carousel-fade hero-container" data-bs-ride="carousel">

    <div class="carousel-inner">
      <div v-for="(image, index) in unsplashImages" :key="index" :class="['carousel-item', { active: index === 0 }]">
        <img :src="image.urls.regular" class="d-block w-100" :alt="image.alt_description || 'Unsplash Image'" />
      </div>
    </div>

    <div class="hero-overlay d-flex flex-column justify-content-center align-items-center text-center">

      <div class="glass-card" data-aos="fade-up">
        <h1 class="display-4 fw-bold text-white mb-3">
          BÌNH CHỌN MINH BẠCH
        </h1>
        <p class="lead text-white-75 mb-4">
          Nền tảng bỏ phiếu an toàn, phi tập trung, <br>được xác thực bởi công nghệ Blockchain.
        </p>
        <div>
          <router-link to="/caccuocthi" class="btn btn-light btn-lg px-4 py-2">
            <i class="bi bi-check-circle me-2"></i>
            Khám phá các cuộc thi
          </router-link>
        </div>
      </div>

    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#hero-slider" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#hero-slider" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>
  </section>
</template>

<script setup>
// Script của bạn giữ nguyên, không cần thay đổi
import { ref, onMounted } from 'vue';
import axios from 'axios';

const unsplashImages = ref([]);
const ACCESS_KEY = '1x9hOE7G5_fa5H4rgnyE9frxS_GCHZNLYxCgW3Fo5WA';
const query = 'technology, voting';

const fetchUnsplashImages = async () => {
  try {
    const response = await axios.get(`https://api.unsplash.com/photos/random`, {
      params: {
        client_id: ACCESS_KEY,
        count: 5,
        query: query,
        orientation: 'landscape',
      },
    });
    unsplashImages.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải ảnh từ Unsplash:", error);
    unsplashImages.value = [
      { urls: { regular: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto-format&fit=crop' }, alt_description: 'Default Image 1' },
      { urls: { regular: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2070&auto-format&fit=crop' }, alt_description: 'Default Image 2' },
      { urls: { regular: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto-format&fit=crop' }, alt_description: 'Default Image 3' },
    ];
  }
};

onMounted(() => {
  fetchUnsplashImages();
});
</script>

<style scoped>
/* Container chính */
.hero-container {
  position: relative;
  height: 70vh;
  min-height: 450px;
  max-height: 650px;
  overflow: hidden;
  background-color: #333;
}

/* Các slide item */
#hero-slider .carousel-item {
  height: 70vh;
  min-height: 450px;
  max-height: 650px;
  overflow: hidden;
}

/* THAY ĐỔI: Lớp phủ tối, nhưng NHẸ HƠN */
#hero-slider .carousel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  /* Chỉ 30% tối */
  z-index: 2;
}

/* Ảnh nền (vẫn giữ Ken Burns) */
#hero-slider .carousel-item img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  animation: kenburns 20s ease-in-out infinite;
  transition: transform 1s ease;
  z-index: 1;
}

@keyframes kenburns {
  0% {
    transform: scale(1) translate(0, 0);
  }

  50% {
    transform: scale(1.1) translate(-5px, 10px);
  }

  100% {
    transform: scale(1) translate(0, 0);
  }
}

/* Lớp phủ nội dung (Căn giữa) */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  padding: 2rem;
}

/* --- BỔ SUNG: THẺ KÍNH MỜ --- */
.glass-card {
  /* Hiệu ứng kính */
  background: rgba(255, 255, 255, 0.1);
  /* Nền trắng trong suốt 10% */
  backdrop-filter: blur(15px);
  /* Đây là mấu chốt: làm mờ nền sau nó */
  -webkit-backdrop-filter: blur(15px);
  /* Cho Safari */

  /* Kiểu dáng */
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* Viền trắng mờ */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  /* Đổ bóng nhẹ */

  /* Nội dung */
  padding: 2.5rem;
  max-width: 750px;
  /* Giới hạn chiều rộng */
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.glass-card .btn {
  font-weight: 500;
  transition: all 0.3s ease;
  /* Bỏ box-shadow vì card đã có */
}

.glass-card .btn:hover {
  transform: scale(1.05);
  /* Hiệu ứng hover cho nút */
  background-color: #fff;
  color: #0d6efd;
}

/* Nút điều khiển (nằm trên cùng) */
.carousel-control-prev,
.carousel-control-next {
  z-index: 10;
}
</style>