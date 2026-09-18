import { parseAbi } from 'viem';

export const WEIXIANG_NFT_ABI = parseAbi([
  // Read
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function packages(uint256 packageId) view returns (uint256 tokenId, uint256 quantity, uint256 priceInUSDT, bool isActive)',
  'function isSaleActive() view returns (bool)',
  'function totalSupply(uint256 id) view returns (uint256)',
  
  // Write
  'function buyPackage(uint256 packageId)',
  
  // Admin Write
  'function setPackage(uint256 packageId, uint256 tokenId, uint256 quantity, uint256 priceInUSDT, bool isActive)',
  'function toggleSaleState()',
]);

export const USDT_ABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)'
]);

export const WEIXIANG_NFT_ADDRESS = '0x203082cc5c1F0ECbf077AC9120b66701b70c7EAE'; 
export const POLYGON_USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'; 
