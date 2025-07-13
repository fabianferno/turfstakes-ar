'use client'

import type { Metadata } from 'next'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Eye, Coins, Globe, Smartphone, Menu, X } from "lucide-react"
import WalletProvider from "@/components/wallet-provider"
import ConnectWallet from "@/components/connect-wallet"
import TokenFaucetModal from "@/components/token-faucet-modal"
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"
import { useState } from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-black text-white w-full">
        <WalletProvider>
          {/* Header */}
          <header className="px-4 lg:px-6 h-20 flex items-center border-b-4 border-[#00D4FF] bg-black relative">
            <Link href="/" className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <Image src="/logo.png" alt="TurfStake Logo" width={48} height={48} className="w-12 h-12 sm:w-20 sm:h-20 object-contain my-2 bg-[#00D4FF]" />
                <span className="font-black text-xl sm:text-2xl tracking-tight transform -skew-x-6">TURFSTAKE</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-auto hidden lg:flex gap-6 items-center">
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
                href="/create-campaign"
                className="text-lg font-black hover:text-[#00D4FF] transition-colors border-b-2 border-transparent hover:border-[#00D4FF] pb-1"
              >
                CAMPAIGN
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

            {/* Mobile Menu Button */}
            <button
              className="ml-auto lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </header>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/80" onClick={() => setMobileMenuOpen(false)} />
              <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-black border-l-4 border-[#00D4FF] p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-black text-xl text-white">MENU</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close mobile menu"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>

                <nav className="space-y-6">
                  <Link
                    href="/map"
                    className="block text-lg font-black text-white hover:text-[#00D4FF] transition-colors border-b-2 border-transparent hover:border-[#00D4FF] pb-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    MAP
                  </Link>
                  <Link
                    href="/create-campaign"
                    className="block text-lg font-black text-white hover:text-[#00D4FF] transition-colors border-b-2 border-transparent hover:border-[#00D4FF] pb-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    CAMPAIGN
                  </Link>
                  <Link
                    href="/ar-viewer"
                    className="block text-lg font-black text-white hover:text-[#00D4FF] transition-colors border-b-2 border-transparent hover:border-[#00D4FF] pb-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    AR VIEW
                  </Link>

                  {/* Mobile Wallet Components */}
                  <div className="pt-6 border-t border-gray-800 space-y-4">
                    <TokenFaucetModal />
                    <ConnectWallet />
                  </div>
                </nav>
              </div>
            </div>
          )}

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
