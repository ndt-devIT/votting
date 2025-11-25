<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h4 class="fw-bold text-primary">Quản lý Ứng viên</h4>
        <p class="text-muted small">Quản lý hồ sơ, hình ảnh và thông tin chi tiết của các ứng viên.</p>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body">
        <div class="d-flex flex-column flex-xl-row justify-content-between align-items-center mb-4 gap-3">
          <div class="d-flex flex-wrap gap-2 w-100 w-xl-auto">
            <div class="input-group" style="max-width: 250px;">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
              <input
                v-model="filters.search"
                type="text"
                class="form-control bg-light border-start-0"
                placeholder="Tên ứng viên..."
                @input="onSearchInput"
              />
            </div>

            <select v-model="filters.contestId" class="form-select w-auto" @change="onContestFilterChange">
              <option value="">Tất cả cuộc thi</option>
              <option v-for="c in contests" :key="c._id" :value="c._id">
                {{ c.tenCuocThi }}
              </option>
            </select>

            <select v-model="filters.categoryId" class="form-select w-auto" @change="fetchCandidates">
              <option value="">Tất cả hạng mục</option>
              <option v-for="c in filteredCategoriesDropdown" :key="c._id" :value="c._id">
                {{ c.tenHangMuc }}
              </option>
            </select>

            <select v-model="filters.status" class="form-select w-auto" @change="fetchCandidates">
              <option value="">Trạng thái</option>
              <option value="1">Hoạt động</option>
              <option value="0">Ẩn</option>
            </select>
          </div>

          <button class="btn btn-primary" @click="openModal()">
            <i class="bi bi-plus-lg me-1"></i> Thêm ứng viên
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="bg-light">
              <tr>
                <th scope="col" class="ps-3">Ứng viên</th>
                <th scope="col">Hạng mục / Cuộc thi</th>
                <th scope="col">Thông tin</th> <th scope="col" class="text-center">Trạng thái</th>
                <th scope="col" class="text-end pe-3">Hành động</th>
              </tr>
            </thead>

            <tbody v-if="loading">
              <tr v-for="n in 5" :key="n">
                <td colspan="5">
                  <div class="d-flex align-items-center p-2">
                    <div class="skeleton-circle me-3"></div>
                    <div class="w-100">
                      <div class="skeleton-line w-50 mb-2"></div>
                      <div class="skeleton-line w-25"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr v-for="cand in candidates" :key="cand._id">
                <td class="ps-3">
                  <div class="d-flex align-items-center">
                    <div 
                      class="avatar me-3 rounded-circle" 
                      :class="getCandidateAvatarColor(cand.hoTen)"
                    >
                      {{ getInitials(cand.hoTen) }}
                    </div>
                    <div>
                      <div class="fw-bold text-primary">{{ cand.hoTen }}</div>
                      <div class="small text-muted" v-if="cand.voteCount !== undefined">
                        <i class="bi bi-heart-fill text-danger"></i> {{ cand.voteCount }} vote
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="d-flex flex-column">
                    <span class="fw-medium text-dark">{{ cand.hangMuc?.tenHangMuc || '---' }}</span>
                    <small class="text-muted">
                      <i class="bi bi-trophy-fill text-warning me-1"></i>
                      {{ cand.hangMuc?.cuocThi?.tenCuocThi || '---' }}
                    </small>
                  </div>
                </td>

                <td style="max-width: 250px;">
                  <div class="text-truncate text-muted small mb-1" :title="cand.moTa">
                    {{ cand.moTa || 'Không có mô tả' }}
                  </div>
                  <a v-if="cand.url" :href="cand.url" target="_blank" class="btn-link small text-decoration-none">
                    <i class="bi bi-link-45deg"></i> Link đính kèm
                  </a>
                </td>

                <td class="text-center">
                  <div class="form-check form-switch d-flex justify-content-center">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :checked="cand.status === 1"
                      @change="toggleStatus(cand)"
                    >
                  </div>
                </td>

                <td class="text-end pe-3">
                  <button class="btn btn-sm btn-light text-primary me-1" @click="openModal(cand)" title="Sửa">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" @click="deleteCandidate(cand)" title="Xóa">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="candidates.length === 0">
                <td colspan="5" class="text-center py-5">
                  <div class="text-muted">
                    <i class="bi bi-person-x fs-1 d-block mb-2"></i>
                    Không tìm thấy ứng viên nào.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3 border-top pt-3" v-if="!loading && totalCandidates > 0">
          <div class="text-muted small">
            Hiển thị <strong>{{ (pagination.page - 1) * pagination.limit + 1 }}</strong> - 
            <strong>{{ Math.min(pagination.page * pagination.limit, totalCandidates) }}</strong> 
            trong tổng số <strong>{{ totalCandidates }}</strong>
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

    <div class="modal fade" id="candidateModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              {{ isEditing ? "Cập nhật Ứng viên" : "Thêm Ứng viên mới" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          
          <form @submit.prevent="saveCandidate">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label fw-semibold">Họ tên ứng viên <span class="text-danger">*</span></label>
                  <input v-model="form.hoTen" type="text" class="form-control" required placeholder="Nhập họ tên..." />
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Thuộc cuộc thi</label>
                  <select v-model="form.contestId" class="form-select" @change="form.hangMuc = ''">
                    <option value="" disabled>-- Chọn cuộc thi --</option>
                    <option v-for="c in contests" :key="c._id" :value="c._id">{{ c.tenCuocThi }}</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Hạng mục <span class="text-danger">*</span></label>
                  <select v-model="form.hangMuc" class="form-select" required :disabled="!form.contestId">
                    <option value="" disabled>-- Chọn hạng mục --</option>
                    <option v-for="c in getCategoriesByContest(form.contestId)" :key="c._id" :value="c._id">
                      {{ c.tenHangMuc }}
                    </option>
                  </select>
                </div>

                <div class="col-md-12">
                  <label class="form-label fw-semibold">Ảnh đại diện (URL)</label>
                  <input v-model="form.imageUrl" type="text" class="form-control" placeholder="https://example.com/avatar.jpg" />
                  <div class="form-text">Nhập đường dẫn ảnh hiển thị.</div>
                </div>

                <div class="col-md-12">
                  <label class="form-label fw-semibold">Liên kết mở rộng (URL)</label>
                  <input v-model="form.url" type="url" class="form-control" placeholder="Link Facebook, Website, Youtube..." />
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Mô tả / Giới thiệu</label>
                  <textarea v-model="form.moTa" class="form-control" rows="3" placeholder="Giới thiệu ngắn về ứng viên..."></textarea>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Trạng thái</label>
                  <select v-model.number="form.status" class="form-select">
                    <option :value="1">Hoạt động</option>
                    <option :value="0">Ẩn</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="modal-footer bg-light">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="submit" class="btn btn-primary px-4">
                <i class="bi bi-save me-1"></i> Lưu lại
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
const candidates = ref([]);
const contests = ref([]);
const categories = ref([]); // Tất cả hạng mục
const loading = ref(false);
const totalCandidates = ref(0);
const isEditing = ref(false);
const modalRef = ref(null);
let modalInstance = null;
let searchTimeout = null;

