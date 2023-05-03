import { useWeb3React } from "@web3-react/core"
import { useState } from "react"
import { formatNumber } from "../utils"
import { ethers } from "ethers"
import { transfer, useDashboardInfos } from "../protocol"

export function TransferModal({ active, setActive }: any) {
    const { provider, account } = useWeb3React()
    const { decimals, balance, symbol } = useDashboardInfos(provider, account)
    const [value, setValue] = useState("")
    const [isValid, setIsValid] = useState(false)

    const onTransferAddressInput = ({ target }: any) => {
        setValue(target.value.trim())
        setIsValid(ethers.utils.isAddress(target.value.trim()))
    }

    const onTransferClick = async () => {
        const tx = await transfer(provider, account, value)
        await tx.wait()
        setActive(false)
        setValue("")
    }

    if (!active) {
        return <></>
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur">
            <div className="w-1/3 bg-white border-2 border-black p-6 relative">
                <h2 className="font-bold text-3xl uppercase bg-black text-white inline-block mb-3 px-2 py-1 absolute bottom-full left-0 transform -translate-x-[2px]">Transfer Tokens</h2>
                <svg onClick={() => { setActive(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 absolute top-0 right-0 transform -translate-y-[3.5rem] cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h1 className="uppercase font-bold text-2xl">Transfer {formatNumber(ethers.utils.formatUnits(balance, decimals))} ${symbol}</h1>
                <div className="flex mt-4">
                    <input type="text" placeholder="To Address" className="btn hover:bg-white hover:text-black w-full" onInput={onTransferAddressInput} />
                    <button className="btn bg-black text-white ml-2" disabled={!isValid} onClick={onTransferClick}>OK</button>
                </div>
            </div>
        </div>
    )
}