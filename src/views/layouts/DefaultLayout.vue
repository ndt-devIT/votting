<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />
  
    <HeroSlider v-if="route.path === '/'" />

    <main class="container flex-grow-1">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import HeroSlider from "@/components/HeroSlider.vue";
import Footer from "@/components/Footer.vue";

const route = useRoute();
</script>
