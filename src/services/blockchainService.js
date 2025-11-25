console.log("--- KHỞI ĐỘNG BLOCKCHAIN SERVICE ---");
const { ethers } = require("ethers");
require("dotenv").config();

// --- 1. CẤU HÌNH MÔI TRƯỜNG ---
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PROVIDER_URL = process.env.PROVIDER_URL;
const SERVER_WALLET_PRIVATE_KEY = process.env.SERVER_WALLET_PRIVATE_KEY;

// --- 2. ABI (Application Binary Interface) ---
// Đây là bản đồ để JS hiểu cách nói chuyện với Smart Contract mới
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_durationInSeconds",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "mongoId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ungVienId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalVotesForCandidate",
        type: "uint256",
      },
    ],
    name: "VoteRecorded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "VotingPeriodUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allVotes",
    outputs: [
      {
        internalType: "string",
        name: "mongoId",
        type: "string",
      },
      {
        internalType: "string",
        name: "nguoiDungId",
        type: "string",
      },
      {
        internalType: "string",
        name: "ungVienId",
        type: "string",
      },
      {
        internalType: "string",
        name: "hangMucId",
        type: "string",
      },
      {
        internalType: "string",
        name: "cuocThiId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "candidateVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_ungVienId",
        type: "string",
      },
    ],
    name: "getVotesForCandidate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "mongoIdExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_mongoId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_nguoiDungId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_ungVienId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_hangMucId",
        type: "string",
      },
      {
        internalType: "string",
        name: "_cuocThiId",
        type: "string",
      },
    ],
    name: "recordVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newStart",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_newEnd",
        type: "uint256",
      },
    ],
    name: "setVotingPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "votingEnd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Biến Singleton để giữ kết nối
let contractInstance;
let signerInstance;

/**
 * Khởi tạo kết nối Blockchain (Chỉ chạy 1 lần)
 */
function getBlockchainInstances() {
  if (contractInstance) {
    return { contract: contractInstance, signer: signerInstance };
  }

  // Kiểm tra biến môi trường
  if (!PROVIDER_URL || !SERVER_WALLET_PRIVATE_KEY || !CONTRACT_ADDRESS) {
    console.error("❌ [Blockchain] THIẾU BIẾN MÔI TRƯỜNG! Kiểm tra file .env");
    throw new Error("Missing blockchain environment variables");
  }

  try {
    // Kết nối Provider (Mạng blockchain)
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

    // Tạo Ví (Signer) - Người ký giao dịch
    const signer = new ethers.Wallet(SERVER_WALLET_PRIVATE_KEY, provider);
    signerInstance = signer;

    // Tạo Contract Instance
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    contractInstance = contract;

    console.log("✅ [Blockchain] Kết nối thành công.");
    console.log("   -> Ví Server:", signer.address);
    console.log("   -> Contract:", CONTRACT_ADDRESS);

    return { contract, signer };
  } catch (error) {
    console.error("❌ [Blockchain] Lỗi kết nối:", error.message);
    throw error;
  }
}

/**
 * 1. Ghi phiếu bầu lên Blockchain
 * @returns {string | null} Transaction Hash hoặc null nếu lỗi
 */
async function recordVoteOnChain(
  mongoId,
  nguoiDungId,
  ungVienId,
  hangMucId,
  cuocThiId
) {
  try {
    const { contract } = getBlockchainInstances();

    console.log(`⏳ [Blockchain] Đang chuẩn bị ghi phiếu: ${mongoId}`);

    // Gọi hàm Smart Contract
    // Lưu ý: Mọi tham số đều chuyển về string để khớp với Solidity
    const tx = await contract.recordVote(
      mongoId.toString(),
      nguoiDungId.toString(),
      ungVienId.toString(),
      hangMucId.toString(),
      cuocThiId.toString()
    );

    console.log(`🚀 [Blockchain] Transaction sent: ${tx.hash}`);

    // Trả về Hash ngay lập tức (Pending), không chờ xác nhận để tối ưu tốc độ API
    return tx.hash;
  } catch (error) {
    if (error.reason) {
      console.error(`⚠️ [Blockchain] Smart Contract từ chối: ${error.reason}`);
    } else if (error.message.includes("Vote already recorded")) {
      console.warn(`⚠️ [Blockchain] Phiếu ${mongoId} đã tồn tại trên chain.`);
    } else {
      console.error(`❌ [Blockchain] Lỗi hệ thống:`, error.message);
    }
    return null;
  }
}

/**
 * 2. Lấy tổng số phiếu của 1 ứng viên từ Blockchain
 * Dùng để hiển thị công khai minh bạch
 */
async function getCandidateVotesFromChain(ungVienId) {
  try {
    const { contract } = getBlockchainInstances();

    // Gọi hàm view (miễn phí gas)
    // Sử dụng hàm 'candidateVotes' (mapping public) hoặc 'getVotesForCandidate'
    const countBigInt = await contract.candidateVotes(ungVienId.toString());

    // Chuyển BigInt của Ethers v6 sang Number
    return Number(countBigInt);
  } catch (error) {
    console.error(
      `❌ [Blockchain] Lỗi lấy số phiếu cho ${ungVienId}:`,
      error.message
    );
    return 0;
  }
}

/**
 * 3. Chức năng ĐỐI SOÁT (AUDIT)
 * So sánh dữ liệu MongoDB (Web2) và Blockchain (Web3)
 * @param {Array} candidatesListFromMongo - Danh sách ứng viên từ DB
 */
async function auditElection(candidatesListFromMongo) {
  const report = [];
  const { contract } = getBlockchainInstances();

  console.log("🔍 --- BẮT ĐẦU ĐỐI SOÁT DỮ LIỆU (AUDIT) ---");

  for (const candidate of candidatesListFromMongo) {
    try {
      // Lấy số liệu từ DB (Giả sử bạn đã count trong controller trước khi truyền vào)
      // Hoặc nếu object candidate chưa có voteCount, mặc định là 0 để demo
      const dbCount = candidate.voteCount || 0;

      // Lấy số liệu từ Blockchain
      const chainCountBigInt = await contract.candidateVotes(
        candidate._id.toString()
      );
      const chainCount = Number(chainCountBigInt);

      // So sánh
      const isMatch = dbCount === chainCount;
      const status = isMatch ? "✅ KHỚP" : "❌ LỆCH";

      report.push({
        ungVienId: candidate._id,
        hoTen: candidate.hoTen,
        dbCount: dbCount,
        chainCount: chainCount,
        status: status,
      });

      console.log(
        `   > ${candidate.hoTen}: DB(${dbCount}) vs Chain(${chainCount}) -> ${status}`
      );
    } catch (err) {
      console.error(`   > Lỗi khi audit ${candidate.hoTen}:`, err.message);
      report.push({
        hoTen: candidate.hoTen,
        status: "⚠️ LỖI KẾT NỐI CHAIN",
      });
    }
  }

  console.log("🏁 --- KẾT THÚC ĐỐI SOÁT ---");
  return report;
}

module.exports = {
  getBlockchainInstances,
  recordVoteOnChain,
  getCandidateVotesFromChain,
  auditElection,
};
