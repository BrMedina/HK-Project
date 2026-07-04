// Parses GCash / QR PH payment QR codes, which follow the EMVCo TLV
// (tag-length-value) format: each field is a 2-digit tag, 2-digit length,
// then that many characters of value.
export function parseEMVQR(payload) {
  const fields = {};
  let i = 0;
  while (i < payload.length - 4) {
    const tag = payload.substr(i, 2);
    const len = parseInt(payload.substr(i + 2, 2), 10);
    if (Number.isNaN(len)) break;
    const value = payload.substr(i + 4, len);
    fields[tag] = value;
    i += 4 + len;
  }

  return {
    merchantName: fields["59"] || null,
    merchantCity: fields["60"] || null,
    countryCode: fields["58"] || null,
    raw: fields,
  };
}
