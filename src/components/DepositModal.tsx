import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { formatNumber } from "../utils"
import { BigNumber, ethers } from "ethers"
import { allowHourglass, deposit, useDashboardInfos } from "../protocol"
import Modal from "./Modal"

export function DepositModal({ active, setActive }: any) {
    const { provider, account } = useWeb3React()
    const { decimals, balance, symbol, hourglassAllowance, mutate } = useDashboardInfos(provider, account)
    const [value, setValue] = useState(BigNumber.from(0))
    const [inputValue, setInputValue] = useState("")
    const [approving, setApproving] = useState(false)
    const [depositing, setDepositing] = useState(false)
    const [minimum, setMinimum] = useState(BigNumber.from(0))

    useEffect(() => {
        setMinimum(ethers.utils.parseUnits("300000", decimals))
    }, [decimals])

    useEffect(() => {
        if (!active) {
            setInputValue("")
            setValue(BigNumber.from(0))
            setApproving(false)
            setDepositing(false)
        }
    }, [active])

    const onTransferAddressInput = ({ target }: any) => {
        setInputValue(target.value.trim())

        try {
            setValue(ethers.utils.parseUnits(target.value.trim(), decimals))
        } catch (_) {
            setValue(BigNumber.from(0))
        }
    }

    const onDepositClick = async () => {
        if (hourglassAllowance.lt(value)) {
            setApproving(true)
            const tx = await allowHourglass(provider)
            await tx.wait()
            await mutate()
            setApproving(false)
            return
        }

        setDepositing(true)
        const tx = await deposit(provider, value)
        await tx.wait()
        await mutate
        setDepositing(false)
        setActive(false)
    }

    const onSetMaxClick = () => {
        if (depositing || approving) {
            return
        }

        setInputValue(ethers.utils.formatUnits(balance, decimals))
        setValue(balance)
    }

    return (
        <Modal isActive={active} setIsActive={setActive} label="Deposit tokens">
            <h1 className="uppercase font-bold text-2xl">Deposit into hourglass</h1>
            <div className="flex mt-4 items-start flex-col md:flex-row">
                <div className="w-full flex items-end flex-col">
                    <input disabled={approving || depositing} value={inputValue} type="text" placeholder="Amount" className="btn hover:bg-white hover:text-black w-full" onChange={onTransferAddressInput} />
                    <div className="mt-1 flex justify-between w-full">
                        <span className={"italic font-mono text-xs" + (!value.eq(0) && value.lt(minimum) ? " text-red-600 font-bold" : "")}>Min. deposit is 300,000 ${symbol}</span>
                        <span onClick={onSetMaxClick} className="italic font-mono text-xs hover:underline hover:cursor-pointer">Max: {formatNumber(ethers.utils.formatUnits(balance, decimals))} ${symbol}</span>
                    </div>
                </div>
                <button className="btn bg-black text-white w-full md:w-auto mt-4 md:mt-0 md:ml-2" disabled={!value.gt(minimum) || value.gt(balance) || approving || depositing} onClick={onDepositClick}>
                    {approving && "Approving..."}
                    {depositing && "Depositing..."}
                    {(!approving && !depositing) && (
                        <>{hourglassAllowance.lt(value) ? "Approve" : "Deposit"}</>
                    )}
                </button>
            </div>
        </Modal>
    )
}