fetch('https://nft1314.party/api/admin/packages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 6,
    name_zh: '微享知識贊助',
    name_en: 'Knowledge Sponsor',
    amount: 1,
    price: 3,
    product_type: 'SPONSOR'
  })
}).then(r => r.json()).then(console.log);
