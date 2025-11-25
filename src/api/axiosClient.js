import axios from "axios";
// 1. Import store quản lý loading
import { useLoadingStore } from "@/store/loadingStore";

// const axiosClient = axios.create({
//   baseURL: "https://magenta-lokum-c708c2.netlify.app",
// });

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
});

// 2. SỬA: Request Interceptor (Chạy TRƯỚC KHI gửi request)
axiosClient.interceptors.request.use(
  (config) => {
    // Luôn gọi store bên trong hàm
    const loadingStore = useLoadingStore();
    loadingStore.show(); // <-- THÊM: Bật loading

    // ✅ Giữ nguyên logic: Tự gắn token từ localStorage
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    // Xử lý lỗi nếu request không gửi đi được
    const loadingStore = useLoadingStore();
    loadingStore.hide(); // <-- THÊM: Tắt loading
    return Promise.reject(error);
  }
);

// 3. THÊM MỚI: Response Interceptor (Chạy SAU KHI có kết quả)
axiosClient.interceptors.response.use(
  (response) => {
    // Xử lý khi request thành công
    const loadingStore = useLoadingStore();
    loadingStore.hide(); // <-- THÊM: Tắt loading
    return response;
  },
  (error) => {
    // Xử lý khi request thất bại
    const loadingStore = useLoadingStore();
    loadingStore.hide(); // <-- THÊM: Tắt loading
    return Promise.reject(error);
  }
);

export default axiosClient;
