// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title VotingLedger
 * @dev Hợp đồng lưu trữ và kiểm toán phiếu bầu từ hệ thống Web2.
 */
contract VotingLedger {
    
    // Cấu trúc dữ liệu lưu chi tiết phiếu bầu (để tra cứu minh bạch)
    struct VoteRecord {
        string mongoId;       // ID phiếu từ MongoDB
        string nguoiDungId;   // ID người dùng
        string ungVienId;     // ID ứng viên
        string hangMucId;     // ID hạng mục
        string cuocThiId;     // ID cuộc thi
        uint256 timestamp;    // Thời gian ghi nhận trên block
    }

    // --- LƯU TRỮ DỮ LIỆU ---
    
    // 1. Mảng lưu toàn bộ lịch sử phiếu (Log)
    VoteRecord[] public allVotes;

    // 2. Mapping đếm số phiếu cho từng ứng viên (QUAN TRỌNG CHO AUDIT)
    // Key: UngVienId -> Value: Số phiếu
    mapping(string => uint256) public candidateVotes;

    // 3. Mapping kiểm tra phiếu đã tồn tại chưa (Chống spam/ghi trùng)
    mapping(string => bool) public mongoIdExists;

    // --- CẤU HÌNH ---
    address public owner;           // Địa chỉ ví Server (Admin)
    uint256 public votingStart;     // Thời gian bắt đầu (Unix timestamp)
    uint256 public votingEnd;       // Thời gian kết thúc (Unix timestamp)

    // --- SỰ KIỆN (Events) ---
    event VoteRecorded(string indexed mongoId, string ungVienId, uint256 totalVotesForCandidate);
    event VotingPeriodUpdated(uint256 start, uint256 end);

    /**
     * @dev Constructor khởi tạo cuộc thi
     * @param _startTime: Thời gian bắt đầu (nếu là 0 sẽ lấy thời gian hiện tại)
     * @param _durationInSeconds: Thời gian diễn ra cuộc thi (giây)
     */
    constructor(uint256 _startTime, uint256 _durationInSeconds) {
        owner = msg.sender;
        
        if (_startTime == 0) {
            votingStart = block.timestamp;
        } else {
            votingStart = _startTime;
        }
        
        votingEnd = votingStart + _durationInSeconds;
    }

    /**
     * @dev Modifier: Chỉ chủ sở hữu (Server) mới được gọi
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    /**
     * @dev Modifier: Kiểm tra thời gian hợp lệ
     */
    modifier onlyDuringVoting() {
        require(block.timestamp >= votingStart, "Voting has not started yet");
        require(block.timestamp <= votingEnd, "Voting has ended");
        _;
    }

    /**
     * @dev Ghi nhận phiếu bầu lên Blockchain.
     * Hàm này thực hiện logic nghiệp vụ quan trọng.
     */
    function recordVote(
        string calldata _mongoId,
        string calldata _nguoiDungId,
        string calldata _ungVienId,
        string calldata _hangMucId,
        string calldata _cuocThiId
    ) public onlyOwner onlyDuringVoting {
        // 1. Kiểm tra tính duy nhất (Chống Double Spending)
        require(!mongoIdExists[_mongoId], "Vote already recorded on-chain");

        // 2. Tăng số phiếu cho ứng viên (Logic tính toán On-chain)
        candidateVotes[_ungVienId]++;

        // 3. Lưu chi tiết phiếu bầu
        VoteRecord memory newVote = VoteRecord({
            mongoId: _mongoId,
            nguoiDungId: _nguoiDungId,
            ungVienId: _ungVienId,
            hangMucId: _hangMucId,
            cuocThiId: _cuocThiId,
            timestamp: block.timestamp
        });

        allVotes.push(newVote);
        mongoIdExists[_mongoId] = true;

        // 4. Bắn sự kiện để Backend/Frontend lắng nghe
        emit VoteRecorded(_mongoId, _ungVienId, candidateVotes[_ungVienId]);
    }

    // --- CÁC HÀM VIEW (Đọc dữ liệu miễn phí) ---

    /**
     * @dev Lấy tổng số phiếu của một ứng viên cụ thể.
     * Dùng để so khớp với MongoDB.
     */
    function getVotesForCandidate(string calldata _ungVienId) public view returns (uint256) {
        return candidateVotes[_ungVienId];
    }

    /**
     * @dev Lấy tổng số phiếu toàn hệ thống.
     */
    function getTotalVotes() public view returns (uint256) {
        return allVotes.length;
    }

    // --- CÁC HÀM QUẢN TRỊ (ADMIN) ---

    /**
     * @dev Thay đổi thời gian bầu cử (đề phòng set sai hoặc muốn gia hạn demo)
     */
    function setVotingPeriod(uint256 _newStart, uint256 _newEnd) public onlyOwner {
        require(_newEnd > _newStart, "End time must be after start time");
        votingStart = _newStart;
        votingEnd = _newEnd;
        emit VotingPeriodUpdated(_newStart, _newEnd);
    }
}