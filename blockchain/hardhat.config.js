import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

// Chỉ dẫn cho dotenv tìm file .env ở thư mục gốc (bên ngoài thư mục /blockchain)
dotenv.config({ path: "../.env" });

/** @type import('hardhat/config').HardhatUserConfig */

const PROVIDER_URL = process.env.PROVIDER_URL;
const SERVER_WALLET_PRIVATE_KEY = process.env.SERVER_WALLET_PRIVATE_KEY;

if (!PROVIDER_URL || !SERVER_WALLET_PRIVATE_KEY) {
  console.warn(
    "Thiếu PROVIDER_URL hoặc SERVER_WALLET_PRIVATE_KEY trong file .env"
  );
  console.warn("Bạn sẽ không thể deploy hoặc tương tác với mạng live.");
}

export default {
  solidity: "0.8.9",
  networks: {
    // Cấu hình cho mạng testnet Sepolia
    sepolia: {
      url: PROVIDER_URL || "", // Đảm bảo PROVIDER_URL trỏ đến Sepolia
      accounts: SERVER_WALLET_PRIVATE_KEY ? [SERVER_WALLET_PRIVATE_KEY] : [],
    },
    // Bạn có thể thêm các mạng khác nếu cần
    // mumbai: {
    //   url: PROVIDER_URL_CHO_MUMBAI,
    //   accounts: [SERVER_WALLET_PRIVATE_KEY],
    // }
  },
  // (Tùy chọn) Thêm cấu hình Etherscan để verify contract
  etherscan: {
    // Thay đổi apiKey nếu cần
    apiKey: process.env.ETHERSCAN_API_KEY, // API Key cho Etherscan (Ethereum)
  },
};
