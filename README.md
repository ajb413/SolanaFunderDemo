# Solana Wallet Owner & Funder — Halliday Demo

Vite + React demo that onramps from fiat or swaps from Solana assets into USDC on Base using the [Halliday Payments SDK](https://docs.halliday.xyz). The user's Solana wallet funds the payment; any Wallet Standard wallet works.

Halliday SDK v4.1.0 with Solana wallet as owner & Funder.

In App.jsx, set `DESTINATION_ADDRESS` to an EVM or Solana address. The chain of the destination address must match the chain of output token address!

## Setup

```bash
npm install
cp .env.example .env   # then set VITE_HALLIDAY_API_KEY
npm run dev
```

Get a free public API key (`pk_…`) at https://dashboard.halliday.xyz/.
