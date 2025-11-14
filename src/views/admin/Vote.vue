<template>
  <div class="container-fluid">
    <!-- Nút thêm -->
    <div class="d-flex justify-content-end mb-1">
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle me-1"></i> Thêm Phiếu
      </button>
    </div>

    <!-- Bộ lọc -->
    <div class="card shadow-sm border-0 mb-3">
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-3">
            <input
              type="text"
              class="form-control"
              placeholder="Tìm theo tên người dùng"
              v-model="filters.tenNguoiDung"
            />
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filters.ungVien">
              <option value="">-- Chọn ứng viên --</option>
              <option v-for="uv in ungViens" :key="uv._id" :value="uv._id">{{ uv.hoTen }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.hangMuc">
              <option value="">-- Chọn hạng mục --</option>
              <option v-for="hm in hangMucs" :key="hm._id" :value="hm._id">{{ hm.tenHangMuc }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.cuocThi">
              <option value="">-- Chọn cuộc thi --</option>
              <option v-for="ct in cuocThiss" :key="ct._id" :value="ct._id">{{ ct.tenCuocThi }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-select" v-model="filters.status">
              <option value="">-- Chọn trạng thái --</option>
              <option :value="1">Hoạt động</option>
              <option :value="0">Ẩn</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách phiếu -->
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Người dùng</th>
              <th>Ứng viên</th>
              <th>Hạng mục</th>
              <th>Cuộc thi</th>
              <th>Ngày bình chọn</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vote, index) in filteredVotes" :key="vote._id">
              <td>{{ index + 1 }}</td>
              <td>{{ vote.nguoiDung.hoTen }} <br/> <small>{{ vote.nguoiDung.email }}</small></td>
              <td>{{ vote.ungVien.hoTen }}</td>
              <td>{{ vote.hangMuc.tenHangMuc }}</td>
              <td>{{ vote.cuocThi.tenCuocThi }}</td>
              <td>{{ new Date(vote.ngayBinhChon).toLocaleString() }}</td>
              <td>
                <span :class="['badge', vote.status === 1 ? 'bg-success' : 'bg-secondary']">
                  {{ vote.status === 1 ? 'Hợp lệ' : 'Không hợp lệ' }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-danger" @click="deleteVote(vote._id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal thêm phiếu -->
    <div class="modal fade" id="voteModal" tabindex="-1" aria-labelledby="voteModalLabel" aria-hidden="true" ref="voteModal">
      <div class="modal-dialog">
        <div class="modal-content border-0 shadow-sm">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="voteModalLabel">Thêm Phiếu Bình Chọn</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveVote">
              <div class="mb-3">
                <label class="form-label">Ứng viên</label>
                <select class="form-select" v-model="form.ungVien" required>
                  <option value="">-- Chọn ứng viên --</option>
                  <option v-for="uv in ungViens" :key="uv._id" :value="uv._id">{{ uv.hoTen }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Hạng mục</label>
                <select class="form-select" v-model="form.hangMuc" required>
                  <option value="">-- Chọn hạng mục --</option>
                  <option v-for="hm in hangMucs" :key="hm._id" :value="hm._id">{{ hm.tenHangMuc }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Cuộc thi</label>
                <select class="form-select" v-model="form.cuocThi" required>
                  <option value="">-- Chọn cuộc thi --</option>
                  <option v-for="ct in cuocThiss" :key="ct._id" :value="ct._id">{{ ct.tenCuocThi }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" v-model.number="form.status">
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
import { ref, onMounted, nextTick, computed } from 'vue'
import axios from '@/api/axiosClient'

const votes = ref([])
const ungViens = ref([])
const hangMucs = ref([])
const cuocThiss = ref([])

const filters = ref({
  tenNguoiDung: '',
  ungVien: '',
  hangMuc: '',
  cuocThi: '',
  status: ''
})

const filteredVotes = computed(() => {
  return votes.value.filter(v => {
    const matchName = v.nguoiDung.hoTen.toLowerCase().includes(filters.value.tenNguoiDung.toLowerCase())
    const matchUngVien = filters.value.ungVien ? v.ungVien._id === filters.value.ungVien : true
    const matchHangMuc = filters.value.hangMuc ? v.hangMuc._id === filters.value.hangMuc : true
    const matchCuocThi = filters.value.cuocThi ? v.cuocThi._id === filters.value.cuocThi : true
    const matchStatus = filters.value.status !== '' ? v.status === filters.value.status : true
    return matchName && matchUngVien && matchHangMuc && matchCuocThi && matchStatus
  })
})

const form = ref({
  ungVien: '',
  hangMuc: '',
  cuocThi: '',
  status: 1
})

const voteModal = ref(null)
let modalInstance = null

const getVotes = async () => {
  const res = await axios.get('/api/vote')
  votes.value = res.data
}

const getDropdowns = async () => {
  const [uvRes, hmRes, ctRes] = await Promise.all([
    axios.get('/api/candidate'),
    axios.get('/api/category'),
    axios.get('/api/contest')
  ])
  ungViens.value = uvRes.data
  hangMucs.value = hmRes.data
  cuocThiss.value = ctRes.data
}

const openAddModal = async () => {
  Object.assign(form.value, { ungVien: '', hangMuc: '', cuocThi: '', status: 1 })
  await nextTick()
  modalInstance = new bootstrap.Modal(voteModal.value)
  modalInstance.show()
}

const saveVote = async () => {
  try {
    await axios.post('/api/vote', form.value)
    modalInstance.hide()
    await getVotes()
  } catch (err) {
    console.error(err)
  }
}

const deleteVote = async (id) => {
  if (confirm('Bạn có chắc muốn xóa phiếu này?')) {
    await axios.delete(`/api/vote/${id}`)
    await getVotes()
  }
}

onMounted(() => {
  getVotes()
  getDropdowns()
})
</script>

<style scoped>
.table td, .table th {
  vertical-align: middle;
}
</style>
