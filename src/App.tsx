import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useDashboardInfos } from "./protocol";
import { formatNumber } from "./utils";
import { utils } from "ethers"
import moment from "moment"
import { TransferModal } from "./components/TransferModal";

function App() {
  const { isActive, account, provider, connector } = useWeb3React()
  const { loading, decimals, symbol, price, marketCap, balance, knownDeath, deathTimestamp } = useDashboardInfos(provider, account)
  const [modalActive, setModalActive] = useState(false)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    async function main() {
      if (connector && connector.connectEagerly) {
        connector.connectEagerly()
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
    <div className="flex min-h-screen bg-gray-100 font-mono">
      <div className="fixed top-6 right-6 flex items-center">
        <button className="btn bg-black text-white mr-6" onClick={() => { setModalActive(true) }}>
          Transfer
        </button>
        <button className="btn" onClick={onConnectClick}>
          {isActive ? account?.substring(0, 5) + ".." + account?.substring(account.length - 3) : "Connect Wallet"}
        </button>
      </div>
      <div className="w-full mt-12">
        <div className="w-3/4 mx-auto py-12">
          <div>
            <h2 className="font-bold text-3xl uppercase bg-black text-white inline-block mb-6 px-2 py-1">Protocol Stats</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="card">
                <div className="font-bold font-mono uppercase text-center text-xl">$RG Price</div>
                <div className="text-5xl font-bold mt-2">{loading ? "-" : `$${formatNumber(price, 18)}`}</div>
              </div>
              <div className="card">
                <div className="font-bold font-mono uppercase text-center text-xl">Market Cap</div>
                <div className="text-5xl font-bold mt-2">{loading ? "-" : `$${formatNumber(marketCap)}`}</div>
              </div>
            </div>
          </div>
          <div className="mt-16">
            <h2 className="font-bold text-3xl uppercase bg-black text-white inline-block mb-6 px-2 py-1">Your Stats</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="card">
                <div className="font-bold font-mono uppercase text-center text-xl">$RG Balance</div>
                <div className="text-4xl font-bold mt-2">{loading ? "-" : `${formatNumber(utils.formatUnits(balance, decimals))} $${symbol}`}</div>
              </div>
              <div className="card">
                <div className="font-bold font-mono uppercase text-center text-xl">Death Block</div>
                <div className="text-4xl font-bold mt-2">{loading || knownDeath === 0 ? "-" : `${knownDeath}`}</div>
              </div>
              <div className="card">
                <div className="font-bold font-mono uppercase text-center text-xl">Death Date (approx.)</div>
                <div className="text-4xl font-bold mt-2">{loading || knownDeath === 0 ? "-" : `${moment.unix(deathTimestamp).format("MMM Do h:mmA")}`}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TransferModal active={modalActive} setActive={setModalActive}/>
      <footer className="fixed bottom-0 inset-x-0 flex justify-center py-6">
        <a href="https://twitter.com/figure31_" target="_blank" className="block mx-3">
          <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
        </a>
        <a href="https://etherscan.io/token/0x2c91d908e9fab2dd2441532a04182d791e590f2d" target="_blank" className="block mx-3">
          <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Ethereum</title><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/></svg>
        </a>
      </footer>
    </div>
  );
}

export default App;
