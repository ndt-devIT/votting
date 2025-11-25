<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h4 class="fw-bold text-primary">Quản lý Cuộc thi</h4>
        <p class="text-muted small">Tổ chức, quản lý thời gian và trạng thái các cuộc thi bình chọn.</p>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body">
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-center mb-4 gap-3">
          <div class="d-flex flex-wrap gap-2 w-100 w-lg-auto">
            <div class="input-group" style="max-width: 300px;">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
              <input
                v-model="filters.search"
                type="text"
                class="form-control bg-light border-start-0"
                placeholder="Tên cuộc thi..."
                @input="onSearchInput"
              />
            </div>

            <select v-model="filters.status" class="form-select w-auto" @change="fetchContests">
              <option value="">Tất cả trạng thái</option>
              <option value="1">Đang hoạt động</option>
              <option value="0">Đã ngưng</option>
              <option value="2">Đã kết thúc</option>
            </select>

            <div class="d-flex align-items-center gap-1" v-if="showDateFilter">
               <input v-model="filters.startDate" type="date" class="form-control form-control-sm" @change="fetchContests">
               <span class="text-muted">-</span>
               <input v-model="filters.endDate" type="date" class="form-control form-control-sm" @change="fetchContests">
            </div>
            <button class="btn btn-sm btn-light border" @click="showDateFilter = !showDateFilter" title="Lọc theo ngày">
                <i class="bi bi-calendar3"></i>
            </button>
          </div>

          <button class="btn btn-primary" @click="openModal()">
            <i class="bi bi-plus-lg me-1"></i> Tạo cuộc thi mới
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="bg-light">
              <tr>
                <th scope="col" class="ps-3">Tên cuộc thi</th>
                <th scope="col">Thời gian diễn ra</th>
                <th scope="col" class="text-center">Trạng thái</th>
                <th scope="col" class="text-center">Thống kê</th> <th scope="col" class="text-end pe-3">Hành động</th>
              </tr>
            </thead>

            <tbody v-if="loading">
              <tr v-for="n in 5" :key="n">
                <td colspan="5">
                  <div class="d-flex flex-column p-2">
                    <div class="skeleton-line w-50 mb-2"></div>
                    <div class="skeleton-line w-25"></div>
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr v-for="contest in contests" :key="contest._id">
                <td class="ps-3" style="max-width: 300px;">
                  <div class="fw-bold text-dark text-truncate" :title="contest.tenCuocThi">
                    {{ contest.tenCuocThi }}
                  </div>
                  <div class="small text-muted text-truncate" :title="contest.moTa">
                    {{ contest.moTa || 'Chưa có mô tả' }}
                  </div>
                </td>

                <td class="small">
                  <div class="d-flex flex-column">
                    <span class="text-success"><i class="bi bi-play-fill me-1"></i>{{ formatDate(contest.ngayBatDau) }}</span>
                    <span class="text-danger"><i class="bi bi-stop-fill me-1"></i>{{ formatDate(contest.ngayKetThuc) }}</span>
                  </div>
                </td>

                <td class="text-center">
                  <span class="badge rounded-pill" :class="getStatusBadge(contest).class">
                    {{ getStatusBadge(contest).text }}
                  </span>
                </td>

                <td class="text-center text-muted small">
                   -- 
                </td>

                <td class="text-end pe-3">
                  <button class="btn btn-sm btn-light text-primary me-1" @click="openModal(contest)" title="Chỉnh sửa">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" @click="deleteContest(contest)" title="Xóa">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="contests.length === 0">
                <td colspan="5" class="text-center py-5">
                  <div class="text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    Không tìm thấy dữ liệu.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3 border-top pt-3" v-if="!loading && totalContests > 0">
          <div class="text-muted small">
            Hiển thị <strong>{{ (pagination.page - 1) * pagination.limit + 1 }}</strong> - 
            <strong>{{ Math.min(pagination.page * pagination.limit, totalContests) }}</strong> 
            trong tổng số <strong>{{ totalContests }}</strong>
          </div>
          
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                <button class="page-link" @click="changePage(pagination.page - 1)">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li v-for="p in visiblePages" :key="p" class="page-item" :class="{ active: p === pagination.page, disabled: p === '...' }">
                <button class="page-link" @click="p !== '...' ? changePage(p) : null">{{ p }}</button>
              </li>
              <li class="page-item" :class="{ disabled: pagination.page === totalPages }">
                <button class="page-link" @click="changePage(pagination.page + 1)">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <div class="modal fade" id="contestModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              {{ isEditing ? "Cập nhật cuộc thi" : "Thêm cuộc thi mới" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          
          <form @submit.prevent="saveContest">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-semibold">Tên cuộc thi <span class="text-danger">*</span></label>
                  <input v-model="form.tenCuocThi" type="text" class="form-control" placeholder="Ví dụ: Nét đẹp sinh viên 2025" required />
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Mô tả</label>
                  <textarea v-model="form.moTa" class="form-control" rows="3" placeholder="Thông tin chi tiết về cuộc thi..."></textarea>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Ngày bắt đầu <span class="text-danger">*</span></label>
                  <input v-model="form.ngayBatDau" type="date" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Ngày kết thúc <span class="text-danger">*</span></label>
                  <input v-model="form.ngayKetThuc" type="date" class="form-control" required />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Trạng thái</label>
                  <select v-model.number="form.status" class="form-select">
                    <option :value="1">Đang hoạt động</option>
                    <option :value="0">Tạm ngưng</option>
                    <option :value="2">Đã kết thúc</option>
                  </select>
                </div>
                
                <div class="col-12">
                    <label class="form-label fw-semibold">Ảnh bìa / Banner URL</label>
                    <input v-model="form.imageUrl" type="text" class="form-control" placeholder="https://..." />
                </div>
              </div>
            </div>

            <div class="modal-footer bg-light">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy bỏ</button>
              <button type="submit" class="btn btn-primary px-4">
                <i class="bi bi-save me-1"></i> Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "@/api/axiosClient";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";

