import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HallidayPaymentsProvider } from "@halliday-sdk/payments/react";
import App from "./App.jsx";
import "./index.css";

const SolanaUsdc = "solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SolanaSol = "solana:so11111111111111111111111111111111111111111";
const BaseUsdc = "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HallidayPaymentsProvider
      apiKey={import.meta.env.VITE_HALLIDAY_API_KEY}
      deposit={{ outputs: [SolanaUsdc] }}
    >
      <App />
    </HallidayPaymentsProvider>
  </StrictMode>,
);
