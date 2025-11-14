<template>
  <div>
    <div class="container py-4">
      <h3 class="mb-4 text-center text-primary fw-bold">
        CÁC CUỘC THI ĐANG DIỄN RA
      </h3>

      <div class="mb-4 d-flex flex-wrap justify-content-center gap-3">
        <select class="form-select w-auto w-sm-100" v-model="filterContestId">
          <option value="">Tất cả cuộc thi</option>
          <option v-for="c in contests" :key="c._id" :value="c._id">{{ c.tenCuocThi }}</option>
        </select>

        <select class="form-select w-auto w-sm-100" v-model="filterCategoryId" :disabled="!filterContestId">
          <option value="">Tất cả hạng mục</option>
          <option v-for="cat in filteredCategoriesDropdown" :key="cat._id" :value="cat._id">
            {{ cat.tenHangMuc }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2">Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="filteredContests.length === 0" class="alert alert-info text-center">
        Hiện không có cuộc thi nào đang diễn ra.
      </div>

      <div v-else class="row g-4">
        <div class="col-12 col-sm-6 col-md-4" v-for="contest in filteredContests" :key="contest._id">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 class="fw-bold text-primary">{{ contest.tenCuocThi }}</h5>
                <p class="text-muted mb-2">
                  <i class="bi bi-calendar-event me-1"></i>
                  {{ formatDate(contest.ngayBatDau) }} - {{ formatDate(contest.ngayKetThuc) }}
                </p>
                <p class="small text-secondary">{{ contest.moTa || 'Không có mô tả.' }}</p>
              </div>
              <div class="d-flex flex-wrap gap-2 mt-3">
                <button class="btn btn-outline-primary flex-grow-1" @click="openVoteModal(contest)"
                  :disabled="!authStore.isLoggedIn">
                  <i class="bi bi-hand-thumbs-up me-1"></i> Tham gia bình chọn
                </button>
                <button class="btn btn-outline-success flex-grow-1" @click="openRankingModal(contest)">
                  <i class="bi bi-bar-chart-line me-1"></i> Bảng xếp hạng
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="rankingModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Bảng xếp hạng - {{ selectedContest?.tenCuocThi }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Chọn hạng mục:</label>
              <select class="form-select w-auto" v-model="selectedCategoryId" :disabled="categories.length === 0">
                <option value="">Tất cả hạng mục</option>
                <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.tenHangMuc }}</option>
              </select>
            </div>

            <div v-if="loadingRanking" class="text-center py-5">
              <div class="spinner-border text-success" style="width: 3rem; height: 3rem;"></div>
              <p class="mt-3 fs-5">Đang tải bảng xếp hạng...</p>
            </div>

            <div v-else-if="rankings.length === 0" class="alert alert-info text-center mt-3">
              Chưa có dữ liệu bình chọn cho hạng mục này.
            </div>

            <div v-else class="row g-4 mt-2">

              <div class="col-lg-5 col-12">
                <h6 class="fw-bold text-center mb-3">Biểu đồ trực quan</h6>
                <div class="chart-container" style="position: relative; height: 400px;">
                  <canvas id="rankingChart"></canvas>
                </div>
              </div>

              <div class="col-lg-7 col-12">
                <h6 class="fw-bold text-center mb-3">BẢNG XẾP HẠNG</h6>
                <div class="ranking-list-container">
                  <div v-for="(r, index) in rankingsWithRank" :key="r.ungVienId"
                    class="d-flex justify-content-between align-items-center border-bottom py-2 px-2">
                    <span>
                      <strong>{{ r.rank }}. </strong>
                      <strong>{{ r.hoTen }}</strong>
                    </span>
                    <span class="badge bg-success rounded-pill fs-6">
                      {{ r.voteCount }} lượt
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary w-100 w-md-auto" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="voteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-scrollable" style="max-width: 100vw;">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header text-black py-2">
            <h6 class="modal-title fw-bold text-truncate" style="max-width: 85%;">
              Bình chọn - {{ selectedContest?.tenCuocThi }}
            </h6>
          </div>

          <!-- Body -->
          <div class="modal-body px-2 px-md-3">
            <!-- Mô tả cuộc thi -->
            <div v-if="selectedContest?.moTa" class="mb-2 text-secondary fst-italic small">
              {{ selectedContest.moTa }}
            </div>

            <!-- Ô tìm kiếm -->
            <div class="mb-3">
              <input v-model="searchKeyword" type="text" class="form-control form-control-sm"
                placeholder="Tìm kiếm ứng viên..." />
            </div>

            <!-- Loading -->
            <div v-if="loadingModal" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
              <p class="mt-2 small">Đang tải hạng mục...</p>
            </div>

            <!-- Danh sách ứng viên -->
            <div v-else>
              <div v-for="cat in filteredCategories" :key="cat._id" class="">
                <div v-if="filteredCandidatesByCat(cat._id).length">
                  <div v-for="(cand, idx) in filteredCandidatesByCat(cat._id)" :key="cand._id"
                    class="candidate-card mb-2 p-2 border rounded bg-light-subtle">

                    <!-- Row layout: Tên + Badge (Laptop), stacked (Mobile) -->
                    <div
                      class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-2">
                      <h6 class="mb-1 fw-semibold text-dark text-wrap flex-grow-1">
                        {{ idx + 1 }}. {{ cand.hoTen }}
                      </h6>
                      <span class="badge bg-white text-dark border small text-wrap ms-lg-2 mt-1 mt-lg-0">
                        {{ cat.tenHangMuc }}
                      </span>
                    </div>

                    <!-- Mô tả & lượt bình chọn -->
                    <div class="text-muted small fst-italic mb-1">
                      {{ cand.moTa || 'Không có mô tả.' }}
                    </div>
                    <div class="text-success small fw-semibold mb-2">
                      <i class="bi bi-people-fill me-1"></i>{{ cand.voteCount }} lượt bình chọn
                    </div>

                    <!-- Nút hành động -->
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

                    <!-- Microlink preview -->
                    <div v-if="cand.microlink" class="mt-2 text-center border-top pt-2">
                      <img v-if="cand.microlink.image?.url" :src="cand.microlink.image.url"
                        class="img-fluid rounded shadow-sm" style="max-height: 200px; object-fit: contain;" />
                      <div class="small text-secondary mt-1" v-if="cand.microlink.title">
                        {{ cand.microlink.title }}
                      </div>
                      <div class="small text-muted mb-1" v-if="cand.microlink.description">
                        {{ cand.microlink.description }}
                      </div>
                    </div>

                  </div>
                </div>

                <div v-else class="text-muted fst-italic small">
                  Không có ứng viên trong hạng mục này.
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer py-2">
            <button type="button" class="btn btn-secondary w-100 w-md-auto" data-bs-dismiss="modal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axiosClient from '@/api/axiosClient'
