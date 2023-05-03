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
    if (connector && connector.connectEagerly) {
      connector.connectEagerly()
    }
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
            <h2 className="font-bold text-3xl uppercase">Protocol Stats</h2>
            <div className="h-[2px] bg-black w-full mb-12"></div>
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
            <h2 className="font-bold text-3xl uppercase">Your Stats</h2>
            <div className="h-[2px] bg-black w-full mb-12"></div>
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
    </div>
  );
}

export default App;
