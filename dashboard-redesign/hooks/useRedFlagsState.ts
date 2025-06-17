import { useState } from 'react'

import { RedFlagType } from '@/types/red-flags'

export function useRedFlagsState() {
    const [expandedAnomalies, setExpandedAnomalies] = useState<Record<RedFlagType, boolean>>({
        unidentified: false,
        standardRatedSales: false,
        domesticPurchases: false,
        inputTaxAnomaly: false,
        outputTaxAnomaly: false,
    })

    return {
        expandedAnomalies,
        setExpandedAnomalies
    }
}