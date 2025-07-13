"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Coins, TrendingUp, MapPin, Eye, Zap, Crown, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

interface Monument {
  id: number
  name: string
  club: string
  level: number
  totalStaked: number
  fans: number
  lat: number
  lng: number
  clubColor: string
  ranking: number
  createdDate: string
  weeklyGrowth: number
  adRevenue: number
  yourStake: number
}

interface Fan {
  id: number
  name: string
  stake: number
  joinDate: string
  rank: number
}

export default function MonumentStatsPage({ params }: { params: { id: string } }) {
  const [monument, setMonument] = useState<Monument | null>(null)
  const [fans, setFans] = useState<Fan[]>([])
  const [stakeAmount, setStakeAmount] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Mock monument data
    const mockMonument: Monument = {
      id: Number.parseInt(params.id),
      name: "Monument #1",
      club: "JUV",
      level: 5,
      totalStaked: 125000,
      fans: 1250,
      lat: 41.3809,
      lng: 2.1228,
      clubColor: "#A50044",
      ranking: 1,
      createdDate: "2024-01-15",
      weeklyGrowth: 12.5,
      adRevenue: 2450,
      yourStake: 5000,
    }
    setMonument(mockMonument)

    // Mock fans leaderboard
    const mockFans: Fan[] = [
      { id: 1, name: "CuleFan2024", stake: 15000, joinDate: "2024-01-15", rank: 1 },
      { id: 2, name: "BarcaLegend", stake: 12500, joinDate: "2024-01-20", rank: 2 },
      { id: 3, name: "MessiForever", stake: 10000, joinDate: "2024-02-01", rank: 3 },
      { id: 4, name: "BlauGrana", stake: 8500, joinDate: "2024-02-10", rank: 4 },
      { id: 5, name: "CampNouKing", stake: 7200, joinDate: "2024-02-15", rank: 5 },
    ]
    setFans(mockFans)
  }, [params.id])

  const handleStake = () => {
    if (monument && stakeAmount) {
      const amount = Number.parseInt(stakeAmount)
      setMonument({
        ...monument,
        totalStaked: monument.totalStaked + amount,
        yourStake: monument.yourStake + amount,
      })
      setStakeAmount("")
      alert(`Successfully staked ${amount} tokens!`)
    }
  }

  if (!monument) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black text-xl">LOADING MONUMENT...</p>
        </div>
      </div>
    )
  }

  const nextLevelTokens = monument.level < 5 ? (monument.level + 1) * 25000 : null
  const tokensToNextLevel = nextLevelTokens ? nextLevelTokens - monument.totalStaked : 0

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">


      <main className="flex-1 p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Monument Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge className="bg-black text-white font-black border-4 border-[#00D4FF]">
                #{monument.ranking} GLOBAL
              </Badge>
              <Badge
                className="font-black text-white border-4 border-white"
                style={{ backgroundColor: monument.clubColor }}
              >
                LEVEL {monument.level}
              </Badge>
              {monument.level === 5 && (
                <Badge className="bg-yellow-500 text-black font-black border-4 border-white">
                  <Crown className="w-4 h-4 mr-1" />
                  MAX LEVEL
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 transform -skew-x-2">
              {monument.name}
            </h1>
            <div className="w-32 h-3 bg-[#00D4FF] transform skew-x-12 mb-4"></div>
            <p className="text-xl font-bold text-gray-300">
              {monument.club} • Created {new Date(monument.createdDate).toLocaleDateString()}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-[#00D4FF] text-black border-4 border-white shadow-[8px_8px_0px_0px_#ffffff]">
              <CardContent className="p-6 text-center">
                <Coins className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-black">{monument.totalStaked.toLocaleString()}</h3>
                <p className="font-bold">TOTAL STAKED</p>
              </CardContent>
            </Card>

            <Card className="bg-white text-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-[#00D4FF]" />
                <h3 className="text-2xl font-black">{monument.fans}</h3>
                <p className="font-bold">FANS</p>
              </CardContent>
            </Card>

            <Card className="bg-green-600 text-white border-4 border-white shadow-[8px_8px_0px_0px_#ffffff]">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-black">+{monument.weeklyGrowth}%</h3>
                <p className="font-bold">WEEKLY GROWTH</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500 text-black border-4 border-white shadow-[8px_8px_0px_0px_#ffffff]">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-black">${monument.adRevenue}</h3>
                <p className="font-bold">AD REVENUE</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            {[
              { id: "overview", label: "OVERVIEW" },
              { id: "leaderboard", label: "LEADERBOARD" },
              { id: "stake", label: "STAKE TOKENS" },
              { id: "rewards", label: "REWARDS" },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-black border-4 border-black ${activeTab === tab.id ? "bg-[#00D4FF] text-black" : "bg-white text-black hover:bg-gray-100"
                  }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Monument Level Progress */}
              <Card className="bg-white text-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-black mb-6">MONUMENT EVOLUTION</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div key={level} className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 border-4 border-black flex items-center justify-center font-black ${monument.level >= level ? "bg-[#00D4FF] text-black" : "bg-gray-200 text-gray-500"
                            }`}
                        >
                          {level}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-black">LEVEL {level}</span>
                            <span className="font-bold">{level * 25000} TOKENS</span>
                          </div>
                          <div className="w-full bg-gray-200 h-3 border-2 border-black">
                            <div
                              className={`h-full ${monument.level >= level ? "bg-[#00D4FF]" : "bg-gray-300"}`}
                              style={{
                                width:
                                  monument.level >= level
                                    ? "100%"
                                    : monument.level === level - 1
                                      ? `${(monument.totalStaked / (level * 25000)) * 100}%`
                                      : "0%",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {tokensToNextLevel > 0 && (
                    <div className="mt-6 p-4 bg-[#00D4FF] border-4 border-black">
                      <p className="font-black">
                        {tokensToNextLevel.toLocaleString()} TOKENS NEEDED FOR LEVEL {monument.level + 1}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location & Actions */}
              <Card className="bg-black text-white border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-black mb-6">MONUMENT LOCATION</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-[#00D4FF]" />
                      <span className="font-bold">LAT: {monument.lat.toFixed(6)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-[#00D4FF]" />
                      <span className="font-bold">LNG: {monument.lng.toFixed(6)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-[#00D4FF]" />
                      <span className="font-bold">CREATED: {new Date(monument.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <Link href="/ar-viewer">
                      <Button className="w-full bg-[#00D4FF] text-black font-black text-lg py-4 border-4 border-white">
                        <Eye className="mr-2 h-6 w-6" />
                        VIEW IN AR
                      </Button>
                    </Link>
                    <Link href="/map">
                      <Button className="w-full bg-white text-black font-black text-lg py-4 border-4 border-white">
                        <MapPin className="mr-2 h-6 w-6" />
                        VIEW ON MAP
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "leaderboard" && (
            <Card className="bg-white text-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
              <CardContent className="p-6">
                <h3 className="text-2xl font-black mb-6">FAN LEADERBOARD</h3>
                <div className="space-y-4">
                  {fans.map((fan, index) => (
                    <div
                      key={fan.id}
                      className={`p-4 border-4 border-black flex items-center justify-between ${index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-300"
                          : index === 2
                            ? "bg-orange-400"
                            : "bg-gray-100"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white border-4 border-white flex items-center justify-center font-black text-xl">
                          {fan.rank}
                        </div>
                        <div>
                          <h4 className="font-black text-lg">{fan.name}</h4>
                          <p className="font-bold text-sm">JOINED: {new Date(fan.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl">{fan.stake.toLocaleString()}</p>
                        <p className="font-bold text-sm">TOKENS STAKED</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "stake" && (
            <Card className="bg-white text-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
              <CardContent className="p-6">
                <h3 className="text-2xl font-black mb-6">STAKE TOKENS</h3>
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="space-y-6">
                    <div>
                      <label className="block font-black text-lg mb-2">AMOUNT TO STAKE</label>
                      <Input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="ENTER TOKEN AMOUNT..."
                        className="bg-white text-black border-4 border-[#00D4FF] font-black text-lg"
                      />
                    </div>

                    <div className="grid gap-2 grid-cols-3">
                      {[1000, 5000, 10000].map((amount) => (
                        <Button
                          key={amount}
                          onClick={() => setStakeAmount(amount.toString())}
                          className="bg-[#00D4FF] text-black font-black border-2 border-black"
                        >
                          {amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>

                    <Button
                      onClick={handleStake}
                      disabled={!stakeAmount || Number.parseInt(stakeAmount) <= 0}
                      className="w-full bg-black text-white font-black text-xl py-6 border-4 border-black disabled:opacity-50"
                    >
                      <Zap className="mr-2 h-6 w-6" />
                      STAKE TOKENS
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Card className="bg-[#00D4FF] text-black border-4 border-black">
                      <CardContent className="p-4">
                        <h4 className="font-black mb-2">YOUR CURRENT STAKE</h4>
                        <p className="text-2xl font-black">{monument.yourStake.toLocaleString()} TOKENS</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-600 text-white border-4 border-black">
                      <CardContent className="p-4">
                        <h4 className="font-black mb-2">ESTIMATED REWARDS</h4>
                        <p className="text-xl font-black">$12.50 / WEEK</p>
                        <p className="font-bold text-sm">BASED ON AD REVENUE SHARE</p>
                      </CardContent>
                    </Card>

                    <div className="bg-yellow-100 border-4 border-yellow-500 p-4">
                      <h4 className="font-black text-yellow-800 mb-2">STAKING BENEFITS:</h4>
                      <ul className="font-bold text-yellow-800 text-sm space-y-1">
                        <li>• EARN FROM AD REVENUE</li>
                        <li>• UNLOCK EXCLUSIVE MERCH</li>
                        <li>• GET DISCOUNT NFTS</li>
                        <li>• VOTING RIGHTS ON UPGRADES</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "rewards" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="bg-green-600 text-white border-4 border-white shadow-[8px_8px_0px_0px_#ffffff]">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-black mb-6">AD REVENUE EARNINGS</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">THIS WEEK:</span>
                      <span className="font-black text-2xl">$12.50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">THIS MONTH:</span>
                      <span className="font-black text-2xl">$48.75</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">TOTAL EARNED:</span>
                      <span className="font-black text-2xl">$156.25</span>
                    </div>
                    <Button className="w-full bg-white text-black font-black border-4 border-black mt-4">
                      CLAIM REWARDS
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#00D4FF] text-black border-4 border-white shadow-[8px_8px_0px_0px_#ffffff]">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-black mb-6">UNLOCKED REWARDS</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white border-4 border-black">
                      <h4 className="font-black">EXCLUSIVE JERSEY NFT</h4>
                      <p className="font-bold text-sm">UNLOCKED AT 5,000 TOKENS</p>
                      <Badge className="bg-green-600 text-white font-black mt-2">CLAIMED</Badge>
                    </div>
                    <div className="p-4 bg-white border-4 border-black">
                      <h4 className="font-black">STADIUM TOUR DISCOUNT</h4>
                      <p className="font-bold text-sm">25% OFF - UNLOCKED AT 10,000 TOKENS</p>
                      <Badge className="bg-yellow-500 text-black font-black mt-2">AVAILABLE</Badge>
                    </div>
                    <div className="p-4 bg-gray-200 border-4 border-gray-400">
                      <h4 className="font-black text-gray-600">VIP MATCH TICKETS</h4>
                      <p className="font-bold text-sm text-gray-600">UNLOCK AT 25,000 TOKENS</p>
                      <Badge className="bg-gray-400 text-white font-black mt-2">LOCKED</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
