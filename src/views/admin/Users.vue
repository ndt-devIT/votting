<template>
  <div class="container-fluid">
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">Danh sách người dùng</h5>

          <div class="d-flex align-items-center gap-2">
            <!-- Ô tìm kiếm -->
            <div class="input-group">
              <input
                v-model="search"
                type="text"
                class="form-control"
                placeholder="Tìm theo tên hoặc email..."
                @keyup.enter="loadUsers"
              />
              <button class="btn btn-outline-secondary" @click="loadUsers">
                <i class="bi bi-search"></i>
              </button>
            </div>

            <!-- Bộ lọc trạng thái -->
            <select
              v-model="statusFilter"
              class="form-select w-auto"
              @change="loadUsers"
            >
              <option value="all">Tất cả</option>
              <option value="1">Hoạt động</option>
              <option value="0">Vô hiệu</option>
            </select>
          </div>
        </div>

        <table class="table table-hover align-middle">
          <thead class="table-light text-center">
            <tr>
              <th>#</th>
              <th class="text-start">Họ tên</th>
              <th class="text-start">Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(user, i) in users" :key="user._id">
              <td class="text-center">{{ i + 1 }}</td>

              <!-- Họ tên và Email: canh trái -->
              <td class="text-start">{{ user.hoTen }}</td>
              <td class="text-start">{{ user.email }}</td>

              <!-- Các cột còn lại canh giữa -->
              <td class="text-center">
                <span class="badge bg-info" v-if="user.role === 'user'">User</span>
                <span class="badge bg-success" v-else-if="user.role === 'admin'">Admin</span>
                <span class="badge bg-danger" v-else>Superadmin</span>
              </td>

              <td class="text-center">
                <span
                  class="badge"
                  :class="user.status === 1 ? 'bg-success' : 'bg-secondary'"
                >
                  {{ user.status === 1 ? 'Hoạt động' : 'Vô hiệu' }}
                </span>
              </td>

              <td class="text-center">
                <button
                  class="btn btn-sm btn-outline-warning"
                  @click="toggleStatus(user)"
                >
                  <i
                    :class="user.status === 1 ? 'bi bi-person-dash' : 'bi bi-person-check'"
                  ></i>
                  {{ user.status === 1 ? 'Vô hiệu' : 'Kích hoạt' }}
                </button>
              </td>
            </tr>

            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center text-muted py-3">
                Không có người dùng nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import axios from "@/api/axiosClient";
import Swal from "sweetalert2";

const users = ref([]);
const statusFilter = ref("all"); // all | 1 | 0
const search = ref("");

async function loadUsers() {
  try {
    const params = {
      status: statusFilter.value,
      q: search.value.trim() || undefined,
    };
    const res = await axios.get("/api/nguoidung", { params });
    users.value = res.data.data || res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách người dùng:", err);
  }
}

// Bật/tắt tài khoản
async function toggleStatus(user) {
  const newStatus = user.status === 1 ? 0 : 1;
  const actionText = newStatus === 1 ? "kích hoạt" : "vô hiệu hóa";

  const confirm = await Swal.fire({
    title: `Xác nhận ${actionText}?`,
    text: `Bạn có chắc muốn ${actionText} tài khoản ${user.email}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Hủy",
  });

  if (!confirm.isConfirmed) return;

  try {
    await axios.patch(`/api/nguoidung/${user._id}/status`, { status: newStatus });
    user.status = newStatus; // cập nhật UI
    Swal.fire("Thành công!", `Đã ${actionText} tài khoản.`, "success");
  } catch (err) {
    console.error("Lỗi cập nhật status:", err);
    Swal.fire("Lỗi", "Không thể cập nhật trạng thái tài khoản!", "error");
  }
}

onMounted(loadUsers);
</script>

<style scoped>
.badge {
  font-size: 0.85rem;
}
</style>
