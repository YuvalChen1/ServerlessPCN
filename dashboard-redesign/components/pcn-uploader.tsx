"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/context/data-context"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'
import { useLanguage } from '@/context/language-context'
import { pcnUploaderTranslations } from '@/translations/pcn-uploader'
import { Languages } from "lucide-react" // Fixed import

export default function PCNUploader() {
  const { setParsedData } = useData()
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([]) // Changed from single file to array
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isFileListOpen, setIsFileListOpen] = useState(false)
  const { language, toggleLanguage } = useLanguage()
  const t = pcnUploaderTranslations[language]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles])
      setError(null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files || [])
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles])
      setError(null)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Update the checkCompanyIds function
  const checkCompanyIds = async (files: File[]): Promise<boolean> => {
    try {
      const companyIds = await Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const content = e.target?.result as string
              const lines = content.split('\n')
              const headerLine = lines.find(line => line.startsWith('O'))

              if (headerLine && headerLine.length >= 10) {
                const companyId = headerLine.substring(1, 10)
                if (/^\d{9}$/.test(companyId)) {
                  resolve(companyId)
                } else {
                  reject(new Error(t.errors.validation.invalidFormat.replace('{0}', file.name)))
                }
              } else {
                reject(new Error(t.errors.validation.noHeader.replace('{0}', file.name)))
              }
            }
            reader.onerror = () => reject(new Error(t.errors.validation.readError.replace('{0}', file.name)))
            reader.readAsText(file)
          })
        })
      )

      const uniqueCompanyIds = new Set(companyIds)
      if (uniqueCompanyIds.size > 1) {
        await Swal.fire({
          icon: 'error',
          title: t.errors.companyIdMismatch.title,
          text: t.errors.companyIdMismatch.text,
          confirmButtonColor: '#3b82f6'
        })
        setFiles([])
        return false
      }
      return true
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: t.errors.validation.title,
        text: error instanceof Error ? error.message : t.errors.uploadFailed,
        confirmButtonColor: '#3b82f6'
      })
      setFiles([])
      return false
    }
  }

  // Update the uploadFiles function
  const uploadFiles = async () => {
    if (files.length === 0) {
      setError(t.errors.chooseFile)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // First check if all company IDs match
      const isValid = await checkCompanyIds(files)
      if (!isValid) {
        setLoading(false)
        return
      }

      const results = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          return response.data;
        })
      );


      // Make sure we're passing an array of headers
      setParsedData({
        header: results.map(result => result.header),
        transactions: results.flatMap(r => r.transactions),
        footer: results[results.length - 1].footer
      })

      router.refresh()
    } catch (err) {
      console.error(err)
      setError(t.errors.uploadFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <Upload className="h-4 w-4" />
          </div>
          {t.title}
        </CardTitle>
        <CardDescription className="text-slate-300">
          {t.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 relative">
        {/* Add max height and scrolling to the content area */}
        <div className="max-h-[60vh] overflow-y-auto mb-20 pr-2">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t.dropText}</h3>
            <p className="text-slate-600 mb-4">{t.browseText}</p>
            <Input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept=".pcn,.txt"
              multiple // Add this to enable multiple file selection
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>{t.chooseFile}</span>
              </Button>
            </Label>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              {/* Collapsible Header */}
              <button
                onClick={() => setIsFileListOpen(!isFileListOpen)}
                className="w-full p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {files.length}{" "}
                      {files.length === 1 ? t.fileUploaded : t.filesUploaded}
                    </p>
                    <p className="text-sm text-slate-600">
                      {t.totalSize}{" "}
                      {(files.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                {isFileListOpen ? (
                  <ChevronUp className="h-5 w-5 text-slate-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-600" />
                )}
              </button>

              {/* Collapsible Content */}
              {isFileListOpen && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-slate-900">{file.name}</p>
                          <p className="text-sm text-slate-600">({(file.size / 1024).toFixed(1)} KB)</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeFile(index)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert className="mt-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Sticky process button */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-white border-t">
          <Button
            onClick={uploadFiles}
            disabled={files.length === 0 || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {files.length === 1
                  ? t.processingFiles.replace('{0}', files.length.toString())
                  : t.processingFilesPlural.replace('{0}', files.length.toString())
                }
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                {files.length === 1
                  ? t.processFiles.replace('{0}', files.length.toString())
                  : t.processFilesPlural.replace('{0}', files.length.toString())
                }
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
