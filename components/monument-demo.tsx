"use client"

import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Monument } from './monuments'
import { CLUB_TOKENS } from '@/lib/contracts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { XRARViewer } from './xr-ar-viewer'

export const MonumentDemo: React.FC = () => {
    const [selectedLevel, setSelectedLevel] = useState(1)
    const [selectedClub, setSelectedClub] = useState(0)
    const [isARView, setIsARView] = useState(false)

    const currentClub = CLUB_TOKENS[selectedClub]

    const currentMonument = {
        id: 1,
        name: `${currentClub.name} Monument`,
        club: currentClub.name,
        level: selectedLevel,
        distance: 0,
        clubColor: "#68d4fc"
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="bg-black border-4 border-[#00D4FF] shadow-[8px_8px_0px_0px_#00D4FF]">
                <CardHeader>
                    <CardTitle className="text-2xl font-black text-white text-center">
                        TurfStake Tryout
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section className='flex md:flex-row flex-col gap-4'>
                        <div className='flex flex-col gap-4 w-full'>
                            {/* Level Selection */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-black text-white">MONUMENT LEVEL</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <Button
                                            key={level}
                                            onClick={() => setSelectedLevel(level)}
                                            className={`font-black border-2 ${selectedLevel === level
                                                ? 'bg-[#00D4FF] text-black border-white'
                                                : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                                                }`}
                                        >
                                            #{level}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Club Selection */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-black text-white">CLUB</h3>
                                <div className="flex flex-wrap gap-2">
                                    {CLUB_TOKENS.map((club, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => setSelectedClub(index)}
                                            className={`font-black border-2 ${selectedClub === index
                                                ? 'bg-[#00D4FF] text-black border-white'
                                                : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                                                }`}
                                        >
                                            {club.tokenSymbol}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* AR View Toggle */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-black text-white">VIEW MODE</h3>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setIsARView(false)}
                                        className={`font-black border-2 ${!isARView
                                            ? 'bg-[#00D4FF] text-black border-white'
                                            : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                                            }`}
                                    >
                                        3D VIEW
                                    </Button>
                                    <Button
                                        onClick={() => setIsARView(true)}
                                        className={`font-black border-2 ${isARView
                                            ? 'bg-[#00D4FF] text-black border-white'
                                            : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                                            }`}
                                    >
                                        VIEW IN AR
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 max-w-3xl p-10 items-center justify-center gap-5 flex rounded border-2 border-[#00D4FF] w-full">
                            <div className="flex items-center gap-4">
                                <img
                                    src={currentClub.tokenImage}
                                    alt={currentClub.name}
                                    width={200}
                                    height={200}
                                    className="rounded-full border-2 border-white"
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white">{currentClub.name}</h4>
                                <p className="text-gray-300 font-bold">{currentClub.tokenSymbol}</p>
                                <Badge className="mt-2 bg-[#00D4FF] text-black font-black">
                                    LEVEL {selectedLevel}
                                </Badge>
                            </div>
                        </div>
                    </section>



                    {/* 3D Monument Viewer */}
                    <div className="w-full h-96 bg-gray-900 rounded-lg border-4 border-[#00D4FF] overflow-hidden relative">
                        {!isARView ? (
                            <Canvas
                                camera={{ position: [0, 2, 8], fov: 60 }}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <Monument
                                    clubLogo={currentClub.tokenImage}
                                    clubColor="#68d4fc"
                                    clubName={currentClub.name}
                                    level={selectedLevel}
                                    position={[0, 0, 0]}
                                    scale={[1, 1, 1]}
                                    isAR={false}
                                />

                                {/* Environment lighting */}
                                <ambientLight intensity={0.4} />
                                <directionalLight position={[10, 10, 5]} intensity={1} />
                                <pointLight position={[-10, 0, -10]} intensity={0.5} color="#0099ff" />
                                <pointLight position={[10, 0, 10]} intensity={0.5} color="#ff9900" />

                                <OrbitControls
                                    enablePan={true}
                                    enableZoom={true}
                                    enableRotate={true}
                                    autoRotate={true}
                                    autoRotateSpeed={0.5}
                                />
                            </Canvas>
                        ) : (
                            <div className="w-full h-full">
                                <XRARViewer
                                    selectedMonument={currentMonument}
                                    onARStateChange={(isActive) => console.log('AR Active:', isActive)}
                                />

                                {/* AR Instructions Overlay */}
                                <div className="absolute top-4 left-4 right-4 bg-[#00D4FF] text-black p-3 rounded border-2 border-white">
                                    <h4 className="font-black text-sm mb-2">AR INSTRUCTIONS:</h4>
                                    <ul className="font-bold text-xs space-y-1">
                                        <li>• Click "ENTER AR" to start AR experience</li>
                                        <li>• Point your device at the ground/table</li>
                                        <li>• The monument will appear in your space</li>
                                        <li>• Walk around to see different angles</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Monument Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 p-3 rounded border border-[#00D4FF]">
                            <div className="text-[#00D4FF] font-black text-sm">LEVEL</div>
                            <div className="text-white font-black text-xl">{selectedLevel}</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded border border-[#00D4FF]">
                            <div className="text-[#00D4FF] font-black text-sm">COMPLEXITY</div>
                            <div className="text-white font-black text-xl">
                                {selectedLevel === 1 ? 'SIMPLE' :
                                    selectedLevel === 2 ? 'BASIC' :
                                        selectedLevel === 3 ? 'INTER' :
                                            selectedLevel === 4 ? 'ADVANCED' : 'LEGEND'}
                            </div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded border border-[#00D4FF]">
                            <div className="text-[#00D4FF] font-black text-sm">ELEMENTS</div>
                            <div className="text-white font-black text-xl">
                                {selectedLevel === 1 ? '5' :
                                    selectedLevel === 2 ? '8' :
                                        selectedLevel === 3 ? '12' :
                                            selectedLevel === 4 ? '16' : '20+'}
                            </div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded border border-[#00D4FF]">
                            <div className="text-[#00D4FF] font-black text-sm">RARITY</div>
                            <div className="text-white font-black text-xl">
                                {selectedLevel === 1 ? 'COMMON' :
                                    selectedLevel === 2 ? 'UNCOMMON' :
                                        selectedLevel === 3 ? 'RARE' :
                                            selectedLevel === 4 ? 'EPIC' : 'LEGENDARY'}
                            </div>
                        </div>
                    </div>

                    {/* Controls Info */}
                    <div className="bg-[#00D4FF] text-black p-4 rounded border-2 border-white">
                        <h4 className="font-black mb-2">{isARView ? 'AR VIEWER CONTROLS:' : '3D VIEWER CONTROLS:'}</h4>
                        <ul className="font-bold text-sm space-y-1">
                            {!isARView ? (
                                <>
                                    <li>• CLICK & DRAG: Rotate view</li>
                                    <li>• SCROLL: Zoom in/out</li>
                                    <li>• AUTO-ROTATE: Enabled</li>
                                    <li>• REALTIME 3D: WebGL rendering</li>
                                </>
                            ) : (
                                <>
                                    <li>• REQUIRES: WebXR compatible device/browser</li>
                                    <li>• BUTTON: Click "ENTER AR" to start</li>
                                    <li>• PLACEMENT: Point at ground/table surface</li>
                                    <li>• MOVEMENT: Walk around to see different angles</li>
                                </>
                            )}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default MonumentDemo 