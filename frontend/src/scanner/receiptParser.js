/**
 * Parses OCR'd text from a receipt or GCash screenshot to extract:
 * - Amount (PHP or HKD)
 * - Merchant Name / Note
 * - Reference Number
 * - Date
 */
export function parseReceiptText(text) {
  if (!text) {
    return {
      amount: null,
      merchantName: null,
      note: null,
      referenceNumber: null,
      date: null,
      rawText: "",
    };
  }

  // Split into trimmed, non-empty lines
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  const cleanText = lines.join("\n");

  // 1. EXTRACT AMOUNT
  let amount = null;

  // Pattern A: Look for keywords like "total", "amount", "paid", "due", "net" followed by currency and/or numbers
  // E.g. "TOTAL: HK$73.00", "Amount Paid: PHP 150.00", "TOTAL AMOUNT 125.00"
  const totalKeywordsRegex = /(?:total|amount|paid|due|net|cash|sum)(?:\s*(?:amount|paid|due|net|cash|sum))?[\s.:#$]*([A-Z$¢£¤¥₱]*)?[\s]*([\d,]+\.\d{2})/i;
  
  // Search line by line for total keywords first (more robust than global search)
  for (const line of lines) {
    const match = line.match(totalKeywordsRegex);
    if (match) {
      amount = parseFloat(match[2].replace(/,/g, ""));
      break;
    }
  }

  // Pattern B: If no keyword match on line level, check the entire clean text with the same regex
  if (amount === null) {
    const match = cleanText.match(totalKeywordsRegex);
    if (match) {
      amount = parseFloat(match[2].replace(/,/g, ""));
    }
  }

  // Pattern C: Look for any currency symbol (₱, PHP, HKD, HK$, $) followed by digits
  if (amount === null) {
    const currencyAmountRegex = /(?:₱|PHP|HKD|HK\$|\$)\s*([\d,]+\.\d{2})/i;
    const currencyMatch = cleanText.match(currencyAmountRegex);
    if (currencyMatch) {
      amount = parseFloat(currencyMatch[1].replace(/,/g, ""));
    }
  }

  // Pattern D: Fallback to the largest decimal number found in the text
  if (amount === null) {
    const allDecimalsRegex = /\b([\d,]+\.\d{2})\b/g;
    let match;
    let maxVal = -1;
    while ((match = allDecimalsRegex.exec(cleanText)) !== null) {
      const val = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(val) && val > maxVal && val < 1000000) { // skip huge numbers (like ref codes)
        maxVal = val;
      }
    }
    if (maxVal > 0) {
      amount = maxVal;
    }
  }

  // 2. EXTRACT MERCHANT NAME / NOTE
  let merchantName = null;

  // Pattern A: Check for GCash receipt transfer patterns on a single-line level
  // "Sent to MERCHANT NAME", "Paid to MERCHANT NAME", "To: MERCHANT NAME"
  // Using [^\n] to prevent matching across multiple lines.
  const gcashMerchantRegex = /(?:sent\s+to|paid\s+to|transfer\s+to|to:?)\s+([A-Za-z0-9 \t.,'#&-]{3,35})/i;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const gcashMatch = line.match(gcashMerchantRegex);
    if (gcashMatch) {
      const candidate = gcashMatch[1].trim();
      if (!/^(gcash|number|amount|reference|date|payment|account|bank)/i.test(candidate)) {
        merchantName = candidate;
        break;
      }
    }

    // Lookahead for next line if current line ends with "to" or "sent to"
    if (/(?:sent|paid|transfer|send|to)\s+.*?\s+to$/i.test(line) && i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      if (!/^(gcash|number|amount|reference|date|payment|account|bank)/i.test(nextLine) && nextLine.length > 2 && nextLine.length < 35) {
        merchantName = nextLine;
        break;
      }
    }
  }

  // Pattern B: For standard physical receipts, the first few lines contain the Store Name.
  if (!merchantName && lines.length > 0) {
    for (let i = 0; i < Math.min(lines.length, 4); i++) {
      const line = lines[i];
      // Skip lines containing typical metadata
      if (
        /\d{4}-\d{2}-\d{2}/.test(line) || // date
        /\d{2}\/\d{2}\/\d{2,4}/.test(line) || // date
        /\btel\b|\bphone\b|[\d-]{7,15}/i.test(line) || // phone
        /www\.|http|\.com|\.org/i.test(line) || // web
        /receipt|invoice|tax/i.test(line) || // doc type
        /welcome|thank/i.test(line) || // greetings
        line.length < 3 ||
        line.length > 35
      ) {
        continue;
      }
      merchantName = line;
      break;
    }
  }

  // 3. EXTRACT REFERENCE NUMBER
  let referenceNumber = null;
  const refLabelRegex = /(?:ref|reference|auth|trans|tx|txn|receipt)(?:\s*(?:no|num|number|id))?[\s.:#]*([A-Z0-9-]{6,20})/i;
  const refLabelMatch = cleanText.match(refLabelRegex);
  if (refLabelMatch) {
    referenceNumber = refLabelMatch[1].trim();
  } else {
    // Standalone 13-digit sequence (GCash specific)
    const gcashRefRegex = /\b(\d{13})\b/;
    const gcashRefMatch = cleanText.match(gcashRefRegex);
    if (gcashRefMatch) {
      referenceNumber = gcashRefMatch[1];
    }
  }

  // 4. EXTRACT DATE
  let date = null;
  const numericDateRegex = /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/;
  const numericDateMatch = cleanText.match(numericDateRegex);
  if (numericDateMatch) {
    date = numericDateMatch[1];
  } else {
    const wordDateRegex = /\b(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{2,4})\b/i;
    const wordDateMatch = cleanText.match(wordDateRegex);
    if (wordDateMatch) {
      date = wordDateMatch[1];
    }
  }

  return {
    amount,
    merchantName,
    note: merchantName,
    referenceNumber,
    date,
    rawText: text,
  };
}
