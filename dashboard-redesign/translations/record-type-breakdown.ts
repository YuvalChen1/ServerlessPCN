export const recordTypeTranslations = {
  en: {
    stats: {
      totalTransactions: "Total Transactions",
      totalAmount: "Total Amount",
      amountDue: "Amount Due",
      vatFileNumbers: "VAT File Numbers",
      inputTurnover: "Input Turnover",
      outputTurnover: "Output Turnover",
      topTypeShare: "Top Type Share",
      mostCommonType: "Most Common Type",
      mostCommonVatFile: "Most Common VAT File",
      topVatFileShare: "Top VAT File Share",
      noData: "N/A"
    },
    distribution: {
      title: "Record Type Distribution",
      description: "Breakdown of all record types found in your data",
      transactions: "transactions",
      average: "Avg"
    },
    detailedStats: {
      title: "Detailed Statistics",
      description: "Complete breakdown with sample data for each Record Type",
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
      unidentified: {
        title: "Unidentified Customers Anomalies",
        description: "Transactions exceeding ₪5,000 with unidentified customers",
        highRisk: "High Risk"
      },
      standardRatedSales: {
        title: "Standard Rated Sales Tax Anomalies",
        description: "Transactions with tax rates outside 18% (±0.05%)",
        invalidTaxRate: "Invalid Tax Rate"
      },
      domesticPurchases: {
        title: "Domestic Purchases Tax Anomalies",
        description: "Transactions with tax rates outside 18% (±0.05%)",
        invalidTaxRate: "Invalid Tax Rate (18% ±0.05%)"
      },
      inputTaxAnomaly: {
        title: "Input Tax Anomalies",
        description: "Suspicious input tax transactions"
      },
      outputTaxAnomaly: {
        title: "Output Tax Anomalies",
        description: "Suspicious output tax transactions"
      }
    },
    recordTypes: {
      'S': 'Standard Rated Sales',
      'L': 'Unidentified Customers',
      'M': 'Reverse Charge Sales',
      'Y': 'Zero‑Rated Exports',
      'I': 'P.A Sales',
      'T': 'Domestic Purchases',
      'C': 'Self‑Charge Purchases',
      'K': 'Petty Cash',
      'R': 'Import Declarations',
      'P': 'P.A Purchases',
      'H': 'Other'
    }
  },
  he: {
    stats: {
      totalTransactions: "סה\"כ עסקאות",
      totalAmount: "סה\"כ סכום",
      amountDue: "סכום לתשלום",
      vatFileNumbers: "מספרי תיק מע\"מ",
      inputTurnover: "מחזור תשומות",
      outputTurnover: "מחזור עסקאות",
      topTypeShare: "נתח סוג עליון",
      mostCommonType: "סוג נפוץ ביותר",
      mostCommonVatFile: "תיק מע\"מ נפוץ",
      topVatFileShare: "נתח תיק מע\"מ עליון",
      noData: "אין נתונים"
    },
    distribution: {
      title: "התפלגות סוגי רשומות",
      description: "פירוט כל סוגי הרשומות שנמצאו בנתונים",
      transactions: "עסקאות",
      average: "ממוצע"
    },
    detailedStats: {
      title: "סטטיסטיקה מפורטת",
      description: "פירוט מלא עם נתונים לדוגמה עבור כל סוג רשומה",
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
      unidentified: {
        title: "חריגות לקוחות לא מזוהים",
        description: "עסקאות מעל ₪5,000 עם לקוחות לא מזוהים",
        highRisk: "סיכון גבוה"
      },
      standardRatedSales: {
        title: "חריגות מע\"מ במכירות",
        description: "עסקאות עם שיעורי מס מחוץ ל-18% (±0.05%)",
        invalidTaxRate: "שיעור מע\"מ לא תקין"
      },
      domesticPurchases: {
        title: "חריגות מע\"מ ברכישות מקומיות",
        description: "עסקאות עם שיעורי מס מחוץ ל-18% (±0.05%)",
        invalidTaxRate: "שיעור מע\"מ לא תקין (18% ±0.05%)"
      },
      inputTaxAnomaly: {
        title: "חריגות מע\"מ תשומות",
        description: "עסקאות מע\"מ תשומות חשודות"
      },
      outputTaxAnomaly: {
        title: "חריגות מע\"מ עסקאות",
        description: "עסקאות מע\"מ עסקאות חשודות"
      }
    },
    recordTypes: {
      'S': 'מכירות בשיעור מלא',
      'L': 'לקוחות לא מזוהים',
      'M': 'מכירות ברירת מחדל',
      'Y': 'יצוא בשיעור אפס',
      'I': 'מכירות לרש"פ',
      'T': 'רכישות מקומיות',
      'C': 'חיוב עצמי',
      'K': 'קופה קטנה',
      'R': 'רשימוני יבוא',
      'P': 'רכישות מהרש"פ',
      'H': 'אחר'
    }
  }
}