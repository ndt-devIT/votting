<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold text-primary mb-1">Thống kê cá nhân</h3>
        <p class="text-muted small mb-0">Theo dõi hoạt động bình chọn và lịch sử của bạn.</p>
      </div>
      <div class="badge bg-light text-dark border p-2">
        <i class="bi bi-clock-history me-1"></i> Dữ liệu cập nhật: {{ currentTime }}
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100 stat-card border-start-primary">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-uppercase text-muted small fw-bold mb-1">Tổng lượt vote</p>
                <h3 class="fw-bold mb-0 text-primary">{{ stats.totalVotes }}</h3>
              </div>
              <div class="icon-box bg-primary-subtle text-primary rounded-circle">
                <i class="bi bi-hand-thumbs-up-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100 stat-card border-start-warning">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-uppercase text-muted small fw-bold mb-1">Cuộc thi tham gia</p>
                <h3 class="fw-bold mb-0 text-warning">{{ stats.contestsJoined }}</h3>
              </div>
              <div class="icon-box bg-warning-subtle text-warning rounded-circle">
                <i class="bi bi-trophy-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100 stat-card border-start-success">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-uppercase text-muted small fw-bold mb-1">Phiếu hợp lệ</p>
                <h3 class="fw-bold mb-0 text-success">{{ stats.validRate }}%</h3>
              </div>
              <div class="icon-box bg-success-subtle text-success rounded-circle">
                <i class="bi bi-shield-check fs-4"></i>
              </div>
            </div>
            <small class="text-muted" style="font-size: 0.75rem;">Đã xác thực trên Blockchain</small>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card border-0 shadow-sm h-100 stat-card border-start-info">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div class="overflow-hidden">
                <p class="text-uppercase text-muted small fw-bold mb-1">Hạng mục yêu thích</p>
                <h5 class="fw-bold mb-0 text-info text-truncate">{{ stats.favCategory || 'Chưa có' }}</h5>
              </div>
              <div class="icon-box bg-info-subtle text-info rounded-circle flex-shrink-0">
                <i class="bi bi-heart-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white py-3">
            <h6 class="fw-bold m-0"><i class="bi bi-pie-chart me-2 text-primary"></i>Phân bố phiếu bầu theo cuộc thi</h6>
          </div>
          <div class="card-body d-flex align-items-center justify-content-center">
            <div v-if="loading" class="spinner-border text-primary" role="status"></div>
            <div v-else-if="stats.totalVotes === 0" class="text-muted text-center py-5">
              Chưa có dữ liệu biểu đồ
            </div>
            <div v-else class="chart-container" style="position: relative; height: 300px; width: 100%;">
              <canvas id="userVoteChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h6 class="fw-bold m-0"><i class="bi bi-activity me-2 text-success"></i>Hoạt động gần đây</h6>
            <router-link to="/lichsuvote" class="small text-decoration-none">Xem chi tiết</router-link>
          </div>
          <div class="card-body p-0">
            <ul class="list-group list-group-flush">
              <li v-if="recentActivity.length === 0" class="list-group-item text-center text-muted py-4">
                Bạn chưa thực hiện bình chọn nào.
              </li>
              
              <li v-for="item in recentActivity" :key="item._id" class="list-group-item p-3 border-bottom-0 border-top">
                <div class="d-flex">
                  <div class="me-3 d-flex flex-column align-items-center">
                    <div class="avatar-sm rounded-circle bg-light d-flex align-items-center justify-content-center text-primary border">
                      <i class="bi bi-check-lg"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="fw-bold text-dark text-truncate" style="max-width: 150px;">
                        {{ item.ungVien?.hoTen }}
                      </span>
                      <small class="text-muted">{{ formatTime(item.createdAt || item.ngayBinhChon) }}</small>
                    </div>
                    <p class="mb-0 small text-muted">
                      Đã bình chọn trong <span class="text-primary">{{ item.cuocThi?.tenCuocThi }}</span>
                    </p>
                    <div class="mt-1">
                      <span class="badge bg-success-subtle text-success" v-if="item.status === 1">
                        <i class="bi bi-shield-check me-1"></i>Đã ghi nhận
                      </span>
                      <span class="badge bg-secondary-subtle text-secondary" v-else>
                        Đang xử lý
                      </span>
                    </div>
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
import { ref, onMounted, reactive } from 'vue';
import axios from '@/api/axiosClient';
import Chart from 'chart.js/auto';

