<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h4 class="fw-bold text-primary">Quản lý Bình chọn</h4>
        <p class="text-muted small">Theo dõi, kiểm soát và xác thực các phiếu bầu trong hệ thống.</p>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body">
        <div class="row g-2 mb-4">
          <div class="col-lg-3 col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
              <input
                v-model="filters.search"
                type="text"
                class="form-control bg-light border-start-0"
                placeholder="Tên người vote hoặc email..."
                @input="onSearchInput"
              />
            </div>
          </div>

          <div class="col-lg-2 col-md-6">
            <select v-model="filters.contestId" class="form-select" @change="onContestChange">
              <option value="">Tất cả cuộc thi</option>
              <option v-for="c in contests" :key="c._id" :value="c._id">{{ c.tenCuocThi }}</option>
            </select>
          </div>

          <div class="col-lg-2 col-md-6">
            <select v-model="filters.categoryId" class="form-select" :disabled="!filters.contestId" @change="onCategoryChange">
              <option value="">Tất cả hạng mục</option>
              <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.tenHangMuc }}</option>
            </select>
          </div>

          <div class="col-lg-2 col-md-6">
            <select v-model="filters.candidateId" class="form-select" :disabled="!filters.categoryId" @change="fetchVotes">
              <option value="">Tất cả ứng viên</option>
              <option v-for="c in candidates" :key="c._id" :value="c._id">{{ c.hoTen }}</option>
            </select>
          </div>

          <div class="col-lg-2 col-md-6">
            <select v-model="filters.status" class="form-select" @change="fetchVotes">
              <option value="">Trạng thái</option>
              <option value="1">Hợp lệ</option>
              <option value="0">Không hợp lệ</option>
            </select>
          </div>

          <div class="col-lg-1 col-md-6 text-end">
            <button class="btn btn-primary w-100" @click="openModal()">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="bg-light">
              <tr>
                <th scope="col" class="ps-3">Người bình chọn</th>
                <th scope="col">Bình chọn cho</th>
                <th scope="col">Thông tin chi tiết</th>
                <th scope="col">Thời gian</th>
                <th scope="col" class="text-center">Trạng thái</th>
                <th scope="col" class="text-end pe-3">Hành động</th>
              </tr>
            </thead>

            <tbody v-if="loading">
              <tr v-for="n in 5" :key="n">
                <td colspan="6">
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
              <tr v-for="vote in votes" :key="vote._id">
                <td class="ps-3">
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-2 bg-light text-primary fw-bold border">
                      {{ getInitials(vote.nguoiDung?.hoTen) }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ vote.nguoiDung?.hoTen || 'Unknown' }}</div>
                      <div class="small text-muted">{{ vote.nguoiDung?.email }}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-2 bg-light text-success fw-bold border">
                      {{ getInitials(vote.ungVien?.hoTen) }}
                    </div>
                    <span class="fw-medium">{{ vote.ungVien?.hoTen || 'Deleted Candidate' }}</span>
                  </div>
                </td>

                <td>
                  <div class="d-flex flex-column small">
                    <span class="text-dark fw-medium">{{ vote.hangMuc?.tenHangMuc }}</span>
                    <span class="text-muted">
                      <i class="bi bi-trophy-fill text-warning me-1"></i>
                      {{ vote.cuocThi?.tenCuocThi }}
                    </span>
                  </div>
                </td>

                <td class="text-muted small">
                  {{ formatDate(vote.createdAt || vote.ngayBinhChon) }}
                </td>

                <td class="text-center">
                  <div class="form-check form-switch d-flex justify-content-center">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :checked="vote.status === 1"
                      @change="toggleStatus(vote)"
                    >
                  </div>
                </td>

                <td class="text-end pe-3">
                  <button class="btn btn-sm btn-light text-danger" @click="deleteVote(vote)" title="Xóa phiếu">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="votes.length === 0">
                <td colspan="6" class="text-center py-5">
                  <div class="text-muted">
                    <i class="bi bi-journal-x fs-1 d-block mb-2"></i>
                    Không tìm thấy phiếu bình chọn nào.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3 border-top pt-3" v-if="!loading && totalVotes > 0">
          <div class="text-muted small">
            Hiển thị <strong>{{ (pagination.page - 1) * pagination.limit + 1 }}</strong> - 
            <strong>{{ Math.min(pagination.page * pagination.limit, totalVotes) }}</strong> 
            trong tổng số <strong>{{ totalVotes }}</strong>
          </div>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                <button class="page-link" @click="changePage(pagination.page - 1)"><i class="bi bi-chevron-left"></i></button>
              </li>
              <li v-for="p in visiblePages" :key="p" class="page-item" :class="{ active: p === pagination.page, disabled: p === '...' }">
                <button class="page-link" @click="p !== '...' ? changePage(p) : null">{{ p }}</button>
              </li>
              <li class="page-item" :class="{ disabled: pagination.page === totalPages }">
                <button class="page-link" @click="changePage(pagination.page + 1)"><i class="bi bi-chevron-right"></i></button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <div class="modal fade" id="voteModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Thêm Phiếu Thủ Công</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveVote">
              <div class="mb-3">
                <label class="form-label">Cuộc thi</label>
                <select v-model="form.contestId" class="form-select" @change="onFormContestChange" required>
                  <option value="" disabled>-- Chọn cuộc thi --</option>
                  <option v-for="c in contests" :key="c._id" :value="c._id">{{ c.tenCuocThi }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Hạng mục</label>
                <select v-model="form.categoryId" class="form-select" :disabled="!form.contestId" @change="onFormCategoryChange" required>
                  <option value="" disabled>-- Chọn hạng mục --</option>
                  <option v-for="c in formCategories" :key="c._id" :value="c._id">{{ c.tenHangMuc }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Ứng viên</label>
                <select v-model="form.candidateId" class="form-select" :disabled="!form.categoryId" required>
                  <option value="" disabled>-- Chọn ứng viên --</option>
                  <option v-for="c in formCandidates" :key="c._id" :value="c._id">{{ c.hoTen }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model.number="form.status" class="form-select">
                  <option :value="1">Hợp lệ</option>
                  <option :value="0">Không hợp lệ</option>
                </select>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" class="btn btn-primary">Thêm Phiếu</button>
              </div>
            </form>
          </div>
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
const votes = ref([]);
const loading = ref(false);
const totalVotes = ref(0);
const modalRef = ref(null);
let modalInstance = null;
let searchTimeout = null;

// Dữ liệu cho Dropdowns (Bộ lọc)
const contests = ref([]);
const categories = ref([]);
const candidates = ref([]);

// Dữ liệu riêng cho Dropdowns (Trong Modal) để tránh xung đột
const formCategories = ref([]);
const formCandidates = ref([]);

// Filters & Pagination
const filters = reactive({
  search: "",
  contestId: "",
  categoryId: "",
  candidateId: "",
  status: ""
});

const pagination = reactive({
  page: 1,
  limit: 10
});

const form = reactive({
  contestId: "",
  categoryId: "",
  candidateId: "",
  status: 1
});

// Computed: Smart Pagination
const totalPages = computed(() => Math.ceil(totalVotes.value / pagination.limit));
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = pagination.page;
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) range.push(i);
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

// 1. Init & Load Dropdowns
async function initData() {
  try {
    // Chỉ load Contest lúc đầu. Category & Candidate load theo sự kiện change
    const res = await axios.get("/api/contest");
    contests.value = res.data.data || res.data;
    fetchVotes();
  } catch (err) { console.error(err); }
}

// 2. Chained Dropdown Logic (FILTER)
async function onContestChange() {
  filters.categoryId = "";
  filters.candidateId = "";
  categories.value = [];
  candidates.value = [];
  if (filters.contestId) {
    const res = await axios.get(`/api/category?contestId=${filters.contestId}`);
    categories.value = res.data.data || res.data;
  }
  fetchVotes();
}

async function onCategoryChange() {
  filters.candidateId = "";
  candidates.value = [];
  if (filters.categoryId) {
    // API cần hỗ trợ lọc candidate theo category
    const res = await axios.get(`/api/candidate?categoryId=${filters.categoryId}`);
    candidates.value = res.data.data || res.data;
  }
  fetchVotes();
}

// 3. Fetch Votes (Server-side)
async function fetchVotes() {
  loading.value = true;
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      q: filters.search || undefined, // Tìm theo tên User/Email
      contestId: filters.contestId || undefined,
      categoryId: filters.categoryId || undefined,
      candidateId: filters.candidateId || undefined,
      status: filters.status !== "" ? filters.status : undefined
    };

    const res = await axios.get("/api/vote/ad/me", { params });
    votes.value = res.data.data || res.data;
    totalVotes.value = res.data.total || votes.value.length;

  } catch (err) {
    console.error(err);
    showToast("error", "Lỗi tải dữ liệu phiếu bầu");
  } finally {
    loading.value = false;
  }
}

