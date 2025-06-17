export const vatFileTranslations = {
  en: {
    stats: {
      totalTransactions: "Total Transactions",
      totalAmount: "Total Amount",
      inputTurnover: "Input Turnover",
      outputTurnover: "Output Turnover",
      topTypeShare: "Top Type Share",
      mostCommonType: "Most Common Type",
      vatFileNumbers: "VAT File Numbers",
      amountDue: "Amount Due",
      noData: "N/A"
    },
    distribution: {
      title: "VAT File Number Distribution",
      description: "Breakdown of all VAT file numbers found in your data",
      transactions: "transactions",
      average: "Avg"
    },
    detailedStats: {
      title: "Detailed Statistics",
      description: "Complete breakdown with sample data for each VAT File Number",
      name: "Name",
      count: "Count",
      percentage: "Percentage",
      totalAmount: "Total Amount",
      avgVatRate: "Avg. VAT %",
      transactions: "Transactions",
      showTransactions: "Show transactions",
      hideTransactions: "Hide transactions",
      transactionFields: {
        recordType: "Record Type",
        vatFileNumber: "VAT File Number",
        invoiceDate: "Invoice Date",
        referenceNumber: "Reference Number",
        vatAmountInInvoice: "VAT Amount",
        invoiceAmount: "Invoice Amount",
        futureDataField: "Future Data",
        taxRate: "Tax Rate",
        vatPeriod: "VAT Period",
        referenceGroup: "Reference Group",
        cancelOrCreditSign: "Cancel/Credit Sign",
        transactionType: "Transaction Type",
        debitCredit: "Debit/Credit"
      }
    },
    redFlags: {
      title: "Red Flags",
      description: "Potential issues that require attention",
      noFlags: "No red flags found",
      transactionDetails: {
        recordType: "Record Type",
        taxRate: "Tax Rate",
        date: "Date",
        referenceNumber: "Reference #",
        transactionsFound: "transactions found"
      },
      inputTaxAnomaly: {
        title: "Input Tax Concentration",
        description: "High concentration of input tax in top transactions",
        highRisk: "High Risk"
      },
      outputTaxAnomaly: {
        title: "Output Tax Anomalies",
        description: "Suspicious patterns in output tax transactions",
        invalidTaxRate: "Invalid Tax Rate"
      }
    },
    vatFile: {
      itemName: "VAT File Numbers"
    },
    pagination: {
      showing: "Showing",
      to: "to",
      of: "of",
      page: "Page",
      previous: "Previous",
      next: "Next",
    }
  },
  he: {
    stats: {
      totalTransactions: "סה\"כ עסקאות",
      totalAmount: "סה\"כ סכום",
      inputTurnover: "מחזור תשומות",
      outputTurnover: "מחזור עסקאות",
      topTypeShare: "נתח סוג עליון",
      mostCommonType: "סוג נפוץ ביותר",
      vatFileNumbers: "מספרי תיק מע\"מ",
      amountDue: "סכום לתשלום",
      noData: "אין נתונים"
    },
    distribution: {
      title: "התפלגות מספרי תיק מע\"מ",
      description: "פירוט כל מספרי תיק מע\"מ שנמצאו בנתונים",
      transactions: "עסקאות",
      average: "ממוצע"
    },
    detailedStats: {
      title: "סטטיסטיקה מפורטת",
      description: "פירוט מלא עם נתונים לדוגמה עבור כל מספר תיק מע\"מ",
      name: "שם",
      count: "כמות",
      percentage: "אחוז",
      totalAmount: "סה\"כ סכום",
      avgVatRate: "אחוז מע\"מ ממוצע",
      transactions: "עסקאות",
      showTransactions: "הצג עסקאות",
      hideTransactions: "הסתר עסקאות",
      transactionFields: {
        recordType: "סוג רשומה",
        vatFileNumber: "מספר תיק מע\"מ",
        invoiceDate: "תאריך חשבונית",
        referenceNumber: "מספר אסמכתא",
        vatAmountInInvoice: "סכום מע\"מ",
        invoiceAmount: "סכום חשבונית",
        futureDataField: "נתונים עתידיים",
        taxRate: "שיעור מס",
        vatPeriod: "תקופת מע\"מ",
        referenceGroup: "קבוצת אסמכתא",
        cancelOrCreditSign: "סימון ביטול/זיכוי",
        transactionType: "סוג עסקה",
        debitCredit: "חובה/זכות"
      }
    },
    redFlags: {
      title: "דגלים אדומים",
      description: "בעיות פוטנציאליות הדורשות תשומת לב",
      noFlags: "לא נמצאו דגלים אדומים",
      transactionDetails: {
        recordType: "סוג רשומה",
        taxRate: "שיעור מס",
        date: "תאריך",
        referenceNumber: "מספר אסמכתא",
        transactionsFound: "עסקאות נמצאו"
      },
      inputTaxAnomaly: {
        title: "ריכוז מע\"מ תשומות",
        description: "ריכוז גבוה של מע\"מ תשומות בעסקאות המובילות",
        highRisk: "סיכון גבוה"
      },
      outputTaxAnomaly: {
        title: "חריגות מע\"מ עסקאות",
        description: "דפוסים חשודים בעסקאות מע\"מ עסקאות",
        invalidTaxRate: "שיעור מע\"מ לא תקין"
      }
    },
    pagination: {
      showing: "מציג",
      to: "עד",
      of: "מתוך",
      page: "עמוד",
      previous: "הקודם",
      next: "הבא",
    }
  }
}