"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore, XROrigin } from '@react-three/xr'
import { OrbitControls, Environment } from '@react-three/drei'
import { Monument } from './monuments'
import { CLUB_TOKENS } from '@/lib/contracts'
import * as THREE from 'three'
import { Suspense } from 'react'

interface XRARViewerProps {
    selectedMonument?: {
        id: number
        name: string
        club: string
        level: number
        distance: number
        clubColor: string
    }
    anchorImage?: string
    onARStateChange?: (isActive: boolean) => void
}

// XR Store with depth sensing
const store = createXRStore({ depthSensing: true, hand: false })

// AR Monument Component
const ARMonument: React.FC<{
    monument: NonNullable<XRARViewerProps['selectedMonument']>
}> = ({ monument }) => {
    // Find club token data
    const clubToken = CLUB_TOKENS.find(token =>
        token.tokenSymbol.toLowerCase().includes(monument.club.toLowerCase())
    )

    return (
        <group position={[0, -0.75, 0]}>
            <Suspense fallback={null}>
                <Monument
                    clubLogo={clubToken?.tokenImage || '/placeholder-logo.png'}
                    clubColor={monument.clubColor}
                    clubName={monument.club}
                    level={monument.level}
                    position={[0, 0, 0]}
                    scale={[0.3, 0.3, 0.3]} // Smaller scale for AR
                    isAR={true}
                />
            </Suspense>

            {/* AR Lighting */}
            <directionalLight position={[1, 8, 1]} castShadow />
            <ambientLight intensity={0.4} />

            {/* Shadow plane */}
            <mesh receiveShadow rotation-x={-Math.PI / 2} scale={100}>
                <shadowMaterial opacity={0.3} />
                <planeGeometry />
            </mesh>

            {/* XR Origin for positioning */}
            <group position={[0, 0, 2.6]}>
                <XROrigin />
            </group>
        </group>
    )
}



export const XRARViewer: React.FC<XRARViewerProps> = ({
    selectedMonument,
    anchorImage,
    onARStateChange
}) => {
    const [isXRSupported, setIsXRSupported] = useState(false)
    const [isARActive, setIsARActive] = useState(false)

    useEffect(() => {
        // Check XR support
        if (typeof navigator !== 'undefined' && 'xr' in navigator) {
            navigator.xr?.isSessionSupported('immersive-ar').then(supported => {
                setIsXRSupported(supported)
            }).catch(() => {
                setIsXRSupported(false)
            })
        }
    }, [])

    useEffect(() => {
        // Listen to XR state changes
        const handleXRStateChange = (state: any) => {
            const active = state.session !== null
            setIsARActive(active)
            onARStateChange?.(active)
        }

        store.subscribe(handleXRStateChange)

        return () => {
            // Cleanup subscription
        }
    }, [onARStateChange])

    const enterAR = async () => {
        try {
            await store.enterAR()
        } catch (error) {
            console.error('Failed to enter AR:', error)
        }
    }

    if (!selectedMonument) {
        return (
            <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-white font-bold">No monument selected</p>
            </div>
        )
    }

    return (
        <>
            {/* AR Enter Button */}
            <button
                style={{
                    position: 'absolute',
                    zIndex: 10000,
                    background: 'rgba(0, 212, 255, 0.5)',
                    borderRadius: '0.5rem',
                    border: '4px solid white',
                    fontWeight: 'bold',
                    color: 'white',
                    padding: '1rem 2rem',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    bottom: '1rem',
                    left: '50%',
                    boxShadow: '0px 0px 20px rgba(0,0,0,0.5)',
                    transform: 'translate(-50%, 0)',
                }}
                onClick={enterAR}
                disabled={!isXRSupported}
            >
                {isXRSupported ? 'ENTER AR' : 'AR NOT SUPPORTED'}
            </button>

            <Canvas shadows camera={{ position: [4, 0, 6], fov: 35 }} style={{ width: '100%', height: '300px' }}>
                <XR store={store}>
                    <ARMonument monument={selectedMonument} />
                    <OrbitControls />
                    <Suspense fallback={null}>
                        <Environment preset="dawn" blur={1} />
                    </Suspense>
                </XR>
            </Canvas>
        </>
    )
}

export default XRARViewer 