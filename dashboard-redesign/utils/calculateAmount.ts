export const parseAmount = (amountStr: string | number): number => {
  if (typeof amountStr === 'number') return amountStr;
  
  // Remove commas and convert to string
  const cleanStr = amountStr.replace(/,/g, '');
  
  // Check if the string starts with a minus sign
  const isNegative = cleanStr.trim().startsWith('-');
  
  // Remove the minus sign for parsing
  const absValue = parseFloat(cleanStr.replace(/^-/, ''));
  
  return isNegative ? -absValue : absValue;
}