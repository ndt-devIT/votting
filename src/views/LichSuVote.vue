<template>
    <div class="container-fluid mt-4">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">

                <h4 class="mb-0 fw-bold text-primary">
                    <i class="bi bi-clock-history me-2"></i>
                    Lịch sử bình chọn
                </h4>

                <router-link to="/" class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-house me-1"></i>
                    Về Trang chủ
                </router-link>

            </div>

            <div class="card-body">
                <div v-if="isLoading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>#</th>
                                <th>Cuộc thi</th>
                                <th>Ngày bình chọn</th>
                                <th>Chi tiết phiếu bầu</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="votes.length === 0">
                                <td colspan="6" class="text-center text-muted py-4">
                                    Bạn chưa có lịch sử bình chọn nào.
                                </td>
                            </tr>

                            <tr v-for="(vote, index) in votes" :key="vote._id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ vote.cuocThi.tenCuocThi }}</td>
                                <td>{{ formatDate(vote.ngayBinhChon) }}</td>
                                <td>
                                    <router-link :to="`/xac-nhan/${vote.blockchainTxHash}`" class="hash-link"
                                        title="Xem chi tiết phiếu bầu">
                                        <i class="bi bi-receipt me-1"></i>
                                        {{ shortenHash(vote.blockchainTxHash) }}
                                    </router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/api/axiosClient';

const votes = ref([]);
const isLoading = ref(true);

/**
 * Lấy lịch sử vote từ API
 */
const fetchHistory = async () => {
    try {
        isLoading.value = true;
        // Sử dụng endpoint bạn đã cung cấp
        const res = await axios.get('/api/vote/blockchain/me');
        votes.value = res.data;
    } catch (err) {
        console.error("Lỗi khi tải lịch sử bình chọn:", err);
        // Bạn có thể thêm thông báo lỗi cho người dùng ở đây
    } finally {
        isLoading.value = false;
    }
};

/**
 * Định dạng ngày giờ sang kiểu VN
 */
const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Rút gọn chuỗi hash (ví dụ: 0x1c05...6320)
 */
const shortenHash = (hash) => {
    if (!hash) return 'Chưa có hash';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
};

/**
 * Tạo link đến Block Explorer
 * LƯU Ý: Hãy thay đổi URL này cho đúng với mạng của bạn (ví dụ: Etherscan, BSCScan, ...)
 */
const getBlockExplorerUrl = (hash) => {
    // Đây là ví dụ cho mạng Sepolia (mạng thử nghiệm của Ethereum)
    return `https://sepolia.etherscan.io/tx/${hash}`;
};

// Tải dữ liệu khi component được mount
onMounted(() => {
    fetchHistory();
});
</script>

<style scoped>
.table td,
.table th {
    vertical-align: middle;
}

/* Tùy chỉnh link hash cho dễ đọc */
.hash-link {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
    text-decoration: none;
    font-weight: 500;
}

.hash-link:hover {
    text-decoration: underline;
    color: #0056b3;
}
</style>