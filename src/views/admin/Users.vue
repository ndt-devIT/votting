<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h4 class="fw-bold text-primary">Quản lý người dùng</h4>
        <p class="text-muted small">Quản lý tài khoản, phân quyền và trạng thái hoạt động.</p>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
          <div class="d-flex gap-2 w-100 w-md-auto">
            <div class="input-group" style="max-width: 300px;">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
              <input
                v-model="filters.search"
                type="text"
                class="form-control bg-light border-start-0"
                placeholder="Tìm tên, email..."
                @input="onSearchInput"
              />
            </div>

            <select v-model="filters.role" class="form-select w-auto" @change="fetchUsers">
              <option value="">Tất cả vai trò</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <select v-model="filters.status" class="form-select w-auto" @change="fetchUsers">
              <option value="">Tất cả trạng thái</option>
              <option value="1">Hoạt động</option>
              <option value="0">Bị khóa</option>
            </select>
          </div>

          <button class="btn btn-primary" @click="openUserModal()">
            <i class="bi bi-plus-lg me-1"></i>
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="bg-light">
              <tr>
                <th scope="col" class="ps-3">Người dùng</th>
                <th scope="col">Vai trò</th>
                <th scope="col">Ngày tham gia</th>
                <th scope="col" class="text-center">Trạng thái</th>
                <th scope="col" class="text-end pe-3">Hành động</th>
              </tr>
            </thead>
            
            <tbody v-if="loading">
              <tr v-for="n in 5" :key="n">
                <td colspan="5">
                  <div class="d-flex align-items-center p-2">
                    <div class="skeleton-circle me-3"></div>
                    <div class="w-100">
                      <div class="skeleton-line w-25 mb-1"></div>
                      <div class="skeleton-line w-50"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr v-for="user in users" :key="user._id">
                <td class="ps-3">
                  <div class="d-flex align-items-center">
                    <div class="avatar me-3" :class="getAvatarColor(user.role)">
                      {{ getInitials(user.hoTen) }}
                    </div>
                    <div>
                      <div class="fw-bold text-dark">{{ user.hoTen }}</div>
                      <div class="small text-muted">{{ user.email }}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <span class="badge rounded-pill" :class="getRoleBadge(user.role)">
                    {{ user.role.toUpperCase() }}
                  </span>
                </td>

                <td class="text-muted small">
                  {{ formatDate(user.createdAt) }}
                </td>

                <td class="text-center">
                  <div class="form-check form-switch d-flex justify-content-center">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :checked="user.status === 1"
                      @change="toggleStatus(user)"
                    >
                  </div>
                </td>

                <td class="text-end pe-3">
                  <button class="btn btn-sm btn-light text-primary me-2" title="Chỉnh sửa" @click="openUserModal(user)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" title="Xóa" @click="deleteUser(user)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="users.length === 0">
                <td colspan="5" class="text-center py-5">
                  <div class="text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    Không tìm thấy dữ liệu phù hợp.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3 border-top pt-3" v-if="!loading && totalUsers > 0">
          <div class="text-muted small">
            Hiển thị <strong>{{ (pagination.page - 1) * pagination.limit + 1 }}</strong> - 
            <strong>{{ Math.min(pagination.page * pagination.limit, totalUsers) }}</strong> 
            trong tổng số <strong>{{ totalUsers }}</strong>
          </div>
          
          <nav aria-label="User pagination">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                <button class="page-link" @click="changePage(pagination.page - 1)">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              
              <li 
                v-for="(p, index) in visiblePages" 
                :key="index" 
                class="page-item" 
                :class="{ 
                  active: p === pagination.page, 
                  disabled: p === '...' 
                }"
              >
                <button 
                  class="page-link" 
                  @click="p !== '...' ? changePage(p) : null"
                  style="min-width: 35px; text-align: center;" 
                >
                  {{ p }}
                </button>
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

    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Cập nhật người dùng' : 'Thêm người dùng mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Họ và tên</label>
                <input v-model="formData.hoTen" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="formData.email" type="email" class="form-control" :disabled="isEditing" required>
              </div>
              <div class="mb-3" v-if="!isEditing">
                <label class="form-label">Mật khẩu</label>
                <input v-model="formData.password" type="password" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Vai trò</label>
                <select v-model="formData.role" class="form-select">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Đóng</button>
                <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "@/api/axiosClient";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