// State
const loading = ref(true);
const currentTime = new Date().toLocaleDateString('vi-VN');
const recentActivity = ref([]);
const chartInstance = ref(null);

const stats = reactive({
  totalVotes: 0,
  contestsJoined: 0,
  validRate: 100,
  favCategory: ''
});

// Methods
const fetchUserStats = async () => {
  try {
    loading.value = true;
    // Gọi API lấy lịch sử vote của chính user này
    // Backend cần hỗ trợ populate đầy đủ: cuocThi, hangMuc, ungVien
    const res = await axios.get('/api/vote/me'); 
    
    const votes = res.data.data || res.data; // Xử lý tùy format trả về
    processStats(votes);
    
  } catch (err) {
    console.error("Lỗi tải thống kê:", err);
  } finally {
    loading.value = false;
  }
};

// Xử lý dữ liệu thô thành thống kê (Client-side processing)
const processStats = (votes) => {
  if (!votes || votes.length === 0) return;

  // 1. Tổng vote
  stats.totalVotes = votes.length;

  // 2. Hoạt động gần đây (Lấy 5 cái mới nhất)
  // Sắp xếp mới nhất trước nếu API chưa sắp xếp
  const sortedVotes = [...votes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  recentActivity.value = sortedVotes.slice(0, 5);

  // 3. Số cuộc thi tham gia (Unique)
  const uniqueContests = new Set(votes.map(v => v.cuocThi?._id));
  stats.contestsJoined = uniqueContests.size;

  // 4. Tỷ lệ hợp lệ
  const validVotes = votes.filter(v => v.status === 1).length;
  stats.validRate = stats.totalVotes > 0 ? Math.round((validVotes / stats.totalVotes) * 100) : 0;

  // 5. Hạng mục yêu thích (Tìm mode)
  const catCounts = {};
  votes.forEach(v => {
    const name = v.hangMuc?.tenHangMuc;
    if(name) catCounts[name] = (catCounts[name] || 0) + 1;
  });
  // Tìm tên có count lớn nhất
  let maxCount = 0;
  let favCat = '';
  for (const [name, count] of Object.entries(catCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favCat = name;
    }
  }
  stats.favCategory = favCat;

  // 6. Vẽ biểu đồ (Votes per Contest)
  const contestCounts = {};
  votes.forEach(v => {
    const name = v.cuocThi?.tenCuocThi || 'Khác';
    contestCounts[name] = (contestCounts[name] || 0) + 1;
  });
  
  renderChart(Object.keys(contestCounts), Object.values(contestCounts));
};

const renderChart = (labels, data) => {
  const ctx = document.getElementById('userVoteChart');
  if (!ctx) return;

  if (chartInstance.value) chartInstance.value.destroy();

  chartInstance.value = new Chart(ctx, {
    type: 'doughnut', // Biểu đồ tròn rỗng giữa
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#0d6efd', '#198754', '#ffc107', '#0dcaf0', '#6610f2'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' } // Chú thích nằm bên phải
      },
      cutout: '70%' // Độ mỏng của bánh donut
    }
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
};

onMounted(() => {
  fetchUserStats();
});
</script>

<style scoped>
/* Stat Cards */
.stat-card {
  border-left: 4px solid transparent;
  transition: transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
}
.border-start-primary { border-left-color: #0d6efd !important; }
.border-start-success { border-left-color: #198754 !important; }
.border-start-warning { border-left-color: #ffc107 !important; }
.border-start-info { border-left-color: #0dcaf0 !important; }

/* Icon Box */
.icon-box {
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
}

/* Avatar small */
.avatar-sm {
  width: 32px; height: 32px;
}
</style>