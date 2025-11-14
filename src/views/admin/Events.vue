<template>
  <div class="container-fluid">
    <!-- Bộ lọc -->
    <div class="card shadow-sm border-0 mb-1">
      <div class="card-body row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label mb-1">Chọn Cuộc thi</label>
          <select v-model="filter.cuocThi" class="form-select" @change="onFilterChange">
            <option value="">Tất cả cuộc thi</option>
            <option v-for="ct in contests" :key="ct._id" :value="ct._id">
              {{ ct.tenCuocThi }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label mb-1">Chọn Hạng mục</label>
          <select v-model="filter.hangMuc" class="form-select" @change="onFilterChange">
            <option value="">Tất cả hạng mục</option>
            <option v-for="cat in filteredCategories" :key="cat._id" :value="cat._id">
              {{ cat.tenHangMuc }}
            </option>
          </select>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary" @click="openAddModal">
            <i class="bi bi-plus-circle me-1"></i> Thêm ứng viên
          </button>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40px;">#</th>
                <th style="min-width: 120px;">Họ tên</th>
                <th style="min-width: 200px;">Mô tả</th>
                <th style="min-width: 150px;">URL</th>
                <th style="min-width: 120px;">Hạng mục</th>
                <th style="min-width: 120px;">Cuộc thi</th>
                <th style="width: 100px;">Trạng thái</th>
                <th class="text-end" style="width: 120px;">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredCandidates" :key="item._id">
                <td>{{ index + 1 }}</td>
                <td :title="item.hoTen" class="text-truncate">{{ item.hoTen }}</td>
                <td :title="item.moTa" class="text-wrap">{{ item.moTa || '—' }}</td>
                <td>
                  <a v-if="item.url" :href="item.url" target="_blank" class="text-wrap" :title="item.url">
                    {{ item.url }}
                  </a>
                  <span v-else>—</span>
                </td>
                <td :title="item.hangMuc?.tenHangMuc" class="text-truncate">{{ item.hangMuc?.tenHangMuc || '—' }}</td>
                <td :title="item.hangMuc?.cuocThi?.tenCuocThi" class="text-truncate">{{
                  item.hangMuc?.cuocThi?.tenCuocThi || '—' }}</td>
                <td>
                  <span class="badge" :class="item.status === 1 ? 'bg-success' : 'bg-secondary'">
                    {{ item.status === 1 ? 'Hoạt động' : 'Ẩn' }}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-warning me-1" @click="openEditModal(item)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteCandidate(item._id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredCandidates.length === 0">
                <td colspan="8" class="text-center text-muted py-3">
                  Không có ứng viên phù hợp
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div class="modal fade" id="candidateModal" tabindex="-1" aria-labelledby="candidateModalLabel" aria-hidden="true"
      ref="candidateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Cập nhật ứng viên' : 'Thêm ứng viên' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCandidate">
              <div class="mb-3">
                <label class="form-label">Họ tên</label>
                <input v-model="form.hoTen" type="text" class="form-control" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea v-model="form.moTa" class="form-control" rows="3"></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Liên kết (URL)</label>
                <input v-model="form.url" type="url" class="form-control" placeholder="https://example.com" />
              </div>

              <div class="mb-3">
                <label class="form-label">Hạng mục</label>
                <select v-model="form.hangMuc" class="form-select" required>
                  <option value="" disabled>-- Chọn hạng mục --</option>
                  <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                    {{ cat.tenHangMuc }} ({{ cat.cuocThi?.tenCuocThi }})
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.status" class="form-select">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Ẩn</option>
                </select>
              </div>

              <div class="text-end">
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? 'Lưu thay đổi' : 'Thêm mới' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "@/api/axiosClient";
import { ref, computed, onMounted } from "vue";
import * as bootstrap from "bootstrap";

const candidates = ref([]);
const categories = ref([]);
const contests = ref([]);
const form = ref({ hoTen: "", moTa: "", url: "", hangMuc: "", status: 1 });
const isEditing = ref(false);
const candidateModal = ref(null);
let modalInstance = null;

const filter = ref({ cuocThi: "", hangMuc: "" });

const getCandidates = async () => {
  const res = await axios.get("/api/candidate");
  candidates.value = res.data;
};

const getCategories = async () => {
  const res = await axios.get("/api/category");
  categories.value = res.data;
};

const getContests = async () => {
  const res = await axios.get("/api/contest");
  contests.value = res.data;
};

const openAddModal = () => {
  form.value = { hoTen: "", moTa: "", url: "", hangMuc: "", status: 1 };
  isEditing.value = false;
  modalInstance.show();
};

const openEditModal = (item) => {
  form.value = { ...item, hangMuc: item.hangMuc?._id };
  isEditing.value = true;
  modalInstance.show();
};

const saveCandidate = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/candidate/${form.value._id}`, form.value);
    } else {
      await axios.post("/api/candidate", form.value);
    }
    modalInstance.hide();
    await getCandidates();
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra!");
  }
};

const deleteCandidate = async (id) => {
  if (!confirm("Bạn chắc chắn muốn xóa ứng viên này?")) return;
  await axios.delete(`/api/candidate/${id}`);
  await getCandidates();
};

const onFilterChange = () => { };

const filteredCategories = computed(() => {
  if (!filter.value.cuocThi) return categories.value;
  return categories.value.filter((cat) => cat.cuocThi?._id === filter.value.cuocThi);
});

const filteredCandidates = computed(() => {
  return candidates.value.filter((c) => {
    const matchCuocThi = !filter.value.cuocThi || c.hangMuc?.cuocThi?._id === filter.value.cuocThi;
    const matchHangMuc = !filter.value.hangMuc || c.hangMuc?._id === filter.value.hangMuc;
    return matchCuocThi && matchHangMuc;
  });
});

onMounted(async () => {
  modalInstance = new bootstrap.Modal(candidateModal.value);
  await Promise.all([getContests(), getCategories(), getCandidates()]);
});
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

.table td,
.table th {
  vertical-align: middle;
  padding: 0.5rem;
}

/* Các cột chữ dài dùng ellipsis */
.text-truncate {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Tooltip hover */
.table td[title]:hover {
  cursor: pointer;
  text-decoration: underline;
}

/* Cột dài wrap text */
.text-wrap {
  max-width: 200px;
  white-space: normal;
  word-break: break-word;
}

@media (max-width: 992px) {
  .text-truncate {
    max-width: 120px;
  }

  .text-wrap {
    max-width: 150px;
  }

  .table td,
  .table th {
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  .text-truncate {
    max-width: 80px;
  }

  .text-wrap {
    max-width: 120px;
  }
}
</style>
