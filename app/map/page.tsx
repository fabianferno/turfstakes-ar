"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Filter, Trophy, Users, Coins, Eye, Navigation, TrendingUp } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Dynamic import to avoid SSR issues
const OpenMap = dynamic(() => import("@/components/mapbox-map"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-800 flex items-center justify-center">Loading map...</div>
})

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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Get user location only on client side
    if (typeof window !== 'undefined' && navigator.geolocation) {
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
        name: "Monument #1",
        club: "FCB",
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
        name: "Monument #2",
        club: "JUV",
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
        name: "Monument #3",
        club: "ACM",
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
        name: "Monument #4",
        club: "MCF",
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
        name: "Monument #5",
        club: "LFC",
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

  // Don't render location-dependent content on server
  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden" style={{ backgroundImage: 'url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.1)_25%,rgba(0,212,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.1)_75%)] bg-[length:20px_20px]"></div>
        <main className="flex-1 p-6 relative z-10">
          <div className="container mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 transform -skew-x-2">Vist and grow your club's monuments</h1>
              <div className="w-32 h-3 bg-[#00D4FF] transform skew-x-12 mb-4"></div>
              <p className="text-xl font-bold text-gray-300">DISCOVER MONUMENTS WORLDWIDE AND CLAIM YOUR TERRITORY</p>
            </div>
            <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
              Loading...
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden" style={{ backgroundImage: 'url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.1)_25%,rgba(0,212,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.1)_75%)] bg-[length:20px_20px]"></div>
      <main className="flex-1 p-6 relative z-10">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 transform -skew-x-2">Claim the world for your club</h1>
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
                className="pl-10 py-5 bg-white text-black border-4 border-[#00D4FF] font-black"
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

          {/* MAP SECTION */}
          <div className="mb-12">
            {/* Current Location */}
            {userLocation && (
              <Card className="mb-6 bg-[#00D4FF] text-black border-4 border-white shadow-[8px_8px_0px_0px_#ffffff]">
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

            {/* Interactive Map */}
            <Card className="bg-gray-900 border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
              <CardContent className="p-0">
                <div className="relative">
                  <OpenMap monuments={filteredMonuments} userLocation={userLocation} />
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-[#00D4FF] text-black font-black border-2 border-black text-lg px-4 py-2">
                      MAP GOES HERE
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MONUMENT LIST SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black transform skew-x-2">LIST MONUMENTS HERE</h2>
              <Badge className="bg-[#00D4FF] text-black font-black border-2 border-black text-lg px-4 py-2">
                {filteredMonuments.length} MONUMENTS
              </Badge>
            </div>

            <div className="grid gap-6">
              {filteredMonuments.map((monument) => (
                <Card
                  key={monument.id}
                  className="bg-white text-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF] hover:shadow-[4px_4px_0px_0px_#00D4FF] transition-all duration-200 transform hover:translate-x-1 hover:translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-4 h-8 transform skew-x-12"
                          style={{ backgroundColor: monument.clubColor }}
                        ></div>
                        <div>
                          <h3 className="text-xl font-black">{monument.name}</h3>
                          <p className="font-bold text-gray-600">{monument.club}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#00D4FF] text-black font-black border-2 border-black">
                          #{monument.ranking}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-2 border-black font-black"
                          style={{ backgroundColor: monument.clubColor, color: "white" }}
                        >
                          LEVEL {monument.level}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded border-2 border-black">
                        <Coins className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-sm font-bold text-gray-600">STAKED</p>
                          <p className="font-black">{monument.totalStaked.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded border-2 border-black">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-bold text-gray-600">FANS</p>
                          <p className="font-black">{monument.fans}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded border-2 border-black">
                        <MapPin className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-sm font-bold text-gray-600">DISTANCE</p>
                          <p className="font-black">{monument.distance} KM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded border-2 border-black">
                        <Trophy className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-bold text-gray-600">RANKING</p>
                          <p className="font-black">#{monument.ranking}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/monument/${monument.id}`} className="flex-1">
                        <Button className="w-full bg-black text-white font-black border-2 border-black hover:bg-gray-800">
                          <Eye className="mr-2 h-4 w-4" />
                          VIEW DETAILS
                        </Button>
                      </Link>
                      <Link href={`/ar-viewer?monumentId=${monument.id}`}>
                        <Button className="bg-[#00D4FF] text-black font-black border-2 border-black hover:bg-blue-400">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          AR VIEW
                        </Button>
                      </Link>
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
