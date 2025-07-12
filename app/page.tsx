import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Eye, Coins, Globe, Smartphone } from "lucide-react"
import Link from "next/link"

export default function TurfStakeHome() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,212,255,0.1)_25%,rgba(0,212,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,212,255,0.1)_75%)] bg-[length:20px_20px]"></div>
        <div className="px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-6 w-full">
              <div className="inline-block">
                <Badge className="mb-6 bg-[#00D4FF] text-black font-black text-lg px-6 py-3 border-4 border-white shadow-[6px_6px_0px_0px_#ffffff] transform rotate-1">
                  <Coins className="w-5 h-5 mr-2" />
                  STAKE • BUILD • DOMINATE
                </Badge>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-none">
                <span className="block transform -skew-y-1">CLAIM THE</span>
                <span className="block text-[#00D4FF] transform skew-y-1">WORLD</span>
                <span className="block transform -skew-y-1">FOR YOUR</span>
                <span className="block text-[#00D4FF] transform skew-y-1">CLUB</span>
              </h1>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl font-bold text-gray-300 leading-tight border-l-8 border-[#00D4FF] pl-6 text-left">
                  STAKE CHILIZ FAN TOKENS TO BUILD EVOLVING AR MONUMENTS AT REAL LOCATIONS. EARN FROM ADS, UNLOCK
                  MERCH, AND TURN THE WORLD INTO YOUR TEAM'S TERRITORY.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/map">
                <Button
                  size="lg"
                  className="bg-[#00D4FF] hover:bg-[#00B8E6] text-black font-black text-xl px-12 py-6 border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all"
                >
                  EXPLORE MAP
                  <Globe className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/create">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-4 border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-black font-black text-xl px-12 py-6 shadow-[8px_8px_0px_0px_#00D4FF] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#00D4FF] transition-all bg-transparent"
                >
                  CREATE MONUMENT
                  <Camera className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
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
          </div>
          <div className="grid gap-6 lg:grid-cols-5">
            {[
              { level: 1, tokens: "1K", height: "h-16", desc: "BASIC SHRINE" },
              { level: 2, tokens: "5K", height: "h-20", desc: "STONE PILLAR" },
              { level: 3, tokens: "15K", height: "h-24", desc: "BRONZE STATUE" },
              { level: 4, tokens: "50K", height: "h-28", desc: "GOLDEN MONUMENT" },
              { level: 5, tokens: "100K", height: "h-32", desc: "LEGENDARY TEMPLE" },
            ].map((level, index) => (
              <div key={index} className="text-center">
                <div
                  className={`${level.height} w-16 bg-gradient-to-t from-[#00D4FF] to-white border-4 border-white mx-auto mb-4 transform hover:scale-110 transition-all shadow-[4px_4px_0px_0px_#ffffff]`}
                ></div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#00D4FF]">LEVEL {level.level}</h3>
                  <p className="font-black text-white">{level.tokens} TOKENS</p>
                  <p className="font-bold text-gray-400 text-sm">{level.desc}</p>
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
