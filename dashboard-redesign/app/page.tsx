"use client"

import { useState, useEffect } from "react"
import { useData } from "@/context/data-context"
import { Button } from "@/components/ui/button"
import { BarChart3, Database, FileText, PieChart, Upload, ArrowDownLeft, ArrowUpRight, ChevronDown, Languages } from "lucide-react"
import { cn } from "@/lib/utils"
import PCNUploader from "@/components/pcn-uploader"
import FileHeaderDashboard from "@/components/file-header-dashboard"
import RecordTypeBreakdown from "@/components/record-type-breakdown"
import VatFileNumberBreakdown from "@/components/vat-file-number-breakdown"
import TransactionsView from "@/components/transactions-view"
import type { HeaderData } from "@/types/header-data"
import Swal from 'sweetalert2'
import { useLanguage } from "@/context/language-context"
import { sidebarTranslations } from "@/translations/sidebar"

type PageType =
	| "dashboard"
	| "record-types-all"
	| "record-types-input"
	| "record-types-output"
	| "vat-breakdown"
	| "vat-breakdown-all"
	| "vat-breakdown-input"
	| "vat-breakdown-output"
	| "transactions"

const INPUT_TAX_TYPES = ['T', 'C', 'K', 'R', 'P', 'H'];
const OUTPUT_TAX_TYPES = ['S', 'L', 'M', 'Y', 'I'];

const navItems = [
	{
		id: "dashboard",
		title: (t: any) => t.dashboard,
		icon: <BarChart3 className="w-5 h-5" />,
		disabled: false,
	},
	{
		id: "record-types",
		title: (t: any) => t.recordTypes,
		icon: <PieChart className="w-5 h-5" />,
		requiresData: true,
		disabled: false,
		subItems: [
			{
				id: "record-types-all",
				title: (t: any) => t.allRecordTypes,
				icon: <PieChart className="w-4 h-4" />,
			},
			{
				id: "record-types-input",
				title: (t: any) => t.inputTax,
				icon: <ArrowDownLeft className="w-4 h-4" />,
			},
			{
				id: "record-types-output",
				title: (t: any) => t.outputTax,
				icon: <ArrowUpRight className="w-4 h-4" />,
			},
		],
	},
	{
		id: "vat-breakdown",
		title: (t: any) => t.vatBreakdown,
		icon: <Database className="w-5 h-5" />,
		requiresData: true,
		disabled: false,
		subItems: [
			{
				id: "vat-breakdown-all",
				title: (t: any) => t.allVatFiles,
				icon: <Database className="w-4 h-4" />,
			},
			{
				id: "vat-breakdown-input",
				title: (t: any) => t.inputTax,
				icon: <ArrowDownLeft className="w-4 h-4" />,
			},
			{
				id: "vat-breakdown-output",
				title: (t: any) => t.outputTax,
				icon: <ArrowUpRight className="w-4 h-4" />,
			},
		],
	},
	{
		id: "transactions",
		title: (t: any) => t.transactions,
		icon: <FileText className="w-5 h-5" />,
		requiresData: true, // Add this flag
		disabled: false,
	},
];