// 4. Debounce Search
function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.page = 1;
    fetchVotes();
  }, 500);
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  pagination.page = newPage;
  fetchVotes();
}

// 5. Toggle Status
async function toggleStatus(vote) {
  const newStatus = vote.status === 1 ? 0 : 1;
  try {
    vote.status = newStatus;
    await axios.put(`/api/vote/${vote._id}`, { status: newStatus });
    showToast("success", "Cập nhật trạng thái thành công");
  } catch (err) {
    vote.status = newStatus === 1 ? 0 : 1;
    showToast("error", "Lỗi cập nhật");
  }
}

// 6. Delete Vote
async function deleteVote(vote) {
  const result = await Swal.fire({
    title: "Xóa phiếu này?",
    text: "Hành động này sẽ giảm số lượt vote của ứng viên tương ứng!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy"
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`/api/vote/${vote._id}`);
      showToast("success", "Đã xóa phiếu.");
      fetchVotes();
    } catch (err) {
      showToast("error", "Lỗi khi xóa.");
    }
  }
}

// 7. Modal Logic & Chained Dropdowns (FORM)
function openModal() {
  // Reset form
  form.contestId = ""; form.categoryId = ""; form.candidateId = ""; form.status = 1;
  formCategories.value = [];
  formCandidates.value = [];
  modalInstance.show();
}

