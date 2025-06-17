// lib/pcnParser.ts

export function parsePcnFile(pcnText: string) {
  const lines = pcnText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length < 2) {
    throw new Error("PCN file must contain at least a header and footer");
  }

  const header = lines[0];

  const footerIndex = lines.findIndex(line => line.startsWith('X'));
  if (footerIndex === -1) {
    throw new Error("No footer line found starting with 'X'");
  }

  const footer = lines[footerIndex];
  const transactions = lines.slice(1, footerIndex).map(parseTransaction);

  return { header, transactions, footer };
}

export function parseHeader(headerLine: string) {
  let index = 0;
  const slice = (length: number) => {
    const part = headerLine.slice(index, index + length);
    index += length;
    return part;
  };

  return {
    constantStart: slice(1),
    companyId: slice(9),
    reportDate: slice(6),
    constantOne: slice(1),
    fileCreationDate: slice(8),
    totalTaxableAmount: slice(1) + slice(11),
    vatOnTaxable: slice(1) + slice(9),
    otherRateDealsAmount: slice(1) + slice(11),
    otherRateVat: slice(1) + slice(9),
    totalTransactionRecords: slice(9),
    vatExemptAmount: slice(1) + slice(11),
    otherInputVat: slice(1) + slice(9),
    equipmentInputVat: slice(1) + slice(9),
    otherAndEquipmentRecordCount: slice(9),
    totalAmountToPay: slice(1) + slice(11),
  };
}

function parseTransaction(transactionLine: string) {
  let index = 0;
  const sliceRaw = (length: number) => {
    const part = transactionLine.slice(index, index + length);
    index += length;
    return part;
  };

  const recordType = sliceRaw(1);
  const vatFileNumber = sliceRaw(9);
  const invoiceDate = sliceRaw(8);
  const referenceGroup = sliceRaw(4);
  const referenceNumber = sliceRaw(9);
  const vatAmountInInvoiceRaw = sliceRaw(9);
  const cancelOrCreditSign = sliceRaw(1);
  const invoiceAmountRaw = sliceRaw(10);
  const futureDataField = sliceRaw(9);

  const invoiceAmountStr = (cancelOrCreditSign === '+' || cancelOrCreditSign === '-')
    ? cancelOrCreditSign + invoiceAmountRaw
    : invoiceAmountRaw;

  const invoiceAmountNum = parseFloat(invoiceAmountStr) / 100;
  const vatAmountNum = parseFloat(vatAmountInInvoiceRaw) / 100;

  let taxRate: string | null = null;
  if (invoiceAmountNum !== 0) {
    taxRate = ((vatAmountNum / invoiceAmountNum) * 100).toFixed(2) + '%';
  }

  return {
    recordType,
    vatFileNumber,
    invoiceDate,
    referenceGroup,
    referenceNumber,
    vatAmountInInvoice: vatAmountInInvoiceRaw,
    cancelOrCreditSign,
    invoiceAmount: invoiceAmountStr,
    futureDataField,
    taxRate: taxRate ?? 'N/A',
  };
}
