// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract WeixiangNFT is ERC721Enumerable, Ownable, Pausable {
    uint256 private _nextTokenId;
    
    IERC20 public usdtToken;
    uint256 public priceInUSDT;
    uint256 public maxSupply;
    string private _baseTokenURI;

    // Events for tracking admin actions and purchases
    event PriceUpdated(uint256 newPrice);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event NFTPurchased(address indexed buyer, uint256 tokenId, uint256 price);
    event NFTAirdropped(address indexed recipient, uint256 tokenId);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor(
        address initialOwner,
        address _usdtAddress,
        uint256 _initialPriceInUSDT,
        uint256 _maxSupply,
        string memory initialBaseURI
    ) ERC721("Weixiang VIP Pass", "WXVIP") Ownable(initialOwner) {
        usdtToken = IERC20(_usdtAddress);
        priceInUSDT = _initialPriceInUSDT; // Note: USDT has 6 decimals, so 990 USDT = 990 * 10^6
        maxSupply = _maxSupply;
        _baseTokenURI = initialBaseURI;
        _nextTokenId = 1; // Start token ID at 1
    }

    // --- Core Purchasing Logic ---

    function buyNFT() external whenNotPaused {
        require(_nextTokenId <= maxSupply, "Sold out! Max supply reached.");
        require(priceInUSDT > 0, "Price not set");
        
        // Transfer USDT from buyer to the contract owner
        // Buyer MUST have called `approve` on the USDT contract first
        require(
            usdtToken.transferFrom(msg.sender, owner(), priceInUSDT),
            "USDT transfer failed"
        );

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        emit NFTPurchased(msg.sender, tokenId, priceInUSDT);
    }

    // --- Admin Functions ---

    function airdrop(address to) external onlyOwner {
        require(_nextTokenId <= maxSupply, "Sold out! Max supply reached.");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        emit NFTAirdropped(to, tokenId);
    }

    function setPrice(uint256 _newPriceInUSDT) external onlyOwner {
        priceInUSDT = _newPriceInUSDT;
        emit PriceUpdated(_newPriceInUSDT);
    }

    function setMaxSupply(uint256 _newMaxSupply) external onlyOwner {
        require(_newMaxSupply >= totalSupply(), "Cannot set max supply below current supply");
        maxSupply = _newMaxSupply;
        emit MaxSupplyUpdated(_newMaxSupply);
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Allow owner to rescue mistakenly sent ERC20 tokens
    function withdrawTokens(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        token.transfer(owner(), balance);
    }

    // --- Internal Overrides ---

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
