import Modal from "./Modal";

export function HourglassModal({ active, setActive }: any) {
    return (
        <Modal isActive={active} setIsActive={setActive} label="Hourglass">
            <p><a href="https://etherscan.io/address/0x9e70934f4bacb459d93d843ef974749d767c5fca#code" target="_blank" rel="noreferrer noopener" className="hover:underline font-bold">HOURGLASS</a> is an auxiliary contract to the REAPER'S GAMBIT. It allows any address to deposit a minimum of 300,000 $RG and escape the Reaper indefinitely. After 4800 blocks (16 hours), a depositor can withdraw to any address. For every cycle of 2400 blocks, a balance will suffer a deduction of 0.09%. Once an address withdraws, the deduction is applied and goes into a shared pool. If an address deposit is &gt; ⅓ of the total contract deposits, the reduction rate will be cut in half. The shared pool can be claimed by any address with a deposit in the contract if its wallet balance is at least 30x the shared deduction pool. It will receive ⅓ of it, and the rest will be burned.</p>
            <p className="mb-0">Similar to REAPER’S GAMBIT, the contract is verified and tested, but it is not audited. It is entirely generated with ChatGPT. Use at your own risk and ensure you understand how it works.</p>
        </Modal>
    )
}