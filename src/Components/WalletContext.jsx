import React, { createContext, useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [balance, setBalance] = useState("");

  // Detect Ethereum provider (MetaMask)
  useEffect(() => {
    const initialize = async () => {
      const provider = await detectEthereumProvider();
      if (provider && provider === window.ethereum) {
        console.log("MetaMask is available!");
        startApp(provider);
      } else {
        console.log("Please install MetaMask!");
      }
    };

    initialize();
  }, []);

  const startApp = (provider) => {
    if (provider !== window.ethereum) {
      console.error("Do you have multiple wallets installed?");
    }
  };

  // Fetch chain ID and listen for chain changes
  useEffect(() => {
    const fetchChainId = async () => {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(parseInt(chainId, 16));
    };

    window.ethereum?.on("chainChanged", handleChainChanged);
    fetchChainId();

    return () => {
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const handleChainChanged = () => {
    window.location.reload();
  };

  const getAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(parseInt(chainId, 16));
    } catch (err) {
      if (err.code === 4001) {
        console.log("Please connect to MetaMask.");
      } else {
        console.error(err);
      }
    }
  };

  const changeNetwork = async () => {
    const chainIdHex = "0xaa36a7"; // Sepolia's chain ID in hex
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: "Sepolia",
                rpcUrls: ["https://sepolia.infura.io/v3/"],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const getBalance = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    });
    const balanceInEth = parseFloat(balance) / 10 ** 18; // Convert Wei to Ether
    setBalance(balanceInEth);
  };

  return (
    <WalletContext.Provider
      value={{ account, chainId, balance, getAccount, changeNetwork, getBalance }}
    >
      {children}
    </WalletContext.Provider>
  );
};
