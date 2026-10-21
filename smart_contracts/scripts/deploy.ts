import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Amoy Testnet Mock USDT address (or any ERC20 token you want to use for testing)
  // Since we don't have a mock USDT deployed yet, let's deploy a Mock USDT first!
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();
  const usdtAddress = await mockUSDT.getAddress();
  console.log("Mock USDT deployed to:", usdtAddress);

  // Mint some mock USDT to deployer
  await mockUSDT.mint(deployer.address, ethers.parseUnits("1000000", 6));
  console.log("Minted 1,000,000 Mock USDT to deployer");

  const initialPriceInUSDT = ethers.parseUnits("990", 6); // 990 USDT
  const maxSupply = 10000;
  const initialBaseURI = "https://weixiang.com/api/nft/";

  const WeixiangNFT = await ethers.getContractFactory("WeixiangNFT");
  const weixiangNFT = await WeixiangNFT.deploy(
    deployer.address,
    usdtAddress,
    initialPriceInUSDT,
    maxSupply,
    initialBaseURI
  );

  await weixiangNFT.waitForDeployment();

  const nftAddress = await weixiangNFT.getAddress();
  console.log("WeixiangNFT deployed to:", nftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
