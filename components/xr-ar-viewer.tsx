"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { XR, createXRStore, XROrigin } from '@react-three/xr'
import { OrbitControls, Environment } from '@react-three/drei'
import { Monument } from './monuments'
import { CLUB_TOKENS } from '@/lib/contracts'
import * as THREE from 'three'
import { Suspense, forwardRef, memo } from 'react'
import { Mesh } from 'three'

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

// Hit test tracking
const hitTestPosition = { x: 0, y: 0, z: 0, hasHit: false }

// XR Store with depth sensing and hit testing
const store = createXRStore({
    depthSensing: true,
    hand: false,
    hitTest: true
})

// Simple Reticle component
const Reticle = memo(() => {
    const ref = useRef<Mesh>(null)

    useFrame(() => {
        if (ref.current) {
            if (hitTestPosition.hasHit) {
                ref.current.visible = true
                ref.current.position.set(hitTestPosition.x, hitTestPosition.y, hitTestPosition.z)
            } else {
                ref.current.visible = false
            }
        }
    })

    return (
        <mesh ref={ref} visible={false} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[0.1, 0.15, 32]} />
            <meshBasicMaterial color="#68d4fc" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
    )
})

// Simplified Hit test setup component
const HitTestSetup = () => {
    const hitTestSourceRef = useRef<any>(null)
    const initializingRef = useRef(false)

    useFrame(({ gl }) => {
        const session = gl.xr.getSession()
        if (!session) return

        const frame = gl.xr.getFrame()
        if (!frame) return

        const referenceSpace = gl.xr.getReferenceSpace()
        if (!referenceSpace) return

        // Initialize hit test source
        if (!hitTestSourceRef.current && !initializingRef.current && session?.requestHitTestSource) {
            initializingRef.current = true
            if (referenceSpace) {
                session?.requestHitTestSource({ space: referenceSpace })
                    .then((source) => {
                        hitTestSourceRef.current = source
                        console.log('Hit test source initialized')
                    })
                    .catch((error) => {
                        console.error('Failed to initialize hit test source:', error)
                        // Fallback: always show reticle at center
                        hitTestPosition.x = 0
                        hitTestPosition.y = 0
                        hitTestPosition.z = -1
                        hitTestPosition.hasHit = true
                    })
            }
        }

        // Perform hit test
        if (hitTestSourceRef.current) {
            try {
                const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current)
                if (hitTestResults.length > 0) {
                    const hit = hitTestResults[0]
                    const pose = hit.getPose(referenceSpace)
                    if (pose?.transform?.matrix) {
                        const matrix = new THREE.Matrix4()
                        matrix.fromArray(pose.transform.matrix)
                        const position = new THREE.Vector3()
                        position.setFromMatrixPosition(matrix)

                        hitTestPosition.x = position.x
                        hitTestPosition.y = position.y
                        hitTestPosition.z = position.z
                        hitTestPosition.hasHit = true
                    }
                } else {
                    hitTestPosition.hasHit = false
                }
            } catch (error) {
                console.error('Hit test error:', error)
                hitTestPosition.hasHit = false
            }
        } else {
            // Show reticle at default position while initializing
            hitTestPosition.x = 0
            hitTestPosition.y = 0
            hitTestPosition.z = -1
            hitTestPosition.hasHit = true
        }
    })

    return null
}

// AR Monument Component with simplified positioning
const ARMonument: React.FC<{
    monument: NonNullable<XRARViewerProps['selectedMonument']>
}> = ({ monument }) => {
    const monumentRef = useRef<THREE.Group>(null)
    const [isPlaced, setIsPlaced] = useState(false)

    // Find club token data
    const clubToken = CLUB_TOKENS.find(token =>
        token.name.toLowerCase().includes(monument.club.toLowerCase().split(' ')[0])
    )

    // Auto-place monument when hit test detects surface
    useFrame(() => {
        if (monumentRef.current && hitTestPosition.hasHit && !isPlaced) {
            monumentRef.current.position.set(
                hitTestPosition.x,
                hitTestPosition.y,
                hitTestPosition.z
            )
            setIsPlaced(true)
        }
    })

    return (
        <group>
            {/* Hit test setup */}
            <HitTestSetup />

            {/* Reticle for surface detection - moved outside monument group */}
            {!isPlaced && <Reticle />}

            {/* Monument group */}
            <group ref={monumentRef} visible={isPlaced}>
                <Suspense fallback={null}>
                    <Monument
                        clubLogo={clubToken?.tokenImage || '/placeholder-logo.png'}
                        clubColor={monument.clubColor}
                        clubName={monument.club}
                        level={monument.level}
                        position={[0, 0, 0]}
                        scale={[0.1, 0.1, 0.1]}
                        isAR={true}
                    />
                </Suspense>

                {/* AR Lighting */}
                <directionalLight position={[1, 8, 1]} castShadow />
                <ambientLight intensity={0.4} />

                {/* Shadow plane */}
                <mesh receiveShadow rotation-x={-Math.PI / 2} scale={10} position={[0, -0.1, 0]}>
                    <shadowMaterial opacity={0.3} />
                    <planeGeometry />
                </mesh>
            </group>

            {/* XR Origin */}
            <XROrigin position={[0, 0, 0]} />
        </group>
    )
}

export const XRARViewer: React.FC<XRARViewerProps> = ({
    selectedMonument,
    anchorImage,
    onARStateChange
}) => {
    const [isXRSupported, setIsXRSupported] = useState(false)

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
        // Reset hit test when component unmounts or monument changes
        return () => {
            hitTestPosition.hasHit = false
        }
    }, [selectedMonument])

    const enterAR = async () => {
        try {
            // Reset placement state
            hitTestPosition.hasHit = false
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
                    background: '#68d4fc',
                    borderRadius: '0.5rem',
                    border: '4px solid white',
                    fontWeight: 'bold',
                    color: 'black',
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

            <Canvas shadows camera={{ position: [4, 0, 6], fov: 35, near: 0.01, far: 1000 }} style={{ width: '100%', height: '100%' }}>
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