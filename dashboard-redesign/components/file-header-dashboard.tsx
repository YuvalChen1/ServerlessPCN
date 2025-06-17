"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Database, Search, FileText, Calculator, TrendingUp, Receipt, DollarSign, Calendar, AlertTriangle } from "lucide-react"
import { fetchCompanyData } from '../app/api/govAPI';
import { findMissingMonths } from "@/utils/findMissingMonths"
import axios from "axios"
import Swal from 'sweetalert2'
import { useLanguage } from "@/context/language-context"
import { fileHeaderTranslations } from "@/translations/file-header-dashboard"
import TaxGraph from './tax-graph'
import { HeaderData } from "@/types/header-data"
import { formatCellValue } from "@/utils/formatCellValue"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import { validateFileDate } from "@/utils/validateFileDate"
import { validateCompanyId } from "@/utils/validateCompanyId"


interface FileHeaderDashboardProps {
  sampleHeaderData: HeaderData[];
  onUpdateHeaders?: (
    headers: HeaderData[],
    data?: {
      transactions: Record<string, any>[];
      footer: any;
    }
  ) => void;
}

interface ProcessedPCNFile {
  header: HeaderData;
  transactions: any[];
  footer: any;
}

export default function FileHeaderDashboard({ sampleHeaderData, onUpdateHeaders }: FileHeaderDashboardProps) {
  // Add language context
  const { language } = useLanguage()
  const t = fileHeaderTranslations[language]

  const [headerFilter, setHeaderFilter] = useState("")
  const [companyName, setCompanyName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Add safety check
  const headers = Array.isArray(sampleHeaderData) ? sampleHeaderData : [];

  const sortedHeaders = [...headers].sort((a, b) =>
    a.reportDate.localeCompare(b.reportDate)
  );

  useEffect(() => {
    const getCompanyData = async () => {
      if (headers[0]?.companyId) {
        const data = await fetchCompanyData(headers[0].companyId);
        if (data && data.records.length > 0) {
          setCompanyName(data.records[0]["שם חברה"]);
        }
      }
    };

    getCompanyData();
  }, [headers]);

  // Helper functions to format the data

  const formatNumber = (value: string) => {
    return Number.parseInt(value).toLocaleString()
  }

  // const formatCellValue = (value: any, key: string) => {
  //   if (key === "reportDate") return formatDate(value)
  //   if (key === "fileCreationDate") return formatDate(value)
  //   if (key.includes("Amount") || key.includes("Vat") || key.includes("Pay")) return formatCurrency(value)
  //   if (key.includes("Records") || key.includes("Count")) return formatNumber(value)
  //   return String(value)
  // }

  // Filter logic for search
  const filteredData = Object.entries(sampleHeaderData).filter(
    ([key, value]) =>
      key.toLowerCase().includes(headerFilter.toLowerCase()) ||
      String(value).toLowerCase().includes(headerFilter.toLowerCase()),
  )

  // Add these helper functions after your existing format functions
  const sumHeaderValues = (headers: HeaderData[]) => {
    return {
      totalTransactionRecords: headers.reduce((sum, header) =>
        sum + Number(header.totalTransactionRecords || 0), 0),
      totalAmountToPay: headers.reduce((sum, header) =>
        sum + Number(header.totalAmountToPay.replace(/,/g, '') || 0), 0),
      totalTaxableAmount: headers.reduce((sum, header) =>
        sum + Number(header.totalTaxableAmount.replace(/,/g, '') || 0), 0),
      vatOnTaxable: headers.reduce((sum, header) =>
        sum + Number(header.vatOnTaxable.replace(/,/g, '') || 0), 0),
      otherRateDealsAmount: headers.reduce((sum, header) =>
        sum + Number(header.otherRateDealsAmount.replace(/,/g, '') || 0), 0),
      otherRateVat: headers.reduce((sum, header) =>
        sum + Number(header.otherRateVat.replace(/,/g, '') || 0), 0),
      vatExemptAmount: headers.reduce((sum, header) =>
        sum + Number(header.vatExemptAmount.replace(/,/g, '') || 0), 0),
      otherInputVat: headers.reduce((sum, header) =>
        sum + Number(header.otherInputVat.replace(/,/g, '') || 0), 0),
      equipmentInputVat: headers.reduce((sum, header) =>
        sum + Number(header.equipmentInputVat.replace(/,/g, '') || 0), 0),
      otherAndEquipmentRecordCount: headers.reduce((sum, header) =>
        sum + Number(header.otherAndEquipmentRecordCount || 0), 0),
    }
  }

  // Add this after your existing state declarations
  const totals = sumHeaderValues(headers)

  // Add this helper function after your existing format functions
  const getDateRange = (headers: HeaderData[]) => {
    const dates = headers.map(header => ({
      reportDate: header.reportDate,
      fileCreationDate: header.fileCreationDate
    })).sort((a, b) => a.reportDate.localeCompare(b.reportDate));

    if (dates.length === 0) return { reportRange: "", fileRange: "" };

    const firstReport = formatDate(dates[0].reportDate);
    const lastReport = formatDate(dates[dates.length - 1].reportDate);
    const firstFile = formatDate(dates[0].fileCreationDate);
    const lastFile = formatDate(dates[dates.length - 1].fileCreationDate);

    return {
      reportRange: firstReport === lastReport ? firstReport : `${firstReport} - ${lastReport}`,
      fileRange: firstFile === lastFile ? firstFile : `${firstFile} - ${lastFile}`
    };
  };

  const dateRanges = getDateRange(headers);
  const missingMonths = findMissingMonths(headers);

  // Add the file handling function
  const handleFileUpload = (date: string) => {
    if (fileInputRefs.current[date]) {
      fileInputRefs.current[date]?.click();
    }
  };

  // Add a useEffect to log state changes and help debug
  useEffect(() => {
    console.log('Headers updated:', headers);
    console.log('Sample Header Data:', sampleHeaderData);
  }, [headers, sampleHeaderData]);

  // Update the handleFileProcess function
  const handleFileProcess = async (date: string, file: File) => {
    try {
      setIsUploading(prev => ({ ...prev, [date]: true }));

      // Validate file date
      const isDateValid = await validateFileDate(file, date);
      if (!isDateValid) {
        await Swal.fire({
          icon: 'error',
          title: 'Invalid File Date',
          text: `The file must match the reporting period: ${formatDate(date)}`,
          confirmButtonColor: '#3b82f6'
        });
        return;
      }

      // Validate company ID (assuming we have the first header's company ID)
      const expectedCompanyId = headers[0]?.companyId;
      if (expectedCompanyId) {
        const isCompanyValid = await validateCompanyId(file, expectedCompanyId);
        if (!isCompanyValid) {
          await Swal.fire({
            icon: 'error',
            title: t.alerts.companyMismatch.title,
            text: t.alerts.companyMismatch.text,
            confirmButtonColor: '#3b82f6'
          });
          return;
        }
      }

      // Proceed with upload if validations pass
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(prev => ({ ...prev, [date]: progress }));
        },
      });

      const processedData: ProcessedPCNFile = response.data;

      // Create new header with the correct date
      const newHeader = {
        ...processedData.header,
        reportDate: date
      };

      // Update both headers and transactions through the callback
      if (onUpdateHeaders) {
        onUpdateHeaders([...headers, newHeader], {
          transactions: processedData.transactions,
          footer: processedData.footer
        });
      }

      await Swal.fire({
        icon: 'success',
        title: t.alerts.uploadSuccess.title,
        text: t.alerts.uploadSuccess.text,
        confirmButtonColor: '#3b82f6'
      });

    } catch (error) {
      console.error('Upload failed:', error);
      Swal.fire({
        icon: 'error',
        title: t.alerts.uploadFailed.title,
        text: t.alerts.uploadFailed.text,
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setIsUploading(prev => ({ ...prev, [date]: false }));
      setUploadProgress(prev => ({ ...prev, [date]: 0 }));
    }
  };

  // Add this function after your other handler functions
  const handleFileSelect = async (date: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate the file date
      const isDateValid = await validateFileDate(file, date);
      if (!isDateValid) {
        await Swal.fire({
          icon: 'error',
          title: t.alerts.invalidDate.title,
          text: t.alerts.invalidDate.text.replace('{0}', formatDate(date)),
          confirmButtonColor: '#3b82f6'
        });
        return;
      }

      // If validation passes, process the file
      await handleFileProcess(date, file);

    } catch (error) {
      console.error('File processing error:', error);
      await Swal.fire({
        icon: 'error',
        title: t.alerts.error.title,
        text: t.alerts.error.text,
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-white border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-900">{t.metadata.title}</CardTitle>
                <CardDescription>{t.metadata.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <Input
                placeholder={t.metadata.searchPlaceholder}
                value={headerFilter}
                onChange={(e) => setHeaderFilter(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Uploaded Files Overview */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">{t.uploadedFiles.title}</CardTitle>
              <CardDescription>
                {sortedHeaders.length} {sortedHeaders.length === 1 ? t.uploadedFiles.filesProcessed : t.uploadedFiles.filesProcessedPlural}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* File cards grid - Move this before the alert */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...sortedHeaders.map(header => ({
              date: header.reportDate,
              type: 'present',
              data: header
            })), ...missingMonths.map(month => ({
              date: month,
              type: 'missing',
              data: null
            }))]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((item, index) => (
                item.type === 'present' ? (
                  // Existing month card
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-slate-600" />
                      <div className="text-sm font-medium text-slate-900">
                        {formatDate(item.data?.reportDate ?? "")}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">{t.uploadedFiles.records}:</span>
                        <span className="text-slate-900 font-medium">
                          {item.data ? formatNumber(item.data.totalTransactionRecords) : ""}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">{t.uploadedFiles.amount}:</span>
                        <span className="text-slate-900 font-medium">
                          {item.data ? formatCurrency(item.data.totalAmountToPay) : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Missing month card
                  <div key={index} className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-red-600" />
                      <div className="text-sm font-medium text-red-900">
                        {formatDate(item.date)}
                      </div>
                    </div>
                    <div className="text-xs text-red-800 mb-2">
                      {t.uploadedFiles.missingFiles}
                    </div>
                    <button
                      onClick={() => handleFileUpload(item.date)}
                      className="w-full text-xs bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1.5 px-2 rounded transition-colors"
                    >
                      {t.uploadedFiles.uploadFile}
                    </button>
                    <input
                      type="file"
                      accept=".pcn,.txt"
                      className="hidden"
                      ref={el => { fileInputRefs.current[item.date] = el; }}
                      onChange={(e) => handleFileSelect(item.date, e)}
                    />
                  </div>
                )
              ))}
          </div>

          {/* Missing files alert - Move this after the grid */}
          {missingMonths.length > 0 && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-red-800">
                <AlertTriangle className="h-5 w-5" />
                <span>
                  {t.uploadedFiles.missingFiles} {missingMonths.length} {" "}
                  {missingMonths.length === 1 ? t.uploadedFiles.period : t.uploadedFiles.periods}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Report Information Card */}
        <Card className="lg:col-span-2 shadow-md border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-slate-900">{t.reportInfo.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-1">{t.reportInfo.reportPeriod}</div>
                <div className="text-2xl font-bold text-slate-900">{dateRanges.reportRange || t.reportInfo.noData}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {headers.length} {headers.length === 1 ? t.reportInfo.periodsIncluded : t.reportInfo.periodsIncludedPlural}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-1">{t.reportInfo.fileCreated}</div>
                <div className="text-lg font-semibold text-slate-900">
                  {dateRanges.fileRange || t.reportInfo.noData}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {headers.length > 0
                    ? `${t.reportInfo.lastUpdated} ${formatDate(headers[headers.length - 1]?.fileCreationDate)}`
                    : t.reportInfo.noUpdates
                  }
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-slate-600 mb-1">{t.reportInfo.companyId}</div>
                <div className="font-mono text-sm font-semibold text-slate-900">
                  {headers.length > 0 ? headers[0].companyId : t.reportInfo.noData}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-slate-600 mb-1">{t.reportInfo.companyName}</div>
                <div className="text-sm font-semibold text-slate-900 truncate">
                  {companyName || t.reportInfo.loading}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg text-slate-900">{t.records.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Records */}
            <div className="border-b pb-2">
              <div className="text-sm font-medium text-slate-700">{t.records.totalRecords}</div>
              <div className="text-2xl font-bold text-slate-900">
                {formatNumber(
                  String(totals.totalTransactionRecords + totals.otherAndEquipmentRecordCount)
                )}
              </div>
            </div>

            {/* Total Transactions */}
            <div>
              <div className="text-sm text-slate-600">{t.records.totalTransactions}</div>
              <div className="text-xl font-semibold text-slate-900">
                {formatNumber(String(totals.totalTransactionRecords))}
              </div>
            </div>

            {/* Other & Equipment */}
            <div>
              <div className="text-sm text-slate-600">{t.records.otherAndEquipment}</div>
              <div className="text-lg font-semibold text-slate-900">
                {formatNumber(String(totals.otherAndEquipmentRecordCount))}
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Amount Due Card */}
        <Card
          className={`shadow-md border-0 bg-gradient-to-br ${totals.totalAmountToPay < 0
            ? 'from-emerald-50 to-green-50'
            : 'from-red-50 to-rose-50'
            }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign
                className={`h-5 w-5 ${totals.totalAmountToPay < 0 ? 'text-green-600' : 'text-red-600'
                  }`}
              />
              <CardTitle className="text-lg text-slate-900">{t.amountDue.title}</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-2">{t.amountDue.totalAmountToPay}</div>
              <div
                className={`text-2xl font-bold ${totals.totalAmountToPay < 0 ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {formatCurrency(String(totals.totalAmountToPay))}
              </div>

              <Badge
                variant={
                  totals.totalAmountToPay < 0 ? 'default' : 'destructive'
                }
                className="mt-2"
              >
                {totals.totalAmountToPay < 0
                  ? t.amountDue.paymentDueN
                  : t.amountDue.paymentDueP}
              </Badge>
            </div>
          </CardContent>
        </Card>



        {/* Taxable Amounts */}
        <Card className="lg:col-span-2 shadow-md border-0 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg text-slate-900">{t.taxableAmounts.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-1">{t.taxableAmounts.totalTaxableAmount}</div>
                <div className="text-xl font-bold text-slate-900">
                  {formatCurrency(String(totals.totalTaxableAmount))}
                </div>
                <div className="text-sm text-slate-600 mt-2">{t.taxableAmounts.vatOnTaxable}</div>
                <div className="text-lg font-semibold text-purple-600">
                  {formatCurrency(String(totals.vatOnTaxable))}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-1">{t.taxableAmounts.otherRateDeals}</div>
                <div className="text-xl font-bold text-slate-900">
                  {formatCurrency(String(totals.otherRateDealsAmount))}
                </div>
                <div className="text-sm text-slate-600 mt-2">{t.taxableAmounts.otherRateVat}</div>
                <div className="text-lg font-semibold text-purple-600">
                  {formatCurrency(String(totals.otherRateVat))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VAT Exempt & Input VAT */}
        <Card className="lg:col-span-2 shadow-md border-0 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg text-slate-900">{t.vatExempt.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-1">{t.vatExempt.vatExemptAmount}</div>
                <div className="text-lg font-bold text-slate-900">
                  {formatCurrency(String(totals.vatExemptAmount))}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-1">{t.vatExempt.otherInputVat}</div>
                <div className="text-lg font-bold text-slate-900">
                  {formatCurrency(String(totals.otherInputVat))}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-slate-600 mb-1">{t.vatExempt.equipmentInputVat}</div>
                <div className="text-lg font-bold text-slate-900">
                  {formatCurrency(String(totals.equipmentInputVat))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Results */}
      {
        headerFilter && (
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">
                {t.searchResults.title} ({filteredData.length} {t.searchResults.found})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredData.map(([key, value]) => (
                  <div key={key} className="bg-slate-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-slate-900 mb-1">{key}</div>
                    <div className="text-sm text-slate-700">{formatCellValue(value, key)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      }
      {/* Tax Analysis Graph */}
      <TaxGraph
        headers={sortedHeaders}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        language={language}
      />
    </div >
  )
}
