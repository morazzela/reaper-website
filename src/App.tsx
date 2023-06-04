import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useDashboardInfos } from "./protocol";
import { buyLink, formatNumber, leaderboardLink } from "./utils";
import { utils } from "ethers"
import moment from "moment"
import { TransferModal } from "./components/TransferModal";
import { DepositModal } from "./components/DepositModal";
import { WithdrawModal } from "./components/WithdrawModal";
import { HourglassModal } from "./components/HourglassModal";
import Modal from "./components/Modal";

function App() {
  const { isActive, account, provider, connector } = useWeb3React()
  const {
    loading,
    decimals,
    symbol,
    price,
    marketCap,
    balance,
    knownDeath,
    deathTimestamp,
    amountDeposited,
    isDead,
    isSoonDead,
    reduction,
  } = useDashboardInfos(provider, account)
  const [transferModalActive, setTransferModalActive] = useState(false)
  const [depositModalActive, setDepositModalActive] = useState(false)
  const [withdrawModalActive, setWithdrawModalActive] = useState(false)
  const [hourglassModalActive, setHourglassModalActive] = useState(false)
  const [aboutModalActive, setAboutModalActive] = useState(false)
  const [infoModalActive, setInfoModalActive] = useState(false)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    async function main() {
      if (connector && connector.connectEagerly) {
        await connector.connectEagerly()
      }

      if (!isActive) {
        await connector.activate(1)
      }
    }

    main()
  }, [])

  const onConnectClick = async () => {
    if (!isActive) {
      await connector.activate(1)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-mono">
      <div className="md:absolute md:top-6 md:right-6 flex flex-col md:flex-row items-center p-4 md:p-0">
        <a href={buyLink()} target="_blank" rel="noreferrer noopener" className="w-full text-center btn md:mr-6">Trade</a>
        <button className="w-full btn md:mr-6 mt-2 md:mt-0" onClick={() => { setInfoModalActive(true) }}>Info</button>
        <a href={leaderboardLink()} target="_blank" rel="noreferrer noopener" className="w-full text-center btn md:mr-6 mt-2 md:mt-0">Leaderboard</a>
        <a href="https://flipsidecrypto.xyz/scopecreep/reapers-gambit-2EytiP" target="_blank" rel="noreferrer noopener" className="w-full text-center btn md:mr-6 mt-2 md:mt-0">Stats</a>
        {balance.gt(0) && !isDead && <button className="w-full btn md:mr-6 mt-2 md:mt-0" onClick={() => { setTransferModalActive(true) }}>Transfer</button>}
        {balance.gt(0) && !isDead && <button className="w-full btn bg-black text-white md:mr-6 mt-2 md:mt-0" onClick={() => { setDepositModalActive(true) }}>Deposit</button>}
        {amountDeposited.gt(0) && <button className="w-full btn bg-black text-white md:mr-6 mt-2 md:mt-0" onClick={() => { setWithdrawModalActive(true) }}>Withdraw</button>}
        <button className="btn w-full mt-2 md:mt-0" onClick={onConnectClick}>
          {isActive ? account?.substring(0, 5) + ".." + account?.substring(account.length - 3) : "Connect Wallet"}
        </button>
      </div>
      <div className="w-full mt-12">
        <div className="w-full md:w-3/4 mx-auto py-12 px-4 md:px-0">
          <div>
            <div className="mb-6 flex items-center">
              <h2 className="font-bold text-3xl uppercase bg-black text-white inline-block px-2 py-1">Protocol</h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 ml-4 cursor-pointer" onClick={() => { setAboutModalActive(true) }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="font-mono uppercase text-center text-xl">Price</div>
                <div className="text-3xl lg:text-5xl font-bold mt-2">{loading ? "-" : `$${formatNumber(price, 18)}`}</div>
              </div>
              <div className="card">
                <div className="font-mono uppercase text-center text-xl">Market Cap</div>
                <div className="text-3xl lg:text-5xl font-bold mt-2">{loading ? "-" : `$${formatNumber(marketCap)}`}</div>
              </div>
            </div>
          </div>
          <div className="mt-16">
            <h2 className="font-bold text-3xl uppercase bg-black text-white inline-block mb-6 px-2 py-1">Wallet</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="font-mono uppercase text-center text-xl lg:text-base xl:text-xl">In Wallet</div>
                <div className="text-xl xl:text-2xl font-bold mt-2">{loading ? "-" : `${formatNumber(utils.formatUnits(balance, decimals))} $${symbol}`}</div>
              </div>
              <div className={"card" + (!isSoonDead ? "" : " bg-orange-50 border-orange-500 text-orange-900")}>
                <div className="font-mono uppercase text-center text-xl lg:text-base xl:text-xl">Death Date (approx.)</div>
                <div className="text-xl xl:text-2xl font-bold mt-2">{loading || knownDeath.eq(0) ? "-" : `${moment.unix(deathTimestamp).format("MMM Do h:mmA")}`}</div>
              </div>
              <div className="card">
                <div className="font-mono uppercase text-center text-xl lg:text-base xl:text-xl">Value</div>
                <div className="text-xl xl:text-2xl font-bold mt-2">{loading ? "-" : `$${formatNumber(Number(utils.formatUnits(balance, decimals)) * price)}`}</div>
              </div>
            </div>
          </div>
          <div className="mt-16">
            <div className="mb-6 flex items-center">
              <h2 className="font-bold text-3xl uppercase bg-black text-white inline-block px-2 py-1">
                <span>Hourglass</span>
              </h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 ml-4 cursor-pointer" onClick={() => { setHourglassModalActive(true) }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="font-mono uppercase text-center text-xl lg:text-base xl:text-xl">Deposited</div>
                <div className="text-xl xl:text-2xl font-bold mt-2">{loading ? "-" : `${formatNumber(utils.formatUnits(amountDeposited, decimals))} $${symbol}`}</div>
              </div>
              <div className="card">
                <div className="font-mono uppercase text-center text-xl lg:text-base xl:text-xl">Reduction</div>
                <div className="text-xl xl:text-2xl font-bold mt-2">{loading ? "-" : `${formatNumber(utils.formatUnits(reduction, decimals))} $${symbol}`}</div>
              </div>
              <div className="card">
                <div className="font-mono uppercase text-center text-xl lg:text-base xl:text-xl">Redeemable Value</div>
                <div className="text-xl xl:text-2xl font-bold mt-2">{loading ? "-" : `$${formatNumber(Number(utils.formatUnits(amountDeposited.sub(reduction), decimals)) * price)}`}</div>
              </div>
            </div>
            <div id="dexscreener-embed" className="mt-16 mb-16"><iframe id="dextools-widget"
              title="DEXTools Trading Chart"
              width="500"
              height="400" src="https://www.dextools.io/widgets/en/ether/pe-light/0x8ab0ff3106bf37b2db685aafd458baee2128d648?theme=light&chartType=2&chartResolution=30&drawingToolbars=false"></iframe></div>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 inset-x-0 flex justify-center py-6">
        <a href="https://twitter.com/reapers_gambit" target="_blank" rel="noreferrer noopener" className="block mx-3">
          <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
        </a>
        <a href="https://t.me/+Co0f1yYovp44NTU1" target="_blank" rel="noreferrer noopener" className="block mx-3">
          <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
        </a>
        <a href="https://etherscan.io/token/0x2c91d908e9fab2dd2441532a04182d791e590f2d" target="_blank" rel="noreferrer noopener" className="block mx-3">
          <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Ethereum</title><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg>
        </a>
      </footer>
      <Modal isActive={infoModalActive} setIsActive={setInfoModalActive} label="Info">
        <p>The REAPER’S GAMBIT is an on-chain conceptual artwork, an ERC20 token that becomes non-transferrable after 64800 blocks (9 days). Collectors must send their tokens to a new address before the end of this period, or their tokens will remain in limbo. The nine days countdown starts when an address first receives tokens. No address can be used twice. Escape the Reaper for as long as possible in this marathon of death.</p>
        <p>Contract: <a href="https://etherscan.io/address/0x2C91D908E9fab2dD2441532a04182d791e590f2d" className="text-[0.6rem] sm:text-base" target="_blank" rel="noreferrer noopener">0x2C91D908E9fab2dD2441532a04182d791e590f2d</a></p>
        <p>The $RG supply is 999,999,999. No more can be minted, and all have been placed in a <a href="https://v2.info.uniswap.org/pair/0x8ab0ff3106bf37b2db685aafd458baee2128d648" target="_blank" rel="noreferrer noopener">Uniswap V2 pool</a>. The LP tokens <a href="https://etherscan.io/tx/0x923a8dff61ea5f9ba9bfb9cc54b6c431794d5259eed05716381a1d76f8e0565f" target="_blank" rel="noreferrer noopener">have been burned</a>. There is no treasury or team allocation.</p>
        <p>This token is an on-chain artwork by <a href="https://twitter.com/figure31_" target="_blank" rel="noreferrer noopener">Figure31</a>. Please make sure you understand how smart contract works before interacting with it. Everyone plays by the same rules. This is an artistic experiment and should be treated as such. The smart contract is verified, but it is not audited. The title, the code, and the story of this project were entirely generated with ChatGPT. Join the community <a href="https://t.me/+Co0f1yYovp44NTU1" target="_blank" rel="noreferrer noopener">Telegram group</a> for any questions. DYOR.</p>
        <p className="mb-0">Email: info(at)reapersgambit.com</p>
      </Modal>
      <Modal isActive={aboutModalActive} setIsActive={setAboutModalActive} label="About">
        <p>Hear me, mortals! Forsooth, this contract, known as the REAPER'S GAMBIT, be a creation of artistic endeavour, born of an experimental nature that shall test the limits of your mortal understanding of time. The transfer of tokens must be swift, before 64800 blocks to be precise, and each time to a fresh address, lest it be locked in the grasp of Death.</p>
        <p>Only the creator of the contract has the power to grant immortality, only a specific pool and a router are allowed to cheat death. There are 999,999,999 RG tokens. None was given to any, and no more can be created. The code of this contract has not been audited, and the creator is unaware of any weaknesses that may be present. Thus, caution must be exercised when handling this cursed currency.</p>
        <p className="mb-0">Be warned, for the Reaper shall come knocking, and thou must need to transfer the token every 9 days to a new address, ere it be locked away forever. Thou canst not reuse an address, once it has received a transfer its use again shall be denied. This project was brought forth with the aid of OpenAI's Chatgpt, but the true master behind it all is the Grim Reaper himself. Take heed, for it is not a thing of mere profit but a participatory artwork of a conceptual kind that doth require care in its handling.</p>
      </Modal>
      <HourglassModal active={hourglassModalActive} setActive={setHourglassModalActive} />
      <TransferModal active={transferModalActive} setActive={setTransferModalActive} />
      <DepositModal active={depositModalActive} setActive={setDepositModalActive} />
      <WithdrawModal active={withdrawModalActive} setActive={setWithdrawModalActive} />
    </div>
  );
}

export default App;
