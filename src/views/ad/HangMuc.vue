<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h4 class="fw-bold text-primary">Quản lý Hạng mục</h4>
        <p class="text-muted small">Phân loại các hạng mục dự thi cho các cuộc thi do bạn tổ chức.</p>
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
                placeholder="Tên hạng mục..."
                @input="onSearchInput"
              />
            </div>

            <select v-model="filters.contestId" class="form-select w-auto" @change="fetchCategories">
              <option value="">Tất cả cuộc thi</option>
              <option v-for="c in contests" :key="c._id" :value="c._id">
                {{ c.tenCuocThi }}
              </option>
            </select>

            <select v-model="filters.status" class="form-select w-auto" @change="fetchCategories">
              <option value="">Tất cả trạng thái</option>
              <option value="1">Đang hoạt động</option>
              <option value="0">Đã ẩn</option>
            </select>
          </div>

          <button class="btn btn-primary" @click="openModal()">
            <i class="bi bi-plus-lg me-1"></i> Thêm hạng mục
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="bg-light">
              <tr>
                <th scope="col" class="ps-3">Tên hạng mục</th>
                <th scope="col">Thuộc cuộc thi</th>
                <th scope="col">Mô tả</th>
                <th scope="col" class="text-center">Trạng thái</th>
                <th scope="col" class="text-end pe-3">Hành động</th>
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
              <tr v-for="cat in categories" :key="cat._id">
                <td class="ps-3 fw-bold text-primary">
                  {{ cat.tenHangMuc }}
                </td>

                <td>
                  <div class="d-flex align-items-center text-dark">
                    <i class="bi bi-trophy text-warning me-2"></i>
                    <span class="text-truncate" style="max-width: 200px;" :title="cat.cuocThi?.tenCuocThi">
                      {{ cat.cuocThi?.tenCuocThi || 'Chưa gán' }}
                    </span>
                  </div>
                </td>

                <td class="text-muted small text-truncate" style="max-width: 250px;" :title="cat.moTa">
                  {{ cat.moTa || '-' }}
                </td>

                <td class="text-center">
                  <div class="form-check form-switch d-flex justify-content-center">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :checked="cat.status === 1"
                      @change="toggleStatus(cat)"
                    >
                  </div>
                </td>

                <td class="text-end pe-3">
                  <button class="btn btn-sm btn-light text-primary me-1" @click="openModal(cat)" title="Sửa">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" @click="deleteCategory(cat)" title="Xóa">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="categories.length === 0">
                <td colspan="5" class="text-center py-5">
                  <div class="text-muted">
                    <i class="bi bi-tags fs-1 d-block mb-2"></i>
                    Không tìm thấy hạng mục nào.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3 border-top pt-3" v-if="!loading && totalCategories > 0">
          <div class="text-muted small">
            Hiển thị <strong>{{ (pagination.page - 1) * pagination.limit + 1 }}</strong> - 
            <strong>{{ Math.min(pagination.page * pagination.limit, totalCategories) }}</strong> 
            trong tổng số <strong>{{ totalCategories }}</strong>
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

    <div class="modal fade" id="categoryModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              {{ isEditing ? "Cập nhật Hạng mục" : "Thêm Hạng mục mới" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          
          <form @submit.prevent="saveCategory">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold">Tên hạng mục <span class="text-danger">*</span></label>
                <input v-model="form.tenHangMuc" type="text" class="form-control" required placeholder="Ví dụ: Ca sĩ triển vọng" />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Thuộc cuộc thi <span class="text-danger">*</span></label>
                <select v-model="form.cuocThi" class="form-select" required>
                  <option value="" disabled>-- Chọn cuộc thi --</option>
                  <option v-for="c in contests" :key="c._id" :value="c._id">
                    {{ c.tenCuocThi }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Mô tả</label>
                <textarea v-model="form.moTa" class="form-control" rows="3" placeholder="Mô tả chi tiết hạng mục..."></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Trạng thái</label>
                <select v-model.number="form.status" class="form-select">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Ẩn</option>
                </select>
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
const categories = ref([]);
const contests = ref([]); 
const loading = ref(false);
const totalCategories = ref(0);
const isEditing = ref(false);
const modalRef = ref(null);
let modalInstance = null;
let searchTimeout = null;

// Filters & Pagination
const filters = reactive({
  search: "",
  status: "",
  contestId: ""
});

const pagination = reactive({
  page: 1,
  limit: 10
});

// Form Data
const form = reactive({
  _id: null,
  tenHangMuc: "",
  moTa: "",
  cuocThi: "",
  status: 1
});

// Computed: Smart Pagination
const totalPages = computed(() => Math.ceil(totalCategories.value / pagination.limit));
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

// 1. Init Data
async function initData() {
  try {
    // Lấy danh sách Cuộc thi CỦA TÔI (mycontests) để fill vào dropdown bộ lọc và modal
    const res = await axios.get("/api/contest/mycontests"); 
    contests.value = res.data.data || res.data; 
    
    // Sau khi có contest, tải categories
    await fetchCategories();
  } catch (err) {
    console.error("Lỗi khởi tạo:", err);
  }
}

// 2. Fetch Categories (Server-side)
async function fetchCategories() {
  loading.value = true;
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      q: filters.search || undefined,
      status: filters.status !== "" ? filters.status : undefined,
      contestId: filters.contestId || undefined
    };

    // Gọi API lấy hạng mục CỦA TÔI
    const res = await axios.get("/api/category/mycategories", { params });
    
    categories.value = res.data.data || res.data;
    totalCategories.value = res.data.total || categories.value.length;

  } catch (err) {
    console.error(err);
    showToast("error", "Không thể tải dữ liệu hạng mục");
  } finally {
    loading.value = false;
  }
}

