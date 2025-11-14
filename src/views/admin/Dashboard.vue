<template>
  <div class="container-fluid">
    <h1 class="h3 mb-4 fw-bold text-primary">Bảng điều khiển</h1>

    <!-- Thống kê -->
    <div class="row g-3">
      <div class="col-md-2" v-for="card in stats" :key="card.title">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h6 class="text-muted text-uppercase mb-1">{{ card.title }}</h6>
            <h4 class="fw-bold">{{ card.value }}</h4>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/api/axiosClient";

const stats = ref([
  { title: "Người dùng", value: 0 },
  { title: "Cuộc thi", value: 0 },
  { title: "Hạng mục", value: 0 },
  { title: "Sự kiện", value: 0 },
  { title: "Bình chọn", value: 0 },
]);

onMounted(async () => {
  try {
    // 1️⃣ Lấy số người dùng active
    const usersRes = await axios.get("/api/nguoidung");
    if (Array.isArray(usersRes.data.data)) {
      stats.value[0].value = usersRes.data.data.filter(u => u.status === 1).length;
    }

    // 2️⃣ Lấy số cuộc thi
    const contestsRes = await axios.get("/api/contest");
    if (Array.isArray(contestsRes.data)) {
      stats.value[1].value = contestsRes.data.length;
    }

    // 3️⃣ Lấy số hạng mục
    const categoriesRes = await axios.get("/api/category");
    if (Array.isArray(categoriesRes.data)) {
      stats.value[2].value = categoriesRes.data.length;
    }

    // 4️⃣ Lấy số sự kiện (ứng viên)
    const candidatesRes = await axios.get("/api/candidate");
    if (Array.isArray(candidatesRes.data)) {
      stats.value[3].value = candidatesRes.data.length;
    }

    // 5️⃣ Lấy số phiếu bình chọn
    const votesRes = await axios.get("/api/vote");
    if (Array.isArray(votesRes.data)) {
      stats.value[4].value = votesRes.data.length;
    }

  } catch (err) {
    console.error("Lỗi khi tải dữ liệu thống kê:", err);
  }
});
</script>
