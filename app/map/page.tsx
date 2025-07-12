"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Filter, Trophy, Users, Coins, Eye, Navigation, TrendingUp } from "lucide-react"
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
  distance: number
  clubColor: string
  ranking: number
}

export default function MapPage() {
  const [monuments, setMonuments] = useState<Monument[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClub, setSelectedClub] = useState("all")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }

    // Mock monument data
    const mockMonuments: Monument[] = [
      {
        id: 1,
        name: "Camp Nou Monument",
        club: "FC Barcelona",
        level: 5,
        totalStaked: 125000,
        fans: 1250,
        lat: 41.3809,
        lng: 2.1228,
        distance: 2.3,
        clubColor: "#A50044",
        ranking: 1,
      },
      {
        id: 2,
        name: "Old Trafford Shrine",
        club: "Manchester United",
        level: 4,
        totalStaked: 87500,
        fans: 892,
        lat: 53.4631,
        lng: -2.2914,
        distance: 5.7,
        clubColor: "#DA020E",
        ranking: 2,
      },
      {
        id: 3,
        name: "Anfield Memorial",
        club: "Liverpool FC",
        level: 3,
        totalStaked: 45000,
        fans: 567,
        lat: 53.4308,
        lng: -2.9609,
        distance: 8.1,
        clubColor: "#C8102E",
        ranking: 3,
      },
      {
        id: 4,
        name: "Stamford Bridge Tower",
        club: "Chelsea FC",
        level: 2,
        totalStaked: 23000,
        fans: 234,
        lat: 51.4816,
        lng: -0.1909,
        distance: 12.4,
        clubColor: "#034694",
        ranking: 4,
      },
      {
        id: 5,
        name: "Emirates Pillar",
        club: "Arsenal FC",
        level: 1,
        totalStaked: 8500,
        fans: 89,
        lat: 51.5549,
        lng: -0.1084,
        distance: 15.2,
        clubColor: "#EF0107",
        ranking: 5,
      },
    ]
    setMonuments(mockMonuments)
  }, [])

  const filteredMonuments = monuments.filter((monument) => {
    const matchesSearch =
      monument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monument.club.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClub = selectedClub === "all" || monument.club === selectedClub
    return matchesSearch && matchesClub
  })

  const clubs = Array.from(new Set(monuments.map((m) => m.club)))

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">


      <main className="flex-1 p-6">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 transform -skew-x-2">WORLD MAP</h1>
            <div className="w-32 h-3 bg-[#00D4FF] transform skew-x-12 mb-4"></div>
            <p className="text-xl font-bold text-gray-300">DISCOVER MONUMENTS WORLDWIDE AND CLAIM YOUR TERRITORY</p>
          </div>

          {/* Search and Filters */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="SEARCH MONUMENTS OR CLUBS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-black border-4 border-[#00D4FF] font-black"
              />
            </div>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="bg-white text-black border-4 border-[#00D4FF] font-black px-4 py-2 rounded"
            >
              <option value="all">ALL CLUBS</option>
              {clubs.map((club) => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
            <Button className="bg-[#00D4FF] text-black font-black border-4 border-white">
              <Filter className="mr-2 h-5 w-5" />
              FILTER
            </Button>
          </div>

          {/* Current Location */}
          {userLocation && (
            <Card className="mb-8 bg-[#00D4FF] text-black border-4 border-white shadow-[8px_8px_0px_0px_#ffffff]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Navigation className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-black">YOUR LOCATION</h3>
                    <p className="font-bold">
                      LAT: {userLocation.lat.toFixed(4)}, LNG: {userLocation.lng.toFixed(4)}
                    </p>
                  </div>
                  <Link href="/create" className="ml-auto">
                    <Button className="bg-black text-white font-black">CREATE MONUMENT HERE</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Map Placeholder */}
          <Card className="mb-8 bg-gray-900 border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
            <CardContent className="p-8">
              <div className="h-96 bg-gray-800 border-4 border-gray-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.1)_25%,rgba(0,212,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.1)_75%)] bg-[length:20px_20px]"></div>
                <div className="text-center z-10">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-[#00D4FF]" />
                  <h3 className="text-2xl font-black text-white mb-2">INTERACTIVE MAP</h3>
                  <p className="font-bold text-gray-400">WEBGL MAP INTEGRATION COMING SOON</p>
                </div>
                {/* Mock map pins */}
                {filteredMonuments.slice(0, 3).map((monument, index) => (
                  <div
                    key={monument.id}
                    className={`absolute w-6 h-6 bg-[${monument.clubColor}] border-2 border-white rounded-full transform hover:scale-150 transition-all cursor-pointer`}
                    style={{
                      left: `${20 + index * 25}%`,
                      top: `${30 + index * 15}%`,
                    }}
                    title={monument.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monument List */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black transform skew-x-2">MONUMENTS NEAR YOU ({filteredMonuments.length})</h2>
            <div className="grid gap-6">
              {filteredMonuments.map((monument) => (
                <Card
                  key={monument.id}
                  className="bg-white text-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF] transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#00D4FF] transition-all"
                >
                  <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-4 items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-black text-white font-black">#{monument.ranking}</Badge>
                          <Badge className="font-black text-white" style={{ backgroundColor: monument.clubColor }}>
                            LEVEL {monument.level}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-black">{monument.name}</h3>
                        <p className="font-bold text-gray-600">{monument.club}</p>
                        <p className="font-bold text-sm text-gray-500">
                          <MapPin className="inline h-4 w-4 mr-1" />
                          {monument.distance}km away
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-[#00D4FF]" />
                          <span className="font-black">{monument.totalStaked.toLocaleString()} TOKENS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-[#00D4FF]" />
                          <span className="font-black">{monument.fans} FANS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span className="font-black text-green-600">+12% THIS WEEK</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 h-4 border-2 border-black">
                          <div
                            className="h-full bg-[#00D4FF]"
                            style={{ width: `${(monument.level / 5) * 100}%` }}
                          ></div>
                        </div>
                        <p className="font-black text-sm">LEVEL {monument.level}/5</p>
                        <p className="font-bold text-xs text-gray-500">
                          {monument.level < 5
                            ? `${(monument.level + 1) * 25000 - monument.totalStaked} TOKENS TO NEXT LEVEL`
                            : "MAX LEVEL"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link href={`/monument/${monument.id}`}>
                          <Button className="w-full bg-[#00D4FF] text-black font-black border-2 border-black">
                            <Trophy className="mr-2 h-4 w-4" />
                            VIEW STATS
                          </Button>
                        </Link>
                        <Link href="/ar-viewer">
                          <Button className="w-full bg-black text-white font-black border-2 border-black">
                            <Eye className="mr-2 h-4 w-4" />
                            AR VIEW
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