async function onFormContestChange() {
  form.categoryId = ""; form.candidateId = "";
  if (form.contestId) {
    const res = await axios.get(`/api/category?contestId=${form.contestId}`);
    formCategories.value = res.data.data || res.data;
  }
}

async function onFormCategoryChange() {
  form.candidateId = "";
  if (form.categoryId) {
    const res = await axios.get(`/api/candidate?categoryId=${form.categoryId}`);
    formCandidates.value = res.data.data || res.data;
  }
}

async function saveVote() {
  try {
    await axios.post("/api/vote", {
      ungVienId: form.candidateId,
      hangMucId: form.categoryId,
      cuocThiId: form.contestId,
      status: form.status
    });
    modalInstance.hide();
    showToast("success", "Thêm phiếu thành công");
    fetchVotes();
  } catch (err) {
    showToast("error", err.response?.data?.message || "Lỗi thêm phiếu");
  }
}

// Helpers
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("vi-VN");
}

function showToast(icon, title) {
  const Toast = Swal.mixin({
    toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true
  });
  Toast.fire({ icon, title });
}

onMounted(() => {
  modalInstance = new Modal(modalRef.value);
  initData();
});
</script>

<style scoped>
.avatar-sm {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem;
}
.skeleton-circle { width: 32px; height: 32px; background-color: #e0e0e0; border-radius: 50%; animation: pulse 1.5s infinite; }
.skeleton-line { height: 10px; background-color: #e0e0e0; border-radius: 4px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

.table td, .table th { padding: 0.75rem 0.5rem; border-bottom-color: #f2f2f2; }
.page-link { border: none; color: #6c757d; border-radius: 6px; margin: 0 2px; }
.page-item.active .page-link { background-color: #0d6efd; color: #fff; }
.page-item.disabled .page-link { background-color: transparent; color: #ccc; }
</style>