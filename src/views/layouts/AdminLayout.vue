<template>
  <div id="app-wrapper">
    
    <Sidebar />

    <div class="main-panel">
      
      <div class="sticky-top">
        <Navbar />
      </div>

      <main id="content">
        <div class="container-fluid p-4">
          <router-view />
        </div>
      </main>

      </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal Title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Nội dung modal...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary">Lưu</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
// import Topbar from "@/components/Topbar.vue"; // Nếu bạn dùng Topbar thay vì Navbar thì đổi lại nhé
</script>

<style scoped>
/* === CẤU TRÚC LAYOUT === */

#app-wrapper {
  min-height: 100vh;
  background-color: #f8f9fc;
  overflow-x: hidden; /* Ẩn thanh cuộn ngang thừa */
}

/* Định nghĩa lại Sidebar để khớp với layout này */
/* (Style này chỉ mang tính chất override nếu bên trong component Sidebar chưa set) */
:deep(.sidebar) {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px; /* Kích thước chuẩn sidebar */
  height: 100vh;
  z-index: 1040;
  /* background được set trong component Sidebar rồi */
}

/* === MAIN PANEL (VÙNG BÊN PHẢI) === */
.main-panel {
  /* Chừa khoảng trống bên trái bằng đúng chiều rộng Sidebar */
  margin-left: 250px; 
  
  /* Flex column để đẩy Footer xuống đáy nếu cần */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  transition: margin-left 0.3s ease;
}

/* === NAVBAR (STICKY) === */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1020; /* Cao hơn content nhưng thấp hơn Modal/Sidebar */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

/* === CONTENT === */
#content {
  flex-grow: 1; /* Chiếm hết khoảng trống còn lại */
  /* Không cần margin-top nữa vì Navbar đã chiếm chỗ trong dòng chảy (flow) */
}

/* === MOBILE RESPONSIVE (< 992px) === */
@media (max-width: 992px) {
  /* Trên mobile, Sidebar thường ẩn đi */
  :deep(.sidebar) {
    left: -250px; /* Ẩn sang trái */
  }

  /* Main panel bung ra toàn màn hình */
  .main-panel {
    margin-left: 0;
  }
}

/* === Z-INDEX MODAL (Để không bị che) === */
.modal {
  z-index: 1060 !important;
}
.modal-backdrop {
  z-index: 1050 !important;
}
</style>