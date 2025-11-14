<template>
  <div id="app-wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Topbar -->
    <Topbar />

    <!-- Main Content -->
    <main id="content">
      <router-view />
    </main>

    <!-- Example modal -->
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
import Topbar from "@/components/Topbar.vue";
</script>

<style scoped>
/* Wrapper */
#app-wrapper {
  min-height: 100vh;
  background-color: #f8f9fc;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  z-index: 1040;
  /* thấp hơn modal-backdrop */
  transition: width 0.3s ease;
  background: linear-gradient(180deg, #0d6efd 0%, #0b5ed7 100%);
}

/* Sidebar collapsed */
body.sidebar-collapsed .sidebar {
  width: 80px;
}

/* Topbar */
.topbar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1030;
  /* thấp hơn modal */
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

/* Main content */
#content {
  margin-left: 240px;
  margin-top: 56px;
  transition: margin-left 0.3s ease;
}

/* Sidebar collapsed effect */
body.sidebar-collapsed #content {
  margin-left: 80px;
}

/* Modal z-index */
.modal {
  z-index: 1055 !important;
  /* luôn trên topbar + sidebar */
}

.modal-backdrop {
  z-index: 1050 !important;
  /* che cả sidebar + topbar */
}

/* Mobile: sidebar overlay */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1030;
  }

  body.sidebar-collapsed .sidebar {
    transform: translateX(0);
  }

  #content {
    margin-left: 0;
  }

  body.sidebar-collapsed::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1025;
  }
}
</style>
