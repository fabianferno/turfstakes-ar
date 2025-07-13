"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Eye, Coins, Globe, Smartphone } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Monument, } from "@/components/monuments"
import { CLUB_TOKENS } from "@/lib/contracts"
import { motion } from "framer-motion"

export default function TurfStakeHome() {
  // Sponsor logos for the monuments
  const sponsorLogos = [
    { id: 'binance', name: 'Binance', imageUrl: '/sponsors/binance.png', campaign: 'Trade with Binance - The world\'s leading crypto exchange!' },
    { id: 'nike', name: 'Nike', imageUrl: '/sponsors/nike.png', campaign: 'Just Do It - Premium sports gear and apparel!' },
    { id: 'qatar', name: 'Qatar', imageUrl: '/sponsors/qatar.png', campaign: 'Visit Qatar - Experience the beauty of the desert!' },
    { id: 'okx', name: 'OKX', imageUrl: '/sponsors/okx.png', campaign: 'OKX - Your gateway to the crypto world!' },
    { id: 'animoca', name: 'Animoca Brands', imageUrl: '/sponsors/animoca.png', campaign: 'Animoca Brands - Leading the way in Web3 gaming!' },
  ]

  // Ad campaigns for the text ticker
  const adCampaigns = [
    { id: '1', text: '🚀 Trade on Binance - Get 20% cashback on your first trade!', sponsor: 'Binance', color: '#F3BA2F' },
    { id: '2', text: '⚡ Nike x Football - New collection available now!', sponsor: 'Nike', color: '#FF6900' },
    { id: '3', text: '🏆 Qatar Airways - Fly to your next adventure!', sponsor: 'Qatar', color: '#5D1A35' },
    { id: '4', text: '🌟 OKX Crypto Exchange - Start your Web3 journey today!', sponsor: 'OKX', color: '#000000' },
    { id: '5', text: '🎮 Animoca Brands - Join the future of gaming!', sponsor: 'Animoca Brands', color: '#4A90E2' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-black relative overflow-hidden" style={{ backgroundImage: 'url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.1)_25%,rgba(0,212,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.1)_75%)] bg-[length:20px_20px]"></div>
        <div className="px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-6 w-full">
              <motion.div
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-6 bg-[#00D4FF] text-black font-black text-lg px-6 py-3 border-4 border-white shadow-[6px_6px_0px_0px_#ffffff] transform rotate-1">
                  <Coins className="w-5 h-5 mr-2" />
                  STAKE • BUILD • DOMINATE
                </Badge>
              </motion.div>

              {/* Mobile Layout - Original */}
              <div className="block md:hidden">
                <motion.h1
                  className="text-6xl font-black tracking-tighter leading-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <motion.span
                    className="block transform -skew-y-1"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    CLAIM THE
                  </motion.span>
                  <motion.span
                    className="block text-[#00D4FF] transform skew-y-1"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    WORLD
                  </motion.span>
                  <motion.span
                    className="block transform -skew-y-1"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    FOR YOUR
                  </motion.span>
                  <motion.span
                    className="block text-[#00D4FF] transform skew-y-1"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                  >
                    CLUB
                  </motion.span>
                </motion.h1>
              </div>

              {/* Desktop Layout - Split */}
              <div className="hidden md:block relative">
                <div className="flex items-center justify-between max-w-7xl mx-auto relative min-h-[300px] lg:min-h-[400px]">
                  {/* Left Side - "CLAIM THE WORLD" */}
                  <motion.div
                    className="flex-1 text-left"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-none">
                      <motion.span
                        className="block transform -skew-y-1"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      >
                        CLAIM THE
                      </motion.span>
                      <motion.span
                        className="block text-[#00D4FF] transform skew-y-1"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                      >
                        WORLD
                      </motion.span>
                    </h1>
                  </motion.div>

                  {/* Animated Slanting Line */}
                  <motion.div
                    className="absolute left-1/2 top-0 bottom-0 flex items-center justify-center transform -translate-x-1/2"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.9 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-2 h-64 lg:h-80 bg-[#00D4FF] transform rotate-12 origin-center"
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(0, 212, 255, 0.5)",
                            "0 0 40px rgba(0, 212, 255, 0.8)",
                            "0 0 20px rgba(0, 212, 255, 0.5)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                      <motion.div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"
                        animate={{
                          y: [0, 240, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Right Side - "FOR YOUR CLUB" */}
                  <motion.div
                    className="flex-1 text-right"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-none">
                      <motion.span
                        className="block transform -skew-y-1"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                      >
                        FOR YOUR
                      </motion.span>
                      <motion.span
                        className="block text-[#00D4FF] transform skew-y-1"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                      >
                        CLUB
                      </motion.span>
                    </h1>
                  </motion.div>
                </div>
              </div>
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <p className="text-xl md:text-2xl font-bold text-gray-300 leading-tight border-l-8 border-[#00D4FF] pl-6 text-left">
                  stake tokens to build evolving AR monuments for their favorite clubs in real-world locations - collect rewards

                  "turf wars meet pokemon go"
                </p>
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <Link href="/map">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    size="lg"
                    className="bg-[#00D4FF] hover:bg-[#00B8E6] text-black font-black text-xl px-12 py-6 border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all"
                  >
                    EXPLORE MAP
                    <Globe className="ml-3 h-6 w-6" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/create">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-4 border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-black font-black text-xl px-12 py-6 shadow-[8px_8px_0px_0px_#00D4FF] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#00D4FF] transition-all bg-transparent"
                  >
                    CREATE MONUMENT
                    <Camera className="ml-3 h-6 w-6" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 md:py-32 bg-[#00D4FF] text-black">
        <div className="px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 transform -skew-x-2">
              HOW IT WORKS
            </h2>
            <div className="w-48 h-3 bg-black mx-auto transform skew-x-12 mb-6"></div>
            <p className="text-xl md:text-2xl font-bold max-w-4xl mx-auto">
              STAKE TOKENS, BUILD MONUMENTS, EARN REWARDS, AND DOMINATE THE REAL WORLD
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-4">
            {[
              {
                icon: MapPin,
                title: "FIND LOCATION",
                desc: "SCOUT REAL-WORLD LOCATIONS AND CLAIM TERRITORY FOR YOUR CLUB",
                action: "EXPLORE MAP",
                href: "/map",
              },
              {
                icon: Camera,
                title: "CREATE ANCHOR",
                desc: "CAPTURE AN IMMOVABLE OBJECT TO ANCHOR YOUR AR MONUMENT",
                action: "CREATE NOW",
                href: "/create",
              },
              {
                icon: Coins,
                title: "STAKE TOKENS",
                desc: "STAKE CHILIZ FAN TOKENS TO LEVEL UP YOUR MONUMENT (1-5)",
                action: "STAKE TOKENS",
                href: "/monument/1",
              },
              {
                icon: Eye,
                title: "VIEW IN AR",
                desc: "EXPERIENCE YOUR MONUMENT IN AUGMENTED REALITY AT THE LOCATION",
                action: "AR VIEWER",
                href: "/ar-viewer",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_#000000] transition-all"
              >
                <CardContent className="p-8 text-center">
                  <feature.icon className="h-16 w-16 mx-auto mb-6 text-[#00D4FF]" />
                  <h3 className="text-2xl font-black mb-4 transform -skew-x-1">{feature.title}</h3>
                  <p className="font-bold mb-6 text-lg leading-tight text-gray-300">{feature.desc}</p>
                  <Link href={feature.href}>
                    <Button className="bg-[#00D4FF] hover:bg-[#00B8E6] text-black font-black border-2 border-white">
                      {feature.action}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Monument Levels */}
      <section className="w-full py-20 md:py-32 bg-black">
        <div className=" px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 transform skew-x-2">
              MONUMENT EVOLUTION
            </h2>
            <div className="w-48 h-3 bg-[#00D4FF] mx-auto transform -skew-x-12 mb-6"></div>
            <p className="text-xl md:text-2xl font-bold text-gray-300 max-w-4xl mx-auto">
              STAKE MORE TOKENS TO EVOLVE YOUR MONUMENT FROM LEVEL 1 TO 5
            </p>
            <div className="mt-8">
              <Link href="/demo">
                <Button className="bg-[#00D4FF] text-black font-black border-4 border-white px-8 py-4 text-lg shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 transition-all">
                  EXPLORE 3D MONUMENTS
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-5">
            {[
              { level: 1, tokens: "1K", height: "h-[300px]", desc: "BASIC SHRINE" },
              { level: 2, tokens: "5K", height: "h-[300px]", desc: "STONE PILLAR" },
              { level: 3, tokens: "15K", height: "h-[300px]", desc: "BRONZE STATUE" },
              { level: 4, tokens: "50K", height: "h-[300px]", desc: "GOLDEN MONUMENT" },
              { level: 5, tokens: "100K", height: "h-[300px]", desc: "LEGENDARY TEMPLE" },
            ].map((monumentLevel, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 transform hover:scale-105 transition-all">
                  <div className={`${monumentLevel.height} w-full bg-gray-900 rounded-lg border-4 border-white overflow-hidden shadow-[4px_4px_0px_0px_#00D4FF]`}>
                    <Canvas

                      camera={{ position: [0, 2, 6], fov: 60 }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {/* Monument component */}
                      <Suspense fallback={null}>
                        <Monument
                          clubLogo={CLUB_TOKENS[0].tokenImage}
                          clubColor="#68d4fc"
                          clubName={CLUB_TOKENS[0].name}
                          level={monumentLevel.level}
                          position={[0, -3, -8]}
                          scale={[0.8, 0.8, 0.8]}
                          isAR={false}
                        // sponsorLogos={sponsorLogos}
                        // adCampaigns={adCampaigns}
                        />
                      </Suspense>

                      <ambientLight intensity={0.4} />
                      <directionalLight position={[5, 5, 5]} intensity={0.6} />
                      <OrbitControls
                        enableZoom={true}
                        enablePan={true}
                        enableRotate={true}
                      />
                    </Canvas>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#00D4FF]">LEVEL {monumentLevel.level}</h3>
                  <p className="font-black text-white">{monumentLevel.tokens} TOKENS</p>
                  <p className="font-bold text-gray-400 text-sm">{monumentLevel.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="w-full py-20 md:py-32 bg-white text-black">
        <div className="px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="bg-[#00D4FF] text-black border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 transition-all">
              <CardContent className="p-8 text-center">
                <Globe className="h-16 w-16 mx-auto mb-6" />
                <h3 className="text-2xl font-black mb-4">EXPLORE WORLD MAP</h3>
                <p className="font-bold mb-6">DISCOVER MONUMENTS WORLDWIDE AND FIND THE PERFECT SPOT FOR YOUR CLUB</p>
                <Link href="/map">
                  <Button className="bg-black text-white font-black border-2 border-black hover:bg-gray-800">
                    VIEW MAP
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 transition-all">
              <CardContent className="p-8 text-center">
                <Camera className="h-16 w-16 mx-auto mb-6 text-[#00D4FF]" />
                <h3 className="text-2xl font-black mb-4">CREATE MONUMENT</h3>
                <p className="font-bold mb-6 text-gray-300">
                  CLAIM YOUR TERRITORY AND BUILD A MONUMENT FOR YOUR FAVORITE CLUB
                </p>
                <Link href="/create">
                  <Button className="bg-[#00D4FF] text-black font-black border-2 border-white">CREATE NOW</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-[#00D4FF] text-black border-4 border-black shadow-[8px_8px_0px_0px_#000000] transform hover:translate-x-2 hover:translate-y-2 transition-all">
              <CardContent className="p-8 text-center">
                <Smartphone className="h-16 w-16 mx-auto mb-6" />
                <h3 className="text-2xl font-black mb-4">AR EXPERIENCE</h3>
                <p className="font-bold mb-6">VIEW MONUMENTS IN AUGMENTED REALITY WHEN YOU'RE NEAR THEM</p>
                <Link href="/ar-viewer">
                  <Button className="bg-black text-white font-black border-2 border-black hover:bg-gray-800">
                    OPEN AR
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