export default function MainPage() {
	const { parsedData, setParsedData } = useData();
	const { language, toggleLanguage } = useLanguage()
	const t = sidebarTranslations[language]
	const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

	// Initialize headers state with proper type checking
	const [headers, setHeaders] = useState<HeaderData[]>(() => {
		if (!parsedData?.header) return [];
		return Array.isArray(parsedData.header) ? parsedData.header : [parsedData.header];
	});

	// Add this effect to update headers when parsedData changes
	useEffect(() => {
		if (parsedData?.header) {
			const newHeaders = Array.isArray(parsedData.header)
				? parsedData.header
				: [parsedData.header];
			setHeaders(newHeaders);
		}
	}, [parsedData]);

	const handleUpdateHeaders = (newHeaders: HeaderData[], newData?: {
		transactions: Record<string, any>[];
		footer: any;
	}) => {
		setHeaders(newHeaders);

		// Update the context with the new data
		if (parsedData && newData) {
			setParsedData({
				header: newHeaders,
				transactions: [...parsedData.transactions, ...newData.transactions],
				footer: newData.footer // Usually take the latest footer
			});
		}
	};

	const handleResetData = async () => {
		// Show confirmation dialog
		const isHebrew = language === 'he';

		const result = await Swal.fire({
			title: isHebrew ? '? להתחיל תיק חדש' : 'Start New PCN ?',
			text: isHebrew
				? 'האם אתה בטוח שברצונך להתחיל תיק חדש ? הנתונים הנוכחיים יימחקו.'
				: 'Are you sure you want to start a new PCN ? Current data will be cleared.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3b82f6',
			cancelButtonColor: '#d1d5db',
			confirmButtonText: isHebrew ? 'כן, התחל חדש' : 'Yes, start new',
			cancelButtonText: isHebrew ? 'לא, השאר נתונים' : 'No, keep current',
		});

		// Only proceed if user confirmed
		if (result.isConfirmed) {
			setParsedData(null);
			setCurrentPage("dashboard");
			setHeaders([]);
		}
	};

	const hasData = !!parsedData;

	const renderContent = () => {
		switch (currentPage) {
			case "dashboard":
				return (
					<div className="space-y-8">
						{!hasData ? (
							<PCNUploader />
						) : (
							<FileHeaderDashboard
								sampleHeaderData={headers}
								onUpdateHeaders={handleUpdateHeaders}
							/>
						)}
					</div>
				);
			case "record-types-all":
				return hasData ? <RecordTypeBreakdown parsedData={parsedData} /> : null;
			case "record-types-input":
				return hasData ? (
					<RecordTypeBreakdown
						parsedData={parsedData}
						recordTypeFilter={INPUT_TAX_TYPES}
					/>
				) : null;
			case "record-types-output":
				return hasData ? (
					<RecordTypeBreakdown
						parsedData={parsedData}
						recordTypeFilter={OUTPUT_TAX_TYPES}
					/>
				) : null;
			case "vat-breakdown":
				return hasData ? <VatFileNumberBreakdown parsedData={parsedData} /> : null;
			case "vat-breakdown-all":
				return hasData ? <VatFileNumberBreakdown parsedData={parsedData} /> : null;
			case "vat-breakdown-input":
				return hasData ? (
					<VatFileNumberBreakdown
						parsedData={parsedData}
						recordTypeFilter={INPUT_TAX_TYPES}
					/>
				) : null;
			case "vat-breakdown-output":
				return hasData ? (
					<VatFileNumberBreakdown
						parsedData={parsedData}
						recordTypeFilter={OUTPUT_TAX_TYPES}
					/>
				) : null;
			case "transactions":
				return hasData ? <TransactionsView parsedData={parsedData} /> : null;
			default:
				return null;
		}
	};

	// Add this state to track expanded menu items
	const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

	const PentagramLogo = ({ className = "", size = "36" }) => (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -120 240 240" width={size} height={size} className={className}>

			<defs>
				<linearGradient id="pentagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#2563eb" />
					<stop offset="50%" stopColor="#8b5cf6" />
					<stop offset="100%" stopColor="#06b6d4" />
				</linearGradient>
			</defs>

			<circle cx="0" cy="0" r="100" fill="none" stroke="url(#pentagramGradient)" strokeWidth="2" />


			<polygon points="0,-115 109.4,-35.5 67.6,93.0 -67.6,93.0 -109.4,-35.5" fill="none" stroke="black" strokeWidth="3">
				<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
			</polygon>
		</svg>
	)

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Navigation */}
			<nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className={cn(
							"flex items-center",
							language === 'he' ? "space-x-4 space-x-reverse" : "space-x-4"
						)}>
							<div className={cn(
								"p-2 rounded-lg",
								"bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700",
								"shadow-lg shadow-blue-500/20",
								"border border-blue-400/20",
								"animate-gradient"
							)}>
								<PentagramLogo size="32" />
							</div>
							<span className="text-xl font-semibold text-slate-900">PCN874</span>
						</div>
						<div className="flex items-center">
							<Button
								variant="outline"
								size="sm"
								onClick={toggleLanguage}
								className={cn(
									"flex items-center gap-2 px-4 py-2 transition-all duration-200",
									"border-slate-200 hover:border-blue-500 hover:text-blue-600",
									"shadow-sm hover:shadow"
								)}
							>
								<Languages className="h-4 w-4" />
								<span className="text-sm font-medium">
									{language === 'en' ? 'עברית' : 'English'}
								</span>
							</Button>
						</div>
					</div>
				</div>
			</nav>

			<div className="flex">
				{/* Sidebar */}
				<div className="w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4">
					<nav className="flex flex-col space-y-1 w-full">
						{navItems.map((item) => (
							<div key={item.id}>
								<button
									onClick={() => {
										if (item.subItems) {
											setExpandedMenu(expandedMenu === item.id ? null : item.id);
										} else {
											!item.disabled && setCurrentPage(item.id as PageType);
										}
									}}
									disabled={item.requiresData && !hasData}
									className={cn(
										"w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all text-left",
										currentPage.startsWith(item.id)
											? "bg-blue-50 text-blue-700"
											: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
										(item.disabled || (item.requiresData && !hasData)) &&
										"opacity-50 cursor-not-allowed hover:bg-transparent hover:text-slate-600"
									)}
								>
									<div
										className={cn(
											"flex h-8 w-8 items-center justify-center rounded-md",
											currentPage.startsWith(item.id)
												? "bg-blue-100 text-blue-700"
												: "bg-slate-100 text-slate-600"
										)}
									>
										{item.icon}
									</div>
									{item.title(t)}
									{item.subItems && (
										<ChevronDown
											className={cn(
												"ml-auto h-4 w-4 transition-transform",
												expandedMenu === item.id && "transform rotate-180"
											)}
										/>
									)}
								</button>

								{/* Render sub-items if they exist and the menu is expanded */}
								{item.subItems && expandedMenu === item.id && (
									<div className={cn(
										"mt-1 space-y-1",
										// Change margin based on language direction
										language === 'en' ? "ml-9" : "mr-9"
									)}>
										{item.subItems.map((subItem) => (
											<button
												key={subItem.id}
												onClick={() => setCurrentPage(subItem.id as PageType)}
												className={cn(
													"w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all text-left",
													currentPage === subItem.id
														? "bg-blue-50 text-blue-700"
														: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
												)}
											>
												<div
													className={cn(
														"flex h-6 w-6 items-center justify-center rounded-md",
														currentPage === subItem.id
															? "bg-blue-100 text-blue-700"
															: "bg-slate-100 text-slate-600"
													)}
												>
													{subItem.icon}
												</div>
												{subItem.title(t)}
											</button>
										))}
									</div>
								)}
							</div>
						))}

						{/* New Upload Button - Only shows when data exists */}
						{hasData && (
							<button
								onClick={handleResetData}
								className="mt-6 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all text-left bg-blue-600 hover:bg-blue-700 text-white"
							>
								<div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
									<Upload className="w-5 h-5" />
								</div>
								{t.uploadNewPcn}
							</button>
						)}
					</nav>
				</div>

				{/* Main Content */}
				<div className="flex-1 p-8">{renderContent()}</div>
			</div>
		</div>
	)
}
