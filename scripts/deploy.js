const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🚀 開始部署 Weixiang AI-ATM 智能合約...");

  const [deployer] = await ethers.getSigners();
  console.log("👤 部署者錢包地址:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 部署者錢包餘額:", ethers.formatEther(balance), "MATIC");

  const WeixiangAIATM = await ethers.getContractFactory("WeixiangAIATM");
  
  // 部署 UUPS 代理合約
  console.log("⏳ 正在將合約寫入 Polygon Amoy 測試鏈，請稍候 (約需 15~30 秒)...");
  const aiAtm = await upgrades.deployProxy(WeixiangAIATM, [deployer.address], { kind: 'uups' });
  
  await aiAtm.waitForDeployment();
  const address = await aiAtm.getAddress();

  console.log("====================================================");
  console.log("🎉 恭喜！WeixiangAIATM 成功發布！");
  console.log("📜 您的專屬智能合約地址為:", address);
  console.log("====================================================");
}

main().catch((error) => {
  console.error("❌ 部署失敗:", error);
  process.exitCode = 1;
});
