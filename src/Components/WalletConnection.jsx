import React, { useContext } from "react";
import { WalletContext } from "./WalletContext";

const WalletConnection = () => {
  const { account, chainId, balance, getAccount, changeNetwork, getBalance } =
    useContext(WalletContext);

  return (
    <div className='w-128  mx-auto mt-4'>
    <button className="enableEthereumButton mr-2 border px-2" onClick={getAccount}>
      Connect to MetaMask
    </button>
    <button className="enableChangeEthereumButton mr-2 border px-2" onClick={changeNetwork}>
      Switch to Sepolia Network
    </button>
    <button className="enableChangeEthereumButton border px-2" onClick={ getBalance}>
      Get Balance
    </button>


    <div className="showAccount">Account: {account}</div>
    <div className="showChainId">Chain ID: {chainId}</div>
    <div className="showBalance">Balance: {balance}</div>

  </div>
  );
};

export default WalletConnection;
