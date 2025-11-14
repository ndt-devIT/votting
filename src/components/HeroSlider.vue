<template>
  <section id="hero-slider" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div v-for="(image, index) in unsplashImages" :key="index" :class="['carousel-item', { active: index === 0 }]">
        <img :src="image.urls.regular" class="d-block w-100" :alt="image.alt_description || 'Unsplash Image'" />
        <div v-if="index === 0" class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
          <h3>Chào mừng đến với nền tảng bình chọn</h3>
          <p>Bình chọn minh bạch, an toàn, tích hợp Blockchain</p>
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
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Cần cài đặt axios: npm install axios

const unsplashImages = ref([]);
const ACCESS_KEY = '1x9hOE7G5_fa5H4rgnyE9frxS_GCHZNLYxCgW3Fo5WA'; // Thay thế bằng Access Key của bạn
const collectionId = '786022'; // ID của một bộ sưu tập ảnh bạn muốn lấy, ví dụ: "Abstract Wallpapers" hoặc bạn có thể bỏ qua để lấy ảnh ngẫu nhiên.
const query = 'technology, voting'; // Các từ khóa để tìm kiếm ảnh

const fetchUnsplashImages = async () => {
  try {
    const response = await axios.get(`https://api.unsplash.com/photos/random`, {
      params: {
        client_id: ACCESS_KEY,
        count: 50, // Số lượng ảnh bạn muốn lấy
        query: query,
        orientation: 'landscape', // Để đảm bảo ảnh có định dạng ngang phù hợp với banner
        // collection: collectionId, // Bỏ comment nếu bạn muốn lấy ảnh từ một bộ sưu tập cụ thể
      },
    });
    unsplashImages.value = response.data;
  } catch (error) {
    console.error("Lỗi khi tải ảnh từ Unsplash:", error);
    // Fallback nếu không thể tải ảnh từ Unsplash
    unsplashImages.value = [
      { urls: { regular: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop' }, alt_description: 'Default Image 1' },
      { urls: { regular: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2070&auto=format&fit=crop' }, alt_description: 'Default Image 2' },
      { urls: { regular: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop' }, alt_description: 'Default Image 3' },
      // Thêm các ảnh mặc định khác nếu cần
    ];
  }
};

onMounted(() => {
  fetchUnsplashImages();
});
</script>

<style scoped>
/* Thêm CSS cho chiều cao của carousel để ảnh hiển thị đẹp hơn */
#hero-slider .carousel-item {
  height: 500px;
  /* Điều chỉnh chiều cao theo ý muốn */
  overflow: hidden;
}

#hero-slider .carousel-item img {
  object-fit: cover;
  /* Đảm bảo ảnh cover toàn bộ vùng */
  height: 100%;
  width: 100%;
}
</style>