<template>
    <section class="news-section py-5 my-5">
        <div class="container">
            <div class="row justify-content-center mb-4">
                <div class="col-md-8 text-center" data-aos="fade-up">
                    <h2 class="fw-bold display-5">Tin tức & Hướng dẫn</h2>
                    <p class="lead text-muted">
                        Cập nhật các sự kiện mới nhất và tìm hiểu thêm về công nghệ của
                        chúng tôi.
                    </p>
                </div>
            </div>

            <div v-if="loading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mt-2">Đang tải tin tức...</p>
            </div>

            <div v-else class="row g-4">
                <div class="col-md-4" v-for="(item, index) in newsItems" :key="item.id" data-aos="fade-up"
                    :data-aos-delay="100 * (index + 1)">
                    <div class="card card-news h-100 shadow-sm border-0">
                        <img :src="item.imageUrl" class="card-img-top" :alt="item.alt">

                        <div class="card-body">
                            <span :class="['badge', 'mb-2', item.badgeClass]">
                                {{ item.badge }}
                            </span>
                            <h5 class="card-title fw-semibold">{{ item.title }}</h5>
                            <p class="card-text text-muted">
                                {{ item.text }}
                            </p>
                            <a href="#" class="text-primary text-decoration-none fw-semibold">
                                Đọc thêm <i class="bi bi-arrow-right-short"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Import axios (giống như HeroSlider.vue)

const newsItems = ref([]);
const loading = ref(true);

// Dùng lại logic và KEY từ HeroSlider.vue của bạn
const ACCESS_KEY = '1x9hOE7G5_fa5H4rgnyE9frxS_GCHZNLYxCgW3Fo5WA'; // Key của bạn
const query = 'technology,event,conference,code,guide'; // Từ khóa cho tin tức

onMounted(async () => {
    try {
        loading.value = true;

        // 1. Gọi API Unsplash để lấy 3 ảnh ngẫu nhiên
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: ACCESS_KEY,
                count: 3, // Chỉ cần 3 ảnh
                query: query,
                orientation: 'landscape', // Ảnh ngang
            }
        });

        // 2. Dữ liệu text tĩnh (vì API chỉ trả về ảnh)
        const staticData = [
            {
                badge: 'Công nghệ',
                title: 'Blockchain & Bỏ phiếu',
                text: 'Tìm hiểu làm thế nào công nghệ blockchain đang thay đổi tương lai của bầu cử...',
                badgeClass: 'bg-primary-subtle text-primary-emphasis'
            },
            {
                badge: 'Sự kiện',
                title: 'Ra mắt cuộc thi mới',
                text: 'Chúng tôi vui mừng thông báo về cuộc thi "Nhà sáng tạo Tương lai"...',
                badgeClass: 'bg-success-subtle text-success-emphasis'
            },
            {
                badge: 'Hướng dẫn',
                title: 'Cách tạo một cuộc thi',
                text: 'Hướng dẫn từng bước để bạn có thể tự khởi chạy một cuộc bình chọn minh bạch...',
                badgeClass: 'bg-info-subtle text-info-emphasis'
            }
        ];

        // 3. Gộp ảnh từ API và text tĩnh
        newsItems.value = response.data.map((image, index) => {
            return {
                id: image.id,
                imageUrl: image.urls.regular, // URL ảnh để hiển thị
                alt: image.alt_description || 'News Image',
                ...(staticData[index]) // Gộp text (title, badge, v.v.)
            };
        });

    } catch (error) {
        console.error("Lỗi khi tải ảnh từ Unsplash:", error);
        // TODO: Bạn có thể thêm fallback data (ảnh local) ở đây nếu API lỗi
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.card-news {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
}

.card-news:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.card-news .card-img-top {
    height: 200px;
    object-fit: cover;
    /* Thêm màu nền dự phòng */
    background-color: #eee;
}
</style>