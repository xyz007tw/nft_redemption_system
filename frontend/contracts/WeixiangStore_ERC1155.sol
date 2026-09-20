// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Minimal ERC20 interface for USDT transfers
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract WeixiangStore is ERC1155, Ownable {
    using Strings for uint256;

    IERC20 public usdtToken;
    bool public isSaleActive = true;

    // 定義「套餐」結構 (百貨公司商品架)
    struct Package {
        uint256 tokenId;        // 要發放的商品 ID (例如 1 代表 AI 流量憑證, 2 代表 YT 影分身)
        uint256 quantity;       // 該套餐包含的數量
        uint256 priceInUSDT;    // 該套餐的總售價 (包含 6 位小數，例如 99000000 代表 99 USDT)
        bool isActive;          // 是否開放購買
    }

    // packageId => Package 內容
    mapping(uint256 => Package) public packages;

    // Token ID 的總發行量紀錄
    mapping(uint256 => uint256) public totalSupply;
    
    // 每個 Token ID 單獨的最大發行量 (可選，0 代表無上限)
    mapping(uint256 => uint256) public maxSupply;

    event PackagePurchased(address indexed buyer, uint256 packageId, uint256 tokenId, uint256 quantity, uint256 cost);

    constructor(address _usdtAddress) ERC1155("https://api.weixiang.com/metadata/{id}.json") Ownable(msg.sender) {
        usdtToken = IERC20(_usdtAddress);

        // --- 初始化白皮書定義的 5 大眾籌套餐 (預設發放 Token ID 1) ---
        // 注意：Polygon 上的 USDT 有 6 位小數，所以 99 USD = 99 * 10^6
        
        // 1. 體驗創始包: 1 枚 $99
        packages[1] = Package({ tokenId: 1, quantity: 1, priceInUSDT: 99 * 10**6, isActive: true });
        
        // 2. 輕量增長包: 3 枚 $198
        packages[2] = Package({ tokenId: 1, quantity: 3, priceInUSDT: 198 * 10**6, isActive: true });
        
        // 3. 商隊矩陣包: 30 枚 $1788
        packages[3] = Package({ tokenId: 1, quantity: 30, priceInUSDT: 1788 * 10**6, isActive: true });
        
        // 4. 超級節點包: 108 枚 $5400
        packages[4] = Package({ tokenId: 1, quantity: 108, priceInUSDT: 5400 * 10**6, isActive: true });
        
        // 5. 創世財團包: 360 枚 $12000
        packages[5] = Package({ tokenId: 1, quantity: 360, priceInUSDT: 12000 * 10**6, isActive: true });
    }

    // --- 核心購買邏輯 ---
    function buyPackage(uint256 packageId) external {
        require(isSaleActive, "Store is closed");
        
        Package memory pkg = packages[packageId];
        require(pkg.isActive, "Package is not active");
        require(pkg.quantity > 0, "Invalid package configuration");
        
        // 檢查是否超過該商品的發行上限 (若 maxSupply > 0 才檢查)
        if (maxSupply[pkg.tokenId] > 0) {
            require(totalSupply[pkg.tokenId] + pkg.quantity <= maxSupply[pkg.tokenId], "Exceeds max supply");
        }

        // 轉移 USDT (買家必須先在 USDT 合約呼叫 approve 授權)
        bool success = usdtToken.transferFrom(msg.sender, owner(), pkg.priceInUSDT);
        require(success, "USDT transfer failed");

        // 鑄造憑證給買家
        _mint(msg.sender, pkg.tokenId, pkg.quantity, "");
        
        // 更新發行量
        totalSupply[pkg.tokenId] += pkg.quantity;

        emit PackagePurchased(msg.sender, packageId, pkg.tokenId, pkg.quantity, pkg.priceInUSDT);
    }

    // --- 管理員專屬功能 (上架新商品與套餐) ---
    
    // 設定或修改套餐內容 (未來若有 YT影分身，可以在這裡新增 packageId = 6)
    function setPackage(uint256 packageId, uint256 tokenId, uint256 quantity, uint256 priceInUSDT, bool isActive) external onlyOwner {
        packages[packageId] = Package(tokenId, quantity, priceInUSDT, isActive);
    }

    // 設定某個商品的發行上限
    function setMaxSupply(uint256 tokenId, uint256 _maxSupply) external onlyOwner {
        maxSupply[tokenId] = _maxSupply;
    }

    // 暫停/重啟 整個百貨公司
    function toggleSaleState() external onlyOwner {
        isSaleActive = !isSaleActive;
    }

    // 更改 USDT 地址 (以備不時之需)
    function setUSDTAddress(address _newAddress) external onlyOwner {
        usdtToken = IERC20(_newAddress);
    }

    // 更改 Metadata URL (指向商品圖片與描述)
    function setURI(string memory newuri) external onlyOwner {
        _setURI(newuri);
    }
}
