<template>
    <section class="how-it-works-section bg-light py-5 mt-5">
        <div class="container">
            <div class="row justify-content-center mb-4">
                <div class="col-md-8 text-center" data-aos="fade-up">
                    <h2 class="fw-bold display-5">Bắt đầu trong 3 bước</h2>
                    <p class="lead text-muted">
                        Quy trình minh bạch, đơn giản để đảm bảo lá phiếu của bạn được
                        ghi nhận an toàn trên Blockchain.
                    </p>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
                    <div class="card text-center p-4 h-100 border-0 shadow-sm feature-card">
                        <i class="bi bi-wallet2 display-3 text-primary mx-auto mb-3"></i>
                        <h4 class="fw-semibold mb-2">1. Đăng nhập & kết nối</h4>
                        <p class="text-muted">
                            Đăng nhập tài khoản Google hoặc đăng ký tài khoản mới để xác thực
                            danh tính của bạn.
                        </p>
                    </div>
                </div>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
                    <div class="card text-center p-4 h-100 border-0 shadow-sm feature-card">
                        <i class="bi bi-check2-circle display-3 text-primary mx-auto mb-3"></i>
                        <h4 class="fw-semibold mb-2">2. Chọn & bình chọn</h4>
                        <p class="text-muted">
                            Khám phá các cuộc thi, chọn ứng viên bạn tin tưởng và thực
                            hiện bỏ phiếu.
                        </p>
                    </div>
                </div>
                <div class="col-md-4" data-aos="fade-up" data-aos-delay="300">
                    <div class="card text-center p-4 h-100 border-0 shadow-sm feature-card">
                        <i class="bi bi-shield-check display-3 text-primary mx-auto mb-3"></i>
                        <h4 class="fw-semibold mb-2">3. Xác thực & ghi nhận</h4>
                        <p class="text-muted">
                            Lá phiếu của bạn được ghi lại vĩnh viễn trên Blockchain, đảm bảo
                            kết quả không thể bị thay đổi.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.feature-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}
</style>