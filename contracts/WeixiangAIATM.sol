// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract WeixiangAIATM is Initializable, ERC1155Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    
    // 名稱與縮寫 (提供給區塊鏈瀏覽器與前端識別)
    string public name;
    string public symbol;

    // 定義憑證的 Token ID
    uint256 public constant SERVICE_PASS = 1;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) initializer public {
        // 預留動態 Metadata 的 API 網址 (後續可在 Cloudflare 上架設)
        __ERC1155_init("https://api.weixiang.com/nft/{id}");
        __Ownable_init(initialOwner);

        name = "Weixiang AI-ATM";
        symbol = "WAIA";
    }

    /**
     * @dev 購買套餐：當客戶購買 1 組方案時，自動發放 3 枚兌換券
     * 只有 Owner (系統後端) 能夠觸發此功能，確保金流正確才發放
     */
    function mintPackage(address account, uint256 packages) public onlyOwner {
        uint256 amountToMint = packages * 3;
        _mint(account, SERVICE_PASS, amountToMint, "");
    }

    /**
     * @dev 核銷服務：每次核銷銷毀 1 枚憑證
     * 允許客戶親自核銷，或由 Owner (系統後端的 Gasless 代付機器人) 代為核銷
     */
    function redeemService(address account) public {
        require(account == _msgSender() || owner() == _msgSender(), "Not authorized to redeem");
        _burn(account, SERVICE_PASS, 1);
    }

    // UUPS 可升級合約必須實作的權限控制 (確保只有 Owner 能升級合約)
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