// State
const contests = ref([]);
const loading = ref(false);
const totalContests = ref(0);
const isEditing = ref(false);
const modalRef = ref(null);
let modalInstance = null;
let searchTimeout = null;
const showDateFilter = ref(false);

// Filters & Pagination
const filters = reactive({
  search: "",
  status: "",
  startDate: "",
  endDate: ""
});

const pagination = reactive({
  page: 1,
  limit: 10
});

// Form Data
const form = reactive({
  _id: null,
  tenCuocThi: "",
  moTa: "",
  ngayBatDau: "",
  ngayKetThuc: "",
  status: 1,
  imageUrl: ""
});

// Computed: Smart Pagination
const totalPages = computed(() => Math.ceil(totalContests.value / pagination.limit));
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = pagination.page;
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  for (let i of range) {
    if (l) {
      if (i - l === 2) rangeWithDots.push(l + 1);
      else if (i - l !== 1) rangeWithDots.push('...');
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
});

// --- METHODS ---

// 1. Fetch Data (Server-side Pagination)
async function fetchContests() {
  loading.value = true;
  try {
    // Chuẩn bị params gửi lên server
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      q: filters.search || undefined,
      status: filters.status !== "" ? filters.status : undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined
    };

    const res = await axios.get("/api/contest/mycontests", { params });
    
    // Giả sử API trả về: { data: [...], total: 100 }
    // Nếu API chưa hỗ trợ phân trang, bạn cần sửa backend hoặc dùng slice ở đây
    contests.value = res.data.data || res.data; 
    totalContests.value = res.data.total || contests.value.length;

  } catch (err) {
    console.error(err);
    showToast("error", "Không thể tải dữ liệu cuộc thi");
  } finally {
    loading.value = false;
  }
}

// 2. Search Debounce
function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.page = 1;
    fetchContests();
  }, 500);
}

// 3. Pagination
function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  pagination.page = newPage;
  fetchContests();
}

// 4. Modal Logic
function openModal(contest = null) {
  if (contest) {
    isEditing.value = true;
    Object.assign(form, { ...contest });
    // Format date input (YYYY-MM-DD)
    form.ngayBatDau = contest.ngayBatDau ? contest.ngayBatDau.split("T")[0] : "";
    form.ngayKetThuc = contest.ngayKetThuc ? contest.ngayKetThuc.split("T")[0] : "";
  } else {
    isEditing.value = false;
    Object.assign(form, {
      _id: null, tenCuocThi: "", moTa: "", ngayBatDau: "", ngayKetThuc: "", status: 1, imageUrl: ""
    });
  }
  modalInstance.show();
}

// 5. Save (Create/Update)
async function saveContest() {
  try {
    if (isEditing.value) {
      await axios.put(`/api/contest/${form._id}`, form);
      showToast("success", "Cập nhật cuộc thi thành công!");
    } else {
      await axios.post("/api/contest", form);
      showToast("success", "Tạo cuộc thi mới thành công!");
    }
    modalInstance.hide();
    fetchContests();
  } catch (err) {
    showToast("error", err.response?.data?.message || "Lỗi khi lưu dữ liệu");
  }
}

// 6. Delete
async function deleteContest(contest) {
  const result = await Swal.fire({
    title: "Xóa cuộc thi?",
    text: `Bạn có chắc muốn xóa "${contest.tenCuocThi}"? Hành động này không thể hoàn tác!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Xóa bỏ",
    cancelButtonText: "Hủy"
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`/api/contest/${contest._id}`);
      showToast("success", "Đã xóa cuộc thi.");
      fetchContests();
    } catch (err) {
      showToast("error", "Không thể xóa cuộc thi này.");
    }
  }
}

// 7. Helpers
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function getStatusBadge(contest) {
  const now = new Date();
  const start = new Date(contest.ngayBatDau);
  const end = new Date(contest.ngayKetThuc);

  if (contest.status === 0) return { text: "Tạm ngưng", class: "bg-warning text-dark" };
  if (contest.status === 2 || end < now) return { text: "Kết thúc", class: "bg-secondary" };
  if (start > now) return { text: "Sắp diễn ra", class: "bg-info text-dark" };
  
  return { text: "Đang diễn ra", class: "bg-success" };
}

function showToast(icon, title) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
  Toast.fire({ icon, title });
}

// Lifecycle
onMounted(() => {
  modalInstance = new Modal(modalRef.value);
  fetchContests();
});
</script>

<style scoped>
/* Skeleton Loading */
.skeleton-line {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}
@keyframes pulse {
  0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; }
}

/* Table Styling */
.table > :not(caption) > * > * {
  padding: 1rem 0.75rem;
  border-bottom-color: #f2f2f2;
}
.table-hover tbody tr:hover {
  background-color: #f9fafb;
}

/* Pagination */
.page-link {
  border: none;
  color: #6c757d;
  border-radius: 6px;
  margin: 0 2px;
}
.page-item.active .page-link {
  background-color: #0d6efd;
  color: #fff;
}
.page-item.disabled .page-link {
  background-color: transparent;
  color: #ccc;
}
</style>