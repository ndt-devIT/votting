<template>
  <div class="container py-4">
    <h3>Bình chọn cho: {{ contest?.tenCuocThi }}</h3>
    <div class="row">
      <div v-for="u in ungViens" :key="u._id" class="col-md-3 mb-3">
        <div class="card text-center p-2 shadow-sm">
          <img :src="u.anhDaiDien || '/src/assets/img/placeholder.jpg'" class="card-img-top" />
          <h5>{{ u.tenUngVien }}</h5>
          <button @click="vote(u._id)" class="btn btn-sm btn-success">Bình chọn</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import axiosClient from '../api/axiosClient';

const route = useRoute();
const contest = ref(null);
const ungViens = ref([]);

onMounted(async () => {
  const res = await axiosClient.get(`/contest/${route.params.id}`);
  contest.value = res.data;
  const u = await axiosClient.get(`/candidate?contestId=${route.params.id}`);
  ungViens.value = u.data;
});

async function vote(candidateId) {
  try {
    await axiosClient.post('/vote', { candidateId, contestId: contest.value._id });
    Swal.fire('✅ Thành công', 'Bình chọn thành công!', 'success');
  } catch {
    Swal.fire('❌ Lỗi', 'Bạn đã bình chọn hoặc chưa đăng nhập!', 'error');
  }
}
</script>
