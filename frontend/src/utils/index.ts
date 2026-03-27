// Format date to readable string
export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// Format match date short
export const formatDateShort = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

// Get level badge color
export const getLevelColor = (level: string): string => {
    if (!level) return 'bg-gray-100 text-gray-600'
    if (level.includes('Advanced')) return 'bg-emerald-100 text-emerald-800'
    if (level.includes('Upper-Intermediate')) return 'bg-blue-100 text-blue-800'
    if (level.includes('Intermediate')) return 'bg-amber-100 text-amber-800'
    return 'bg-gray-100 text-gray-600'
}

// Get status badge color
export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'open': return 'bg-emerald-100 text-emerald-700'
        case 'filled': return 'bg-blue-100 text-blue-700'
        case 'cancelled': return 'bg-red-100 text-red-700'
        case 'pending': return 'bg-amber-100 text-amber-700'
        case 'approved': return 'bg-emerald-100 text-emerald-700'
        case 'rejected': return 'bg-red-100 text-red-700'
        default: return 'bg-gray-100 text-gray-600'
    }
}

// Truncate text
export const truncate = (str: string, n: number): string =>
    str.length > n ? str.slice(0, n) + '...' : str

// Get error message from axios error
export const getErrorMessage = (error: unknown): string => {
    if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'error' in error.response.data
    ) {
        return (error.response.data as { error: string }).error
    }
    return 'Bir hata oluştu. Lütfen tekrar deneyin.'
}