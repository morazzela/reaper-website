import Token from "./abis/Token.json"
import Router from "./abis/Router.json"
import Hourglass from "./abis/Hourglass.json"

import { ethers, BigNumber } from "ethers";
import { HOURGLASS_ADDRESS, ROUTER_ADDRESS, TOKEN_ADDRESS, USDC_ADDRESS, WETH_ADDRESS } from "./constants";
import { useState, useEffect } from "react"

export function useDashboardInfos(provider: any, account: any) {
    const [loading, setLoading] = useState(true)
    const [decimals, setDecimals] = useState(18)
    const [symbol, setSymbol] = useState("")
    const [price, setPrice] = useState(0)
    const [marketCap, setMarketCap] = useState(0)
    const [balance, setBalance] = useState(BigNumber.from(0))
    const [knownDeath, setKnownDeath] = useState(BigNumber.from(0))
    const [deathTimestamp, setDeathTimestamp] = useState(0)
    const [totalSupply, setTotalSupply] = useState(BigNumber.from(0))
    const [amountDeposited, setAmountDeposited] = useState(BigNumber.from(0))
    const [reduction, setReduction] = useState(BigNumber.from(0))
    const [hourglassAllowance, setHourglassAllowance] = useState(BigNumber.from(0))
    const [refreshKey, setRefreshKey] = useState(0)
    const [isDead, setIsDead] = useState(false)
    const [isSoonDead, setIsSoonDead] = useState(false)

    const mutate = () => {
        setRefreshKey(x => x + 1)
    }

    useEffect(() => {
        async function main() {
            if (!provider || !account) {
                return
            }

            const contract = getContract(provider)
            const hourglass = getHourglass(provider)
    
            const data = await Promise.all([
                contract.KnowDeath(account),
                contract.totalSupply(),
                provider.getBlockNumber(),
                contract.decimals(),
                contract.symbol(),
                contract.balanceOf(account),
                hourglass.getDepositInfo(account),
                contract.allowance(account, hourglass.address)
            ])

            const knownDeath = data[0]
            const tSupply = data[1]
            const currentBlockNumber = data[2]
            const depositBlockNumber = data[6].blockNumber
            const reductionPercentage = data[6].reductionPercentage

            if (!depositBlockNumber.eq(0)) {
                const blocksSinceDeposit = currentBlockNumber - depositBlockNumber.toNumber()
                const reduction = data[6].amount.mul(reductionPercentage).mul(blocksSinceDeposit).div(2400).div("1000000000000000000")
                setReduction(reduction)
            } else {
                setReduction(BigNumber.from(0))
            }

            const deathTS = Math.round(Date.now() / 1000) + ((knownDeath.toNumber() - currentBlockNumber) * 12)

            setIsDead(knownDeath.gt(0) && knownDeath.lte(currentBlockNumber))
            setDecimals(data[3])
            setTotalSupply(tSupply)
            setSymbol(data[4])
            setBalance(data[5])
            setKnownDeath(knownDeath)
            setDeathTimestamp(deathTS)
            setIsSoonDead(deathTS - Math.round(Date.now() / 1000) < 86400)
            setAmountDeposited(data[6].amount)
            setHourglassAllowance(data[7])
    
            const router = new ethers.Contract(ROUTER_ADDRESS, Router, provider)
    
            const amountIn = ethers.utils.parseUnits("1", decimals)
            const amountOut = (await router.getAmountsOut(amountIn, [TOKEN_ADDRESS, WETH_ADDRESS, USDC_ADDRESS]))[2]
            const price = Number(ethers.utils.formatUnits(amountOut, 6))
            const mcap = Number(ethers.utils.formatUnits(tSupply, decimals)) * price
            
            setMarketCap(mcap)
            setPrice(Number(price))
            setLoading(false)
        }

        main()
    }, [provider, account, refreshKey, decimals])

    return {
        loading,
        decimals,
        symbol,
        price,
        totalSupply,
        balance,
        knownDeath,
        deathTimestamp,
        amountDeposited,
        hourglassAllowance,
        marketCap,
        reduction,
        isDead,
        isSoonDead,
        mutate
    }
}

export async function transfer(provider: any, account: any, to: any) {
    const contract = getContract(provider)
    const balance = await contract.balanceOf(account)
    return await contract.transfer(to, balance)
}

export async function allowHourglass(provider: any) {
    const hourglass = getHourglass(provider)
    const token = getContract(provider)
    return await token.approve(hourglass.address, ethers.constants.MaxUint256)
}

export async function deposit(provider: any, amount: any) {
    const contract = getHourglass(provider)
    return await contract.deposit(amount)
}

export async function withdraw(provider: any, account: any) {
    const contract = getHourglass(provider)
    return await contract.withrawTo(account)
}

function getContract(provider: any) {
    return new ethers.Contract(TOKEN_ADDRESS, Token, provider.getSigner())
}

function getHourglass(provider: any) {
    return new ethers.Contract(HOURGLASS_ADDRESS, Hourglass, provider.getSigner())
}