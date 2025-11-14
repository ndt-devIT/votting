<template>
  <div class="col-md-4 mb-3">
    <div class="card shadow-sm">
      <img :src="contest.banner || '/src/assets/img/placeholder.jpg'" class="card-img-top" alt="contest" />
      <div class="card-body">
        <h5 class="card-title">{{ contest.tenCuocThi }}</h5>
        <p class="card-text">{{ contest.moTa }}</p>
        <router-link :to="`/contest/${contest._id}/vote`" class="btn btn-outline-primary w-100">
          Bình chọn
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  contest: Object,
});
</script>
