import type { Metadata } from 'next'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Eye, Coins, Globe, Smartphone } from "lucide-react"
import WalletProvider from "@/components/wallet-provider"
import ConnectWallet from "@/components/connect-wallet"
import TokenFaucetModal from "@/components/token-faucet-modal"
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'TurfStake - Claim the World for Your Club',
  description: 'Stake Chiliz fan tokens to build evolving AR monuments at real locations. Earn from ads, unlock merch, and turn the world into your team\'s territory.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-black text-white w-full">
        <WalletProvider>
          {/* Header */}
          <header className="px-4 lg:px-6 h-20 flex items-center border-b-4 border-[#00D4FF] bg-black">
            <Link href="/" className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#00D4FF] border-4 border-white transform rotate-3 flex items-center justify-center shadow-[4px_4px_0px_0px_#ffffff]">
                  <span className="text-black font-black text-xl transform -rotate-3">T</span>
                </div>
                <span className="font-black text-2xl tracking-tight transform -skew-x-6">TURFSTAKE</span>
              </div>
            </Link>
            <nav className="ml-auto flex gap-6 items-center">
              <Link
                href="/map"
                className="text-lg font-black hover:text-[#00D4FF] transition-colors border-b-2 border-transparent hover:border-[#00D4FF] pb-1"
              >
                MAP
              </Link>
              <Link
                href="/create"
                className="text-lg font-black hover:text-[#00D4FF] transition-colors border-b-2 border-transparent hover:border-[#00D4FF] pb-1"
              >
                CREATE
              </Link>
              <Link
                href="/ar-viewer"
                className="text-lg font-black hover:text-[#00D4FF] transition-colors border-b-2 border-transparent hover:border-[#00D4FF] pb-1"
              >
                AR VIEW
              </Link>

              {/* Wallet Components */}
              <div className="flex items-center gap-3">
                <TokenFaucetModal />
                <ConnectWallet />
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-black border-t-4 border-[#00D4FF] py-8">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="font-black text-white">© 2024 TURFSTAKE. POWERED BY CHILIZ.</p>
                <div className="flex gap-4">
                  <Badge className="bg-[#00D4FF] text-black font-black">CHILIZ NETWORK</Badge>
                  <Badge className="bg-white text-black font-black">WEBXR ENABLED</Badge>
                </div>
              </div>
            </div>
          </footer>
        </WalletProvider>
        <Toaster />

      </body>
    </html>
  )
}
