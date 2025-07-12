"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Plus, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useActiveCampaigns } from "@/hooks/use-campaigns"

export default function AllAdsPage() {
  const { data: activeCampaignIds, isLoading } = useActiveCampaigns()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter campaign IDs based on search (simplified)
  const filteredCampaignIds = useMemo(() => {
    if (!Array.isArray(activeCampaignIds)) return []
    return activeCampaignIds
  }, [activeCampaignIds])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b-8 border-black bg-white">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black">
              <ArrowLeft className="h-6 w-6" />
              BACK TO MAP
            </Link>
            <Link
              href="/create-campaign"
              className="bg-red-600 text-white border-4 border-black px-6 py-3 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              CREATE CAMPAIGN
            </Link>
          </div>
        </div>
      </nav>

      <main className="container py-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase">ALL CAMPAIGNS</h1>
            <p className="text-xl font-mono">Browse active advertising campaigns on the network</p>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white border-8 border-black p-6 shadow-brutal">
              <div className="space-y-2">
                <div className="text-3xl font-black">
                  {isLoading ? '...' : (Array.isArray(activeCampaignIds) ? activeCampaignIds.length : 0)}
                </div>
                <div className="text-sm font-mono uppercase">Active Campaigns</div>
              </div>
            </div>
            <div className="bg-blue-600 text-white border-8 border-black p-6 shadow-brutal">
              <div className="space-y-2">
                <div className="text-3xl font-black">Live</div>
                <div className="text-sm font-mono uppercase">Real-time Data</div>
              </div>
            </div>
            <div className="bg-yellow-500 border-8 border-black p-6 shadow-brutal">
              <div className="space-y-2">
                <div className="text-3xl font-black">On-Chain</div>
                <div className="text-sm font-mono uppercase">Verified</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white border-8 border-black p-6 shadow-brutal">
            <div className="flex items-center gap-4">
              <Search className="h-6 w-6" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-4 border-black h-12 text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600"
              />
            </div>
          </div>

          {/* Campaigns List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border-8 border-black p-8 shadow-brutal animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-16 bg-gray-300 rounded"></div>
                      <div className="h-16 bg-gray-300 rounded"></div>
                      <div className="h-16 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCampaignIds.length === 0 ? (
              <div className="bg-white border-8 border-black p-12 shadow-brutal text-center">
                <div className="space-y-4">
                  <div className="text-6xl">📢</div>
                  <h3 className="text-2xl font-black uppercase">No Active Campaigns</h3>
                  <p className="text-lg font-mono">Be the first to create a campaign!</p>
                  <Link
                    href="/create-campaign"
                    className="bg-red-600 text-white border-4 border-black px-8 py-4 font-bold text-lg shadow-brutal hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    CREATE FIRST CAMPAIGN
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredCampaignIds.map((campaignId) => (
                  <div key={campaignId.toString()} className="bg-white border-8 border-black p-8 shadow-brutal">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black uppercase">Campaign #{campaignId.toString()}</h3>
                          <p className="font-mono text-lg">Campaign details will be loaded here...</p>
                        </div>
                        <span className="px-3 py-1 text-sm font-bold text-white border-2 border-black bg-green-500 uppercase">
                          ACTIVE
                        </span>
                      </div>
                      <div className="text-sm font-mono text-gray-600">
                        This is a placeholder for campaign data. In a full implementation,
                        individual campaign details would be fetched and displayed here.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
