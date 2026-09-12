const { ethers, upgrades } = require("hardhat");

async function main() {
  const PROXY_ADDRESS = "0xC050840133Ba82e6738d66707aCB9b0E7042893F";
  console.log("🚀 開始無痛升級合約，加入單張售賣彈性功能...");

  const WeixiangAIATMV2 = await ethers.getContractFactory("WeixiangAIATMV2");
  
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, WeixiangAIATMV2);
  await upgraded.waitForDeployment();

  console.log("====================================================");
  console.log("🎉 合約 V2 升級成功！原客戶資產不受影響，合約地址維持不變:", await upgraded.getAddress());
  console.log("✅ 現在 Web2 後台可以自由決定要賣 1 枚或是賣 3 枚套餐了！");
  console.log("====================================================");
}

main().catch((error) => {
  console.error("❌ 升級失敗:", error);
  process.exitCode = 1;
});
