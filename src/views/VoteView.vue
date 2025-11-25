<template>
  <div class="pt-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-2">Đang tải dữ liệu cuộc thi...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <div v-else-if="selectedContest">
      <router-link to="/" class="btn btn-outline-secondary mb-3">
        <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
      </router-link>

      <h3 class="fw-bold text-primary display-6">{{ selectedContest.tenCuocThi }}</h3>
      <div v-if="selectedContest.moTa" class="mb-2 text-secondary fst-italic fs-5">
        {{ selectedContest.moTa }}
      </div>
      <hr class="mb-4">

      <div class="mb-3 sticky-top" style="top: 80px; z-index: 100;">
        <input v-model="searchKeyword" type="text" class="form-control form-control-lg"
          placeholder="Tìm kiếm ứng viên..." />
      </div>

      <div>
        <div v-for="cat in categories" :key="cat._id" class="mb-4">
          
          <h5 class="fw-bold mb-2 p-2 bg-light rounded">{{ cat.tenHangMuc }}</h5>

          <div v-if="filteredCandidatesByCat(cat._id).length">
            <div v-for="(cand, idx) in filteredCandidatesByCat(cat._id)" :key="cand._id"
                  class="candidate-card-modal d-flex p-2 border rounded mb-2 align-items-center">

              <div class="flex-grow-1">
                <h6 class="mb-1 fw-semibold text-dark">
                  {{ idx + 1 }}. {{ cand.hoTen }}
                </h6>
                <div class="text-muted small fst-italic mb-1">
                  {{ cand.moTa || 'Không có mô tả.' }}
                </div>
                <div class="text-success small fw-semibold mb-2">
                  <i class="bi bi-people-fill me-1"></i>{{ cand.voteCount }} lượt bình chọn
                </div>
                
                <div class="d-flex flex-column flex-lg-row gap-2">
                  <button class="btn btn-sm btn-success" :disabled="cand.voted" @click="voteCandidate(cat, cand)">
                    <i class="bi bi-hand-thumbs-up-fill me-1"></i> Bình chọn
                  </button>
                  <button v-if="cand.url && !cand.microlink" class="btn btn-sm btn-outline-info"
                    @click="fetchMicrolink(cand)">
                    Xem trước
                  </button>
                  <a v-if="cand.url && cand.microlink" :href="cand.url" target="_blank"
                    class="btn btn-sm btn-outline-primary">
                    Mở trang
                  </a>
                </div>
              </div>
              
              <div v-if="cand.microlink" class="ms-3 d-none d-lg-block">
                <img v-if="cand.microlink.image?.url" :src="cand.microlink.image.url"
                      class="img-fluid rounded shadow-sm" style="max-width: 150px; object-fit: contain;" />
              </div>
            </div>
          </div>
          <div v-else class="text-muted fst-italic small p-2">
            Không có ứng viên nào phù hợp với tìm kiếm.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router' // Import useRoute
import axiosClient from '@/api/axiosClient'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/store/auth'

// === TẤT CẢ LOGIC BẠN ĐÃ XÓA TỪ CONTESTLISTVIEW ===
const authStore = useAuthStore()
const route = useRoute() // Lấy thông tin route

const categories = ref([])
const candidates = ref({})
const loading = ref(true) // Đổi tên từ loadingModal
const error = ref(null)
const selectedContest = ref(null)
const searchKeyword = ref('')
const contestId = ref(null)

