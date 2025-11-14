<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  const fixModalPadding = () => {
    document.body.style.paddingRight = '0';
  };
  window.addEventListener('hidden.bs.modal', fixModalPadding);
  onUnmounted(() => window.removeEventListener('hidden.bs.modal', fixModalPadding));
});
</script>

<style scoped>
/* main.css hoặc style global */
.modal {
  z-index: 1150 !important;
  /* cao hơn header 1100 */
}

.modal-backdrop {
  z-index: 1140 !important;
  /* backdrop dưới modal */
}

body.modal-open {
  overflow: hidden !important;
  padding-right: 0 !important;
}

.swal2-shown {
  padding-right: 0 !important;
}

.main-header {
  margin-right: 0 !important;
}
</style>
