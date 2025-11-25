import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("--- BẮT ĐẦU DEPLOY ---");
  console.log("Tài khoản deploy:", deployer.address);

  // 1. Lấy ContractFactory
  const VotingLedger = await hre.ethers.getContractFactory("VotingLedger");

  // 2. Cấu hình tham số cho Constructor
  // Lấy thời gian hiện tại (tính bằng giây)
  const startTime = Math.floor(Date.now() / 1000);

  // Thời lượng cuộc thi: Ví dụ 30 ngày (30 * 24 giờ * 60 phút * 60 giây)
  // Bạn có thể chỉnh số này nhỏ lại nếu muốn test hết giờ
  const duration = 30 * 24 * 60 * 60;

  console.log(
    `Cấu hình: Bắt đầu lúc ${new Date(startTime * 1000).toLocaleString()}`
  );
  console.log(`Thời lượng: ${duration} giây (~30 ngày)`);

  // 3. Gửi yêu cầu deploy KÈM THAM SỐ
  // 🔥 QUAN TRỌNG: Truyền startTime và duration vào đây
  const contract = await VotingLedger.deploy(startTime, duration);

  console.log("Đang chờ xác nhận trên mạng...");

  // 4. Chờ cho đến khi contract được deploy thành công
  await contract.waitForDeployment();

  // 5. In kết quả
  console.log("✅ VotingLedger đã deploy thành công!");
  console.log("👉 ĐỊA CHỈ CONTRACT:", contract.target);
  console.log("------------------------------------------------");
  console.log("⚠️  BƯỚC TIẾP THEO:");
  console.log("1. Copy địa chỉ trên vào file .env (biến CONTRACT_ADDRESS)");
  console.log(
    "2. Copy file ABI từ /artifacts/.../VotingLedger.json vào blockchainService.js"
  );
}

// Xử lý lỗi
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
