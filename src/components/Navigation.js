import { ethers } from "ethers";
import { useEffect, useState } from "react";

const Navigation = ({ account, setAccount, owner, dappazon, provider }) => {
  const [balance, setBalance] = useState(0);

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account?.toLowerCase());
  };

  const fetchDetails = async () => {
    const balance = await dappazon?.getBalance();
    setBalance(balance);
  };

  const withdrawHandler = async () => {
    const signer = await provider.getSigner();

    let transaction = await dappazon?.connect(signer).withdraw();
    await transaction.wait();
    fetchDetails();
  };

  useEffect(() => {
    fetchDetails();

    dappazon?.on("Buy", fetchDetails);
    return () => dappazon?.off("Buy", fetchDetails);
  }, [owner, account]);

  console.log({ account, owner });

  return (
    <nav>
      <div className="nav__brand">
        <h1>Dappazon</h1>
      </div>

      <input type="text" className="nav__search" />

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        {account ? (
          <button type="button" className="nav__connect">
            {account.slice(0, 6) + "..." + account.slice(38, 42)}
          </button>
        ) : (
          <button
            type="button"
            className="nav__connect"
            onClick={connectHandler}
          >
            Connect
          </button>
        )}

        {account === owner ? (
          <button
            onClick={withdrawHandler}
            disabled={balance <= 0}
            type="button"
            className="nav__connect"
          >
            withdraw {ethers.utils.formatUnits(balance, "ether")} ETH
          </button>
        ) : null}
      </div>

      <ul className="nav__links">
        <li>
          <a href="#Clothing & Jewelry">Clothing & Jewelry</a>
        </li>
        <li>
          <a href="#Electronics & Gadgets">Electronics & Gadgets</a>
        </li>
        <li>
          <a href="#Toys & Gaming">Toys & Gaming</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
