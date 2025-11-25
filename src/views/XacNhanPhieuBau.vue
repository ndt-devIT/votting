<template>
  <div class="container py-5">
    
    <div v-if="isLoading" class="text-center py-5 my-5">
      <div class="spinner-grow text-primary" role="status"></div>
      <p class="mt-3 text-muted">Đang truy xuất dữ liệu Blockchain...</p>
    </div>

    <div v-else-if="!vote" class="text-center py-5">
      <i class="bi bi-exclamation-octagon display-1 text-danger opacity-50"></i>
      <h4 class="mt-3 text-danger fw-bold">Không tìm thấy dữ liệu</h4>
      <p class="text-muted">Phiếu bầu không tồn tại hoặc chưa được đồng bộ.</p>
      <router-link to="/" class="btn btn-outline-primary mt-2">Về trang chủ</router-link>
    </div>

    <div v-else class="row justify-content-center fade-in">
      <div class="col-lg-9 col-xl-8">
        
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden print-area">
          
          <div class="card-header bg-white p-4 border-bottom">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <img src="@/assets/img/logo.png" height="30" class="me-2" alt="Logo">
                <span class="fw-bold text-uppercase tracking-wide small text-muted">Voting Platform</span>
              </div>
              <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                <i class="bi bi-patch-check-fill me-1"></i> VERIFIED ON BLOCKCHAIN
              </span>
            </div>
          </div>

          <div class="card-body p-0">
            
            <div class="p-4 p-md-5 bg-light-gradient">
              <div class="row align-items-center text-center g-4">
                <div class="col-md-5">
                  <div class="avatar-lg mx-auto bg-white shadow-sm text-primary fw-bold border border-2 mb-3">
                    {{ getInitials(vote.nguoiDung.hoTen) }}
                  </div>
                  <h5 class="fw-bold mb-1">{{ vote.nguoiDung.hoTen }}</h5>
                  <div class="text-muted small">{{ vote.nguoiDung.email }}</div>
                </div>

                <div class="col-md-2">
                  <div class="d-flex flex-column align-items-center">
                    <span class="badge bg-primary rounded-pill mb-2">BÌNH CHỌN</span>
                    <i class="bi bi-arrow-right display-6 text-muted d-none d-md-block"></i>
                    <i class="bi bi-arrow-down display-6 text-muted d-md-none"></i>
                  </div>
                </div>

                <div class="col-md-5">
                  <div class="avatar-lg mx-auto bg-white shadow-sm text-success fw-bold border border-2 border-success mb-3">
                    {{ getInitials(vote.ungVien.hoTen) }}
                  </div>
                  <h5 class="fw-bold mb-1 text-success">{{ vote.ungVien.hoTen }}</h5>
                  <div class="badge bg-white text-dark border mt-1">
                    {{ vote.hangMuc.tenHangMuc }}
                  </div>
                </div>
              </div>

              <div class="text-center mt-4 pt-4 border-top border-dashed">
                <small class="text-uppercase text-muted fw-bold">Trong khuôn khổ cuộc thi</small>
                <h4 class="fw-bold text-dark mt-1">{{ vote.cuocThi.tenCuocThi }}</h4>
                <small class="text-muted"><i class="bi bi-clock me-1"></i>{{ formatDate(vote.ngayBinhChon) }}</small>
              </div>
            </div>

            <div class="p-4">
              <h6 class="fw-bold text-secondary text-uppercase small mb-3">
                <i class="bi bi-cpu me-1"></i> Thông tin kỹ thuật (Technical Metadata)
              </h6>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="p-3 bg-light rounded-3 h-100 border">
                    <label class="small text-muted fw-bold mb-1">Vote ID (Mã phiếu)</label>
                    <div class="input-group input-group-sm">
                      <input type="text" class="form-control font-monospace bg-white" :value="vote._id" readonly>
                      <button class="btn btn-outline-secondary" @click="copyText(vote._id)"><i class="bi bi-files"></i></button>
                    </div>

                    <label class="small text-muted fw-bold mb-1 mt-3">User ID</label>
                    <div class="input-group input-group-sm">
                      <input type="text" class="form-control font-monospace bg-white" :value="vote.nguoiDung._id" readonly>
                      <button class="btn btn-outline-secondary" @click="copyText(vote.nguoiDung._id)"><i class="bi bi-files"></i></button>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="p-3 bg-light rounded-3 h-100 border">
                    <label class="small text-muted fw-bold mb-1">Candidate ID</label>
                    <div class="input-group input-group-sm">
                      <input type="text" class="form-control font-monospace bg-white" :value="vote.ungVien._id" readonly>
                      <button class="btn btn-outline-secondary" @click="copyText(vote.ungVien._id)"><i class="bi bi-files"></i></button>
                    </div>

                    <div class="row mt-3">
                      <div class="col-6">
                        <label class="small text-muted fw-bold mb-1">Contest ID</label>
                        <div class="d-flex align-items-center bg-white px-2 py-1 rounded border">
                          <span class="text-truncate small font-monospace flex-grow-1">{{ vote.cuocThi._id }}</span>
                          <i class="bi bi-files cursor-pointer ms-1 text-secondary" @click="copyText(vote.cuocThi._id)"></i>
                        </div>
                      </div>
                      <div class="col-6">
                        <label class="small text-muted fw-bold mb-1">Category ID</label>
                        <div class="d-flex align-items-center bg-white px-2 py-1 rounded border">
                          <span class="text-truncate small font-monospace flex-grow-1">{{ vote.hangMuc._id }}</span>
                          <i class="bi bi-files cursor-pointer ms-1 text-secondary" @click="copyText(vote.hangMuc._id)"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-dark text-white p-4">
              <div class="row align-items-center">
                <div class="col-md-8 mb-3 mb-md-0">
                  <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-link-45deg fs-3 text-info me-2"></i>
                    <span class="fw-bold text-uppercase small ls-1">Bằng chứng Blockchain (Transaction Hash)</span>
                  </div>
                  <div class="bg-black bg-opacity-25 p-3 rounded border border-secondary position-relative group-hover">
                    <code class="text-info text-break">{{ vote.blockchainTxHash }}</code>
                    <button class="btn btn-sm btn-dark position-absolute top-0 end-0 m-1" @click="copyText(vote.blockchainTxHash, 'TxHash')">
                      Copy
                    </button>
                  </div>
                </div>
                <div class="col-md-4 text-md-end">
                  <a :href="getBlockExplorerUrl(vote.blockchainTxHash)" target="_blank" class="btn btn-primary w-100 mb-2">
                    <i class="bi bi-box-arrow-up-right me-2"></i>Verify on Etherscan
                  </a>
                  <button class="btn btn-outline-light w-100" @click="printReceipt">
                    <i class="bi bi-printer me-2"></i>In biên nhận
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="text-center mt-4">
          <router-link to="/lichsuvote" class="text-decoration-none text-muted small">
            <i class="bi bi-arrow-left me-1"></i> Quay lại lịch sử bình chọn
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/api/axiosClient';
import Swal from 'sweetalert2';

