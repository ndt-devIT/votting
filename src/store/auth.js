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
    async login(credentials) {
      try {
        const res = await axiosClient.post("/api/auth/login", credentials);

        this.user = res.data.user;
        this.token = res.data.token;

        // Lưu lại
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);

        // Cập nhật token header
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${this.token}`;
        return res.data;
      } catch (err) {
        console.error("❌ Login error:", err.response?.data || err.message);
        throw err.response?.data || { message: "Đăng nhập thất bại" };
      }
    },

    // 🔹 Thêm hàm register
    async register(name, email, password) {
      const res = await axiosClient.post("/api/auth/register", {
        hoTen: name,
        email,
        password,
      });

      // Nếu muốn tự login ngay sau khi register, có thể lưu token:
      this.user = res.data.user;
      this.token = res.data.token;
      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('token', this.token);

      return res;
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete axiosClient.defaults.headers.common["Authorization"];
    },
  },
});
