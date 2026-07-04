// Extracts amount, reference number, and date from OCR'd receipt/screenshot text.
// This is best-effort pattern matching — always show the result to the user
// for confirmation before saving, since OCR + regex won't be 100% reliable.
export function parseReceiptText(text) {
  const amountMatch = text.match(/(?:₱|PHP)\s?([\d,]+\.\d{2})/i);
  const refMatch = text.match(/ref(?:erence)?\.?\s?(?:no\.?)?[:\s]*([A-Z0-9]{6,})/i);
  const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/);

  return {
    amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null,
    referenceNumber: refMatch ? refMatch[1] : null,
    date: dateMatch ? dateMatch[1] : null,
    rawText: text,
  };
}
