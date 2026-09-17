import { parseAbi } from 'viem';

export const WEIXIANG_NFT_ABI = parseAbi([
  // Read functions
  'function priceInUSDT() view returns (uint256)',
  'function maxSupply() view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function paused() view returns (bool)',

  // Write functions (Purchasing)
  'function buyNFT()',
  
  // Admin Write functions
  'function airdrop(address to)',
  'function setPrice(uint256 _newPriceInUSDT)',
  'function setMaxSupply(uint256 _newMaxSupply)',
  'function pause()',
  'function unpause()',
  
  // Events
  'event NFTPurchased(address indexed buyer, uint256 tokenId, uint256 price)',
  'event PriceUpdated(uint256 newPrice)',
  'event MaxSupplyUpdated(uint256 newMaxSupply)',
  'event NFTAirdropped(address indexed recipient, uint256 tokenId)'
]);

export const USDT_ABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)'
]);

// ⚠️ We will fill this in after deploying the contract
export const WEIXIANG_NFT_ADDRESS = '0xCf65BCcf7b6880d8e212D2a50f0bee66896bDa6A'; // Deployed to Polygon Mainnet
// USDT Address on Polygon Mainnet
export const POLYGON_USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'; 
// USDT Address on Polygon Amoy Testnet (Mock)
export const AMOY_USDT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace if using testnet
