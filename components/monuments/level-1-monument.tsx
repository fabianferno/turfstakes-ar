"use client"

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MonumentProps, useMonumentTexture, RotatingLogo3D, MonumentFloor, MonumentSpotlights, SponsorDisplay, MONUMENT_CONFIGS } from './base-monument'
import * as THREE from 'three'

export const Level1Monument: React.FC<MonumentProps> = ({
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
    const config = MONUMENT_CONFIGS[1]

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
            {/* Sponsor Display */}
            <SponsorDisplay position={[0, 0.5, 5]} scale={0.8} />

            {/* Monument Floor */}
            <MonumentFloor radius={config.floorRadius} clubColor={clubColor} />

            {/* Rotating Logo Display */}
            <RotatingLogo3D
                logoTexture={logoTexture}
                clubColor={clubColor}
                clubName={clubName}
                scale={1}
                height={config.logoHeight}
            />

            {/* Monument Spotlights */}
            <MonumentSpotlights clubColor={clubColor} intensity={1.5} />

            {/* Ambient lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[0, 10, 5]} intensity={0.8} />
        </group>
    )
} 