import { getWallets } from "@wallet-standard/app";
import bs58 from "bs58";

/**
 * Wallet Standard features a wallet must expose to both fund a Halliday
 * deposit and sign the owner auth challenge. Any wallet with all three works —
 * Phantom, Solflare, Backpack, Coinbase, and so on — with no per-wallet code.
 */
const REQUIRED_FEATURES = [
  "standard:connect",
  "solana:signAndSendTransaction",
  "solana:signMessage",
];

/** Every registered wallet that can carry a Solana payment end to end. */
export function listWallets() {
  return getWallets()
    .get()
    .filter((wallet) => REQUIRED_FEATURES.every((f) => f in wallet.features));
}

/** The wallet the user connected — set by `connect`. */
let connected = null;

/**
 * The live connection, for `connectSolWallet`'s wallet getter. Deliberately a
 * getter rather than a captured value so a reconnect doesn't need the funder
 * to be re-registered.
 */
export function requireWallet() {
  if (!connected) throw new Error("No Solana wallet connected.");
  return connected;
}

/**
 * Connect a wallet and return its base58 address. Defaults to the only
 * eligible wallet; pass one from `listWallets()` to let the user choose.
 */
export async function connect(wallet = listWallets()[0]) {
  if (!wallet) {
    throw new Error(
      "No Solana wallet found. Install one (phantom.app, solflare.com, backpack.app), then reload this page.",
    );
  }
  try {
    const { accounts } = await wallet.features["standard:connect"].connect();
    const address = accounts[0]?.address ?? wallet.accounts[0]?.address;
    if (!address) throw new Error(`${wallet.name} returned no Solana account.`);
    connected = wallet;
    return address;
  } catch (e) {
    // 4001 is the Wallet Standard "user rejected the request" code.
    throw e.code === 4001
      ? new Error(`Connection rejected in ${wallet.name}.`)
      : e;
  }
}

/**
 * Halliday's SignAuthMessage for a SOL owner: sign the challenge with the
 * Solana keypair and return the base58 signature.
 */
export async function signAuthMessage({ message, address }) {
  const wallet = requireWallet();
  const account = wallet.accounts.find((a) => a.address === address);
  if (!account) throw new Error(`Solana account ${address} is not connected`);
  const [result] = await wallet.features["solana:signMessage"].signMessage({
    account,
    message: new TextEncoder().encode(message),
  });
  return bs58.encode(result.signature);
}
