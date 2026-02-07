type Translator = (key: string, values?: Record<string, any>) => string

export function translateAuthError(error: unknown, t: Translator) {
    const message =
        typeof error === 'object' && error && 'message' in error
            ? String((error as { message?: string }).message || '')
            : ''
    const normalized = message.toLowerCase()

    if (normalized.includes('invalid') && normalized.includes('credentials')) {
        return t('invalid_credentials')
    }
    if (normalized.includes('already registered') || normalized.includes('already exists')) {
        return t('user_already_registered')
    }
    if (normalized.includes('weak password')) {
        return t('weak_password')
    }
    if (normalized.includes('email not confirmed')) {
        return t('email_not_confirmed')
    }
    if (normalized.includes('network') || normalized.includes('fetch failed')) {
        return t('network_error')
    }

    return t('generic')
}
