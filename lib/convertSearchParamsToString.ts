export function convertSearchParamsToString(
    searchParams: Record<string, string | string[]>
) {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([keyof, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => params.append(keyof, v))
        } else {
            params.set(keyof, value)
        }
    })
    return params.toString()
}