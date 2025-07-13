"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Camera, Upload, CheckCircle, AlertTriangle, Navigation, Target, Coins, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAccount } from "wagmi"
import { useCreateMonument } from "@/hooks/use-create-monument"
import { useClubs } from "@/hooks/use-clubs"
import { useToast } from "@/hooks/use-toast"
import ConnectWallet from "@/components/connect-wallet"

export default function CreateMonumentPage() {
  const [step, setStep] = useState(1)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [anchorImage, setAnchorImage] = useState<string | null>(null)

  const [selectedClub, setSelectedClub] = useState("")
  const [isCapturing, setIsCapturing] = useState(false)
  const [createdMonumentId, setCreatedMonumentId] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { address, isConnected } = useAccount()
  const { clubs, isLoading: clubsLoading } = useClubs()
  const { createMonument, checkCoordinates, isUploading, isPending, isConfirming, isSuccess, error, coordinatesUsed, checkingCoordinates } = useCreateMonument()
  const { toast } = useToast()

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }, [])

  // Check coordinates when location changes
  useEffect(() => {
    if (location) {
      checkCoordinates(location.lat, location.lng)
    }
  }, [location, checkCoordinates])

  // Handle successful monument creation
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Monument Created Successfully! 🎉",
        description: `Your monument for ${selectedClub} has been created.`,
      })
      setStep(4)
    }
  }, [isSuccess, selectedClub, toast])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error Creating Monument",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const startCamera = async () => {
    try {
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsCapturing(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setAnchorImage(imageData)

        // Stop camera
        const stream = video.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
        setIsCapturing(false)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAnchorImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateMonument = async () => {
    if (!location || !anchorImage || !selectedClub) {
      toast({
        title: "Missing Information",
        description: "Please ensure all fields are filled out.",
        variant: "destructive",
      })
      return
    }

    try {
      await createMonument({
        clubName: selectedClub,
        latitude: location.lat,
        longitude: location.lng,
        anchorImageData: anchorImage,
      })
    } catch (error) {
      console.error("Error creating monument:", error)
    }
  }

  // Show wallet connection if not connected
  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden" style={{ backgroundImage: 'url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.1)_25%,rgba(0,212,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.1)_75%)] bg-[length:20px_20px]"></div>
        <main className="flex-1 p-6 flex items-center justify-center relative z-10">
          <Card className="bg-white text-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF] max-w-md">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-[#00D4FF] border-4 border-black transform rotate-3 flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000000]">
                  <span className="text-black font-black text-3xl transform -rotate-3">T</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-4">CONNECT WALLET</h2>
                  <p className="font-bold text-gray-600 mb-6">
                    CONNECT YOUR WALLET TO CREATE MONUMENTS
                  </p>
                </div>
                <ConnectWallet />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden" style={{ backgroundImage: 'url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.1)_25%,rgba(0,212,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.1)_75%)] bg-[length:20px_20px]"></div>
      <main className="flex-1 p-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 transform -skew-x-2">
              CREATE MONUMENT
            </h1>
            <div className="w-32 h-3 bg-[#00D4FF] mx-auto transform skew-x-12 mb-4"></div>
            <p className="text-xl font-bold text-gray-300">CLAIM YOUR TERRITORY AND BUILD A MONUMENT FOR YOUR CLUB</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-12 h-12 border-4 border-white flex items-center justify-center font-black text-xl transform rotate-3 ${step >= stepNum ? "bg-[#00D4FF] text-black" : "bg-black text-white"
                      }`}
                  >
                    {step > stepNum ? <CheckCircle className="h-6 w-6" /> : stepNum}
                  </div>
                  {stepNum < 4 && <div className="w-8 h-1 bg-white mx-2"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="bg-white text-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-black mb-4">STEP 1: CONFIRM LOCATION</h2>
                    <p className="font-bold text-gray-600 mb-6">
                      MAKE SURE YOU'RE AT THE EXACT SPOT WHERE YOU WANT TO CREATE YOUR MONUMENT
                    </p>
                  </div>

                  {location ? (
                    <>
                      <Card className="bg-[#00D4FF] text-black border-4 border-black">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <Navigation className="h-8 w-8" />
                            <div>
                              <h3 className="text-xl font-black">CURRENT LOCATION</h3>
                              <p className="font-bold">LAT: {location.lat.toFixed(6)}</p>
                              <p className="font-bold">LNG: {location.lng.toFixed(6)}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 ml-auto text-green-600" />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Location Status */}
                      {checkingCoordinates ? (
                        <Card className="bg-yellow-100 text-black border-4 border-yellow-500">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
                              <div>
                                <h3 className="text-xl font-black">CHECKING LOCATION...</h3>
                                <p className="font-bold">VERIFYING COORDINATES</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : Boolean(coordinatesUsed) ? (
                        <Card className="bg-red-100 text-black border-4 border-red-500">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <AlertTriangle className="h-8 w-8 text-red-600" />
                              <div>
                                <h3 className="text-xl font-black">LOCATION ALREADY USED</h3>
                                <p className="font-bold">A MONUMENT ALREADY EXISTS HERE</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="bg-green-100 text-black border-4 border-green-500">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <CheckCircle className="h-8 w-8 text-green-600" />
                              <div>
                                <h3 className="text-xl font-black">LOCATION AVAILABLE</h3>
                                <p className="font-bold">YOU CAN CREATE A MONUMENT HERE</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    <Card className="bg-yellow-100 text-black border-4 border-yellow-500">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <AlertTriangle className="h-8 w-8 text-yellow-600" />
                          <div>
                            <h3 className="text-xl font-black">GETTING LOCATION...</h3>
                            <p className="font-bold">PLEASE ALLOW LOCATION ACCESS</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="text-center">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!location || checkingCoordinates || Boolean(coordinatesUsed)}
                      className="bg-[#00D4FF] text-black font-black text-xl px-12 py-6 border-4 border-black disabled:opacity-50"
                    >
                      {checkingCoordinates ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          CHECKING LOCATION...
                        </>
                      ) : Boolean(coordinatesUsed) ? (
                        <>
                          <AlertTriangle className="mr-3 h-6 w-6" />
                          LOCATION UNAVAILABLE
                        </>
                      ) : (
                        <>
                          CONFIRM LOCATION
                          <Target className="ml-3 h-6 w-6" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-black mb-4">STEP 2: CAPTURE ANCHOR</h2>
                    <p className="font-bold text-gray-600 mb-6">
                      CAPTURE AN IMMOVABLE OBJECT THAT WILL ANCHOR YOUR AR MONUMENT
                    </p>
                    <div className="bg-yellow-100 border-4 border-yellow-500 p-4 mb-6">
                      <p className="font-black text-yellow-800">
                        ⚠️ CHOOSE A PERMANENT OBJECT LIKE A STATUE, BUILDING, OR LANDMARK
                      </p>
                    </div>
                  </div>

                  {!anchorImage && !isCapturing && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Button
                        onClick={startCamera}
                        className="bg-[#00D4FF] text-black font-black text-xl py-8 border-4 border-black"
                      >
                        <Camera className="mr-3 h-8 w-8" />
                        CAPTURE WITH CAMERA
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-black text-white font-black text-xl py-8 border-4 border-black"
                      >
                        <Upload className="mr-3 h-8 w-8" />
                        UPLOAD IMAGE
                      </Button>
                    </div>
                  )}

                  {isCapturing && (
                    <div className="space-y-4">
                      <video ref={videoRef} autoPlay playsInline className="w-full border-4 border-[#00D4FF]" />
                      <div className="text-center">
                        <Button
                          onClick={captureImage}
                          className="bg-[#00D4FF] text-black font-black text-xl px-12 py-6 border-4 border-black"
                        >
                          CAPTURE ANCHOR
                        </Button>
                      </div>
                    </div>
                  )}

                  {anchorImage && (
                    <div className="space-y-4">
                      <img
                        src={anchorImage || "/placeholder.svg"}
                        alt="Anchor"
                        className="w-full border-4 border-[#00D4FF]"
                      />
                      <div className="flex gap-4">
                        <Button
                          onClick={() => setAnchorImage(null)}
                          className="flex-1 bg-gray-500 text-white font-black border-4 border-black"
                        >
                          RETAKE
                        </Button>
                        <Button
                          onClick={() => setStep(3)}
                          className="flex-1 bg-[#00D4FF] text-black font-black border-4 border-black"
                        >
                          USE THIS ANCHOR
                        </Button>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-black mb-4">STEP 3: SELECT YOUR CLUB</h2>
                    <p className="font-bold text-gray-600 mb-6">CHOOSE WHICH CLUB THIS MONUMENT REPRESENTS</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-black text-lg mb-2">SELECT YOUR CLUB</label>
                      {clubsLoading ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="ml-2 font-black">LOADING CLUBS...</span>
                        </div>
                      ) : clubs.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          {clubs.map((club) => (
                            <Button
                              key={club.name}
                              onClick={() => setSelectedClub(club.name)}
                              className={`p-4 border-4 border-black font-black text-left ${selectedClub === club.name
                                ? "bg-[#00D4FF] text-black"
                                : "bg-white text-black hover:bg-gray-100"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-6 h-6 border-2 border-black"
                                  style={{ backgroundColor: club.color }}
                                ></div>
                                <div>
                                  <div className="font-black">{club.name}</div>
                                  <div className="text-sm">{club.tokenSymbol} TOKEN</div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-8 bg-yellow-100 border-4 border-yellow-500 rounded">
                          <p className="font-black text-yellow-800">NO CLUBS REGISTERED YET</p>
                          <p className="text-yellow-700">Clubs need to be registered in the contract first</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleCreateMonument}
                      disabled={!selectedClub || isUploading || isPending || isConfirming}
                      className="bg-[#00D4FF] text-black font-black text-xl px-12 py-6 border-4 border-black disabled:opacity-50"
                    >
                      {isUploading || isPending || isConfirming ? (
                        <>
                          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                          {isUploading ? "UPLOADING..." : isPending ? "CONFIRM TX..." : "CREATING..."}
                        </>
                      ) : (
                        <>
                          CREATE MONUMENT
                          <Coins className="ml-3 h-6 w-6" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 text-center">
                  <div className="space-y-4">
                    <CheckCircle className="h-24 w-24 mx-auto text-green-600" />
                    <h2 className="text-3xl font-black">MONUMENT CREATED!</h2>
                    <p className="font-bold text-gray-600">
                      YOUR MONUMENT FOR {selectedClub} HAS BEEN SUCCESSFULLY CREATED
                    </p>
                  </div>

                  <Card className="bg-[#00D4FF] text-black border-4 border-black">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-black mb-4">MONUMENT DETAILS</h3>
                      <div className="grid gap-2 text-left">
                        <p>
                          <span className="font-black">CLUB:</span> {selectedClub}
                        </p>
                        <p>
                          <span className="font-black">LEVEL:</span> 1 (0 TOKENS STAKED)
                        </p>
                        <p>
                          <span className="font-black">LOCATION:</span> {location?.lat.toFixed(4)},{" "}
                          {location?.lng.toFixed(4)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Link href="/map" className="flex-1">
                      <Button className="w-full bg-black text-white font-black border-4 border-black">
                        VIEW ON MAP
                      </Button>
                    </Link>
                    <Link href="/ar-viewer" className="flex-1">
                      <Button className="w-full bg-[#00D4FF] text-black font-black border-4 border-black">
                        VIEW IN AR
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