// Filters & Pagination
const filters = reactive({
  search: "",
  status: "",
  contestId: "",
  categoryId: ""
});

const pagination = reactive({
  page: 1,
  limit: 10
});

// Form Data
const form = reactive({
  _id: null,
  hoTen: "",
  moTa: "",
  url: "",
  imageUrl: "",
  hangMuc: "",
  contestId: "", // Chỉ dùng để lọc dropdown hạng mục trong form
  status: 1
});

// Computed: Smart Pagination
const totalPages = computed(() => Math.ceil(totalCandidates.value / pagination.limit));
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

// Computed: Lọc danh mục cho Dropdown (Ở thanh Filter)
const filteredCategoriesDropdown = computed(() => {
  if (!filters.contestId) return categories.value;
  return categories.value.filter(c => c.cuocThi?._id === filters.contestId || c.cuocThi === filters.contestId);
});

// --- METHODS ---

// 1. Init Data (Load Contests & Categories for dropdowns)
async function initData() {
  try {
    // Dùng API mycontests và mycategories để chỉ lấy dữ liệu của admin
    const [resContests, resCategories] = await Promise.all([
      axios.get("/api/contest/mycontests"),
      axios.get("/api/category/mycategories")
    ]);
    
    contests.value = resContests.data.data || resContests.data;
    categories.value = resCategories.data.data || resCategories.data;
    
    await fetchCandidates();
  } catch (err) {
    console.error("Lỗi khởi tạo:", err);
  }
}

