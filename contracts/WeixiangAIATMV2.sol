// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract WeixiangAIATMV2 is Initializable, ERC1155Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    
    // 名稱與縮寫
    string public name;
    string public symbol;

    // 定義憑證的 Token ID
    uint256 public constant SERVICE_PASS = 1;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) initializer public {
        __ERC1155_init("https://api.weixiang.com/nft/{id}");
        __Ownable_init(initialOwner);
        name = "Weixiang AI-ATM";
        symbol = "WAIA";
    }

    // 保留原有的套餐功能 (1單位=3張)
    function mintPackage(address account, uint256 packages) public onlyOwner {
        uint256 amountToMint = packages * 3;
        _mint(account, SERVICE_PASS, amountToMint, "");
    }

    // [V2 新增功能] 允許 Web2 後端自由指定要發放「幾張」憑證
    function mintCustomVouchers(address account, uint256 amount) public onlyOwner {
        _mint(account, SERVICE_PASS, amount, "");
    }

    // 核銷服務
    function redeemService(address account) public {
        require(account == _msgSender() || owner() == _msgSender(), "Not authorized to redeem");
        _burn(account, SERVICE_PASS, 1);
    }

    // UUPS 權限控制
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
