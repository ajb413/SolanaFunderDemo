import { useState } from "react";
import { useHallidayPayments } from "@halliday-sdk/payments/react";
import { connectSolWallet } from "@halliday-sdk/payments/solana";
import * as solanaWallet from "./solanaWallet";
import "./App.css";

const SolanaUsdc = "solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SolanaSol = "solana:so11111111111111111111111111111111111111111";
const BaseUsdc = "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const DESTINATION_ADDRESS = ""; // Wallet or app account on EVM chains

export default function App() {
  const { openDeposit, updateWallets, error: sdkError } = useHallidayPayments();
  const [busy, setBusy] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const error = walletError ?? sdkError?.message;

  const start = async () => {
    setWalletError(null);
    setBusy(true);
    try {
      const address = await solanaWallet.connect();
      updateWallets({
        owner: {
          type: "wallet-auth",
          walletType: "SOL",
          address,
          signAuthMessage: solanaWallet.signAuthMessage,
        },
        deposit: {
          funders: [
            {
              ...connectSolWallet(solanaWallet.requireWallet),
              walletName: solanaWallet.requireWallet().name,
            },
          ],
          destinationAddress: DESTINATION_ADDRESS,
        },
      });
      openDeposit();
    } catch (e) {
      setWalletError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main>
      <h1>Solana USDC — Halliday Demo</h1>
      <p className="sub">Onramp with cash or swap Solana assets into USDC.</p>

      <button disabled={busy} onClick={start}>
        {busy ? "Connecting…" : "Deposit USDC with Halliday"}
      </button>

      {error && <p className="error">{error}</p>}
    </main>
  );
}