// 3. Search & Pagination
function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.page = 1;
    fetchCategories();
  }, 500);
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  pagination.page = newPage;
  fetchCategories();
}

// 4. Toggle Status
async function toggleStatus(cat) {
  const newStatus = cat.status === 1 ? 0 : 1;
  try {
    cat.status = newStatus; // Optimistic update
    await axios.put(`/api/category/${cat._id}`, { status: newStatus });
    showToast("success", "Cập nhật trạng thái thành công!");
  } catch (err) {
    cat.status = newStatus === 1 ? 0 : 1; // Revert
    showToast("error", "Lỗi cập nhật trạng thái");
  }
}

// 5. Modal Logic
function openModal(cat = null) {
  if (cat) {
    isEditing.value = true;
    Object.assign(form, { 
      ...cat, 
      cuocThi: cat.cuocThi?._id || cat.cuocThi // Xử lý nếu cuocThi là object hoặc id string
    });
  } else {
    isEditing.value = false;
    Object.assign(form, {
      _id: null, tenHangMuc: "", moTa: "", cuocThi: "", status: 1
    });
  }
  modalInstance.show();
}

// 6. Save
async function saveCategory() {
  try {
    if (isEditing.value) {
      await axios.put(`/api/category/${form._id}`, form);
      showToast("success", "Cập nhật thành công!");
    } else {
      await axios.post("/api/category", form);
      showToast("success", "Thêm mới thành công!");
    }
    modalInstance.hide();
    fetchCategories();
  } catch (err) {
    showToast("error", err.response?.data?.message || "Lỗi khi lưu dữ liệu");
  }
}

// 7. Delete
async function deleteCategory(cat) {
  const result = await Swal.fire({
    title: "Xóa hạng mục?",
    text: `Xóa hạng mục "${cat.tenHangMuc}" sẽ xóa cả các ứng viên bên trong!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy"
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`/api/category/${cat._id}`);
      showToast("success", "Đã xóa hạng mục.");
      fetchCategories();
    } catch (err) {
      showToast("error", "Không thể xóa hạng mục này.");
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

// Lifecycle
onMounted(() => {
  modalInstance = new Modal(modalRef.value);
  initData();
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
@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

/* Styling */
.table > :not(caption) > * > * {
  padding: 1rem 0.75rem;
  border-bottom-color: #f2f2f2;
}
.table-hover tbody tr:hover {
  background-color: #f9fafb;
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
.page-item.disabled .page-link {
  background-color: transparent;
  color: #ccc;
}
</style>