// === HÀM ONMOUNTED MỚI (Thay thế cho openVoteModal) ===
onMounted(async () => {
  contestId.value = route.params.id // Lấy ID từ URL
  if (!contestId.value) {
    error.value = "Không tìm thấy ID cuộc thi."
    loading.value = false
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    // 1. Lấy thông tin cuộc thi
    const contestRes = await axiosClient.get(`/api/contest/${contestId.value}`)
    selectedContest.value = contestRes.data

    // 2. Lấy danh sách hạng mục
    const catRes = await axiosClient.get(`/api/category?contestId=${contestId.value}`)
    categories.value = catRes.data

    // 3. Lấy lịch sử bình chọn của tôi
    const voteRes = await axiosClient.get('/api/vote/me')
    const myVotes = voteRes.data

    // 4. Lấy ứng viên và số lượt vote
    for (const cat of categories.value) {
      // 1. API này BÂY GIỜ đã trả về 'voteCount'
      const candRes = await axiosClient.get(`/api/candidate?categoryId=${cat._id}`);

      // 2. Map dữ liệu (không cần async/Promise.all)
      const candList = candRes.data.map(c => {
        const voted = myVotes.some(v => v.ungVien._id === c._id);

        // ---- XÓA BỎ HOÀN TOÀN KHỐI TRY...CATCH GỌI API ĐẾM VOTE Ở ĐÂY ----

        return { ...c, microlink: null, voted }; // 'c.voteCount' đã có sẵn
      });

      candidates.value[cat._id] = candList;
    }
  } catch (err) {
    console.error(err)
    error.value = "Lỗi tải dữ liệu. Vui lòng thử lại."
    Swal.fire({
      icon: 'error',
      title: 'Lỗi tải dữ liệu',
      text: 'Không thể tải danh sách hạng mục hoặc ứng viên.'
    })
  } finally {
    loading.value = false
  }
})

// === CÁC HÀM HỖ TRỢ (Copy y hệt từ file cũ) ===
const voteCandidate = async (category, candidate) => {
  try {
    const result = await Swal.fire({
      title: 'Xác nhận bình chọn',
      text: `Bạn có chắc muốn chọn "${candidate.hoTen}" trong "${category.tenHangMuc}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Có, chọn!',
      cancelButtonText: 'Hủy',
    })
    if (!result.isConfirmed) return

    Swal.fire({
      title: 'Đang gửi bình chọn...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    })

    await axiosClient.post('/api/vote/', {
      ungVienId: candidate._id,
      hangMucId: category._id,
      cuocThiId: contestId.value // Dùng contestId từ ref
    })

    const countRes = await axiosClient.get(`/api/vote/candidate/${candidate._id}/count`)
    candidate.voteCount = countRes.data.votes
    candidate.voted = true

    Swal.fire({
      icon: 'success',
      title: 'Đã chọn!',
      text: `Bạn đã chọn "${candidate.hoTen}"`,
      timer: 1500,
      showConfirmButton: false,
    })
  } catch (err) {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.response?.data?.message || 'Có lỗi xảy ra khi bình chọn.',
    })
  }
}

const fetchMicrolink = async (cand) => {
  if (!cand.url || cand.microlink) return;
  Swal.fire({
    title: "Đang tải thông tin...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const { data } = await axiosClient.get(`/api/microlink?url=${encodeURIComponent(cand.url)}`);
    cand.microlink = data;
    Swal.close();
  } catch (err) {
    Swal.close();
    console.error("Microlink fetch error:", err);
    Swal.fire("Lỗi", "Không thể tải preview cho liên kết này.", "error");
  }
};

const filteredCategories = computed(() => {
  return categories.value
})

const filteredCandidatesByCat = (catId) => {
  const list = candidates.value[catId] || []
  if (!searchKeyword.value.trim()) return list
  const kw = searchKeyword.value.toLowerCase()
  return list.filter(c => c.hoTen.toLowerCase().includes(kw))
}
</script>

<style scoped>
/* === STYLE CHO CARD ỨNG VIÊN (Copy từ file cũ) === */
.candidate-card-modal {
  background: #fdfdfd;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.candidate-card-modal:hover {
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.candidate-avatar {
  width: 75px;
  height: 75px;
  object-fit: cover;
}
@media (max-width: 576px) {
  .candidate-avatar {
    width: 50px;
    height: 50px;
  }
}
</style>