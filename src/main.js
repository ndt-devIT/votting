import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


import 'aos/dist/aos.css'; // <-- Thêm dòng này
import AOS from 'aos';       // <-- Thêm dòng này

// Custom styles
import "./assets/css/style.css";
import "animate.css";

const app = createApp(App);

app.use(createPinia());

app.use(router);
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine); // hoặc loadFull nếu muốn nhiều hiệu ứng hơn
  },
});
app.mount("#app");

AOS.init({
  // <-- Thêm khối này
  duration: 800, // Thời gian hiệu ứng (ms)
  easing: "ease-in-out", // Kiểu hiệu ứng
  once: true, // Chỉ chạy hiệu ứng 1 lần
  offset: 100, // Chạy hiệu ứng khi cuộn qua 100px
});