const vote = ref(null);
const isLoading = ref(true);
const route = useRoute();

const fetchReceipt = async (txHash) => {
  try {
    isLoading.value = true;
    const res = await axios.get(`/api/vote/receipt/${txHash}`);
    vote.value = res.data;
  } catch (err) {
    console.error(err);
    vote.value = null;
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateStr) => {
  if(!dateStr) return '';
  return new Date(dateStr).toLocaleString('vi-VN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const getBlockExplorerUrl = (hash) => `https://sepolia.etherscan.io/tx/${hash}`;

const copyText = (text, label = "ID") => {
  if(text) {
    navigator.clipboard.writeText(text);
    const Toast = Swal.mixin({ toast: true, position: 'top', showConfirmButton: false, timer: 1500 });
    Toast.fire({ icon: 'success', title: 'Đã sao chép' });
  }
}

const getInitials = (name) => name ? name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "??";

const printReceipt = () => {
  window.print();
};

onMounted(() => {
  const txHash = route.params.txHash;
  if (txHash) fetchReceipt(txHash);
  else isLoading.value = false;
});
</script>
<style scoped>
/* --- Style Gốc (Cho màn hình) --- */
.bg-light-gradient {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.avatar-lg {
  width: 80px; height: 80px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}

.font-monospace { font-family: 'Consolas', 'Monaco', monospace; font-size: 0.85rem; }
.ls-1 { letter-spacing: 1px; }
.tracking-wide { letter-spacing: 2px; }
.border-dashed { border-top: 2px dashed #dee2e6; }
.cursor-pointer { cursor: pointer; }

/* --- 🖨️ Style Fix Lỗi Khi In (QUAN TRỌNG) --- */
@media print {
  /* 1. Ẩn tất cả mọi thứ trên trang */
  body * {
    visibility: hidden;
    opacity: 0;
  }

  /* 2. Chỉ hiện thị vùng biên nhận (Print Area) */
  .print-area, .print-area * {
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* 3. Định vị biên nhận vào góc trên cùng của tờ giấy */
  .print-area {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    
    /* Bỏ các hiệu ứng không cần thiết khi in */
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    border-radius: 0 !important;
  }

  /* 4. ÉP TRÌNH DUYỆT IN MÀU NỀN (Khắc phục lỗi mất màu xanh/đen) */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* 5. Ẩn các nút bấm (Nút in, nút link, nút copy) */
  .btn, .no-print {
    display: none !important;
  }

  /* 6. Fix lỗi layout Bootstrap Grid khi in */
  .col-md-5, .col-md-2, .col-md-6 {
    /* Ép layout về dạng Flex để giữ bố cục ngang, tránh bị xếp chồng dọc */
    flex: 0 0 auto !important;
  }
  
  /* Chỉnh lại độ rộng cột cho cân đối trên giấy A4 */
  .col-md-5 { width: 41% !important; }
  .col-md-2 { width: 16% !important; }
  .col-md-6 { width: 50% !important; }

  /* 7. Tùy chỉnh màu text để đảm bảo độ tương phản trên giấy */
  .text-white {
    color: #fff !important; /* Giữ màu trắng nếu nền in ra màu tối */
  }
  
  /* Nếu trình duyệt không chịu in nền tối, đổi chữ thành màu đen để đọc được */
  /* (Fallback an toàn) */
  .bg-dark {
    background-color: #333 !important;
    color: #fff !important;
  }
}
</style>