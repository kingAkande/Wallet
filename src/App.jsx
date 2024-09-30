import React from "react";
import { WalletProvider } from './Components/WalletContext';
import WalletConnection from "./Components/WalletConnection";

const App = () => {

  return (

    <WalletProvider>
      <WalletConnection/>
    </WalletProvider>

  );
};

export default App;
