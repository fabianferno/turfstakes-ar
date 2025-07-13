"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MonumentProps, useMonumentTexture, RotatingLogo3D, MonumentFloor, MonumentSpotlights, MONUMENT_CONFIGS } from './base-monument'
import * as THREE from 'three'

export const Level2Monument: React.FC<MonumentProps> = ({
    clubLogo,
    clubColor,
    clubName,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    isAR = false
}) => {
    const meshRef = useRef<THREE.Group>(null)
    const logoTexture = useMonumentTexture(clubLogo)
    const config = MONUMENT_CONFIGS[2]

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle floating animation for AR
            if (isAR) {
                meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05
            }
        }
    })

    return (
        <group ref={meshRef} position={position} scale={scale} rotation={rotation}>
            {/* Monument Floor */}
            <MonumentFloor radius={config.floorRadius} clubColor={clubColor} />

            {/* Rotating Logo Display */}
            <RotatingLogo3D
                logoTexture={logoTexture}
                clubColor={clubColor}
                clubName={clubName}
                scale={1.1}
                height={config.logoHeight}
            />

            {/* Additional architectural elements for level 2 */}
            <group position={[0, 1, 0]}>
                {/* Decorative pillars */}
                {Array.from({ length: 4 }, (_, i) => (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(i * Math.PI / 2) * 2.5,
                            0,
                            Math.sin(i * Math.PI / 2) * 2.5
                        ]}
                    >
                        <cylinderGeometry args={[0.15, 0.15, 2, 8]} />
                        <meshStandardMaterial
                            color="#68d4fc"
                            emissive="#68d4fc"
                            emissiveIntensity={0.2}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>
                ))}
            </group>

            {/* Monument Spotlights */}
            <MonumentSpotlights clubColor={clubColor} intensity={1.7} />

            {/* Ambient lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[0, 10, 5]} intensity={0.8} />
        </group>
    )
} 