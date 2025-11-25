<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
    <HeroSlider v-if="route.path === '/'" />

    <main class="flex-grow-1">
      <div class="container">
        <router-view />
      </div>
    </main>
    <div v-if="route.path === '/'" class="homepage-sections">
      <HowItWorks />
      <NewsSection />
      <CallToAction />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import HeroSlider from "@/components/HeroSlider.vue";
import Footer from "@/components/Footer.vue";

// === BỔ SUNG IMPORTS ===
import HowItWorks from '@/components/HowItWorks.vue'
import NewsSection from '@/components/NewsSection.vue'
import CallToAction from '@/components/CallToAction.vue'

const route = useRoute();
</script>

<style scoped>
/* Chúng ta bọc <router-view> trong một container 
  để các component mới có thể dùng nền full-width (ví dụ: bg-light) 
  mà không bị giới hạn bởi container của <main>.
*/
.homepage-sections {
  /* Class này chỉ để nhóm lại, không cần style cụ thể */
  width: 100%;
}
</style>