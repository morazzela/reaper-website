import Token from "./abis/Token.json"
import Router from "./abis/Router.json"

import { ethers, BigNumber } from "ethers";
import { ROUTER_ADDRESS, TOKEN_ADDRESS, USDC_ADDRESS, WETH_ADDRESS } from "./constants";
import { useState } from "react"
import useSWR from "swr"

export function useDashboardInfos(provider: any, account: any) {
    const [loading, setLoading] = useState(true)
    const [decimals, setDecimals] = useState(18)
    const [symbol, setSymbol] = useState("")
    const [price, setPrice] = useState(0)
    const [marketCap, setMarketCap] = useState(0)
    const [balance, setBalance] = useState(BigNumber.from(0))
    const [knownDeath, setKnownDeath] = useState(0)
    const [deathTimestamp, setDeathTimestamp] = useState(0)
    const [totalSupply, setTotalSupply] = useState(BigNumber.from(0))

    useSWR([provider], async () => {
        if (!provider) {
            return
        }

        const contract = getContract(provider)

        const knownDeath = await contract.KnowDeath(account)
        const tSupply = await contract.totalSupply()
        const currentBlockNumber = await provider.getBlockNumber()

        setDecimals(await contract.decimals())
        setTotalSupply(tSupply)
        setSymbol(await contract.symbol())
        setBalance(await contract.balanceOf(account))
        setKnownDeath(knownDeath)
        setDeathTimestamp(Math.round(Date.now() / 1000) + ((knownDeath.toNumber() - currentBlockNumber) * 12.1))

        const router = new ethers.Contract(ROUTER_ADDRESS, Router, provider)

        const amountIn = ethers.utils.parseUnits("1", decimals)
        const amountOut = (await router.getAmountsOut(amountIn, [TOKEN_ADDRESS, WETH_ADDRESS, USDC_ADDRESS]))[2]
        const price = Number(ethers.utils.formatUnits(amountOut, 6))
        const mcap = Number(ethers.utils.formatUnits(tSupply, decimals)) * price

        setMarketCap(mcap)
        setPrice(Number(price))
        setLoading(false)
    })

    return {
        loading,
        decimals,
        symbol,
        price,
        totalSupply,
        balance,
        knownDeath,
        deathTimestamp,
        marketCap,
    }
}

export async function transfer(provider: any, account: any, to: any) {
    const contract = getContract(provider)
    const balance = await contract.balanceOf(account)
    return await contract.transfer(to, balance)
}

function getContract(provider: any) {
    return new ethers.Contract(TOKEN_ADDRESS, Token, provider.getSigner())
}