import { TOKEN_ADDRESS } from "./constants"

export function formatNumber(val: any, decimals: any = 2): string {
    return Intl.NumberFormat("en-US", {
        maximumFractionDigits: decimals
    }).format(val)
}

export function buyLink(): string {
    return `https://app.uniswap.org/#/swap?outputCurrency=${TOKEN_ADDRESS}`
}

export function chartLink(): string {
    return `https://dexscreener.com/ethereum/0x8ab0ff3106bf37b2db685aafd458baee2128d648`
}