import Swal from 'sweetalert2'
import Chart from 'chart.js/auto'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

let modal = null
let rankingModal = null
let rankingChart = null

// -------------------- STATE --------------------
const contests = ref([])
const categories = ref([])
const candidates = ref({})
const rankings = ref([])

const loading = ref(true)
const loadingModal = ref(false)
const loadingRanking = ref(false)

const selectedContest = ref(null)
const selectedCategoryId = ref('')
const filterContestId = ref('')
const filterCategoryId = ref('')


// -------------------- CẬP NHẬT CHART --------------------
const renderRankingChart = () => {
  if (!rankings.value.length) return

  const ctx = document.getElementById('rankingChart').getContext('2d')
  if (rankingChart) rankingChart.destroy()

  // Sắp xếp lại dữ liệu, từ cao đến thấp (để biểu đồ hiển thị đúng)
  const sortedRankings = [...rankings.value].sort((a, b) => a.voteCount - b.voteCount)

  rankingChart = new Chart(ctx, {
    type: 'bar', // Biểu đồ thanh
    data: {
      labels: sortedRankings.map(r => r.hoTen),
      datasets: [{
        label: 'Số lượt bình chọn',
        data: sortedRankings.map(r => r.voteCount),
        backgroundColor: 'rgba(40, 167, 69, 0.7)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y', // <-- Chuyển thành biểu đồ ngang
      responsive: true,
      maintainAspectRatio: false, // <-- Để biểu đồ lấp đầy container 400px
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.raw} lượt`
          }
        }
      },
      scales: {
        x: { // Trục X (số vote)
          beginAtZero: true,
          title: { display: true, text: 'Số lượt bình chọn' }
        },
        y: { // Trục Y (tên)
          ticks: { autoSkip: false }
        }
      }
    }
  })
}


watch(rankings, () => {
  const modalEl = document.getElementById('rankingModal')
  if (modalEl && modalEl.classList.contains('show')) {
    // Phải chờ 1 chút để DOM cập nhật sau v-if
    setTimeout(renderRankingChart, 0)
  }
})


// -------------------- FETCH DANH SÁCH CUỘC THI --------------------
onMounted(async () => {
  try {
    const res = await axiosClient.get('/api/contest')
    contests.value = res.data.filter(c => c.status === 1)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

// -------------------- WATCH: LỌC HẠNG MỤC THEO CUỘC THI --------------------
watch(filterContestId, async (val) => {
  filterCategoryId.value = ''
  if (!val) {
    categories.value = []
    return
  }
  try {
    const res = await axiosClient.get(`/api/category?contestId=${val}`)
    categories.value = res.data
  } catch (err) {
    console.error(err)
    categories.value = []
  }
})

// -------------------- MỞ MODAL: BÌNH CHỌN --------------------
const openVoteModal = async (contest) => {
  if (!authStore.isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Chưa đăng nhập',
      text: 'Bạn cần đăng nhập để tham gia bình chọn.',
      confirmButtonText: 'Đăng nhập'
    })
    return
  }

  selectedContest.value = contest
  categories.value = []
  candidates.value = {}

  // Hiển thị Swal loading
  Swal.fire({
    title: 'Đang tải dữ liệu...',
    html: 'Vui lòng chờ trong giây lát.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })

  try {
    const catRes = await axiosClient.get(`/api/category?contestId=${contest._id}`)
    categories.value = catRes.data

    const voteRes = await axiosClient.get('/api/vote/me')
    const myVotes = voteRes.data

    for (const cat of categories.value) {
      const candRes = await axiosClient.get(`/api/candidate?categoryId=${cat._id}`)
      const candList = await Promise.all(
        candRes.data.map(async (c) => {
          const voted = myVotes.some(v => v.ungVien._id === c._id)
          let voteCount = 0
          try {
            const countRes = await axiosClient.get(`/api/vote/candidate/${c._id}/count`)
            voteCount = countRes.data.votes
          } catch (err) {
            console.warn(`Không lấy được số lượt vote của ${c.hoTen}`)
          }
          return { ...c, microlink: null, voted, voteCount }
        })
      )
      candidates.value[cat._id] = candList
    }

    // Tắt Swal khi xong
    Swal.close()

    // Hiển thị modal
    showVoteModal()

  } catch (err) {
    console.error(err)
    Swal.fire({
      icon: 'error',
      title: 'Lỗi tải dữ liệu',
      text: 'Không thể tải danh sách hạng mục hoặc ứng viên.'
    })
  }
}


const openRankingModal = async (contest) => {
  Swal.fire({
    title: 'Đang tải bảng xếp hạng...',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading()
  })

  try {
    selectedContest.value = contest
    categories.value = []
    selectedCategoryId.value = ''
    rankings.value = []

    const catRes = await axiosClient.get(`/api/category?contestId=${contest._id}`)
    categories.value = catRes.data
    await fetchRanking()

    Swal.close()
    showRankingModal()
  } catch (err) {
    console.error(err)
    Swal.fire('Lỗi', 'Không thể tải bảng xếp hạng.', 'error')
  }
}


// Watch khi đổi hạng mục
watch(selectedCategoryId, () => {
  fetchRanking()
})

// -------------------- FETCH BẢNG XẾP HẠNG --------------------
const fetchRanking = async () => {
  if (!selectedContest.value) return
  loadingRanking.value = true
  rankings.value = []

  try {
    const url = selectedCategoryId.value
      ? `/api/vote/ranking/${selectedContest.value._id}/${selectedCategoryId.value}`
      : `/api/vote/ranking/${selectedContest.value._id}/all`
    const res = await axiosClient.get(url)
    rankings.value = res.data
  } catch (err) {
    console.error(err)
    Swal.fire('Lỗi', 'Không thể tải bảng xếp hạng.', 'error')
  } finally {
    loadingRanking.value = false
  }
}

// Tạo thứ tự rank dựa trên voteCount, xử lý trùng số vote
const rankingsWithRank = computed(() => {
  const sorted = [...rankings.value].sort((a, b) => b.voteCount - a.voteCount)
  let lastVote = null
  let lastRank = 0
  return sorted.map((r, i) => {
    if (r.voteCount === lastVote) {
      r.rank = lastRank
    } else {
      r.rank = i + 1
      lastRank = r.rank
      lastVote = r.voteCount
    }
    return r
  })
})

// -------------------- MICROLINK PREVIEW --------------------
const fetchMicrolink = async (cand) => {
  if (!cand.url || cand.microlink) return;

  // Hiệu ứng loading
  Swal.fire({
    title: "Đang tải thông tin...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const { data } = await axiosClient.get(`/api/microlink?url=${encodeURIComponent(cand.url)}`);
    cand.microlink = data;

    // Đóng loading
    Swal.close();

    // Hiển thị thông tin preview + hỏi người dùng
    const result = await Swal.fire({
      title: "Xem trước liên kết",
      html: `
        <div class="text-start">
          <h5>${data.title || 'Không có tiêu đề'}</h5>
          <p class="text-muted small">${data.description || 'Không có mô tả'}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Mở trang",
      cancelButtonText: "Đóng",
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
      width: "32rem",
    });

    // Nếu người dùng chọn mở trang
    if (result.isConfirmed) {
      window.open(cand.url, "_blank");
    }
  } catch (err) {
    Swal.close();
    console.error("Microlink fetch error:", err);
    Swal.fire("Lỗi", "Không thể tải preview cho liên kết này.", "error");
  }
};


// -------------------- HIỂN THỊ MODAL --------------------
const showVoteModal = () => {
  const modalEl = document.getElementById('voteModal')
  if (!modal) modal = new bootstrap.Modal(modalEl)
  modal.show()
}

const showRankingModal = () => {
  const modalEl = document.getElementById('rankingModal')
  if (!rankingModal) rankingModal = new bootstrap.Modal(modalEl)

  // Xóa chart cũ (nếu có) trước khi hiển thị
  if (rankingChart) {
    rankingChart.destroy()
    rankingChart = null
  }

  rankingModal.show()

  // Bỏ listener 'shown.bs.modal' vì `watch(rankings)` đã xử lý việc render
}



// -------------------- BÌNH CHỌN --------------------
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

    // 🌀 Hiệu ứng loading (khóa giao diện, tránh double click)
    Swal.fire({
      title: 'Đang gửi bình chọn...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    await axiosClient.post('/api/vote/', {
      ungVienId: candidate._id,
      hangMucId: category._id,
      cuocThiId: selectedContest.value._id
    })

    // Cập nhật lại số lượt bình chọn
    const countRes = await axiosClient.get(`/api/vote/candidate/${candidate._id}/count`)
    candidate.voteCount = countRes.data.votes
    candidate.voted = true

    // ✅ Đóng loading, hiển thị thành công
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


// -------------------- HỖ TRỢ --------------------
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN')

// -------------------- COMPUTED --------------------
const filteredContests = computed(() => {
  if (!filterContestId.value) return contests.value
  return contests.value.filter(c => c._id === filterContestId.value)
})

const filteredCategories = computed(() => {
  if (!filterCategoryId.value) return categories.value
  return categories.value.filter(cat => cat._id === filterCategoryId.value)
})

const filteredCategoriesDropdown = computed(() => categories.value)
// -------------------- TÌM KIẾM ỨNG VIÊN --------------------
const searchKeyword = ref('')

const filteredCandidatesByCat = (catId) => {
  const list = candidates.value[catId] || []
  if (!searchKeyword.value.trim()) return list
  const kw = searchKeyword.value.toLowerCase()
  return list.filter(c => c.hoTen.toLowerCase().includes(kw))
}

</script>

<style scoped>
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.modal-body {
  background: #fafafa;
}

img {
  max-width: 100%;
  height: auto;
}

/* Style cho container danh sách */
.ranking-list-container {
  max-height: 400px;
  /* Đồng bộ với chiều cao biểu đồ */
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}

@media (max-width: 991px) {

  /* Khi xếp chồng trên màn hình < lg */
  .ranking-list-container {
    max-height: 300px;
    /* Giảm chiều cao trên mobile */
  }

  /* THÊM MỚI: Giảm chiều cao biểu đồ cho đồng bộ */
  .chart-container {
    height: 300px !important;
  }
}

@media (max-width: 576px) {
  h3 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1rem;
  }

  h6 {
    font-size: 0.9rem;
  }

  p,
  .small {
    font-size: 0.8rem;
  }

  .spinner-border {
    width: 2rem;
    height: 2rem;
  }

  .text-center.py-5 {
    padding: 2rem 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .mb-4.border.rounded.p-3 {
    padding: 0.75rem;
  }

  .btn {
    font-size: 0.85rem;
  }
}
.modal .btn {
  white-space: nowrap;
}

.modal .d-flex.flex-md-row {
  flex-wrap: wrap;
}

.modal .text-muted {
  word-break: break-word;
}
/* Candidate card padding */
.candidate-card {
  padding: 1rem;
}

/* Badge wrap và giới hạn width laptop */
@media (min-width: 992px) {
  .candidate-card .badge {
    white-space: normal;
    max-width: 200px;
  }

  .candidate-card .btn {
    min-width: 120px;
  }
}

</style>