<template>
  <div class="text-center mt-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Đang xử lý...</span>
    </div>
    <p class="mt-3">Đang đăng nhập qua Google...</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// 🟢 Khi Google redirect về, lấy token + user trên URL
const token = route.query.token;
const encodedUser = route.query.user;

if (token && encodedUser) {
  const user = JSON.parse(decodeURIComponent(encodedUser));

  // Lưu vào Pinia + localStorage
  auth.user = user;
  auth.token = token;
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);

  // Cập nhật header mặc định cho axios
  auth.$patch(() => {
    auth.user = user;
    auth.token = token;
  });

  // ✅ Chuyển hướng sang trang chủ
  router.push("/");
} else {
  router.push("/login");
}
</script>
