import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Chain } from "wagmi/chains";

// Define the Chiliz Spicy Testnet chain
export const chilizSpicyTestnet: Chain = {
  id: 88882,
  name: "Chiliz Spicy Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Chiliz",
    symbol: "CHZ",
  },
  rpcUrls: {
    default: {
      http: ["https://spicy-rpc.chiliz.com/"],
      webSocket: ["wss://spicy-rpc-ws.chiliz.com/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Chiliz Spicy Explorer",
      url: "https://testnet.chiliscan.com",
    },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: "TurfStake",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
    "3efcd27f7b2cd095a70a209a01033aa7", // Get this from https://cloud.walletconnect.com
  chains: [chilizSpicyTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
