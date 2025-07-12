"use client"

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { MapPin, Trophy, Users, Coins } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

interface OpenMapProps {
    monuments: Monument[]
    userLocation?: { lat: number; lng: number } | null
}

// Custom hook to update map center
function MapUpdater({ userLocation }: { userLocation?: { lat: number; lng: number } | null }) {
    const map = useMap()

    useEffect(() => {
        if (userLocation) {
            map.setView([userLocation.lat, userLocation.lng], 10)
        }
    }, [userLocation, map])

    return null
}

// Custom user location marker
function UserLocationMarker({ userLocation }: { userLocation?: { lat: number; lng: number } | null }) {
    if (!userLocation) return null

    const userIcon = L.divIcon({
        html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #00D4FF;
        border: 4px solid white;
        border-radius: 50%;
        animation: pulse 2s infinite;
        box-shadow: 0 0 10px rgba(0,212,255,0.5);
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
        className: 'user-location-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    })

    return (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
                <div className="text-black font-bold">
                    <h3 className="font-black text-sm">YOUR LOCATION</h3>
                    <p className="text-xs">LAT: {userLocation.lat.toFixed(4)}</p>
                    <p className="text-xs">LNG: {userLocation.lng.toFixed(4)}</p>
                </div>
            </Popup>
        </Marker>
    )
}

// Custom monument marker
function MonumentMarker({ monument }: { monument: Monument }) {
    const monumentIcon = L.divIcon({
        html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${monument.clubColor};
        border: 4px solid white;
        border-radius: 50%;
        position: relative;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      " 
      onmouseover="this.style.transform='scale(1.2)'"
      onmouseout="this.style.transform='scale(1)'"
      >
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          width: 16px;
          height: 16px;
          background-color: black;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        ">${monument.ranking}</div>
      </div>
    `,
        className: 'monument-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    })

    return (
        <Marker position={[monument.lat, monument.lng]} icon={monumentIcon}>
            <Popup className="custom-popup">
                <div className="bg-white text-black p-3 border-4 border-[#00D4FF] shadow-lg min-w-[200px]">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-black text-white font-black text-xs">#{monument.ranking}</Badge>
                            <Badge
                                className="font-black text-white text-xs"
                                style={{ backgroundColor: monument.clubColor }}
                            >
                                L{monument.level}
                            </Badge>
                        </div>

                        <div>
                            <h3 className="font-black text-sm">{monument.name}</h3>
                            <p className="font-bold text-xs text-gray-600">{monument.club}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Coins className="h-3 w-3 text-[#00D4FF]" />
                                <span className="font-black text-xs">{monument.totalStaked.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-3 w-3 text-[#00D4FF]" />
                                <span className="font-black text-xs">{monument.fans} FANS</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3 text-[#00D4FF]" />
                                <span className="font-black text-xs">{monument.distance}km away</span>
                            </div>
                        </div>

                        <div className="flex gap-1">
                            <Link href={`/monument/${monument.id}`}>
                                <Button size="sm" className="bg-[#00D4FF] text-black font-black text-xs px-2 py-1 h-6">
                                    <Trophy className="mr-1 h-3 w-3" />
                                    VIEW
                                </Button>
                            </Link>
                            <Link href="/ar-viewer">
                                <Button size="sm" className="bg-black text-white font-black text-xs px-2 py-1 h-6">
                                    AR
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Popup>
        </Marker>
    )
}

export default function OpenMap({ monuments, userLocation }: OpenMapProps) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return (
            <div className="h-96 w-full border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF] overflow-hidden">
                <div className="h-full bg-gray-800 border-4 border-gray-600 flex items-center justify-center">
                    <div className="text-center">
                        <MapPin className="h-16 w-16 mx-auto mb-4 text-[#00D4FF] animate-pulse" />
                        <h3 className="text-2xl font-black text-white mb-2">LOADING MAP...</h3>
                        <p className="font-bold text-gray-400">INITIALIZING OPEN MAP</p>
                    </div>
                </div>
            </div>
        )
    }

    const defaultCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [41.3809, 2.1228] // Default to Barcelona

    return (
        <div className="h-96 w-full border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF] overflow-hidden">
            <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          background: #1a1a1a;
        }
        
        /* Custom tile layer styling for dark theme */
        .leaflet-tile {
          filter: brightness(0.8) contrast(1.2) saturate(0.8) hue-rotate(180deg) invert(1);
        }
        
        /* Custom popup styling */
        .leaflet-popup-content-wrapper {
          background: white;
          border: 4px solid #00D4FF;
          border-radius: 0;
          box-shadow: 4px 4px 0px 0px #00D4FF;
          padding: 0;
        }
        
        .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .leaflet-popup-tip {
          background: #00D4FF;
          border: 2px solid white;
        }
        
        /* Custom control styling */
        .leaflet-control-zoom a {
          background: #00D4FF;
          border: 2px solid white;
          color: black;
          font-weight: bold;
        }
        
        .leaflet-control-zoom a:hover {
          background: white;
          color: #00D4FF;
        }
        
        .leaflet-control-attribution {
          background: rgba(0, 212, 255, 0.8);
          color: black;
          font-weight: bold;
        }
      `}</style>

            <MapContainer
                center={defaultCenter}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                attributionControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater userLocation={userLocation} />
                <UserLocationMarker userLocation={userLocation} />

                {monuments.map((monument) => (
                    <MonumentMarker key={monument.id} monument={monument} />
                ))}
            </MapContainer>
        </div>
    )
} 