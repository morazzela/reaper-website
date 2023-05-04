import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { formatNumber } from "../utils"
import { ethers } from "ethers"
import { transfer, useDashboardInfos } from "../protocol"
import Modal from "./Modal"

export function TransferModal({ active, setActive }: any) {
    const { provider, account } = useWeb3React()
    const { decimals, balance, symbol } = useDashboardInfos(provider, account)
    const [value, setValue] = useState("")
    const [isValid, setIsValid] = useState(false)
    const [isTransfering, setIsTransfering] = useState(false)

    useEffect(() => {
        if (!active) {
            setValue("")
        }
    }, [active])

    const onTransferAddressInput = ({ target }: any) => {
        setValue(target.value.trim())
        setIsValid(ethers.utils.isAddress(target.value.trim()))
    }

    const onTransferClick = async () => {
        setIsTransfering(true)
        const tx = await transfer(provider, account, value)
        await tx.wait()
        setActive(false)
        setIsTransfering(false)
    }

    return (
        <Modal isActive={active} setIsActive={setActive} label="Transfer tokens">
            <h1 className="uppercase font-bold text-2xl">Transfer {formatNumber(ethers.utils.formatUnits(balance, decimals))} ${symbol}</h1>
            <div className="flex flex-col md:flex-row mt-4">
                <input type="text" placeholder="To Address" disabled={isTransfering} className="btn hover:bg-white hover:text-black w-full" onInput={onTransferAddressInput} />
                <button className="btn bg-black text-white md:ml-2 mt-4 md:mt-0" disabled={!isValid || isTransfering} onClick={onTransferClick}>
                    {isTransfering ? "Transfering..." : "Transfer"}
                </button>
            </div>
        </Modal>
    )
}