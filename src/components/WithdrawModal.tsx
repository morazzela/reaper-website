import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { formatNumber } from "../utils"
import { ethers } from "ethers"
import { useDashboardInfos, withdraw } from "../protocol"
import Modal from "./Modal"

export function WithdrawModal({ active, setActive }: any) {
    const { provider, account } = useWeb3React()
    const { decimals, mutate, amountDeposited, reduction, symbol } = useDashboardInfos(provider, account)
    const [value, setValue] = useState("")
    const [withdrawing, setWithdrawing] = useState(false)
    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        if (!active) {
            setValue("")
            setWithdrawing(false)
        }
    }, [active])

    useEffect(() => {
        setIsValid(ethers.utils.isAddress(value))
    }, [value])

    const onTransferAddressInput = ({ target }: any) => {
        setValue(target.value.trim())
    }

    const onWithdrawClick = async () => {
        setWithdrawing(true)
        const tx = await withdraw(provider, value)
        await tx.wait()
        await mutate()
        setWithdrawing(false)
        setActive(false)
    }

    return (
        <Modal isActive={active} setIsActive={setActive} label="Withdraw tokens">
            <h1 className="uppercase font-bold text-2xl">Withdraw from hourglass</h1>
            <div className="flex mt-4 items-start flex-col md:flex-row">
                <div className="w-full flex flex-col items-end">
                    <input disabled={withdrawing} value={value} type="text" placeholder="To Address" className="btn hover:bg-white hover:text-black w-full" onChange={onTransferAddressInput} />
                    <div className="mt-1 flex justify-between w-full">
                        <span className="italic font-mono text-xs">Redeemable: {formatNumber(ethers.utils.formatUnits(amountDeposited.sub(reduction), decimals))} ${symbol}</span>
                        {account && <span className="italic font-mono text-xs hover:underline hover:cursor-pointer" onClick={() => { setValue(account) }}>Use current address</span>}
                    </div>
                </div>
                <button className="btn bg-black text-white ml-0 md:ml-2 w-full md:w-auto mt-4 md:mt-0" disabled={withdrawing || !isValid} onClick={onWithdrawClick}>
                    {withdrawing ? "Withdrawing..." : "Withdraw"}
                </button>
            </div>
        </Modal>
    )
}