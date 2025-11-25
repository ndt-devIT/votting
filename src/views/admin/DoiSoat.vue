<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h4 class="fw-bold text-primary">
          <i class="bi bi-shield-check me-2"></i>Đối Soát Blockchain
        </h4>
        <p class="text-muted small">Kiểm tra tính toàn vẹn dữ liệu giữa Cơ sở dữ liệu (Web2) và Blockchain (Web3).</p>
      </div>
    </div>

    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body p-4">
        <div class="row g-3 align-items-end">
          <div class="col-md-6 col-lg-5">
            <label class="form-label fw-bold text-dark">Chọn cuộc thi cần kiểm tra:</label>
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-trophy text-warning"></i></span>
              <select class="form-select border-start-0" v-model="selectedContestId">
                <option value="" disabled>-- Vui lòng chọn cuộc thi --</option>
                <option v-for="contest in contests" :key="contest._id" :value="contest._id">
                  {{ contest.tenCuocThi }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="col-md-3 col-lg-2">
            <button 
              class="btn w-100" 
              :class="isLoading ? 'btn-secondary' : 'btn-primary'"
              @click="runAudit" 
              :disabled="!selectedContestId || isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i v-else class="bi bi-search me-1"></i>
              {{ isLoading ? 'Đang quét...' : 'Chạy Đối Soát' }}
            </button>
          </div>

          <div class="col-md-3 col-lg-2 ms-auto" v-if="hasRun">
            <button class="btn btn-outline-success w-100" @click="exportReport">
              <i class="bi bi-file-earmark-spreadsheet me-1"></i> Xuất Báo Cáo
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5 my-5">
      <div class="blockchain-loader mx-auto mb-4">
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
      </div>
      <h5 class="text-primary fw-bold">Đang kết nối mạng lưới Blockchain...</h5>
      <p class="text-muted">Đang xác thực từng giao dịch (Transaction Hash)</p>
    </div>

    <div v-else-if="hasRun">
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-success-subtle h-100">
            <div class="card-body text-center">
              <h6 class="text-success fw-bold text-uppercase">Hợp lệ (Matched)</h6>
              <h2 class="mb-0 fw-bold text-success">{{ stats.matched }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-danger-subtle h-100">
            <div class="card-body text-center">
              <h6 class="text-danger fw-bold text-uppercase">Gian lận (Mismatch)</h6>
              <h2 class="mb-0 fw-bold text-danger">{{ stats.mismatched }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-primary-subtle h-100">
            <div class="card-body text-center">
              <h6 class="text-primary fw-bold text-uppercase">Tổng phiếu On-Chain</h6>
              <h2 class="mb-0 fw-bold text-primary">{{ stats.totalOnChain }}</h2>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3 border-bottom">
          <h6 class="m-0 fw-bold text-dark">Chi tiết đối soát từng Ứng viên</h6>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">Ứng Viên</th>
                  <th class="text-center text-primary">Database (Web2)</th>
                  <th class="text-center text-dark bg-warning-subtle">Blockchain (Web3)</th>
                  <th class="text-center">Chênh lệch</th>
                  <th class="text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in report" :key="item.ungVienId">
                  <td class="ps-4 fw-medium">{{ item.hoTen }}</td>
                  
                  <td class="text-center fs-5 text-primary">{{ item.dbCount }}</td>
                  
                  <td class="text-center fs-5 fw-bold text-dark bg-warning-subtle">
                    {{ item.chainCount }}
                  </td>
                  
                  <td class="text-center">
                    <span v-if="item.dbCount - item.chainCount === 0" class="text-muted">-</span>
                    <span v-else class="text-danger fw-bold">
                      {{ item.dbCount - item.chainCount > 0 ? '+' : '' }}{{ item.dbCount - item.chainCount }}
                    </span>
                  </td>

                  <td class="text-center">
                    <span v-if="isMatched(item)" class="badge bg-success rounded-pill px-3">
                      <i class="bi bi-check-circle-fill me-1"></i> HỢP LỆ
                    </span>
                    <span v-else class="badge bg-danger rounded-pill px-3">
                      <i class="bi bi-exclamation-triangle-fill me-1"></i> GIAN LẬN
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="alert alert-info mt-4 d-flex align-items-center">
        <i class="bi bi-info-circle-fill fs-4 me-3"></i>
        <div>
          <strong>Nguyên lý hoạt động:</strong> Hệ thống so sánh số lượng phiếu bầu được lưu trong Database cục bộ với số lượng phiếu bầu thực tế được ghi nhận trên Smart Contract. Bất kỳ sự chênh lệch nào cũng có thể là dấu hiệu của việc sửa đổi dữ liệu trái phép.
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5 opacity-50">
      <div class="mb-3">
        <i class="bi bi-shield-lock fs-1 text-secondary"></i>
      </div>
      <h5 class="text-muted">Chọn cuộc thi để bắt đầu kiểm tra tính toàn vẹn.</h5>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/api/axiosClient';
import Swal from 'sweetalert2';

// State
const contests = ref([]); 
const selectedContestId = ref(""); 
const isLoading = ref(false);
const report = ref([]);
const hasRun = ref(false); 

// Computed Statistics
const stats = computed(() => {
  let matched = 0;
  let mismatched = 0;
  let totalOnChain = 0;

  report.value.forEach(item => {
    totalOnChain += Number(item.chainCount);
    if (isMatched(item)) {
      matched++;
    } else {
      mismatched++;
    }
  });

  return { matched, mismatched, totalOnChain };
});

// Helper: Check match
function isMatched(item) {
  // Logic so sánh, có thể mở rộng (ví dụ: item.status từ backend)
  return item.dbCount == item.chainCount; 
}

// 1. Load Contests
const getContests = async () => {
  try {
    // Backend của bạn cần hỗ trợ lọc (ví dụ: chỉ hiện các cuộc thi đang diễn ra hoặc đã kết thúc)
    const res = await axios.get('/api/contest'); 
    contests.value = res.data.data || res.data;
  } catch (err) {
    console.error("Lỗi tải danh sách cuộc thi:", err);
  }
};

// 2. Run Audit
const runAudit = async () => {
  if (!selectedContestId.value) return;

  isLoading.value = true;
  hasRun.value = false;
  report.value = [];
  
  try {
    // Giả lập delay để hiển thị hiệu ứng loading (nếu mạng quá nhanh)
    // await new Promise(r => setTimeout(r, 1500)); 

    const res = await axios.get(`/api/vote/audit/${selectedContestId.value}`);
    
    // Backend trả về { report: [...] }
    report.value = res.data.report;
    hasRun.value = true;
    
    if (report.value.length === 0) {
      Swal.fire("Thông báo", "Cuộc thi này chưa có dữ liệu bình chọn nào.", "info");
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Đối soát hoàn tất',
        text: 'Dữ liệu đã được xác thực với Blockchain.',
        timer: 1500,
        showConfirmButton: false
      });
    }

  } catch (err) {
    console.error("Lỗi đối soát:", err);
    Swal.fire("Lỗi", "Không thể kết nối tới Node Blockchain hoặc Smart Contract.", "error");
  } finally {
    isLoading.value = false;
  }
};

// 3. Export Report (Giả lập)
const exportReport = () => {
  Swal.fire({
    title: 'Đang xuất báo cáo...',
    text: 'Vui lòng chờ trong giây lát',
    timer: 2000,
    didOpen: () => Swal.showLoading()
  }).then(() => {
    Swal.fire('Thành công', 'File báo cáo audit_report.pdf đã được tải xuống.', 'success');
  });
};

onMounted(() => {
  getContests();
});
</script>

<style scoped>
/* Loading Animation (Blockchain Block) */
.blockchain-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

.box {
  height: 20px;
  width: 20px;
  margin-right: 10px;
  background-color: #0d6efd;
  animation: load 1s infinite;
  border-radius: 4px;
}

.box:nth-child(2) { animation-delay: 0.1s; background-color: #0b5ed7; }
.box:nth-child(3) { animation-delay: 0.2s; background-color: #0a58ca; }
.box:nth-child(4) { animation-delay: 0.3s; background-color: #084298; }

@keyframes load {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

/* Table */
.table th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>