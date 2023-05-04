import { TOKEN_ADDRESS } from "./constants"

export function formatNumber(val: any, decimals: any = 2): string {
    return Intl.NumberFormat("en-US", {
        maximumFractionDigits: decimals
    }).format(val)
}

export function buyLink(): string {
    return `https://app.uniswap.org/#/swap?outputCurrency=${TOKEN_ADDRESS}`
}