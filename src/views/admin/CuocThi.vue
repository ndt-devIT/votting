<template>
  <div class="container-fluid">
<!-- Nút thêm -->
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle me-1"></i> Thêm cuộc thi
      </button>
    </div>
    <!-- Bộ lọc -->
    <div class="card shadow-sm border-0 mb-3">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label mb-1">Tìm kiếm theo tên</label>
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              placeholder="Nhập tên cuộc thi..."
            />
          </div>
          <div class="col-md-3">
            <label class="form-label mb-1">Trạng thái</label>
            <select v-model.number="filters.status" class="form-select">
              <option :value="-1">Tất cả</option>
              <option :value="1">Hoạt động</option>
              <option :value="0">Ngưng</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label mb-1">Từ ngày</label>
            <input v-model="filters.startDate" type="date" class="form-control" />
          </div>
          <div class="col-md-2">
            <label class="form-label mb-1">Đến ngày</label>
            <input v-model="filters.endDate" type="date" class="form-control" />
          </div>
          <div class="col-md-1 text-end">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    

    <!-- Bảng danh sách -->
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Tên cuộc thi</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(contest, index) in filteredContests"
              :key="contest._id"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ contest.tenCuocThi }}</td>
              <td>{{ formatDate(contest.ngayBatDau) }}</td>
              <td>{{ formatDate(contest.ngayKetThuc) }}</td>
              <td>
                <span
                  class="badge"
                  :class="contest.status === 1 ? 'bg-success' : 'bg-secondary'"
                >
                  {{ contest.status === 1 ? 'Hoạt động' : 'Ngưng' }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-sm btn-outline-primary me-2"
                  @click="openEditModal(contest)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteContest(contest._id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredContests.length === 0">
              <td colspan="6" class="text-center text-muted py-3">
                Không có dữ liệu phù hợp
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div
      class="modal fade"
      id="contestModal"
      tabindex="-1"
      aria-hidden="true"
      ref="contestModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <form @submit.prevent="saveContest">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditing ? "Cập nhật cuộc thi" : "Thêm cuộc thi mới" }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Tên cuộc thi</label>
                <input
                  v-model="form.tenCuocThi"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea
                  v-model="form.moTa"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Ngày bắt đầu</label>
                <input
                  v-model="form.ngayBatDau"
                  type="date"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Ngày kết thúc</label>
                <input
                  v-model="form.ngayKetThuc"
                  type="date"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model.number="form.status" class="form-select">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Ngưng</option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Đóng
              </button>
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? "Cập nhật" : "Thêm mới" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/api/axiosClient";
import { Modal } from "bootstrap";

const contests = ref([]);
const isEditing = ref(false);
const form = ref({
  _id: null,
  tenCuocThi: "",
  moTa: "",
  ngayBatDau: "",
  ngayKetThuc: "",
  status: 1,
});

const filters = ref({
  search: "",
  status: -1,
  startDate: "",
  endDate: "",
});

const contestModalRef = ref(null);
let contestModal;

// 🔹 Lấy danh sách
const fetchContests = async () => {
  try {
    const res = await axios.get("/api/contest");
    contests.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải danh sách:", err);
  }
};

// 🔹 Bộ lọc
const filteredContests = computed(() => {
  return contests.value.filter((item) => {
    const matchesSearch = item.tenCuocThi
      .toLowerCase()
      .includes(filters.value.search.toLowerCase());
    const matchesStatus =
      filters.value.status === -1 || item.status === filters.value.status;

    const start = filters.value.startDate
      ? new Date(filters.value.startDate)
      : null;
    const end = filters.value.endDate
      ? new Date(filters.value.endDate)
      : null;
    const itemStart = new Date(item.ngayBatDau);
    const itemEnd = new Date(item.ngayKetThuc);

    const matchesDate =
      (!start || itemStart >= start) && (!end || itemEnd <= end);

    return matchesSearch && matchesStatus && matchesDate;
  });
});

// 🔹 Reset filter
const clearFilters = () => {
  filters.value = { search: "", status: -1, startDate: "", endDate: "" };
};

// 🔹 Modal thêm/sửa
const openAddModal = () => {
  isEditing.value = false;
  Object.assign(form.value, {
    _id: null,
    tenCuocThi: "",
    moTa: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    status: 1,
  });
  contestModal.show();
};

const openEditModal = (contest) => {
  isEditing.value = true;
  Object.assign(form.value, { ...contest });
  form.value.ngayBatDau = contest.ngayBatDau.split("T")[0];
  form.value.ngayKetThuc = contest.ngayKetThuc.split("T")[0];
  contestModal.show();
};

const saveContest = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/contest/${form.value._id}`, form.value);
    } else {
      await axios.post("/api/contest", form.value);
    }
    contestModal.hide();
    await fetchContests();
  } catch (err) {
    console.error("Lỗi khi lưu:", err);
  }
};

const deleteContest = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa cuộc thi này?")) return;
  try {
    await axios.delete(`/api/contest/${id}`);
    await fetchContests();
  } catch (err) {
    console.error("Lỗi khi xóa:", err);
  }
};

// 🔹 Format ngày
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

onMounted(() => {
  fetchContests();
  contestModal = new Modal(contestModalRef.value);
});
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}
</style>