// State
const users = ref([]);
const loading = ref(false);
const totalUsers = ref(0);
const modalInstance = ref(null);
const modalRef = ref(null);
const isEditing = ref(false);
let searchTimeout = null;

// Filters & Pagination
const filters = reactive({
  search: "",
  role: "",
  status: ""
});

const pagination = reactive({
  page: 1,
  limit: 10
});

const formData = reactive({
  id: null,
  hoTen: "",
  email: "",
  password: "",
  role: "user"
});

// Computed Total Pages
const totalPages = computed(() => Math.ceil(totalUsers.value / pagination.limit));

// --- COMPUTED: SMART PAGINATION (SỬA LỖI HIỂN THỊ) ---
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = pagination.page;
  const delta = 2; // Số trang hiển thị cạnh trang hiện tại
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= total; i++) {
    // Logic: Luôn lấy trang 1, trang cuối, và các trang xung quanh trang hiện tại
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1); // Nếu cách 1 số thì điền nốt
      } else if (i - l !== 1) {
        rangeWithDots.push('...'); // Nếu cách xa thì thêm dấu ...
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
});

// --- METHODS ---

async function fetchUsers() {
  loading.value = true;
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      q: filters.search || undefined,
      role: filters.role || undefined,
      status: filters.status || undefined
    };
    
    const res = await axios.get("/api/nguoidung", { params });
    
    // Xử lý response từ backend
    users.value = res.data.data || res.data; 
    totalUsers.value = res.data.total || users.value.length; 

  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.page = 1; 
    fetchUsers();
  }, 500);
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  pagination.page = newPage;
  fetchUsers();
}

async function toggleStatus(user) {
  const newStatus = user.status === 1 ? 0 : 1;
  try {
    user.status = newStatus;
    await axios.patch(`/api/nguoidung/${user._id}/status`, { status: newStatus });
    
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    toast.fire({
      icon: 'success',
      title: `Đã ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản`
    });

  } catch (err) {
    user.status = newStatus === 1 ? 0 : 1; // Revert
    Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
  }
}

async function deleteUser(user) {
  const result = await Swal.fire({
    title: "Xóa người dùng?",
    text: `Hành động này không thể hoàn tác với user: ${user.email}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Xóa vĩnh viễn",
    cancelButtonText: "Hủy"
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`/api/nguoidung/${user._id}`);
      Swal.fire("Đã xóa!", "Người dùng đã bị xóa.", "success");
      fetchUsers();
    } catch (err) {
      Swal.fire("Lỗi", "Không thể xóa người dùng", "error");
    }
  }
}

function openUserModal(user = null) {
  if (user) {
    isEditing.value = true;
    formData.id = user._id;
    formData.hoTen = user.hoTen;
    formData.email = user.email;
    formData.role = user.role;
    formData.password = ""; 
  } else {
    isEditing.value = false;
    formData.id = null;
    formData.hoTen = "";
    formData.email = "";
    formData.password = "";
    formData.role = "user";
  }
  modalInstance.value.show();
}

async function saveUser() {
  try {
    if (isEditing.value) {
      await axios.put(`/api/nguoidung/${formData.id}`, {
        hoTen: formData.hoTen,
        role: formData.role
      });
    } else {
      await axios.post("/api/nguoidung", formData);
    }
    
    modalInstance.value.hide();
    Swal.fire("Thành công", isEditing.value ? "Cập nhật thành công" : "Thêm mới thành công", "success");
    fetchUsers();
  } catch (err) {
    Swal.fire("Lỗi", err.response?.data?.message || "Có lỗi xảy ra", "error");
  }
}

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
}

function getAvatarColor(role) {
  if (role === 'admin') return 'bg-primary-subtle text-primary';
  if (role === 'superadmin') return 'bg-danger-subtle text-danger';
  return 'bg-secondary-subtle text-secondary';
}

function getRoleBadge(role) {
  if (role === 'admin') return 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10';
  if (role === 'superadmin') return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10';
  return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10';
}

function formatDate(dateString) {
  if(!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('vi-VN');
}

onMounted(() => {
  modalInstance.value = new Modal(modalRef.value);
  fetchUsers();
});
</script>

<style scoped>
/* Avatar */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Skeleton Loading */
.skeleton-line {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}
.skeleton-circle {
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 10px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Table */
.table > :not(caption) > * > * {
  padding: 1rem 0.5rem;
  border-bottom-color: #f2f2f2;
}
.table-hover tbody tr:hover {
  background-color: #f9fafb;
}

/* Pagination Buttons */
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