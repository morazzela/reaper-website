export function formatNumber(val: any, decimals: any = 2): string {
    return Intl.NumberFormat("en-US", {
        maximumFractionDigits: decimals
    }).format(val)
}