// src/store/loadingStore.js
import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    // Dùng bộ đếm để xử lý nhiều request cùng lúc
    loadingCount: 0,
  }),
  getters: {
    /**
     * Trạng thái loading
     * @returns {boolean} True nếu có ít nhất 1 request đang chạy
     */
    isLoading: (state) => state.loadingCount > 0,
  },
  actions: {
    /**
     * Kích hoạt loading (tăng bộ đếm)
     */
    show() {
      this.loadingCount++;
    },
    /**
     * Tắt loading (giảm bộ đếm)
     */
    hide() {
      if (this.loadingCount > 0) {
        this.loadingCount--;
      }
    },
  },
});
