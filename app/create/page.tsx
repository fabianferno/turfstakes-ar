"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Camera, Upload, CheckCircle, AlertTriangle, Navigation, Target, Coins } from "lucide-react"
import Link from "next/link"

export default function CreateMonumentPage() {
  const [step, setStep] = useState(1)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [anchorImage, setAnchorImage] = useState<string | null>(null)
  const [monumentName, setMonumentName] = useState("")
  const [selectedClub, setSelectedClub] = useState("")
  const [isCapturing, setIsCapturing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const clubs = [
    { name: "FC Barcelona", color: "#A50044", token: "BAR" },
    { name: "Manchester United", color: "#DA020E", token: "MUN" },
    { name: "Liverpool FC", color: "#C8102E", token: "LIV" },
    { name: "Chelsea FC", color: "#034694", token: "CHE" },
    { name: "Arsenal FC", color: "#EF0107", token: "ARS" },
    { name: "Real Madrid", color: "#FEBE10", token: "RMA" },
  ]

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

  const createMonument = () => {
    // Simulate monument creation
    console.log("Creating monument:", {
      name: monumentName,
      club: selectedClub,
      location,
      anchorImage,
    })
    setStep(4)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">


      <main className="flex-1 p-6">
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
                      disabled={!location}
                      className="bg-[#00D4FF] text-black font-black text-xl px-12 py-6 border-4 border-black disabled:opacity-50"
                    >
                      CONFIRM LOCATION
                      <Target className="ml-3 h-6 w-6" />
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
                    <h2 className="text-3xl font-black mb-4">STEP 3: MONUMENT DETAILS</h2>
                    <p className="font-bold text-gray-600 mb-6">NAME YOUR MONUMENT AND SELECT YOUR CLUB</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-black text-lg mb-2">MONUMENT NAME</label>
                      <Input
                        value={monumentName}
                        onChange={(e) => setMonumentName(e.target.value)}
                        placeholder="ENTER MONUMENT NAME..."
                        className="bg-white text-black border-4 border-[#00D4FF] font-black text-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-lg mb-2">SELECT YOUR CLUB</label>
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
                                <div className="text-sm">{club.token} TOKEN</div>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={createMonument}
                      disabled={!monumentName || !selectedClub}
                      className="bg-[#00D4FF] text-black font-black text-xl px-12 py-6 border-4 border-black disabled:opacity-50"
                    >
                      CREATE MONUMENT
                      <Coins className="ml-3 h-6 w-6" />
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
                      YOUR MONUMENT "{monumentName}" HAS BEEN SUCCESSFULLY CREATED
                    </p>
                  </div>

                  <Card className="bg-[#00D4FF] text-black border-4 border-black">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-black mb-4">MONUMENT DETAILS</h3>
                      <div className="grid gap-2 text-left">
                        <p>
                          <span className="font-black">NAME:</span> {monumentName}
                        </p>
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
