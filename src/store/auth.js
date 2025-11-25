// src/store/auth.js
import { defineStore } from "pinia";
import axiosClient from "@/api/axiosClient";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    // (Hàm login không đổi)
    async login(credentials) {
      try {
        const res = await axiosClient.post("/api/auth/login", credentials);
        this.user = res.data.user;
        this.token = res.data.token;
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${this.token}`;
        return res.data;
      } catch (err) {
        console.error("❌ Login error:", err.response?.data || err.message);
        throw err.response?.data || { message: "Đăng nhập thất bại" };
      }
    },

    // --- ✏️ HÀM REGISTER (ĐÃ SỬA) ---
    // Giờ chỉ gửi yêu cầu, không tự động đăng nhập
    async register(name, email, password) {
      try {
        const res = await axiosClient.post("/api/auth/register", {
          hoTen: name,
          email,
          password,
        });
        // Chỉ trả về data (thường là { message: '...'} )
        return res.data;
      } catch (err) {
        console.error("❌ Register error:", err.response?.data || err.message);
        throw err.response?.data || { message: "Đăng ký thất bại" };
      }
    },

    // --- ⭐ HÀM MỚI: VERIFY OTP ---
    // Hàm này sẽ xác thực và thực hiện logic đăng nhập
    async verifyOtp(email, otp) {
      try {
        const res = await axiosClient.post("/api/auth/verify-otp", {
          email,
          otp,
        });

        // Backend trả về user + token sau khi verify thành công
        // Đây là lúc chúng ta thực hiện đăng nhập
        this.user = res.data.user;
        this.token = res.data.token;
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${this.token}`;

        return res.data;
      } catch (err) {
        console.error(
          "❌ OTP Verify error:",
          err.response?.data || err.message
        );
        throw err.response?.data || { message: "Xác thực OTP thất bại" };
      }
    },

    // (Hàm logout không đổi)
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete axiosClient.defaults.headers.common["Authorization"];
    },
  },
});
