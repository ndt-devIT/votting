<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold text-primary mb-1">Tổng quan hệ thống</h4>
        <p class="text-muted small mb-0">Cập nhật lần cuối: {{ currentTime }}</p>
      </div>
      <button class="btn btn-sm btn-outline-primary" @click="fetchDashboardData">
        <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
      </button>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-xl-2 col-md-6" v-for="(card, index) in stats" :key="index">
        <div class="card shadow-sm border-0 h-100 stat-card" :class="`border-start-${card.color}`">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <div class="text-uppercase fw-bold text-muted small mb-1">{{ card.title }}</div>
                <div class="h3 mb-0 fw-bold text-dark">{{ card.value.toLocaleString() }}</div>
              </div>
              <div class="stat-icon rounded-3 d-flex align-items-center justify-content-center" :class="`bg-${card.color}-subtle text-${card.color}`">
                <i :class="['bi', card.icon, 'fs-4']"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white py-3">
            <h6 class="m-0 fw-bold text-primary">Biểu đồ tương tác</h6>
          </div>
          <div class="card-body">
            <div class="chart-container" style="position: relative; height: 350px;">
              <canvas id="dashboardChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 fw-bold text-primary">Bình chọn mới nhất</h6>
            <router-link to="/admin/vote" class="small text-decoration-none">Xem tất cả</router-link>
          </div>
          <div class="card-body p-0">
            <ul class="list-group list-group-flush">
              <li v-if="recentVotes.length === 0" class="list-group-item text-center text-muted py-4">
                Chưa có dữ liệu
              </li>
              <li v-for="vote in recentVotes" :key="vote._id" class="list-group-item px-3 py-3">
                <div class="d-flex align-items-center">
                  <div class="avatar-xs bg-light rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person-check text-success"></i>
                  </div>
                  <div class="flex-grow-1 overflow-hidden">
                    <h6 class="mb-1 text-truncate" style="font-size: 0.9rem;">
                      <strong>{{ vote.nguoiDung?.hoTen }}</strong> đã bình chọn
                    </h6>
                    <p class="mb-0 text-muted small text-truncate">
                      Cho: <span class="text-primary">{{ vote.ungVien?.hoTen }}</span>
                    </p>
                  </div>
                  <div class="text-end ms-2">
                    <small class="text-muted" style="font-size: 0.75rem;">{{ formatTime(vote.createdAt) }}</small>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/api/axiosClient";
import Chart from 'chart.js/auto';

// State
const currentTime = ref(new Date().toLocaleString('vi-VN'));
const recentVotes = ref([]);
const chartInstance = ref(null);

const stats = ref([
  { title: "Người dùng", value: 0, icon: "bi-people", color: "primary" }, // Xanh dương
  { title: "Cuộc thi", value: 0, icon: "bi-trophy", color: "warning" },  // Vàng
  { title: "Hạng mục", value: 0, icon: "bi-tags", color: "info" },       // Xanh lơ
  { title: "Ứng viên", value: 0, icon: "bi-person-badge", color: "secondary" }, // Xám
  { title: "Tổng Phiếu", value: 0, icon: "bi-hand-thumbs-up", color: "success" }, // Xanh lá
]);

// --- METHODS ---

// 1. Fetch Data Tối ưu (Dùng Promise.all)
async function fetchDashboardData() {
  currentTime.value = new Date().toLocaleString('vi-VN');
  
  try {
    // Gọi 5 API cùng lúc thay vì chờ từng cái
    // Lưu ý: Thêm params limit=1 để chỉ lấy metadata (total) nếu backend hỗ trợ phân trang chuẩn
    // Nếu backend trả về mảng full, ta vẫn phải chấp nhận, nhưng nên sửa backend sau này.
    const [resUsers, resContests, resCats, resCands, resVotes] = await Promise.all([
      axios.get("/api/nguoidung?limit=1"), 
      axios.get("/api/contest?limit=1"),
      axios.get("/api/category?limit=1"),
      axios.get("/api/candidate?limit=1"),
      axios.get("/api/vote?limit=5&sort=-createdAt") // Lấy 5 phiếu mới nhất
    ]);

    // Cập nhật Stats (Ưu tiên lấy .total từ server side pagination, fallback về .length)
    stats.value[0].value = resUsers.data.total || resUsers.data.data?.length || resUsers.data.length || 0;
    stats.value[1].value = resContests.data.total || resContests.data.data?.length || resContests.data.length || 0;
    stats.value[2].value = resCats.data.total || resCats.data.data?.length || resCats.data.length || 0;
    stats.value[3].value = resCands.data.total || resCands.data.data?.length || resCands.data.length || 0;
    stats.value[4].value = resVotes.data.total || resVotes.data.data?.length || resVotes.data.length || 0;

    // Cập nhật Recent Votes
    // Xử lý cấu trúc trả về khác nhau (có thể là {data: []} hoặc [])
    const voteList = resVotes.data.data || resVotes.data;
    recentVotes.value = Array.isArray(voteList) ? voteList.slice(0, 5) : [];

    // Vẽ biểu đồ
    renderChart();

  } catch (err) {
    console.error("Lỗi dashboard:", err);
  }
}

// 2. Render Chart
function renderChart() {
  const ctx = document.getElementById('dashboardChart');
  if (!ctx) return;

  // Hủy biểu đồ cũ nếu có để vẽ lại
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Người dùng', 'Cuộc thi', 'Hạng mục', 'Ứng viên', 'Phiếu bầu'],
      datasets: [{
        label: 'Số lượng',
        data: stats.value.map(s => s.value),
        backgroundColor: [
          'rgba(13, 110, 253, 0.7)', // Primary
          'rgba(255, 193, 7, 0.7)',  // Warning
          'rgba(13, 202, 240, 0.7)', // Info
          'rgba(108, 117, 125, 0.7)', // Secondary
          'rgba(25, 135, 84, 0.7)'    // Success
        ],
        borderColor: [
          'rgba(13, 110, 253, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(13, 202, 240, 1)',
          'rgba(108, 117, 125, 1)',
          'rgba(25, 135, 84, 1)'
        ],
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Helper: Format thời gian ngắn (VD: 10:30 20/11)
function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getDate()}/${date.getMonth() + 1}`;
}

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
/* Card Style */
.stat-card {
  transition: transform 0.2s;
  border-left-width: 4px !important; /* Viền màu bên trái */
}
.stat-card:hover {
  transform: translateY(-5px);
}

/* Icon Backgrounds */
.stat-icon {
  width: 48px;
  height: 48px;
}

/* Border Colors for Cards */
.border-start-primary { border-left-color: #0d6efd !important; }
.border-start-warning { border-left-color: #ffc107 !important; }
.border-start-info { border-left-color: #0dcaf0 !important; }
.border-start-secondary { border-left-color: #6c757d !important; }
.border-start-success { border-left-color: #198754 !important; }

/* Chart Container */
.chart-container {
  position: relative;
  width: 100%;
}
</style>