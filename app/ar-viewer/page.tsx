"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Eye,
  Zap,
  Navigation,
  Target,
  Coins,
} from "lucide-react"
import Link from "next/link"
import { XRARViewer } from "@/components/xr-ar-viewer"

interface NearbyMonument {
  id: number
  name: string
  club: string
  level: number
  distance: number
  clubColor: string
}

export default function ARViewerPage() {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null)
  const [isARActive, setIsARActive] = useState(false)
  const [nearbyMonuments, setNearbyMonuments] = useState<NearbyMonument[]>([])
  const [selectedMonument, setSelectedMonument] = useState<NearbyMonument | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Check WebXR support
    if ("xr" in navigator) {
      navigator.xr // @ts-ignore
        ?.isSessionSupported("immersive-ar") // @ts-ignore
        .then((supported) => {
          setIsARSupported(supported)
        })
        .catch(() => {
          setIsARSupported(false)
        })
    } else {
      setIsARSupported(false)
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }

    // Mock nearby monuments
    const mockNearbyMonuments: NearbyMonument[] = [
      {
        id: 1,
        name: "Monument #1",
        club: "FCB",
        level: 5,
        distance: 0.05, // 50 meters
        clubColor: "#A50044",
      },
      {
        id: 2,
        name: "Monument #2",
        club: "JUV",
        level: 2,
        distance: 0.12, // 120 meters
        clubColor: "#DA020E",
      },
    ]
    setNearbyMonuments(mockNearbyMonuments)
  }, [])



  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden" style={{ backgroundImage: 'url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.1)_25%,rgba(0,212,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.1)_75%)] bg-[length:20px_20px]"></div>
      <main className="flex-1 p-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 transform -skew-x-2">AR VIEWER</h1>
            <div className="w-32 h-3 bg-[#00D4FF] mx-auto transform skew-x-12 mb-4"></div>
            <p className="text-xl font-bold text-gray-300">EXPERIENCE MONUMENTS IN AUGMENTED REALITY</p>
          </div>

          {/* AR Support Check */}
          <Card
            className={`mb-8 border-4 shadow-[8px_8px_0px_0px_#ffffff] ${isARSupported === null ? "bg-gray-500" : isARSupported ? "bg-green-600" : "bg-red-600"
              }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {isARSupported === null && (
                  <>
                    <Smartphone className="h-8 w-8 text-white" />
                    <div>
                      <h3 className="text-xl font-black text-white">CHECKING AR SUPPORT...</h3>
                      <p className="font-bold text-gray-200">DETECTING WEBXR CAPABILITIES</p>
                    </div>
                  </>
                )}
                {isARSupported === true && (
                  <>
                    <CheckCircle className="h-8 w-8 text-white" />
                    <div>
                      <h3 className="text-xl font-black text-white">AR SUPPORTED!</h3>
                      <p className="font-bold text-gray-200">YOUR DEVICE SUPPORTS WEBXR AR</p>
                    </div>
                  </>
                )}
                {isARSupported === false && (
                  <>
                    <AlertTriangle className="h-8 w-8 text-white" />
                    <div>
                      <h3 className="text-xl font-black text-white">AR NOT SUPPORTED</h3>
                      <p className="font-bold text-gray-200">USING CAMERA FALLBACK MODE</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

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
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nearby Monuments */}
          <Card className="mb-8 bg-white text-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
            <CardContent className="p-6">
              <h3 className="text-2xl font-black mb-4">NEARBY MONUMENTS</h3>
              <div className="space-y-4">
                {nearbyMonuments.map((monument) => (
                  <div
                    key={monument.id}
                    className={`p-4 border-4 border-black cursor-pointer transition-all ${selectedMonument?.id === monument.id ? "bg-[#00D4FF] text-black" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    onClick={() => setSelectedMonument(monument)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-lg">{monument.name}</h4>
                        <p className="font-bold">{monument.club}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="font-black text-white" style={{ backgroundColor: monument.clubColor }}>
                            LEVEL {monument.level}
                          </Badge>
                          <span className="font-bold text-sm">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            {(monument.distance * 1000).toFixed(0)}m away
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm">{monument.distance < 0.1 ? "IN RANGE" : "TOO FAR"}</p>
                        <div
                          className={`w-4 h-4 rounded-full ${monument.distance < 0.1 ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AR Viewer */}
          <Card className="bg-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
            <CardContent className="p-6">
              {!selectedMonument ? (
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <Eye className="h-24 w-24 mx-auto text-[#00D4FF]" />
                    <h3 className="text-3xl font-black text-white">START AR EXPERIENCE</h3>
                    <p className="font-bold text-gray-300">
                      SELECT A NEARBY MONUMENT TO VIEW IN AR
                    </p>
                  </div>
                </div>
              ) : selectedMonument.distance >= 0.1 ? (
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <Eye className="h-24 w-24 mx-auto text-[#00D4FF]" />
                    <h3 className="text-3xl font-black text-white">GET CLOSER TO MONUMENT</h3>
                    <div className="bg-yellow-100 border-4 border-yellow-500 p-4 text-black">
                      <p className="font-black">⚠️ GET CLOSER TO THE MONUMENT TO VIEW IN AR</p>
                      <p className="font-bold">
                        YOU NEED TO BE WITHIN 100M ({(selectedMonument.distance * 1000).toFixed(0)}M AWAY)
                      </p>
                    </div>
                    <Link href="/map">
                      <Button className="bg-white text-black font-black border-4 border-black">
                        <MapPin className="mr-2 h-5 w-5" />
                        NAVIGATE TO MONUMENT
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white text-center mb-4">
                    AR MONUMENT VIEWER
                  </h3>

                  {/* XR AR Viewer Component */}
                  <div className="relative">
                    <XRARViewer
                      selectedMonument={selectedMonument}
                      anchorImage="/default-anchor.png"
                      onARStateChange={(isActive) => setIsARActive(isActive)}
                    />
                  </div>

                  {/* Monument Actions */}
                  <div className="flex gap-4">
                    <Link href={`/monument/${selectedMonument?.id}`} className="flex-1">
                      <Button className="w-full bg-[#00D4FF] text-black font-black border-4 border-white">
                        <Zap className="mr-2 h-5 w-5" />
                        STAKE TOKENS
                      </Button>
                    </Link>
                  </div>

                  {/* AR Instructions */}
                  <div className="bg-[#00D4FF] text-black p-4 border-4 border-white">
                    <h4 className="font-black mb-2">AR INSTRUCTIONS:</h4>
                    <ul className="font-bold text-sm space-y-1">
                      <li>• POINT CAMERA AT THE ANCHOR OBJECT</li>
                      <li>• MOVE SLOWLY FOR BETTER TRACKING</li>
                      <li>• USE GOOD LIGHTING CONDITIONS</li>
                      <li>• MONUMENT WILL APPEAR WHEN ANCHOR IS DETECTED</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* WebXR Info */}
          <Card className="mt-8 bg-gray-900 text-white border-4 border-gray-600">
            <CardContent className="p-6">
              <h3 className="text-xl font-black mb-4">WEBXR AR TECHNOLOGY</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-black text-[#00D4FF] mb-2">FEATURES:</h4>
                  <ul className="font-bold text-sm space-y-1">
                    <li>• REAL-TIME ANCHOR TRACKING</li>
                    <li>• 3D MONUMENT RENDERING</li>
                    <li>• SPATIAL AUDIO SUPPORT</li>
                    <li>• CROSS-PLATFORM COMPATIBILITY</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-black text-[#00D4FF] mb-2">REQUIREMENTS:</h4>
                  <ul className="font-bold text-sm space-y-1">
                    <li>• WEBXR COMPATIBLE BROWSER</li>
                    <li>• CAMERA PERMISSIONS</li>
                    <li>• STABLE INTERNET CONNECTION</li>
                    <li>• GOOD LIGHTING CONDITIONS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
