<template>
  <div class="container-fluid">
    <!-- Nút thêm -->
    <div class="d-flex justify-content-end mb-1">
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle me-1"></i> Thêm hạng mục
      </button>
    </div>

    <!-- Bộ lọc -->
    <div class="card shadow-sm border-0 mb-3">
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              placeholder="Tìm theo tên hạng mục"
              v-model="filters.tenHangMuc"
            />
          </div>
          <div class="col-md-4">
            <select class="form-select" v-model="filters.cuocThi">
              <option value="">-- Chọn cuộc thi --</option>
              <option v-for="ct in cuocThis" :key="ct._id" :value="ct._id">
                {{ ct.tenCuocThi }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-select" v-model="filters.status">
              <option value="">-- Chọn trạng thái --</option>
              <option :value="1">Hoạt động</option>
              <option :value="0">Ẩn</option>
            </select>
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
              <th>Tên hạng mục</th>
              <th>Mô tả</th>
              <th>Cuộc thi</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredCategories" :key="item._id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.tenHangMuc }}</td>
              <td>{{ item.moTa || '-' }}</td>
              <td>{{ item.cuocThi?.tenCuocThi || 'Không có' }}</td>
              <td>
                <span
                  :class="['badge', item.status === 1 ? 'bg-success' : 'bg-secondary']"
                >
                  {{ item.status === 1 ? 'Hoạt động' : 'Ẩn' }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" @click="openEditModal(item)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteCategory(item._id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal thêm / sửa -->
    <div
      class="modal fade"
      id="categoryModal"
      tabindex="-1"
      aria-labelledby="categoryModalLabel"
      aria-hidden="true"
      ref="categoryModal"
    >
      <div class="modal-dialog">
        <div class="modal-content border-0 shadow-sm">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="categoryModalLabel">
              {{ isEdit ? 'Cập nhật Hạng mục' : 'Thêm Hạng mục mới' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCategory">
              <div class="mb-3">
                <label class="form-label">Tên hạng mục</label>
                <input type="text" v-model="form.tenHangMuc" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea v-model="form.moTa" class="form-control"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Cuộc thi</label>
                <!-- Select2 dropdown -->
                <select id="selectCuocThi" class="form-select" required>
                  <option value="">-- Chọn cuộc thi --</option>
                  <option v-for="ct in cuocThis" :key="ct._id" :value="ct._id">
                    {{ ct.tenCuocThi }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model.number="form.status" class="form-select">
                  <option :value="1">Hoạt động</option>
                  <option :value="0">Ẩn</option>
                </select>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" class="btn btn-primary">
                  {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
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
import { ref, onMounted, nextTick, computed } from 'vue'
import axios from '@/api/axiosClient'

const categories = ref([])
const cuocThis = ref([])

const filters = ref({
  tenHangMuc: '',
  cuocThi: '',
  status: ''
})

const filteredCategories = computed(() => {
  return categories.value.filter(cat => {
    const matchName = cat.tenHangMuc.toLowerCase().includes(filters.value.tenHangMuc.toLowerCase())
    const matchContest = filters.value.cuocThi ? cat.cuocThi?._id === filters.value.cuocThi : true
    const matchStatus = filters.value.status !== '' ? cat.status === filters.value.status : true
    return matchName && matchContest && matchStatus
  })
})

const form = ref({
  tenHangMuc: '',
  moTa: '',
  cuocThi: '',
  status: 1
})
const isEdit = ref(false)
const modalInstance = ref(null)
const categoryModal = ref(null)

// Lấy danh sách hạng mục
const getCategories = async () => {
  const res = await axios.get('/api/category')
  categories.value = res.data
}

// Lấy danh sách cuộc thi để chọn
const getCuocThis = async () => {
  const res = await axios.get('/api/contest')
  cuocThis.value = res.data
  await nextTick()
  initSelect2()
}

// Khởi tạo select2
const initSelect2 = () => {
  const modalEl = categoryModal.value
  const select = $(modalEl).find('#selectCuocThi')

  if (select.hasClass('select2-hidden-accessible')) {
    select.select2('destroy')
  }

  select.select2({
    placeholder: '-- Chọn cuộc thi --',
    width: '100%',
    dropdownParent: $(modalEl)
  })

  select.off('change').on('change', (e) => {
    form.value.cuocThi = e.target.value
  })
}

// Mở modal thêm
const openAddModal = async () => {
  isEdit.value = false
  Object.assign(form.value, { tenHangMuc: '', moTa: '', cuocThi: '', status: 1 })
  await nextTick()
  modalInstance.value = new bootstrap.Modal(categoryModal.value)
  modalInstance.value.show()
  initSelect2()
}

// Mở modal sửa
const openEditModal = async (item) => {
  isEdit.value = true
  Object.assign(form.value, { ...item, cuocThi: item.cuocThi?._id })
  await nextTick()
  modalInstance.value = new bootstrap.Modal(categoryModal.value)
  modalInstance.value.show()
  initSelect2()
  $('#selectCuocThi').val(form.value.cuocThi).trigger('change')
}

// Lưu hạng mục (thêm/sửa)
const saveCategory = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`/api/category/${form.value._id}`, form.value)
    } else {
      await axios.post('/api/category', form.value)
    }
    modalInstance.value.hide()
    await getCategories()
  } catch (err) {
    console.error(err)
  }
}

// Xóa hạng mục
const deleteCategory = async (id) => {
  if (confirm('Bạn có chắc muốn xóa hạng mục này?')) {
    await axios.delete(`/api/category/${id}`)
    await getCategories()
  }
}

onMounted(() => {
  getCategories()
  getCuocThis()
})
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}
.select2-container .select2-selection--single {
  height: 38px;
  padding: 6px 12px;
}
</style>
