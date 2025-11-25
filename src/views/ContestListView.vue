<template>
  <div>
    <div class="pt-4">
      
      <h3 class="mb-3 text-center text-primary fw-bold display-5">
        CÁC CUỘC THI NỔI BẬT
      </h3>
      <p class="text-center text-muted fs-5 mb-4" data-aos="fade-up">
        Khám phá, tham gia và bình chọn cho các ứng viên bạn tin tưởng.
      </p>

      <ul class="nav nav-pills justify-content-center mb-4" id="contestTabs" role="tablist" data-aos="fade-up" data-aos-delay="100">
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            :class="{ active: filterStatus === 'active' }"
            type="button" 
            @click="filterStatus = 'active'">
            <i class="bi bi-play-circle me-1"></i> Đang diễn ra
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            :class="{ active: filterStatus === 'upcoming' }"
            type="button" 
            @click="filterStatus = 'upcoming'">
            <i class="bi bi-calendar-event me-1"></i> Sắp diễn ra
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            :class="{ active: filterStatus === 'finished' }"
            type="button" 
            @click="filterStatus = 'finished'">
            <i class="bi bi-archive me-1"></i> Đã kết thúc
          </button>
        </li>
      </ul>

      <div class="mb-4 d-flex flex-wrap justify-content-center gap-3" data-aos="fade-up" data-aos-delay="150">
        <select class="form-select w-auto w-sm-100" v-model="filterContestId">
          <option value="">Tất cả ({{ contestsForDropdown.length }})</option>
          <option v-for="c in contestsForDropdown" :key="c._id" :value="c._id">{{ c.tenCuocThi }}</option>
        </select>
        <select class="form-select w-auto w-sm-100" v-model="filterCategoryId" :disabled="!filterContestId">
          <option value="">Tất cả hạng mục</option>
          <option v-for="cat in filteredCategoriesDropdown" :key="cat._id" :value="cat._id">
            {{ cat.tenHangMuc }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-2">Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="filteredContests.length === 0" class="alert alert-info text-center">
        Hiện không có cuộc thi nào {{ filterStatus === 'active' ? 'đang diễn ra' : (filterStatus === 'upcoming' ? 'sắp diễn ra' : 'đã kết thúc') }}.
      </div>

      <div v-else class="row g-4">
        <div class="col-12 col-sm-6 col-lg-4" v-for="contest in filteredContests" :key="contest._id" data-aos="fade-up">
          
          <div class="card card-contest h-100 shadow-sm border-0">
            
            <div class="card-img-top-wrapper">
              <img :src="contest.imageUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop'" 
                   alt="Contest Image" class="card-img-top">
              <span :class="['badge', getStatusInfo(contest).badgeClass, 'position-absolute', 'top-0', 'start-0', 'm-3']">
                {{ getStatusInfo(contest).text }}
              </span>
            </div>
            
            <div class="card-body d-flex flex-column">
              <h5 class="fw-bold text-primary card-title-hover">{{ contest.tenCuocThi }}</h5>
              <p class="text-muted mb-2 small">
                <i class="bi bi-calendar-event me-1"></i>
                {{ formatDate(contest.ngayBatDau) }} - {{ formatDate(contest.ngayKetThuc) }}
              </p>
              <p class="small text-secondary flex-grow-1">{{ contest.moTa || 'Không có mô tả.' }}</p>
              
              <div class="d-flex flex-wrap gap-2 mt-3">
                <router-link :to="`/contest/${contest._id}/vote`" class="btn btn-primary flex-grow-1">
                  <i class="bi bi-hand-thumbs-up-fill me-1"></i> Bình chọn
                </router-link>
                <button class="btn btn-outline-secondary flex-grow-1" @click="openRankingModal(contest)">
                  <i class="bi bi-bar-chart-line me-1"></i> Xếp hạng
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axiosClient from '@/api/axiosClient'
import Swal from 'sweetalert2'
import Chart from 'chart.js/auto'
import { useAuthStore } from '@/store/auth'
// Bỏ comment nếu bạn dùng bootstrap JS
// import * as bootstrap from 'bootstrap' 

const authStore = useAuthStore()

let modal = null
let rankingModal = null
let rankingChart = null

// -------------------- STATE --------------------
const allContests = ref([]) // Đã đổi tên
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

const filterStatus = ref('active') // State mới cho Tabs
const searchKeyword = ref('')


// -------------------- CẬP NHẬT CHART --------------------
const renderRankingChart = () => {
  if (!rankings.value.length || !document.getElementById('rankingChart')) return

  const ctx = document.getElementById('rankingChart').getContext('2d')
  if (rankingChart) rankingChart.destroy()

  const sortedRankings = [...rankings.value].sort((a, b) => a.voteCount - b.voteCount)

  rankingChart = new Chart(ctx, {
    type: 'bar',
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
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.raw} lượt`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: 'Số lượt bình chọn' }
        },
        y: {
          ticks: { autoSkip: false }
        }
      }
    }
  })
}

watch(rankings, () => {
  const modalEl = document.getElementById('rankingModal')
  if (modalEl && modalEl.classList.contains('show')) {
    setTimeout(renderRankingChart, 0)
  }
})

// -------------------- FETCH DANH SÁCH CUỘC THI --------------------
onMounted(async () => {
  try {
    const res = await axiosClient.get('/api/contest')
    allContests.value = res.data // Lấy tất cả
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
  searchKeyword.value = '' // Reset ô tìm kiếm

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
          // TODO: Thêm c.imageUrl từ API
          return { ...c, imageUrl: c.imageUrl, microlink: null, voted, voteCount }
        })
      )
      candidates.value[cat._id] = candList
    }

    Swal.close()
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

// -------------------- MỞ MODAL: BẢNG XẾP HẠNG --------------------
const openRankingModal = async (contest) => {
  Swal.fire({
    title: 'Đang tải bảng xếp hạng...',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading()
  })

  try {
    selectedContest.value = contest
    categories.value = [] // Sẽ fetch lại
    selectedCategoryId.value = ''
    rankings.value = []

    const catRes = await axiosClient.get(`/api/category?contestId=${contest._id}`)
    categories.value = catRes.data
    await fetchRanking() // Tải ranking 'all'

    Swal.close()
    showRankingModal()
  } catch (err) {
    console.error(err)
    Swal.fire('Lỗi', 'Không thể tải bảng xếp hạng.', 'error')
  }
}

// Watch khi đổi hạng mục (trong modal ranking)
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

// Computed: rankingsWithRank
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
  Swal.fire({
    title: "Đang tải thông tin...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const { data } = await axiosClient.get(`/api/microlink?url=${encodeURIComponent(cand.url)}`);
    cand.microlink = data;
    Swal.close();
    
    // Bỏ qua Swal.fire hiển thị preview vì bố cục modal đã thay đổi
    // Giờ đây microlink sẽ tự hiển thị bên phải

  } catch (err) {
    Swal.close();
    console.error("Microlink fetch error:", err);
    Swal.fire("Lỗi", "Không thể tải preview cho liên kết này.", "error");
  }
};

// -------------------- HIỂN THỊ MODAL --------------------
const showVoteModal = () => {
  const modalEl = document.getElementById('voteModal')
  // Cần import bootstrap
  // if (!modal) modal = new bootstrap.Modal(modalEl)
  // modal.show()
  // Tạm thời dùng:
  new (window.bootstrap.Modal)(modalEl).show();
}

const showRankingModal = () => {
  const modalEl = document.getElementById('rankingModal')
  if (rankingChart) {
    rankingChart.destroy()
    rankingChart = null
  }
  // Cần import bootstrap
  // if (!rankingModal) rankingModal = new bootstrap.Modal(modalEl)
  // rankingModal.show()
  // Tạm thời dùng:
  new (window.bootstrap.Modal)(modalEl).show();
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

// -------------------- HỖ TRỢ --------------------
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN')

const getStatusInfo = (contest) => {
  const now = new Date()
  const startDate = new Date(contest.ngayBatDau)
  const endDate = new Date(contest.ngayKetThuc)

  if (endDate <= now || contest.status === 2) {
    return { text: 'Đã kết thúc', badgeClass: 'bg-secondary' }
  }
  if (startDate > now || contest.status === 0) {
    return { text: 'Sắp diễn ra', badgeClass: 'bg-info' }
  }
  return { text: 'Đang diễn ra', badgeClass: 'bg-success' }
}

// -------------------- COMPUTED --------------------
const filteredContests = computed(() => {
  let contestsToFilter = []
  const now = new Date()

  // 1. Lọc theo Tab (Trạng thái)
  if (filterStatus.value === 'active') {
    contestsToFilter = allContests.value.filter(
      c => c.status === 1 && new Date(c.ngayKetThuc) > now
    );
  } else if (filterStatus.value === 'upcoming') {
    contestsToFilter = allContests.value.filter(
      c => (c.status === 0 || new Date(c.ngayBatDau) > now) && new Date(c.ngayKetThuc) > now
    );
  } else { // 'finished'
    contestsToFilter = allContests.value.filter(
      c => c.status === 2 || new Date(c.ngayKetThuc) <= now
    );
  }

  // 2. Lọc theo Dropdown "Tất cả cuộc thi" (nếu có chọn)
  if (filterContestId.value) {
    contestsToFilter = contestsToFilter.filter(c => c._id === filterContestId.value);
  }
  
  // TODO: Thêm logic lọc theo hạng mục nếu cần

  return contestsToFilter;
})

const contestsForDropdown = computed(() => {
    if (filterStatus.value === 'active') {
    return allContests.value.filter(c => getStatusInfo(c).text === 'Đang diễn ra');
  }
  if (filterStatus.value === 'upcoming') {
    return allContests.value.filter(c => getStatusInfo(c).text === 'Sắp diễn ra');
  }
  if (filterStatus.value === 'finished') {
    return allContests.value.filter(c => getStatusInfo(c).text === 'Đã kết thúc');
  }
  return [];
});

const filteredCategories = computed(() => {
  // Lọc category cho modal vote
  if (!filterCategoryId.value) return categories.value
  return categories.value.filter(cat => cat._id === filterCategoryId.value)
})

const filteredCategoriesDropdown = computed(() => categories.value) // Dùng cho dropdown bộ lọc

// -------------------- TÌM KIẾM ỨNG VIÊN --------------------
const filteredCandidatesByCat = (catId) => {
  const list = candidates.value[catId] || []
  if (!searchKeyword.value.trim()) return list
  const kw = searchKeyword.value.toLowerCase()
  return list.filter(c => c.hoTen.toLowerCase().includes(kw))
}

</script>

<style scoped>
/* === STYLE CHO TABS === */
.nav-pills .nav-link {
  font-weight: 500;
  transition: all 0.2s ease;
  color: var(--bs-dark);
  border-bottom: 3px solid transparent;
  border-radius: 0.5rem 0.5rem 0 0;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.nav-pills .nav-link:hover {
  background-color: var(--bs-light);
}
.nav-pills .nav-link.active {
  background-color: var(--bs-primary);
  color: white;
  border-bottom-color: var(--bs-primary);
}

/* === STYLE CHO CARD CUỘC THI === */
.card-contest {
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef;
}
.card-contest:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15) !important;
}
.card-title-hover {
  transition: color 0.3s ease;
}
.card-contest:hover .card-title-hover {
  color: var(--bs-primary-dark) !important;
}
.card-img-top-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
}
.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.card-contest:hover .card-img-top {
  transform: scale(1.05);
}

/* === STYLE CHO MODAL BÌNH CHỌN === */
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

/* === STYLE MODAL XẾP HẠNG === */
.ranking-list-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}
.ranking-list-container .d-flex {
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.ranking-list-container .d-flex:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}
@media (max-width: 991px) {
  .ranking-list-container {
    max-height: 300px;
  }
  .chart-container {
    height: 300px !important;
  }
}
@media (max-width: 576px) {
  .candidate-avatar {
    width: 50px;
    height: 50px;
  }
  h3 { font-size: 1.5rem; }
  h5 { font-size: 1.1rem; }
  h6 { font-size: 1rem; }
  p, .small { font-size: 0.9rem; }
}
</style>