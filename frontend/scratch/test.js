const { parseReceiptText } = require('../src/scanner/receiptParser');

const testCases = [
  {
    name: "GCash Sent Receipt",
    text: `G
GCash
Sent to BRENT MEDINA
09171234567
Amount: PHP 150.00
Ref No. 9012345678901
Date: 04 Jul 2026, 10:15 PM`
  },
  {
    name: "Physical Receipt HKD",
    text: `STARBUCKS COFFEE
Welcome to Starbucks TST
12 Nathan Road, HK
TEL: 2376 1234
1x Caffe Latte   $45.00
1x Croissant     $28.00
TOTAL: HK$73.00
PAID CASH: $100.00
CHANGE: $27.00
Date: 2026-07-04 15:30:12`
  },
  {
    name: "GCash Express Send Screenshot",
    text: `Express Send
You have sent PHP 500.00 of GCash to
JUAN DELA CRUZ
09181234567
Ref. No. 5183748291023
04/07/2026 09:12 AM`
  }
];

testCases.forEach(tc => {
  console.log(`=== Test: ${tc.name} ===`);
  const result = parseReceiptText(tc.text);
  console.log("Parsed Amount:", result.amount);
  console.log("Parsed Merchant:", result.merchantName);
  console.log("Parsed Ref:", result.referenceNumber);
  console.log("Parsed Date:", result.date);
  console.log("========================\n");
});