// 2. Fetch Candidates (Server-side)
async function fetchCandidates() {
  loading.value = true;
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      q: filters.search || undefined,
      status: filters.status !== "" ? filters.status : undefined,
      contestId: filters.contestId || undefined,
      categoryId: filters.categoryId || undefined
    };

    // Dùng API mycandidates
    const res = await axios.get("/api/candidate/mycandidates", { params });
    
    candidates.value = res.data.data || res.data;
    totalCandidates.value = res.data.total || candidates.value.length;

  } catch (err) {
    console.error(err);
    showToast("error", "Không thể tải dữ liệu ứng viên");
  } finally {
    loading.value = false;
  }
}

// 3. Search & Filter Logic
function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.page = 1;
    fetchCandidates();
  }, 500);
}

function onContestFilterChange() {
  // Reset hạng mục khi đổi cuộc thi
  filters.categoryId = ""; 
  fetchCandidates();
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  pagination.page = newPage;
  fetchCandidates();
}

// 4. Toggle Status
async function toggleStatus(cand) {
  const newStatus = cand.status === 1 ? 0 : 1;
  try {
    cand.status = newStatus; // Optimistic
    await axios.put(`/api/candidate/${cand._id}`, { status: newStatus });
    showToast("success", "Cập nhật trạng thái thành công");
  } catch (err) {
    cand.status = newStatus === 1 ? 0 : 1; // Revert
    showToast("error", "Lỗi cập nhật trạng thái");
  }
}

// 5. Modal Logic
function openModal(cand = null) {
  if (cand) {
    isEditing.value = true;
    // Tìm contestId từ hạng mục của ứng viên để fill vào dropdown
    const contestOfCat = cand.hangMuc?.cuocThi?._id || cand.hangMuc?.cuocThi;
    
    Object.assign(form, { 
      ...cand, 
      hangMuc: cand.hangMuc?._id || cand.hangMuc,
      contestId: contestOfCat
    });
  } else {
    isEditing.value = false;
    Object.assign(form, {
      _id: null, hoTen: "", moTa: "", url: "", imageUrl: "", hangMuc: "", contestId: "", status: 1
    });
  }
  modalInstance.show();
}

// Helper: Lọc danh mục trong Form Modal
function getCategoriesByContest(contestId) {
  if (!contestId) return [];
  return categories.value.filter(c => c.cuocThi?._id === contestId || c.cuocThi === contestId);
}

// 6. Save
async function saveCandidate() {
  try {
    if (isEditing.value) {
      await axios.put(`/api/candidate/${form._id}`, form);
      showToast("success", "Cập nhật thành công!");
    } else {
      await axios.post("/api/candidate", form);
      showToast("success", "Thêm mới thành công!");
    }
    modalInstance.hide();
    fetchCandidates();
  } catch (err) {
    showToast("error", err.response?.data?.message || "Lỗi khi lưu dữ liệu");
  }
}

// 7. Delete
async function deleteCandidate(cand) {
  const result = await Swal.fire({
    title: "Xóa ứng viên?",
    text: `Bạn có chắc muốn xóa "${cand.hoTen}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy"
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`/api/candidate/${cand._id}`);
      showToast("success", "Đã xóa ứng viên.");
      fetchCandidates();
    } catch (err) {
      showToast("error", "Không thể xóa ứng viên này.");
    }
  }
}

// Helper: Toast
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

// Helper: Initials
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
}

// Helper: Avatar Color
function getCandidateAvatarColor(name) {
  if (!name) return 'bg-secondary-subtle text-secondary';
  const colors = [
    'bg-primary-subtle text-primary',
    'bg-success-subtle text-success',
    'bg-info-subtle text-info',
    'bg-warning-subtle text-dark',
    'bg-danger-subtle text-danger',
    'bg-dark-subtle text-dark',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

onMounted(() => {
  modalInstance = new Modal(modalRef.value);
  initData();
});
</script>

<style scoped>
/* Avatar Style */
.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
}

/* Skeleton Loading */
.skeleton-circle {
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
.skeleton-line {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}
@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

/* Table & Pagination */
.table > :not(caption) > * > * {
  padding: 1rem 0.75rem;
  border-bottom-color: #f2f2f2;
}
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
</style>